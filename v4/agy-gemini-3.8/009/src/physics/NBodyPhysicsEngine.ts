import { CelestialBody, ManeuverNode, Vector2D } from '../types';
import { Vec2, calculateRocheLimit } from './OrbitalMath';

// Speed of light in km/s (for post-Newtonian relativistic precession correction)
const SPEED_OF_LIGHT_KMS = 299792.458;

// Yoshida 4th-order symplectic integration coefficients
const CBRT_2 = Math.cbrt(2.0);
const W1 = 1.0 / (2.0 - CBRT_2);
const W0 = -CBRT_2 / (2.0 - CBRT_2);

const YOSHIDA_C = [W1 / 2.0, (W0 + W1) / 2.0, (W0 + W1) / 2.0, W1 / 2.0];
const YOSHIDA_D = [W1, W0, W1, 0.0];

export interface TrajectoryPoint {
  x: number;
  y: number;
  time: number;
  speed: number;
  primaryDistance?: number;
  isPeriapsis?: boolean;
  isApoapsis?: boolean;
  isNodeBurn?: boolean;
}

export interface PhysicsEngineConfig {
  G: number;
  enableRelativity: boolean;
  enableAtmosphericDrag: boolean;
  enableTidalDisruption: boolean;
  softeningFactorKm: number;
}

export class NBodyPhysicsEngine {
  public config: PhysicsEngineConfig;
  public bodies: CelestialBody[] = [];
  public maneuverNodes: ManeuverNode[] = [];
  public simulationTime: number = 0;
  public initialTotalEnergy: number = 0;
  public currentTotalEnergy: number = 0;
  public energyDriftPercent: number = 0;

  // Collision/event listeners
  public onTidalDisruption?: (parentName: string, fragments: CelestialBody[]) => void;
  public onAtmosphereEntry?: (craftName: string, planetName: string) => void;
  public onManeuverBurn?: (node: ManeuverNode, deltaVMag: number) => void;

  constructor(config: Partial<PhysicsEngineConfig> = {}) {
    this.config = {
      G: config.G ?? 398600.4418,
      enableRelativity: config.enableRelativity ?? false,
      enableAtmosphericDrag: config.enableAtmosphericDrag ?? true,
      enableTidalDisruption: config.enableTidalDisruption ?? true,
      softeningFactorKm: config.softeningFactorKm ?? 10.0,
    };
  }

  public setBodies(bodies: CelestialBody[]): void {
    // Deep clone bodies
    this.bodies = bodies.map((b) => ({
      ...b,
      pos: { ...b.pos },
      vel: { ...b.vel },
      trail: b.trail.map((t) => ({ ...t })),
    }));
    this.initialTotalEnergy = this.calculateTotalMechanicalEnergy();
    this.currentTotalEnergy = this.initialTotalEnergy;
    this.energyDriftPercent = 0;
  }

  public setManeuverNodes(nodes: ManeuverNode[]): void {
    this.maneuverNodes = nodes.map((n) => ({ ...n }));
  }

