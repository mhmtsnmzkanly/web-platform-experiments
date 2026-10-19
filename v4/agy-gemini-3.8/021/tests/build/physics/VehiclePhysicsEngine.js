/**
 * PONTIFEX (EXP-021) — Vehicle Kinematics & Wheel-Deck Contact Engine
 * Simulates multi-wheeled vehicles (Car, Heavy Truck, Ore Train, Monster Truck),
 * suspension springs, drive traction, wheel-road segment collision,
 * and normal load transmission to bridge nodes.
 */
import { GRAVITY } from './MaterialConstants.js';
export class VehiclePhysicsEngine {
    /**
     * Initializes vehicle at starting position on the left cliff
     */
    static createVehicle(type, startX, startY) {
        switch (type) {
            case 'CAR':
                return {
                    type: 'CAR',
                    name: 'Sedan Car',
                    x: startX,
                    y: startY + 0.6,
                    vx: 0.0,
                    vy: 0.0,
                    angle: 0.0,
                    angularVelocity: 0.0,
                    mass: 1400.0, // kg
                    length: 3.6,
                    height: 1.2,
                    frontWheel: {
                        relX: 1.3,
                        relY: -0.4,
                        worldX: startX + 1.3,
                        worldY: startY + 0.2,
                        vx: 0,
                        vy: 0,
                        radius: 0.38,
                        onRoad: false,
                    },
                    rearWheel: {
                        relX: -1.3,
                        relY: -0.4,
                        worldX: startX - 1.3,
                        worldY: startY + 0.2,
                        vx: 0,
                        vy: 0,
                        radius: 0.38,
                        onRoad: false,
                    },
                    driveForce: 4200.0, // N
                    maxSpeed: 13.0, // m/s (~47 km/h)
                    isGrounded: false,
                    status: 'READY',
                };
            case 'TRUCK':
                return {
                    type: 'TRUCK',
                    name: 'Heavy Delivery Truck',
                    x: startX,
                    y: startY + 0.8,
                    vx: 0.0,
                    vy: 0.0,
                    angle: 0.0,
                    angularVelocity: 0.0,
                    mass: 5500.0, // kg (heavy load)
                    length: 5.5,
                    height: 1.8,
                    frontWheel: {
                        relX: 2.1,
                        relY: -0.5,
                        worldX: startX + 2.1,
                        worldY: startY + 0.3,
                        vx: 0,
                        vy: 0,
                        radius: 0.52,
                        onRoad: false,
                    },
                    rearWheel: {
                        relX: -2.1,
                        relY: -0.5,
                        worldX: startX - 2.1,
                        worldY: startY + 0.3,
                        vx: 0,
                        vy: 0,
                        radius: 0.52,
                        onRoad: false,
                    },
                    driveForce: 9500.0,
                    maxSpeed: 10.0,
                    isGrounded: false,
                    status: 'READY',
                };
            case 'TRAIN':
                return {
                    type: 'TRAIN',
                    name: 'Heavy Ore Train Locomotive',
                    x: startX,
                    y: startY + 0.9,
                    vx: 0.0,
                    vy: 0.0,
                    angle: 0.0,
                    angularVelocity: 0.0,
                    mass: 14000.0, // kg (massive weight test)
                    length: 8.5,
                    height: 2.2,
                    frontWheel: {
                        relX: 3.4,
                        relY: -0.6,
                        worldX: startX + 3.4,
                        worldY: startY + 0.3,
                        vx: 0,
                        vy: 0,
                        radius: 0.48,
                        onRoad: false,
                    },
                    rearWheel: {
                        relX: -3.4,
                        relY: -0.6,
                        worldX: startX - 3.4,
                        worldY: startY + 0.3,
                        vx: 0,
                        vy: 0,
                        radius: 0.48,
                        onRoad: false,
                    },
                    driveForce: 24000.0,
                    maxSpeed: 8.5,
                    isGrounded: false,
                    status: 'READY',
                };
            case 'MONSTER_TRUCK':
                return {
                    type: 'MONSTER_TRUCK',
                    name: 'Monster Jump Truck',
                    x: startX,
                    y: startY + 1.2,
                    vx: 0.0,
                    vy: 0.0,
                    angle: 0.0,
                    angularVelocity: 0.0,
                    mass: 2800.0,
                    length: 4.2,
                    height: 2.0,
                    frontWheel: {
                        relX: 1.6,
                        relY: -0.7,
                        worldX: startX + 1.6,
                        worldY: startY + 0.5,
                        vx: 0,
                        vy: 0,
                        radius: 0.82, // Giant tires
                        onRoad: false,
                    },
                    rearWheel: {
                        relX: -1.6,
                        relY: -0.7,
                        worldX: startX - 1.6,
                        worldY: startY + 0.5,
                        vx: 0,
                        vy: 0,
                        radius: 0.82,
                        onRoad: false,
                    },
                    driveForce: 11000.0,
                    maxSpeed: 18.0,
                    isGrounded: false,
                    status: 'READY',
                };
        }
    }
    /**
     * Advances vehicle dynamics, resolves wheel-road contacts, and applies load to bridge nodes.
     */
    static stepVehicle(vehicle, nodes, members, dt, leftCliffMaxX, rightCliffMinX, leftCliffY, targetFlagX, waterLevelY, rightCliffY = leftCliffY) {
        if (vehicle.status !== 'DRIVING')
            return;
        const nodeMap = new Map();
        nodes.forEach((n) => nodeMap.set(n.id, n));
        const tireStiffness = 180000.0; // N/m
        const tireDamping = 1200.0; // N*s/m
        // Update wheel world positions from chassis transform
        const cosA = Math.cos(vehicle.angle);
        const sinA = Math.sin(vehicle.angle);
        const updateWheelPos = (w) => {
            w.worldX = vehicle.x + w.relX * cosA - w.relY * sinA;
            w.worldY = vehicle.y + w.relX * sinA + w.relY * cosA;
            w.vx = vehicle.vx - vehicle.angularVelocity * (w.relX * sinA + w.relY * cosA);
            w.vy = vehicle.vy + vehicle.angularVelocity * (w.relX * cosA - w.relY * sinA);
            w.onRoad = false;
            w.contactRoadId = undefined;
        };
        updateWheelPos(vehicle.frontWheel);
        updateWheelPos(vehicle.rearWheel);
        let totalFx = 0.0;
        let totalFy = -vehicle.mass * GRAVITY;
        let totalTorque = 0.0;
        let groundedCount = 0;
        const wheels = [vehicle.rearWheel, vehicle.frontWheel];
        // Helper to resolve contact with a line segment
        const resolveSegmentContact = (w, x1, y1, x2, y2, isSolidTerrain, roadMember) => {
            const segDx = x2 - x1;
            const segDy = y2 - y1;
            const segLenSq = segDx * segDx + segDy * segDy;
            if (segLenSq < 1e-6)
                return;
            const segLen = Math.sqrt(segLenSq);
            const ux = segDx / segLen;
            const uy = segDy / segLen;
            // Normal vector pointing "upward" (counterclockwise)
            const nx = -uy;
            const ny = ux;
            // Project wheel center onto segment line
            const wx = w.worldX - x1;
            const wy = w.worldY - y1;
            const t = (wx * ux + wy * uy) / segLen;
            if (t >= -0.05 && t <= 1.05) {
                // Distance perpendicular to line (signed)
                const perpDist = wx * nx + wy * ny;
                if (perpDist < w.radius && perpDist > -w.radius * 1.5) {
                    const penetration = w.radius - perpDist;
                    w.onRoad = true;
                    groundedCount++;
                    // Normal contact restoring force
                    const vPerp = w.vx * nx + w.vy * ny;
                    const normalForceMag = Math.max(0.0, tireStiffness * penetration - tireDamping * vPerp);
                    const contactFx = normalForceMag * nx;
                    const contactFy = normalForceMag * ny;
                    // Tangential drive traction
                    let driveForceMag = 0.0;
                    if (vehicle.vx < vehicle.maxSpeed) {
                        driveForceMag = vehicle.driveForce * 0.5; // Shared across wheels
                    }
                    const tractionFx = driveForceMag * ux;
                    const tractionFy = driveForceMag * uy;
                    // Apply to vehicle chassis
                    totalFx += contactFx + tractionFx;
                    totalFy += contactFy + tractionFy;
                    // Torque about center of mass: tau = r x F
                    const rx = w.worldX - vehicle.x;
                    const ry = w.worldY - vehicle.y;
                    totalTorque += rx * (contactFy + tractionFy) - ry * (contactFx + tractionFx);
                    // If contact is with an active bridge road deck, transfer reaction force to bridge nodes!
                    if (roadMember) {
                        w.contactRoadId = roadMember.id;
                        const clampedT = Math.max(0.0, Math.min(1.0, t));
                        const nodeA = nodeMap.get(roadMember.nodeAId);
                        const nodeB = nodeMap.get(roadMember.nodeBId);
                        // Reaction is equal & opposite
                        const reactionFx = -(contactFx + tractionFx);
                        const reactionFy = -(contactFy + tractionFy);
                        if (nodeA && !nodeA.isAnchor) {
                            nodeA.fx += reactionFx * (1.0 - clampedT);
                            nodeA.fy += reactionFy * (1.0 - clampedT);
                            nodeA.extFx = (nodeA.extFx || 0.0) + reactionFx * (1.0 - clampedT);
                            nodeA.extFy = (nodeA.extFy || 0.0) + reactionFy * (1.0 - clampedT);
                        }
                        if (nodeB && !nodeB.isAnchor) {
                            nodeB.fx += reactionFx * clampedT;
                            nodeB.fy += reactionFy * clampedT;
                            nodeB.extFx = (nodeB.extFx || 0.0) + reactionFx * clampedT;
                            nodeB.extFy = (nodeB.extFy || 0.0) + reactionFy * clampedT;
                        }
                    }
                }
            }
        };
        // 1. Resolve contact with Left & Right Cliff approaches
        for (const w of wheels) {
            // Left approach road: from x = -50 to x = leftCliffMaxX at y = leftCliffY
            resolveSegmentContact(w, leftCliffMaxX - 30.0, leftCliffY, leftCliffMaxX, leftCliffY, true);
            // Right approach road: from x = rightCliffMinX to x = rightCliffMinX + 30 at y = rightCliffY
            resolveSegmentContact(w, rightCliffMinX, rightCliffY, rightCliffMinX + 30.0, rightCliffY, true);
            // 2. Resolve contact with all active ROAD deck members
            for (const m of members) {
                if (m.isBroken || m.material !== 'ROAD')
                    continue;
                const nA = nodeMap.get(m.nodeAId);
                const nB = nodeMap.get(m.nodeBId);
                if (!nA || !nB)
                    continue;
                // Ensure left-to-right orientation for positive upward normal
                if (nA.x <= nB.x) {
                    resolveSegmentContact(w, nA.x, nA.y, nB.x, nB.y, false, m);
                }
                else {
                    resolveSegmentContact(w, nB.x, nB.y, nA.x, nA.y, false, m);
                }
            }
        }
        vehicle.isGrounded = groundedCount > 0;
        // Chassis Moment of Inertia (solid rectangle approximation: I = (1/12) * M * (L^2 + H^2))
        const inertia = (1.0 / 12.0) * vehicle.mass * (vehicle.length * vehicle.length + vehicle.height * vehicle.height);
        // Aerodynamic and rolling drag
        totalFx -= 0.5 * 1.2 * 1.8 * vehicle.vx * Math.abs(vehicle.vx);
        totalTorque -= 250.0 * vehicle.angularVelocity;
        // Linear motion integration
        const ax = totalFx / vehicle.mass;
        const ay = totalFy / vehicle.mass;
        vehicle.vx += ax * dt;
        vehicle.vy += ay * dt;
        vehicle.x += vehicle.vx * dt;
        vehicle.y += vehicle.vy * dt;
        // Angular motion integration
        const alpha = totalTorque / inertia;
        vehicle.angularVelocity += alpha * dt;
        vehicle.angle += vehicle.angularVelocity * dt;
        // Goal & Failure checks
        if (vehicle.x >= targetFlagX && vehicle.isGrounded) {
            vehicle.status = 'SUCCESS';
        }
        else if (vehicle.y < waterLevelY + 0.3 || Math.abs(vehicle.angle) > 1.45) {
            // Fallen in water or flipped over upside down
            vehicle.status = 'CRASHED';
        }
    }
}
