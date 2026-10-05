# Experiment 019R — State Theatre

## Revision intent

Keep the View Transition API, but make the named snapshot a repeatable state change controlled by the user.

## Visual and interaction design

The stage has draft and settled states. A single control triggers the native transition between them, changing both the greeting and the theater lighting.

## Technology

`document.startViewTransition()`, `view-transition-name`, pseudo-element transition groups, and class-driven state.

## Verification

```text
node tools.js verify 019R/019R.html 019R
```
