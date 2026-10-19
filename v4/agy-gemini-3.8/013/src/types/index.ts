export type SeismicSuiteMode = 'ELASTODYNAMICS' | 'SEISMOGRAMS' | 'TSUNAMI' | 'GEOLOGY';

export type SeismicScenarioId =
  | 'cascadia-subduction'
  | 'san-andreas-transform'
  | 'sedimentary-basin'
  | 'intraplate-deep'
  | 'caldera-collapse';

export type WaveFieldDisplayMode = 'CURL_SHEAR' | 'DIV_COMPRESSION' | 'VELOCITY_MAG' | 'STRESS_SIGMA';

export type ColormapMode = 'SEISMIC_BIPOLAR' | 'MAGMA_THERMAL' | 'TURBO_VELOCITY' | 'EARTH_STRATA';

export type FaultMechanism = 'STRIKE_SLIP' | 'NORMAL' | 'THRUST_SUBDUCTION';

export interface FaultConfig {
  hypocenterXKm: number; // 0 to 240 km along horizontal section
  hypocenterDepthKm: number; // 2 to 70 km depth
  dipAngleDeg: number; // Fault dip (e.g. 15 deg for subduction thrust, 90 deg for strike-slip)
  mechanism: FaultMechanism;
  stressDropMpa: number; // 2 to 25 MPa
  momentMagnitudeMw: number; // Mw 5.5 to 9.2
  ruptureLengthKm: number;
  ruptureVelocityKmS: number;
  isRupturing: boolean;
  ruptureProgress: number; // 0.0 to 1.0
}

export interface GeologyLayer {
  id: string;
  name: string;
  depthTopKm: number;
  depthBottomKm: number;
  vpKmS: number; // P-wave velocity (km/s)
  vsKmS: number; // S-wave velocity (km/s)
  densityGcm3: number; // Density (g/cm^3)
  color: string;
}

export interface SeismographStation {
  id: string;
  name: string;
  coordXKm: number;
  distanceKm: number;
  pArrivalSec: number | null;
  sArrivalSec: number | null;
  rayleighArrivalSec: number | null;
  pgaG: number; // Peak Ground Acceleration
  pgvCmS: number; // Peak Ground Velocity
  historyVx: number[]; // Horizontal velocity trace
  historyVz: number[]; // Vertical velocity trace
  historyTime: number[]; // Exact simulation timestamps (seconds)
}

export interface TsunamiState {
  enabled: boolean;
  gridSize: number;
  surfaceElevation: Float32Array; // eta(x) in meters
  flowVelocity: Float32Array; // u(x) in m/s
  bathymetry: Float32Array; // depth H(x) in meters
  seafloorUplift: Float32Array; // dynamic seafloor motion in meters
  maxRunupM: number;
  leadingWaveHeightM: number;
  oceanSpeedKmh: number;
}

export interface SeismicMetrics {
  simulationTimeSec: number;
  momentMagnitudeMw: number;
  seismicEnergyJoules: number;
  maxPgaG: number;
  maxPgvCmS: number;
  surfaceWaveDisplacementMm: number;
  spTimeLagSec: number;
  tsunamiWaveHeightM: number;
  tsunamiSpeedKmh: number;
  activeWaveEnergy: number;
}

export interface SeismogramPoint {
  timeSec: number;
  vz: number;
  vx: number;
}

export interface TravelTimeCurvePoint {
  distanceKm: number;
  pTimeSec: number;
  sTimeSec: number;
  rayleighTimeSec: number;
}
