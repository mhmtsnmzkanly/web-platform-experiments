export type SuiteMode = 'TDGL_VORTEX' | 'JOSEPHSON_SQUID' | 'BEC_SUPERFLUID' | 'DILUTION_FRIDGE';

export type ColormapMode = 'CYAN_SUPERCONDUCTING' | 'PHASE_WHEEL' | 'MAGNETIC_FLUX' | 'BEC_DENSITY';

export type PresetId =
  | 'YBCO_MEISSNER'
  | 'ABRIKOSOV_LATTICE'
  | 'DC_SQUID_MAGNETOMETER'
  | 'SHAPIRO_MICROWAVE_STEPS'
  | 'BEC_DOUBLE_WELL_INTERFERENCE'
  | 'THERMAL_QUENCH_CASCADE';

export type SuperconductorMaterial = 'YBCO' | 'NbTi' | 'Nb3Sn' | 'BSCCO';

export interface PinningSite {
  x: number; // grid coords [0, Nx-1]
  y: number; // grid coords [0, Ny-1]
  radius: number;
  strength: number; // 0 to 1
}

export interface TdglParameters {
  temperatureRatio: number; // T / Tc in [0.05, 1.25]
  kappa: number; // Ginzburg-Landau parameter kappa = lambda / xi in [0.5, 12.0]
  bExt: number; // Applied external field B_ext in [0.0, 2.0]
  jExt: number; // Applied transport current J_ext in [0.0, 1.5]
  pinningDensity: number; // count of pinning sites [0, 60]
  pinningStrength: number; // [0.1, 1.0]
  externalCoilRadius: number; // [10, 40] grid cells
  coilCenterX: number; // normalized [0, 1]
  coilCenterY: number; // normalized [0, 1]
}

export interface JosephsonParameters {
  iDc: number; // DC bias current I_dc / I_c in [0.0, 3.5]
  iRf: number; // RF microwave current I_rf / I_c in [0.0, 2.5]
  fRf: number; // RF microwave frequency in GHz in [0.2, 4.0]
  betaC: number; // Stewart-McCumber parameter beta_c in [0.1, 10.0]
  squidFluxPhi: number; // External magnetic flux Phi / Phi_0 in [-3.0, 3.0]
  asymmetryAlpha: number; // Junction asymmetry (Ic1 - Ic2)/(Ic1 + Ic2) in [0.0, 0.5]
  inductanceBetaL: number; // Loop inductance parameter beta_L in [0.0, 2.0]
}

export interface BecParameters {
  scatteringG: number; // s-wave interaction g in [-3.0, 6.0]
  barrierHeight: number; // Optical double-well barrier V_0 in [0.0, 20.0]
  barrierWidth: number; // Barrier waist width sigma in [2.0, 15.0]
  trapAspect: number; // Trap aspect ratio omega_y / omega_x in [0.5, 2.5]
  stirringSpeed: number; // Stirring laser spoon speed in [0.0, 5.0]
  stirringActive: boolean;
  timeOfFlight: boolean; // Release harmonic trap
}

export interface CryoFridgeParameters {
  stage300Temp: number; // Ambient 300 K
  stage77Temp: number; // LN2 intercept 77 K
  stage4Temp: number; // 4.2 K LHe bath
  stage1Temp: number; // 1.2 K 1K pot
  stageMCTemp: number; // Mixing chamber temperature in Kelvin [0.010, 0.500]
  he3FlowRate: number; // Circulation rate in umol/s [20, 500]
  heaterPower: number; // Heater power in uW [0, 250]
  superconductorMaterial: SuperconductorMaterial;
  magnetCurrentA: number; // Magnet current in Amperes [0, 250]
  isQuenched: boolean;
  energyDumpActive: boolean;
}

export interface TelemetryMetrics {
  orderParamAvg: number;
  orderParamMax: number;
  vortexCount: number;
  supercurrentMag: number;
  phaseDifferencePhi: number;
  junctionVoltageMilliV: number;
  squidSensitivity: number;
  becCondensateFraction: number;
  becInterferenceVisibility: number;
  mixingChamberTempK: number;
  coolingPowerMicroW: number;
  jouleDissipationWatts: number;
  storedMagneticEnergyKJ: number;
  simFps: number;
  simStepCount: number;
}

export interface Preset {
  id: PresetId;
  name: string;
  subtitle: string;
  description: string;
  suiteMode: SuiteMode;
  tdgl: Partial<TdglParameters>;
  josephson: Partial<JosephsonParameters>;
  bec: Partial<BecParameters>;
  cryo: Partial<CryoFridgeParameters>;
}
