import { Vector2D, CelestialBody, OrbitalElements } from '../types';

export const G_DEFAULT = 6.6743e-11; // m^3 kg^-1 s^-2
// For simulation scaling, we often use normalized gravitational units:
// Standard default G in simulation units (km^3 / (kg_unit * s^2))
export const SIM_G = 398600.4418; // Standard gravitational parameter of Earth (km^3 / s^2) if M_earth = 1.0

/**
 * Basic 2D Vector Operations
 */
export const Vec2 = {
  add: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y }),
  scale: (a: Vector2D, s: number): Vector2D => ({ x: a.x * s, y: a.y * s }),
  magSq: (a: Vector2D): number => a.x * a.x + a.y * a.y,
  mag: (a: Vector2D): number => Math.sqrt(a.x * a.x + a.y * a.y),
  dist: (a: Vector2D, b: Vector2D): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2),
  distSq: (a: Vector2D, b: Vector2D): number => (a.x - b.x) ** 2 + (a.y - b.y) ** 2,
  normalize: (a: Vector2D): Vector2D => {
    const m = Math.sqrt(a.x * a.x + a.y * a.y);
    return m > 1e-12 ? { x: a.x / m, y: a.y / m } : { x: 0, y: 0 };
  },
  dot: (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y,
  cross2D: (a: Vector2D, b: Vector2D): number => a.x * b.y - a.y * b.x,
  rotate: (a: Vector2D, angleRad: number): Vector2D => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: a.x * cos - a.y * sin,
      y: a.x * sin + a.y * cos,
    };
  },
  perpendicular: (a: Vector2D): Vector2D => ({ x: -a.y, y: a.x }),
};

/**
 * Calculates Keplerian orbital elements of a body relative to a primary body
 */
export function calculateOrbitalElements(
  body: CelestialBody,
  primary: CelestialBody,
  G: number
): OrbitalElements {
  const relPos = Vec2.sub(body.pos, primary.pos);
  const relVel = Vec2.sub(body.vel, primary.vel);

  const r = Vec2.mag(relPos);
  const v = Vec2.mag(relVel);

  const mu = G * (primary.mass + body.mass);

  if (mu <= 0 || r <= 0) {
    return {
      semiMajorAxisKm: 0,
      eccentricity: 0,
      periapsisKm: 0,
      apoapsisKm: 0,
      orbitalPeriodSeconds: 0,
      trueAnomalyRad: 0,
      specificOrbitalEnergy: 0,
      currentSpeedKmS: v,
      altitudeKm: Math.max(0, r - primary.radius),
      primaryBodyName: primary.name,
    };
  }

  // Specific orbital energy: epsilon = v^2 / 2 - mu / r
  const epsilon = v * v * 0.5 - mu / r;

  // Specific angular momentum: h = r x v (z-component)
  const h = Vec2.cross2D(relPos, relVel);

  // Semi-major axis: a = -mu / (2 * epsilon)
  let a = 0;
  if (Math.abs(epsilon) > 1e-9) {
    a = -mu / (2 * epsilon);
  }

  // Eccentricity vector: e_vec = ((v^2 - mu/r) * r_vec - (r . v) * v_vec) / mu
  const rDotV = Vec2.dot(relPos, relVel);
  const eVecX = ((v * v - mu / r) * relPos.x - rDotV * relVel.x) / mu;
  const eVecY = ((v * v - mu / r) * relPos.y - rDotV * relVel.y) / mu;
  const eccentricity = Math.sqrt(eVecX * eVecX + eVecY * eVecY);

  // Periapsis and Apoapsis
  let periapsisKm = 0;
  let apoapsisKm = 0;
  let orbitalPeriodSeconds = 0;

  if (eccentricity < 1.0) {
    // Elliptic orbit
    periapsisKm = a * (1 - eccentricity);
    apoapsisKm = a * (1 + eccentricity);
    if (a > 0) {
      orbitalPeriodSeconds = 2 * Math.PI * Math.sqrt((a * a * a) / mu);
    }
  } else {
    // Parabolic or Hyperbolic orbit
    periapsisKm = Math.abs(a) * (eccentricity - 1);
    apoapsisKm = Infinity;
    orbitalPeriodSeconds = Infinity;
  }

  // True Anomaly: angle between eccentricity vector and position vector
  let trueAnomalyRad = 0;
  if (eccentricity > 1e-6) {
    const cosNu = (eVecX * relPos.x + eVecY * relPos.y) / (eccentricity * r);
    const clampedCos = Math.max(-1, Math.min(1, cosNu));
    trueAnomalyRad = Math.acos(clampedCos);
    // If r . v < 0, true anomaly is in [pi, 2pi]
    if (rDotV < 0) {
      trueAnomalyRad = 2 * Math.PI - trueAnomalyRad;
    }
  } else {
    // Circular orbit: angle from x-axis
    trueAnomalyRad = Math.atan2(relPos.y, relPos.x);
    if (trueAnomalyRad < 0) trueAnomalyRad += 2 * Math.PI;
  }

  return {
    semiMajorAxisKm: a,
    eccentricity,
    periapsisKm,
    apoapsisKm,
    orbitalPeriodSeconds,
    trueAnomalyRad,
    specificOrbitalEnergy: epsilon,
    currentSpeedKmS: v,
    altitudeKm: Math.max(0, r - primary.radius),
    primaryBodyName: primary.name,
  };
}

