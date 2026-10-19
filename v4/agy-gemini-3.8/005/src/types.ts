export type SourceMode = 'CONTINUOUS_PLANE' | 'RICKER_PULSE' | 'POINT_DIPOLE' | 'STEERED_BEAM';

export type MaterialType = 'VACUUM' | 'DIELECTRIC' | 'CONDUCTOR_PEC' | 'LOSSY_ABSORBER';

export type PresetType =
  | 'TYPOGRAPHIC'
  | 'DOUBLE_SLIT'
  | 'CONVEX_LENS'
  | 'PHOTONIC_CRYSTAL'
  | 'PRISM_TIR'
  | 'EMPTY_WAVEGUIDE';

export type ColorMapMode = 'BIPOLAR_ELECTRIC' | 'PLASMA_MAGMA' | 'SEISMIC' | 'GREEN_PHOSPHOR';

export interface FieldProbe {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  history: number[]; // circular buffer of Ez(t) values for oscilloscope
}

export interface PhysicalObservables {
  totalEnergyMicroJ: number;
  poyntingForward: number;
  transmissionRatio: number;
  dielectricPhaseDelayRad: number;
  dielectricNodesCount: number;
  conductorNodesCount: number;
  cflStabilityNumber: number;
  simulationTimeStep: number;
}

export interface SimParameters {
  wavelength: number; // in grid cells (e.g. 12 - 32)
  epsRel: number;     // relative permittivity for dielectric (e.g. 2.0 - 9.0)
  sourceAngleDeg: number; // incident angle in degrees (-45 to +45)
  sourceMode: SourceMode;
  materialBrush: MaterialType;
  brushRadius: number;
  customText: string;
  colorMap: ColorMapMode;
  showPoyntingVectors: boolean;
  showWavefrontContours: boolean;
  isPaused: boolean;
  audioSonification: boolean;
}
