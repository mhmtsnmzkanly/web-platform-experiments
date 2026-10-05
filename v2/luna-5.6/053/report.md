# Experiment 053 — Computed

## Goal

Read the browser-resolved typography values rather than the authored CSS declarations.

## Candidate ideas

1. **Computed — `getComputedStyle()`:** Expose resolved font size and line height.
2. **Point — `elementFromPoint()`:** Perform hit testing.
3. **Range — `getBoundingClientRect()`:** Measure text geometry.

## Selection

Computed style was selected because it reveals the cascade's final values after inheritance and responsive sizing.

## Technology and mechanism

**Technology:** `getComputedStyle()` on the greeting heading.

**Mechanism Signature:** Authored CSS -> cascade and viewport resolution -> computed font values -> status.

## Verification evidence

`node tools.js verify 053/053.dev.html 053` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the large greeting and resolved style values.

## Limitations

Values depend on viewport dimensions and the active user-agent stylesheet.

The verified development file was sealed as `053/053.html`; `053.dev.html` was removed after review.
