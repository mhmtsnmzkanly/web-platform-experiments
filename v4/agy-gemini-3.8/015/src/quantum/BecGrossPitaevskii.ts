import { BecParameters } from '../types';

export class BecGrossPitaevskii {
  public readonly Nx: number = 120;
  public readonly Ny: number = 120;
  public readonly dx: number = 0.5;
  public readonly dt: number = 0.02;

  // Wavefunction psi = psiReal + i * psiImag
  public psiReal: Float32Array;
  public psiImag: Float32Array;
  public tempReal: Float32Array;
  public tempImag: Float32Array;

  // Density and Phase
  public density: Float32Array;
  public phase: Float32Array;

  // Potential field V(x, y)
  public potential: Float32Array;

  // Metrics
  public totalNorm: number = 1.0;
  public maxDensity: number = 0.01;
  public condensateFraction: number = 0.95;
  public interferenceVisibility: number = 0.0;
  public stirringAngle: number = 0.0;

  constructor() {
    const size = this.Nx * this.Ny;
    this.psiReal = new Float32Array(size);
    this.psiImag = new Float32Array(size);
    this.tempReal = new Float32Array(size);
    this.tempImag = new Float32Array(size);
    this.density = new Float32Array(size);
    this.phase = new Float32Array(size);
    this.potential = new Float32Array(size);

    this.initializeGroundState();
  }

  public initializeGroundState(isDoubleWell: boolean = true) {
    const Nx = this.Nx;
    const Ny = this.Ny;
    const cx = Nx / 2;
    const cy = Ny / 2;
    let sumNorm = 0;

    for (let y = 0; y < Ny; y++) {
      const dy = (y - cy) * this.dx;
      for (let x = 0; x < Nx; x++) {
        const dx = (x - cx) * this.dx;
        const idx = y * Nx + x;

        let amp: number;
        if (isDoubleWell) {
          // Two symmetric Gaussian lobes
          const d1 = (dx - 4.5) ** 2 + dy ** 2;
          const d2 = (dx + 4.5) ** 2 + dy ** 2;
          amp = Math.exp(-d1 / 18.0) + Math.exp(-d2 / 18.0);
        } else {
          // Single central condensate
          const d = dx * dx + dy * dy;
          amp = Math.exp(-d / 28.0);
        }

        this.psiReal[idx] = amp;
        this.psiImag[idx] = 0.0;
        sumNorm += amp * amp * (this.dx * this.dx);
      }
    }

    // Normalize wavefunction to 1.0
    const invSqrtNorm = 1.0 / Math.sqrt(Math.max(1e-6, sumNorm));
    for (let i = 0; i < this.psiReal.length; i++) {
      this.psiReal[i] *= invSqrtNorm;
      this.density[i] = this.psiReal[i] ** 2;
    }
  }

  public updatePotential(params: BecParameters) {
    const Nx = this.Nx;
    const Ny = this.Ny;
    const cx = Nx / 2;
    const cy = Ny / 2;
    const omegaX = 0.08;
    const omegaY = 0.08 * params.trapAspect;
    const vBarrier = params.timeOfFlight ? 0.0 : params.barrierHeight;
    const sigmaBarrier = params.barrierWidth;
    const isTOF = params.timeOfFlight;

    // Stirring laser spoon position
    const stirR = 6.0;
    const stirX = cx + Math.cos(this.stirringAngle) * (stirR / this.dx);
    const stirY = cy + Math.sin(this.stirringAngle) * (stirR / this.dx);
    const spoonStrength = params.stirringActive ? 8.0 : 0.0;

    for (let y = 0; y < Ny; y++) {
      const dy = (y - cy) * this.dx;
      for (let x = 0; x < Nx; x++) {
        const dx = (x - cx) * this.dx;
        const idx = y * Nx + x;

        // If time-of-flight is active, trap is turned off
        let vHarmonic = 0.0;
        if (!isTOF) {
          vHarmonic = 0.5 * (omegaX * omegaX * dx * dx + omegaY * omegaY * dy * dy);
        }

        // Gaussian optical barrier along x=0
        const vOptical = vBarrier * Math.exp(-(dx * dx) / (2 * sigmaBarrier * sigmaBarrier));

        // Laser stirring spoon
        let vLaser = 0.0;
        if (spoonStrength > 0) {
          const ldx = x - stirX;
          const ldy = y - stirY;
          vLaser = spoonStrength * Math.exp(-(ldx * ldx + ldy * ldy) / 12.0);
        }

        this.potential[idx] = vHarmonic + vOptical + vLaser;
      }
    }
  }

