# Experiment 016: CSS Shapes Level 1 Polygon Exclusion

## Title
CSS Shapes Level 1 Polygon Exclusion Geometric Calligram

## Goal
Demonstrate CSS Shapes Module Level 1 non-rectangular inline-box flow geometries using `shape-outside: polygon(...)`, `shape-margin`, and floating exclusions to contour dynamic paragraph text along curvilinear polygonal silhouettes, cradling the monumental subject "Hello World" in an architectural negative-space amphora.

## Selected Idea
Architectural Amphora Negative-Space Calligram. Two opposing floating polygonal wings (`.shape-wing-left` and `.shape-wing-right`) carved with 7-vertex polygon paths flank the editorial chamber. Surrounding text flows dynamically down through the narrowed center waist and flares out at the shoulders, wrapping organically along the contour. Suspended in the central negative space between the shapes sits the imposing typographic monument "Hello World".

## Technology
- CSS Shapes Module Level 1 (`shape-outside: polygon(...)`, `shape-margin`)
- CSS Masking Module Level 1 (`clip-path: polygon(...)`)
- CSS Floats (`float: left`, `float: right`)
- Semantic HTML5 structure (`<main>`, `<header>`, `<article>`, `<footer>`)
- Chrome DevTools Protocol automated inspection (`window.labEvidence`)

## Mechanism Signature
`Dual floating polygon shapes -> shape-outside line-box exclusion -> contour-hugging typography -> negative-space Hello World amphora`

## Design Signature
- Typography: High-fashion literary editorial serif (`"Didot"`, `"Bodoni MT"`, `"Baskerville"`, `"Georgia"`, serif) with justified micro-typography; crisp monospaced telemetry (`ui-monospace`, `"SF Mono"`)
- Color:
  - Folio base: Fine-art cream rag paper (`#f6f3eb`, `#fbf9f5`)
  - Sculptural wings: Deep basalt charcoal (`#181615`, `#242220`)
  - Accent rules & badges: Tuscan terracotta ochre (`#c05634`)
  - Dividers: Warm limestone sand (`#ded8cb`)
- Composition: Symmetrical architectural amphitheatre formed by dual faceted polygonal wings, dynamic hourglass text wrapping, and centered monumental heading
- Material: Heavy fine-art cotton rag paper with blind deboss and dark stone monoliths
- Motion: Static specimen display

## Implementation Summary
1. Configured left and right floating containers with opposing 7-point polygon paths:
   - Left: `shape-outside: polygon(0 0, 100% 0, 45% 25%, 15% 50%, 55% 75%, 100% 100%, 0 100%)`
   - Right: `shape-outside: polygon(100% 0, 0 0, 55% 25%, 85% 50%, 45% 75%, 0 100%, 100% 100%)`
2. Specified `shape-margin: 16px` to establish dynamic clearance between the polygon geometry and inline typography.
3. Aligned `clip-path` with `shape-outside` to visually match rendered shape geometries with the exclusion boundaries.
4. Streamed justified text around the wings, naturally necking down into the narrow waist and opening up around the `<h1 class="monument-title">Hello World</h1>` lockup.

## Verification Evidence
- Automated verification command: `node tools.js verify 016/016.dev.html 016` exited with code `0` and returned `OK`.
- Telemetry measurements in `016/verification.json`:
  - `leftShapeOutside`: `"polygon(0px 0px, 100% 0px, 45% 25%, 15% 50%, 55% 75%, 100% 100%, 0px 100%)"`
  - `rightShapeOutside`: `"polygon(100% 0px, 0px 0px, 55% 25%, 85% 50%, 45% 75%, 0px 100%, 100% 100%)"`
  - `shapeMargin`: `"16px"`
  - `leftFloat`: `"left"`, `rightFloat`: `"right"`
  - `headlineVisible`: `"Hello World"`
- Visual review confirmed `016/screenshot.png`:
  - Unmistakable amphora/hourglass text contour wrapping around dark stone polygonal wings.
  - Prominent "HELLO WORLD" headline perfectly positioned in the negative space waist.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores CSS Shapes float exclusions; does not utilize CSS Scroll-driven animations. CSS ScrollTimeline and ViewTimeline will be explored in Experiment 017.
