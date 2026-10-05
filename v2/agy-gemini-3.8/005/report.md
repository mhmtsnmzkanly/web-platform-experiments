# Experiment 005: Canvas 2D Direct Rasterization & Pixel Sampling

## Title
Canvas 2D Direct Rasterization & Pixel Sampling

## Goal
Explore the native HTML5 Canvas 2D graphics API and raw pixel buffer manipulation via `CanvasRenderingContext2D.prototype.getImageData()`, demonstrating procedural typographic reconstruction from raster pixel coverage.

## Selected Idea
Amber Phosphor CRT Oscilloscope terminal. "Hello World" is first rendered into an offscreen scratch buffer, and its raw RGBA byte buffer is extracted via `getImageData`. A spatial sampling algorithm traverses an 8px coordinate grid, reading alpha coverage and compositing glowing circular phosphor beads onto the visible canvas with intensity proportional to glyph coverage.

## Technology
- HTML5 Canvas 2D (`<canvas>`, `CanvasRenderingContext2D`)
- Direct Pixel Buffer Manipulation (`ctx.getImageData`, `ImageData`)
- Math geometry (procedural arc batch drawing, reticle coordinate lines)
- Semantic HTML5

## Mechanism Signature
`Canvas 2D text rasterization -> RGBA alpha buffer sampling -> grid lattice density mapping -> procedural phosphor dot-matrix Hello World`

## Design Signature
- Typography: Monospace matrix dots / technical calibration lettering
- Color: Terminal amber monochrome: carbon black (`#08090c`), glowing amber phosphor (`#ff9e00`), radiant gold core (`#ffc300`), deep phosphor halo (`#331c00`)
- Composition: Centered CRT oscilloscope instrumentation screen with crosshairs and calibration reticles
- Material: Glass cathode ray tube monitor with glowing phosphor bloom
- Motion: Static

## Implementation Summary
An offscreen canvas renders "Hello World" in 128px bold monospace font. `offCtx.getImageData(0, 0, W, H)` extracts the underlying typed pixel array. A nested loop iterates across the coordinate space in 8px steps (`step = 8`). For every cell with alpha coverage > 20:
- Outer circular glow is rendered with proportional low alpha.
- Inner solid phosphor bead is rendered with radius proportional to coverage (ranging from 0.4 to 0.95 of cell radius).
- The primary visible canvas displays 523 active phosphor beads, accompanied by an oscilloscope reticle grid.

## Architectural Decisions
- Used an in-memory offscreen canvas for initial rasterization rather than third-party font parsers or manual coordinate arrays, utilizing the browser's native text shaping and rasterization engine directly.
- Avoided canvas clearing loops or animation frames since this is a deterministic static capture.
- Integrated `window.labEvidence` verifying active canvas pixel rendering, active bead count (> 500), and canvas dimensions.

## Verification Evidence
- Verification command: `node tools.js verify 005/005.dev.html 005` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Canvas validation: non-zero width/height, 1084 canvas draw operations recorded by CDP guard, pixel readback confirmed.
- Runtime evidence: `activePhosphorDots: 523`, `subsampleStep: 8`, `canvasDimensions: { width: 1040, height: 480 }`.

## Visual Evidence & Review
- Screenshot captured: `005/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello World" is unmistakably the dominant, central visual and conceptual subject.
  - Dot matrix reconstruction is sharp, legible, and evocative of vintage amber CRT screens.
  - Dark instrumentation bezel and subtle grid lines frame the subject without overpowering it.

## Limitations
- Static raster sampling; does not explore 3D spatial matrix transformations. CSS 3D perspective projection will be explored in Experiment 006.
