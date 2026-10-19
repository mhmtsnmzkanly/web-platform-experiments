/**
 * PONTIFEX (EXP-021) — 2D Truss Physics Engine
 * High-order sub-stepped symplectic solver for lumped-mass pin-jointed elastic trusses.
 * Models Hookean elasticity, viscous member damping, cable slack asymmetry,
 * and brittle fracture stress thresholds.
 */

import { TrussNode, TrussMember, MaterialType } from '../types';
import { MATERIAL_PROPERTIES, GRAVITY, AIR_DAMPING, WATER_DAMPING, SUBSTEPS } from './MaterialConstants.js';

export interface SnapEvent {
  memberId: string;
  material: MaterialType;
  stress: number;
  x: number;
  y: number;
}

export class TrussPhysicsEngine {
  /**
   * Recalculates lumped node masses based on half-length distribution of connected members
   */
  public static updateNodeMasses(nodes: TrussNode[], members: TrussMember[]): void {
    const baseNodeMass = 10.0; // kg baseline per joint pin
    const massMap = new Map<string, number>();

    nodes.forEach((n) => massMap.set(n.id, baseNodeMass));

    members.forEach((m) => {
      if (m.isBroken) return;
      const props = MATERIAL_PROPERTIES[m.material];
      const memberMass = m.restLength * props.density;
      const halfMass = memberMass * 0.5;

      const currentA = massMap.get(m.nodeAId) || baseNodeMass;
      const currentB = massMap.get(m.nodeBId) || baseNodeMass;
      massMap.set(m.nodeAId, currentA + halfMass);
      massMap.set(m.nodeBId, currentB + halfMass);
    });

    nodes.forEach((n) => {
      n.mass = massMap.get(n.id) || baseNodeMass;
    });
  }

  /**
   * Advances the truss simulation by delta time dt (seconds) across N sub-steps.
   * Returns any members snapped during this frame for audio/particle triggers.
   */
  public static stepSimulation(
    nodes: TrussNode[],
    members: TrussMember[],
    dt: number,
    waterLevelY: number,
    onSnap?: (event: SnapEvent) => void
  ): { maxStress: number; snappedMembers: SnapEvent[] } {
    const substeps = SUBSTEPS;
    const dtSub = dt / substeps;
    let frameMaxStress = 0.0;
    const snapped: SnapEvent[] = [];

    // Create fast lookup map for nodes
    const nodeMap = new Map<string, TrussNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    for (let step = 0; step < substeps; step++) {
      // 1. Reset forces & apply gravity + medium drag
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.isAnchor) {
          n.fx = 0.0;
          n.fy = 0.0;
          n.vx = 0.0;
          n.vy = 0.0;
          continue;
        }

        // Gravity: downwards in screen coords (y increases downward or upward? Let's use standard y up = +y, gravity = -9.81 m/s^2)
        // In our coordinate system: y = 0 is water level, positive y is upwards towards sky!
        n.fx = (n.extFx || 0.0);
        n.fy = -n.mass * GRAVITY + (n.extFy || 0.0);

        // Fluid resistance (Air vs Water immersion)
        const dampingCoeff = n.y < waterLevelY ? WATER_DAMPING : AIR_DAMPING;
        n.fx -= dampingCoeff * n.vx;
        n.fy -= dampingCoeff * n.vy;
      }

      // 2. Member internal elasticity and damping
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (m.isBroken) continue;

        const nodeA = nodeMap.get(m.nodeAId);
        const nodeB = nodeMap.get(m.nodeBId);
        if (!nodeA || !nodeB) continue;

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m.currentLength = dist;

        if (dist < 1e-6) continue; // Degenerate zero-length guard

        const ux = dx / dist;
        const uy = dy / dist;
        const deltaL = dist - m.restLength;
        const props = MATERIAL_PROPERTIES[m.material];

        // Relative velocity along member axis
        const dvx = nodeB.vx - nodeA.vx;
        const dvy = nodeB.vy - nodeA.vy;
        const vRel = dvx * ux + dvy * uy;

        let forceMagnitude = 0.0;

        // Cable asymmetry: cables cannot compress! (Slack condition)
        if (!props.canCompress && deltaL <= 0.0) {
          forceMagnitude = 0.0;
        } else {
          // Damped Hooke spring: F = k * deltaL + c * vRel
          forceMagnitude = props.stiffness * deltaL + props.damping * vRel;
          // Ensure cables never push in compression due to negative relative velocity
          if (!props.canCompress) {
            forceMagnitude = Math.max(0.0, forceMagnitude);
          }
        }

        m.force = forceMagnitude;
        const stress = Math.abs(forceMagnitude) / props.breakForce;
        m.stress = stress;
        if (stress > frameMaxStress) {
          frameMaxStress = stress;
        }

        // Check fracture threshold
        if (stress >= 1.0) {
          m.isBroken = true;
          m.brokenTime = Date.now();
          const snapEvt: SnapEvent = {
            memberId: m.id,
            material: m.material,
            stress: stress,
            x: (nodeA.x + nodeB.x) * 0.5,
            y: (nodeA.y + nodeB.y) * 0.5,
          };
          snapped.push(snapEvt);
          onSnap?.(snapEvt);
          continue; // No force transmitted once snapped
        }

        // Apply internal restoring force to nodes (equal & opposite)
        const fx = forceMagnitude * ux;
        const fy = forceMagnitude * uy;

        if (!nodeA.isAnchor) {
          nodeA.fx += fx;
          nodeA.fy += fy;
        }
        if (!nodeB.isAnchor) {
          nodeB.fx -= fx;
          nodeB.fy -= fy;
        }
      }

      // 3. Symplectic Semi-Implicit Euler integration step
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.isAnchor) continue;

        const ax = n.fx / n.mass;
        const ay = n.fy / n.mass;

        // Update velocity first
        n.vx += ax * dtSub;
        n.vy += ay * dtSub;

        // Velocity clamp to prevent numerical explosion during catastrophic collapse
        const maxV = 120.0; // m/s
        const speedSq = n.vx * n.vx + n.vy * n.vy;
        if (speedSq > maxV * maxV) {
          const speed = Math.sqrt(speedSq);
          n.vx = (n.vx / speed) * maxV;
          n.vy = (n.vy / speed) * maxV;
        }

        // Update position using newly computed velocity
        n.x += n.vx * dtSub;
        n.y += n.vy * dtSub;
      }
    }

    return { maxStress: frameMaxStress, snappedMembers: snapped };
  }

  /**
   * Computes total financial cost of the bridge based on material lengths
   */
  public static computeTotalBudget(members: TrussMember[]): number {
    let total = 0.0;
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const props = MATERIAL_PROPERTIES[m.material];
      total += m.restLength * props.costPerMeter;
    }
    return Math.round(total);
  }
}
