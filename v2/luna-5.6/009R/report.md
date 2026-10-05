# Experiment 009R — State Switchboard

## Revision intent

Keep the native checkbox and CSS `:has()` relationship, but expand the original binary impression into a small visual switchboard with independent state channels.

## Visual and interaction design

Two switches control the same composition without JavaScript. One inverts the field and moves the greeting; the other stretches the surrounding echo and changes the word spacing. The relational selector becomes the control system.

## Technology

Native checkbox inputs, CSS `:has()`, pseudo-elements, transitions, and state-driven transforms.

## Verification

```text
node tools.js verify 009R/009R.html 009R
```
