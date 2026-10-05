# Experiment 011 Journal

## 2026-10-02 — Design

Compared custom text highlights, clipped observer reveal, and linguistic segmentation. Selected Range plus CSS Custom Highlight because a browser text range directly becomes a paint layer without DOM mutation.

## 2026-10-02 — Implementation

Created `011.dev.html` with one heading text node, a Range covering `Hello`, and a registered CSS Highlight named `greeting-mark`.

## 2026-10-02 — Verification and visual review

`node tools.js verify 011/011.dev.html 011` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: the first word is painted by the custom highlight while World remains on the same underlying heading line.

## 2026-10-02 — Sealing

Renamed `011.dev.html` to `011.html` after verification and visual review.
