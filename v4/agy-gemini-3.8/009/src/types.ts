export interface Vector2D {
  x: number;
  y: number;
}

export type CelestialBodyType =
  | 'STAR'
  | 'PLANET'
  | 'MOON'
  | 'SPACECRAFT'
  | 'ASTEROID'
  | 'BLACK_HOLE';

export interface CelestialBody {
  id: string;
  name: string;
  type: CelestialBodyType;
  mass: number; // in normalized units (e.g., 1 Earth Mass = 5.972e24 kg)
  radius: number; // in km
  pos: Vector2D; // in km
  vel: Vector2D; // in km/s
  color: string;
  glowColor?: string;
  isStatic?: boolean;
  hasAtmosphere?: boolean;
  atmosphereHeightKm?: number;
  atmosphereDensitySeaLevel?: number; // kg/m^3
  soiRadiusKm?: number; // Sphere of Influence radius in km
  trail: Vector2D[];
  maxTrailLength: number;
  // Propulsion & Rocket Dynamics (for spacecraft)
  fuelKg?: number;
  dryMassKg?: number;
  ispSeconds?: number;
  thrustNewtons?: number;
  isControlled?: boolean;
  isFragmented?: boolean;
}

export interface ManeuverNode {
  id: string;
  targetBodyId: string;
  timeSeconds: number;
  deltaVPrograde: number; // km/s
  deltaVRadial: number; // km/s
  executed: boolean;
}

export interface OrbitalElements {
  semiMajorAxisKm: number;
  eccentricity: number;
  periapsisKm: number;
  apoapsisKm: number;
  orbitalPeriodSeconds: number;
  trueAnomalyRad: number;
  specificOrbitalEnergy: number; // km^2 / s^2
  currentSpeedKmS: number;
  altitudeKm: number;
  primaryBodyName: string;
}

export type CameraTrackingMode = 'GLOBAL' | 'BODY_CENTERED' | 'COROTATING' | 'FOLLOW';

export interface ScenarioPreset {
  id: string;
  name: string;
  category: 'EXPLORATION' | 'HISTORIC' | 'CHAOTIC' | 'ASTROPHYSICS' | 'SANDBOX';
  description: string;
  details: string;
  gravitationalConstant: number;
  initialTimeScale: number;
  defaultTrackedId?: string;
  defaultReferenceId?: string;
  initialBodies: CelestialBody[];
  initialManeuverNodes?: ManeuverNode[];
}

export interface EphemerisDataPoint {
  timestamp: number;
  bodyName: string;
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  speedKmS: number;
  altitudeKm: number;
  distanceToPrimaryKm: number;
}