  /**
   * Computes gravitational accelerations for an array of bodies
   */
  public computeAccelerations(bodyList: CelestialBody[]): Vector2D[] {
    const n = bodyList.length;
    const accels: Vector2D[] = Array.from({ length: n }, () => ({ x: 0, y: 0 }));
    const G = this.config.G;
    const epsSq = this.config.softeningFactorKm * this.config.softeningFactorKm;

    for (let i = 0; i < n; i++) {
      const b1 = bodyList[i];
      if (b1.isStatic) continue;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const b2 = bodyList[j];
        if (b2.mass <= 0) continue;

        const dx = b2.pos.x - b1.pos.x;
        const dy = b2.pos.y - b1.pos.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < 1e-4) continue;

        // Newtonian Gravity: a = G * M / (r^2 + eps^2)^(3/2) * r_vec
        const effectiveDistCubed = Math.pow(distSq + epsSq, 1.5);
        const newtonianMag = (G * b2.mass) / effectiveDistCubed;

        accels[i].x += dx * newtonianMag;
        accels[i].y += dy * newtonianMag;

        // General Relativistic Post-Newtonian (1PN) Precession Correction
        if (this.config.enableRelativity && b2.mass > b1.mass * 100) {
          const hRel = Vec2.cross2D(Vec2.sub(b1.pos, b2.pos), Vec2.sub(b1.vel, b2.vel));
          const c = SPEED_OF_LIGHT_KMS;
          const pnMag = (3 * G * b2.mass * (hRel * hRel)) / (c * c * Math.pow(dist, 4));
          accels[i].x += (dx / dist) * pnMag;
          accels[i].y += (dy / dist) * pnMag;
        }

        // Atmospheric Drag (if b2 has atmosphere and b1 is spacecraft or small body)
        if (this.config.enableAtmosphericDrag && b2.hasAtmosphere && b2.atmosphereHeightKm) {
          const alt = dist - b2.radius;
          if (alt > 0 && alt < b2.atmosphereHeightKm) {
            const scaleHeight = b2.atmosphereHeightKm * 0.18;
            const densitySeaLevel = b2.atmosphereDensitySeaLevel ?? 1.225e-3; // scaled
            const density = densitySeaLevel * Math.exp(-alt / scaleHeight);

            const relVx = b1.vel.x - b2.vel.x;
            const relVy = b1.vel.y - b2.vel.y;
            const relSpeed = Math.sqrt(relVx * relVx + relVy * relVy);

            // Drag acceleration: a_drag = -0.5 * Cd * A/m * rho * v_rel * v_rel_vec
            const dragCoeff = 0.0005; // effective ballistic drag ratio
            const dragAcc = 0.5 * dragCoeff * density * relSpeed;

            accels[i].x -= relVx * dragAcc;
            accels[i].y -= relVy * dragAcc;

            if (alt < b2.atmosphereHeightKm * 0.25 && b1.type === 'SPACECRAFT') {
              this.onAtmosphereEntry?.(b1.name, b2.name);
            }
          }
        }
      }
    }

    return accels;
  }

  /**
   * Advances the simulation by dt seconds using 4th-order Symplectic Yoshida integration
   */
  public step(dt: number): void {
    if (dt <= 0) return;

    // 1. Check and fire scheduled Maneuver Nodes
    this.checkManeuverNodes(dt);

    // 2. Yoshida 4-stage Symplectic Step
    for (let stage = 0; stage < 4; stage++) {
      const c = YOSHIDA_C[stage];
      const d = YOSHIDA_D[stage];

      // Drift positions: r = r + c * v * dt
      for (let i = 0; i < this.bodies.length; i++) {
        const b = this.bodies[i];
        if (b.isStatic) continue;
        b.pos.x += c * b.vel.x * dt;
        b.pos.y += c * b.vel.y * dt;
      }

      // Kick velocities: v = v + d * a * dt
      if (d !== 0) {
        const accels = this.computeAccelerations(this.bodies);
        for (let i = 0; i < this.bodies.length; i++) {
          const b = this.bodies[i];
          if (b.isStatic) continue;
          b.vel.x += d * accels[i].x * dt;
          b.vel.y += d * accels[i].y * dt;
        }
      }
    }

    this.simulationTime += dt;

    // 3. Update orbital historical trails periodically
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      if (b.trail.length === 0 || Vec2.distSq(b.pos, b.trail[b.trail.length - 1]) > (b.radius * 0.25) ** 2) {
        b.trail.push({ x: b.pos.x, y: b.pos.y });
        if (b.trail.length > b.maxTrailLength) {
          b.trail.shift();
        }
      }
    }

    // 4. Check for Tidal Disruption inside Roche Limit
    if (this.config.enableTidalDisruption) {
      this.checkTidalDisruption();
    }

    // 5. Calculate energy drift
    this.currentTotalEnergy = this.calculateTotalMechanicalEnergy();
    if (Math.abs(this.initialTotalEnergy) > 1e-12) {
      this.energyDriftPercent =
        ((this.currentTotalEnergy - this.initialTotalEnergy) / Math.abs(this.initialTotalEnergy)) * 100;
    }
  }

  /**
   * Evaluates active maneuver nodes and executes burns
   */
  private checkManeuverNodes(dt: number): void {
    for (const node of this.maneuverNodes) {
      if (node.executed) continue;

      if (this.simulationTime >= node.timeSeconds && this.simulationTime - dt < node.timeSeconds) {
        const craft = this.bodies.find((b) => b.id === node.targetBodyId);
        if (craft) {
          const speed = Vec2.mag(craft.vel);
          if (speed > 1e-6) {
            const progradeUnit = { x: craft.vel.x / speed, y: craft.vel.y / speed };
            const radialUnit = { x: -progradeUnit.y, y: progradeUnit.x };

            const burnVx = progradeUnit.x * node.deltaVPrograde + radialUnit.x * node.deltaVRadial;
            const burnVy = progradeUnit.y * node.deltaVPrograde + radialUnit.y * node.deltaVRadial;

            craft.vel.x += burnVx;
            craft.vel.y += burnVy;

            const deltaVMag = Math.sqrt(burnVx * burnVx + burnVy * burnVy);

            // Deduct fuel if spacecraft has propulsion specs
            if (craft.fuelKg !== undefined && craft.dryMassKg !== undefined && craft.ispSeconds) {
              const totalMass = craft.dryMassKg + craft.fuelKg;
              const g0 = 0.00980665;
              const finalMass = totalMass * Math.exp(-deltaVMag / (craft.ispSeconds * g0));
              craft.fuelKg = Math.max(0, finalMass - craft.dryMassKg);
            }

            node.executed = true;
            this.onManeuverBurn?.(node, deltaVMag);
          }
        }
      }
    }
  }

  /**
   * Checks if any fragile body enters a massive body's Roche limit and fragments
   */
  private checkTidalDisruption(): void {
    const newFragments: CelestialBody[] = [];
    const bodiesToRemove: string[] = [];

    for (let i = 0; i < this.bodies.length; i++) {
      const b1 = this.bodies[i];
      if (b1.type !== 'ASTEROID' || b1.isFragmented) continue;

      for (let j = 0; j < this.bodies.length; j++) {
        if (i === j) continue;
        const b2 = this.bodies[j];
        if (b2.type !== 'PLANET' && b2.type !== 'STAR' && b2.type !== 'BLACK_HOLE') continue;
        if (b2.mass < b1.mass * 50) continue;

        const dist = Vec2.dist(b1.pos, b2.pos);
        const { fluidRocheLimitKm } = calculateRocheLimit(b2.radius, b2.mass, b1.radius, b1.mass);

        if (dist < fluidRocheLimitKm && dist > b2.radius) {
          // Trigger Tidal Disruption! Split into 6-8 fragments (Shoemaker-Levy 9 effect)
          bodiesToRemove.push(b1.id);
          const fragmentCount = 6;
          const fragmentMass = b1.mass / fragmentCount;
          const fragmentRadius = b1.radius * 0.45;

          const tangent = Vec2.normalize(Vec2.perpendicular(Vec2.sub(b1.pos, b2.pos)));

          for (let f = 0; f < fragmentCount; f++) {
            const offsetDist = (f - (fragmentCount - 1) * 0.5) * (b1.radius * 2.2);
            const fragment: CelestialBody = {
              id: `${b1.id}-frag-${f + 1}`,
              name: `${b1.name}-${String.fromCharCode(65 + f)}`,
              type: 'ASTEROID',
              mass: fragmentMass,
              radius: fragmentRadius,
              pos: {
                x: b1.pos.x + tangent.x * offsetDist,
                y: b1.pos.y + tangent.y * offsetDist,
              },
              vel: {
                x: b1.vel.x + tangent.x * (offsetDist * 0.0001),
                y: b1.vel.y + tangent.y * (offsetDist * 0.0001),
              },
              color: '#f97316',
              glowColor: 'rgba(249, 115, 22, 0.4)',
              trail: [],
              maxTrailLength: 150,
              isFragmented: true,
            };
            newFragments.push(fragment);
          }

          this.onTidalDisruption?.(b2.name, newFragments);
          break;
        }
      }
    }

    if (bodiesToRemove.length > 0) {
      this.bodies = this.bodies.filter((b) => !bodiesToRemove.includes(b.id)).concat(newFragments);
    }
  }

  /**
   * Generates forward predicted trajectory cone for a given body
   * Performs an uncommitted numerical rollout including planned future maneuver nodes
   */
  public predictTrajectory(
    bodyId: string,
    horizonSeconds: number,
    stepCount: number = 600
  ): TrajectoryPoint[] {
    const targetBody = this.bodies.find((b) => b.id === bodyId);
    if (!targetBody) return [];

    // Clone all bodies for shadow simulation
    const shadowBodies: CelestialBody[] = this.bodies.map((b) => ({
      ...b,
      pos: { ...b.pos },
      vel: { ...b.vel },
      trail: [],
    }));

    const shadowTarget = shadowBodies.find((b) => b.id === bodyId)!;
    const dt = horizonSeconds / stepCount;
    const points: TrajectoryPoint[] = [];

    // Find primary body (e.g. nearest massive body)
    let primaryBody: CelestialBody | null = null;
    let maxGravitationalForce = -1;
    for (const b of shadowBodies) {
      if (b.id !== bodyId && b.mass > targetBody.mass) {
        const dSq = Vec2.distSq(targetBody.pos, b.pos);
        const force = b.mass / (dSq + 1e-4);
        if (force > maxGravitationalForce) {
          maxGravitationalForce = force;
          primaryBody = b;
        }
      }
    }

    let prevDist = primaryBody ? Vec2.dist(shadowTarget.pos, primaryBody.pos) : 0;
    let isApproaching = false;

    // Rollout
    let simT = this.simulationTime;
    for (let s = 0; s < stepCount; s++) {
      // Check pending maneuver nodes in shadow sim
      let nodeBurned = false;
      for (const node of this.maneuverNodes) {
        if (!node.executed && simT >= node.timeSeconds && simT - dt < node.timeSeconds) {
          if (node.targetBodyId === bodyId) {
            const spd = Vec2.mag(shadowTarget.vel);
            if (spd > 1e-6) {
              const uPro = { x: shadowTarget.vel.x / spd, y: shadowTarget.vel.y / spd };
              const uRad = { x: -uPro.y, y: uPro.x };
              shadowTarget.vel.x += uPro.x * node.deltaVPrograde + uRad.x * node.deltaVRadial;
              shadowTarget.vel.y += uPro.y * node.deltaVPrograde + uRad.y * node.deltaVRadial;
              nodeBurned = true;
            }
          }
        }
      }

      // Yoshida step in shadow sim
      for (let stage = 0; stage < 4; stage++) {
        const c = YOSHIDA_C[stage];
        const d = YOSHIDA_D[stage];

        for (const b of shadowBodies) {
          if (!b.isStatic) {
            b.pos.x += c * b.vel.x * dt;
            b.pos.y += c * b.vel.y * dt;
          }
        }

        if (d !== 0) {
          const accels = this.computeAccelerations(shadowBodies);
          for (let i = 0; i < shadowBodies.length; i++) {
            const b = shadowBodies[i];
            if (!b.isStatic) {
              b.vel.x += d * accels[i].x * dt;
              b.vel.y += d * accels[i].y * dt;
            }
          }
        }
      }

      simT += dt;

      const currentDist = primaryBody ? Vec2.dist(shadowTarget.pos, primaryBody.pos) : 0;
      let isPeriapsis = false;
      let isApoapsis = false;

      if (primaryBody && s > 1) {
        if (isApproaching && currentDist > prevDist) {
          isPeriapsis = true; // Minimum distance reached
          isApproaching = false;
        } else if (!isApproaching && currentDist < prevDist) {
          isApoapsis = true; // Maximum distance reached
          isApproaching = true;
        }
      }

      if (currentDist < prevDist) {
        isApproaching = true;
      }

      prevDist = currentDist;

      points.push({
        x: shadowTarget.pos.x,
        y: shadowTarget.pos.y,
        time: simT,
        speed: Vec2.mag(shadowTarget.vel),
        primaryDistance: currentDist,
        isPeriapsis,
        isApoapsis,
        isNodeBurn: nodeBurned,
      });
    }

    return points;
  }

  /**
   * Computes Total Mechanical Energy (Kinetic + Gravitational Potential)
   */
  public calculateTotalMechanicalEnergy(): number {
    let kinetic = 0;
    let potential = 0;
    const G = this.config.G;
    const epsSq = this.config.softeningFactorKm * this.config.softeningFactorKm;
    const n = this.bodies.length;

    for (let i = 0; i < n; i++) {
      const b1 = this.bodies[i];
      const vSq = b1.vel.x * b1.vel.x + b1.vel.y * b1.vel.y;
      kinetic += 0.5 * b1.mass * vSq;

      for (let j = i + 1; j < n; j++) {
        const b2 = this.bodies[j];
        const distSq = Vec2.distSq(b1.pos, b2.pos);
        if (distSq > 1e-4) {
          potential -= (G * b1.mass * b2.mass) / Math.sqrt(distSq + epsSq);
        }
      }
    }

    return kinetic + potential;
  }
}
