# Experiment 033: Intersection Observer Level 2 Focal Scanner

## Overview
Experiment 033 explores the W3C Intersection Observer API Level 2 specification, providing asynchronous observation of changes in the intersection of a target element with an ancestor root element across discrete threshold steps. The experiment models an astronomical optical collimator and telemetry station, measuring real-time geometric intersection ratios, bounding rectangles, and focal alignment of a monumental "Hello World" subject through both static evaluation and automated CDP scroll interaction.

## Technical Architecture & Mechanism
1. **Explicit Root & Multi-Threshold Geometry**:
   - The observer configures an explicit scrollable container (`#collimator-track`) as the intersection root:
     ```javascript
     const observer = new IntersectionObserver(callback, {
       root: track,
       rootMargin: '0px',
       threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
     });
     ```
   - By declaring an 11-step threshold lattice from 0.0 to 1.0 at 0.1 increments, the browser emits `IntersectionObserverEntry` records whenever the target element's visible area fraction crosses any 10% interval.
2. **Spatial Coordinate Telemetry**:
   - Each entry delivers precise geometric structures:
     - `intersectionRatio`: Exact visible fraction ($0.0 \dots 1.0$).
     - `boundingClientRect`: Unclipped size and position of `#subject-hello-world` ($462 \times 70\text{px}$).
     - `intersectionRect`: Clipped intersection area with the collimator root.
     - `rootBounds`: Root viewport bounds ($668 \times 598\text{px}$).
     - `isIntersecting`: Boolean target visibility flag.
3. **Automated Interaction Testing via CDP**:
   - The experiment exposes `window.labScenario = { kind: 'scroll', selector: '#collimator-track', deltaY: 160 }`.
   - The test harness dispatches a synthetic `mouseWheel` event. An explicit wheel listener converts mouse wheel impulses into container `scrollTop` translation, triggering layout re-evaluation and delivering subsequent threshold crossing entries verified via `window.labInteractionEvidence()`.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Static baseline verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: W3C Intersection Observer Level 2 multi-threshold focal telemetry scanner
  - Measurements:
    - `intersectionRatio`: 1.0
    - `isIntersecting`: `true`
    - `thresholdSteps`: 11
    - `observedRoot`: `"#collimator-track"`
- Dynamic interaction verification via `window.labInteractionEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: CDP mouseWheel scroll deflection measured via IntersectionObserver Level 2 threshold crossings
  - Measurements:
    - `entriesReceived`: 2
    - `currentRatio`: 0.74
    - `initialRatio`: 1.0
    - `scrollTop`: 160

## Design Signature
- **Typography**: Monumental bold grotesque sans-serif (`-apple-system`, `Segoe UI`, `sans-serif`) for the central "HELLO WORLD" monument; technical monospaced typography (`SF Mono`, `Consolas`, monospace) for coordinate readouts, threshold labels, and log timestamps.
- **Color**: Deep space observatory palette—midnight obsidian (`#07090e`, `#0f141f`), optical cyan (`#38bdf8`), collimator emerald (`#10b981`), and graticule slate (`#28354f`).
- **Composition**: Dual-chamber console featuring the optical collimator track and focal reticle on the left, flanked by the 3-panel telemetry deck on the right.
- **Material**: Matte slate chassis, illuminated centerlines, bounding corner reticles, and 11-cell threshold status dot lattice.
- **Motion**: Interactive scroll-driven focal deflection and real-time threshold transition telemetry.
