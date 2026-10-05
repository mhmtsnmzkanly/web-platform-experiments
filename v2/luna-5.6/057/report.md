# Experiment 057 — Path

## Goal

Use a reusable `Path2D` Bézier route as the drawing geometry for a greeting surface.

## Candidate ideas

1. **Path — `Path2D`:** Construct and stroke reusable vector geometry.
2. **Data URL — `toDataURL()`:** Encode a canvas.
3. **Offscreen — `OffscreenCanvas`:** Render away from the DOM.

## Selection

Path2D was selected because its retained geometry separates path construction from the draw operation.

## Technology and mechanism

**Technology:** Canvas 2D and `Path2D` cubic Bézier commands.

**Mechanism Signature:** Path commands -> retained geometry -> canvas stroke -> Hello World drawing.

## Verification evidence

`node tools.js verify 057/057.dev.html 057` returned `OK` with `HELLO_VISIBLE 1` and produced `screenshot.png`.

## Visual review

The screenshot shows a curved vector route and the greeting.

## Limitations

The path is visual geometry only; it does not perform text-on-path layout.

The verified development file was sealed as `057/057.html`; `057.dev.html` was removed after review.
