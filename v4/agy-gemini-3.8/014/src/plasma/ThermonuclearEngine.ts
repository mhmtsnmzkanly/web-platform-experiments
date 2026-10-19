/**
 * PLASMA-LAB: Thermonuclear Kinetics & Power Balance Engine
 * Implements Bosch-Hale D-T fusion cross-sections, ITER IPB98(y,2) H-mode confinement scaling,
 * Bremsstrahlung & Cyclotron radiative losses, alpha particle heating, and energy balance.
 */

import { TokamakGeometry, PlasmaControls, TokamakMetrics } from '../types';

export class ThermonuclearEngine {
  // Stored thermal state
  public storedThermalEnergyMj: number = 350.0;
  public centralTeKev: number = 18.0;
  public centralTiKev: number = 17.5;
  public lineAvgDensityN20: number = 1.0;
  public tauESec: number = 3.6;

  // Real-time power balance (MW)
  public pFusMw: number = 0.0;
  public pAlphaMw: number = 0.0;
  public pAuxMw: number = 50.0;
  public pBremMw: number = 18.0;
  public pCyclMw: number = 4.0;
  public pRadMw: number = 22.0;
  public pLossMw: number = 85.0;
  public qFactor: number = 0.0;
  public lawsonTripleProduct: number = 0.0; // 10^20 keV * s * m^-3

  constructor(geom: TokamakGeometry, controls: PlasmaControls) {
    this.reset(geom, controls);
  }

  public reset(geom: TokamakGeometry, controls: PlasmaControls): void {
    const vol = this.getPlasmaVolumeM3(geom);
    this.centralTeKev = 16.0;
    this.centralTiKev = 15.5;
    this.lineAvgDensityN20 = controls.targetDensityN20;

    // Initial thermal energy W = 3 * n * k_B * T * V
    // 3 * (1e20 m^-3) * (1.602e-16 J/keV) * 16 keV * V / 1e6 = MJ
    this.storedThermalEnergyMj = 3.0 * this.lineAvgDensityN20 * 0.1602 * this.centralTeKev * (vol * 0.5);
  }

  /**
   * Plasma torus volume V = 2 * pi^2 * R_0 * a^2 * kappa
   */
  public getPlasmaVolumeM3(geom: TokamakGeometry): number {
    return 2.0 * Math.PI * Math.PI * geom.majorRadiusR0 * geom.minorRadiusA * geom.minorRadiusA * geom.elongationKappa;
  }

  /**
   * Bosch-Hale parameterized Maxwellian D-T fusion reactivity <sigma*v> in m^3/s
   * Valid for T_i between 0.5 keV and 100 keV.
   */
  public calculateDtReactivity(tiKev: number): number {
    const t = Math.max(0.2, Math.min(100.0, tiKev));
    const bg = 34.3827; // Gamow constant for D-T in keV^(1/2)
    const mrc2 = 1.124656e6; // Reduced mass in keV

    const c1 = 1.17302e-9;
    const c2 = 1.51361e-2;
    const c3 = 7.51886e-2;
    const c4 = 4.60643e-3;
    const c5 = 1.35000e-2;
    const c6 = -1.06750e-4;
    const c7 = 1.36600e-5;

    const numTheta = t * (c2 + t * (c4 + t * c6));
    const denTheta = 1.0 + t * (c3 + t * (c5 + t * c7));
    const theta = t / (1.0 - numTheta / denTheta);

    const xi = Math.pow((bg * bg) / (4.0 * theta), 1.0 / 3.0);
    const sigV_cm3_s = c1 * theta * Math.sqrt(xi / (mrc2 * t * t * t)) * Math.exp(-3.0 * xi);

    // Convert cm^3/s to m^3/s (multiply by 1e-6)
    return Math.max(0, sigV_cm3_s * 1e-6);
  }

