# Experiment 007 — Countermotion

## Goal

Use the Web Animations API to move the two words of Hello World on opposed native animation tracks while keeping the phrase legible.

## Candidate ideas

1. **Countermotion — Web Animations API:** Animate `Hello` and `World` with mirrored transforms so the greeting breathes around a shared center.
2. **Edition — CSS multicolumn + Range geometry:** Fragment text into native columns and expose the browser's flow geometry.
3. **Impression — native checkbox + `:has()`:** Let a checked state restyle the greeting through relational CSS.

## Selection

Countermotion was selected because the browser's animation timeline directly controls the two word layers. It adds native temporal behavior without repeating the static path, point, or perspective mechanisms.

## Technology and mechanism

**Technology:** Web Animations API.

**Mechanism Signature:** opposing animation timelines -> word transforms -> breathing Hello World composition.

Two `Element.animate()` calls run mirrored keyframes on the `Hello` and `World` spans. Their opposing translation and rotation keep the complete phrase visually connected while making the native animation state visible.

## Visual design

The composition uses a pale paper field, plum accent, split rule, and oversized geometric typography. The motion is subtle enough to preserve the phrase as the primary subject.

## Verification evidence

`node tools.js verify 007/007.dev.html 007` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The file uses only inline HTML, CSS, and JavaScript with no external resources.

## Visual review

The reviewed screenshot shows a complete, readable Hello World phrase with the two words visibly offset and rotated in opposite directions. The labels and split rule remain secondary.

## Limitations

The exact captured animation phase depends on the screenshot wait timing and browser frame scheduling. The acceptance scope is the deterministic lab capture path.

The verified development file was sealed as `007/007.html`; `007.dev.html` was removed after review.
