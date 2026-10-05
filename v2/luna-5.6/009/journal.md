# Experiment 009 Journal

## 2026-10-02 — Design

Compared checkbox relational styling, linguistic segmentation, and shared Shadow DOM stylesheets. Selected checkbox plus `:has()` because native form state directly controls the greeting through CSS without JavaScript.

## 2026-10-02 — Implementation

Created `009.dev.html` with a checked native checkbox and relational CSS rules. The active state changes the poster, heading color, translation, rotation, and shadow.

## 2026-10-02 — Verification and visual review

`node tools.js verify 009/009.dev.html 009` returned `HELLO_VISIBLE 2` and `OK`. The screenshot was reviewed: the checked state is visibly active, the relational transformation is clear, and Hello World remains dominant.

## 2026-10-02 — Sealing

Renamed `009.dev.html` to `009.html` after verification and visual review.
