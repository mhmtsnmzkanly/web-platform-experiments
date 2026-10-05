# Experiment 017R — Weather Window

## Revision intent

Keep `backdrop-filter`, but turn the glass surface into a navigable window with moving scenery and adjustable depth.

## Visual and interaction design

Colored atmospheric bodies move behind the glass as the pointer crosses the frame. The blur control changes how much of that weather the greeting is allowed to see.

## Technology

`backdrop-filter`, `-webkit-backdrop-filter`, pointer events, CSS custom properties, and range input.

## Verification

```text
node tools.js verify 017R/017R.html 017R
```
