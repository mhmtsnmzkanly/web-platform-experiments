# Experiment 037 — Abort

## Goal

Show a native cancellation signal ending a pending operation.

## Candidate ideas

1. **Abort — `AbortController`:** Cancel a timed operation and expose the signal state.
2. **Performance — marks and measures:** Report a measured interval.
3. **Event — custom `EventTarget`:** Dispatch a greeting event.

## Selection

AbortController was selected because cancellation is a first-class browser control-flow primitive.

## Technology and mechanism

**Technology:** `AbortController`, `AbortSignal`, and an abort-aware completion path.

**Mechanism Signature:** Controller -> signal abort -> rejected pending work -> cancellation status.

## Verification evidence

`node tools.js verify 037/037.dev.html 037` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and the settled aborted signal state.

## Limitations

The timed promise is a local demonstration; real fetch or stream operations would consume the signal.

The verified development file was sealed as `037/037.html`; `037.dev.html` was removed after review.
