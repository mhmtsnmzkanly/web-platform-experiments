# Experiment 050 — Transfer

## Goal

Encode and retrieve the greeting through the browser's native drag-and-drop data container.

## Candidate ideas

1. **Transfer — `DataTransfer`:** Set and read a plain-text drag payload without a gesture.
2. **Meter — native gauge:** Represent phrase length.
3. **Template — inert fragment:** Clone a heading.

## Selection

DataTransfer was selected because it exposes the same payload container used by drag-and-drop interactions.

## Technology and mechanism

**Technology:** `DataTransfer.setData()`, `getData()`, and `types`.

**Mechanism Signature:** Text payload -> native transfer store -> MIME type enumeration -> restored Hello World.

## Verification evidence

`node tools.js verify 050/050.dev.html 050` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and restored transfer payload.

## Limitations

This experiment creates a local transfer object and does not synthesize a user drag gesture.

The verified development file was sealed as `050/050.html`; `050.dev.html` was removed after review.
