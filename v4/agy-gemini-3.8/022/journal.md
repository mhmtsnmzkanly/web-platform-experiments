# EXP-022: POWDER-BOX — Engineering & Development Journal

## 1. Project Inception & Philosophy
- **Directive:** "Kademeyi düşür. İlk promptta ne istemiştik? Hani neden matematik kimya fizik üstüne daha sıradan fikirlerin yok mu? Aynen şu saydığın son 5 maddeyi yap."
- **Goal:** Shift from hyper-specialized graduate physics engines to human-scale, playful, tactile simulators. Maintain mathematical and algorithmic rigor while optimizing for tactile delight, instant interactivity, and intuitive understanding.
- **Scope:** 16 physical materials across 4 states of matter on a $240 \times 150$ cellular automata grid with buoyancy sorting, heat diffusion, phase transitions, and chemical reactions.

## 2. Iteration Chronology

### Stage 1: Scientific Contract & Invariants
- Authored `SCIENTIFIC_CONTRACT.md` detailing the discrete transport rules, Von Neumann stability constraints for 2D thermal conduction, phase change curves, and density hierarchies.
- Documented `VALIDATION_PLAN.md` with explicit a priori tolerances and conservation bounds.

### Stage 2: Engine Implementation & Standalone Tests
- Created typed-array engine `PowderSimulationEngine.ts` with bottom-up granular sweeps and top-down buoyant gas sweeps.
- Developed 6 comprehensive Layer 1 test suites in `022/tests/run-engine-tests.mjs`.
- **Finding & Fix:** Sweep order mattering for reaction triggering. Running reaction sweeps prior to spatial movement prevents diagonal particles from escaping contact before reacting.
- Result: **32 / 32 Layer 1 tests passed on first complete run (100%)**.

### Stage 3: Audio & Interaction Pipeline
- Engineered `PowderAudioEngine.ts` with 100% procedural synthesis and studio-grade `DynamicsCompressorNode` limiter.
- Created `PowderSimulationController.ts` managing single-owner state, brush radius stamping, throttling React UI updates to every 4 frames, and generating telemetry snapshots in JSON and CSV.

### Stage 4: User Interface & Browser E2E Testing
- Created `SandboxCanvas.tsx` with direct packed-ABGR `ImageData` writes and high-DPI vector overlay for circular brush indicators.
- Created `SandboxPalette.tsx`, `Header.tsx`, and `DataExportModal.tsx`.
- Ran headless Chromium automation (`test-run.cjs`) verifying 6 presets, painting strokes, thermal view toggles, and data export. Zero console errors.

### Stage 5: Independent Audits & Hardening Remediations
- Dual audits dispatched to neutral subagents (Technical Auditor and Product Quality Auditor).
- Remediations applied:
  1. Wrapped canvas in `aspect-[240/150]` container and bound `ResizeObserver` to the simulation canvas element to eliminate letterboxing offset during mouse painting.
  2. Enhanced active particle counter in `Header.tsx` to remain visible across all viewports with explicit `data-testid` and `title`.
  3. Added comprehensive hover tooltips to all palette material buttons displaying name, density ($\text{kg/m}^3$), and state.
  4. Added audio whoosh feedback to `clearSandbox()` and added clean `clear()` alias.
- Re-tested with 100% pass across all 32 numerical tests and browser automation suite.

## 3. Deployment & Status
- Deployed to `/var/www/novastrum/wbe/022/` (`www-data:www-data`, mode `755`).
- Status: **COMPLETE & CERTIFIED**.
