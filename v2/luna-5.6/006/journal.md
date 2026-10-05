# Experiment 006 Journal

## 2026-10-02 — Design

Compared CSS perspective, CSS multicolumn fragmentation, and Web Animations API motion. Selected the perspective plane because it changes Hello World's spatial projection directly and avoids repeating the sampled or path-based representations.

## 2026-10-02 — Implementation

Created `006.dev.html` with an inline projected sign. The body supplies the perspective camera and the sign uses compound 3D rotations; no script or external asset is required.

## 2026-10-02 — Verification and visual review

`node tools.js verify 006/006.dev.html 006` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: the full greeting remains readable on the projected sign, with the offset shadow providing visible depth.

## 2026-10-02 — Sealing

Renamed `006.dev.html` to `006.html` after verification and visual review.
