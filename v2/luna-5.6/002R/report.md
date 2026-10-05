# Experiment 002R — Vertical Signal

## Revision intent

Preserve the original `writing-mode` and `text-orientation` mechanism while replacing the static book-spine composition with a responsive, pointer-reactive typographic instrument.

## Visual and interaction design

The greeting is a vertical signal suspended between two measured axes. Pointer position bends the vertical composition by a small angle; clicking changes the ink emphasis. The surrounding field uses guide lines and a restrained acid accent instead of a centered card.

## Technology

`writing-mode: vertical-rl`, `text-orientation: upright`, CSS transforms, and pointer events.

## Verification

The standalone file contains no external resources or runtime dependencies. It must be verified with:

```text
node tools.js verify 002R/002R.html 002R
```
