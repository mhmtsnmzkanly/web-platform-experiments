/**
 * ORBITAL-SLINGSHOT (EXP-025) — Astrodynamics Simulation Engine
 * Reference-Validated Symplectic Celestial Mechanics & Conic Trajectory Solver
 * Natural Units: Length = AU, Time = Year, Mass = Solar Mass (M_sun = 1.0)
 * G * M_sun = 4 * pi^2 (AU^3 / yr^2)
 */
export const G_SOLAR = 4 * Math.PI * Math.PI; // AU^3 / (M_sun * yr^2)
export const KM_S_TO_AU_YR = 0.210945; // 1 km/s in AU/year
export const AU_YR_TO_KM_S = 4.74057; // 1 AU/year in km/s
export const AU_TO_KM = 149597870.7; // 1 AU in km
export class AstrodynamicsEngine {
    bodies = [];
    spacecraft;
    maneuverNode = null;
    simTime = 0; // years
    currentScenario;
    eventListeners = [];
    totalDeltaVUsedKmS = 0;
    missionStatus = 'IN_FLIGHT';
    statusMessage = 'In flight — Nominal trajectory';
    lastSoiBodyId = '';
    prevDistToPrimary = 0;
    isApproachingPrimary = true;
    constructor(scenario) {
        this.currentScenario = scenario;
        this.spacecraft = JSON.parse(JSON.stringify(scenario.spacecraft));
        this.bodies = JSON.parse(JSON.stringify(scenario.bodies));
        if (scenario.initialManeuver) {
            this.maneuverNode = JSON.parse(JSON.stringify(scenario.initialManeuver));
        }
    }
    onEvent(callback) {
        this.eventListeners.push(callback);
        return () => {
            this.eventListeners = this.eventListeners.filter((cb) => cb !== callback);
        };
    }
    emitEvent(event) {
        for (const listener of this.eventListeners) {
            try {
                listener(event);
            }
            catch { }
        }
    }
    /**
     * Main Simulation Step using Symplectic Velocity Verlet
     * Sub-stepped to guarantee energy conservation and prevent close-approach tunneling.
     */
    step(dtYears, numSubSteps = 10) {
        if (!Number.isFinite(dtYears) || dtYears <= 0)
            return;
        if (this.missionStatus === 'CRASHED')
            return;
        const subDt = dtYears / numSubSteps;
        for (let s = 0; s < numSubSteps; s++) {
            this.subStepVerlet(subDt);
            this.simTime += subDt;
            // Check scheduled maneuver node firing
            if (this.maneuverNode && !this.maneuverNode.isExecuted && this.simTime >= this.maneuverNode.epoch) {
                this.executeManeuverNode();
            }
        }
        // Update trails at visual frame intervals
        this.updateTrails();
        // Check SOI and Mission Objectives
        this.evaluateStateAndObjectives();
    }
    /**
     * 2nd-Order Symplectic Velocity Verlet Sub-step
     */
    subStepVerlet(dt) {
        const sc = this.spacecraft;
        // 1. Initial Half-step position update for all bodies and probe
        // Planetary Keplerian orbits (massive bodies)
        for (const b of this.bodies) {
            if (b.isStar)
                continue;
            b.x += 0.5 * dt * b.vx;
            b.y += 0.5 * dt * b.vy;
        }
        if (!sc.isCrashed) {
            sc.x += 0.5 * dt * sc.vx;
            sc.y += 0.5 * dt * sc.vy;
        }
        // 2. Compute accelerations at midpoint positions
        // Planetary accelerations from Sun and massive primaries
        for (const b of this.bodies) {
            if (b.isStar)
                continue;
            const acc = this.computeBodyAcceleration(b);
            b.vx += dt * acc.ax;
            b.vy += dt * acc.ay;
        }
        // Spacecraft acceleration from all celestial bodies
        if (!sc.isCrashed) {
            const scAcc = this.computeSpacecraftAcceleration(sc.x, sc.y);
            sc.vx += dt * scAcc.ax;
            sc.vy += dt * scAcc.ay;
        }
        // 3. Final Half-step position update
        for (const b of this.bodies) {
            if (b.isStar)
                continue;
            b.x += 0.5 * dt * b.vx;
            b.y += 0.5 * dt * b.vy;
        }
        if (!sc.isCrashed) {
            sc.x += 0.5 * dt * sc.vx;
            sc.y += 0.5 * dt * sc.vy;
        }
        // 4. Physical Collision Detection
        for (const b of this.bodies) {
            const dist = Math.hypot(sc.x - b.x, sc.y - b.y);
            if (dist <= b.radius) {
                sc.isCrashed = true;
                sc.crashedBodyName = b.name;
                this.missionStatus = 'CRASHED';
                this.statusMessage = `Impact detected with ${b.name} surface!`;
                this.emitEvent({
                    type: 'CRASH',
                    x: sc.x,
                    y: sc.y,
                    intensity: 1.0,
                    label: `Surface impact on ${b.name}`,
                });
                break;
            }
        }
    }
    /**
     * Gravitational acceleration on a celestial body
     */
    computeBodyAcceleration(body) {
        let ax = 0;
        let ay = 0;
        const softeningSq = 1e-10;
        for (const other of this.bodies) {
            if (other.id === body.id)
                continue;
            const dx = other.x - body.x;
            const dy = other.y - body.y;
            const distSq = dx * dx + dy * dy + softeningSq;
            const dist = Math.sqrt(distSq);
            const forceMag = (G_SOLAR * other.mass) / (distSq * dist);
            ax += forceMag * dx;
            ay += forceMag * dy;
        }
        return { ax, ay };
    }
    /**
     * Gravitational acceleration on a test particle (spacecraft)
     */
    computeSpacecraftAcceleration(x, y) {
        let ax = 0;
        let ay = 0;
        const softeningSq = 1e-10;
        for (const body of this.bodies) {
            const dx = body.x - x;
            const dy = body.y - y;
            const distSq = dx * dx + dy * dy + softeningSq;
            const dist = Math.sqrt(distSq);
            const forceMag = (G_SOLAR * body.mass) / (distSq * dist);
            ax += forceMag * dx;
            ay += forceMag * dy;
        }
        return { ax, ay };
    }
    /**
     * Identifies current Sphere of Influence (SOI) primary
     */
    getCurrentSoiBody() {
        const sc = this.spacecraft;
        // Check non-star planetary SOIs first
        for (const b of this.bodies) {
            if (b.isStar)
                continue;
            const dist = Math.hypot(sc.x - b.x, sc.y - b.y);
            if (dist <= b.soiRadius) {
                return b;
            }
        }
        // Default to central star or first massive primary
        return this.bodies.find((b) => b.isStar) || this.bodies[0];
    }
    /**
     * Computes osculating Keplerian orbital elements relative to current primary
     */
    getOrbitalElements(primary) {
        const p = primary || this.getCurrentSoiBody();
        const sc = this.spacecraft;
        const rx = sc.x - p.x;
        const ry = sc.y - p.y;
        const vx = sc.vx - p.vx;
        const vy = sc.vy - p.vy;
        const r = Math.hypot(rx, ry);
        const v = Math.hypot(vx, vy);
        const mu = G_SOLAR * p.mass;
        // Specific Relative Angular Momentum: h = rx * vy - ry * vx
        const h = rx * vy - ry * vx;
        // Specific Mechanical Energy: epsilon = v^2 / 2 - mu / r
        const specificEnergy = (v * v) / 2.0 - mu / Math.max(1e-8, r);
        // Eccentricity vector e_vec = (v x h) / mu - r_hat
        const ex = (vy * h) / mu - rx / Math.max(1e-8, r);
        const ey = (-vx * h) / mu - ry / Math.max(1e-8, r);
        const eccentricity = Math.hypot(ex, ey);
        // Semi-major axis a = -mu / (2 * epsilon)
        let semiMajorAxis = 0;
        if (Math.abs(specificEnergy) > 1e-12) {
            semiMajorAxis = -mu / (2.0 * specificEnergy);
        }
        else {
            semiMajorAxis = Infinity;
        }
        // Periapsis and Apoapsis distances
        let periapsis = 0;
        let apoapsis = Infinity;
        if (eccentricity < 1.0) {
            // Elliptic or circular orbit
            periapsis = semiMajorAxis * (1.0 - eccentricity);
            apoapsis = semiMajorAxis * (1.0 + eccentricity);
        }
        else {
            // Parabolic or hyperbolic trajectory
            periapsis = (h * h) / (mu * (1.0 + eccentricity));
            apoapsis = Infinity;
        }
        // Orbital Period (Kepler's 3rd Law)
        let period = Infinity;
        if (eccentricity < 1.0 && semiMajorAxis > 0) {
            period = 2.0 * Math.PI * Math.sqrt((semiMajorAxis * semiMajorAxis * semiMajorAxis) / mu);
        }
        let orbitType = 'ELLIPTIC';
        if (eccentricity < 0.01) {
            orbitType = 'CIRCULAR';
        }
        else if (eccentricity < 0.99) {
            orbitType = 'ELLIPTIC';
        }
        else if (Math.abs(eccentricity - 1.0) <= 0.01) {
            orbitType = 'PARABOLIC';
        }
        else {
            orbitType = 'HYPERBOLIC';
        }
        return {
            semiMajorAxis,
            eccentricity,
            periapsis,
            apoapsis,
            period,
            specificEnergy,
            specificAngularMomentum: h,
            orbitType,
            primaryBodyId: p.id,
            primaryBodyName: p.name,
        };
    }
    /**
     * Executes scheduled impulsive Delta-V burn
     */
    executeManeuverNode() {
        if (!this.maneuverNode || this.spacecraft.isCrashed)
            return;
        const node = this.maneuverNode;
        const sc = this.spacecraft;
        // Requested Delta-V magnitude in km/s
        const reqDeltaVKmS = Math.hypot(node.progradeDeltaV, node.radialDeltaV);
        if (reqDeltaVKmS <= 0) {
            node.isExecuted = true;
            return;
        }
        // Fuel availability enforcement
        const actualBurnKmS = Math.min(reqDeltaVKmS, sc.remainingDeltaV);
        const burnRatio = reqDeltaVKmS > 0 ? actualBurnKmS / reqDeltaVKmS : 0;
        const progradeKmS = node.progradeDeltaV * burnRatio;
        const radialKmS = node.radialDeltaV * burnRatio;
        // Convert to AU/yr
        const progradeAuYr = progradeKmS * KM_S_TO_AU_YR;
        const radialAuYr = radialKmS * KM_S_TO_AU_YR;
        // Calculate relative velocity direction for tangential prograde impulse
        const primary = this.getCurrentSoiBody();
        const relVx = sc.vx - primary.vx;
        const relVy = sc.vy - primary.vy;
        const speed = Math.hypot(relVx, relVy);
        let tanX = 0;
        let tanY = 1;
        if (speed > 1e-6) {
            tanX = relVx / speed;
            tanY = relVy / speed;
        }
        // Radial vector (normal to tangent, pointing outward)
        const radX = -tanY;
        const radY = tanX;
        // Apply impulsive velocity step
        sc.vx += progradeAuYr * tanX + radialAuYr * radX;
        sc.vy += progradeAuYr * tanY + radialAuYr * radY;
        // Account for propellant consumption
        sc.remainingDeltaV = Math.max(0, sc.remainingDeltaV - actualBurnKmS);
        this.totalDeltaVUsedKmS += actualBurnKmS;
        node.isExecuted = true;
        this.emitEvent({
            type: 'BURN_EXECUTION',
            x: sc.x,
            y: sc.y,
            intensity: actualBurnKmS / 3.0,
            label: `Burn Executed: ${actualBurnKmS.toFixed(2)} km/s`,
        });
    }
    /**
     * Applies an immediate manual Delta-V burn (interactive slider/button)
     */
    applyManualImpulse(progradeKmS, radialKmS) {
        if (this.spacecraft.isCrashed)
            return;
        const reqDeltaV = Math.hypot(progradeKmS, radialKmS);
        if (reqDeltaV <= 0)
            return;
        const actualBurn = Math.min(reqDeltaV, this.spacecraft.remainingDeltaV);
        const ratio = actualBurn / reqDeltaV;
        const burnPrograde = progradeKmS * ratio * KM_S_TO_AU_YR;
        const burnRadial = radialKmS * ratio * KM_S_TO_AU_YR;
        const primary = this.getCurrentSoiBody();
        const relVx = this.spacecraft.vx - primary.vx;
        const relVy = this.spacecraft.vy - primary.vy;
        const speed = Math.hypot(relVx, relVy);
        let tanX = 0;
        let tanY = 1;
        if (speed > 1e-6) {
            tanX = relVx / speed;
            tanY = relVy / speed;
        }
        const radX = -tanY;
        const radY = tanX;
        this.spacecraft.vx += burnPrograde * tanX + burnRadial * radX;
        this.spacecraft.vy += burnPrograde * tanY + burnRadial * radY;
        this.spacecraft.remainingDeltaV = Math.max(0, this.spacecraft.remainingDeltaV - actualBurn);
        this.totalDeltaVUsedKmS += actualBurn;
        this.emitEvent({
            type: 'BURN_EXECUTION',
            x: this.spacecraft.x,
            y: this.spacecraft.y,
            intensity: actualBurn / 3.0,
            label: `Manual Burn: ${actualBurn.toFixed(2)} km/s`,
        });
    }
    /**
     * Projected Trajectory Prediction (Forward Ghost Probe Integration)
     * Computes the anticipated flight path for up to 300 steps.
     */
    computeProjectedTrajectory(steps = 300, forwardDt = 0.005) {
        const points = [];
        if (this.spacecraft.isCrashed)
            return points;
        // Clone ghost state
        let gx = this.spacecraft.x;
        let gy = this.spacecraft.y;
        let gvx = this.spacecraft.vx;
        let gvy = this.spacecraft.vy;
        let gt = this.simTime;
        // Also clone planetary positions
        const gBodies = this.bodies.map((b) => ({
            id: b.id,
            mass: b.mass,
            x: b.x,
            y: b.y,
            vx: b.vx,
            vy: b.vy,
            radius: b.radius,
        }));
        // If a maneuver node is pending, predict its impulse at node.epoch
        let nodeApplied = this.maneuverNode ? this.maneuverNode.isExecuted : true;
        for (let i = 0; i < steps; i++) {
            // Check if maneuver fires during projection
            if (!nodeApplied && this.maneuverNode && gt >= this.maneuverNode.epoch) {
                const reqBurn = Math.hypot(this.maneuverNode.progradeDeltaV, this.maneuverNode.radialDeltaV);
                const actualBurn = Math.min(reqBurn, this.spacecraft.remainingDeltaV);
                const ratio = reqBurn > 0 ? actualBurn / reqBurn : 0;
                const pAuYr = this.maneuverNode.progradeDeltaV * ratio * KM_S_TO_AU_YR;
                const rAuYr = this.maneuverNode.radialDeltaV * ratio * KM_S_TO_AU_YR;
                const spd = Math.hypot(gvx, gvy);
                const tx = spd > 1e-6 ? gvx / spd : 0;
                const ty = spd > 1e-6 ? gvy / spd : 1;
                const nx = -ty;
                const ny = tx;
                gvx += pAuYr * tx + rAuYr * nx;
                gvy += pAuYr * ty + rAuYr * ny;
                nodeApplied = true;
            }
            // Half-step positions
            for (const b of gBodies) {
                b.x += 0.5 * forwardDt * b.vx;
                b.y += 0.5 * forwardDt * b.vy;
            }
            gx += 0.5 * forwardDt * gvx;
            gy += 0.5 * forwardDt * gvy;
            // Compute ghost acceleration
            let ax = 0;
            let ay = 0;
            for (const b of gBodies) {
                const dx = b.x - gx;
                const dy = b.y - gy;
                const distSq = dx * dx + dy * dy + 1e-10;
                const dist = Math.sqrt(distSq);
                const fMag = (G_SOLAR * b.mass) / (distSq * dist);
                ax += fMag * dx;
                ay += fMag * dy;
            }
            gvx += forwardDt * ax;
            gvy += forwardDt * ay;
            // Final half-step positions
            for (const b of gBodies) {
                b.x += 0.5 * forwardDt * b.vx;
                b.y += 0.5 * forwardDt * b.vy;
            }
            gx += 0.5 * forwardDt * gvx;
            gy += 0.5 * forwardDt * gvy;
            gt += forwardDt;
            // Store point
            points.push({
                x: gx,
                y: gy,
                time: gt,
                speed: Math.hypot(gvx, gvy) * AU_YR_TO_KM_S,
            });
            // Stop projection if collided
            let collided = false;
            for (const b of gBodies) {
                if (Math.hypot(gx - b.x, gy - b.y) <= b.radius) {
                    collided = true;
                    break;
                }
            }
            if (collided)
                break;
        }
        return points;
    }
    /**
     * Tracks history trail points for visualization
     */
    updateTrails() {
        const sc = this.spacecraft;
        if (!sc.isCrashed) {
            sc.trail.push({ x: sc.x, y: sc.y });
            if (sc.trail.length > 200) {
                sc.trail.shift();
            }
        }
        for (const b of this.bodies) {
            if (b.isStar)
                continue;
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 120) {
                b.trail.shift();
            }
        }
    }
    /**
     * Evaluates mission progress, SOI boundaries, and periapsis events
     */
    evaluateStateAndObjectives() {
        const sc = this.spacecraft;
        if (sc.isCrashed)
            return;
        // Detect Deep Space Escape
        const distToOrigin = Math.hypot(sc.x, sc.y);
        if (distToOrigin > 35.0) {
            sc.isEscaped = true;
            this.missionStatus = 'LOST_TO_DEEP_SPACE';
            this.statusMessage = 'Spacecraft escaped into interstellar deep space.';
            return;
        }
        // SOI Transition Detection
        const soiBody = this.getCurrentSoiBody();
        if (soiBody.id !== this.lastSoiBodyId) {
            if (this.lastSoiBodyId !== '') {
                this.emitEvent({
                    type: 'SOI_CHANGE',
                    x: sc.x,
                    y: sc.y,
                    intensity: 0.8,
                    label: `Entered Sphere of Influence of ${soiBody.name}`,
                });
            }
            this.lastSoiBodyId = soiBody.id;
        }
        // Periapsis passage detection
        const dist = Math.hypot(sc.x - soiBody.x, sc.y - soiBody.y);
        if (!this.isApproachingPrimary && dist > this.prevDistToPrimary) {
            // Just passed periapsis
            this.emitEvent({
                type: 'PERIAPSIS_PASS',
                x: sc.x,
                y: sc.y,
                intensity: 0.6,
                label: `Periapsis Passage: ${(dist * AU_TO_KM).toFixed(0)} km from ${soiBody.name}`,
            });
        }
        this.isApproachingPrimary = dist < this.prevDistToPrimary;
        this.prevDistToPrimary = dist;
        // Objective Evaluations
        const scen = this.currentScenario;
        const elem = this.getOrbitalElements(soiBody);
        if (scen.id === 'lunar-insertion') {
            if (soiBody.id === 'moon' && elem.eccentricity < 0.95 && elem.periapsis > 0.00002) {
                this.missionStatus = 'TARGET_REACHED';
                this.statusMessage = 'Mission Success! Artemis inserted into stable Low Lunar Orbit.';
                this.emitEvent({ type: 'MISSION_SUCCESS', x: sc.x, y: sc.y, intensity: 1.0, label: 'Lunar Capture Achieved!' });
            }
        }
        else if (scen.id === 'grand-tour') {
            const sunElements = this.getOrbitalElements(this.bodies.find((b) => b.isStar));
            if (sunElements.apoapsis >= 9.0) {
                this.missionStatus = 'TARGET_REACHED';
                this.statusMessage = 'Mission Success! Jupiter gravity assist boosted trajectory to Saturn.';
                this.emitEvent({ type: 'MISSION_SUCCESS', x: sc.x, y: sc.y, intensity: 1.0, label: 'Grand Tour Assist Verified!' });
            }
        }
        else if (scen.id === 'hohmann-mars') {
            if (soiBody.id === 'mars' && elem.eccentricity < 0.3) {
                this.missionStatus = 'TARGET_REACHED';
                this.statusMessage = 'Mission Success! Ares Surveyor achieved stable Martian orbit.';
                this.emitEvent({ type: 'MISSION_SUCCESS', x: sc.x, y: sc.y, intensity: 1.0, label: 'Mars Capture Complete!' });
            }
        }
        else if (scen.id === 'trojan-parking') {
            const jup = this.bodies.find((b) => b.id === 'jupiter');
            if (jup) {
                // L4 is 60 deg ahead: r_L4 = (5.2 * cos(pi/3), 5.2 * sin(pi/3)) = (2.6, 4.503)
                const l4x = jup.x * 0.5 - jup.y * (Math.sqrt(3) / 2);
                const l4y = jup.x * (Math.sqrt(3) / 2) + jup.y * 0.5;
                const distL4 = Math.hypot(sc.x - l4x, sc.y - l4y);
                const relSpeed = Math.hypot(sc.vx - (-jup.vy * (Math.sqrt(3) / 2) + jup.vx * 0.5), sc.vy - (jup.vx * (Math.sqrt(3) / 2) + jup.vy * 0.5)) * AU_YR_TO_KM_S;
                if (distL4 < 0.5 && relSpeed < 1.5) {
                    this.missionStatus = 'TARGET_REACHED';
                    this.statusMessage = 'Mission Success! Trojan probe locked into stable L4 libration.';
                    this.emitEvent({ type: 'MISSION_SUCCESS', x: sc.x, y: sc.y, intensity: 1.0, label: 'L4 Trojan Parking Success!' });
                }
            }
        }
        else if (scen.id === 'asteroid-deflection') {
            const ast = this.bodies.find((b) => b.id === 'asteroid');
            if (ast) {
                const distAst = Math.hypot(sc.x - ast.x, sc.y - ast.y);
                if (distAst < 0.01) {
                    // Deflect asteroid
                    ast.vx += 0.4;
                    ast.vy += 0.4;
                    this.missionStatus = 'TARGET_REACHED';
                    this.statusMessage = 'Mission Success! Apophis-X trajectory successfully deflected.';
                    this.emitEvent({ type: 'MISSION_SUCCESS', x: sc.x, y: sc.y, intensity: 1.0, label: 'Asteroid Deflected!' });
                }
            }
        }
    }
    /**
     * Comprehensive telemetry snapshot for UI
     */
    getMetrics() {
        const sc = this.spacecraft;
        const primary = this.getCurrentSoiBody();
        const elements = this.getOrbitalElements(primary);
        const relVx = sc.vx - primary.vx;
        const relVy = sc.vy - primary.vy;
        const currentSpeedKmS = Math.hypot(relVx, relVy) * AU_YR_TO_KM_S;
        const distAu = Math.hypot(sc.x - primary.x, sc.y - primary.y);
        const distKm = distAu * AU_TO_KM;
        return {
            simTimeYears: this.simTime,
            simTimeDays: this.simTime * 365.25,
            currentSpeedKmS,
            primaryBodyName: primary.name,
            distanceToPrimaryAu: distAu,
            distanceToPrimaryKm: distKm,
            elements,
            soiBodyName: primary.name,
            remainingDeltaVKmS: sc.remainingDeltaV,
            totalDeltaVUsedKmS: this.totalDeltaVUsedKmS,
            timeWarp: 1.0,
            missionStatus: this.missionStatus,
            statusMessage: this.statusMessage,
        };
    }
}
