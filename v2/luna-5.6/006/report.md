# Experiment 006 — Tilt

## Goal

Place Hello World on a projected three-dimensional plane so perspective changes the apparent depth and angle of the greeting.

## Candidate ideas

1. **Tilt — CSS `perspective` + 3D transforms:** Project the greeting as a tilted sign with depth-bearing text shadow.
2. **Edition — CSS multicolumn + Range geometry:** Fragment a bounded greeting into native newspaper-like columns.
3. **Countermotion — Web Animations API:** Move separate word layers along opposed native animation timelines.

## Selection

Tilt was selected because CSS perspective changes the spatial interpretation of the greeting itself. It is a new geometry mechanism after the Canvas point field and does not rely on a scripted animation loop.

## Technology and mechanism

**Technology:** CSS `perspective`, `rotateX`, `rotateY`, and `rotateZ` transforms.

**Mechanism Signature:** perspective projection -> transformed greeting plane -> depth-bearing Hello World typography.

The body establishes a perspective camera. The `.sign` plane receives compound 3D rotations, while the heading's offset shadow reinforces its projected depth without changing the text content.

## Visual design

The greeting is presented as a cobalt-blue enamel sign against a midnight field, with an orange construction line and cool offset shadow. The large heading remains the primary visual subject.

## Verification evidence

`node tools.js verify 006/006.dev.html 006` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document is self-contained and has no external assets or runtime network calls.

## Visual review

The reviewed screenshot shows the complete greeting legibly on the tilted sign. The compound rotation, orange baseline, and offset shadow make the perspective visible without overpowering the words.

## Limitations

The apparent depth depends on the browser's CSS transform rasterization and viewport. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `006/006.html`; `006.dev.html` was removed after review.
