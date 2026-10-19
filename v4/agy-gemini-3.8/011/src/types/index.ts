export type VisualizationMode = 'VELOCITY' | 'PRESSURE' | 'VORTICITY' | 'STREAMLINES';

export type AirfoilPresetId =
  | 'naca0012'
  | 'naca2412'
  | 'naca4415'
  | 'naca6409'
  | 'cylinder'
  | 'flat-plate'
  | 'wedge'
  | 'custom';

export interface AirfoilProfile {
  id: AirfoilPresetId;
  name: string;
  category: 'SYMMETRIC' | 'CAMBERED' | 'HIGH_LIFT' | 'BLUFF_BODY' | 'SUPERSONIC';
  description: string;
  details: string;
  camber: number; // max camber m (e.g. 0.02 for 2%)
  camberPos: number; // pos of max camber p (e.g. 0.4 for 40%)
  thickness: number; // thickness t (e.g. 0.12 for 12%)
  chordLength: number; // in lattice units
}

export interface AeroMetrics {
  liftForce: number;
  dragForce: number;
  liftCoeff: number; // C_L
  dragCoeff: number; // C_D
  liftToDragRatio: number; // L/D
  angleDeg: number;
  angleRad: number;
  reynolds: number;
  circulation: number; // Gamma
  strouhalFreq: number; // Vortex shedding freq in Hz
  strouhalNumber: number; // St ~ 0.2
  isStalled: boolean;
  maxVelocity: number;
  meanPressure: number;
}

export interface ChordPressurePoint {
  xNorm: number; // 0.0 to 1.0 along chord
  cpUpper: number;
  cpLower: number;
}

export interface PolarPoint {
  alphaDeg: number;
  cl: number;
  cd: number;
  ld: number;
}

export interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  alpha: number;
}

export interface GliderState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pitchDeg: number;
  altitude: number;
  airspeed: number;
  cl: number;
  cd: number;
  energy: number;
  stalled: boolean;
  score: number;
}

export interface WindTunnelConfig {
  inletVelocity: number; // U0 ~ 0.04 to 0.12 in lattice units
  viscosity: number; // nu ~ 0.01 to 0.08
  relaxationTau: number; // tau = 3*nu + 0.5
  reynoldsTarget: number;
  angleDeg: number; // -25 to +25 degrees
  smokeEmissionRate: number; // particles per frame
  soundEnabled: boolean;
  paused: boolean;
}