/**
 * Calculates Hohmann Transfer Delta-V and Duration
 * Between two circular coplanar orbits around a primary body
 */
export interface HohmannTransferPlan {
  r1: number;
  r2: number;
  deltaV1: number; // km/s
  deltaV2: number; // km/s
  totalDeltaV: number; // km/s
  transferTimeSeconds: number; // seconds
  transferSemiMajorAxis: number;
}

export function calculateHohmannTransfer(
  primaryMass: number,
  r1: number,
  r2: number,
  G: number
): HohmannTransferPlan {
  const mu = G * primaryMass;
  if (mu <= 0 || r1 <= 0 || r2 <= 0) {
    return {
      r1,
      r2,
      deltaV1: 0,
      deltaV2: 0,
      totalDeltaV: 0,
      transferTimeSeconds: 0,
      transferSemiMajorAxis: 0,
    };
  }

  const aTransfer = (r1 + r2) / 2;
  const v1Circular = Math.sqrt(mu / r1);
  const v2Circular = Math.sqrt(mu / r2);

  // Velocity at periapsis/apoapsis of transfer ellipse
  const vTransfer1 = Math.sqrt(mu * (2 / r1 - 1 / aTransfer));
  const vTransfer2 = Math.sqrt(mu * (2 / r2 - 1 / aTransfer));

  const deltaV1 = Math.abs(vTransfer1 - v1Circular);
  const deltaV2 = Math.abs(v2Circular - vTransfer2);
  const totalDeltaV = deltaV1 + deltaV2;

  // Transfer time is half the orbital period of the transfer ellipse
  const transferTimeSeconds = Math.PI * Math.sqrt((aTransfer * aTransfer * aTransfer) / mu);

  return {
    r1,
    r2,
    deltaV1,
    deltaV2,
    totalDeltaV,
    transferTimeSeconds,
    transferSemiMajorAxis: aTransfer,
  };
}

/**
 * Calculates Roche Limit (fluid and rigid)
 * d_Roche = R_M * (2 * rho_M / rho_m)^(1/3) for fluid
 */
export function calculateRocheLimit(
  primaryRadiusKm: number,
  primaryMass: number,
  satelliteRadiusKm: number,
  satelliteMass: number
): { rigidRocheLimitKm: number; fluidRocheLimitKm: number } {
  if (satelliteRadiusKm <= 0 || primaryRadiusKm <= 0 || satelliteMass <= 0 || primaryMass <= 0) {
    return { rigidRocheLimitKm: primaryRadiusKm * 1.26, fluidRocheLimitKm: primaryRadiusKm * 2.44 };
  }

  const volPrimary = (4 / 3) * Math.PI * Math.pow(primaryRadiusKm, 3);
  const volSatellite = (4 / 3) * Math.PI * Math.pow(satelliteRadiusKm, 3);

  const rhoPrimary = primaryMass / volPrimary;
  const rhoSatellite = satelliteMass / volSatellite;

  const densityRatio = rhoPrimary / rhoSatellite;
  const cubeRoot = Math.cbrt(densityRatio);

  const rigidRocheLimitKm = primaryRadiusKm * 1.26 * cubeRoot;
  const fluidRocheLimitKm = primaryRadiusKm * 2.44 * cubeRoot;

  return { rigidRocheLimitKm, fluidRocheLimitKm };
}

