# Experiment 060 — FileReader

## Goal

Read local Blob bytes as a data URL with the browser's legacy-compatible file reader.

## Candidate ideas

1. **FileReader — `readAsDataURL()`:** Convert a local Blob into a data URL.
2. **Blob URL — object resource:** Read and revoke a local URL.
3. **Canvas — `toDataURL()`:** Encode pixels.

## Selection

FileReader was selected because it exposes an event-driven local byte reading API distinct from object URLs.

## Technology and mechanism

**Technology:** `FileReader`, `Blob`, `load`, and `readAsDataURL()`.

**Mechanism Signature:** Local Blob -> asynchronous reader -> data URL -> visible prefix.

## Verification evidence

`node tools.js verify 060/060.dev.html 060` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and completed reader status.

## Limitations

Only a prefix of the generated data URL is displayed to preserve the composition.

The verified development file was sealed as `060/060.html`; `060.dev.html` was removed after review.
