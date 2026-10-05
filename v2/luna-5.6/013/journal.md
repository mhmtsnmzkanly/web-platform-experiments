# Experiment 013 Journal

## 2026-10-02 — Design

Compared shared Shadow DOM stylesheets, SVG displacement, and shape exclusion. Selected constructable stylesheet adoption because one browser stylesheet object can coordinate independent scoped components.

## 2026-10-02 — Implementation

Created `013.dev.html` with two custom elements. Both attach shadow roots and adopt the same stylesheet object created with `CSSStyleSheet.replaceSync()`. The primary greeting remains slotted text in the first component.

## 2026-10-02 — Verification and visual iteration

The first verification returned `HELLO_VISIBLE 2` and `OK`, but the screenshot showed the broad `slot` font rule applying to the note as well as the main plate. Scoped the large rule to `.plate > slot` and assigned the note slot its inherited monospace style. Reverification returned `OK`; the final screenshot showed the intended large plate and small note.

## 2026-10-02 — Sealing

Renamed `013.dev.html` to `013.html` after the corrected verification and visual review.
