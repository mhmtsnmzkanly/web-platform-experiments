# Experiment 042 — Matrix

## Goal

Construct an affine transform with the native DOMMatrix API and apply its values to the greeting.

## Candidate ideas

1. **Matrix — `DOMMatrix`:** Create translation and skew values and expose the resulting matrix.
2. **Property — `CSS.registerProperty()`:** Animate a typed angle.
3. **Event — `CustomEvent`:** Dispatch a custom signal.

## Selection

DOMMatrix was selected because it makes the transform geometry an explicit browser object rather than a hand-written string.

## Technology and mechanism

**Technology:** `DOMMatrix.translate()`, `DOMMatrix.skewY()`, and CSS matrix transform values.

**Mechanism Signature:** Matrix operations -> affine coefficients -> transformed Hello World surface.

## Verification evidence

`node tools.js verify 042/042.dev.html 042` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the skewed greeting and matrix coefficients.

## Limitations

The displayed coefficients are a compact subset of the full matrix state.

The verified development file was sealed as `042/042.html`; `042.dev.html` was removed after review.
