# Experiment 019 — Transition

## Goal

Use the View Transition API to interpolate a named Hello World surface between two document states.

## Candidate ideas

1. **Transition — View Transition API:** Snapshot the named heading and let the browser interpolate its color and position.
2. **Digest — Web Crypto SHA-256 + CSS variables:** Derive a visual palette from the greeting's digest.
3. **Ambient — MediaQueryList + CSS variables:** Map the active color scheme into the greeting's material.

## Selection

Transition was selected because the browser owns the visual interpolation between states, rather than a script manually animating individual style properties.

## Technology and mechanism

**Technology:** `document.startViewTransition()` and `view-transition-name`.

**Mechanism Signature:** named DOM surface -> browser snapshot -> native transition interpolation -> settled Hello World.

The script starts a view transition on the next frame and adds a class that changes the named heading's color and position. The transition pseudo-elements animate the old and new snapshots.

## Verification evidence

`node tools.js verify 019/019.dev.html 019` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources or network calls are used.

## Visual review

The screenshot shows the settled green greeting and the transition-specific metadata. The View Transition API's intermediate interpolation is time-dependent and not fully represented by a single final capture.

## Limitations

View Transition API support varies by browser. The acceptance environment is installed Chrome/Chromium.

The verified development file was sealed as `019/019.html`; `019.dev.html` was removed after review.
