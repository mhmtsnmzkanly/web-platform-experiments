/**
 * PLASMA-LAB: Grad-Shafranov 2D Toroidal Equilibrium Solver
 * Computes 2D poloidal magnetic flux psi(R, Z), magnetic field components (Br, Bz, Bphi),
 * current density J_phi, and safety factor q(psi) profile for shaped D-shaped tokamaks.
 */

import { TokamakGeometry, RadialProfilePoint } from '../types';

export class GradShafranovSolver {
  public nr: number = 120;
  public nz: number = 120;
  public rMin: number = 1.0;
  public rMax: number = 9.0;
  public zMin: number = -5.0;
  public zMax: number = 5.0;
  public dr: number;
  public dz: number;

  // 2D scalar and vector fields (flattened row-major Float32Array: idx = j * nr + i)
  public psi: Float32Array; // Poloidal flux psi(R, Z) [Wb]
  public normPsi: Float32Array; // Normalized flux [0 at magnetic axis, 1 at separatrix]
  public br: Float32Array; // Radial magnetic field B_R [T]
  public bz: Float32Array; // Vertical magnetic field B_Z [T]
  public bPhi: Float32Array; // Toroidal magnetic field B_phi [T]
  public bTotal: Float32Array; // Total field magnitude |B| [T]
  public jPhi: Float32Array; // Toroidal current density J_phi [MA/m^2]
  public teKev: Float32Array; // Electron temperature T_e [keV]

  // Equilibrium state
  public rAxis: number = 6.2;
  public zAxis: number = 0.0;
  public psiAxis: number = 0.0;
  public psiSep: number = 1.0;
  public q0: number = 1.05;
  public q95: number = 3.2;

  // Persistent scratch buffers to eliminate per-frame allocations
  private radialProfiles: RadialProfilePoint[] = [];

  constructor(geom: TokamakGeometry) {
    this.updateGridBounds(geom);
    this.dr = (this.rMax - this.rMin) / (this.nr - 1);
    this.dz = (this.zMax - this.zMin) / (this.nz - 1);

    const numCells = this.nr * this.nz;
    this.psi = new Float32Array(numCells);
    this.normPsi = new Float32Array(numCells);
    this.br = new Float32Array(numCells);
    this.bz = new Float32Array(numCells);
    this.bPhi = new Float32Array(numCells);
    this.bTotal = new Float32Array(numCells);
    this.jPhi = new Float32Array(numCells);
    this.teKev = new Float32Array(numCells);

    // Pre-allocate 60 persistent radial profile points to eliminate GC allocations
    this.radialProfiles = Array.from({ length: 60 }, (_, i) => ({
      normRadius: i / 59,
      radiusM: 0,
      qValue: 1,
      teKev: 1,
      tiKev: 1,
      densityN20: 1,
      pressureKPa: 0,
      currentDensityMaM2: 0,
      shear: 0,
    }));

    this.solveEquilibrium(geom, 15.0, 0.0);
  }

  /**
   * Adjust grid domain to comfortably bound the tokamak vacuum vessel
   */
  public updateGridBounds(geom: TokamakGeometry): void {
    const marginR = geom.minorRadiusA * 1.6;
    const marginZ = geom.minorRadiusA * geom.elongationKappa * 1.5;

    this.rMin = Math.max(0.1, geom.majorRadiusR0 - marginR);
    this.rMax = geom.majorRadiusR0 + marginR;
    this.zMin = -marginZ;
    this.zMax = marginZ;
    this.dr = (this.rMax - this.rMin) / (this.nr - 1);
    this.dz = (this.zMax - this.zMin) / (this.nz - 1);
  }

