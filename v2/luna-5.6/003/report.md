# Experiment 003 — Spine

## Goal

Change the inline writing axis so the complete `Hello World` greeting becomes an upright vertical column rather than a horizontal heading.

## Candidate ideas

1. **Spine — `writing-mode` + `text-orientation`:** Reorient the greeting onto a vertical inline axis while keeping Latin glyphs upright.
2. **Contour — SVG `textPath` + cubic path:** Let a path define a sweeping curved baseline for the greeting.
3. **Point Field — Canvas 2D + pixel sampling:** Convert the rendered greeting into a field of sampled light points.

## Selection

Spine was selected because the writing system itself becomes the mechanism: CSS changes the inline axis and glyph orientation of Hello World directly, creating a new behavior distinct from the grid-track inheritance in Experiment 002.

## Technology and mechanism

**Technology:** CSS `writing-mode` and `text-orientation`.

**Mechanism Signature:** vertical inline axis -> upright glyph orientation -> vertical Hello World column.

The central `h1` uses `writing-mode: vertical-rl` and `text-orientation: upright`. Supporting labels use the same vertical axis with mixed orientation, making the browser's writing-mode model legible without overtaking the greeting.

## Visual design

The greeting is treated as a book spine: a deep blue paper field, warm amber guide line, cream typography, and a restrained offset shadow. The vertical h1 remains the primary visual subject.

## Verification evidence

`node tools.js verify 003/003.dev.html 003` returned `OK` and produced `screenshot.png`. During visual review, the initial type scale split or clipped the vertical phrase; `white-space: nowrap` and a smaller responsive type scale kept the complete greeting inside the spine. The document is self-contained and uses no scripts, assets, or external resources.

## Visual review

The reviewed screenshot shows the complete `Hello World` phrase as a readable upright vertical column from `H` through `d`. The two narrow axis labels remain secondary, and the amber first-letter accent identifies the top of the spine.

## Limitations

The exact vertical glyph metrics depend on the browser's implementation of upright Latin text orientation. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `003/003.html`; `003.dev.html` was removed after review.
