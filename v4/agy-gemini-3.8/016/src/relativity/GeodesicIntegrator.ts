import { GeodesicParams, GeodesicParticle, MetricType } from '../types';

export class GeodesicIntegrator {
  public particles: GeodesicParticle[] = [];
  public maxTrailLength: number = 300;

  // Cached characteristic radii for current parameters (in units of M)
  public rs: number = 2.0; // Schwarzschild radius
  public rPlus: number = 2.0; // Outer event horizon
  public rMinus: number = 0.0; // Inner Cauchy horizon
  public rErgoEquator: number = 2.0; // Ergosphere outer boundary at equator
  public rPhotonSphere: number = 3.0; // Photon sphere
  public rIsco: number = 6.0; // Innermost Stable Circular Orbit

  constructor() {
    this.updateCharacteristicRadii({
      massM: 1.0,
      spinA: 0.8,
      chargeQ: 0.0,
      metricType: 'KERR',
      launchRadius: 10.0,
      launchSpeed: 0.45,
      launchAngleDeg: 80,
      isPhoton: false,
    });
    this.spawnDefaultParticle();
  }

  public updateCharacteristicRadii(params: GeodesicParams) {
    const M = 1.0; // Normalized geometry
    const a = Math.max(-0.999, Math.min(0.999, params.spinA));
    const Q = Math.max(0.0, Math.min(0.95, params.chargeQ));

    this.rs = 2.0 * M;
    this.rErgoEquator = 2.0 * M;

    if (params.metricType === 'SCHWARZSCHILD') {
      this.rPlus = 2.0 * M;
      this.rMinus = 0.0;
      this.rPhotonSphere = 3.0 * M;
      this.rIsco = 6.0 * M;
    } else if (params.metricType === 'REISSNER_NORDSTROM') {
      const disc = Math.max(0, M * M - Q * Q);
      this.rPlus = M + Math.sqrt(disc);
      this.rMinus = M - Math.sqrt(disc);
      // RN photon sphere
      this.rPhotonSphere = 0.5 * (3 * M + Math.sqrt(9 * M * M - 8 * Q * Q));
      this.rIsco = 6.0 * M * (1.0 - 0.2 * Q * Q);
    } else {
      // KERR METRIC
      const disc = Math.max(0, M * M - a * a);
      this.rPlus = M + Math.sqrt(disc);
      this.rMinus = M - Math.sqrt(disc);

      // Kerr equatorial photon sphere (prograde vs retrograde)
      const sgn = a >= 0 ? 1 : -1;
      const absA = Math.abs(a);
      this.rPhotonSphere = 2.0 * M * (1.0 + Math.cos((2.0 / 3.0) * Math.acos(-sgn * absA)));

      // Bardeen-Press-Teukolsky formula for Kerr equatorial ISCO:
      const Z1 = 1.0 + Math.cbrt(1.0 - a * a) * (Math.cbrt(1.0 + a) + Math.cbrt(1.0 - a));
      const Z2 = Math.sqrt(3.0 * a * a + Z1 * Z1);
      const iscoFactor = 3.0 + Z2 - (sgn >= 0 ? 1.0 : -1.0) * Math.sqrt((3.0 - Z1) * (3.0 + Z1 + 2.0 * Z2));
      this.rIsco = Math.max(this.rPlus + 0.05, M * iscoFactor);
    }
  }

  public spawnDefaultParticle() {
    this.particles = [];
    this.addParticle({
      massM: 1.0,
      spinA: 0.8,
      chargeQ: 0.0,
      metricType: 'KERR',
      launchRadius: 9.0,
      launchSpeed: 0.35,
      launchAngleDeg: 85,
      isPhoton: false,
    });
  }

