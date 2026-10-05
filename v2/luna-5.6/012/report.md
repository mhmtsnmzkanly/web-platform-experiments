# Experiment 012 — Units

## Goal

Use `Intl.Segmenter` to discover word boundaries in Hello World and turn those language units into visual DOM tiles.

## Candidate ideas

1. **Units — `Intl.Segmenter` + DOM tiles:** Segment the phrase at word granularity and generate one visual unit for each word.
2. **Shared Plate — Shadow DOM + constructable stylesheet:** Share one stylesheet across scoped greeting components.
3. **Refraction — SVG turbulence + displacement map:** Use procedural SVG noise to displace the rendered greeting.

## Selection

Units was selected because the browser's language segmentation result directly determines the DOM structure and visual grouping. It is a new linguistic data flow after the range-based annotation in Experiment 011.

## Technology and mechanism

**Technology:** `Intl.Segmenter` with word granularity.

**Mechanism Signature:** locale-aware segmentation -> word boundary records -> generated Hello/World visual tiles.

The script segments the original text, preserves whitespace as text nodes, and wraps only `isWordLike` segments in `.unit` spans. CSS then gives the resulting word units independent tile colors and vertical offsets.

## Visual design

The greeting is presented as modular type pieces on a deep green board, with lime and orange word tiles. The original phrase remains readable as the primary subject.

## Verification evidence

`node tools.js verify 012/012.dev.html 012` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document uses no external resources or network calls.

## Visual review

The reviewed screenshot shows two distinct word tiles, Hello and World, with the space preserved and the phrase clearly readable. The tile offsets and contrasting colors make the segmentation visible without obscuring the subject.

## Limitations

The exact segmentation behavior depends on the selected locale and browser implementation of `Intl.Segmenter`. This experiment uses English word granularity.

The verified development file was sealed as `012/012.html`; `012.dev.html` was removed after review.
