# Experiment 004: SVG Vector Geometry & Curvilinear Path Projection

## Title
SVG Vector Geometry & Curvilinear Path Projection

## Goal
Explore the SVG 2.0 vector specification by projecting typographic letterforms along an arbitrary mathematical cubic Bézier curve via `<textPath>`, altering glyph baselines from rectilinear tracks into continuous curvilinear trajectories.

## Selected Idea
Topographical Cartographic Engraving plate. A cubic Bézier curve (`M 90 390 C 270 390 340 100 560 140 S 840 450 1020 190`) acts as an elevation contour line along which "Hello World" flows tangentially, flanked by harmonic contour echoes and survey marks.

## Technology
- SVG 2.0 (`<svg>`, `<path>`, `<text>`, `<textPath>`, `<defs>`, `<use>`)
- Vector Cubic Bézier geometry
- SVG DOM inspection APIs (`getTotalLength()`, `getNumberOfChars()`, `getBBox()`, `getStartPositionOfChar()`)
- Semantic HTML5

## Mechanism Signature
`Bézier path coordinate geometry -> SVG textPath parameterization -> curvilinear baseline deformation -> undulating Hello World vector field`

## Design Signature
- Typography: Flowing transitional display serif (`"Georgia"`, `"Palatino"`, serif) with high contrast and subtle drop-shadow
- Color: Alpine cartographic palette: deep spruce black (`#0b1c14`), pale celadon mist (`#e2f0e6`), oxidized gold contour (`#cca43b`), forest pine (`#224734`)
- Composition: Flowing diagonal S-curve with harmonic parallel contour echoes
- Material: Archival engraved topographical survey plate
- Motion: Static

## Implementation Summary
The SVG `<defs>` block defines the primary guide path `#river-contour` using cubic Bézier spline syntax. `<text><textPath href="#river-contour" startOffset="5%">Hello World</textPath></text>` binds the glyphs to this parametric vector spline. Supporting `<use>` elements render parallel contour intervals above and below the main baseline. Survey points (`<circle>`) and altitude annotations establish authentic cartographic grounding.

## Architectural Decisions
- Used genuine vector Bézier parameterization via native `<textPath>` rather than rotated CSS inline-blocks. This allows true tangential orientation for each individual character glyph.
- Configured SVG coordinates within a deterministic `viewBox="0 0 1100 520"`, preserving responsive scaling across display sizes without clipping letterforms.
- Integrated `window.labEvidence()` which queries native SVG DOM methods to mathematically assert path length (1103px) and vertical deflection (246px) between initial and terminal glyphs.

## Verification Evidence
- Automated verification command: `node tools.js verify 004/004.dev.html 004` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Browser test: valid doctype, zero console errors, zero runtime exceptions, valid CSS/SVG.
- Runtime evidence: `pathLength: 1103`, `characterCount: 11`, `bbox: { width: 556, height: 370 }`, `verticalDeflection: 246px`.

## Visual Evidence & Review
- Screenshot captured: `004/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello World" is the unmistakable primary subject, flowing gracefully across the topographical spline.
  - Tangential glyph rotation along the curve is smooth, crisp, and fully legible.
  - Colors are rich, atmospheric, and distinctly different from Experiments 001–003.

## Limitations
- Static vector geometry; does not explore dynamic runtime rasterization or pixel manipulation. Canvas pixel sampling will be explored in Experiment 005.
