# EXP-025: ORBITAL-SLINGSHOT — Engineering & Hardening Journal

## Phase 1: Model Specification & Scientific Contract
- **Objective:** Develop an authentic, interactive astrodynamics laboratory, Keplerian trajectory visualizer, and planetary gravity assist puzzle studio honoring "kademeyi düşür" (human-scale, accessible, playful).
- **Core Formulation:**
  - 2nd-order Symplectic Velocity Verlet integrator conserving phase space and orbital Hamiltonian energy.
  - Vis-Viva equation governing orbital speed at periapsis and apoapsis.
  - Laplace Sphere of Influence (SOI) analytical boundaries: $r_{\text{SOI}} \approx d (m/M)^{2/5}$.
  - Hohmann transfer orbits: semi-major axis, flight time, and tangential velocity increments $\Delta v_1, \Delta v_2$.
  - Planetary gravity assists: planetocentric frame energy invariance, hyperbolic turning angle $\delta = 2 \arcsin(1/e_{\text{hyp}})$, and heliocentric energy transfer $\Delta \varepsilon_\odot = \vec{v}_p \cdot (\vec{v}_{\text{out}} - \vec{v}_{\text{in}})$.
  - Tsiolkovsky $\Delta v$ budgeting and maneuver node impulsive burn execution.
  - Circular Restricted Three-Body Problem (CR3BP) Lagrange L4/L5 triangular equilibrium libration.

## Phase 2: Standalone Engine & Layer 1 Validation
- Developed `src/types/index.ts` and `src/astrodynamics/MissionScenarios.ts` with 5 curated astrodynamics missions.
- Implemented `src/astrodynamics/AstrodynamicsEngine.ts` with 2nd-order Velocity Verlet, Keplerian element extraction, outward radial unit vector $\hat{r}$, and primary-relative ahead-of-time ghost trajectory prediction.
- Built test harness `tests/run-engine-tests.mjs` verifying 24 test cases across 5 test suites:
  - `KEPLER`: Circular orbit stability, specific energy/angular momentum conservation across 5 eccentric orbits, and Vis-Viva periapsis/apoapsis speed matches.
  - `HOHMANN`: Mars transfer ellipse apoapsis match, half-period transfer flight time, and circularization burn.
  - `SLING`: Planetocentric energy conservation, hyperbolic conic classification, trailing flyby energy boost, and leading flyby braking.
  - `SOI`: Laplace sphere radius match and stable Trojan L4 libration.
  - `MANEUVER`: Delta-V burn vector addition, propellant budget deduction, lookahead ghost trajectory prediction, and scenario configurations.
- 24/24 Layer 1 tests passed on initial execution (100% success rate).

## Phase 3: Web Audio, UI & Single-Owner Controller
- Implemented `OrbitalAudioEngine.ts` with 100% procedural Web Audio synthesis: rocket thruster flame roar, celestial SOI entry chime, periapsis Doppler whoosh, collision impact with smooth attack ramp, and victory fanfare with master `DynamicsCompressorNode` limiter.
- Created `OrbitalSimulationController.ts` managing single-owner state, 30-step undo/redo, real wall-clock FPS measurement, and CSV/JSON flight ledger export.
- Crafted UI components: `Header.tsx`, `ControlDeck.tsx`, `OrbitalCanvas.tsx` (High-DPI Retina canvas with celestial body glows, Saturn's rings, orbital trails, and interactive maneuver gizmo), `MissionBriefingModal.tsx`, and `DataExportModal.tsx`.
- Validated with headless Chromium Puppeteer automation (`test-run.cjs`) with 0 console errors.

## Phase 4: Dual Independent Audits & Hardening Remediations
- **Auditors Dispatched:** Technical Auditor and Product Quality Auditor.
- **Product Auditor Verdict:** PASS. Praised deep astrodynamics authenticity, 5 curated missions, real-time lookahead projection cone, tactile audio, and flight ledger export. Recommended radial handle on canvas gizmo and $0.25\times/0.5\times$ slow-motion warp.
- **Technical Auditor Verdict:** Identified lack of adaptive close-approach sub-stepping, normal vs outward radial maneuver vector geometry, ghost trajectory heliocentric vs primary velocity alignment, canvas RAF React re-render churn during probe tracking, synchronous `getBoundingClientRect()` calls, and minor audio click on collision.
- **Remediations Applied:**
  1. Implemented adaptive close-approach sub-stepping in `AstrodynamicsEngine.step`: sub-steps dynamically scale up to 80 when within $1.5 \cdot r_{\text{SOI}}$ of any massive body, preventing tunneling at $500\times$ time warp.
  2. Fixed radial maneuver vector geometry to point strictly outward along relative position $\hat{r} = (\vec{r} - \vec{r}_p) / |\vec{r} - \vec{r}_p|$ in `executeManeuverNode`, `applyManualImpulse`, and `computeProjectedTrajectory`.
  3. Aligned ghost trajectory prediction to apply impulsive burns relative to the primary body at epoch.
  4. Decoupled canvas camera position (`cameraRef.current`) from React state during RAF animation loops, completely eliminating React re-render churn during spacecraft tracking.
  5. Implemented `ResizeObserver` for canvas dimension caching to eliminate per-frame layout recalculations from `getBoundingClientRect()`.
  6. Added 4-handle interactive on-canvas maneuver gizmo supporting tactile dragging for both prograde/retrograde ($\pm\hat{v}$) and radial out/in ($\pm\hat{r}$) impulses.
  7. Added $0.25\times$ and $0.5\times$ slow-motion time warps to `ControlDeck.tsx`.
  8. Smoothed collision audio gain envelope with 5ms linear attack ramp to eliminate DC transients.
  9. Throttled trajectory projection re-computation to every 4 frames or on interaction.
  10. Re-verified Layer 1 test suite (24/24 passed) and re-ran headless Puppeteer E2E (0 console errors).

## Phase 5: Production Build & Deployment
- Production bundle compiled via `npx vite build 025/` (281.7 KB JS, 34.8 KB CSS).
- Deployed production assets to `/var/www/novastrum/wbe/025/` with `index.php` fallback for Caddy.
- Permissions set to `755`, ownership `www-data:www-data`.
- Live HTTPS resolution verified with HTTP/2 200.
