# Experiment 014R — Weather Glyph

## Revision intent

Keep SVG turbulence and displacement mapping, but expose displacement as an editable weather pressure.

## Visual and interaction design

The greeting floats inside a horizon map. The pressure control changes the displacement scale so the glyph moves from calm water to turbulent weather.

## Technology

SVG `feTurbulence`, `feDisplacementMap`, seeded procedural noise, SVG text, and range input.

## Verification

```text
node tools.js verify 014R/014R.html 014R
```
