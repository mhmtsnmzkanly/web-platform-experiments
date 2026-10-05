# Experiment 030: CSS Compositing & Blending Level 1 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore styling, rendering, and compositing mechanics, three candidate ideas were formulated:
- **Candidate A**: CSS Compositing and Blending Level 1 (`mix-blend-mode`, `background-blend-mode`, `isolation: isolate`) with CMYK/RGB chromatic plate separation and optical color cancellation.
- **Candidate B**: DOM MutationObserver Level 2 (`MutationObserver`, `observe`, `characterDataWithOldValue`, `childList`) reactive mutation telemetry engine.
- **Candidate C**: CSS Cascade Layers Level 1 (`@layer`) specificity inversion matrix.

**Selection**: Candidate A was selected. It introduces the browser's native compositing pipeline, executing transfer equations directly in Skia/Blink hardware layers. It breaks away from dark cybernetic dashboards into a clean, crisp, high-contrast archival prepress proof folio.

### 2. Implementation & The Stacking Context Mechanics
During initial prototyping:
- The compositing chamber was established with `isolation: isolate` to form an independent blending group. Without this isolation, `mix-blend-mode: difference` on the heading would blend directly through to the `#f2f1ec` background of the folio body, producing muddy grey-brown artifacts rather than crisp white and black inversions.
- The hero typographic lockup was styled with `mix-blend-mode: difference` over a razor-sharp vertical split between `#0c0e12` (carbon negative) and `#ffffff` (titanium positive).
- Ghost registration plates in Cyan and Magenta were positioned with small offsets and `mix-blend-mode: screen` to model optical lithographic misregistration.

### 3. Visual Review & Line-Wrap Correction
Upon initial automated execution and review of `screenshot.png`:
- The verification test passed (`OK`), but visual review identified that `.plate-magenta` had soft-wrapped the word "WORLD" onto a second line due to inline element container bounding constraints.
- `white-space: nowrap;` was added to `.hero-title-container`, `.hero-master-subject`, and all `.plate-*` elements to lock all chromatic layers to a single horizontal typographic line.
- Re-running verification and viewing the screenshot confirmed perfect registration alignment and razor-sharp typographic inversion across the meridian line.

### 4. Verification & Sealing
`./verify.sh 030/030.dev.html 030` passed cleanly with exit code 0 (`OK`), confirming:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- `window.labEvidence` confirmed `isolation: isolate`, `mix-blend-mode: difference`, and all blend mode transfer equations.
- The experiment was sealed to `030/030.html`.