/**
 * Computes Lagrange Points (L1 to L5) in the circular restricted three-body problem
 */
export interface LagrangePoints {
  L1: Vector2D;
  L2: Vector2D;
  L3: Vector2D;
  L4: Vector2D;
  L5: Vector2D;
}

export function calculateLagrangePoints(
  primary: CelestialBody,
  secondary: CelestialBody
): LagrangePoints {
  const dVec = Vec2.sub(secondary.pos, primary.pos);
  const R = Vec2.mag(dVec);
  const u = Vec2.normalize(dVec);
  const perp = Vec2.perpendicular(u);

  const M1 = primary.mass;
  const M2 = secondary.mass;
  const MTotal = M1 + M2;

  // Mass ratio alpha = M2 / (M1 + M2)
  const alpha = M2 / MTotal;

  // Hill sphere / approximate L1 & L2 distance from secondary
  const rHill = R * Math.cbrt(alpha / 3);

  // L1 lies between primary and secondary
  const L1: Vector2D = {
    x: secondary.pos.x - u.x * rHill,
    y: secondary.pos.y - u.y * rHill,
  };

  // L2 lies beyond secondary
  const L2: Vector2D = {
    x: secondary.pos.x + u.x * rHill,
    y: secondary.pos.y + u.y * rHill,
  };

  // L3 lies on the opposite side of primary
  const rL3 = R * (1 + (5 / 12) * alpha);
  const L3: Vector2D = {
    x: primary.pos.x - u.x * rL3,
    y: primary.pos.y - u.y * rL3,
  };

  // Barycenter
  const barycenter: Vector2D = {
    x: (primary.pos.x * M1 + secondary.pos.x * M2) / MTotal,
    y: (primary.pos.y * M1 + secondary.pos.y * M2) / MTotal,
  };

  // L4 and L5 form equilateral triangles with M1 and M2
  // Midpoint of M1-M2 line
  const mid: Vector2D = {
    x: (primary.pos.x + secondary.pos.x) * 0.5,
    y: (primary.pos.y + secondary.pos.y) * 0.5,
  };
  const hTriangle = (Math.sqrt(3) / 2) * R;

  const L4: Vector2D = {
    x: mid.x + perp.x * hTriangle,
    y: mid.y + perp.y * hTriangle,
  };

  const L5: Vector2D = {
    x: mid.x - perp.x * hTriangle,
    y: mid.y - perp.y * hTriangle,
  };

  return { L1, L2, L3, L4, L5 };
}

/**
 * Tsiolkovsky Rocket Equation
 * Computes fuel consumed for a desired deltaV
 * deltaV = Isp * g0 * ln(m0 / mf)
 * mf = m0 * exp(-deltaV / (Isp * g0))
 * fuelBurned = m0 - mf
 */
export function calculateFuelBurn(
  currentTotalMassKg: number,
  deltaVKmS: number,
  ispSeconds: number = 320
): { fuelBurnedKg: number; finalMassKg: number } {
  const g0 = 0.00980665; // km/s^2
  const effectiveExhaustVelocity = ispSeconds * g0; // km/s

  if (effectiveExhaustVelocity <= 0 || deltaVKmS <= 0) {
    return { fuelBurnedKg: 0, finalMassKg: currentTotalMassKg };
  }

  const massRatio = Math.exp(deltaVKmS / effectiveExhaustVelocity);
  const finalMassKg = currentTotalMassKg / massRatio;
  const fuelBurnedKg = Math.max(0, currentTotalMassKg - finalMassKg);

  return { fuelBurnedKg, finalMassKg };
}
