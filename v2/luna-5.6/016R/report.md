# Experiment 016R — Loom Control

## Revision intent

Keep an SVG mask and procedural pattern, but make the thread field adjustable and reversible.

## Visual and interaction design

The greeting is woven inside a framed loom. A slider rotates the threads and a button inverts their colors, changing the textile rather than simply revealing a static mask.

## Technology

SVG `<pattern>`, `patternTransform`, SVG `<mask>`, generated texture geometry, and DOM attribute updates.

## Verification

```text
node tools.js verify 016R/016R.html 016R
```
