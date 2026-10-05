# Experiment 017 Journal

## 2026-10-02 — Design

Compared backdrop compositing, scroll-snap chapters, and a fragment shader. Selected the glass surface because its filter operates on background pixels behind the greeting.

## 2026-10-02 — Implementation

Created `017.dev.html` with layered gradient orbs, a translucent panel, and native backdrop blur/saturation. No script or external asset is required.

## 2026-10-02 — Verification and visual review

`node tools.js verify 017/017.dev.html 017` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: Hello World remains sharp in front while the colored background is softened through the glass surface.

## 2026-10-02 — Sealing

Renamed `017.dev.html` to `017.html` after verification and visual review.
