# Experiment 072 — Ready

## Goal

Expose the document parser lifecycle state after the greeting has been constructed.

## Candidate ideas

1. **Ready — `document.readyState`:** Read the current document lifecycle stage.
2. **Online — `navigator.onLine`:** Read connectivity.
3. **Timing — `performance.timeOrigin`:** Read navigation timing origin.

## Selection

Ready state was selected because it directly describes the document's own construction lifecycle.

## Technology and mechanism

**Technology:** `document.readyState`.

**Mechanism Signature:** Parser lifecycle -> ready-state value -> visible document status.

## Verification evidence

`node tools.js verify 072/072.dev.html 072` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and parsed document state.

## Limitations

The static capture occurs after parsing, so the visible state is normally `interactive` or `complete`.

The verified development file was sealed as `072/072.html`; `072.dev.html` was removed after review.
