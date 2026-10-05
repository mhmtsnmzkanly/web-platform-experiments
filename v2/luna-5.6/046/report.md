# Experiment 046 — Runtime

## Goal

Expose two browser-provided runtime capabilities beside the greeting.

## Candidate ideas

1. **Runtime — `hardwareConcurrency` + `devicePixelRatio`:** Read execution and display metrics.
2. **List — `Intl.ListFormat`:** Format words with locale grammar.
3. **Idle — `requestIdleCallback()`:** Defer a status update.

## Selection

Runtime metrics were selected because they connect the greeting to the active browser and display environment.

## Technology and mechanism

**Technology:** `navigator.hardwareConcurrency` and `window.devicePixelRatio`.

**Mechanism Signature:** Browser runtime state -> capability reads -> environment status.

## Verification evidence

`node tools.js verify 046/046.dev.html 046` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and current runtime metrics.

## Limitations

Values vary by machine, browser process, and display configuration.

The verified development file was sealed as `046/046.html`; `046.dev.html` was removed after review.
