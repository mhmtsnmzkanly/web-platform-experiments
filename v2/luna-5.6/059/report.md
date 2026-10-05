# Experiment 059 — Blob URL

## Goal

Create a local Blob, read its text representation, and expose the browser-managed byte container.

## Candidate ideas

1. **Blob — `Blob.text()`:** Move text through a local browser-managed byte container.
2. **FileReader — read a Blob as data:** Encode local bytes.
3. **Offscreen — detached canvas:** Render pixels away from the DOM.

## Selection

Blob text was selected because it creates a browser-managed byte container without a server.

## Technology and mechanism

**Technology:** `Blob` and `Blob.text()`.

**Mechanism Signature:** Text bytes -> local Blob -> asynchronous text readback -> visible payload.

## Verification evidence

`node tools.js verify 059/059.dev.html 059` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and local object URL readback.

## Limitations

The Blob is local to the document and is not uploaded or persisted.

The verified development file was sealed as `059/059.html`; `059.dev.html` was removed after review.
