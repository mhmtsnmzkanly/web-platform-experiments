# Experiment 035: Canvas 2D TextMetrics Typographic Metrology Folio

## Overview
Experiment 035 explores the W3C HTML Canvas 2D Context Level 2 specification, specifically the extended `TextMetrics` interface provided by `ctx.measureText()`. Rather than treating rendered text as an unmeasured raster block, Level 2 `TextMetrics` provides granular subpixel geometric introspection into font shaping, glyph bounding envelopes, baseline offsets, ascenders, descenders, and advance widths. The experiment designs an archival master typefoundry drafting folio with high-precision technical dimension calipers and analytical guidelines overlaid on the monumental "Hello World" subject.

## Technical Architecture & Mechanism
1. **Subpixel Font Shading & Shaping Introspection**:
   - The Canvas 2D context executes `ctx.measureText('HELLO WORLD')` against `900 80px system-ui, -apple-system, sans-serif`.
   - The HarfBuzz/Blink shaping engine returns an extended `TextMetrics` object containing 10 distinct architectural dimensions:
     - `width`: Total advance width ($586.80\text{px}$).
     - `actualBoundingBoxLeft` & `actualBoundingBoxRight`: Exact glyph horizontal extents ($-6.00\text{px}$ to $583.08\text{px}$).
     - `actualBoundingBoxAscent`: Cap-height distance from alphabetic baseline to letterform summits ($+58.00\text{px}$).
     - `actualBoundingBoxDescent`: Bottom glyph edge descent below baseline ($-1.00\text{px}$).
     - `fontBoundingBoxAscent` & `fontBoundingBoxDescent`: Total font design em-box ascender and descender boundaries ($+86.00\text{px}$, $-23.00\text{px}$).
     - `emHeightAscent` & `emHeightDescent`: Nominal em square metrics ($+60.00\text{px}$, $-16.00\text{px}$).
2. **Mathematical Caliper Rendering**:
   - The canvas draws the 5 critical typographical guidelines with subpixel precision:
     - Alphabetic Baseline: Solid blue rule at $Y = 0.00\text{px}$.
     - Cap-Height Ascent: Solid cinnabar red rule at $Y = -58.00\text{px}$.
     - Font Ascent Boundary: Dashed amber rule at $Y = -86.00\text{px}$.
     - Actual Descent Boundary: Solid brown rule at $Y = +1.00\text{px}$.
     - Glyph Bounding Envelope: Dashed violet rectangle bounding the 11 glyphs.
     - Horizontal Dimension Caliper: Double-ended dimensional arrow indicating $586.80\text{px}$ total advance width.
3. **Paired DOM Typographic Proscenium**:
   - The primary subject `h1.hero-subject#subject-hello-world` is positioned in the DOM directly on the alphabetic baseline, ensuring crisp text rendering and satisfying CDP `elementFromPoint` centroid hit-testing.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Static baseline verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: W3C Canvas 2D Context Level 2 Advanced TextMetrics subpixel font metrology and baseline drafting
  - Measurements:
    - `advanceWidth`: 586.80
    - `actualBoundingBoxAscent`: 58.00
    - `actualBoundingBoxDescent`: 1.00
    - `fontBoundingBoxAscent`: 86.00
    - `fontBoundingBoxDescent`: 23.00
    - `canvasWidth`: 1222
    - `canvasHeight`: 350

## Design Signature
- **Typography**: Heavy grotesque sans-serif (`system-ui`, `-apple-system`, `sans-serif`) for the monumental "HELLO WORLD" type; high-density monospaced typography (`SF Mono`, `Consolas`, monospace) for dimension annotations and telemetry readouts.
- **Color**: Archival typefoundry drafting sheet—warm ivory vellum (`#f7f5ef`, `#ffffff`), carbon drafting ink (`#18181b`, `#1a1e24`), cap-height red (`#e11d48`), baseline blueprint cyan (`#0284c7`), and font ascender amber (`#f59e0b`).
- **Composition**: Master drafting stage featuring canvas-drawn dimensional guidelines and bounding envelopes, supported by a 4-card metrology deck below.
- **Material**: Heavy vellum drafting paper graticule, precision caliper rules, dimensional arrows, and printer registration marks.
- **Motion**: Static architectural metrology proof.
