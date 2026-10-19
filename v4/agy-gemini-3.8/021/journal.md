# Engineering Journal: Experiment 021 (PONTIFEX)

## 2026-10-19 — 2D Truss Mechanics, Elastic Statics & Bridge Builder Game

### 1. Motivation & Conceptual Vision
Following the completion of theoretical physics experiments 006–020, user guidance specified a return to human-scale, tactile, highly engaging browser games and interactive engineering laboratories ("kademeyi düşür").

Bridge construction games (in the tradition of Pontifex and Bridge Builder) represent the ideal intersection of rigorous structural mechanics (elastic Hookean lattices, lumped-mass dynamics, Euler integration) and intuitive, satisfying gameplay (budget balancing, stress visualization, collapse dynamics, vehicle crossing).

### 2. Architecture & Computational Mechanics
1. **Truss Formulation:**
   - 2D pin-jointed truss represented as an undirected graph $(V, E)$.
   - Each node $i$ holds lumped mass $m_i = m_{\text{joint}} + 0.5 \sum_{j} L_{0, ij} \rho_{ij}$, position $\mathbf{x}_i$, velocity $\mathbf{v}_i$, and force $\mathbf{f}_i$.
   - Each elastic member $e = (i, j)$ obeys damped Hookean elasticity:
     $$\mathbf{F}_{ij} = \left( k (L - L_0) + c v_{\text{rel}} \right) \hat{\mathbf{u}}_{ij}$$
   - Suspension cables enforce a strict unilateral constraint:
     $$F = \max(0, k (L - L_0) + c v_{\text{rel}}) \quad \text{for } L > L_0, \quad 0 \text{ otherwise}$$
2. **Symplectic Integration:**
   - Semi-implicit Euler integration using 16 sub-steps per frame ($\Delta t_{\text{sub}} \approx 1\text{ ms}$). This avoids artificial numerical damping while keeping stiff steel springs ($k = 180,000\text{ N/m}$) stable.
3. **Vehicle Interaction:**
   - Multi-wheeled kinematic bodies with spring-damper tire normal reaction, chassis moment of inertia, and engine drive traction.
   - Wheel reactions are distributed via barycentric interpolation $(1-t, t)$ onto the road deck nodes and integrated directly into the structural equations of motion.

### 3. Audio & Interaction Design
- 100% procedural Web Audio API with zero external audio assets.
- Master dynamics limiter (`DynamicsCompressorNode`) prevents clipping during simultaneous snaps, creaks, and splashes.
- Clean CAD deck with rubber-band previews, real-time cost estimation, grid snapping, and 30-state undo/redo history.

### 4. Independent Auditing & Remediation
Two neutral subagents performed technical and product audits. Key remediations included:
- Synchronizing vehicle load transfer so wheel reactions are never wiped during sub-step force resets.
- Decoupling left and right cliff elevations in vehicle contact equations for Level 5's canyon drop.
- Enabling joint dragging in the `SELECT` tool and beam proximity deletion in the `DELETE` tool.
- Fixing Web Audio node lifecycle with `onended` disconnection handlers.
- Stabilizing canvas rendering by storing pointer coordinates in refs rather than triggering React state updates.

### 5. Deployment & Production Verification
- Built cleanly with Vite into `021/dist/`.
- Deployed to `/var/www/novastrum/wbe/021/`.
- Automated headless browser tests verified 0 console errors and generated `021/verification.json`.
