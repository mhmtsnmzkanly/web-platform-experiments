# Experiment 023 — Priority

## Goal

Expose browser task scheduling as a staged status line beneath a complete greeting.

## Candidate ideas

1. **Priority — `scheduler.postTask()` with priorities:** Queue visible states through the native scheduler.
2. **Observer — `MutationObserver`:** Turn DOM mutations into a native event trace.
3. **Clone — `structuredClone()`:** Transfer a greeting record through the structured clone algorithm.

## Selection

Priority was selected because it demonstrates a browser scheduling primitive while keeping the visual result deterministic and dependency-free.

## Technology and mechanism

**Technology:** `scheduler.postTask()` with `background`, `user-visible`, and `user-blocking` priorities, with a resolved-promise fallback.

**Mechanism Signature:** Native task queue -> ordered priority stages -> status text and completion color.

## Verification evidence

`node tools.js verify 023/023.dev.html 023` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and a settled green completion status.

## Limitations

Task ordering and scheduler availability vary by browser; the acceptance browser is installed Chrome/Chromium.

The verified development file was sealed as `023/023.html`; `023.dev.html` was removed after review.
