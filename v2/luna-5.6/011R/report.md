# Experiment 011R — Reading Light

## Revision intent

Keep CSS Custom Highlight and a live `Range`, but make the annotation a movable reading window.

## Visual and interaction design

The greeting sits on a manuscript desk with registration lines. A range control slides the highlight across the phrase without changing the DOM.

## Technology

`Range`, `Highlight`, `CSS.highlights`, and the CSS Custom Highlight API.

## Verification

```text
node tools.js verify 011R/011R.html 011R
```
