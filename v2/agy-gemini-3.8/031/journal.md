# Experiment 031: DOM MutationObserver Level 2 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore DOM reactivity, microtask batching, and browser observation interfaces, three candidate ideas were formulated:
- **Candidate A**: DOM MutationObserver Level 2 (`MutationObserver`, `observe`, `characterDataOldValue`, `attributeOldValue`, `childList`) reactive mutation tracking with live audit ledger.
- **Candidate B**: Intersection Observer API Level 2 (`IntersectionObserver`, multi-thresholds, `rootMargin`, `intersectionRatio`) optical focal aperture.
- **Candidate C**: CSS Cascade Layers Level 1 (`@layer`) specificity inversion matrix.

**Selection**: Candidate A was selected. It exercises the native browser DOM MutationObserver microtask engine, tracking structural, textual, and attribute changes across a DOM subtree with zero monkey-patching or polling.

### 2. Implementation & The Animation Stall Gotcha
During initial implementation:
- An instrumented proscenium containing the monumental "Hello World" heading and state badges was wired up to a `MutationObserver` instance configured with `{ subtree: true, childList: true, attributes: true, characterData: true, attributeOldValue: true, characterDataOldValue: true }`.
- When tested via `./verify.sh 031/031.dev.html 031`, the test runner failed with `[ANIMATION_STALL] Animation time did not advance`.
- Code inspection revealed that CSS transitions (`transition: all 0.3s ease;` and `transition: border-color 0.2s;`) were defined on `.subject-cage` and `.mutation-row`. When the DOM mutations altered element classes and attributes, browser CSS transitions were instantiated as `CSSTransition` objects in `document.getAnimations()`. When the test harness inspected running animations across two snapshot points, the completed transition had stopped advancing its timeline, triggering the watchdog rule.
- In addition, the asynchronous mutation sequence completed after page load without signaling completion to the test harness.

### 3. Resolution & Synchronization
Two precise fixes resolved the issue:
1. Removed all CSS transitions from `.subject-cage` and `.mutation-row`, keeping visual style changes discrete and eliminating rogue `CSSTransition` objects.
2. Exposed `window.labReady = sequencePromise;` so `tools.js checkSession` awaited the resolution of the full 4-batch procedural mutation sequence before performing the initial DOM inspection.

### 4. Verification & Sealing
Re-running verification with `./verify.sh 031/031.dev.html 031` succeeded with exit code 0 (`OK`).
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- `window.labEvidence` confirmed 7 records across 4 microtask batches spanning attributes, childList, and characterData.
- The experiment was sealed to `031/031.html`.
