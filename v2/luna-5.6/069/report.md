# Experiment 069 — Visibility

## Goal

Expose the document lifecycle visibility state and wire its native change event.

## Candidate ideas

1. **Visibility — `document.visibilityState`:** Reflect page visibility and changes.
2. **Viewport — `visualViewport`:** Read visual dimensions.
3. **Orientation — `screen.orientation`:** Read display axis.

## Selection

Document visibility was selected because it is a browser lifecycle state, not a layout measurement.

## Technology and mechanism

**Technology:** `document.visibilityState` and the `visibilitychange` event.

**Mechanism Signature:** Page lifecycle state -> visibility event -> synchronized status.

## Verification evidence

`node tools.js verify 069/069.dev.html 069` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and current lifecycle state.

## Limitations

The static verifier captures a visible page, so the initial state is normally `visible`.

The verified development file was sealed as `069/069.html`; `069.dev.html` was removed after review.
