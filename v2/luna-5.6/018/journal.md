# Experiment 018 Journal

## 2026-10-02 — Design

Compared blend-mode overprinting, native scroll chapters, and a WebGL field. Selected CSS multiply compositing because the blend result directly forms the greeting's registration color.

## 2026-10-02 — Implementation

Created `018.dev.html` with two offset Hello World layers using coral and blue registration inks. The second layer is aria-hidden so the visual duplicate does not change the semantic subject.

## 2026-10-02 — Verification and visual review

`node tools.js verify 018/018.dev.html 018` returned `HELLO_VISIBLE 4` and `OK`. The screenshot was reviewed: the two registration layers produce distinct colored edges and a dark multiply overlap while the phrase remains legible.

## 2026-10-02 — Sealing

Renamed `018.dev.html` to `018.html` after verification and visual review.
