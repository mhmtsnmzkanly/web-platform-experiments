# Experiment 007R — Kinetic Choreography

## Revision intent

Keep the Web Animations API, but make the animation a small choreography with explicit actors, pause/play control, and adjustable tempo.

## Visual and interaction design

“Hello” and “World” orbit one another on separate trajectories. The crossed ellipses provide a stage map while the controls expose the native animation timelines instead of hiding them.

## Technology

Web Animations API, animation playback state, `updatePlaybackRate()`, pointer-accessible buttons, and range input.

## Verification

```text
node tools.js verify 007R/007R.html 007R
```
