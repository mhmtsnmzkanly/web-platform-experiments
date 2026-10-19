/**
 * PLASMA-LAB: Magnetohydrodynamic (MHD) & Tokamak Fusion Reactor Studio
 * Type Definitions
 */

export type PlasmaSuiteMode =
  | 'MAGNETIC_TOPOLOGY'
  | 'PROFILES_SAFETY'
  | 'POINCARE_MAP'
  | 'THERMONUCLEAR_POWER'
  | 'COIL_CONTROL';

export type PlasmaColormap =
  | 'THERMAL_FIRE'
  | 'MAGNETIC_FLUX'
  | 'PLASMA_NEON'
  | 'MHD_VORTICITY';

export type DiagnosticMode =
  | 'FLUX_PSI'
  | 'ELECTRON_TEMP'
  | 'CURRENT_DENSITY'
  | 'POINCARE_POINTS';

export type FusionScenarioId =
  | 'iter-baseline'
  | 'spherical-tokamak'
  | 'high-beta-advanced'
  | 'field-reversed'
  | 'vde-disruption';

export interface TokamakGeometry {
  majorRadiusR0: number; // Major radius R_0 in meters
  minorRadiusA: number; // Minor radius a in meters
  elongationKappa: number; // Vertical elongation kappa (b/a)
  triangularityDelta: number; // Plasma triangularity delta
  toroidalFieldB0: number; // Vacuum toroidal magnetic field B_0 at R_0 in Tesla
  plasmaCurrentIp: number; // Total toroidal plasma current I_p in Mega-Amperes (MA)
}

export interface PlasmaControls {
  nbiPowerMw: number; // Neutral Beam Injection heating (MW)
  ecrhPowerMw: number; // Electron Cyclotron Resonance Heating (MW)
  fuelingRateTorrLS: number; // Gas puff fueling rate (Torr*L/s)
  targetDensityN20: number; // Target line-averaged electron density (10^20 m^-3)
  impurityFractionZeff: number; // Effective ion charge Z_eff (1.0 = pure D-T)
  feedbackVdeEnabled: boolean; // Active vertical displacement feedback loop
  upperPfCurrentKa: number; // Upper poloidal field coil current (kA)
  lowerPfCurrentKa: number; // Lower poloidal field coil current (kA)
  divertorCoilCurrentKa: number; // Divertor shaping coil current (kA)
}

export interface TokamakMetrics {
  simTimeSec: number;
  plasmaCurrentIpMa: number;
  centralTeKev: number;
  centralTiKev: number;
  peakDensityN20: number;
  storedThermalEnergyMj: number;
  fusionPowerMw: number;
  alphaPowerMw: number;
  auxiliaryPowerMw: number;
  radiatedPowerMw: number;
  qFactor: number; // Fusion amplification Q = P_fus / P_aux
  lawsonParameter: number; // n_e * T_i * tau_E in (10^20 keV * s * m^-3)
  confinementTimeTauESec: number; // Energy confinement time tau_E (s)
  troyonBetaN: number; // Normalized beta beta_N (% * m * T / MA)
  greenwaldFraction: number; // Density limit fraction n_e / n_GW
  q95: number; // Safety factor at 95% poloidal flux surface
  q0: number; // Safety factor on magnetic axis
  verticalDisplacementZMm: number; // Vertical position error Delta Z (mm)
  tearingIslandWidthCm: number; // Width of resonant m=2/1 magnetic island (cm)
  disruptionRisk: number; // Risk index [0, 1]
  isDisrupted: boolean;
  disruptionReason: string | null;
}

export interface RadialProfilePoint {
  normRadius: number; // Normalized minor radius r/a [0, 1]
  radiusM: number; // Radial coordinate in meters
  qValue: number; // Safety factor q(r)
  teKev: number; // Electron temperature T_e(r) in keV
  tiKev: number; // Ion temperature T_i(r) in keV
  densityN20: number; // Density n_e(r) in 10^20 m^-3
  pressureKPa: number; // Total kinetic pressure p(r) in kPa
  currentDensityMaM2: number; // Toroidal current density J_phi(r) in MA/m^2
  shear: number; // Magnetic shear s = (r/q) * dq/dr
}

export interface PoincarePoint {
  r: number;
  z: number;
  surfaceIdx: number;
}

export interface FusionScenario {
  id: FusionScenarioId;
  name: string;
  tagline: string;
  description: string;
  geometry: TokamakGeometry;
  controls: PlasmaControls;
}