  public step(params: BecParameters) {
    const Nx = this.Nx;
    const Ny = this.Ny;
    const dt = this.dt;
    const halfDt = dt * 0.5;
    const invDx2 = 1.0 / (this.dx * this.dx);
    const g = params.scatteringG;

    // Update stirring rotation
    if (params.stirringActive) {
      this.stirringAngle += params.stirringSpeed * 0.04;
    }

    this.updatePotential(params);

    // 1. Half-step Potential & Non-linear phase kick: exp(-i * (V + g*|psi|^2) * dt / 2)
    for (let i = 0; i < this.psiReal.length; i++) {
      const u = this.psiReal[i];
      const v = this.psiImag[i];
      const dens = u * u + v * v;
      const phaseAngle = -(this.potential[i] + g * dens * 20.0) * halfDt;

      const cosP = Math.cos(phaseAngle);
      const sinP = Math.sin(phaseAngle);

      this.tempReal[i] = u * cosP - v * sinP;
      this.tempImag[i] = u * sinP + v * cosP;
    }

    // 2. Full-step Kinetic Energy propagation: dpsi/dt = i * (1/2) * laplacian(psi)
    // Symplectic staggered leapfrog integration:
    // First update real part using Laplacian of imaginary part:
    for (let y = 1; y < Ny - 1; y++) {
      for (let x = 1; x < Nx - 1; x++) {
        const idx = y * Nx + x;
        const lapV =
          (this.tempImag[idx + 1] +
            this.tempImag[idx - 1] +
            this.tempImag[idx + Nx] +
            this.tempImag[idx - Nx] -
            4.0 * this.tempImag[idx]) *
          invDx2;

        this.psiReal[idx] = this.tempReal[idx] + dt * (0.5 * lapV);
      }
    }

    // Next update imaginary part using Laplacian of newly updated real part:
    for (let y = 1; y < Ny - 1; y++) {
      for (let x = 1; x < Nx - 1; x++) {
        const idx = y * Nx + x;
        const lapU =
          (this.psiReal[idx + 1] +
            this.psiReal[idx - 1] +
            this.psiReal[idx + Nx] +
            this.psiReal[idx - Nx] -
            4.0 * this.psiReal[idx]) *
          invDx2;

        this.psiImag[idx] = this.tempImag[idx] - dt * (0.5 * lapU);
      }
    }

    // Absorbing boundary condition at outer edge
    for (let y = 0; y < Ny; y++) {
      for (let x = 0; x < Nx; x++) {
        if (x < 3 || x >= Nx - 3 || y < 3 || y >= Ny - 3) {
          const idx = y * Nx + x;
          this.psiReal[idx] *= 0.85;
          this.psiImag[idx] *= 0.85;
        }
      }
    }

    // 3. Second Half-step Potential kick & metrics collection
    let sumDens = 0;
    for (let i = 0; i < this.psiReal.length; i++) {
      const u = this.psiReal[i];
      const v = this.psiImag[i];
      const dens = u * u + v * v;
      const phaseAngle = -(this.potential[i] + g * dens * 20.0) * halfDt;

      const cosP = Math.cos(phaseAngle);
      const sinP = Math.sin(phaseAngle);

      const finalU = u * cosP - v * sinP;
      const finalV = u * sinP + v * cosP;

      this.psiReal[i] = finalU;
      this.psiImag[i] = finalV;
      sumDens += (finalU * finalU + finalV * finalV) * (this.dx * this.dx);
    }

    // Enforce strict macroscopic L2 norm conservation (sum |psi|^2 dx^2 = 1.0)
    const normFactor = 1.0 / Math.sqrt(Math.max(1e-9, sumDens));
    let maxDens = 0;
    for (let i = 0; i < this.psiReal.length; i++) {
      this.psiReal[i] *= normFactor;
      this.psiImag[i] *= normFactor;

      const dens = this.psiReal[i] * this.psiReal[i] + this.psiImag[i] * this.psiImag[i];
      this.density[i] = dens;
      this.phase[i] = Math.atan2(this.psiImag[i], this.psiReal[i]);

      if (dens > maxDens) maxDens = dens;
    }

    this.totalNorm = 1.0;
    this.maxDensity = maxDens;

    // Condensate fraction estimate
    this.condensateFraction = Math.min(1.0, Math.max(0.0, 1.0 - 0.05 * Math.abs(params.scatteringG)));

    // Calculate interference visibility across central horizontal slice
    this.computeInterferenceFringes();
  }

  private computeInterferenceFringes() {
    const cy = Math.floor(this.Ny / 2);
    const Nx = this.Nx;
    let minD = 1e9;
    let maxD = -1e9;

    // Scan center 40 grid cells
    for (let x = Math.floor(Nx / 2 - 20); x <= Math.floor(Nx / 2 + 20); x++) {
      const d = this.density[cy * Nx + x];
      if (d < minD) minD = d;
      if (d > maxD) maxD = d;
    }

    if (maxD > 1e-5 && maxD + minD > 1e-5) {
      this.interferenceVisibility = Math.max(0, Math.min(1.0, (maxD - minD) / (maxD + minD)));
    } else {
      this.interferenceVisibility = 0;
    }
  }
}
