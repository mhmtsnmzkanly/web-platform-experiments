/**
 * ORBITAL-SLINGSHOT (EXP-025) — Astrodynamical Trajectory & Puzzle Studio
 * Type Definitions and Data Contracts
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  mass: number;           // Solar masses (1.0 = M_sun)
  radius: number;         // AU (for collision radius)
  displayRadius: number;  // Screen scale radius for rendering
  x: number;              // AU
  y: number;              // AU
  vx: number;             // AU/year
  vy: number;             // AU/year
  color: string;
  glowColor: string;
  soiRadius: number;      // Laplace Sphere of Influence (AU)
  isStar?: boolean;
  trail: Vector2D[];
}

export interface Spacecraft {
  id: string;
  name: string;
  x: number;              // AU
  y: number;              // AU
  vx: number;             // AU/year
  vy: number;             // AU/year
  mass: number;           // metric tons
  totalDeltaV: number;    // km/s
  remainingDeltaV: number;// km/s
  trail: Vector2D[];
  isCrashed: boolean;
  crashedBodyName?: string;
  isEscaped: boolean;
}

export interface ManeuverNode {
  id: string;
  epoch: number;          // Simulation time when node should fire (years)
  progradeDeltaV: number; // km/s (tangential impulse: +prograde, -retrograde)
  radialDeltaV: number;   // km/s (normal impulse: +radial out, -radial in)
  isExecuted: boolean;
}

export type OrbitType = 'CIRCULAR' | 'ELLIPTIC' | 'PARABOLIC' | 'HYPERBOLIC';

export interface OrbitalElements {
  semiMajorAxis: number;            // AU (a > 0 for elliptic, a < 0 for hyperbolic)
  eccentricity: number;             // scalar dimensionless e
  periapsis: number;                // AU (closest approach r_p)
  apoapsis: number;                 // AU (furthest approach r_a, Infinity for hyperbolic)
  period: number;                   // years (T = 2*pi*sqrt(a^3/mu))
  specificEnergy: number;           // (AU/yr)^2 (epsilon = v^2/2 - mu/r)
  specificAngularMomentum: number;  // AU^2/yr (h = |r x v|)
  orbitType: OrbitType;
  primaryBodyId: string;
  primaryBodyName: string;
}

export interface ProjectedTrajectoryPoint {
  x: number;
  y: number;
  time: number;
  speed: number;
}

export interface MissionScenario {
  id: string;
  title: string;
  subtitle: string;
  briefing: string;
  objective: string;
  targetBodyId?: string;
  targetApoapsisMin?: number;       // AU
  targetApoapsisMax?: number;       // AU
  targetPeriapsisMin?: number;      // AU
  targetPeriapsisMax?: number;      // AU
  bodies: CelestialBody[];
  spacecraft: Spacecraft;
  initialManeuver?: ManeuverNode;
  maxSimulationYears: number;
}

export interface AstrodynamicsMetrics {
  simTimeYears: number;
  simTimeDays: number;
  currentSpeedKmS: number;
  primaryBodyName: string;
  distanceToPrimaryAu: number;
  distanceToPrimaryKm: number;
  elements: OrbitalElements;
  soiBodyName: string;
  remainingDeltaVKmS: number;
  totalDeltaVUsedKmS: number;
  timeWarp: number;
  missionStatus: 'IN_FLIGHT' | 'TARGET_REACHED' | 'CRASHED' | 'LOST_TO_DEEP_SPACE';
  statusMessage: string;
}

export interface AstrodynamicsEvent {
  type: 'BURN_EXECUTION' | 'SOI_CHANGE' | 'PERIAPSIS_PASS' | 'GRAVITY_ASSIST' | 'CRASH' | 'MISSION_SUCCESS';
  x: number;
  y: number;
  intensity: number;
  label?: string;
}
