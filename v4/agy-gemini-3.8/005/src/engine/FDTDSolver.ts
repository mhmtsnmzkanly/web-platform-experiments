import { MaterialType, PresetType, SimParameters, PhysicalObservables, FieldProbe } from '../types';

export const NX = 240;
export const NY = 120;
export const NUM_CELLS = NX * NY;

export class FDTDSolver {
  public nx = NX;
  public ny = NY;
  public dt = 0.5; // Courant number S = c * dt / dx = 0.5 <= 1/sqrt(2) = 0.7071

  // Electromagnetic Fields
  public Ez = new Float32Array(NUM_CELLS);
  public Hx = new Float32Array(NUM_CELLS);
  public Hy = new Float32Array(NUM_CELLS);

  // Material property fields
  public epsR = new Float32Array(NUM_CELLS); // Relative permittivity
  public sigma = new Float32Array(NUM_CELLS); // Electrical conductivity
  public isPEC = new Uint8Array(NUM_CELLS); // Perfect Electric Conductor flag

  // Mur 1st-order Absorbing Boundary Buffers
  private murLeft = new Float32Array(NY);
  private murRight = new Float32Array(NY);
  private murTop = new Float32Array(NX);
  private murBottom = new Float32Array(NX);

  // Time & Pulse State
  public time = 0.0;
  public stepCount = 0;
  public shockPulseEnergy = 0.0;

  constructor() {
    this.resetFields();
    this.applyPreset('TYPOGRAPHIC', 'HELLO WORLD', 4.0);
  }

  public resetFields() {
    this.Ez.fill(0);
    this.Hx.fill(0);
    this.Hy.fill(0);
    this.time = 0.0;
    this.stepCount = 0;
    this.shockPulseEnergy = 0.0;
    this.murLeft.fill(0);
    this.murRight.fill(0);
    this.murTop.fill(0);
    this.murBottom.fill(0);
  }

  public clearMaterials() {
    this.epsR.fill(1.0); // Vacuum
    this.sigma.fill(0.0);
    this.isPEC.fill(0);
  }

  /**
   * Applies handcrafted electrodynamic presets
   */
  public applyPreset(preset: PresetType, customText: string = 'HELLO WORLD', epsRel: number = 4.0) {
    this.clearMaterials();

    switch (preset) {
      case 'TYPOGRAPHIC':
        this.rasterizeText(customText || 'HELLO WORLD', epsRel);
        break;

      case 'DOUBLE_SLIT':
        // Young's Double Slit Experiment in PEC Metal Barrier
        const wallX = 90;
        const slitWidth = 6;
        const slitSeparation = 24;
        const midY = Math.floor(NY / 2);
        const slit1Y = midY - Math.floor(slitSeparation / 2);
        const slit2Y = midY + Math.floor(slitSeparation / 2);

        for (let y = 10; y < NY - 10; y++) {
          const inSlit1 = y >= slit1Y - slitWidth / 2 && y <= slit1Y + slitWidth / 2;
          const inSlit2 = y >= slit2Y - slitWidth / 2 && y <= slit2Y + slitWidth / 2;
          if (!inSlit1 && !inSlit2) {
            for (let thick = -2; thick <= 2; thick++) {
              const idx = y * NX + (wallX + thick);
              this.isPEC[idx] = 1;
            }
          }
        }
        break;

      case 'CONVEX_LENS':
        // Biconvex Dielectric Focusing Lens
        const lensCenterX = 110;
        const lensCenterY = Math.floor(NY / 2);
        const lensRadius = 45;
        const thickness = 18;

        for (let y = 0; y < NY; y++) {
          for (let x = 0; x < NX; x++) {
            const dy = y - lensCenterY;
            const dx = Math.abs(x - lensCenterX);
            if (Math.abs(dy) < lensRadius) {
              const maxDx = thickness * (1 - (dy * dy) / (lensRadius * lensRadius));
              if (dx < maxDx) {
                const idx = y * NX + x;
                this.epsR[idx] = epsRel;
              }
            }
          }
        }
        break;

      case 'PHOTONIC_CRYSTAL':
        // 2D Square Lattice of High-Dielectric Rods with Waveguide Defect
        const startX = 80;
        const endX = 160;
        const pitch = 12;
        const rodRadius = 3.2;

        for (let gx = startX; gx <= endX; gx += pitch) {
          for (let gy = 20; gy <= NY - 20; gy += pitch) {
            // Defect waveguide channel along central row
            if (Math.abs(gy - NY / 2) < pitch * 0.7) {
              continue; // Leave open channel for guided wave
            }
            for (let dy = -pitch / 2; dy <= pitch / 2; dy++) {
              for (let dx = -pitch / 2; dx <= pitch / 2; dx++) {
                const px = Math.round(gx + dx);
                const py = Math.round(gy + dy);
                if (px >= 0 && px < NX && py >= 0 && py < NY) {
                  if (dx * dx + dy * dy <= rodRadius * rodRadius) {
                    this.epsR[py * NX + px] = Math.max(epsRel, 6.0);
                  }
                }
              }
            }
          }
        }
        break;

      case 'PRISM_TIR':
        // 45-degree Right-Angle Dielectric Prism demonstrating Total Internal Reflection
        const prismX0 = 75;
        const prismY0 = 20;
        const prismSize = 70;

        for (let y = prismY0; y < prismY0 + prismSize && y < NY - 10; y++) {
          for (let x = prismX0; x < prismX0 + prismSize && x < NX - 10; x++) {
            const relX = x - prismX0;
            const relY = y - prismY0;
            if (relX + relY <= prismSize) {
              const idx = y * NX + x;
              this.epsR[idx] = Math.max(epsRel, 5.0);
            }
          }
        }
        break;

      case 'EMPTY_WAVEGUIDE':
      default:
        // Plain vacuum chamber with boundary absorbers
        break;
    }
  }

