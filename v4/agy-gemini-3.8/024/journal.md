# EXP-024: POCKET-TERRARIUM — Engineering & Hardening Journal

## Phase 1: Model Specification & Scientific Contract
- **Objective:** Develop an authentic, tactile aquatic ecosystem simulator, closed-loop vivarium, and micro-ecology studio honoring "kademeyi düşür" (human-scale, accessible, playful).
- **Core Formulation:**
  - 3-stage biological Nitrogen Cycle ($\text{NH}_3 \to \text{NO}_2^- \to \text{NO}_3^-$) using Monod microbial kinetics.
  - Diurnal lighting curve $I(t)$ driving photosynthesis $P(I)$ vs multi-trophic aerobic respiration.
  - Henry's Law atmospheric surface reaeration and aerator bubbler gas exchange.
  - Dynamic carbonate buffer pH shifts driven by carbon dioxide dissolved equilibrium.
  - Holling Type II multi-trophic predation (algae $\to$ Daphnia $\to$ Guppies) with handling time cooldown.
  - Vegetative plant growth, oxygen pearling, and Reynolds Boids schooling/foraging kinematics.

## Phase 2: Standalone Engine & Layer 1 Validation
- Developed `src/types/index.ts` and `src/ecology/ScenarioDefinitions.ts` with 5 curated ecological scenarios.
- Implemented `src/ecology/TerrariumSimulationEngine.ts` with continuous biogeochemistry ODE integration and discrete entity kinematics.
- Built test harness `tests/run-engine-tests.mjs` verifying 17 test cases across 5 test suites:
  - `NITRO`: Monod oxidation rates, intermediate nitrite peak, plant nitrate assimilation, and closed nitrogen mass balance.
  - `OXY`: Diurnal DO swing, Henry's Law atmospheric saturation convergence, and bubbler acceleration.
  - `PH`: Photosynthetic alkaline shift and nocturnal acidic respiratory shift.
  - `PRED`: Holling Type II grazing, food flake nourishment, and mortality queues under severe anoxia.
  - `STATE`: Water dilution conservation ($50\%$ water change drops toxins by exactly $50.000\%$) and scenario validity.
- 17/17 Layer 1 tests passed on initial execution.

## Phase 3: Web Audio, UI & Single-Owner Controller
- Implemented `TerrariumAudioEngine.ts` with 100% procedural synthesis (air stone bubbling gurgles, oxygen pearling chimes, feeding water plops, water change cascade swoosh, and toxicity alert chime) and master `DynamicsCompressorNode` limiter.
- Created `TerrariumSimulationController.ts` managing single-owner state, 30-step undo/redo, tool actions (feeding, planting, stocking, netting, scrubbing, dosing), and true wall-clock FPS telemetry.
- Crafted UI components: `Header.tsx`, `ControlDeck.tsx`, `TerrariumCanvas.tsx` (High-DPI Retina canvas with volumetric light caustics and green water turbidity), `WaterTestKitModal.tsx` (5-tube colorimetric reagent assay kit), and `DataExportModal.tsx`.
- Validated with headless Chromium Puppeteer script (`test-run.cjs`) across all 5 scenarios with 0 console errors.

## Phase 4: Dual Independent Audits & Hardening Remediations
- **Auditors Dispatched:** Technical Auditor and Product Quality Auditor.
- **Product Auditor Verdict:** PASS. Praised deep biochemical integration, 5 curated scenarios, 9 trophic tools, 5-tube test kit modal, tactile observables (pearling, gasping), and zero audio clipping.
- **Technical Auditor Verdict:** Identified React StrictMode remount event listener disconnection, Forward Euler vs claimed RK4 integrator, Holling Type II predation handling time gap, per-frame canvas gradient GC churn, and modal timeout cleanup.
- **Remediations Applied:**
  1. Implemented authentic 4th-Order Runge-Kutta (RK4) ODE stepper solving continuous water chemistry rates with the standard 4-stage Butcher tableau.
  2. Implemented Holling Type II predation with handling time cooldown on guppy hunting behavior.
  3. Re-attached event listeners on mount in `App.tsx` and removed controller disposal during transient React StrictMode remounts.
  4. Added `removeUnlockListeners` to `TerrariumAudioEngine.dispose()` to eliminate potential window listener leaks.
  5. Optimized `TerrariumCanvas.tsx` to use single-pass caustics gradient, removed inner context save/restore loops in plant rendering, and eliminated per-entity gradient allocations for snails and fish.
  6. Added unmount cleanup for the test kit animation timeout in `WaterTestKitModal.tsx`.
  7. Scaled fish excretion and food decomposition inversely by vivarium volume.
  8. Re-verified Layer 1 tests (17/17 passed, 100%) and re-ran headless Puppeteer E2E (0 console errors).

## Phase 5: Production Build & Deployment
- Rebuilt bundle with `npx vite build 024/`.
- Deployed production assets to `/var/www/novastrum/wbe/024/` with `index.php` fallback for Caddy.
- Permissions set to `755`, ownership `www-data:www-data`.
- Live HTTPS resolution verified with HTTP/2 200.
