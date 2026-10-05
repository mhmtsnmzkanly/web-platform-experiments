# Experiment 070 — Pointer

## Goal

Read pointer precision and hover capability from media features.

## Candidate ideas

1. **Pointer — `matchMedia('(pointer:fine)')`:** Reflect input hardware capability.
2. **Visibility — lifecycle state:** Reflect page visibility.
3. **Viewport — visual window:** Read dimensions.

## Selection

Pointer media was selected because it describes interaction hardware rather than color preference or screen geometry.

## Technology and mechanism

**Technology:** `MediaQueryList.matches` for `pointer` and `hover` media features.

**Mechanism Signature:** Input capability media query -> match values -> interaction status.

## Verification evidence

`node tools.js verify 070/070.dev.html 070` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and pointer capability status.

## Limitations

The values describe the active input environment and may change when devices are attached.

The verified development file was sealed as `070/070.html`; `070.dev.html` was removed after review.
