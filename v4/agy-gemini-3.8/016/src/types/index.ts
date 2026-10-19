export type SuiteMode = 'GEODESIC_ORBITS' | 'KERR_SHADOW_LENS' | 'GRAVITATIONAL_WAVES' | 'SPACETIME_EMBEDDING';

export type MetricType = 'SCHWARZSCHILD' | 'KERR' | 'REISSNER_NORDSTROM';

export type ColormapMode = 'ACCRETION_FIRE' | 'GRAVITATIONAL_REDSHIFT' | 'CURVATURE_KRETSCHMANN' | 'FRAME_DRAGGING';

export type PresetId =
  | 'KERR_SUPERSPINNING'
  | 'SCHWARZSCHILD_EINSTEIN_RING'
  | 'MERCURY_PERIHELION_PRECESSION'
  | 'BINARY_BH_MERGER_GW150914'
  | 'PENROSE_ENERGY_EXTRACTION'
  | 'FLAMM_CURVATURE_EMBEDDING';

export interface GeodesicParticle {
  id: string;
  x: number; // in units of M
  y: number;
  z: number;
  vx: number; // dx/dlambda
  vy: number;
  vz: number;
  isPhoton: boolean;
  energy: number; // conserved E = -u_t
  angularMomentum: number; // conserved L = u_phi
  trail: { x: number; y: number }[];
  isCaptured: boolean;
  color: string;
}

export interface GeodesicParams {
  massM: number; // Black hole mass in solar units (scaled to M=1 for geometry)
  spinA: number; // Dimensionless Kerr spin a* in [-0.99, 0.99]
  chargeQ: number; // Dimensionless Reissner-Nordstrom charge Q/M in [0.0, 0.95]
  metricType: MetricType;
  launchRadius: number; // r0 in [3.0, 30.0] M
  launchSpeed: number; // v/c in [0.05, 0.999]
  launchAngleDeg: number; // velocity direction angle in [0, 360]
  isPhoton: boolean;
}

export interface LensingParams {
  observerDistance: number; // D_obs in units of M [15, 60]
  inclinationDeg: number; // Observer inclination i in [0, 88] deg
  fovDeg: number; // Angular field of view [20, 60] deg
  diskInnerRadius: number; // r_in in M (typically ISCO)
  diskOuterRadius: number; // r_out in M [8, 30]
  accretionBrightness: number; // [0.2, 2.5]
  starFieldGrid: boolean;
  secondaryRings: boolean;
}

export interface GravitationalWaveParams {
  primaryMassMsun: number; // m1 in [5, 80] M_sun
  secondaryMassMsun: number; // m2 in [3, 60] M_sun
  dimensionlessSpin1: number; // chi1 in [-0.9, 0.9]
  dimensionlessSpin2: number; // chi2 in [-0.9, 0.9]
  luminosityDistanceMpc: number; // D_L in [100, 2000] Mpc
  orbitPhase: number;
  separationR: number; // Orbital separation in M
  orbitalFreqHz: number;
  isMerged: boolean;
}

export interface TelemetryMetrics {
  schwarzschildRadiusRs: number; // r_s = 2M
  eventHorizonRadiusRplus: number; // r_+ = M + sqrt(M^2 - a^2)
  photonSphereRadiusRph: number; // r_ph = 3M (Schwarzschild)
  iscoRadius: number; // r_isco
  ergosphereOuterRadius: number; // r_ergo(theta) = 2M
  frameDraggingOmegaMax: number; // frame dragging angular velocity
  gravitationalRedshiftZ: number; // 1 + z
  gwChirpMassMsun: number; // Mc
  gwStrainPeak: number; // h_peak (dimensionless, ~1e-21)
  gwFrequencyHz: number; // f_gw in Hz
  simFps: number;
  simStepCount: number;
}

export interface Preset {
  id: PresetId;
  name: string;
  subtitle: string;
  description: string;
  suiteMode: SuiteMode;
  geodesic: Partial<GeodesicParams>;
  lensing: Partial<LensingParams>;
  gw: Partial<GravitationalWaveParams>;
}
