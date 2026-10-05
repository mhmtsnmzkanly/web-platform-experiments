# Experiment 005 Journal

## 2026-10-02 — Design

Compared Canvas alpha sampling, CSS perspective, and native multicolumn fragmentation. Selected Canvas sampling because the mechanism converts rendered glyph pixels into a new visual representation rather than merely transforming the original text.

## 2026-10-02 — Implementation

Created `005.dev.html` with an offscreen Canvas rasterization pass, `getImageData` sampling, and a visible dot reconstruction. The small HTML heading keeps the literal subject discoverable while the canvas carries the primary visual.

## 2026-10-02 — Verification and visual iteration

The first verification returned `OK`, but the screenshot showed a solid dot lattice because the offscreen source had an opaque background. Removed that fill so the alpha channel represented only the glyph. Reverification returned `OK`, and the final screenshot showed a legible dotted Hello World with empty surrounding field.

## 2026-10-02 — Sealing

Renamed `005.dev.html` to `005.html` after the corrected verification and visual review.
