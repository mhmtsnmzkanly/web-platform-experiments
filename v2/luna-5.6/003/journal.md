# Experiment 003 Journal

## 2026-10-02 — Design

Compared vertical writing, SVG path text, and Canvas point sampling. Selected `writing-mode` plus `text-orientation` because the browser's inline-axis model directly changes the greeting's geometry and typography.

## 2026-10-02 — Implementation

Created `003.dev.html` as a standalone book-spine composition. The primary `h1` uses `vertical-rl` with upright Latin glyphs; the side labels provide restrained evidence of the writing-axis change.

## 2026-10-02 — Verification and visual iteration

Verification returned `OK` with `HELLO_VISIBLE 2`. The first screenshot review showed the phrase split into multiple vertical columns, and the next review showed the lower part clipped by the viewport. Added `white-space: nowrap` and reduced the responsive font scale so the complete phrase fits one vertical spine. Reverification returned `OK`, and the final screenshot showed all letters from `H` to `d`.

## 2026-10-02 — Sealing

Renamed `003.dev.html` to `003.html` after the final automated verification and visual review.
