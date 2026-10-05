# Experiment 005 — Point Field

## Goal

Sample the alpha channel of a rasterized greeting and reconstruct `Hello World` as a field of native Canvas points.

## Candidate ideas

1. **Point Field — Canvas 2D + `getImageData`:** Rasterize the greeting to an offscreen canvas, sample its pixels, and redraw the result as dots.
2. **Tilt — CSS perspective + 3D transforms:** Place the greeting on a rotated plane whose perspective changes its visual depth.
3. **Edition — CSS multicolumn + Range geometry:** Fragment the greeting through native columns and expose its browser-computed text geometry.

## Selection

Point Field was selected because the greeting becomes data: its raster alpha values determine whether each dot exists and how large it is. This is materially different from the SVG path baseline in Experiment 004.

## Technology and mechanism

**Technology:** Canvas 2D and `getImageData`.

**Mechanism Signature:** rendered text alpha -> sampled lattice -> dot reconstruction of Hello World.

The script first renders the phrase into an offscreen canvas, reads its pixel data, and then samples every seventh pixel. Alpha values above the threshold become circles in the visible canvas, with stronger samples producing larger points.

## Visual design

The point field uses a dark instrument panel, amber sampled light, and a restrained monospace index. The canvas reconstruction is the dominant visual subject.

## Verification evidence

`node tools.js verify 005/005.dev.html 005` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The first visual review exposed an implementation error: an opaque source background made every sampled location pass the alpha threshold. Removing that source fill left only glyph alpha to drive the points. All code and drawing operations are inline; there are no external resources or network calls.

## Visual review

The reviewed screenshot shows a recognizable `Hello World` point field on a continuous dark canvas surface. The major letterforms are intact, while the dot structure remains visibly distinct from ordinary text.

## Limitations

The result depends on the installed browser's Canvas 2D font metrics and rasterization. The sampling step intentionally trades fine detail for a clearly visible point structure.

The verified development file was sealed as `005/005.html`; `005.dev.html` was removed after review.
