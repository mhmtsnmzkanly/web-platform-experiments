# Experiment 012 Journal

## 2026-10-02 — Design

Compared linguistic segmentation, shared Shadow DOM stylesheets, and SVG displacement. Selected `Intl.Segmenter` because browser language boundaries directly generate the greeting's visual units.

## 2026-10-02 — Implementation

Created `012.dev.html` with an English word segmenter. Word-like segments become spans while the original whitespace remains a text node, preserving the complete Hello World phrase.

## 2026-10-02 — Verification and visual review

`node tools.js verify 012/012.dev.html 012` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: the two language-derived word tiles are distinct, aligned, and readable.

## 2026-10-02 — Sealing

Renamed `012.dev.html` to `012.html` after verification and visual review.
