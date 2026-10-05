# Experiment 005R — Living Particles

## Revision intent

Keep Canvas 2D and `getImageData`, but turn the sampled glyph field into a responsive instrument rather than a static reconstruction.

## Visual and interaction design

The greeting is rebuilt from sampled points. Pointer proximity repels the particles, while clicking inverts the instrument's dark/light state. The grid and readout make the canvas feel like a live measurement surface.

## Technology

Canvas 2D, an offscreen source canvas, `getImageData()`, pointer events, and `requestAnimationFrame()`.

## Verification

The standalone file contains no external resources or runtime dependencies. It must be verified with:

```text
node tools.js verify 005R/005R.html 005R
```
