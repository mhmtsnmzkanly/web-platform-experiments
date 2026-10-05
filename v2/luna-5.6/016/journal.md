# Experiment 016 Journal

## 2026-10-02 — Design

Compared masked procedural pattern, scroll-snap chapters, and scroll-timeline motion. Selected the mask because the procedural material is constrained directly by the greeting's glyph alpha.

## 2026-10-02 — Implementation

Created `016.dev.html` with one inline SVG pattern, one text-based mask, and one masked pattern rectangle. No script or external asset is required.

## 2026-10-02 — Verification and visual review

`node tools.js verify 016/016.dev.html 016` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: the entire phrase is filled by the striped pattern and remains clearly readable inside the coral frame.

## 2026-10-02 — Sealing

Renamed `016.dev.html` to `016.html` after verification and visual review.
