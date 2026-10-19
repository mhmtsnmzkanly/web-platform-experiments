/**
 * PLASMA-LAB: Magnetohydrodynamic (MHD) Instability & Disruption Engine
 * Models Troyon beta limits, Greenwald density limits, Rutherford m=2/1 tearing modes,
 * Vertical Displacement Events (VDE), and Poincaré puncture field-line maps.
 */

import { TokamakGeometry, PlasmaControls, TokamakMetrics, PoincarePoint } from '../types';
import { GradShafranovSolver } from './GradShafranovSolver';
import { ThermonuclearEngine } from './ThermonuclearEngine';

export class MhdInstabilityEngine {
  // Operational instability indices
  public troyonBetaN: number = 2.4;
  public greenwaldFraction: number = 0.72;
  public tearingIslandWidthCm: number = 2.5;
  public verticalOffsetZMm: number = 0.0;
  public verticalVelocityZMmS: number = 0.0;
  public disruptionRisk: number = 0.05;
  public isDisrupted: boolean = false;
  public disruptionReason: string | null = null;

  // Mirnov coil magnetic oscillation frequency & amplitude
  public mirnovAmplitudeGauss: number = 1.2;
  public mirnovFreqKhz: number = 8.5;

  // Poincaré map storage (cached for 60fps rendering without allocations)
  public poincarePoints: PoincarePoint[] = [];

  constructor() {
    this.initPoincareMap(6.2, 2.0, 1.85, 0.45);
  }

  public reset(): void {
    this.verticalOffsetZMm = 0.0;
    this.verticalVelocityZMmS = 0.0;
    this.tearingIslandWidthCm = 2.5;
    this.disruptionRisk = 0.05;
    this.isDisrupted = false;
    this.disruptionReason = null;
  }

  /**
   * Initializes Poincaré puncture map showing nested KAM surfaces and magnetic island chains
   */
  public initPoincareMap(R0: number, a: number, kappa: number, delta: number): void {
    this.poincarePoints = [];
    const numSurfaces = 14;
    const pointsPerSurface = 80;

    for (let s = 1; s <= numSurfaces; s++) {
      const rho = (s / (numSurfaces + 1)); // normalized radius
      const surfaceA = rho * a;

      for (let p = 0; p < pointsPerSurface; p++) {
        const theta = (p / pointsPerSurface) * 2.0 * Math.PI;

        // Base D-shape geometry
        let r = R0 + surfaceA * Math.cos(theta + delta * Math.sin(theta));
        let z = surfaceA * kappa * Math.sin(theta);

        // Add m=2 tearing mode magnetic island perturbation at resonant surface (s ~ 8, q=2)
        if (s >= 7 && s <= 9) {
          const islandMod = 0.08 * a * Math.sin(2.0 * theta);
          r += islandMod * Math.cos(theta);
          z += islandMod * Math.sin(theta);
        }

        this.poincarePoints.push({
          r,
          z,
          surfaceIdx: s,
        });
      }
    }
  }

