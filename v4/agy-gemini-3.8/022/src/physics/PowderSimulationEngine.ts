/**
 * POWDER-BOX (EXP-022) — Cellular Automata Physics & Thermodynamic Simulation Core
 * High-performance 2D granular, multi-phase fluid, gas, and reaction simulation.
 */

import { ElementType, SandboxMetrics } from '../types/index.js';
import {
  ELEMENT_IDS,
  ID_TO_ELEMENT,
  ELEMENT_DEFINITIONS,
} from './ElementRegistry.js';

export interface ReactionEvent {
  type: 'EXPLOSION' | 'HISS' | 'IGNITION' | 'ACID_CORRODE' | 'WATER_SPLASH';
  x: number;
  y: number;
  intensity: number;
}

export type ReactionCallback = (evt: ReactionEvent) => void;

export class PowderSimulationEngine {
  public readonly width: number;
  public readonly height: number;
  public readonly totalCells: number;

  // Discrete Grid Typed Arrays (Contiguous flat buffers for optimal cache locality)
  public elements: Uint8Array;
  public temperature: Float32Array;
  public life: Uint8Array;
  public updated: Uint8Array;
  private tempBuffer: Float32Array;

  private frameIndex: number = 0;
  private reactionCount: number = 0;
  private reactionCallback?: ReactionCallback;

  constructor(width: number = 240, height: number = 150) {
    this.width = width;
    this.height = height;
    this.totalCells = width * height;

    this.elements = new Uint8Array(this.totalCells);
    this.temperature = new Float32Array(this.totalCells);
    this.life = new Uint8Array(this.totalCells);
    this.updated = new Uint8Array(this.totalCells);
    this.tempBuffer = new Float32Array(this.totalCells);

    this.clear();
  }

  public setReactionCallback(cb: ReactionCallback): void {
    this.reactionCallback = cb;
  }

  public idx(x: number, y: number): number {
    return y * this.width + x;
  }

  public inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public clear(): void {
    const ambientTemp = 20.0;
    this.elements.fill(ELEMENT_IDS.EMPTY);
    this.temperature.fill(ambientTemp);
    this.life.fill(0);
    this.updated.fill(0);
    this.tempBuffer.fill(ambientTemp);
  }

  public getElement(x: number, y: number): ElementType {
    if (!this.inBounds(x, y)) return 'STONE'; // Solid boundary walls
    return ID_TO_ELEMENT[this.elements[this.idx(x, y)]] || 'EMPTY';
  }

  public getElementId(x: number, y: number): number {
    if (!this.inBounds(x, y)) return ELEMENT_IDS.STONE;
    return this.elements[this.idx(x, y)];
  }

  public setElement(
    x: number,
    y: number,
    type: ElementType,
    tempOverride?: number
  ): boolean {
    if (!this.inBounds(x, y)) return false;
    const i = this.idx(x, y);
    const def = ELEMENT_DEFINITIONS[type];
    this.elements[i] = def.id;
    this.temperature[i] = tempOverride !== undefined ? tempOverride : def.baseTemp;
    this.life[i] = type === 'FIRE' ? 60 + Math.floor(Math.random() * 40) : 255;
    this.updated[i] = (this.frameIndex % 255) + 1;
    return true;
  }

  public getTemperature(x: number, y: number): number {
    if (!this.inBounds(x, y)) return 20.0;
    return this.temperature[this.idx(x, y)];
  }

  public setTemperature(x: number, y: number, temp: number): void {
    if (!this.inBounds(x, y)) return;
    this.temperature[this.idx(x, y)] = Math.max(-50, Math.min(2500, temp));
  }

  public swapCells(x1: number, y1: number, x2: number, y2: number): void {
    const i1 = this.idx(x1, y1);
    const i2 = this.idx(x2, y2);

    const elem = this.elements[i1];
    this.elements[i1] = this.elements[i2];
    this.elements[i2] = elem;

    const temp = this.temperature[i1];
    this.temperature[i1] = this.temperature[i2];
    this.temperature[i2] = temp;

    const l = this.life[i1];
    this.life[i1] = this.life[i2];
    this.life[i2] = l;

    const currParity = (this.frameIndex % 255) + 1;
    this.updated[i1] = currParity;
    this.updated[i2] = currParity;
  }

