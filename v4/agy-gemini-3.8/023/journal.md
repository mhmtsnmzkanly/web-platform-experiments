# EXP-023: MARBLE-FORGE — Engineering & Hardening Journal

## Phase 1: Model Specification & Scientific Formulation
- **Objective:** Build an authentic, tactile 2D kinetic mechanics and Rube Goldberg contraption studio honoring "kademeyi düşür" (human-scale, accessible, playful).
- **Core Formulation:**
  - Solid spherical rolling with rotational inertia ($I = \frac{2}{5} m r^2$).
  - Effective incline acceleration $a = \frac{5}{7} g \sin\theta$.
  - Continuous rail projection with normal contact separation.
  - Centripetal loop-the-loop normal reaction $N = m(v^2/R - g\cos\theta)$.
  - Rigid-body seesaw torque $\tau = \vec{r} \times \vec{F}$ with inertia $I = \frac{1}{12} M L^2$.
  - Domino cascade kinematics and Archimedes conveyor vertical lift.

## Phase 2: Standalone Engine & Layer 1 Validation
- Developed `src/physics/MarbleMaterials.ts` defining 4 distinct materials (Glass, Steel, Wood, Rubber).
- Implemented `src/physics/MarbleSimulationEngine.ts` with 8 sub-steps per visual frame ($\Delta t \approx 2.08\text{ ms}$) Symplectic Velocity Verlet.
- Built test harness `tests/run-engine-tests.mjs` verifying 13 test cases across 6 suites:
  - `FALL`: Free fall trajectory and horizontal projectile velocity preservation.
  - `ROLL`: Acceleration matching $a = \frac{5}{7} g \sin\theta$ and $v = \omega r$ rolling condition.
  - `LOOP`: Super-critical apex clearance vs sub-critical ballistic detachment.
  - `LEVER`: Gravitational torque rotation and mechanical limit stops.
  - `COLL`: Binary linear momentum conservation and active bumper impulse kick.
  - `LIFT`: Constant motorized vertical transport speed and level integrity.
- 13/13 tests passed on initial execution.

## Phase 3: Web Audio, UI & Single-Owner Controller
- Implemented `MarbleAudioEngine.ts` with 100% procedural synthesis (modal chime bells, bumper kicks, domino clacks) and master `DynamicsCompressorNode` limiter.
- Created `MarbleSimulationController.ts` managing single-owner state, 30-step undo/redo, tool placement, and true wall-clock FPS telemetry.
- Crafted modular UI: `Header.tsx`, `ControlDeck.tsx`, `MarbleCanvas.tsx`, and `DataExportModal.tsx`.
- Validated with headless Chromium Puppeteer script (`test-run.cjs`) across all 5 levels with 0 console errors.

## Phase 4: Dual Independent Audits & Hardening Remediations
- **Auditors Dispatched:** Technical Auditor and Product Quality Auditor.
- **Product Auditor Verdict:** PASS. Noted strong fidelity, 5 challenge levels, and genuine user agency. Recommended point-to-segment deletion, deletion support for all element types, and visual feedback for minimum rail drag.
- **Technical Auditor Verdict:** CONDITIONAL PASS. Identified seesaw sub-step timestep discrepancy, straight rail restitution override, loop exterior tunneling, and audio autoplay warning on initial auto-spawn.
- **Remediations Applied:**
  1. Updated `resolveStraightRail` to distinguish resting contact ($|v_n| \le 0.25\text{ m/s}$) from energetic impact bounce ($v_n' = -e v_n \hat{n}$), restoring full restitution distinction.
  2. Integrated seesaw angular velocity with sub-step `dt` instead of hardcoded $1/60$, and preserved marble longitudinal rolling along the plank axis.
  3. Gated loop-the-loop contact to verify marble is inside the loop track and approaching radially, preventing exterior tunneling.
  4. Added user-interaction unlock listener in `MarbleAudioEngine.ts` to prevent premature AudioContext creation before user gestures.
  5. Implemented orthogonal point-to-segment distance for straight rail deletion and added delete handlers for all element types in `deleteElementAt`.
  6. Added visual minimum length preview feedback (red when $< 0.3\text{m}$, amber when valid).
  7. Re-ran Layer 1 tests (13/13 passing) and browser e2e test (0 console errors).

## Phase 5: Production Build & Deployment
- Rebuilt bundle with `npx vite build 023/`.
- Deployed to `/var/www/novastrum/wbe/023/` with `index.php` fallback for Caddy.
- Permissions set to `755`, ownership `www-data:www-data`.
