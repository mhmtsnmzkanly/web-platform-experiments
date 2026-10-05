# Experiment 004R — Parallax Object

## Revision intent

Keep CSS perspective and 3D transforms, but replace the static tilted sign with a layered object that responds to pointer parallax.

## Visual and interaction design

The greeting floats in a depth stack of frames, shadows, and a luminous orb. Pointer position rotates the front plane, revealing the separation between the foreground greeting and recessed geometry.

## Technology

CSS `perspective`, `transform-style: preserve-3d`, `translateZ()`, and pointer-driven 3D transforms.

## Verification

The standalone file contains no external resources or runtime dependencies. It must be verified with:

```text
node tools.js verify 004R/004R.html 004R
```
