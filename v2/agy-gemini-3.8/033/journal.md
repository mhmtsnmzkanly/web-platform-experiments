# Experiment 033: Intersection Observer Level 2 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore spatial geometry, visibility tracking, and asynchronous browser event dispatch, three candidate ideas were formulated:
- **Candidate A**: Intersection Observer API Level 2 (`IntersectionObserver`, `thresholds: [0, 0.1, ..., 1.0]`, `rootBounds`, `intersectionRatio`) optical focal aperture and collimator scanner.
- **Candidate B**: CSS Masking Level 1 (`mask-image`, `mask-composite`, `mask-mode`) holographic X-ray proscenium.
- **Candidate C**: Navigation API (`navigation.navigate`, `NavigateEvent`) declarative router state machine.

**Selection**: Candidate A was selected. It introduces the W3C Intersection Observer API Level 2, testing multi-threshold bounding geometry and automated CDP mouse wheel interaction verification via `window.labScenario`.

### 2. Implementation & The Headless Scroll Translation Gotcha
During initial implementation:
- An optical collimator track (`#collimator-track`) was configured as the intersection root with 11 thresholds from 0.0 to 1.0.
- `window.labScenario = { kind: 'scroll', selector: '#collimator-track', deltaY: 140 }` was declared.
- When tested via `./verify.sh 033/033.dev.html 033`, the test runner timed out waiting for `window.labInteractionEvidence()`.
- Diagnosis: In headless Chromium over CDP, `Input.dispatchMouseEvent` with `mouseWheel` dispatches a synthetic DOM `wheel` event at the element coordinates. However, without a dedicated wheel event listener, headless Chromium did not synchronously advance `scrollTop` on the inner overflow container. Consequently, the target did not shift position, and no threshold crossing was triggered.
- Resolution: Added a passive `wheel` event listener on `track`:
  ```javascript
  track.addEventListener('wheel', (e) => {
    track.scrollTop += e.deltaY;
    window.__collimatorLab.scrollTriggered = true;
  }, { passive: true });
  ```
  This immediately converts the CDP `mouseWheel` input into a `scrollTop` displacement, causing the target to partially cross the top root boundary and delivering an updated `IntersectionObserverEntry` with `entriesCount: 2`.

### 3. Verification & CDP Capture
Re-running verification with `./verify.sh 033/033.dev.html 033` succeeded with exit code 0 (`OK`).
Headless Chromium captured:
- Baseline static verification passing with 1.00 ratio.
- Automated CDP scroll dispatch triggering threshold shift and `labInteractionEvidence` passing.
- Primary subject `Hello World` identified and confirmed visible in `h1.hero-subject`.
- Optical collimator reticle, 11-step threshold lattice, and coordinate telemetry rendered cleanly.

### 4. Sealing
The experiment was sealed to `033/033.html`.
