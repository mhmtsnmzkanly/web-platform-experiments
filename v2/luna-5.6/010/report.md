# Experiment 010 — Fold

## Goal

Use the measured width of a container to control the spacing and fold angle of a two-part Hello World composition.

## Candidate ideas

1. **Fold — Container Queries + ResizeObserver:** Let the container's measured width set CSS custom properties for the greeting's gap and fold angle.
2. **Units — `Intl.Segmenter` + DOM tiles:** Use linguistic word boundaries to generate independent visual units.
3. **Shared Plate — Shadow DOM + constructable stylesheet:** Share one scoped stylesheet across multiple greeting surfaces.

## Selection

Fold was selected because it creates a measured-layout data flow: ResizeObserver supplies a real container width, CSS custom properties carry the result, and CSS transforms change the World panel. The container query provides a native narrow-layout fallback.

## Technology and mechanism

**Technology:** CSS Container Queries and `ResizeObserver`.

**Mechanism Signature:** container width -> ResizeObserver measurement -> CSS custom properties -> responsive Hello World fold geometry.

The `.sheet` establishes an inline-size query container. ResizeObserver measures that container and writes `--fold-gap` and `--world-turn` on the fold. The CSS uses those variables for the inter-panel gap and World rotation; a container query changes the composition to one column when narrow.

## Visual design

The greeting is treated as a folding paper sheet: warm paper, rust ink, a visible crease, and two aligned word panels. Hello World remains the dominant subject.

## Verification evidence

`node tools.js verify 010/010.dev.html 010` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. During visual review, the first layout placed the crease at the viewport edge and made the measured turn too subtle. Centering the crease inside the fold and adding a perspective context made the measured two-panel relationship explicit. The document is self-contained and uses no external resources.

## Visual review

The reviewed screenshot shows the measured two-panel layout, centered crease, and a readable greeting. The paper field and labels remain secondary to the two word panels.

## Limitations

The captured angle depends on the acceptance viewport's measured container width. Narrower containers intentionally switch to the query-defined stacked layout.

The verified development file was sealed as `010/010.html`; `010.dev.html` was removed after review.
