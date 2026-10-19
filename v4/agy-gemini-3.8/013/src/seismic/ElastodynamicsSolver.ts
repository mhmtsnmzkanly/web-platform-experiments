import { GeologyLayer, FaultConfig, WaveFieldDisplayMode } from '../types';

export class ElastodynamicsSolver {
  public nx: number;
  public nz: number;
  public numCells: number;
  public dxKm: number;
  public dzKm: number;
  public dtSec: number;

  // Staggered grid velocity fields
  public vx: Float32Array; // Horizontal ground velocity (km/s)
  public vz: Float32Array; // Vertical ground velocity (km/s)

  // Stress tensor fields (MPa or GPa scaled)
  public sxx: Float32Array; // Normal stress XX
  public szz: Float32Array; // Normal stress ZZ
  public sxz: Float32Array; // Shear stress XZ

  // Medium properties
  public rho: Float32Array; // Density (g/cm^3)
  public lambda: Float32Array; // Lame first parameter
  public mu: Float32Array; // Shear modulus
  public vp: Float32Array; // P-wave velocity field (km/s)
  public vs: Float32Array; // S-wave velocity field (km/s)

  // Derived scalar fields for visualization
  public curl: Float32Array; // Shear / S-wave rotation: dvz/dx - dvx/dz
  public div: Float32Array; // Compression / P-wave dilatation: dvx/dx + dvz/dz
  public velocityMag: Float32Array; // |v| = sqrt(vx^2 + vz^2)

  // Sponge boundary absorption coefficients
  private damp: Float32Array;

  // Simulation time
  public simTimeSec: number = 0;

  constructor(nx: number = 240, nz: number = 120, dxKm: number = 1.0, dzKm: number = 1.0) {
    this.nx = nx;
    this.nz = nz;
    this.numCells = nx * nz;
    this.dxKm = dxKm;
    this.dzKm = dzKm;
    this.dtSec = 0.055; // Meets CFL condition: dt < dx / (sqrt(2) * Vp_max)

    this.vx = new Float32Array(this.numCells);
    this.vz = new Float32Array(this.numCells);
    this.sxx = new Float32Array(this.numCells);
    this.szz = new Float32Array(this.numCells);
    this.sxz = new Float32Array(this.numCells);

    this.rho = new Float32Array(this.numCells);
    this.lambda = new Float32Array(this.numCells);
    this.mu = new Float32Array(this.numCells);
    this.vp = new Float32Array(this.numCells);
    this.vs = new Float32Array(this.numCells);

    this.curl = new Float32Array(this.numCells);
    this.div = new Float32Array(this.numCells);
    this.velocityMag = new Float32Array(this.numCells);

    this.damp = new Float32Array(this.numCells);
    this.initAbsorbingBoundaries();
  }

  /**
   * Initializes PML / sponge absorbing damping along lateral and bottom boundaries
   */
  private initAbsorbingBoundaries(): void {
    const spongeWidth = 18;
    this.damp.fill(1.0);

    for (let z = 0; z < this.nz; z++) {
      for (let x = 0; x < this.nx; x++) {
        const idx = z * this.nx + x;
        let factor = 1.0;

        // Left sponge
        if (x < spongeWidth) {
          const d = (spongeWidth - x) / spongeWidth;
          factor *= Math.exp(-0.06 * d * d);
        }
        // Right sponge
        if (x >= this.nx - spongeWidth) {
          const d = (x - (this.nx - spongeWidth)) / spongeWidth;
          factor *= Math.exp(-0.06 * d * d);
        }
        // Bottom sponge
        if (z >= this.nz - spongeWidth) {
          const d = (z - (this.nz - spongeWidth)) / spongeWidth;
          factor *= Math.exp(-0.06 * d * d);
        }

        this.damp[idx] = factor;
      }
    }
  }

