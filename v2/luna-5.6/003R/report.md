# Experiment 003R — Alignment Machine

## Revision intent

Preserve CSS Grid and `subgrid`, but turn the original two-track poster into an adjustable alignment instrument.

## Visual and interaction design

The words occupy overlapping grid spans on a drafting grid. A range control changes the shared track gap live, making the relationship between the two words physically readable instead of decorative.

## Technology

CSS Grid, `grid-template-columns: subgrid`, responsive track changes, and a range input driving a CSS custom property.

## Verification

The standalone file contains no external resources or runtime dependencies. It must be verified with:

```text
node tools.js verify 003R/003R.html 003R
```
