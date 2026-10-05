# Experiment 002 — Two Tracks

## Goal

Use CSS Grid and the `subgrid` track system to make the two words of `Hello World` inherit one shared horizontal structure.

## Candidate ideas

1. **Two Tracks — CSS Grid + subgrid:** The greeting is split into two words whose blocks inherit the same parent columns, making the relationship between `Hello` and `World` the visible subject.
2. **Spine — `writing-mode` + `text-orientation`:** Turn the greeting into a vertical book-spine composition with upright glyphs.
3. **Contour — SVG `textPath`:** Place the complete greeting along a curved SVG path and let the path define its baseline.

## Selection

Two Tracks was selected because `subgrid` introduces a layout capability not used by the run's baseline, while the inherited tracks directly control the geometry of both words rather than acting as unrelated decoration.

## Technology and mechanism

**Technology:** CSS Grid and CSS Subgrid.

**Mechanism Signature:** parent grid tracks -> child `subgrid` inheritance -> aligned Hello/World word blocks.

The `.stage` element defines two equal columns. The `.title` and `.note` children use `grid-template-columns: subgrid`, so their content shares the same column geometry. The two word spans occupy those inherited tracks and become the visual expression of the layout relationship.

## Visual design

The composition uses a dark drafting-board surface, a vermilion first track, and a warm paper-colored second track. The large split heading remains the primary subject; the small labels only identify the mechanism.

## Verification evidence

`node tools.js verify 002/002.dev.html 002` returned `OK` and produced `screenshot.png`. An initial run exposed a tooling-sensitive text-node issue: indentation between the two spans prevented the checker from matching the literal `Hello World` phrase. The spans were made adjacent while preserving the visible space in the first span, and verification then passed with `HELLO_VISIBLE 2`. The experiment contains no external resources, scripts, or runtime network dependencies.

## Visual review

The reviewed screenshot shows both words clearly. The vermilion `Hello` block and right-aligned paper-colored `World` block occupy matching inherited columns, while the small monospace labels remain secondary. The heading is the dominant visual subject.

## Limitations

`subgrid` support is required for the intended inherited-track behavior. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `002/002.html`; `002.dev.html` was removed after review.
