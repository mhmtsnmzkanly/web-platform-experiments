import { TdglParameters, PinningSite } from '../types';

export class TimeDependentGinzburgLandau {
  public readonly Nx: number = 120;
  public readonly Ny: number = 120;
  public readonly dx: number = 0.4;
  public readonly dt: number = 0.04;

  // Order parameter psi = u + i*v
  public u: Float32Array;
  public v: Float32Array;
  public nextU: Float32Array;
  public nextV: Float32Array;

  // Vector potential Ax, Ay
  public Ax: Float32Array;
  public Ay: Float32Array;

  // Link variables Ux = cos(Ax*dx) - i*sin(Ax*dx), Uy
  public cosUx: Float32Array;
  public sinUx: Float32Array;
  public cosUy: Float32Array;
  public sinUy: Float32Array;

  // Material and defect map (1.0 = pristine superconductor, 0.0 = deep normal pinning defect)
  public pinningMap: Float32Array;
  public pinningSites: PinningSite[] = [];

  // Supercurrent density components
  public Jx: Float32Array;
  public Jy: Float32Array;
  public localB: Float32Array; // curl A (local magnetic flux density)

  // Metrics cache
  public avgOrderParam: number = 0.8;
  public maxOrderParam: number = 1.0;
  public vortexCount: number = 0;
  public totalSupercurrent: number = 0;

  // Audio trigger flag
  public newVortexDetected: boolean = false;

  constructor() {
    const size = this.Nx * this.Ny;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);

    this.Ax = new Float32Array(size);
    this.Ay = new Float32Array(size);

    this.cosUx = new Float32Array(size);
    this.sinUx = new Float32Array(size);
    this.cosUy = new Float32Array(size);
    this.sinUy = new Float32Array(size);

    this.pinningMap = new Float32Array(size);
    this.Jx = new Float32Array(size);
    this.Jy = new Float32Array(size);
    this.localB = new Float32Array(size);

