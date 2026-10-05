# Experiment 004 Journal

## 2026-10-02 — Design

Compared SVG text on a path, Canvas point reconstruction, and CSS perspective. Selected SVG `textPath` because a cubic path directly controls the greeting's baseline and creates a new geometry-to-glyph mechanism.

## 2026-10-02 — Implementation

Created `004.dev.html` with one inline SVG path, one SVG `textPath`, and no script or external asset. The guide remains visible so the claimed baseline mechanism can be inspected in the screenshot.

## 2026-10-02 — Verification and visual review

`node tools.js verify 004/004.dev.html 004` returned `HELLO_VISIBLE 4` and `OK`. The screenshot was reviewed: the complete phrase follows the visible dashed cubic contour, remains legible, and dominates the paper-colored field.

## 2026-10-02 — Sealing

Renamed `004.dev.html` to `004.html` after verification and visual review.