  /**
   * Advances thermonuclear energy balance by dtSec
   */
  public step(
    geom: TokamakGeometry,
    controls: PlasmaControls,
    dtSec: number
  ): void {
    const vol = this.getPlasmaVolumeM3(geom);
    const n20 = this.lineAvgDensityN20;
    const n_m3 = n20 * 1e20;

    // 1. Auxiliary Heating Power (NBI + ECRH)
    this.pAuxMw = Math.max(0.1, controls.nbiPowerMw + controls.ecrhPowerMw);

    // 2. Fusion Reactivity & Power
    const sigV = this.calculateDtReactivity(this.centralTiKev);
    // Reaction rate per m^3: R_fus = (1/4) * n_e^2 * <sigma*v>
    // Total fusion power: P_fus = R_fus * 17.6 MeV * V
    // 17.6 MeV = 2.818e-12 Joules
    const totalReactionsPerSec = 0.25 * n_m3 * n_m3 * sigV * (vol * 0.55); // peaking factor ~ 0.55
    const pFusWatts = totalReactionsPerSec * 2.818e-12;
    this.pFusMw = Math.max(0, pFusWatts / 1e6);

    // Alpha heating (3.5 MeV / 17.6 MeV = 20%)
    this.pAlphaMw = this.pFusMw * 0.20;

    // Amplification Q factor
    this.qFactor = this.pAuxMw > 0.05 ? this.pFusMw / this.pAuxMw : 0.0;

    // 3. Radiative Losses
    // Bremsstrahlung: P_brem = 5.35e-37 * Z_eff * n_e^2 * sqrt(T_e_keV) * V (Watts)
    const zEff = Math.max(1.0, controls.impurityFractionZeff);
    const pBremWatts = 5.35e-37 * zEff * (n_m3 * n_m3) * Math.sqrt(Math.max(0.01, this.centralTeKev)) * vol * 0.45;
    this.pBremMw = pBremWatts / 1e6;

    // Cyclotron Synchrotron Radiation: P_cycl ~ 6.2e-17 * B0^2 * n_e * T_e_keV * V * (1 - R_wall)^0.5
    const pCyclWatts = 6.2e-17 * (geom.toroidalFieldB0 * geom.toroidalFieldB0) * n_m3 * this.centralTeKev * vol * 0.15;
    this.pCyclMw = pCyclWatts / 1e6;

    this.pRadMw = this.pBremMw + this.pCyclMw;

    // 4. Energy Confinement Time tau_E using ITER IPB98(y,2) Scaling:
    // tau_E = 0.0562 * Ip^0.93 * B0^0.15 * P_net^-0.69 * n19^0.41 * M^0.19 * R0^1.97 * eps^0.58 * kappa^0.78
    const netHeatingPowerMw = Math.max(1.0, this.pAuxMw + this.pAlphaMw - this.pRadMw);
    const eps = geom.minorRadiusA / geom.majorRadiusR0;
    const n19 = n20 * 10.0;
    const massNumber = 2.5; // 50:50 D-T average mass

    const tauE = 0.0562 *
      Math.pow(geom.plasmaCurrentIp, 0.93) *
      Math.pow(geom.toroidalFieldB0, 0.15) *
      Math.pow(netHeatingPowerMw, -0.69) *
      Math.pow(n19, 0.41) *
      Math.pow(massNumber, 0.19) *
      Math.pow(geom.majorRadiusR0, 1.97) *
      Math.pow(eps, 0.58) *
      Math.pow(geom.elongationKappa, 0.78);

    this.tauESec = Math.max(0.2, Math.min(8.0, tauE));

    // Conduction loss power P_loss = W_th / tau_E
    this.pLossMw = Math.max(0.5, this.storedThermalEnergyMj / this.tauESec);

    // 5. Time-Stepping Energy Balance:
    // dW_th/dt = P_aux + P_alpha - P_rad - P_loss
    const dWdt = this.pAuxMw + this.pAlphaMw - this.pRadMw - this.pLossMw;
    this.storedThermalEnergyMj = Math.max(1.0, this.storedThermalEnergyMj + dWdt * dtSec);

    // Update central temperatures from thermal energy
    // W_th = 3 * n * k_B * T * V * 0.55
    const calculatedTe = this.storedThermalEnergyMj / (3.0 * n20 * 0.1602 * vol * 0.55);
    this.centralTeKev = Math.max(0.5, Math.min(45.0, calculatedTe));
    this.centralTiKev = this.centralTeKev * 0.96;

    // Density adjustment towards target
    const densityError = controls.targetDensityN20 - this.lineAvgDensityN20;
    this.lineAvgDensityN20 += densityError * Math.min(1.0, dtSec * 0.5) + controls.fuelingRateTorrLS * 0.0002;
    this.lineAvgDensityN20 = Math.max(0.1, Math.min(3.5, this.lineAvgDensityN20));

    // 6. Lawson Triple Product: n_e * T_i * tau_E (in 10^20 m^-3 * keV * s)
    // Ignition threshold is ~ 30
    this.lawsonTripleProduct = this.lineAvgDensityN20 * this.centralTiKev * this.tauESec;
  }
}
