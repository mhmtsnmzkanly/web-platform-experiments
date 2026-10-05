# Experiment 029 — Fonts

## Goal

Expose the browser's native font readiness promise beneath a complete greeting.

## Candidate ideas

1. **Fonts — `document.fonts.ready`:** Settle the status when the document font set is ready.
2. **Scheduler — `scheduler.postTask()`:** Stage a priority sequence.
3. **Pattern — `URLPattern`:** Match a named pathname segment.

## Selection

Fonts was selected because the browser owns font loading and exposes a native promise for the document's typographic readiness.

## Technology and mechanism

**Technology:** `document.fonts.ready` and the `FontFaceSet.status` value.

**Mechanism Signature:** FontFaceSet readiness promise -> status resolution -> visible typography readiness label.

## Verification evidence

`node tools.js verify 029/029.dev.html 029` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and a settled `fonts / ready` status.

## Limitations

With only system fonts, the promise resolves quickly and does not show a long loading phase.

The verified development file was sealed as `029/029.html`; `029.dev.html` was removed after review.
