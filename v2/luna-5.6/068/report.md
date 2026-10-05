# Experiment 068 — Viewport

## Goal

Reflect the browser's visual viewport width, height, and scale.

## Candidate ideas

1. **Viewport — `visualViewport`:** Read and react to the visual window.
2. **Orientation — `screen.orientation`:** Read the display axis.
3. **Visibility — `document.visibilityState`:** Read page lifecycle state.

## Selection

Visual viewport was selected because it exposes the actual visual window independently from layout viewport abstractions.

## Technology and mechanism

**Technology:** `visualViewport.width`, `height`, `scale`, and `resize`.

**Mechanism Signature:** Visual window metrics -> viewport read -> responsive status.

## Verification evidence

`node tools.js verify 068/068.dev.html 068` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and viewport metrics.

## Limitations

Virtual keyboard and pinch zoom changes are not exercised by the static capture.

The verified development file was sealed as `068/068.html`; `068.dev.html` was removed after review.
