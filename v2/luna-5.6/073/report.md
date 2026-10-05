# Experiment 073 — Origin

## Goal

Expose the performance timeline's navigation time origin beside the greeting.

## Candidate ideas

1. **Origin — `performance.timeOrigin`:** Read the epoch reference for the page timeline.
2. **Ready — document lifecycle:** Read parser state.
3. **Online — connection hint:** Read browser connectivity.

## Selection

Time origin was selected because it anchors performance-relative measurements to an absolute navigation reference.

## Technology and mechanism

**Technology:** `performance.timeOrigin`.

**Mechanism Signature:** Navigation start anchor -> performance time origin -> epoch status.

## Verification evidence

`node tools.js verify 073/073.dev.html 073` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and time-origin value.

## Limitations

The number depends on the current navigation and changes for each document load.

The verified development file was sealed as `073/073.html`; `073.dev.html` was removed after review.
