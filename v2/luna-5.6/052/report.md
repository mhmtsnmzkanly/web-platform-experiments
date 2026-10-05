# Experiment 052 — Point

## Goal

Use viewport hit testing to identify the greeting card at its geometric center.

## Candidate ideas

1. **Point — `elementFromPoint()`:** Ask the browser which element occupies the card center.
2. **Supports — `CSS.supports()`:** Probe declarations.
3. **Style — `getComputedStyle()`:** Read resolved CSS.

## Selection

Element hit testing was selected because it connects layout geometry to the browser's event-targeting surface.

## Technology and mechanism

**Technology:** `getBoundingClientRect()` and `document.elementFromPoint()`.

**Mechanism Signature:** Card rectangle -> center coordinates -> topmost element -> hit-test status.

## Verification evidence

`node tools.js verify 052/052.dev.html 052` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the centered greeting and hit-test result.

## Limitations

The result is viewport-specific and depends on the chosen sample point.

The verified development file was sealed as `052/052.html`; `052.dev.html` was removed after review.
