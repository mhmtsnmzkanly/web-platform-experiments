# Experiment 058 — Offscreen

## Goal

Render a detached pixel surface with `OffscreenCanvas` and expose its dimensions.

## Candidate ideas

1. **Offscreen — `OffscreenCanvas`:** Draw without a DOM canvas element.
2. **Path — `Path2D`:** Retain Bézier geometry.
3. **Data URL — canvas encoding:** Serialize pixels.

## Selection

OffscreenCanvas was selected because it separates pixel production from the document's visible DOM surface.

## Technology and mechanism

**Technology:** `OffscreenCanvas` and its 2D rendering context.

**Mechanism Signature:** Detached canvas -> 2D draw -> offscreen pixel surface -> dimension status.

## Verification evidence

`node tools.js verify 058/058.dev.html 058` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and detached canvas status.

## Limitations

Support varies by browser; the status reports unavailable support when needed.

The verified development file was sealed as `058/058.html`; `058.dev.html` was removed after review.
