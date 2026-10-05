# Experiment 002 Journal

## 2026-10-02 — Design

Compared three distinct directions: CSS Grid with `subgrid`, vertical writing, and SVG text on a path. Selected CSS Grid plus `subgrid` because inherited track geometry directly shapes the two-word greeting and establishes a new mechanism after the semantic baseline.

## 2026-10-02 — Implementation

Created `002.dev.html` as a standalone document with no scripts or external resources. The parent stage defines two columns; the title and note inherit those columns through `subgrid`.

## 2026-10-02 — Verification

The first verification attempt failed because whitespace between the two word spans made the DOM text `Hello\nWorld`, which did not satisfy the lab's contiguous `Hello World` visibility check. Keeping the spans adjacent and placing the space inside the first span fixed the semantic text without changing the visual composition. The next verification returned `HELLO_VISIBLE 2` and `OK`.

## 2026-10-02 — Visual review and sealing

Reviewed `screenshot.png` at the required viewport. Both word blocks are legible and aligned to the shared two-column structure; the labels do not compete with the greeting. Renamed `002.dev.html` to `002.html` after review.
