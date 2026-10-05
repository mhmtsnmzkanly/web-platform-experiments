# Experiment 014 Journal

## 2026-10-02 — Design

Compared SVG displacement, shape exclusion, and procedural masks. Selected turbulence plus displacement because a generated field directly transforms the greeting's source glyph image.

## 2026-10-02 — Implementation

Created `014.dev.html` with a seeded `feTurbulence` filter feeding `feDisplacementMap` on one inline SVG text element.

## 2026-10-02 — Verification and visual review

`node tools.js verify 014/014.dev.html 014` returned `HELLO_VISIBLE 3` and `OK`. The screenshot was reviewed: the phrase is visibly displaced but remains readable, and the dashed waterline supports the mechanism without competing with it.

## 2026-10-02 — Sealing

Renamed `014.dev.html` to `014.html` after verification and visual review.
