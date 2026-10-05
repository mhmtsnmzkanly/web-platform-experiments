# Experiment 036 — Clone

## Goal

Round-trip a nested greeting record through the browser's structured clone algorithm.

## Candidate ideas

1. **Clone — `structuredClone()`:** Deep-copy a nested record and display its restored fields.
2. **Form — `FormData`:** Encode a field.
3. **Serializer — `XMLSerializer`:** Capture SVG markup.

## Selection

Structured cloning was selected because it exercises a native data boundary without stringifying the record.

## Technology and mechanism

**Technology:** `structuredClone()` on a nested object.

**Mechanism Signature:** Nested record -> structured clone algorithm -> independent copy -> visible message and metadata.

## Verification evidence

`node tools.js verify 036/036.dev.html 036` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the copied greeting and nested boolean.

## Limitations

The experiment demonstrates cloneable data only; functions and some platform objects are not cloneable.

The verified development file was sealed as `036/036.html`; `036.dev.html` was removed after review.
