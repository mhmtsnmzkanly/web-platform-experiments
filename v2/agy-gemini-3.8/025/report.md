# Experiment 025: CSS Houdini Typed Properties & Conic Radar Reticle

## Overview
Experiment 025 harnesses the CSS Properties and Values API Level 1 (CSS Houdini) to achieve hardware-accelerated, continuous interpolation of custom typed properties. Standard CSS custom properties are untyped tokens that cannot be smoothly interpolated when used in gradients or geometric angles. By defining `@property --radar-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }`, the browser's CSS engine parses the semantic angle type and delegates continuous interpolation directly to the compositor thread.

## Technical Architecture & Mechanism
1. **Declarative Houdini Properties**:
   - Registered custom properties with formal W3C syntax descriptors:
     - `@property --radar-angle`: syntax `<angle>`, default `0deg`, non-inheriting.
     - `@property --beam-color`: syntax `<color>`, default `#10b981`, non-inheriting.
     - `@property --ring-opacity`: syntax `<number>`, default `0.35`, non-inheriting.
2. **Programmatic Registration Complement**:
   - Verified JavaScript API support via `typeof CSS.registerProperty === 'function'`.
   - Programmatically registered `--target-pulse` with `<number>` syntax to validate dual declarative/imperative support.
3. **Conic-Gradient Compositor Interpolation**:
   - The PPI radar beam is rendered with `conic-gradient(from var(--radar-angle), var(--beam-color) 0deg, ... transparent 90deg)`.
   - A CSS keyframe animation modifies `--radar-angle` from `0deg` to `360deg` across a 6.0s linear duration. Because the property is registered as `<angle>`, the browser smoothly interpolates intermediate angles (measured empirically at `196.992deg` during verification capture).
4. **Tactical Airspace Reticle Interface**:
   - The circular Plan Position Indicator (PPI) housing features concentric calibrated range rings, orthogonal graticule crosshairs, and 4-quadrant cardinal bearings (000° N, 090° E, 180° S, 270° W).
   - The primary visual landmark, "Hello World", is locked at the center of the reticle within a glowing target tracking HUD with coordinate telemetry.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` prominently displayed in the center target lockup.
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: CSS Houdini Properties and Values Level 1 typed @property <angle> and <color> interpolation in conic-gradient PPI radar sweep
  - Measurements:
    - `hasRegisterPropertyApi`: `true`
    - `programmaticRegistered`: `true`
    - `computedAngleProperty`: `196.992deg`
    - `computedBeamColor`: `rgb(16, 185, 129)`
    - `scanPeriodSeconds`: `6.0 s`
    - `sweepVelocityDegPerSec`: `60.0 deg/sec`

## Design Signature
- **Typography**: Heavy geometric display sans for the primary "Hello World" monument; monospace typography (`SF Mono`, `Fira Code`, `monospace`) for azimuth telemetry, coordinates, and Houdini registry data.
- **Color**: Airspace radar night-vision palette—void background (`#05080c`), housing dark slate (`#0a1017`), radar phosphor green (`#10b981`), signal cyan (`#06b6d4`), and warning amber (`#f59e0b`).
- **Composition**: Tripartite tactical console flanking a massive central circular PPI radar display with concentric range rings and crosshairs.
- **Material**: Deep tinted circular acrylic CRT filter, glowing phosphor trail, laser graticule divisions, and tactical status seals.
- **Motion**: Continuous 6-second circular radar sweep powered by native CSS `@property` angle interpolation.
