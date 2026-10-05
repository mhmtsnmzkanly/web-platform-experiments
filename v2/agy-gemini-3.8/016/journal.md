# Development Journal — Experiment 016

## 2026-10-04 — Ideation & Candidate Selection
- Inspected `MEMORY.md`: Experiments 001–015 completed and sealed.
- Formulated 3 distinct candidate concepts for 016:
  1. Architectural Amphora Negative-Space Calligram with CSS Shapes Level 1 (`shape-outside: polygon(...)`, `shape-margin`, opposing floats).
  2. CSS Scroll-driven animations (`animation-timeline: scroll()`).
  3. Web Crypto API SHA-256 digest visual cipher.
- Selected Candidate 1: CSS Shapes Level 1 Polygon Exclusion Calligram.
- Unique technical value: Leverages browser's line-box shape exclusion engine (`shape-outside: polygon(...)`), forcing dynamic recalculation of margin vectors along non-rectangular faceted polygon contours.
- Mechanism Signature: `Dual floating polygon shapes -> shape-outside line-box exclusion -> contour-hugging typography -> negative-space Hello World amphora`.
- Design Signature:
  - Typography: Refined editorial serif (`"Didot"`, `"Bodoni MT"`, `"Baskerville"`, serif) with justified micro-typography; monospaced telemetry
  - Color: Fine-art cream rag paper (`#f6f3eb`, `#fbf9f5`), basalt charcoal (`#181615`, `#242220`), terracotta ochre (`#c05634`), sand dividers (`#ded8cb`)
  - Composition: Symmetrical architectural amphitheatre with dual faceted polygonal wings, dynamic hourglass text wrapping, and centered monumental heading
  - Material: Heavy fine-art cotton rag paper and dark stone monoliths
  - Motion: Static specimen display

## 2026-10-04 — Implementation & Verification
- Created `016/016.dev.html`.
- Implemented left and right opposing floats with 7-vertex `shape-outside: polygon(...)` and `shape-margin: 16px`.
- Flowed editorial text around the shapes, framing the central `<h1 class="monument-title">Hello World</h1>`.
- Added `window.labEvidence` hook reporting shape-outside computed properties, floats, and headline visibility.
- Ran verification: `node tools.js verify 016/016.dev.html 016` -> Result: `OK`.
- Inspected `016/screenshot.png`:
  - Pristine editorial layout.
  - Text smoothly wraps around the polygonal contours, creating the negative-space amphora vase.
  - "HELLO WORLD" is prominently framed and legible.
  - No overflow or scrollbars.
- Authored `016/report.md`.
- Next step: Seal Experiment 016 and update `MEMORY.md`.