  /**
   * Builds subsurface geological strata (crust, mantle, sediment basin, fault zone)
   */
  public updateGeology(layers: GeologyLayer[], basinDepthKm: number = 0): void {
    const nx = this.nx;
    const nz = this.nz;

    for (let z = 0; z < nz; z++) {
      const depthKm = z * this.dzKm;

      // Find matching geological layer by depth
      let matchedLayer = layers[layers.length - 1];
      for (const layer of layers) {
        if (depthKm >= layer.depthTopKm && depthKm < layer.depthBottomKm) {
          matchedLayer = layer;
          break;
        }
      }

      for (let x = 0; x < nx; x++) {
        const idx = z * nx + x;

        let curVp = matchedLayer.vpKmS;
        let curVs = matchedLayer.vsKmS;
        let curRho = matchedLayer.densityGcm3;

        // Optional low-velocity sedimentary basin (e.g. Los Angeles or Puget Sound basin)
        if (basinDepthKm > 0 && depthKm <= basinDepthKm) {
          const basinCenterX = nx * 0.65;
          const basinHalfWidth = 25;
          const distFromCenter = Math.abs(x - basinCenterX);
          if (distFromCenter < basinHalfWidth) {
            const basinFactor = 1.0 - (distFromCenter / basinHalfWidth);
            const basinProfile = Math.sin((depthKm / basinDepthKm) * Math.PI * 0.5);
            const slowFactor = 1.0 - 0.45 * basinFactor * (1.0 - basinProfile * 0.4);
            curVp *= slowFactor;
            curVs *= slowFactor;
            curRho *= 0.88;
          }
        }

        this.vp[idx] = curVp;
        this.vs[idx] = curVs;
        this.rho[idx] = curRho;

        // Lamé elastodynamic parameters:
        // mu = rho * Vs^2
        // lambda = rho * (Vp^2 - 2 * Vs^2)
        const muVal = curRho * curVs * curVs;
        const lambdaVal = Math.max(0.1, curRho * (curVp * curVp - 2 * curVs * curVs));

        this.mu[idx] = muVal;
        this.lambda[idx] = lambdaVal;
      }
    }
  }

  /**
   * Injects an earthquake slip source at hypocenter (x0, z0)
   */
  public triggerEarthquake(fault: FaultConfig): void {
    const hx = Math.max(5, Math.min(this.nx - 6, Math.floor(fault.hypocenterXKm / this.dxKm)));
    const hz = Math.max(2, Math.min(this.nz - 6, Math.floor(fault.hypocenterDepthKm / this.dzKm)));

    // Moment magnitude scaling: M0 = 10^(1.5 * Mw + 9.1)
    const energyScale = Math.pow(10, (fault.momentMagnitudeMw - 6.0) * 0.8) * 0.15;
    const dipRad = (fault.dipAngleDeg * Math.PI) / 180;

    // Double-couple radiation pattern:
    // Strike-slip / Thrust fault dipole tensor
    const radiusCells = Math.max(2, Math.min(8, Math.round(fault.ruptureLengthKm * 0.1)));

    for (let dz = -radiusCells; dz <= radiusCells; dz++) {
      for (let dx = -radiusCells; dx <= radiusCells; dx++) {
        const x = hx + dx;
        const z = hz + dz;
        if (x >= 0 && x < this.nx && z >= 0 && z < this.nz) {
          const idx = z * this.nx + x;
          const distSq = dx * dx + dz * dz;
          if (distSq <= radiusCells * radiusCells) {
            const bell = Math.exp(-distSq / (radiusCells * 1.5));

            if (fault.mechanism === 'THRUST_SUBDUCTION') {
              // Megathrust uplift: upward compression on hanging wall, downward extension on footwall
              this.vz[idx] -= energyScale * bell * Math.sin(dipRad) * 1.8;
              this.vx[idx] += energyScale * bell * Math.cos(dipRad) * 1.4;
              this.sxz[idx] += energyScale * bell * 3.5;
            } else if (fault.mechanism === 'NORMAL') {
              this.vz[idx] += energyScale * bell * Math.sin(dipRad) * 1.5;
              this.vx[idx] -= energyScale * bell * Math.cos(dipRad) * 1.2;
              this.szz[idx] -= energyScale * bell * 3.0;
            } else {
              // Strike-Slip: strong lateral horizontal shear dipole
              const dipoleSign = dx * dz >= 0 ? 1 : -1;
              this.vx[idx] += dipoleSign * energyScale * bell * 1.6;
              this.vz[idx] -= dipoleSign * energyScale * bell * 1.2;
              this.sxz[idx] += dipoleSign * energyScale * bell * 4.0;
            }
          }
        }
      }
    }
  }

