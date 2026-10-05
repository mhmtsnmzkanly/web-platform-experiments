# Experiment 016 — Woven

## Goal

Use an SVG mask to reveal a procedural pattern only inside the Hello World glyph shapes.

## Candidate ideas

1. **Woven — SVG mask + procedural pattern:** Fill the greeting's masked glyphs with diagonal textile threads.
2. **Chapters — scroll snap + scrollend:** Make native snap settlement select between greeting chapters.
3. **Scroll Is the Clock — CSS ScrollTimeline:** Scrub greeting geometry from scroll offset through a native timeline.

## Selection

Woven was selected because the mask controls where the pattern exists: the pattern is not an adjacent decoration, but the visible material of Hello World itself.

## Technology and mechanism

**Technology:** SVG `<mask>` and `<pattern>`.

**Mechanism Signature:** procedural pattern field -> glyph alpha mask -> textile Hello World reveal.

The mask contains a white SVG text silhouette on black. A diagonal thread pattern is painted into a rectangle and the mask reveals it only through the silhouette, preserving the exact phrase shape while changing its material.

## Visual design

The greeting is presented as a woven label: plum fabric field, coral frame, blue thread base, and cream crossing threads. The masked greeting remains the primary visual subject.

## Verification evidence

`node tools.js verify 016/016.dev.html 016` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. All SVG, CSS, and HTML are inline with no external resources.

## Visual review

The reviewed screenshot shows the full Hello World phrase filled by the diagonal thread pattern, with the frame and note remaining secondary.

## Limitations

SVG mask and pattern rasterization are browser-dependent at subpixel edges. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `016/016.html`; `016.dev.html` was removed after review.
