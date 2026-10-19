export class TsunamiSolver {
  public nx: number;
  public dxM: number;
  public dtSec: number;

  // Sea surface elevation above mean sea level (meters)
  public eta: Float32Array;
  // Depth-averaged horizontal current velocity (m/s)
  public u: Float32Array;
  // Equilibrium water depth bathymetry (meters)
  public bathymetry: Float32Array;
  // Seafloor dynamic displacement (meters)
  public seafloorUplift: Float32Array;

  // Key metrics
  public maxRunupM: number = 0;
  public leadingWaveHeightM: number = 0;
  public oceanSpeedKmh: number = 0;

  private g: number = 9.81; // Gravity (m/s^2)
  private frictionCf: number = 0.0025; // Manning seafloor friction factor

  // Persistent reusable buffers (zero per-frame GC allocations)
  private tempNewEta: Float32Array;
  private tempNewU: Float32Array;

  constructor(nx: number = 240, dxKm: number = 1.0) {
    this.nx = nx;
    this.dxM = dxKm * 1000; // 1000m per grid cell
    this.dtSec = 0.5; // Tsunami CFL condition: dt < dx / sqrt(g * Hmax)

    this.eta = new Float32Array(nx);
    this.u = new Float32Array(nx);
    this.bathymetry = new Float32Array(nx);
    this.seafloorUplift = new Float32Array(nx);
    this.tempNewEta = new Float32Array(nx);
    this.tempNewU = new Float32Array(nx);

    this.initBathymetry();
  }

  /**
   * Initializes realistic ocean trench to continental shelf bathymetry profile
   */
  public initBathymetry(trenchDepthM: number = 4200): void {
    const nx = this.nx;
    for (let x = 0; x < nx; x++) {
      const frac = x / nx;
      if (frac < 0.45) {
        // Deep oceanic abyssal plain / subduction trench
        this.bathymetry[x] = trenchDepthM;
      } else if (frac < 0.85) {
        // Continental slope shoaling transition
        const t = (frac - 0.45) / 0.4;
        this.bathymetry[x] = trenchDepthM * (1.0 - t * 0.95);
      } else {
        // Shallow continental shelf & coastal shoreline
        const t = (frac - 0.85) / 0.15;
        this.bathymetry[x] = Math.max(8.0, trenchDepthM * 0.05 * (1.0 - t * 0.85));
      }
    }
  }

  /**
   * Transfers dynamic vertical ground displacement from megathrust rupture into ocean column
   */
  public triggerUplift(ruptureXKm: number, upliftHeightM: number, widthKm: number = 35): void {
    const centerIdx = Math.floor(ruptureXKm);
    const radiusCells = Math.floor(widthKm / 2);

    for (let dx = -radiusCells; dx <= radiusCells; dx++) {
      const x = centerIdx + dx;
      if (x >= 0 && x < this.nx) {
        const bell = Math.cos((dx / radiusCells) * (Math.PI * 0.5));
        const dUplift = upliftHeightM * bell * bell;
        this.seafloorUplift[x] = dUplift;
        // Direct incompressible water column transfer: eta_initial = uplift
        this.eta[x] += dUplift;
      }
    }
  }

  /**
   * Integrates 1D non-linear shallow water equations (SWE) with shoaling
   */
  public step(): void {
    const nx = this.nx;
    const dx = this.dxM;
    const dt = this.dtSec;
    const g = this.g;

    const newEta = this.tempNewEta;
    const newU = this.tempNewU;

    let maxWave = 0;

    // 1. Continuity Equation: d(eta)/dt + d((H + eta) * u) / dx = 0
    for (let x = 1; x < nx - 1; x++) {
      const totalDepthR = Math.max(0.5, this.bathymetry[x + 1] + this.eta[x + 1]);
      const totalDepthL = Math.max(0.5, this.bathymetry[x - 1] + this.eta[x - 1]);

      const fluxR = totalDepthR * this.u[x + 1];
      const fluxL = totalDepthL * this.u[x - 1];

      const dFlux_dx = (fluxR - fluxL) / (2.0 * dx);
      newEta[x] = this.eta[x] - dt * dFlux_dx;

      // Damp boundary
      if (x < 4 || x > nx - 5) {
        newEta[x] *= 0.96;
      }

      if (Math.abs(newEta[x]) > maxWave) {
        maxWave = Math.abs(newEta[x]);
      }
    }

    // 2. Momentum Equation: du/dt + u * du/dx + g * d(eta)/dx = -cf * u * |u| / (H + eta)
    for (let x = 1; x < nx - 1; x++) {
      const totalDepth = Math.max(0.5, this.bathymetry[x] + this.eta[x]);
      const deta_dx = (newEta[x + 1] - newEta[x - 1]) / (2.0 * dx);
      const uVal = this.u[x];
      const du_dx = (this.u[x + 1] - this.u[x - 1]) / (2.0 * dx);

      const friction = (this.frictionCf * uVal * Math.abs(uVal)) / totalDepth;
      newU[x] = (uVal - dt * (uVal * du_dx + g * deta_dx + friction));

      // Coastal shore dampening
      if (x >= nx - 8) {
        newU[x] *= 0.88;
      }
    }

    this.eta.set(newEta);
    this.u.set(newU);

    this.leadingWaveHeightM = maxWave;
    const deepDepth = this.bathymetry[10] || 4000;
    // Tsunami celerity c = sqrt(g * H)
    const cMs = Math.sqrt(g * deepDepth);
    this.oceanSpeedKmh = cMs * 3.6;

    // Track coastal run-up at shelf shore (x > 88% width)
    const coastalStart = Math.floor(nx * 0.88);
    let runup = 0;
    for (let x = coastalStart; x < nx; x++) {
      if (this.eta[x] > runup) runup = this.eta[x];
    }
    if (runup > this.maxRunupM) this.maxRunupM = runup;
  }

  /**
   * Clears tsunami waves and resets to calm equilibrium
   */
  public reset(): void {
    this.eta.fill(0.0);
    this.u.fill(0.0);
    this.seafloorUplift.fill(0.0);
    this.maxRunupM = 0;
    this.leadingWaveHeightM = 0;
  }
}