  /**
   * Advances the 2D elastodynamic wave equations by one time step dt
   */
  public step(): void {
    const nx = this.nx;
    const nz = this.nz;
    const dt = this.dtSec;
    const invDx = 1.0 / this.dxKm;
    const invDz = 1.0 / this.dzKm;

    // 1. Update Velocities from Stress Gradients:
    // rho * dvx/dt = d(sxx)/dx + d(sxz)/dz
    // rho * dvz/dt = d(sxz)/dx + d(szz)/dz
    for (let z = 1; z < nz - 1; z++) {
      for (let x = 1; x < nx - 1; x++) {
        const idx = z * nx + x;
        const invRho = 1.0 / this.rho[idx];

        // Central difference stress gradients
        const dsxx_dx = (this.sxx[idx + 1] - this.sxx[idx - 1]) * 0.5 * invDx;
        const dsxz_dz = (this.sxz[idx + nx] - this.sxz[idx - nx]) * 0.5 * invDz;

        const dsxz_dx = (this.sxz[idx + 1] - this.sxz[idx - 1]) * 0.5 * invDx;
        const dszz_dz = (this.szz[idx + nx] - this.szz[idx - nx]) * 0.5 * invDz;

        this.vx[idx] = (this.vx[idx] + dt * invRho * (dsxx_dx + dsxz_dz)) * this.damp[idx];
        this.vz[idx] = (this.vz[idx] + dt * invRho * (dsxz_dx + dszz_dz)) * this.damp[idx];
      }
    }

    // Free Surface Boundary Condition at top (z = 0):
    // szz = 0, sxz = 0. We update surface velocities with stress from below.
    for (let x = 1; x < nx - 1; x++) {
      const idx = x; // z = 0
      const invRho = 1.0 / this.rho[idx];
      const dsxx_dx = (this.sxx[idx + 1] - this.sxx[idx - 1]) * 0.5 * invDx;
      const dsxz_dz = (this.sxz[idx + nx] - 0) * invDz; // sxz=0 at free surface

      const dsxz_dx = (this.sxz[idx + 1] - this.sxz[idx - 1]) * 0.5 * invDx;
      const dszz_dz = (this.szz[idx + nx] - 0) * invDz; // szz=0 at free surface

      this.vx[idx] = (this.vx[idx] + dt * invRho * (dsxx_dx + dsxz_dz)) * this.damp[idx];
      this.vz[idx] = (this.vz[idx] + dt * invRho * (dsxz_dx + dszz_dz)) * this.damp[idx];
    }

    // 2. Update Stress Tensor from Velocity Strain Rates:
    // dsxx/dt = (lambda + 2*mu) * dvx/dx + lambda * dvz/dz
    // dszz/dt = lambda * dvx/dx + (lambda + 2*mu) * dvz/dz
    // dsxz/dt = mu * (dvx/dz + dvz/dx)
    for (let z = 1; z < nz - 1; z++) {
      for (let x = 1; x < nx - 1; x++) {
        const idx = z * nx + x;
        const l = this.lambda[idx];
        const m = this.mu[idx];
        const lPlus2m = l + 2.0 * m;

        const dvx_dx = (this.vx[idx + 1] - this.vx[idx - 1]) * 0.5 * invDx;
        const dvz_dz = (this.vz[idx + nx] - this.vz[idx - nx]) * 0.5 * invDz;

        const dvx_dz = (this.vx[idx + nx] - this.vx[idx - nx]) * 0.5 * invDz;
        const dvz_dx = (this.vz[idx + 1] - this.vz[idx - 1]) * 0.5 * invDx;

        this.sxx[idx] = (this.sxx[idx] + dt * (lPlus2m * dvx_dx + l * dvz_dz)) * this.damp[idx];
        this.szz[idx] = (this.szz[idx] + dt * (l * dvx_dx + lPlus2m * dvz_dz)) * this.damp[idx];
        this.sxz[idx] = (this.sxz[idx] + dt * (m * (dvx_dz + dvz_dx))) * this.damp[idx];
      }
    }

    // Enforce Free Surface Stresses at z = 0
    for (let x = 0; x < nx; x++) {
      this.szz[x] = 0.0;
      this.sxz[x] = 0.0;
    }

    // 3. Compute Derived Observable Fields for Visualization:
    // Curl (S-wave shear/rotation) and Div (P-wave compressional dilatation)
    for (let z = 1; z < nz - 1; z++) {
      for (let x = 1; x < nx - 1; x++) {
        const idx = z * nx + x;

        const dvz_dx = (this.vz[idx + 1] - this.vz[idx - 1]) * 0.5 * invDx;
        const dvx_dz = (this.vx[idx + nx] - this.vx[idx - nx]) * 0.5 * invDz;
        const dvx_dx = (this.vx[idx + 1] - this.vx[idx - 1]) * 0.5 * invDx;
        const dvz_dz = (this.vz[idx + nx] - this.vz[idx - nx]) * 0.5 * invDz;

        this.curl[idx] = dvz_dx - dvx_dz;
        this.div[idx] = dvx_dx + dvz_dz;

        const vxVal = this.vx[idx];
        const vzVal = this.vz[idx];
        this.velocityMag[idx] = Math.sqrt(vxVal * vxVal + vzVal * vzVal);
      }
    }

    this.simTimeSec += dt;
  }

  /**
   * Resets all wavefield velocity and stress variables to zero
   */
  public resetFields(): void {
    this.vx.fill(0.0);
    this.vz.fill(0.0);
    this.sxx.fill(0.0);
    this.szz.fill(0.0);
    this.sxz.fill(0.0);
    this.curl.fill(0.0);
    this.div.fill(0.0);
    this.velocityMag.fill(0.0);
    this.simTimeSec = 0;
  }
}
