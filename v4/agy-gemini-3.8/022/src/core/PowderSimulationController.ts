/**
 * POWDER-BOX (EXP-022) — Simulation Controller & Single-Owner State Manager
 * Centralizes simulation advancement, brush drawing, audio dispatch, and UI telemetry.
 */

import { PowderSimulationEngine, ReactionEvent } from '../physics/PowderSimulationEngine';
import { PowderAudioEngine } from '../audio/PowderAudioEngine';
import { loadPreset, SANDBOX_PRESETS } from '../physics/SandboxPresets';
import {
  BrushTool,
  PresetType,
  SandboxMetrics,
} from '../types';
import { ELEMENT_IDS } from '../physics/ElementRegistry';

export type ControllerListener = (controller: PowderSimulationController) => void;

export class PowderSimulationController {
  public engine: PowderSimulationEngine;
  public audio: PowderAudioEngine;

  public activeTool: BrushTool = 'SAND';
  public brushRadius: number = 3;
  public isPaused: boolean = false;
  public simSpeed: number = 1.0;
  public showThermalView: boolean = false;
  public currentPreset: PresetType = 'HOURGLASS';

  public metrics: SandboxMetrics;
  public measuredFps: number = 60.0;
  private frameCount: number = 0;
  private lastFpsUpdateTime: number = performance.now();
  private subscribers: Set<ControllerListener> = new Set();

  constructor(width: number = 240, height: number = 150) {
    this.engine = new PowderSimulationEngine(width, height);
    this.audio = new PowderAudioEngine();

    this.metrics = {
      totalCells: width * height,
      activeParticles: 0,
      meanTemperature: 20.0,
      maxTemperature: 20.0,
      reactionCount: 0,
      fps: 60,
    };

    // Attach reaction callback to audio engine
    this.engine.setReactionCallback((evt: ReactionEvent) => {
      this.handleReactionAudio(evt);
    });

    this.loadPreset('HOURGLASS');
  }

  public subscribe(listener: ControllerListener): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  public notify(): void {
    this.subscribers.forEach((l) => l(this));
  }

  public setTool(tool: BrushTool): void {
    this.activeTool = tool;
    this.notify();
  }

  public setBrushRadius(radius: number): void {
    this.brushRadius = Math.max(1, Math.min(16, radius));
    this.notify();
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    this.notify();
    return this.isPaused;
  }

  public stepOnce(): void {
    this.engine.step();
    this.updateMetrics();
    this.notify();
  }

  public setSimSpeed(speed: number): void {
    this.simSpeed = speed;
    this.notify();
  }

  public toggleThermalView(): boolean {
    this.showThermalView = !this.showThermalView;
    this.notify();
    return this.showThermalView;
  }

  public clearSandbox(): void {
    this.engine.clear();
    this.audio.playSteamHiss(0.15);
    this.updateMetrics();
    this.notify();
  }

  public clear(): void {
    this.clearSandbox();
  }

  public loadPreset(type: PresetType): void {
    this.currentPreset = type;
    loadPreset(this.engine, type);
    this.updateMetrics();
    this.notify();
  }

  /**
   * Applies active brush to circular stamp around (cx, cy)
   */
  public applyBrush(cx: number, cy: number): void {
    const r = this.brushRadius;
    const rSq = r * r;
    const tool = this.activeTool;

    let soundTriggered = false;

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > rSq) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (!this.engine.inBounds(x, y)) continue;

        // Apply tool action
        if (tool === 'ERASER') {
          this.engine.setElement(x, y, 'EMPTY', 20.0);
        } else if (tool === 'HEAT_BRUSH') {
          const current = this.engine.getTemperature(x, y);
          this.engine.setTemperature(x, y, current + 45.0);
        } else if (tool === 'COOL_BRUSH') {
          const current = this.engine.getTemperature(x, y);
          this.engine.setTemperature(x, y, current - 35.0);
        } else if (tool === 'SPARK') {
          this.engine.setElement(x, y, 'FIRE', 850.0);
          if (!soundTriggered) {
            this.audio.playSteamHiss(0.4);
            soundTriggered = true;
          }
        } else {
          // Normal element brush
          const success = this.engine.setElement(x, y, tool);
          if (success && !soundTriggered && Math.random() < 0.2) {
            if (tool === 'SAND' || tool === 'GUNPOWDER') {
              this.audio.playPowderPour();
            } else if (tool === 'WATER' || tool === 'OIL') {
              this.audio.playLiquidTrickle();
            } else if (tool === 'ACID') {
              this.audio.playAcidSizzle();
            } else if (tool === 'FIRE' || tool === 'LAVA') {
              this.audio.playSteamHiss(0.5);
            }
            soundTriggered = true;
          }
        }
      }
    }

    this.updateMetrics();
  }

  /**
   * Dispatches synthesized audio for reaction events
   */
  private handleReactionAudio(evt: ReactionEvent): void {
    switch (evt.type) {
      case 'EXPLOSION':
        this.audio.playExplosion();
        break;
      case 'HISS':
        this.audio.playSteamHiss(evt.intensity);
        break;
      case 'ACID_CORRODE':
        this.audio.playAcidSizzle();
        break;
      case 'IGNITION':
        this.audio.playSteamHiss(0.3);
        break;
    }
  }

  /**
   * Main per-frame simulation advancement
   */
  public tick(dt: number): void {
    // 1. Measured Wall-Clock FPS Tracking
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsUpdateTime;
    if (elapsed >= 500) {
      this.measuredFps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
      this.notify();
    }

    if (this.isPaused) return;

    // Simulation sub-stepping based on simSpeed
    const steps = this.simSpeed >= 2.0 ? 2 : 1;
    for (let s = 0; s < steps; s++) {
      this.engine.step();
    }

    this.updateMetrics();

    // Throttle React UI notifications to every 4 frames for silky 60 FPS canvas performance
    if (this.frameCount % 4 === 0) {
      this.notify();
    }
  }

  private updateMetrics(): void {
    this.metrics = this.engine.getMetrics(this.measuredFps);
  }

  /**
   * Telemetry and State Export Modal Data
   */
  public exportStateJson(): string {
    const counts: Record<string, number> = {};
    for (let i = 0; i < this.engine.totalCells; i++) {
      const elem = this.engine.getElement(i % this.engine.width, Math.floor(i / this.engine.width));
      counts[elem] = (counts[elem] || 0) + 1;
    }

    return JSON.stringify(
      {
        experiment: '022',
        name: 'POWDER-BOX',
        timestamp: new Date().toISOString(),
        dimensions: { width: this.engine.width, height: this.engine.height },
        metrics: this.metrics,
        elementInventory: counts,
      },
      null,
      2
    );
  }

  public exportInventoryCsv(): string {
    const counts: Record<string, number> = {};
    for (let i = 0; i < this.engine.totalCells; i++) {
      const elem = this.engine.getElement(i % this.engine.width, Math.floor(i / this.engine.width));
      counts[elem] = (counts[elem] || 0) + 1;
    }

    let csv = 'Element,CellCount,Percentage\n';
    const total = this.engine.totalCells;
    for (const [elem, count] of Object.entries(counts)) {
      const pct = ((count / total) * 100).toFixed(2);
      csv += `${elem},${count},${pct}%\n`;
    }
    return csv;
  }

  public dispose(): void {
    this.audio.dispose();
    this.subscribers.clear();
  }
}
