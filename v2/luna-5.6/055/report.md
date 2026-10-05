# Experiment 055 — Selection

## Goal

Create a browser selection over the primary greeting and expose the selected string.

## Candidate ideas

1. **Selection — `Selection` and `Range`:** Programmatically create a live browser text selection.
2. **Range — text geometry:** Measure a text node.
3. **Computed — resolved style:** Read cascade output.

## Selection

Selection was selected because it makes the greeting participate in the browser's native text interaction model.

## Technology and mechanism

**Technology:** `getSelection()`, `Range`, `removeAllRanges()`, and `addRange()`.

**Mechanism Signature:** Heading contents -> range selection -> browser selection object -> selected Hello World.

## Verification evidence

`node tools.js verify 055/055.dev.html 055` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the selected greeting and active selection status.

## Limitations

Selection highlighting is user-agent styled and can vary with focus state.

The verified development file was sealed as `055/055.html`; `055.dev.html` was removed after review.