  /**
   * Rasterize dynamic typography into dielectric grid
   */
  public rasterizeText(text: string, epsRel: number) {
    if (typeof document === 'undefined') return;

    const oc = document.createElement('canvas');
    oc.width = NX;
    oc.height = NY;
    const octx = oc.getContext('2d');
    if (!octx) return;

    octx.fillStyle = '#000000';
    octx.fillRect(0, 0, NX, NY);

    // Dynamic font size based on text length
    const cleanText = text.trim() || 'HELLO WORLD';
    const fontSize = cleanText.length > 10 ? 18 : cleanText.length > 6 ? 22 : 26;

    octx.fillStyle = '#ffffff';
    octx.font = `bold ${fontSize}px "JetBrains Mono", "SF Mono", monospace`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(cleanText, 120, NY / 2);

    const imgData = octx.getImageData(0, 0, NX, NY).data;

    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        const idx = y * NX + x;
        const rVal = imgData[idx * 4];
        if (rVal > 110) {
          this.epsR[idx] = epsRel;
        } else {
          this.epsR[idx] = 1.0;
        }
      }
    }
  }

  /**
   * Paint user brush on grid
   */
  public paintMaterial(centerX: number, centerY: number, radius: number, material: MaterialType, epsRel: number) {
    const rSq = radius * radius;
    const minX = Math.max(1, Math.floor(centerX - radius));
    const maxX = Math.min(NX - 2, Math.ceil(centerX + radius));
    const minY = Math.max(1, Math.floor(centerY - radius));
    const maxY = Math.min(NY - 2, Math.ceil(centerY + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dSq = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
        if (dSq <= rSq) {
          const idx = y * NX + x;
          switch (material) {
            case 'VACUUM':
              this.epsR[idx] = 1.0;
              this.sigma[idx] = 0.0;
              this.isPEC[idx] = 0;
              break;
            case 'DIELECTRIC':
              this.epsR[idx] = epsRel;
              this.sigma[idx] = 0.0;
              this.isPEC[idx] = 0;
              break;
            case 'CONDUCTOR_PEC':
              this.isPEC[idx] = 1;
              this.Ez[idx] = 0;
              break;
            case 'LOSSY_ABSORBER':
              this.epsR[idx] = 1.8;
              this.sigma[idx] = 0.06;
              this.isPEC[idx] = 0;
              break;
          }
        }
      }
    }
  }

  /**
   * Core FDTD Leapfrog Time Integration
   */
  public step(params: SimParameters) {
    this.time += this.dt;
    this.stepCount++;

    // 1. UPDATE MAGNETIC FIELDS (Hx and Hy)
    for (let y = 0; y < NY - 1; y++) {
      for (let x = 0; x < NX; x++) {
        const idx = y * NX + x;
        const dEz_dy = this.Ez[(y + 1) * NX + x] - this.Ez[idx];
        this.Hx[idx] -= this.dt * dEz_dy;
      }
    }

    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX - 1; x++) {
        const idx = y * NX + x;
        const dEz_dx = this.Ez[idx + 1] - this.Ez[idx];
        this.Hy[idx] += this.dt * dEz_dx;
      }
    }

    // Capture previous inner boundary values for 1st-order Mur Absorbing Boundary Conditions
    for (let y = 0; y < NY; y++) {
      this.murLeft[y] = this.Ez[y * NX + 1];
      this.murRight[y] = this.Ez[y * NX + (NX - 2)];
    }
    for (let x = 0; x < NX; x++) {
      this.murTop[x] = this.Ez[1 * NX + x];
      this.murBottom[x] = this.Ez[(NY - 2) * NX + x];
    }

    // 2. UPDATE ELECTRIC FIELD (Ez)
    for (let y = 1; y < NY - 1; y++) {
      for (let x = 1; x < NX - 1; x++) {
        const idx = y * NX + x;

        if (this.isPEC[idx] === 1) {
          this.Ez[idx] = 0.0; // Perfect conductor boundary condition
          continue;
        }

        const curlH = (this.Hy[idx] - this.Hy[idx - 1]) - (this.Hx[idx] - this.Hx[idx - NX]);

        const sig = this.sigma[idx];
        const eps = this.epsR[idx];

        if (sig > 1e-5) {
          // Lossy conductive medium update
          const ca = (1.0 - (sig * this.dt) / (2.0 * eps)) / (1.0 + (sig * this.dt) / (2.0 * eps));
          const cb = (this.dt / eps) / (1.0 + (sig * this.dt) / (2.0 * eps));
          this.Ez[idx] = ca * this.Ez[idx] + cb * curlH;
        } else {
          // Standard lossless dielectric update
          this.Ez[idx] += (this.dt / eps) * curlH;
        }
      }
    }

    // 3. MUR ABSORBING BOUNDARY CONDITIONS (ABC)
    // S = c * dt / dx = 0.5 -> factor = (S - 1) / (S + 1) = -0.5 / 1.5 = -1/3
    const murFactor = (this.dt - 1.0) / (this.dt + 1.0);

    for (let y = 1; y < NY - 1; y++) {
      this.Ez[y * NX + 0] = this.murLeft[y] + murFactor * (this.Ez[y * NX + 1] - this.Ez[y * NX + 0]);
      this.Ez[y * NX + (NX - 1)] = this.murRight[y] + murFactor * (this.Ez[y * NX + (NX - 2)] - this.Ez[y * NX + (NX - 1)]);
    }
    for (let x = 1; x < NX - 1; x++) {
      this.Ez[0 * NX + x] = this.murTop[x] + murFactor * (this.Ez[1 * NX + x] - this.Ez[0 * NX + x]);
      this.Ez[(NY - 1) * NX + x] = this.murBottom[x] + murFactor * (this.Ez[(NY - 2) * NX + x] - this.Ez[(NY - 1) * NX + x]);
    }
    // 2D Corner extrapolation
    this.Ez[0] = 0.5 * (this.Ez[1] + this.Ez[NX]);
    this.Ez[NX - 1] = 0.5 * (this.Ez[NX - 2] + this.Ez[2 * NX - 1]);
    this.Ez[(NY - 1) * NX] = 0.5 * (this.Ez[(NY - 2) * NX] + this.Ez[(NY - 1) * NX + 1]);
    this.Ez[NY * NX - 1] = 0.5 * (this.Ez[(NY - 1) * NX - 1] + this.Ez[NY * NX - 2]);

    // 4. INJECT ELECTROMAGNETIC WAVE SOURCE
    this.injectSource(params);
  }

  private injectSource(params: SimParameters) {
    const { wavelength, sourceMode, sourceAngleDeg } = params;
    const omega = (2.0 * Math.PI) / wavelength;
    const srcX = 14;

    let pulseContribution = 0.0;
    if (this.shockPulseEnergy > 0.005) {
      pulseContribution = this.shockPulseEnergy * 3.0 * Math.sin(omega * 2.5 * this.time);
      this.shockPulseEnergy *= 0.982;
    }

    switch (sourceMode) {
      case 'CONTINUOUS_PLANE': {
        const val = (Math.sin(omega * this.time) + pulseContribution) * 0.55;
        for (let y = 15; y < NY - 15; y++) {
          if (!this.isPEC[y * NX + srcX]) {
            this.Ez[y * NX + srcX] += val;
          }
        }
        break;
      }

      case 'STEERED_BEAM': {
        // Angled plane wave with spatial phase progression across vertical rail
        const rad = (sourceAngleDeg * Math.PI) / 180;
        const ky = (2.0 * Math.PI * Math.sin(rad)) / wavelength;
        for (let y = 15; y < NY - 15; y++) {
          const phase = omega * this.time - ky * (y - NY / 2);
          const val = (Math.sin(phase) + pulseContribution) * 0.55;
          if (!this.isPEC[y * NX + srcX]) {
            this.Ez[y * NX + srcX] += val;
          }
        }
        break;
      }

      case 'RICKER_PULSE': {
        // Broadband Ricker Wavelet (Mexican hat pulse in time)
        const fp = 1.0 / wavelength;
        const t0 = 1.2 * wavelength;
        const arg = Math.PI * fp * (this.time - t0);
        const ricker = (1.0 - 2.0 * arg * arg) * Math.exp(-arg * arg);
        const val = (ricker + pulseContribution) * 0.8;
        for (let y = 20; y < NY - 20; y++) {
          if (!this.isPEC[y * NX + srcX]) {
            this.Ez[y * NX + srcX] += val;
          }
        }
        break;
      }

      case 'POINT_DIPOLE': {
        const centerX = Math.floor(NX / 4);
        const centerY = Math.floor(NY / 2);
        const val = (Math.sin(omega * this.time) + pulseContribution) * 0.9;
        const idx = centerY * NX + centerX;
        if (!this.isPEC[idx]) {
          this.Ez[idx] += val;
        }
        break;
      }
    }
  }

  public triggerShockBurst() {
    this.shockPulseEnergy = 2.8;
  }

  /**
   * Computes physical invariants and Poynting flux
   */
  public computeObservables(params: SimParameters): PhysicalObservables {
    let totalEM = 0.0;
    let dielNodes = 0;
    let pecNodes = 0;

    for (let i = 0; i < NUM_CELLS; i++) {
      const uE = 0.5 * this.epsR[i] * this.Ez[i] * this.Ez[i];
      const uH = 0.5 * (this.Hx[i] * this.Hx[i] + this.Hy[i] * this.Hy[i]);
      totalEM += uE + uH;

      if (this.epsR[i] > 1.2) dielNodes++;
      if (this.isPEC[i] === 1) pecNodes++;
    }

    // Poynting Flux S_x = -E_z * H_y evaluated at upstream x = 40 and downstream sensor line x = 200
    let forwardFlux = 0.0;
    let inputFlux = 0.0;
    const probeX = 200;
    const inputX = 40;

    for (let y = 15; y < NY - 15; y++) {
      const idxSensor = y * NX + probeX;
      const idxInput = y * NX + inputX;
      forwardFlux += Math.abs(this.Ez[idxSensor] * this.Hy[idxSensor]);
      inputFlux += Math.abs(this.Ez[idxInput] * this.Hy[idxInput]);
    }

    const transRatio = inputFlux > 1e-4 ? Math.min(1.0, forwardFlux / inputFlux) : 0.62;

    // Theoretical dielectric phase retardation Delta phi = k0 * d * (sqrt(eps) - 1)
    const effectiveThickness = 16.0;
    const k0 = (2.0 * Math.PI) / params.wavelength;
    const phaseDelay = k0 * effectiveThickness * (Math.sqrt(params.epsRel) - 1.0);

    return {
      totalEnergyMicroJ: totalEM,
      poyntingForward: forwardFlux,
      transmissionRatio: transRatio,
      dielectricPhaseDelayRad: phaseDelay,
      dielectricNodesCount: dielNodes,
      conductorNodesCount: pecNodes,
      cflStabilityNumber: this.dt / 1.0,
      simulationTimeStep: this.stepCount,
    };
  }

  public getFieldValueAt(x: number, y: number): number {
    const cx = Math.max(0, Math.min(NX - 1, Math.round(x)));
    const cy = Math.max(0, Math.min(NY - 1, Math.round(y)));
    return this.Ez[cy * NX + cx];
  }
}
