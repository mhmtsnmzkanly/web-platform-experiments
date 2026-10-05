# Experiment 001 Journal

## 2026-10-01 — Started

Initialized the first experiment after completing tooling validation. Chose the normative minimal semantic HTML baseline so later experiments can be compared against an unstyled browser document.

## 2026-10-01 — Implementation

Created `001.dev.html` with an HTML5 doctype, English document metadata, a `main` landmark, and one `h1` containing `Hello World`. Deliberately omitted CSS, JavaScript, assets, and external resources.

## 2026-10-02 — Verification and review

Ran `node tools.js verify 001/001.dev.html 001` from the run root. The command started the local server on an available port, reported `HELLO_VISIBLE 2`, and returned `OK`. Reviewed `screenshot.png`; the native bold heading is clearly visible at the upper-left with no competing content.

## 2026-10-02 — Sealing

Renamed `001.dev.html` to `001.html` after verification and visual review. The baseline experiment is now immutable.
