# Experiment 008R — Portal Stage

## Revision intent

Keep the native `dialog` top layer, but make opening and closing part of the visual experience rather than an automatic one-state spotlight.

## Visual and interaction design

The stage presents a greeting and a portal control. The circular dialog becomes a separate focused scene above the document; closing it returns the user to the stage, while the stage control can reopen it.

## Technology

HTML `dialog`, `showModal()`, `close()`, `::backdrop`, and a native dialog form.

## Verification

```text
node tools.js verify 008R/008R.html 008R
```
