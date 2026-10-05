# Experiment 032 — WebGL

## Goal

Use a fragment shader to render a luminous field that encodes the greeting's visual presence.

## Candidate ideas

1. **WebGL — fragment shader:** Compile a native GPU program and render a procedural field.
2. **Audio — `OfflineAudioContext`:** Render a silent signal.
3. **Parser — `DOMParser`:** Build a parsed greeting fragment.

## Selection

WebGL was selected because the browser's graphics pipeline becomes the primary rendering mechanism.

## Technology and mechanism

**Technology:** WebGL shader compilation, buffer setup, uniform state, and a fragment draw call.

**Mechanism Signature:** Vertex quad -> fragment shader -> GPU pixels -> Hello World caption and field.

## Verification evidence

`node tools.js verify 032/032.dev.html 032` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the card and a cyan shader-rendered field.

## Limitations

The fallback status reports unavailable WebGL if the browser or environment disables the graphics context.

The verified development file was sealed as `032/032.html`; `032.dev.html` was removed after review.
