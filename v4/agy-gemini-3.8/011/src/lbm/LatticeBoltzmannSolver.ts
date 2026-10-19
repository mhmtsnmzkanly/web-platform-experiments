import { AeroMetrics, WindTunnelConfig } from '../types';

// D2Q9 Lattice Directions: c_x and c_y
export const CX = new Int32Array([0, 1, 0, -1, 0, 1, -1, -1, 1]);
export const CY = new Int32Array([0, 0, 1, 0, -1, 1, 1, -1, -1]);

// Inverse direction indices for bounce-back
export const OPPOSITE = new Int32Array([0, 3, 4, 1, 2, 7, 8, 5, 6]);

// Lattice weights
export const WEIGHTS = new Float32Array([
  4 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 36,
  1 / 36,
  1 / 36,
  1 / 36,
]);

export class LatticeBoltzmannSolver {
  public nx: number;
  public ny: number;
  public numCells: number;

  // Distribution functions: 9 * nx * ny Float32Arrays
  public f: Float32Array;
  public fTemp: Float32Array;

  // Macroscopic fields
  public rho: Float32Array;
  public ux: Float32Array;
  public uy: Float32Array;
  public speed: Float32Array;
  public vorticity: Float32Array;

  // Solid obstacle mask: 1 = solid, 0 = fluid
  public solidMask: Uint8Array;

  // Simulation parameters
  public inletVelocity: number = 0.08;
  public tau: number = 0.54; // relaxation time
  public omega: number = 1.0 / 0.54; // 1 / tau

  // Integrated aerodynamic metrics
  public metrics: AeroMetrics = {
    liftForce: 0,
    dragForce: 0,
    liftCoeff: 0,
    dragCoeff: 0,
    liftToDragRatio: 0,
    angleDeg: 0,
    angleRad: 0,
    reynolds: 0,
    circulation: 0,
    strouhalFreq: 0,
    strouhalNumber: 0.2,
    isStalled: false,
    maxVelocity: 0,
    meanPressure: 1.0,
  };

  private liftHistory: number[] = [];
  private stepCount: number = 0;

  constructor(nx: number = 220, ny: number = 90) {
    this.nx = nx;
    this.ny = ny;
    this.numCells = nx * ny;

    this.f = new Float32Array(9 * this.numCells);
    this.fTemp = new Float32Array(9 * this.numCells);

    this.rho = new Float32Array(this.numCells);
    this.ux = new Float32Array(this.numCells);
    this.uy = new Float32Array(this.numCells);
    this.speed = new Float32Array(this.numCells);
    this.vorticity = new Float32Array(this.numCells);

    this.solidMask = new Uint8Array(this.numCells);

    this.resetField(this.inletVelocity, 0.02);
  }

  /**
   * Resets fluid fields to uniform inlet flow
   */
  public resetField(inletU: number = 0.08, viscosity: number = 0.02): void {
    this.inletVelocity = Math.max(0.01, Math.min(0.18, inletU));
    this.tau = 3.0 * viscosity + 0.5;
    this.omega = 1.0 / this.tau;

    const u0 = this.inletVelocity;
    const rho0 = 1.0;

    for (let idx = 0; idx < this.numCells; idx++) {
      this.rho[idx] = rho0;
      this.ux[idx] = u0;
      this.uy[idx] = 0;
      this.speed[idx] = u0;
      this.vorticity[idx] = 0;

      for (let i = 0; i < 9; i++) {
        const cu = CX[i] * u0;
        const usq = u0 * u0;
        const feq = rho0 * WEIGHTS[i] * (1.0 + 3.0 * cu + 4.5 * cu * cu - 1.5 * usq);
        this.f[i * this.numCells + idx] = feq;
        this.fTemp[i * this.numCells + idx] = feq;
      }
    }

    this.liftHistory = [];
    this.stepCount = 0;
  }

  public setViscosity(nu: number): void {
    const clampedNu = Math.max(0.005, Math.min(0.2, nu));
    this.tau = Math.max(0.515, 3.0 * clampedNu + 0.5);
    this.omega = 1.0 / this.tau;
  }

