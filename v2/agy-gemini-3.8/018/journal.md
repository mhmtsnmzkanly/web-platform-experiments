# Development Journal — Experiment 018

## 2026-10-04 — Ideation & Candidate Selection
- Inspected `MEMORY.md`: Experiments 001–017 completed and sealed.
- Formulated 3 distinct candidate concepts for 018:
  1. Architectural Blueprint Table with HTML Popover API (`popover="auto"`, `popovertarget`, `:popover-open`, `::backdrop`).
  2. CSS Anchor Positioning API (`anchor-name`, `position-anchor`, `anchor()`).
  3. Pointer Events & Pointer Capture precision vernier scale.
- Selected Candidate 1: HTML Popover API Blueprint Table.
- Unique technical value: Showcases declarative Top Layer promotion with light dismissal and backdrop rendering via pure HTML attributes (`popover="auto"`, `popovertarget`), removing JavaScript modal managers and z-index layers.
- Mechanism Signature: `Declarative button[popovertarget] click -> browser native popover="auto" top layer elevation -> :popover-open activation -> floating blueprint Hello World loupe`.
- Design Signature:
  - Typography: Technical drafting monospace (`ui-monospace`, `"SF Mono"`) and engineering sans on blueprint; high-contrast literary Didone serif inside optical loupe
  - Color: Blueprint drafting navy (`#071326`, `#0b1e3d`), grid cyan (`rgba(56, 189, 248, 0.22)`), drafting amber (`#f59e0b`), pencil white (`#f8fafc`)
  - Composition: Technical blueprint drafting sheet with datum grid lines, elevation title block, and floating optical loupe
  - Material: Heavy blueprint paper and optical acrylic drafting loupe
  - Motion: Instantaneous declarative top-layer elevation

## 2026-10-04 — Implementation & Verification
- Created `018/018.dev.html`.
- Bound `<button id="drafting-trigger" popovertarget="specimen-loupe">` to `<div id="specimen-loupe" popover="auto">`.
- Added CDP click scenario targeting `#drafting-trigger`.
- Implemented `window.labInteractionEvidence` hook verifying `matches(':popover-open')`.
- Ran verification: `node tools.js verify 018/018.dev.html 018` -> Result: `OK`.
- Inspected visual evidence:
  - `screenshot.png`: Technical blueprint elevation drawing with clear "HELLO WORLD" heading.
  - `screenshot-interaction.png`: Loupe popover promoted to Top Layer with amber neon frame and backdrop blur, spotlighting the magnified "Hello World" serif typography.
  - No overflow or scrollbars.
- Authored `018/report.md`.
- Next step: Seal Experiment 018 and update `MEMORY.md`.
