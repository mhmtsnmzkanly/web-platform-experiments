export type OpticsSuiteMode = 'DIFFRACTION' | 'INTERFEROMETRY' | 'THIN_FILM' | 'HOLOGRAPHY';

export type DiffractionPresetId =
  | 'young-double-slit'
  | 'single-slit'
  | 'circular-airy'
  | 'diffraction-grating'
  | 'fresnel-zone-plate'
  | 'custom-slm';

export type InterferometerType = 'MICHELSON' | 'MACH_ZEHNDER' | 'FABRY_PEROT';

export type ColormapMode = 'LASER_GREEN' | 'CYAN_NEON' | 'SOLAR_AMBER' | 'SPECTRUM_RGB';

export type VisualizerDisplayMode = 'INTENSITY' | 'PHASE' | 'REAL_FIELD' | 'LOG_INTENSITY';

export interface OpticalSourceConfig {
  wavelengthNm: number; // e.g. 532 nm (Green Laser), 633 nm (HeNe Red), 405 nm (Violet)
  coherenceLengthUm: number; // 1 to 500 microns (controls fringe visibility decay)
  beamWaistMm: number; // Gaussian beam width
  intensityPower: number; // 0.1 to 2.0 mW
}

export interface DiffractionConfig {
  preset: DiffractionPresetId;
  slitWidthUm: number; // a (e.g. 20 to 150 um)
  slitDistanceUm: number; // d (e.g. 100 to 800 um)
  circularRadiusUm: number; // aperture radius (e.g. 50 to 300 um)
  gratingDensityLpmm: number; // e.g. 100 to 600 lines/mm
  propagationDistanceMm: number; // z (e.g. 10 to 500 mm)
}

export interface InterferometerConfig {
  type: InterferometerType;
  arm1LengthMm: number;
  arm2LengthMm: number;
  mirrorTiltDeg: number; // misalignment generating linear carrier fringes
  piezoDisplacementNm: number; // nanometer scan for live fringe movement
  sampleRefractiveIndex: number; // for Mach-Zehnder transparent cell (e.g. 1.000 to 1.500)
  sampleThicknessUm: number;
  mirrorReflectivity: number; // for Fabry-Perot cavity (e.g. 0.70 to 0.98)
}

export interface ThinFilmLayer {
  id: string;
  name: string;
  thicknessNm: number;
  refractiveIndex: number;
  extinctionCoeff: number; // k (absorption)
}

export interface ThinFilmConfig {
  substrateIndex: number; // e.g. 1.52 (BK7 Glass)
  incidentAngleDeg: number; // 0 to 75 degrees
  polarization: 'TE' | 'TM' | 'UNPOLARIZED';
  layers: ThinFilmLayer[];
}

export interface HologramConfig {
  objectType: 'DOUBLE_PINHOLE' | 'LETTER_OMEGA' | 'SLM_TARGET' | 'CUSTOM_MASK';
  referenceAngleDeg: number; // e.g. 2.5 degrees off-axis
  recordingDistanceMm: number;
  reconstructionDistanceMm: number;
  isReconstructing: boolean;
}

export interface OpticsMetrics {
  peakIntensity: number;
  fringeVisibility: number; // V = (Imax - Imin) / (Imax + Imin)
  fwhmRadiusMm: number; // Full Width at Half Maximum
  phaseShiftRad: number; // delta phi in radians
  phaseShiftDeg: number;
  interferenceFringeCount: number;
  airyDiscRadiusMm: number;
  cavityFinesse: number;
  reflectanceAvg: number; // Thin film R
  transmittanceAvg: number; // Thin film T
}

export interface SpectrumPoint {
  wavelengthNm: number;
  reflectance: number; // R in [0, 1]
  transmittance: number; // T in [0, 1]
}

export interface CrossSectionPoint {
  coordMm: number;
  intensity: number;
  phase: number;
}
