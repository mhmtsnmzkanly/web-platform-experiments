# Experiment 009 — Impression

## Goal

Use a native checkbox state and the CSS relational pseudo-class `:has()` to restyle Hello World without JavaScript.

## Candidate ideas

1. **Impression — native checkbox + `:has()`:** A checked input becomes an ancestor state that recolors, shifts, and shadows the greeting.
2. **Units — `Intl.Segmenter` + DOM tiles:** Convert linguistic word boundaries into individual layout units.
3. **Shared Plate — Shadow DOM + constructable stylesheet:** Adopt one stylesheet into multiple scoped greeting surfaces.

## Selection

Impression was selected because a native form state flows through CSS's relational selector into the primary subject without a script event handler. It is a new state-to-style mechanism after the run's animation and modal experiments.

## Technology and mechanism

**Technology:** Native checkbox state and CSS `:has()`.

**Mechanism Signature:** checked input state -> relational ancestor match -> Hello World color, position, and shadow changes.

The checked checkbox is the state source. `body:has(#signal:checked)` matches the page when the state is active and applies the visual transformation to the poster, heading, control label, and stamp. Unchecking the control reverses the state through CSS alone.

## Visual design

The active state uses a coral poster, navy typography, cream shadow, and a stamped monospace label. The oversized heading remains the visual subject while the native control makes the state explicit.

## Verification evidence

`node tools.js verify 009/009.dev.html 009` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document contains no external resources or runtime network calls.

## Visual review

The reviewed screenshot shows the active checked state: coral poster, shifted navy Hello World, cream offset shadow, and a readable checked native control. The `:has()` stamp reinforces the claimed state-to-style flow.

## Limitations

The initial evidence captures the checked state. The unchecked state can be verified manually by toggling the native control in the browser.

The verified development file was sealed as `009/009.html`; `009.dev.html` was removed after review.
