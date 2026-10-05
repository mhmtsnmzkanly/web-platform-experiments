# Development Journal — Experiment 004

## 2026-10-04 — Ideation & Candidate Selection
- Inspected `MEMORY.md`: 001 (Semantic HTML), 002 (CSS Subgrid), 003 (Writing Modes) sealed.
- Prior experiments explored orthogonal rectilinear axes (horizontal and vertical).
- Formulated 3 distinct candidates for 004:
  1. SVG `<textPath>` serpentine cubic Bézier river curve across topographical elevation lines.
  2. Concentric SVG circular orbits with radial baseline rotation.
  3. SVG `<clipPath>` diagonal slice ribbons.
- Selected Candidate 1: SVG `<textPath>` on a continuous cubic Bézier curve (`M ... C ... S ...`).
- Mechanism Signature: `Bézier path coordinate geometry -> SVG textPath parameterization -> curvilinear baseline deformation -> undulating Hello World vector field`.
- Design Signature:
  - Typography: Refined cartographic serif (`"Georgia"`, serif)
  - Color: Alpine forest ground (`#0d1d16`), celadon mist (`#e7f0e9`), brass gold contour (`#d4af37`), moss green (`#2d5a44`)
  - Composition: Flowing diagonal S-curve with harmonic topographical contour echoes
  - Material: Engraved archival map sheet
  - Motion: Static

## 2026-10-04 — Implementation & Verification
- Authored `004/004.dev.html`.
- Defined cubic Bézier path `#river-contour` with 246px vertical deflection.
- Bound `<textPath href="#river-contour">Hello World</textPath>`.
- Added parallel contour echo lines and survey elevation annotations.
- Verified: `node tools.js verify 004/004.dev.html 004` returned `OK` with exit code 0.
- Inspected `screenshot.png`: confirmed flowing celadon serif text along the gold spline over dark spruce ground.
- Authored `004/report.md`.
- Ready to seal experiment 004.