  /**
   * Advances the simulation by one physical tick
   */
  public step(): void {
    this.frameIndex++;
    const currParity = (this.frameIndex % 255) + 1;
    this.reactionCount = 0;

    // 1. Chemical reactions, combustion, and acid etching pass (Immediate contact interactions)
    this.stepReactions(currParity);

    // 2. Thermodynamic phase transition pass (Thermal melting/boiling/freezing)
    this.evaluatePhaseChanges();

    // 3. 2D Heat diffusion pass (Conduction + Dissipation)
    this.diffuseHeat();

    // 4. Bottom-up sweep for falling powders, liquids, and downward flows
    for (let y = this.height - 2; y >= 0; y--) {
      // Alternate horizontal traversal direction per row to prevent left/right drift bias
      const startX = (this.frameIndex + y) % 2 === 0 ? 0 : this.width - 1;
      const endX = (this.frameIndex + y) % 2 === 0 ? this.width : -1;
      const stepX = (this.frameIndex + y) % 2 === 0 ? 1 : -1;

      for (let x = startX; x !== endX; x += stepX) {
        const i = this.idx(x, y);
        if (this.updated[i] === currParity) continue;

        const elemId = this.elements[i];
        if (elemId === ELEMENT_IDS.EMPTY) continue;

        const elemType = ID_TO_ELEMENT[elemId];
        const def = ELEMENT_DEFINITIONS[elemType];

        if (def.category === 'POWDER') {
          this.stepPowder(x, y, def, currParity);
        } else if (def.category === 'LIQUID') {
          this.stepLiquid(x, y, def, currParity);
        }
      }
    }

    // 5. Top-down sweep for rising gases and buoyant energy (Fire, Steam, Smoke)
    for (let y = 1; y < this.height; y++) {
      const startX = (this.frameIndex + y) % 2 === 0 ? 0 : this.width - 1;
      const endX = (this.frameIndex + y) % 2 === 0 ? this.width : -1;
      const stepX = (this.frameIndex + y) % 2 === 0 ? 1 : -1;

      for (let x = startX; x !== endX; x += stepX) {
        const i = this.idx(x, y);
        if (this.updated[i] === currParity) continue;

        const elemId = this.elements[i];
        if (elemId === ELEMENT_IDS.EMPTY) continue;

        const elemType = ID_TO_ELEMENT[elemId];
        const def = ELEMENT_DEFINITIONS[elemType];

        if (def.category === 'GAS' || def.category === 'ENERGY') {
          this.stepGasOrEnergy(x, y, def, currParity);
        }
      }
    }
  }

  /**
   * Granular mechanics (Sand, Gunpowder): gravity fall and angle of repose sliding
   */
  private stepPowder(
    x: number,
    y: number,
    def: (typeof ELEMENT_DEFINITIONS)['SAND'],
    currParity: number
  ): void {
    const belowId = this.getElementId(x, y + 1);
    const belowDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[belowId]];

    // 1. Direct fall: cell below is empty or lower density liquid/gas/energy
    if (
      belowId === ELEMENT_IDS.EMPTY ||
      ((belowDef.category === 'LIQUID' ||
        belowDef.category === 'GAS' ||
        belowDef.category === 'ENERGY') &&
        belowDef.density < def.density)
    ) {
      this.swapCells(x, y, x, y + 1);
      return;
    }

    // 2. Diagonal slide (Angle of repose)
    const dir = Math.random() < 0.5 ? 1 : -1;
    const canSlide1 = this.canPowderMoveTo(x + dir, y + 1, def.density);
    const canSlide2 = this.canPowderMoveTo(x - dir, y + 1, def.density);

