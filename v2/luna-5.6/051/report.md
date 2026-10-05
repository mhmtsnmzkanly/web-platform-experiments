# Experiment 051 — Supports

## Goal

Ask the browser which native CSS capabilities it recognizes and expose the result beside Hello World.

## Candidate ideas

1. **Supports — `CSS.supports()`:** Probe a small set of native declarations.
2. **Geometry — `elementFromPoint()`:** Identify the topmost greeting surface.
3. **Style — `getComputedStyle()`:** Read resolved typography.

## Selection

CSS.supports was selected because feature detection is a browser capability boundary, not a hard-coded browser-name check.

## Technology and mechanism

**Technology:** `CSS.supports()` with grid, view-transition, and scroll-timeline declarations.

**Mechanism Signature:** CSS declaration probes -> support count -> visible capability status.

## Verification evidence

`node tools.js verify 051/051.dev.html 051` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and the native capability count.

## Limitations

The count reflects the installed browser and can differ on other engines.

The verified development file was sealed as `051/051.html`; `051.dev.html` was removed after review.
