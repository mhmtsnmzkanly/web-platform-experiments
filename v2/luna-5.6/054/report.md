# Experiment 054 — Range

## Goal

Measure the rendered text itself with a native DOM Range.

## Candidate ideas

1. **Range — `Range.getBoundingClientRect()`:** Read the text node's rendered bounds.
2. **Computed — `getComputedStyle()`:** Read resolved style.
3. **Selection — `Selection`:** Select the greeting text.

## Selection

Range geometry was selected because it measures content rather than only its containing element.

## Technology and mechanism

**Technology:** `Range.selectNodeContents()` and `Range.getBoundingClientRect()`.

**Mechanism Signature:** Text node -> DOM range -> rendered rectangle -> pixel status.

## Verification evidence

`node tools.js verify 054/054.dev.html 054` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and measured text bounds.

## Limitations

Line wrapping or font differences can change the measured rectangle.

The verified development file was sealed as `054/054.html`; `054.dev.html` was removed after review.
