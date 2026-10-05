# Experiment 024 — Intersection

## Goal

Use viewport intersection as the native event that settles a complete greeting card.

## Candidate ideas

1. **Intersection — `IntersectionObserver`:** Convert visibility at a threshold into a class and status.
2. **Fonts — `document.fonts.ready`:** Resolve the browser font set before settling typography.
3. **Channel — `BroadcastChannel`:** Reflect a same-origin message across two browser contexts.

## Selection

Intersection was selected because the browser computes visibility geometry and emits the event without polling.

## Technology and mechanism

**Technology:** `IntersectionObserver` with a 50% threshold.

**Mechanism Signature:** Viewport geometry -> threshold crossing -> class mutation -> settled Hello World card.

## Verification evidence

`node tools.js verify 024/024.dev.html 024` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows a fully settled card and the observer's visible percentage status.

## Limitations

Intersection ratios can differ with viewport size; the acceptance browser is installed Chrome/Chromium.

The verified development file was sealed as `024/024.html`; `024.dev.html` was removed after review.
