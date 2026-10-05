# Experiment 015R — Silence Field

## Revision intent

Keep `shape-outside` and a floated exclusion shape, but let the user resize the silence around the greeting.

## Visual and interaction design

An ellipse reserves negative space beside the greeting. Widening it forces the text to reroute around a larger absence, making exclusion geometry visible.

## Technology

CSS float, `shape-outside`, `clip-path`, CSS custom properties, and range input.

## Verification

```text
node tools.js verify 015R/015R.html 015R
```
