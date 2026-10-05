# Experiment 067 — Orientation

## Goal

Expose the browser's current screen orientation type and angle.

## Candidate ideas

1. **Orientation — `screen.orientation`:** Read the active screen axis.
2. **Language — `navigator.language`:** Read locale.
3. **Viewport — `visualViewport`:** Read visual dimensions.

## Selection

Screen orientation was selected because it describes the physical presentation context rather than CSS layout alone.

## Technology and mechanism

**Technology:** `screen.orientation.type` and `screen.orientation.angle`.

**Mechanism Signature:** Display orientation -> type and angle read -> visible axis status.

## Verification evidence

`node tools.js verify 067/067.dev.html 067` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and current orientation.

## Limitations

Desktop browsers commonly report a fixed portrait or landscape state based on the window.

The verified development file was sealed as `067/067.html`; `067.dev.html` was removed after review.
