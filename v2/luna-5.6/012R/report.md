# Experiment 012R — Word Scanner

## Revision intent

Keep `Intl.Segmenter`, but turn language boundaries into a visible scanner with switchable granularity.

## Visual and interaction design

The greeting is decomposed into measured tokens. Word mode exposes semantic units; grapheme mode reveals the smaller linguistic pieces through a different tile field.

## Technology

`Intl.Segmenter`, word and grapheme segmentation, generated DOM tiles, and a native select control.

## Verification

```text
node tools.js verify 012R/012R.html 012R
```