    if (canSlide1) {
      this.swapCells(x, y, x + dir, y + 1);
    } else if (canSlide2) {
      this.swapCells(x, y, x - dir, y + 1);
    } else {
      this.updated[this.idx(x, y)] = currParity;
    }
  }

  private canPowderMoveTo(x: number, y: number, myDensity: number): boolean {
    if (!this.inBounds(x, y)) return false;
    const targetId = this.getElementId(x, y);
    if (targetId === ELEMENT_IDS.EMPTY) return true;
    const targetDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[targetId]];
    // Sinks through lighter liquids, gases, and buoyant energy
    return (
      (targetDef.category === 'LIQUID' ||
        targetDef.category === 'GAS' ||
        targetDef.category === 'ENERGY') &&
      targetDef.density < myDensity
    );
  }

  /**
   * Incompressible multi-fluid hydrodynamics (Water, Oil, Acid, Lava)
   */
  private stepLiquid(
    x: number,
    y: number,
    def: (typeof ELEMENT_DEFINITIONS)['WATER'],
    currParity: number
  ): void {
    const belowId = this.getElementId(x, y + 1);
    const belowDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[belowId]];

    // 1. Fall down if empty or lighter fluid
    if (belowId === ELEMENT_IDS.EMPTY || (belowDef.category === 'LIQUID' && belowDef.density < def.density)) {
      this.swapCells(x, y, x, y + 1);
      return;
    }

    // 2. Diagonal tumble
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.canLiquidMoveTo(x + dir, y + 1, def.density)) {
      this.swapCells(x, y, x + dir, y + 1);
      return;
    }
    if (this.canLiquidMoveTo(x - dir, y + 1, def.density)) {
      this.swapCells(x, y, x - dir, y + 1);
      return;
    }

    // 3. Lateral dispersion & hydrostatic equalization
    const disp = def.dispersionRate;
    let moved = false;

    for (let r = 1; r <= disp; r++) {
      const targetX = x + dir * r;
      if (!this.inBounds(targetX, y)) break;
      const tId = this.getElementId(targetX, y);
      const tDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[tId]];

      if (tId === ELEMENT_IDS.EMPTY || (tDef.category === 'LIQUID' && tDef.density < def.density)) {
        this.swapCells(x, y, targetX, y);
        moved = true;
        break;
      }
      if (tDef.category === 'SOLID' || tDef.category === 'POWDER') break;
    }

    if (!moved) {
      for (let r = 1; r <= disp; r++) {
        const targetX = x - dir * r;
        if (!this.inBounds(targetX, y)) break;
        const tId = this.getElementId(targetX, y);
        const tDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[tId]];

        if (tId === ELEMENT_IDS.EMPTY || (tDef.category === 'LIQUID' && tDef.density < def.density)) {
          this.swapCells(x, y, targetX, y);
          moved = true;
          break;
        }
        if (tDef.category === 'SOLID' || tDef.category === 'POWDER') break;
      }
    }

    if (!moved) {
      this.updated[this.idx(x, y)] = currParity;
    }
  }

  private canLiquidMoveTo(x: number, y: number, myDensity: number): boolean {
    if (!this.inBounds(x, y)) return false;
    const targetId = this.getElementId(x, y);
    if (targetId === ELEMENT_IDS.EMPTY) return true;
    const targetDef = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[targetId]];
    return (targetDef.category === 'LIQUID' && targetDef.density < myDensity) || targetDef.category === 'GAS';
  }

  /**
   * Gas & Energy transport (Steam, Smoke, Fire)
   */
  private stepGasOrEnergy(
    x: number,
    y: number,
    def: (typeof ELEMENT_DEFINITIONS)['FIRE'],
    currParity: number
  ): void {
    const i = this.idx(x, y);

    // Life decay
    if (this.life[i] > 0) {
      this.life[i]--;
      if (this.life[i] === 0) {
        if (def.type === 'FIRE') {
          // Fire turns to smoke when burnt out
          this.elements[i] = Math.random() < 0.6 ? ELEMENT_IDS.SMOKE : ELEMENT_IDS.EMPTY;
          this.life[i] = 40 + Math.floor(Math.random() * 30);
        } else {
          this.elements[i] = ELEMENT_IDS.EMPTY;
        }
        this.updated[i] = currParity;
        return;
      }
    }

    // Upward buoyant movement
    const aboveId = this.getElementId(x, y - 1);
    if (aboveId === ELEMENT_IDS.EMPTY) {
      this.swapCells(x, y, x, y - 1);
      return;
    }

    // Upward diagonal or lateral drift
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (this.getElementId(x + dir, y - 1) === ELEMENT_IDS.EMPTY) {
      this.swapCells(x, y, x + dir, y - 1);
    } else if (this.getElementId(x - dir, y - 1) === ELEMENT_IDS.EMPTY) {
      this.swapCells(x, y, x - dir, y - 1);
    } else if (Math.random() < 0.4 && this.getElementId(x + dir, y) === ELEMENT_IDS.EMPTY) {
      this.swapCells(x, y, x + dir, y);
    } else {
      this.updated[i] = currParity;
    }
  }

  /**
   * Chemical reactions: Combustion, acid dissolution, explosive deflagration, steam condensation
   */
  private stepReactions(currParity: number): void {
    const neighbors = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = this.idx(x, y);
        const elemId = this.elements[i];
        if (elemId === ELEMENT_IDS.EMPTY) continue;

        // --- FIRE & COMBUSTION ---
        if (elemId === ELEMENT_IDS.FIRE) {
          // Heat up surrounding cells
          for (const [dx, dy] of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (!this.inBounds(nx, ny)) continue;
            const ni = this.idx(nx, ny);
            const nType = ID_TO_ELEMENT[this.elements[ni]];
            const nDef = ELEMENT_DEFINITIONS[nType];

            // Direct ignition of flammable elements
            if (nDef.flammability > 0 && Math.random() < nDef.flammability) {
              if (nType === 'GUNPOWDER') {
                // EXPLOSIVE DEFLAGRATION!
                this.triggerExplosion(nx, ny);
              } else {
                this.elements[ni] = ELEMENT_IDS.FIRE;
                this.life[ni] = 45 + Math.floor(Math.random() * 35);
                this.temperature[ni] = 680.0;
                this.updated[ni] = currParity;
                this.reactionCount++;
                if (this.reactionCallback && Math.random() < 0.1) {
                  this.reactionCallback({ type: 'IGNITION', x: nx, y: ny, intensity: 0.5 });
                }
              }
            } else if (nType === 'WATER') {
              // Fire extinguished by water, water boils to steam!
              this.elements[i] = ELEMENT_IDS.STEAM;
              this.temperature[i] = 110.0;
              this.life[i] = 60;
              this.reactionCount++;
              if (this.reactionCallback && Math.random() < 0.15) {
                this.reactionCallback({ type: 'HISS', x, y, intensity: 0.6 });
              }
              break;
            }
          }
        }

        // --- LAVA & WATER INTERACTION ---
        else if (elemId === ELEMENT_IDS.LAVA) {
          for (const [dx, dy] of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (!this.inBounds(nx, ny)) continue;
            const ni = this.idx(nx, ny);
            if (this.elements[ni] === ELEMENT_IDS.WATER) {
              // Rapid boiling & cooling
              this.elements[ni] = ELEMENT_IDS.STEAM;
              this.temperature[ni] = 120.0;
              this.life[ni] = 80;

              this.elements[i] = ELEMENT_IDS.STONE;
              this.temperature[i] = 450.0;
              this.reactionCount++;
              if (this.reactionCallback) {
                this.reactionCallback({ type: 'HISS', x, y, intensity: 1.0 });
              }
              break;
            }
          }
        }

        // --- ACID CORROSION ---
        else if (elemId === ELEMENT_IDS.ACID) {
          for (const [dx, dy] of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (!this.inBounds(nx, ny)) continue;
            const ni = this.idx(nx, ny);
            const nType = ID_TO_ELEMENT[this.elements[ni]];
            const nDef = ELEMENT_DEFINITIONS[nType];

            if (nDef.dissolvableByAcid && Math.random() < 0.25) {
              // Consume reactant and acid
              this.elements[ni] = Math.random() < 0.5 ? ELEMENT_IDS.SMOKE : ELEMENT_IDS.EMPTY;
              this.life[ni] = 30;
              this.elements[i] = ELEMENT_IDS.EMPTY;
              this.reactionCount++;
              if (this.reactionCallback && Math.random() < 0.12) {
                this.reactionCallback({ type: 'ACID_CORRODE', x, y, intensity: 0.7 });
              }
              break;
            }
          }
        }

        // --- PLANT / VINE PHOTOSYNTHETIC GROWTH ---
        else if (elemId === ELEMENT_IDS.PLANT) {
          if (Math.random() < 0.008 && this.temperature[i] >= 12.0 && this.temperature[i] <= 42.0) {
            for (const [dx, dy] of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (!this.inBounds(nx, ny)) continue;
              const ni = this.idx(nx, ny);
              if (this.elements[ni] === ELEMENT_IDS.WATER) {
                // Consume water to grow plant
                this.elements[ni] = ELEMENT_IDS.PLANT;
                this.temperature[ni] = 20.0;
                this.updated[ni] = currParity;
                this.reactionCount++;
                break;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Triggers an explosive blast wave and fireball
   */
  public triggerExplosion(centerX: number, centerY: number, radius: number = 7): void {
    const rSq = radius * radius;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const distSq = dx * dx + dy * dy;
        if (distSq > rSq) continue;

        const x = centerX + dx;
        const y = centerY + dy;
        if (!this.inBounds(x, y)) continue;

        const i = this.idx(x, y);
        const elemType = ID_TO_ELEMENT[this.elements[i]];

        // Bedrock stone and glass resist mild shockwaves; other materials are blasted away
        if (elemType === 'STONE' || elemType === 'GLASS') {
          this.temperature[i] += 120.0;
        } else {
          if (distSq < (radius * 0.4) ** 2) {
            this.elements[i] = ELEMENT_IDS.FIRE;
            this.temperature[i] = 950.0;
            this.life[i] = 30 + Math.floor(Math.random() * 30);
          } else if (Math.random() < 0.6) {
            this.elements[i] = ELEMENT_IDS.SMOKE;
            this.temperature[i] = 450.0;
            this.life[i] = 40 + Math.floor(Math.random() * 40);
          } else {
            this.elements[i] = ELEMENT_IDS.EMPTY;
          }
        }
      }
    }

    this.reactionCount += 15;
    if (this.reactionCallback) {
      this.reactionCallback({ type: 'EXPLOSION', x: centerX, y: centerY, intensity: 1.0 });
    }
  }

  /**
   * 2D Fourier Heat Diffusion (5-point Laplacian stencil)
   */
  private diffuseHeat(): void {
    const w = this.width;
    const h = this.height;
    const ambient = 20.0;
    const dissipation = 0.003;

    // Copy to temporary buffer
    this.tempBuffer.set(this.temperature);

    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const i = row + x;
        const elemId = this.elements[i];
        const def = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[elemId]];
        const alpha = def.thermalConductivity * 0.22;

        const tCenter = this.tempBuffer[i];
        const tLeft = this.tempBuffer[i - 1];
        const tRight = this.tempBuffer[i + 1];
        const tUp = this.tempBuffer[i - w];
        const tDown = this.tempBuffer[i + w];

        const laplacian = tLeft + tRight + tUp + tDown - 4.0 * tCenter;
        let newTemp = tCenter + alpha * laplacian - dissipation * (tCenter - ambient);

        this.temperature[i] = Math.max(-50.0, Math.min(2500.0, newTemp));
      }
    }
  }

  /**
   * Temperature-driven state transitions (Phase Changes)
   */
  private evaluatePhaseChanges(): void {
    for (let i = 0; i < this.totalCells; i++) {
      const elemId = this.elements[i];
      if (elemId === ELEMENT_IDS.EMPTY) continue;

      const type = ID_TO_ELEMENT[elemId];
      const def = ELEMENT_DEFINITIONS[type];
      const temp = this.temperature[i];

      // Melting
      if (def.meltTemp !== undefined && temp >= def.meltTemp && def.meltTarget) {
        this.elements[i] = ELEMENT_IDS[def.meltTarget];
      }
      // Boiling
      else if (def.boilTemp !== undefined && temp >= def.boilTemp && def.boilTarget) {
        this.elements[i] = ELEMENT_IDS[def.boilTarget];
        this.life[i] = 120;
      }
      // Freezing / Condensing
      else if (def.freezeTemp !== undefined && temp <= def.freezeTemp && def.freezeTarget) {
        this.elements[i] = ELEMENT_IDS[def.freezeTarget];
      }
    }
  }

  /**
   * High-performance direct ImageData renderer
   * Writes packed 32-bit RGBA pixels into Uint32Array avoiding canvas fillRect overhead.
   */
  public renderToImageData(imageData: ImageData, showThermalView: boolean = false): void {
    const data32 = new Uint32Array(imageData.data.buffer);
    const total = this.totalCells;

    for (let i = 0; i < total; i++) {
      if (showThermalView) {
        // Thermal false-color colormap: Deep blue (-20C) -> Cyan (0C) -> Green (20C) -> Yellow (100C) -> Crimson (600C) -> White (>1000C)
        const t = this.temperature[i];
        let r = 10,
          g = 15,
          b = 30;

        if (t <= 0) {
          const norm = Math.max(0, (t + 20) / 20);
          r = 10;
          g = Math.round(norm * 140);
          b = 220;
        } else if (t <= 50) {
          const norm = t / 50;
          r = Math.round(norm * 40);
          g = Math.round(140 + norm * 80);
          b = Math.round(220 * (1 - norm));
        } else if (t <= 250) {
          const norm = (t - 50) / 200;
          r = Math.round(40 + norm * 210);
          g = Math.round(220 - norm * 60);
          b = 10;
        } else {
          const norm = Math.min(1, (t - 250) / 750);
          r = 255;
          g = Math.round(160 + norm * 95);
          b = Math.round(norm * 255);
        }

        // Little-endian packed ABGR
        data32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
      } else {
        const elemId = this.elements[i];
        const def = ELEMENT_DEFINITIONS[ID_TO_ELEMENT[elemId]];
        let [r, g, b, a] = def.color;

        // Subtle color variation jitter for natural sand/liquid texturing
        if (def.colorVariation && elemId !== ELEMENT_IDS.EMPTY) {
          const jitter = (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * def.colorVariation;
          r = Math.max(0, Math.min(255, Math.round(r + jitter)));
          g = Math.max(0, Math.min(255, Math.round(g + jitter)));
          b = Math.max(0, Math.min(255, Math.round(b + jitter)));
        }

        // Fire glow flicker
        if (elemId === ELEMENT_IDS.FIRE) {
          const flicker = Math.floor(Math.random() * 40);
          r = Math.min(255, r + flicker);
          g = Math.max(0, g - flicker);
        }

        data32[i] = (a << 24) | (b << 16) | (g << 8) | r;
      }
    }
  }

  public getMetrics(fps: number): SandboxMetrics {
    let active = 0;
    let tempSum = 0;
    let maxTemp = -50;

    for (let i = 0; i < this.totalCells; i++) {
      const e = this.elements[i];
      if (e !== ELEMENT_IDS.EMPTY) active++;
      const t = this.temperature[i];
      tempSum += t;
      if (t > maxTemp) maxTemp = t;
    }

    return {
      totalCells: this.totalCells,
      activeParticles: active,
      meanTemperature: Math.round((tempSum / this.totalCells) * 10) / 10,
      maxTemperature: Math.round(maxTemp * 10) / 10,
      reactionCount: this.reactionCount,
      fps: fps,
    };
  }
}