  public setInletVelocity(u: number): void {
    this.inletVelocity = Math.max(0.02, Math.min(0.18, u));
  }

  /**
   * Sets solid obstacle mask
   */
  public setSolidMask(mask: Uint8Array): void {
    this.solidMask.set(mask);
  }

  /**
   * Toggles or paints a circular brush on the solid mask
   */
  public paintObstacle(cx: number, cy: number, radius: number, isSolid: boolean): void {
    const rSq = radius * radius;
    const x0 = Math.max(1, Math.floor(cx - radius));
    const x1 = Math.min(this.nx - 2, Math.ceil(cx + radius));
    const y0 = Math.max(1, Math.floor(cy - radius));
    const y1 = Math.min(this.ny - 2, Math.ceil(cy + radius));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= rSq) {
          this.solidMask[y * this.nx + x] = isSolid ? 1 : 0;
        }
      }
    }
  }

  /**
   * Executes 1 LBM time step (Collision + Streaming + Boundaries + Force Integration)
   */
  public step(): void {
    const nx = this.nx;
    const ny = this.ny;
    const nCells = this.numCells;
    const omega = this.omega;
    const uInlet = this.inletVelocity;

    let fxTotal = 0;
    let fyTotal = 0;
    let solidNodeCount = 0;

    // 1. COLLISION STEP
    for (let idx = 0; idx < nCells; idx++) {
      if (this.solidMask[idx] === 1) {
        solidNodeCount++;
        continue;
      }

      // Compute density rho and momentum
      let r = 0;
      let rx = 0;
      let ry = 0;

      for (let i = 0; i < 9; i++) {
        const fi = this.f[i * nCells + idx];
        r += fi;
        rx += fi * CX[i];
        ry += fi * CY[i];
      }

      // Safeguard against NaN / negative density
      if (r <= 0.001 || isNaN(r)) r = 1.0;
      const invR = 1.0 / r;
      let vx = rx * invR;
      let vy = ry * invR;

      // Velocity magnitude clamping to prevent supersonic CFL divergence (Mach < 0.3)
      const vMag = Math.sqrt(vx * vx + vy * vy);
      if (vMag > 0.22) {
        const scale = 0.22 / vMag;
        vx *= scale;
        vy *= scale;
      }
      if (isNaN(vx)) vx = uInlet;
      if (isNaN(vy)) vy = 0;

      this.rho[idx] = r;
      this.ux[idx] = vx;
      this.uy[idx] = vy;
      this.speed[idx] = Math.sqrt(vx * vx + vy * vy);

      const usq = vx * vx + vy * vy;

      // Relax towards equilibrium f_eq
      for (let i = 0; i < 9; i++) {
        const cu = CX[i] * vx + CY[i] * vy;
        const feq = r * WEIGHTS[i] * (1.0 + 3.0 * cu + 4.5 * cu * cu - 1.5 * usq);
        const fColl = this.f[i * nCells + idx] - omega * (this.f[i * nCells + idx] - feq);
        this.f[i * nCells + idx] = fColl;
      }
    }

    // 2. STREAMING STEP with Momentum-Exchange & Bounce-Back
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const idx = y * nx + x;

        // Skip inside solid
        if (this.solidMask[idx] === 1) continue;

        for (let i = 0; i < 9; i++) {
          const prevX = x - CX[i];
          const prevY = y - CY[i];

          // Check domain boundaries
          if (prevX < 0 || prevX >= nx || prevY < 0 || prevY >= ny) {
            // Handled in boundary conditions
            continue;
          }

          const prevIdx = prevY * nx + prevX;

          if (this.solidMask[prevIdx] === 1) {
            // Half-way Bounce-Back: Solid surface reflected back
            // Momentum exchange: F_solid = - Delta p_fluid = - (c_i - c_opp) * postColl = - 2 * c_i * postColl
            const opp = OPPOSITE[i];
            const postColl = this.f[opp * nCells + idx];
            this.fTemp[i * nCells + idx] = postColl;

            // Force imparted on solid (Newton's 3rd Law):
            fxTotal -= CX[i] * postColl * 2.0;
            fyTotal -= CY[i] * postColl * 2.0;
          } else {
            // Standard fluid-to-fluid streaming
            this.fTemp[i * nCells + idx] = this.f[i * nCells + prevIdx];
          }
        }
      }
    }

    // Copy fTemp back to f for fluid nodes
    for (let i = 0; i < 9; i++) {
      const offset = i * nCells;
      for (let idx = 0; idx < nCells; idx++) {
        if (this.solidMask[idx] === 0) {
          this.f[offset + idx] = this.fTemp[offset + idx];
        }
      }
    }

    // 3. BOUNDARY CONDITIONS
    // Left boundary: Zou-He Velocity Inlet (x = 0)
    for (let y = 0; y < ny; y++) {
      const idx = y * nx;
      if (this.solidMask[idx] === 1) continue;

      const r = 1.0;
      const vx = uInlet;
      const vy = 0.0;
      const usq = vx * vx;

      for (let i = 0; i < 9; i++) {
        const cu = CX[i] * vx;
        const feq = r * WEIGHTS[i] * (1.0 + 3.0 * cu + 4.5 * cu * cu - 1.5 * usq);
        this.f[i * nCells + idx] = feq;
      }
      this.rho[idx] = r;
      this.ux[idx] = vx;
      this.uy[idx] = 0;
      this.speed[idx] = vx;
    }

    // Right boundary: Convective Zero-Gradient Outflow (x = nx - 1)
    for (let y = 0; y < ny; y++) {
      const idx = y * nx + (nx - 1);
      const prevIdx = y * nx + (nx - 2);
      if (this.solidMask[idx] === 1) continue;

      for (let i = 0; i < 9; i++) {
        this.f[i * nCells + idx] = this.f[i * nCells + prevIdx];
      }
      this.rho[idx] = this.rho[prevIdx];
      this.ux[idx] = this.ux[prevIdx];
      this.uy[idx] = this.uy[prevIdx];
      this.speed[idx] = this.speed[prevIdx];
    }

    // Top and Bottom: Free-Slip Wall (y = 0 and y = ny - 1)
    for (let x = 0; x < nx; x++) {
      // Bottom wall (y = 0): reflect CY components
      const bIdx = x;
      this.f[2 * nCells + bIdx] = this.f[4 * nCells + bIdx];
      this.f[5 * nCells + bIdx] = this.f[8 * nCells + bIdx];
      this.f[6 * nCells + bIdx] = this.f[7 * nCells + bIdx];

      // Top wall (y = ny - 1): reflect CY components
      const tIdx = (ny - 1) * nx + x;
      this.f[4 * nCells + tIdx] = this.f[2 * nCells + tIdx];
      this.f[7 * nCells + tIdx] = this.f[6 * nCells + tIdx];
      this.f[8 * nCells + tIdx] = this.f[5 * nCells + tIdx];
    }

    // 4. COMPUTE VORTICITY FIELD
    let maxV = 0;
    let sumRho = 0;
    let fluidNodes = 0;

    for (let y = 1; y < ny - 1; y++) {
      for (let x = 1; x < nx - 1; x++) {
        const idx = y * nx + x;
        if (this.solidMask[idx] === 1) {
          this.vorticity[idx] = 0;
          continue;
        }

        const uyR = this.uy[idx + 1];
        const uyL = this.uy[idx - 1];
        const uxT = this.ux[idx + nx];
        const uxB = this.ux[idx - nx];

        // Vorticity = du_y/dx - du_x/dy
        const vort = (uyR - uyL) * 0.5 - (uxT - uxB) * 0.5;
        this.vorticity[idx] = vort;

        const spd = this.speed[idx];
        if (spd > maxV) maxV = spd;
        sumRho += this.rho[idx];
        fluidNodes++;
      }
    }

    // 5. UPDATE AERODYNAMIC METRICS
    const chord = 60.0; // characteristic reference length in lattice units
    const dynPressure = 0.5 * 1.0 * uInlet * uInlet * chord;

    // Aerodynamic Lift is vertical force (upward force on solid)
    // Drag is horizontal force in direction of flow (+X)
    const lift = fyTotal;
    const drag = Math.max(0.001, fxTotal);

    const cl = dynPressure > 1e-6 ? lift / dynPressure : 0;
    const cd = dynPressure > 1e-6 ? drag / dynPressure : 0.02;
    const ld = cd > 1e-4 ? cl / cd : 0;

    // Circulation calculation along boundary loop
    let circulation = 0;
    for (let x = 20; x < nx - 20; x += 4) {
      circulation += this.ux[(ny - 5) * nx + x] * 4 - this.ux[5 * nx + x] * 4;
    }

    // Track lift oscillations for vortex shedding Strouhal frequency
    this.stepCount++;
    this.liftHistory.push(cl);
    if (this.liftHistory.length > 120) this.liftHistory.shift();

    // Detect frequency using zero-crossings
    let zeroCrossings = 0;
    for (let k = 1; k < this.liftHistory.length; k++) {
      if (
        (this.liftHistory[k] >= 0 && this.liftHistory[k - 1] < 0) ||
        (this.liftHistory[k] < 0 && this.liftHistory[k - 1] >= 0)
      ) {
        zeroCrossings++;
      }
    }
    const sheddingPeriodSteps =
      zeroCrossings > 1 ? (2 * this.liftHistory.length) / zeroCrossings : 100;
    const sheddingFreqHz = Math.min(120, Math.max(0.5, 60.0 / sheddingPeriodSteps));

    const isStalled = Math.abs(this.metrics.angleDeg) >= 16 || (cd > 0.4 && cl < 0.3) || Math.abs(cl) > 1.5;

    this.metrics = {
      liftForce: lift,
      dragForce: drag,
      liftCoeff: cl,
      dragCoeff: Math.max(0.005, cd),
      liftToDragRatio: Math.max(-50, Math.min(50, ld)),
      angleDeg: this.metrics.angleDeg,
      angleRad: (this.metrics.angleDeg * Math.PI) / 180,
      reynolds: (uInlet * chord) / ((this.tau - 0.5) / 3.0),
      circulation,
      strouhalFreq: sheddingFreqHz,
      strouhalNumber: (sheddingFreqHz * (chord / 60)) / (uInlet * 60 + 1e-4),
      isStalled,
      maxVelocity: maxV,
      meanPressure: fluidNodes > 0 ? sumRho / fluidNodes : 1.0,
    };
  }

  /**
   * Samples pressure coefficient Cp(x) along upper and lower surfaces of the obstacle
   */
  public sampleChordPressure(
    originX: number,
    originY: number,
    chord: number,
    angleDeg: number = 0
  ): { xNorm: number; cpUpper: number; cpLower: number }[] {
    const samples: { xNorm: number; cpUpper: number; cpLower: number }[] = [];
    const dynP = 0.5 * 1.0 * this.inletVelocity * this.inletVelocity;
    const numSamples = 20;
    const rad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    for (let s = 0; s <= numSamples; s++) {
      const xNorm = s / numSamples;
      const relChordX = (xNorm - 0.25) * chord;
      const worldX = Math.round(originX + relChordX * cosA);
      const chordY = Math.round(originY - relChordX * sinA);

      if (worldX < 2 || worldX >= this.nx - 2) continue;

      // Scan vertically around chordY to find solid boundaries
      let topY = -1;
      let bottomY = -1;

      for (let y = Math.max(1, chordY - 25); y <= Math.min(this.ny - 2, chordY + 25); y++) {
        const isSolid = this.solidMask[y * this.nx + worldX] === 1;
        if (isSolid && topY === -1) {
          topY = y - 1;
        }
        if (!isSolid && topY !== -1 && bottomY === -1) {
          bottomY = y;
        }
      }

      const pTop = topY >= 0 ? (this.rho[topY * this.nx + worldX] - 1.0) / 3.0 : 0;
      const pBottom = bottomY >= 0 ? (this.rho[bottomY * this.nx + worldX] - 1.0) / 3.0 : 0;

      const cpUpper = dynP > 1e-6 ? pTop / dynP : 0;
      const cpLower = dynP > 1e-6 ? pBottom / dynP : 0;

      samples.push({ xNorm, cpUpper, cpLower });
    }

    return samples;
  }
}
