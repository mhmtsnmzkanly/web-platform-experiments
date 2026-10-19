/**
 * MARBLE-FORGE (EXP-023) — High-Precision 2D Kinetic Mechanics Engine
 * Integrates:
 * - Symplectic Velocity Verlet sub-stepping for spherical rolling bodies
 * - Continuous contact mechanics for straight & curved rails
 * - Loop-the-loop detachment criteria (N <= 0 check)
 * - Rigid-body seesaw torque & rotational inertia
 * - Domino chain reaction dynamics
 * - Archimedes screw motorized lifts
 * - Target bell resonance triggers
 */
import { MARBLE_MATERIALS } from './MarbleMaterials.js';
export class MarbleSimulationEngine {
    marbles = [];
    elements = [];
    gravity = 9.81; // m/s^2
    bounds = { width: 12.0, height: 8.0 }; // meters
    time = 0;
    completedBellHits = 0;
    eventListeners = [];
    nextMarbleId = 1;
    airDrag = 0.0005; // Air drag coefficient
    constructor(width = 12.0, height = 8.0) {
        this.bounds = { width, height };
    }
    addEventListener(listener) {
        this.eventListeners.push(listener);
    }
    emitEvent(event) {
        for (let i = 0; i < this.eventListeners.length; i++) {
            this.eventListeners[i](event);
        }
    }
    spawnMarble(x, y, material = 'GLASS', vx = 0, vy = 0) {
        const def = MARBLE_MATERIALS[material];
        const marble = {
            id: `marble-${this.nextMarbleId++}`,
            x,
            y,
            vx,
            vy,
            omega: vx / def.radius,
            material,
            mass: def.mass,
            radius: def.radius,
            restitution: def.restitution,
            isGrounded: false,
            trail: [{ x, y }],
        };
        this.marbles.push(marble);
        return marble;
    }
    clearMarbles() {
        this.marbles = [];
        this.completedBellHits = 0;
    }
    resetElements() {
        for (const el of this.elements) {
            if (el.type === 'SEESAW') {
                el.angle = 0;
                el.angularVelocity = 0;
            }
            else if (el.type === 'DOMINO') {
                for (const d of el.dominoes) {
                    d.angle = 0;
                    d.angularVelocity = 0;
                    d.toppled = false;
                }
            }
            else if (el.type === 'TARGET_BELL') {
                el.hitCount = 0;
                el.hasTriggeredObjective = false;
            }
        }
    }
    /**
     * Main Simulation Step with Sub-stepping for Symplectic Numerical Accuracy
     */
    step(dt = 1 / 60) {
        // 8 Sub-steps per visual frame ensures dtSub ~ 2ms for stiff contact resolution
        const subSteps = 8;
        const dtSub = Math.min(0.04, dt) / subSteps;
        for (let s = 0; s < subSteps; s++) {
            this.subStep(dtSub);
        }
        this.time += dt;
        // Trail updates every full visual tick
        for (const m of this.marbles) {
            m.trail.push({ x: m.x, y: m.y });
            if (m.trail.length > 20) {
                m.trail.shift();
            }
        }
        // Despawn marbles falling below boundary
        this.marbles = this.marbles.filter((m) => m.y < this.bounds.height + 2.0 && m.x > -2.0 && m.x < this.bounds.width + 2.0);
    }
    subStep(dt) {
        // 1. Spawner logic
        for (const el of this.elements) {
            if (el.type === 'MARBLE_SPAWNER' && el.autoSpawn) {
                if (this.time - el.lastSpawnTime >= el.spawnInterval) {
                    el.lastSpawnTime = this.time;
                    if (this.marbles.length < 30) {
                        this.spawnMarble(el.x, el.y, el.material, el.spawnVx, el.spawnVy);
                    }
                }
            }
        }
        // 2. Dynamic elements update (Seesaw damping, Archimedes spiral phase)
        for (const el of this.elements) {
            if (el.type === 'ARCHIMEDES_LIFT') {
                el.spiralPhase = (el.spiralPhase + el.liftSpeed * dt * 4.0) % (Math.PI * 2);
            }
            else if (el.type === 'SEESAW') {
                // Lever rotational damping and angle integration
                el.angle += el.angularVelocity * dt;
                el.angularVelocity *= Math.pow(0.97, dt * 60);
                if (el.angle < el.minAngle) {
                    el.angle = el.minAngle;
                    el.angularVelocity = -el.angularVelocity * 0.25;
                }
                else if (el.angle > el.maxAngle) {
                    el.angle = el.maxAngle;
                    el.angularVelocity = -el.angularVelocity * 0.25;
                }
            }
            else if (el.type === 'DOMINO') {
                for (let i = 0; i < el.dominoes.length; i++) {
                    const d = el.dominoes[i];
                    if (d.toppled) {
                        d.angle += d.angularVelocity * dt;
                        d.angularVelocity += 14.0 * dt; // Gravity topple acceleration
                        if (d.angle > 1.25) {
                            d.angle = 1.25;
                            d.angularVelocity = 0;
                        }
                        // Propagate topple to next domino in chain
                        if (i < el.dominoes.length - 1 && d.angle > 0.45) {
                            const nextD = el.dominoes[i + 1];
                            if (!nextD.toppled) {
                                nextD.toppled = true;
                                nextD.angularVelocity = d.angularVelocity * 0.85;
                                this.emitEvent({
                                    type: 'DOMINO',
                                    x: nextD.x,
                                    y: nextD.y,
                                    intensity: 0.6,
                                });
                            }
                        }
                    }
                }
            }
            else if (el.type === 'BUMPER') {
                if (el.cooldownTimer > 0) {
                    el.cooldownTimer = Math.max(0, el.cooldownTimer - dt);
                }
            }
        }
        // 3. Marble Kinematics & Gravity
        for (const m of this.marbles) {
            // Free acceleration under gravity
            m.vy += this.gravity * dt;
            // Position update
            m.x += m.vx * dt;
            m.y += m.vy * dt;
            // Air resistance
            if (this.airDrag > 0) {
                m.vx *= Math.pow(1 - this.airDrag, dt * 60);
                m.vy *= Math.pow(1 - this.airDrag, dt * 60);
            }
            // Contact flags reset
            m.isGrounded = false;
            // 4. Track Element Interactions
            for (const el of this.elements) {
                this.resolveElementInteraction(m, el, dt);
            }
        }
        // 5. Marble-to-Marble Pairwise Collisions
        for (let i = 0; i < this.marbles.length; i++) {
            for (let j = i + 1; j < this.marbles.length; j++) {
                this.resolveMarbleMarbleCollision(this.marbles[i], this.marbles[j]);
            }
        }
    }
    /**
     * Resolves collision/contact between a marble and a track element
     */
    resolveElementInteraction(m, el, dt) {
        switch (el.type) {
            case 'STRAIGHT_RAIL':
                this.resolveStraightRail(m, el, dt);
                break;
            case 'CURVED_RAIL':
                this.resolveCurvedRail(m, el);
                break;
            case 'LOOP_THE_LOOP':
                this.resolveLoopTheLoop(m, el);
                break;
            case 'FUNNEL':
                this.resolveFunnel(m, el, dt);
                break;
            case 'BUMPER':
                this.resolveBumper(m, el);
                break;
            case 'SEESAW':
                this.resolveSeesaw(m, el, dt);
                break;
            case 'DOMINO':
                this.resolveDomino(m, el);
                break;
            case 'ARCHIMEDES_LIFT':
                this.resolveArchimedesLift(m, el, dt);
                break;
            case 'TARGET_BELL':
                this.resolveTargetBell(m, el);
                break;
        }
    }
    /**
     * Straight Rail Segment: Point-to-segment projection with rolling friction
     */
    resolveStraightRail(m, rail, dt) {
        const rx = rail.x2 - rail.x1;
        const ry = rail.y2 - rail.y1;
        const lenSq = rx * rx + ry * ry;
        if (lenSq < 1e-6)
            return;
        // Segment normal (pointing outward/upward)
        const len = Math.sqrt(lenSq);
        const nx = -ry / len;
        const ny = rx / len;
        // Projection parameter t
        const mx = m.x - rail.x1;
        const my = m.y - rail.y1;
        const t = Math.max(0, Math.min(1, (mx * rx + my * ry) / lenSq));
        // Closest point on rail
        const px = rail.x1 + t * rx;
        const py = rail.y1 + t * ry;
        const dx = m.x - px;
        const dy = m.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < m.radius) {
            const pen = m.radius - dist;
            // Normal direction (facing away from rail)
            const normX = dist > 1e-5 ? dx / dist : nx;
            const normY = dist > 1e-5 ? dy / dist : ny;
            // Position correction
            m.x += normX * pen;
            m.y += normY * pen;
            // Velocity decomposition
            const vDotN = m.vx * normX + m.vy * normY;
            if (vDotN < 0) {
                // Tangential unit vector
                const tx = -normY;
                const ty = normX;
                const vDotT = m.vx * tx + m.vy * ty;
                // Rolling constraint: a_roll = (5/7) g sin(theta)
                // Subtract rotational inertia transfer (2/7 of tangential gravity component)
                const gTan = this.gravity * ty * dt;
                let rollVt = vDotT - (2 / 7) * gTan;
                // Physical rolling friction retardation: a_friction = (mu_rail + mu_marble) * g * cos(theta)
                const normalAcc = this.gravity * Math.abs(normY);
                const muTotal = rail.friction + MARBLE_MATERIALS[m.material].rollingFriction;
                const dragVt = Math.min(Math.abs(rollVt), muTotal * normalAcc * dt);
                const newVt = rollVt > 0 ? rollVt - dragVt : (rollVt < 0 ? rollVt + dragVt : 0);
                // Distinguish resting rolling contact from energetic impact rebound
                let newVn = 0;
                if (Math.abs(vDotN) > 0.25) {
                    newVn = -m.restitution * vDotN;
                    m.isGrounded = false;
                }
                else {
                    m.isGrounded = true;
                }
                m.vx = tx * newVt + normX * newVn;
                m.vy = ty * newVt + normY * newVn;
                m.omega = newVt / m.radius;
                if (Math.abs(vDotN) > 0.4) {
                    this.emitEvent({
                        type: 'RAIL',
                        x: px,
                        y: py,
                        intensity: Math.min(1.0, Math.abs(vDotN) / 4.0),
                    });
                }
            }
        }
    }
    /**
     * Curved Rail Arc Segment
     */
    resolveCurvedRail(m, arc) {
        const dx = m.x - arc.cx;
        const dy = m.y - arc.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1e-5)
            return;
        let angle = Math.atan2(dy, dx);
        if (angle < 0)
            angle += Math.PI * 2;
        let start = arc.startAngle;
        let end = arc.endAngle;
        if (start > end) {
            // Crosses zero radians
            if (angle < start && angle > end)
                return;
        }
        else {
            if (angle < start || angle > end)
                return;
        }
        const targetDist = arc.radius;
        const delta = Math.abs(dist - targetDist);
        if (delta < m.radius) {
            const pen = m.radius - delta;
            const sign = dist > targetDist ? 1 : -1;
            const nx = (dx / dist) * sign;
            const ny = (dy / dist) * sign;
            m.x += nx * pen;
            m.y += ny * pen;
            const vDotN = m.vx * nx + m.vy * ny;
            if (vDotN < 0) {
                m.vx -= (1 + m.restitution) * vDotN * nx;
                m.vy -= (1 + m.restitution) * vDotN * ny;
                m.isGrounded = true;
            }
        }
    }
    /**
     * Loop-the-Loop Centripetal Stability & Detachment Check
     */
    resolveLoopTheLoop(m, loop) {
        const dx = m.x - loop.cx;
        const dy = m.y - loop.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1e-5)
            return;
        const innerRadius = loop.radius;
        const pen = dist - (innerRadius - m.radius);
        const radialVel = (m.vx * dx + m.vy * dy) / dist;
        if (dist <= innerRadius + 0.05 && pen > 0 && radialVel > -0.5) {
            // In track vicinity: check normal force N = m(v^2/R) - mg cos(theta)
            // theta = 0 at bottom, PI at top
            const theta = Math.atan2(dx, -dy); // 0 at bottom, PI at top
            const speedSq = m.vx * m.vx + m.vy * m.vy;
            const centripetalAcc = speedSq / innerRadius;
            const gravityNormal = this.gravity * Math.cos(theta);
            const normalForce = m.mass * (centripetalAcc - gravityNormal);
            if (normalForce > 0) {
                // Maintained contact: constraint along circle
                const nx = -dx / dist;
                const ny = -dy / dist;
                m.x = loop.cx + (innerRadius - m.radius) * (dx / dist);
                m.y = loop.cy + (innerRadius - m.radius) * (dy / dist);
                // Project velocity tangentially
                const tx = -ny;
                const ty = nx;
                const speed = Math.sqrt(speedSq);
                const dir = (m.vx * tx + m.vy * ty) >= 0 ? 1 : -1;
                m.vx = tx * speed * dir;
                m.vy = ty * speed * dir;
                m.isGrounded = true;
            }
            else {
                // Normal force dropped below zero! Detaches in free ballistic flight
                // Do not force circle constraint; let gravity and momentum govern trajectory
            }
        }
    }
    /**
     * Funnel Gravity Well / Vortex
     */
    resolveFunnel(m, funnel, dt) {
        const dx = m.x - funnel.cx;
        const dy = m.y - funnel.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < funnel.outerRadius && dist > funnel.drainRadius) {
            // Conical slope inwards
            const inwardFactor = 3.5;
            const nx = -dx / dist;
            const ny = -dy / dist;
            // Inward gravity pull
            m.vx += nx * inwardFactor * dt;
            m.vy += ny * inwardFactor * dt;
            // Tangential orbital spin
            const tx = -ny;
            const ty = nx;
            m.vx += tx * 1.5 * dt;
            m.vy += ty * 1.5 * dt;
            // Surface friction
            m.vx *= Math.pow(0.98, dt * 60);
            m.vy *= Math.pow(0.98, dt * 60);
        }
        else if (dist <= funnel.drainRadius) {
            // Reached drain hole: transport through chute
            m.x = funnel.drainX;
            m.y = funnel.drainY;
            m.vy = Math.max(1.8, Math.abs(m.vy));
            m.vx = (Math.random() - 0.5) * 0.4;
        }
    }
    /**
     * Pinball Bumper / Trampoline Bouncer
     */
    resolveBumper(m, bumper) {
        const dx = m.x - bumper.x;
        const dy = m.y - bumper.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = bumper.radius + m.radius;
        if (dist < minDist) {
            const pen = minDist - dist;
            const nx = dist > 1e-5 ? dx / dist : 1;
            const ny = dist > 1e-5 ? dy / dist : 0;
            m.x += nx * pen;
            m.y += ny * pen;
            // High energetic impulse kick
            const kick = bumper.kickImpulse;
            m.vx = nx * (Math.abs(m.vx) * 1.25 + kick);
            m.vy = ny * (Math.abs(m.vy) * 1.25 + kick);
            bumper.cooldownTimer = 0.2;
            this.emitEvent({
                type: 'BUMPER',
                x: bumper.x,
                y: bumper.y,
                intensity: 0.9,
                frequency: 784, // G5 chime
            });
        }
    }
    /**
     * Seesaw / Tilting Lever
     */
    resolveSeesaw(m, lever, dt) {
        const halfL = lever.length / 2;
        const cosA = Math.cos(lever.angle);
        const sinA = Math.sin(lever.angle);
        // Transform marble to lever local coordinate system
        const relX = m.x - lever.px;
        const relY = m.y - lever.py;
        const localX = relX * cosA + relY * sinA;
        const localY = -relX * sinA + relY * cosA;
        if (Math.abs(localX) <= halfL + m.radius * 0.5 && Math.abs(localY) <= m.radius + 0.05) {
            // Marble is contacting lever beam
            const pen = m.radius + 0.04 - Math.abs(localY);
            if (pen > 0) {
                const signY = localY >= 0 ? 1 : -1;
                // World normal
                const nx = -sinA * signY;
                const ny = cosA * signY;
                m.x += nx * pen;
                m.y += ny * pen;
                // Contact force pushing down on lever: F = m*g + dynamic normal
                const leverArm = localX; // Distance from pivot
                const forceNorm = m.mass * this.gravity * cosA;
                const torque = leverArm * forceNorm * signY;
                // Lever moment of inertia I = (1/12) M L^2
                const iLever = (1 / 12) * lever.mass * lever.length * lever.length;
                // Integrate angular velocity using current sub-step dt
                lever.angularVelocity += (torque / iLever) * dt;
                // Tangential rolling dynamics along plank beam
                const tx = cosA;
                const ty = sinA;
                const vDotT = m.vx * tx + m.vy * ty;
                // Gravity component down the inclined beam: a_roll = (5/7) g sin(angle)
                const gTan = this.gravity * ty * dt;
                const newVt = vDotT + (5 / 7) * gTan;
                // Impart lever rotational normal surface velocity to marble
                const surfaceVel = lever.angularVelocity * leverArm;
                const normVx = -sinA * surfaceVel;
                const normVy = cosA * surfaceVel;
                m.vx = tx * newVt + normVx;
                m.vy = ty * newVt + normVy;
                m.omega = newVt / m.radius;
                m.isGrounded = true;
                if (Math.abs(lever.angularVelocity) > 0.5) {
                    this.emitEvent({
                        type: 'SEESAW',
                        x: lever.px + localX * cosA,
                        y: lever.py + localX * sinA,
                        intensity: Math.min(1.0, Math.abs(lever.angularVelocity) / 3.0),
                    });
                }
            }
        }
    }
    /**
     * Domino Chain Collision
     */
    resolveDomino(m, chain) {
        for (const d of chain.dominoes) {
            if (d.toppled)
                continue;
            const dx = m.x - d.x;
            const dy = m.y - d.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < m.radius + d.width * 1.5 && Math.abs(dy) < d.height) {
                // Marble struck upright domino!
                d.toppled = true;
                d.angularVelocity = Math.max(3.5, Math.abs(m.vx) * 1.8);
                // Momentum transfer: marble rebounds or slows
                m.vx *= -0.3;
                m.vy *= 0.5;
                this.emitEvent({
                    type: 'DOMINO',
                    x: d.x,
                    y: d.y,
                    intensity: 0.8,
                });
            }
        }
    }
    /**
     * Archimedes Screw / Motorized Conveyor Lift
     */
    resolveArchimedesLift(m, lift, dt) {
        const dx = Math.abs(m.x - lift.x);
        if (dx < lift.radius + m.radius && m.y <= lift.bottomY + 0.2 && m.y >= lift.topY - 0.2) {
            // Marble is inside vertical lift shaft
            m.x = lift.x + Math.sin(lift.spiralPhase) * (lift.radius * 0.4);
            m.vy = -lift.liftSpeed; // Constant upward vertical velocity
            m.vx = 0;
            m.isGrounded = true;
            // Reached top summit chute: release outwards
            if (m.y <= lift.topY) {
                m.vy = -0.5;
                m.vx = 1.6; // Launch to right chute
                m.y = lift.topY - 0.05;
            }
        }
    }
    /**
     * Target Objective Bell / Chime
     */
    resolveTargetBell(m, bell) {
        const dx = m.x - bell.x;
        const dy = m.y - bell.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bell.radius + m.radius) {
            const pen = bell.radius + m.radius - dist;
            const nx = dist > 1e-5 ? dx / dist : 0;
            const ny = dist > 1e-5 ? dy / dist : -1;
            m.x += nx * pen;
            m.y += ny * pen;
            // Elastic rebound
            const vDotN = m.vx * nx + m.vy * ny;
            if (vDotN < 0) {
                m.vx -= (1 + m.restitution) * vDotN * nx;
                m.vy -= (1 + m.restitution) * vDotN * ny;
                bell.hitCount++;
                bell.hasTriggeredObjective = true;
                this.completedBellHits++;
                this.emitEvent({
                    type: 'BELL',
                    x: bell.x,
                    y: bell.y,
                    intensity: Math.min(1.0, Math.abs(vDotN) / 2.5),
                    frequency: bell.noteFrequency,
                });
            }
        }
    }
    /**
     * Pairwise Marble Elastic/Inelastic Collision Resolution
     */
    resolveMarbleMarbleCollision(m1, m2) {
        const dx = m2.x - m1.x;
        const dy = m2.y - m1.y;
        const distSq = dx * dx + dy * dy;
        const minDist = m1.radius + m2.radius;
        if (distSq < minDist * minDist && distSq > 1e-8) {
            const dist = Math.sqrt(distSq);
            const pen = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            // Positional separation
            m1.x -= nx * pen;
            m1.y -= ny * pen;
            m2.x += nx * pen;
            m2.y += ny * pen;
            // Relative velocity along collision normal
            const rvx = m1.vx - m2.vx;
            const rvy = m1.vy - m2.vy;
            const vNorm = rvx * nx + rvy * ny;
            if (vNorm > 0) {
                // Approaching each other
                const e = (m1.restitution + m2.restitution) * 0.5;
                const invMass1 = 1 / m1.mass;
                const invMass2 = 1 / m2.mass;
                const impulse = (-(1 + e) * vNorm) / (invMass1 + invMass2);
                m1.vx += impulse * invMass1 * nx;
                m1.vy += impulse * invMass1 * ny;
                m2.vx -= impulse * invMass2 * nx;
                m2.vy -= impulse * invMass2 * ny;
                if (Math.abs(vNorm) > 0.25) {
                    this.emitEvent({
                        type: 'MARBLE',
                        x: (m1.x + m2.x) * 0.5,
                        y: (m1.y + m2.y) * 0.5,
                        intensity: Math.min(1.0, Math.abs(vNorm) / 3.0),
                    });
                }
            }
        }
    }
    /**
     * Computes Live Physical Telemetry & Energetics
     */
    getMetrics(fps = 60, requiredHits = 1) {
        let ke = 0;
        let pe = 0;
        let maxV = 0;
        for (const m of this.marbles) {
            const vSq = m.vx * m.vx + m.vy * m.vy;
            const v = Math.sqrt(vSq);
            if (v > maxV)
                maxV = v;
            // Rolling sphere KE: 0.7 * m * v^2
            ke += 0.7 * m.mass * vSq;
            // PE relative to bottom boundary
            pe += m.mass * this.gravity * Math.max(0, this.bounds.height - m.y);
        }
        return {
            activeMarbles: this.marbles.length,
            completedBellHits: this.completedBellHits,
            kineticEnergy: Number(ke.toFixed(3)),
            potentialEnergy: Number(pe.toFixed(3)),
            totalEnergy: Number((ke + pe).toFixed(3)),
            maxVelocity: Number(maxV.toFixed(2)),
            fps,
            isObjectiveMet: this.completedBellHits >= requiredHits,
        };
    }
}