  /**
   * Evaluates MHD stability limits, VDE drift, and tearing island growth
   */
  public step(
    geom: TokamakGeometry,
    controls: PlasmaControls,
    solver: GradShafranovSolver,
    thermo: ThermonuclearEngine,
    dtSec: number
  ): void {
    const { majorRadiusR0: R0, minorRadiusA: a, elongationKappa: kappa, toroidalFieldB0: B0, plasmaCurrentIp: Ip } = geom;

    // If already disrupted, hold in quenched state until user resets
    if (this.isDisrupted) {
      this.disruptionRisk = 1.0;
      thermo.centralTeKev = Math.max(0.02, thermo.centralTeKev * 0.95);
      thermo.storedThermalEnergyMj = Math.max(0.5, thermo.storedThermalEnergyMj * 0.92);
      return;
    }

    // 1. Troyon Normalized Beta Limit:
    // beta_T = 2 * mu_0 * <p> / B0^2 (%)
    // beta_N = beta_T (%) * a(m) * B0(T) / Ip(MA)
    const mu0 = 4.0 * Math.PI * 1e-7;
    // <p> in Pascals: average pressure = 2 * n_e * k_B * T * peaking_factor (0.5)
    // 1 keV = 1.60217663e-16 J; n_e = lineAvgDensityN20 * 1e20 m^-3
    const avgPressurePa = 2.0 * (thermo.lineAvgDensityN20 * 1e20) * (thermo.centralTeKev * 1.60217663e-16) * 0.5;
    const betaTotalPct = (2.0 * mu0 * avgPressurePa / (B0 * B0)) * 100.0;
    this.troyonBetaN = (betaTotalPct * a * B0) / Math.max(0.5, Ip);

    // 2. Greenwald Density Limit Fraction:
    // n_GW = Ip(MA) / (pi * a^2) in 10^20 m^-3
    const nGreenwald = Ip / (Math.PI * a * a);
    this.greenwaldFraction = thermo.lineAvgDensityN20 / Math.max(0.1, nGreenwald);

    // 3. Resonant m=2/1 Tearing Mode Island Growth (Rutherford equation):
    // dw/dt ~ eta/mu0 * (Delta' - alpha * w)
    const q95 = solver.q95;
    let islandGrowthRate = 0.0;

    // Island grows if q95 approaches 2.0 or if Troyon beta is high
    if (q95 < 2.5) {
      islandGrowthRate += (2.5 - q95) * 8.0;
    }
    if (this.troyonBetaN > 3.0) {
      islandGrowthRate += (this.troyonBetaN - 3.0) * 6.0;
    }
    if (this.greenwaldFraction > 0.95) {
      islandGrowthRate += (this.greenwaldFraction - 0.95) * 12.0;
    }

    // Natural resistive damping
    islandGrowthRate -= 0.6 * this.tearingIslandWidthCm;
    this.tearingIslandWidthCm = Math.max(0.5, Math.min(45.0, this.tearingIslandWidthCm + islandGrowthRate * dtSec));

    // Update Mirnov frequency and magnetic fluctuation amplitude
    this.mirnovFreqKhz = Math.max(1.0, 12.0 - this.tearingIslandWidthCm * 0.25);
    this.mirnovAmplitudeGauss = 0.5 + this.tearingIslandWidthCm * 1.8;

    // 4. Vertical Displacement Event (VDE) Dynamics:
    // Elongated plasmas (kappa > 1.4) suffer axisymmetric vertical instability:
    // d^2 Z / dt^2 = gamma_vde^2 * Z - passive_damping * vZ + feedback_force
    const gammaVde = (kappa - 1.2) * 18.0; // growth rate (s^-1)
    let verticalForce = (gammaVde * gammaVde) * (this.verticalOffsetZMm / 1000.0);

    // Passive vessel wall eddy current damping
    const wallDamping = 12.0 * (this.verticalVelocityZMmS / 1000.0);
    verticalForce -= wallDamping;

    // Active Poloidal Field Coil Feedback
    if (controls.feedbackVdeEnabled) {
      // Proportional-Derivative (PD) vertical position control
      const kp = 280.0;
      const kd = 35.0;
      const feedbackAcc = -kp * (this.verticalOffsetZMm / 1000.0) - kd * (this.verticalVelocityZMmS / 1000.0);
      verticalForce += feedbackAcc;
    } else {
      // Manual coil differential bias
      const coilDiffKa = controls.upperPfCurrentKa - controls.lowerPfCurrentKa;
      verticalForce += coilDiffKa * 0.05;
    }

    // Integrate vertical velocity and position
    this.verticalVelocityZMmS += verticalForce * 1000.0 * dtSec;
    this.verticalOffsetZMm += this.verticalVelocityZMmS * dtSec;

    // 5. Aggregate Disruption Risk
    let risk = 0.02;
    if (this.troyonBetaN > 2.8) risk += (this.troyonBetaN - 2.8) * 0.45;
    if (this.greenwaldFraction > 0.9) risk += (this.greenwaldFraction - 0.9) * 0.8;
    if (this.tearingIslandWidthCm > 15.0) risk += (this.tearingIslandWidthCm - 15.0) * 0.04;
    if (Math.abs(this.verticalOffsetZMm) > 60.0) risk += (Math.abs(this.verticalOffsetZMm) - 60.0) * 0.015;

    this.disruptionRisk = Math.max(0.0, Math.min(1.0, risk));

    // 6. Disruption Trigger Thresholds:
    // A. Vertical Displacement Event wall contact: |Z| > 180 mm
    if (Math.abs(this.verticalOffsetZMm) > 180.0) {
      this.triggerDisruption('VERTICAL DISPLACEMENT EVENT (VDE): Wall Contact & Thermal Quench');
    }
    // B. Major Tearing Mode Reconnection: Island touches limiter w > 30 cm
    else if (this.tearingIslandWidthCm > 32.0) {
      this.triggerDisruption('MAJOR TEARING DISRUPTION: m=2/1 Magnetic Island Reconnection');
    }
    // C. Troyon Beta Limit Exceeded: beta_N > 4.2
    else if (this.troyonBetaN > 4.2) {
      this.triggerDisruption('TROYON HARD BETA LIMIT: External Kink & Ballooning Instability');
    }
    // D. Greenwald Density Limit Radiation Collapse: n/n_GW > 1.25
    else if (this.greenwaldFraction > 1.25) {
      this.triggerDisruption('GREENWALD DENSITY COLLAPSE: Edge Radiative MARFE Quench');
    }
  }

  /**
   * Triggers an immediate plasma disruption
   */
  public triggerDisruption(reason: string): void {
    this.isDisrupted = true;
    this.disruptionReason = reason;
    this.disruptionRisk = 1.0;
  }
}
