# Experiment 028: Canvas 2D Path2D Vector Geometry & Bézier Drafting Folio

## Overview
Experiment 028 explores advanced vector path construction and geometric hit testing on the HTML5 Canvas 2D rendering context using the `Path2D` interface (Canvas 2D Context Level 2). Rather than relying on immediate-mode context path methods (`ctx.beginPath`, `ctx.lineTo`), `Path2D` treats vector paths as first-class, reusable, and composable objects. It supports SVG path syntax parsing (`new Path2D("M ...")`), hierarchical path composition (`path.addPath()`), and point-in-path boundary testing (`ctx.isPointInPath()`).

## Technical Architecture & Mechanism
1. **First-Class Vector Object Architecture**:
   - `cartoucheOuter`: An outer rounded rectangle cartouche with corner fillets created via `cartoucheOuter.roundRect(30, 24, w - 60, h - 48, 14)`.
   - `cartoucheInner`: A concentric inner hairline border with a `[4, 4]` dash pattern.
   - `bezierFiligree`: A compound cubic Bézier path containing corner filigree spirals (`bezierCurveTo`) and center harmonic baseline oscillations.
   - `rosettePath`: An ornamental vector rosette constructed directly from an SVG path data string (`new Path2D("M 0 -24 C 12 -12 12 12 0 24...")`).
2. **Path Aggregation & Rendering**:
   - Individual subpaths are composed into a unified vector structure via `masterPath.addPath()`.
   - The canvas context strokes the vector paths with multi-stop linear gradients (`#f59e0b` to `#06b6d4`), amber drop-shadow glow filters (`ctx.shadowBlur = 10`), and subpixel antialiasing.
3. **Mathematical Point-In-Path Hit Testing**:
   - The browser's native nonzero winding rule algorithm is queried via `ctx.isPointInPath(cartoucheOuter, x, y)`:
     - Center datum $(335, 220)$: verified as interior (`true`).
     - Exterior perimeter point $(10, 10)$: verified as exterior (`false`).
4. **Drafting Folio Aesthetic**:
   - The layout presents an architectural drafting folio with coordinate graticule lines, datum crosshairs, and letterpress typography featuring the primary "Hello World" monument.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in both DOM hero banner and canvas rasterization (`tag: h1`, canvas text).
- 43 canvas draw calls executed cleanly.
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: HTML5 Canvas 2D Path2D vector geometry construction, SVG d-string parsing, Bézier curves, and isPointInPath hit testing
  - Measurements:
    - Canvas Dimensions: `670x440`
    - Hit-Test Center: `true` (interior)
    - Hit-Test Corner: `false` (exterior)
    - Cached Path Types: `["cartoucheOuter", "cartoucheInner", "bezierFiligree", "rosettePath", "masterPath"]`
    - Hit-Test Algorithm: `isPointInPath(winding-rule: nonzero)`

## Design Signature
- **Typography**: Classical transitional display serif (`Playfair Display`, `Baskerville`, `serif`) for the monumental "Hello World" title; engineering monospace for coordinates, SVG path definitions, and vernier telemetry.
- **Color**: Master copperplate engraver palette—drafting slate (`#0b0f14`, `#111722`), burnished gold (`#f59e0b`), warm copper (`#f97316`), and blueprint cyan (`#06b6d4`).
- **Composition**: Tripartite drafting triptych flanking a central 670x440 vector engraving folio with outer and inner cartouches.
- **Material**: Heavy vellum parchment texture, laser graticule lines, and engraved metallic hairline strokes.
- **Motion**: Static architectural folio snapshot.
