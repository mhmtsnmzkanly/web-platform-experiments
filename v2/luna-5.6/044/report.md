# Experiment 044 — Idle

## Goal

Schedule a status update for browser idle time and expose the callback's remaining budget.

## Candidate ideas

1. **Idle — `requestIdleCallback()`:** Run the status update when the browser reports spare time.
2. **Event — `CustomEvent`:** Dispatch a local message.
3. **Matrix — `DOMMatrix`:** Apply affine geometry.

## Selection

Idle callback was selected because it reveals a scheduling phase distinct from animation and task priority.

## Technology and mechanism

**Technology:** `requestIdleCallback()` with a fallback timer.

**Mechanism Signature:** Idle queue -> callback deadline -> remaining-time readout -> status update.

## Verification evidence

`node tools.js verify 044/044.dev.html 044` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and settled idle callback label.

## Limitations

The remaining budget depends on browser load and may vary between captures.

The verified development file was sealed as `044/044.html`; `044.dev.html` was removed after review.
