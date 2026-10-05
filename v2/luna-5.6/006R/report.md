# Experiment 006R — Orbit Plotter

## Revision intent

Keep SVG cubic paths and `textPath`, but turn the static contour into a plotted trajectory that can be reshaped in real time.

## Visual and interaction design

The greeting travels along a measured orbit above a crosshair. The curve control changes both cubic control points and the plotted node, making the path itself the instrument rather than a decorative background.

## Technology

SVG cubic Bézier paths, `textPath`, SVG text, range input, and DOM attribute updates.

## Verification

```text
node tools.js verify 006R/006R.html 006R
```
