# Experiment 013R — Scope Orchestra

## Revision intent

Keep Shadow DOM and a constructable shared stylesheet, but make the shared sheet control multiple isolated stages.

## Visual and interaction design

Two shadow-root plates receive the same shared visual score. The recast control toggles a class on both custom elements, exposing coordinated change without leaking styles across scopes.

## Technology

Custom elements, Shadow DOM, `CSSStyleSheet`, `replaceSync()`, and `adoptedStyleSheets`.

## Verification

```text
node tools.js verify 013R/013R.html 013R
```
