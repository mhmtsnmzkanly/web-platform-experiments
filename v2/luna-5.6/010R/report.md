# Experiment 010R — Responsive Instrument

## Revision intent

Keep container queries and `ResizeObserver`, but make the measured container an interactive object whose width can be inspected and changed directly.

## Visual and interaction design

The greeting lives inside a ruler-marked viewport. The range control changes the viewport width; container query thresholds switch the composition from a two-column instrument to a stacked one, while `ResizeObserver` reports the measured result.

## Technology

CSS Container Queries, container-relative units, `ResizeObserver`, range input, and CSS custom layout thresholds.

## Verification

```text
node tools.js verify 010R/010R.html 010R
```
