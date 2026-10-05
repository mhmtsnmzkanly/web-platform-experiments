# Experiment 025 — Mutation

## Goal

Turn native DOM mutation records into a visible change log beneath Hello World.

## Candidate ideas

1. **Mutation — `MutationObserver`:** Observe attribute and subtree changes and animate the trace.
2. **Resize — `ResizeObserver`:** Reflect card dimensions in a native layout report.
3. **Selection — `Selection` API:** Display a browser selection's character range.

## Selection

Mutation was selected because the browser's DOM change records become the experiment's visible event stream.

## Technology and mechanism

**Technology:** `MutationObserver`, `requestAnimationFrame`, and DOM `dataset` mutations.

**Mechanism Signature:** DOM attribute writes -> mutation records -> trace count -> animated status line.

## Verification evidence

`node tools.js verify 025/025.dev.html 025` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and a settled mutation trace. Observation is scoped to the two source data attributes so the trace's own updates cannot recurse.

## Limitations

Mutation records are asynchronous and batching can vary; the acceptance browser is installed Chrome/Chromium.

The verified development file was sealed as `025/025.html`; `025.dev.html` was removed after review.