    this.resetOrderParameter(0.85);
    this.generateDefaultPinningSites(16, 0.8);
  }

  public resetOrderParameter(amplitude: number = 0.85) {
    const size = this.Nx * this.Ny;
    for (let i = 0; i < size; i++) {
      // Small random perturbation to seed vortex nucleation when B > Hc1
      const noise = (Math.random() - 0.5) * 0.02;
      this.u[i] = amplitude + noise;
      this.v[i] = (Math.random() - 0.5) * 0.02;
    }
  }

  public generateDefaultPinningSites(count: number, strength: number) {
    this.pinningSites = [];
    const size = this.Nx * this.Ny;
    this.pinningMap.fill(1.0);

    // Pseudorandom deterministic distribution inside sample boundary
    const margin = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.3;
      const radius = 15 + ((i * 17) % 35);
      const px = Math.floor(this.Nx / 2 + Math.cos(angle) * radius);
      const py = Math.floor(this.Ny / 2 + Math.sin(angle) * radius);

      if (px >= margin && px < this.Nx - margin && py >= margin && py < this.Ny - margin) {
        this.pinningSites.push({
          x: px,
          y: py,
          radius: 2.2,
          strength: strength,
        });
      }
    }
    this.rebuildPinningMap();
  }

  public addPinningSite(x: number, y: number, strength: number = 0.8) {
    this.pinningSites.push({ x, y, radius: 2.5, strength });
    this.rebuildPinningMap();
  }

  public clearPinningSites() {
    this.pinningSites = [];
    this.pinningMap.fill(1.0);
  }

  public rebuildPinningMap() {
    this.pinningMap.fill(1.0);
    const Nx = this.Nx;
    const Ny = this.Ny;

    for (const site of this.pinningSites) {
      const rInt = Math.ceil(site.radius);
      const minX = Math.max(0, site.x - rInt);
      const maxX = Math.min(Nx - 1, site.x + rInt);
      const minY = Math.max(0, site.y - rInt);
      const maxY = Math.min(Ny - 1, site.y + rInt);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const distSq = (x - site.x) ** 2 + (y - site.y) ** 2;
          if (distSq <= site.radius ** 2) {
            const factor = Math.cos((Math.sqrt(distSq) / site.radius) * (Math.PI / 2));
            const idx = y * Nx + x;
            this.pinningMap[idx] = Math.max(0.0, this.pinningMap[idx] - site.strength * factor);
          }
        }
      }
    }
  }

  public updateVectorPotential(params: TdglParameters) {
    const Nx = this.Nx;
    const Ny = this.Ny;
    const dx = this.dx;
    const cx = params.coilCenterX * Nx;
    const cy = params.coilCenterY * Ny;
    const coilR = Math.max(1.0, params.externalCoilRadius);
    const bExt = params.bExt;
    const jExt = params.jExt;

    for (let y = 0; y < Ny; y++) {
      const ry = y - cy;
      for (let x = 0; x < Nx; x++) {
        const rx = x - cx;
        const rSq = rx * rx + ry * ry;
        const idx = y * Nx + x;

        // Coil magnetic field profile
        const coilProfile = Math.exp(-rSq / (2 * coilR * coilR));
        const bLocal = bExt * coilProfile;

        // Symmetric gauge for localized coil
        let ax = -0.5 * bLocal * ry * dx;
        let ay = 0.5 * bLocal * rx * dx;

        // Add uniform transport current gauge term (vector potential in x)
        ax += jExt * 0.15;

        this.Ax[idx] = ax;
        this.Ay[idx] = ay;

        // Precompute link variables: exp(-i * A * dx) = cos(A*dx) - i*sin(A*dx)
        const phaseX = ax * dx;
        this.cosUx[idx] = Math.cos(phaseX);
        this.sinUx[idx] = -Math.sin(phaseX);

        const phaseY = ay * dx;
        this.cosUy[idx] = Math.cos(phaseY);
        this.sinUy[idx] = -Math.sin(phaseY);
      }
    }

    // Compute curl A = dBz
    const inv2dx = 1.0 / (2 * dx);
    for (let y = 1; y < Ny - 1; y++) {
      for (let x = 1; x < Nx - 1; x++) {
        const idx = y * Nx + x;
        const dAy_dx = (this.Ay[idx + 1] - this.Ay[idx - 1]) * inv2dx;
        const dAx_dy = (this.Ax[idx + Nx] - this.Ax[idx - Nx]) * inv2dx;
        this.localB[idx] = dAy_dx - dAx_dy;
      }
    }
  }

  public step(params: TdglParameters) {
    const Nx = this.Nx;
    const Ny = this.Ny;
    const dt = this.dt;
    const invDx2 = 1.0 / (this.dx * this.dx);
    const T_ratio = params.temperatureRatio;

    // Fast boundary check: if T >= Tc, superconductivity quickly quenches
    const a0 = Math.max(-0.5, 1.0 - T_ratio);

    let sumOrder = 0;
    let maxOrder = 0;
    let sumJ = 0;

    // TDGL Gauge-covariant relaxation step
    for (let y = 0; y < Ny; y++) {
      const yPrev = y > 0 ? y - 1 : y;
      const yNext = y < Ny - 1 ? y + 1 : y;

      for (let x = 0; x < Nx; x++) {
        const xPrev = x > 0 ? x - 1 : x;
        const xNext = x < Nx - 1 ? x + 1 : x;

        const idx = y * Nx + x;
        const uC = this.u[idx];
        const vC = this.v[idx];

        // Neighbors and link variables
        // East (x + 1)
        const idxE = y * Nx + xNext;
        const uE = this.u[idxE];
        const vE = this.v[idxE];
        const cUxE = this.cosUx[idx];
        const sUxE = this.sinUx[idx];
        // U_x * psi(x+1)
        const linkEx = cUxE * uE - sUxE * vE;
        const linkEy = cUxE * vE + sUxE * uE;

        // West (x - 1)
        const idxW = y * Nx + xPrev;
        const uW = this.u[idxW];
        const vW = this.v[idxW];
        const cUxW = this.cosUx[idxW];
        const sUxW = -this.sinUx[idxW]; // complex conjugate U_x^*(x-1)
        const linkWx = cUxW * uW - sUxW * vW;
        const linkWy = cUxW * vW + sUxW * uW;

        // North (y + 1)
        const idxN = yNext * Nx + x;
        const uN = this.u[idxN];
        const vN = this.v[idxN];
        const cUyN = this.cosUy[idx];
        const sUyN = this.sinUy[idx];
        const linkNx = cUyN * uN - sUyN * vN;
        const linkNy = cUyN * vN + sUyN * uN;

        // South (y - 1)
        const idxS = yPrev * Nx + x;
        const uS = this.u[idxS];
        const vS = this.v[idxS];
        const cUyS = this.cosUy[idxS];
        const sUyS = -this.sinUy[idxS]; // complex conjugate U_y^*(y-1)
        const linkSx = cUyS * uS - sUyS * vS;
        const linkSy = cUyS * vS + sUyS * uS;

        // Gauge-covariant Laplacian: sum(links) - 4 * psi
        const lapU = (linkEx + linkWx + linkNx + linkSx - 4.0 * uC) * invDx2;
        const lapV = (linkEy + linkWy + linkNy + linkSy - 4.0 * vC) * invDx2;

        // Ginzburg-Landau potential with pinning suppression: (a(x, y) - |psi|^2) * psi
        const psiSq = uC * uC + vC * vC;
        const aLocal = a0 * this.pinningMap[idx];
        const pot = aLocal - psiSq;

        // Euler time evolution: du/dt = lapU + pot * u
        let nU = uC + dt * (lapU + pot * uC);
        let nV = vC + dt * (lapV + pot * vC);

        // Numerical safety clamp to avoid overflow
        if (nU > 1.8) nU = 1.8;
        else if (nU < -1.8) nU = -1.8;
        if (nV > 1.8) nV = 1.8;
        else if (nV < -1.8) nV = -1.8;

        this.nextU[idx] = nU;
        this.nextV[idx] = nV;

        const mag = Math.sqrt(nU * nU + nV * nV);
        sumOrder += mag;
        if (mag > maxOrder) maxOrder = mag;

        // Compute supercurrent components: J_s = Im(psi* U psi)
        const jx = (uC * linkEy - vC * linkEx) / this.dx;
        const jy = (uC * linkNy - vC * linkNx) / this.dx;
        this.Jx[idx] = jx;
        this.Jy[idx] = jy;
        sumJ += Math.sqrt(jx * jx + jy * jy);
      }
    }

    // Swap buffers
    const tempU = this.u;
    this.u = this.nextU;
    this.nextU = tempU;

    const tempV = this.v;
    this.v = this.nextV;
    this.nextV = tempV;

    const totalNodes = Nx * Ny;
    this.avgOrderParam = sumOrder / totalNodes;
    this.maxOrderParam = maxOrder;
    this.totalSupercurrent = sumJ / totalNodes;

    // Detect quantized vortex singularities
    this.countVortices();
  }

  private countVortices() {
    const Nx = this.Nx;
    const Ny = this.Ny;
    let vortices = 0;
    const prevCount = this.vortexCount;

    // Sample interior 2x2 plaquettes
    const step = 2;
    for (let y = 6; y < Ny - 6; y += step) {
      for (let x = 6; x < Nx - 6; x += step) {
        // Compute phase at 4 corners
        const p1 = Math.atan2(this.v[y * Nx + x], this.u[y * Nx + x]);
        const p2 = Math.atan2(this.v[y * Nx + (x + 1)], this.u[y * Nx + (x + 1)]);
        const p3 = Math.atan2(this.v[(y + 1) * Nx + (x + 1)], this.u[(y + 1) * Nx + (x + 1)]);
        const p4 = Math.atan2(this.v[(y + 1) * Nx + x], this.u[(y + 1) * Nx + x]);

        // Phase difference folded to [-pi, pi]
        const d1 = this.foldPhase(p2 - p1);
        const d2 = this.foldPhase(p3 - p2);
        const d3 = this.foldPhase(p4 - p3);
        const d4 = this.foldPhase(p1 - p4);

        const circulation = d1 + d2 + d3 + d4;
        // If circulation ~ 2*pi (winding number = 1), vortex detected
        if (Math.abs(circulation) > 4.5) {
          // Check if core is depressed (order parameter < 0.4)
          const coreMag = Math.sqrt(this.u[y * Nx + x] ** 2 + this.v[y * Nx + x] ** 2);
          if (coreMag < 0.45) {
            vortices++;
          }
        }
      }
    }

    this.vortexCount = vortices;
    this.newVortexDetected = vortices > prevCount;
  }

  private foldPhase(d: number): number {
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }
}
