# Experiment 015 Journal

## 2026-10-02 — Design

Compared shape exclusion, SVG textile masking, and scroll snapping. Selected `shape-outside` because the exclusion region directly controls the greeting's line geometry.

## 2026-10-02 — Implementation

Created `015.dev.html` with one floated elliptical shape, a matching clip path, and a large Hello World heading that flows around the exclusion boundary.

## 2026-10-02 — Verification and visual iteration

The first verification returned `HELLO_VISIBLE 2` and `OK`, but the ellipse occupied the full line range and the shape transition was hard to see. Shortened the float height, reverified successfully, and reviewed the final screenshot showing the greeting constrained beside the ellipse with the lower flow released.

## 2026-10-02 — Sealing

Renamed `015.dev.html` to `015.html` after the corrected verification and visual review.
