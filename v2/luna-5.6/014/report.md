# Experiment 014 — Refraction

## Goal

Apply a seeded SVG turbulence field to the actual Hello World glyphs and displace their geometry like a refracted surface.

## Candidate ideas

1. **Refraction — SVG turbulence + displacement map:** Generate procedural noise and use it to displace the source greeting.
2. **Negative Space — CSS `shape-outside` + float:** Bend the available text line around an exclusion shape.
3. **Woven — SVG mask + procedural pattern:** Reveal the greeting through a textile-like patterned mask.

## Selection

Refraction was selected because the filter operates on the actual rendered glyph source: noise is not decoration beside Hello World, but the displacement input that changes its contour.

## Technology and mechanism

**Technology:** SVG `feTurbulence` and `feDisplacementMap`.

**Mechanism Signature:** seeded procedural noise -> SourceGraphic displacement -> refracted Hello World glyph contour.

The filter generates two-dimensional fractal noise with a fixed seed, then uses the red and blue channels to offset the `SourceGraphic` text. A dashed waterline provides a secondary material cue.

## Visual design

The greeting sits in a deep teal reservoir with sea-glass text, coral waterline, and a restrained procedural surface metaphor. The distorted phrase remains the primary visual subject.

## Verification evidence

`node tools.js verify 014/014.dev.html 014` returned `OK` with `HELLO_VISIBLE 3` and produced `screenshot.png`. The document contains only inline HTML, CSS, and SVG.

## Visual review

The reviewed screenshot shows the complete Hello World phrase with visible but controlled contour displacement. The glyphs remain legible while the dashed waterline reinforces the refraction material.

## Limitations

Filter rasterization and displacement strength vary by browser. The fixed seed and moderate scale keep the acceptance rendering stable in Chrome/Chromium.

The verified development file was sealed as `014/014.html`; `014.dev.html` was removed after review.
