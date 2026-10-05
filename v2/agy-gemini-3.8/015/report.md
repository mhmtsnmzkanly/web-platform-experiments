# Experiment 015: SVG Filter Displacement & Prismatic Refraction

## Title
SVG Filter Displacement & Prismatic Refraction Optical Bench

## Goal
Demonstrate the graphical capabilities of the browser's native SVG Filter Effects Module Level 1 pipeline, chaining procedural Perlin noise generation (`feTurbulence`), non-affine coordinate deformation (`feDisplacementMap`), channel isolation and re-weighting (`feColorMatrix`), spatial offset (`feOffset`), and additive compositing (`feBlend`) onto standard HTML DOM typography via CSS `filter: url(#...)`.

## Selected Idea
Optical Bench Liquid Refraction Specimen. The phrase "Hello World" is mounted on a scientific optical calibration bench. An inline SVG filter graph models a high-refraction liquid glass medium: `feTurbulence` generates multi-octave fractal Perlin noise, `feDisplacementMap` uses red and green noise channels as spatial vectors to warp the glyph baselines, while split color matrices generate lateral chromatic aberration (red/cyan fringe dispersion).

## Technology
- SVG Filter Effects Module Level 1
- Filter Primitives: `<feTurbulence>`, `<feDisplacementMap>`, `<feOffset>`, `<feColorMatrix>`, `<feBlend>`
- CSS `filter: url(#id)` integration with HTML typography
- Semantic HTML5 and Chrome DevTools Protocol telemetry

## Mechanism Signature
`SVG feTurbulence noise generation -> feDisplacementMap vector warping -> feColorMatrix chromatic split -> prismatic fluid Hello World`

## Design Signature
- Typography: Massive industrial geometric sans (`-apple-system`, `BlinkMacSystemFont`, `sans-serif`) with liquid edge deformation and prismatic fringing; monospaced optical graticule markings (`ui-monospace`, `"SF Mono"`)
- Color:
  - Deep optical void: `#08090c`, `#0f1218`
  - Refractive accents: Spectral cyan (`#00f5d4`), hot magenta (`#f72585`), ultraviolet (`#7209b7`)
  - Calibration graticules: Steel blue grid (`rgba(70, 95, 135, 0.15)`), crisp white typography (`#ffffff`)
- Composition: Optical bench testbed with background graticule grid, target reticle ellipse, and central distorted typographic lockup
- Material: Heavy optical float glass with fluid surface tension and spectral dispersion
- Motion: Static specimen display

## Implementation Summary
1. Defined an inline SVG `<filter id="prismatic-fluid">` with `color-interpolation-filters="sRGB"`.
2. Chained primitives:
   - `<feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="3" seed="73" result="rawNoise" />`
   - `<feDisplacementMap in="SourceGraphic" in2="rawNoise" scale="28" xChannelSelector="R" yChannelSelector="G" result="fluidDistort" />`
   - Cloned and spatially shifted displaced graphics via `<feOffset dx="-4" dy="-2">` and `<feOffset dx="4" dy="2">`.
   - Extracted primary channels using linear color matrices (`feColorMatrix type="matrix"`).
   - Combined color fringes and core displacement using additive screen blending (`<feBlend mode="screen">`).
3. Applied the filter directly to the semantic `<h1 class="distorted-headline">Hello World</h1>` via CSS `filter: url(#prismatic-fluid)`.

## Verification Evidence
- Automated verification command: `node tools.js verify 015/015.dev.html 015` returned exit code `0` and status `OK`.
- Telemetry measurements in `015/verification.json`:
  - `filterId`: `"prismatic-fluid"`
  - `turbulenceFrequency`: `"0.015 0.025"`
  - `turbulenceOctaves`: `3`
  - `displacementScale`: `28`
  - `xChannel`: `"R"`, `yChannel`: `"G"`
  - `computedFilter`: `"url(\"#prismatic-fluid\")"`
- Visual review confirmed `015/screenshot.png`:
  - Legible yet deeply distorted typographic rendering with authentic fluid ripples and chromatic dispersion fringing.
  - Precise alignment inside the optical bench calibration chamber.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores raster displacement of text via SVG filters; does not utilize CSS Shapes float exclusion geometry. CSS `shape-outside` will be explored in Experiment 016.
