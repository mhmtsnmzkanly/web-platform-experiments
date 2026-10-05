# Experiment 004 — Contour

## Goal

Use an SVG path as the baseline geometry for the complete `Hello World` greeting.

## Candidate ideas

1. **Contour — SVG `textPath` + cubic path:** The browser places every glyph along a curved path so the path becomes the greeting's baseline.
2. **Point Field — Canvas 2D + `getImageData`:** Sample the greeting's pixels and rebuild it as a field of points.
3. **Tilt — CSS perspective + 3D transforms:** Put the greeting on a projected plane with depth and rotation.

## Selection

Contour was selected because the data flow is direct and visually legible: path geometry controls glyph placement. It differs from Experiment 003's writing-axis change and from Experiment 002's rectangular track inheritance.

## Technology and mechanism

**Technology:** SVG `textPath` with a cubic Bézier path.

**Mechanism Signature:** path geometry -> SVG text baseline -> curved Hello World glyph placement.

The SVG path is a single cubic curve. The `textPath` centers the literal greeting on that curve, while the dashed guide makes the relationship between path and typography visible.

## Visual design

The composition treats the greeting as a botanical contour drawing: paper-colored field, moss-green guide, dark green type, and a restrained red index label. Hello World remains the only large visual subject.

## Verification evidence

`node tools.js verify 004/004.dev.html 004` returned `OK` with `HELLO_VISIBLE 4` and produced `screenshot.png`. The document contains only inline HTML, CSS, and SVG.

## Visual review

The reviewed screenshot shows the full greeting following one smooth arch, with every letter visible and centered on the dashed guide path. The phrase is dominant and the index labels remain subordinate.

## Limitations

The exact glyph metrics and curve spacing depend on the browser's SVG text implementation. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `004/004.html`; `004.dev.html` was removed after review.