  /**
   * Solves Grad-Shafranov equilibrium with D-shaped plasma boundary and X-point divertor
   */
  public solveEquilibrium(
    geom: TokamakGeometry,
    centralTe: number,
    verticalOffsetZ: number
  ): void {
    const { majorRadiusR0: R0, minorRadiusA: a, elongationKappa: kappa, triangularityDelta: delta, toroidalFieldB0: B0, plasmaCurrentIp: Ip } = geom;

    // Shafranov shift of the magnetic axis: Delta ~ (a^2 / 2R0) * (beta_p + li/2)
    const betaPol = Math.min(2.5, 0.2 + (centralTe / 10.0));
    const shafranovShift = (a * a) / (2.0 * R0) * (betaPol + 0.5);
    this.rAxis = R0 + shafranovShift;
    this.zAxis = verticalOffsetZ;

    const nr = this.nr;
    const nz = this.nz;
    const dr = this.dr;
    const dz = this.dz;
    const rMin = this.rMin;
    const zMin = this.zMin;

    // Boundary normalization factor
    const psiEdge = 1.0;
    this.psiSep = psiEdge;
    this.psiAxis = 0.0;

    // 1. Compute Poloidal Flux psi(R, Z) using Solov'ev analytical form with triangularity & X-point
    let minPsi = 1e9;
    let maxPsi = -1e9;

    for (let j = 0; j < nz; j++) {
      const z = zMin + j * dz - this.zAxis;
      for (let i = 0; i < nr; i++) {
        const r = rMin + i * dr;
        const idx = j * nr + i;

        // Normalized radial distance relative to shifted axis
        const x = (r - this.rAxis) / a;
        const y = z / (a * kappa);

        // D-shape distortion factor: x + delta * y^2
        const rDist = Math.hypot(x + delta * (y * y), y);

        // Lower divertor X-point nulling field (near z ~ -a*kappa)
        const xPointZ = -a * kappa * 1.15;
        const xPointR = R0 - a * delta * 0.4;
        const distToXPointSq = (r - xPointR) * (r - xPointR) + (z - xPointZ) * (z - xPointZ);
        const xPointModifier = 1.0 - 0.25 * Math.exp(-distToXPointSq / (a * a * 0.35));

        // Flux function psi ~ rDist^2
        const rawPsi = (rDist * rDist) * xPointModifier;
        this.psi[idx] = rawPsi;

        if (rawPsi < minPsi) minPsi = rawPsi;
        if (rawPsi > maxPsi) maxPsi = rawPsi;
      }
    }

    // 2. Normalize flux and calculate fields
    const mu0 = 4.0 * Math.PI * 1e-7;
    const j0 = (Ip * 1e6) / (Math.PI * a * a * kappa) * 2.0 / 1e6; // MA/m^2 peak

    for (let j = 0; j < nz; j++) {
      const z = zMin + j * dz - this.zAxis;
      for (let i = 0; i < nr; i++) {
        const r = rMin + i * dr;
        const idx = j * nr + i;

        // Normalized flux: 0 on magnetic axis, 1 at separatrix
        const norm = Math.max(0, Math.min(1.5, (this.psi[idx] - minPsi) / (psiEdge - minPsi)));
        this.normPsi[idx] = norm;

        // Toroidal field B_phi ~ R0 * B0 / R
        const bphi = (R0 * B0) / Math.max(0.2, r);
        this.bPhi[idx] = bphi;

        // Inside the plasma core (norm < 1.0)
        if (norm <= 1.0) {
          // Temperature profile: T_e(psi) = T_0 * (1 - psi_norm)^1.5 + T_edge
          const tEdge = 0.05; // 50 eV edge scrape-off
          this.teKev[idx] = (centralTe - tEdge) * Math.pow(Math.max(0, 1.0 - norm), 1.5) + tEdge;

          // Toroidal current density: J_phi ~ (1 - psi_norm)^1.2
          this.jPhi[idx] = j0 * Math.pow(Math.max(0, 1.0 - norm), 1.2);
        } else {
          // Scrape-off layer (SOL) exponential decay
          const solDecay = Math.exp(-(norm - 1.0) / 0.12);
          this.teKev[idx] = 0.05 * solDecay;
          this.jPhi[idx] = 0.0;
        }
      }
    }

    // 3. Finite-difference derivatives for Poloidal Field (including border cells)
    // B_R = -(1/R) * d_psi / dz
    // B_Z = +(1/R) * d_psi / dr
    const psiScale = (B0 * a * a) / (R0 * 2.0); // Calibrate poloidal flux scale

    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nr; i++) {
        const r = rMin + i * dr;
        const idx = j * nr + i;

        // Radial derivative dPsiDr
        let dPsiDr: number;
        if (i === 0) {
          dPsiDr = ((this.psi[idx + 1] - this.psi[idx]) / dr) * psiScale;
        } else if (i === nr - 1) {
          dPsiDr = ((this.psi[idx] - this.psi[idx - 1]) / dr) * psiScale;
        } else {
          dPsiDr = ((this.psi[idx + 1] - this.psi[idx - 1]) / (2.0 * dr)) * psiScale;
        }

        // Vertical derivative dPsiDz
        let dPsiDz: number;
        if (j === 0) {
          dPsiDz = ((this.psi[idx + nr] - this.psi[idx]) / dz) * psiScale;
        } else if (j === nz - 1) {
          dPsiDz = ((this.psi[idx] - this.psi[idx - nr]) / dz) * psiScale;
        } else {
          dPsiDz = ((this.psi[idx + nr] - this.psi[idx - nr]) / (2.0 * dz)) * psiScale;
        }

        const brVal = -(1.0 / r) * dPsiDz;
        const bzVal = (1.0 / r) * dPsiDr;

        this.br[idx] = brVal;
        this.bz[idx] = bzVal;
        this.bTotal[idx] = Math.hypot(this.bPhi[idx], Math.hypot(brVal, bzVal));
      }
    }

    // 4. Compute Safety Factor Profile q(r)
    // q_0 ~ (2 * B0) / (R0 * mu0 * J0) * (1 + kappa^2)/(2 * kappa)
    const qCyl = (2.0 * Math.PI * a * a * kappa * B0) / (mu0 * Ip * 1e6 * R0);
    this.q0 = Math.max(0.85, qCyl * 0.7);
    this.q95 = Math.max(2.1, qCyl * ((1.0 + kappa * kappa * (1.0 + 2.0 * delta * delta - 1.2 * delta * delta * delta)) / 2.0) * 1.35);

    // Build 60-point radial profile array
    this.updateRadialProfiles(geom, centralTe);
  }

  /**
   * Generates discrete 1D radial profiles along midplane z = 0 from r/a = 0 to 1
   * Mutates pre-allocated radialProfiles in place (zero GC overhead)
   */
  private updateRadialProfiles(geom: TokamakGeometry, centralTe: number): void {
    const numPoints = 60;
    const { minorRadiusA: a, plasmaCurrentIp: Ip } = geom;
    const j0 = (Ip * 1e6) / (Math.PI * a * a * geom.elongationKappa) * 2.0 / 1e6;

    for (let i = 0; i < numPoints; i++) {
      const rho = i / (numPoints - 1); // r/a in [0, 1]
      const rMeters = rho * a;

      // Parabolic safety factor q(rho) = q_0 + (q_95 - q_0) * rho^2
      const qVal = this.q0 + (this.q95 - this.q0) * (rho * rho);

      // Magnetic shear s = (r/q) * dq/dr = (rho/q) * 2*(q95 - q0)*rho = 2*(q95 - q0)*rho^2 / q
      const shear = (2.0 * (this.q95 - this.q0) * rho * rho) / Math.max(0.5, qVal);

      // Profiles
      const teKev = centralTe * Math.pow(Math.max(0, 1.0 - rho * rho), 1.5) + 0.05;
      const tiKev = teKev * 0.95; // T_i closely coupled to T_e
      const densityN20 = 1.0 * Math.pow(Math.max(0, 1.0 - rho * rho), 0.5) + 0.1; // n_e in 10^20 m^-3
      const pressureKPa = 2.0 * densityN20 * 16.02 * teKev;
      const currentDensityMaM2 = j0 * Math.pow(Math.max(0, 1.0 - rho * rho), 1.2);

      const pt = this.radialProfiles[i];
      pt.normRadius = rho;
      pt.radiusM = rMeters;
      pt.qValue = qVal;
      pt.teKev = teKev;
      pt.tiKev = tiKev;
      pt.densityN20 = densityN20;
      pt.pressureKPa = pressureKPa;
      pt.currentDensityMaM2 = currentDensityMaM2;
      pt.shear = shear;
    }
  }

  public getRadialProfiles(): RadialProfilePoint[] {
    return this.radialProfiles;
  }
}