  public addParticle(params: GeodesicParams) {
    const r0 = params.launchRadius;
    const phi0 = 0.0;
    const x = r0 * Math.cos(phi0);
    const y = r0 * Math.sin(phi0);
    const angleRad = (params.launchAngleDeg * Math.PI) / 180.0;
    const speed = params.isPhoton ? 1.0 : params.launchSpeed;

    const vx = speed * Math.cos(angleRad);
    const vy = speed * Math.sin(angleRad);

    const id = `geo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const color = params.isPhoton ? '#38bdf8' : '#f59e0b';

    // Conserved angular momentum L and energy E approximation
    const L = x * vy - y * vx;
    const E = 1.0;

    this.particles.push({
      id,
      x,
      y,
      z: 0.0,
      vx,
      vy,
      vz: 0.0,
      isPhoton: params.isPhoton,
      energy: E,
      angularMomentum: L,
      trail: [{ x, y }],
      isCaptured: false,
      color,
    });
  }

  public clearParticles() {
    this.particles = [];
  }

  /**
   * 4th-order Runge-Kutta integration of general relativistic geodesic equations
   * with adaptive sub-stepping near horizon for CFL stability
   */
  public step(params: GeodesicParams, dt: number = 0.035) {
    this.updateCharacteristicRadii(params);
    const a = params.metricType === 'KERR' ? params.spinA : 0.0;
    const Q = params.metricType === 'REISSNER_NORDSTROM' ? params.chargeQ : 0.0;
    const M = 1.0;
    const rH = this.rPlus;

    for (const p of this.particles) {
      if (p.isCaptured) continue;

      const currentR = Math.sqrt(p.x * p.x + p.y * p.y);
      if (currentR <= rH * 1.02) {
        p.isCaptured = true;
        continue;
      }

      // Adaptive sub-stepping near horizon to satisfy CFL condition:
      const subSteps = currentR < 4.0 ? 4 : currentR < 8.0 ? 2 : 1;
      const subDt = dt / subSteps;

      for (let s = 0; s < subSteps; s++) {
        // RK4 step
        const state = [p.x, p.y, p.vx, p.vy];
        const k1 = this.derivatives(state, a, Q, M, p.isPhoton);

        const s2 = [
          state[0] + 0.5 * subDt * k1[0],
          state[1] + 0.5 * subDt * k1[1],
          state[2] + 0.5 * subDt * k1[2],
          state[3] + 0.5 * subDt * k1[3],
        ];
        const k2 = this.derivatives(s2, a, Q, M, p.isPhoton);

        const s3 = [
          state[0] + 0.5 * subDt * k2[0],
          state[1] + 0.5 * subDt * k2[1],
          state[2] + 0.5 * subDt * k2[2],
          state[3] + 0.5 * subDt * k2[3],
        ];
        const k3 = this.derivatives(s3, a, Q, M, p.isPhoton);

        const s4 = [
          state[0] + subDt * k3[0],
          state[1] + subDt * k3[1],
          state[2] + subDt * k3[2],
          state[3] + subDt * k3[3],
        ];
        const k4 = this.derivatives(s4, a, Q, M, p.isPhoton);

        p.x += (subDt / 6.0) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        p.y += (subDt / 6.0) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        p.vx += (subDt / 6.0) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
        p.vy += (subDt / 6.0) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);

        // Immediate sub-step horizon capture check
        const rSub = Math.sqrt(p.x * p.x + p.y * p.y);
        if (rSub <= rH * 1.02) {
          p.isCaptured = true;
          break;
        }
      }

      // Record trail
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > this.maxTrailLength) {
        p.trail.shift();
      }
    }
  }

  /**
   * Geodesic acceleration in curved spacetime:
   * d^2x/dlambda^2 = -Gamma^x_ab dx^a dx^b
   * Incorporating Newtonian term + 1PN Schwarzschild precession + RN electric term + 1.5PN Kerr Lense-Thirring
   */
  private derivatives(state: number[], a: number, Q: number, M: number, isPhoton: boolean): number[] {
    const x = state[0];
    const y = state[1];
    const vx = state[2];
    const vy = state[3];

    const rSq = x * x + y * y;
    const r = Math.sqrt(Math.max(1e-4, rSq));

    // Specific angular momentum L_z = x*vy - y*vx
    const Lz = x * vy - y * vx;

    // 1. Classical Newtonian / Schwarzschild radial attraction with relativistic effective potential correction
    // V_eff(r) = -M/r + L^2/(2 r^2) - M L^2 / r^3
    // Radial acceleration: a_r = -M/r^2 + L^2/r^3 - 3 M L^2 / r^4
    const invR2 = 1.0 / rSq;
    const invR3 = invR2 / r;
    const invR4 = invR3 / r;

    // Relativistic extra bending / precession factor
    const photonFactor = isPhoton ? 3.0 : 1.0;
    const aNewt = -M * invR2;
    const aRelPrecession = -3.0 * photonFactor * M * (Lz * Lz) * invR4;
    let totalRadialA = aNewt + aRelPrecession;

    // Reissner-Nordström electrostatic energy repulsion: + Q^2 / r^3
    if (Q > 0.01) {
      const aRN = (Q * Q) * invR3;
      totalRadialA += aRN;
    }

    let ax = totalRadialA * (x / r);
    let ay = totalRadialA * (y / r);

    // 2. Kerr Lense-Thirring frame dragging:
    // Produces azimuthal force F_phi = 2 M a / r^3 * v_r
    if (Math.abs(a) > 0.001) {
      const vr = (x * vx + y * vy) / r;
      const omegaDrag = (2.0 * M * a) / (rSq * r + a * a * r + 2.0 * M * a * a);

      // Tangential frame-dragging acceleration
      const aDragX = -omegaDrag * vy - (2.0 * M * a * vr / (rSq * r)) * (y / r);
      const aDragY = omegaDrag * vx + (2.0 * M * a * vr / (rSq * r)) * (x / r);

      ax += aDragX * 0.5;
      ay += aDragY * 0.5;
    }

    return [vx, vy, ax, ay];
  }
}
