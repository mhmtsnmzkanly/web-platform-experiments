# Experiment 047 — Containment

## Goal

Use CSS rendering containment to establish a boundary around the greeting card.

## Candidate ideas

1. **Containment — `contain` + `content-visibility`:** Keep a deferred payload outside the visible layout while preserving intrinsic sizing.
2. **Runtime — hardware and pixel metrics:** Read browser capabilities.
3. **List — locale grammar:** Format the words.

## Selection

Containment was selected because it changes how the browser reasons about layout, paint, and skipped content.

## Technology and mechanism

**Technology:** `contain: layout paint`, `content-visibility: auto`, and `contain-intrinsic-size`.

**Mechanism Signature:** Containment boundary -> skipped hidden payload -> isolated Hello World paint surface.

## Verification evidence

`node tools.js verify 047/047.dev.html 047` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows a clean contained greeting card and active status.

## Limitations

The hidden payload is intentionally minimal; containment benefits are more measurable in larger documents.

The verified development file was sealed as `047/047.html`; `047.dev.html` was removed after review.
