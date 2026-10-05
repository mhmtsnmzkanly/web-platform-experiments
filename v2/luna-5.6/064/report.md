# Experiment 064 — UUID

## Goal

Generate a browser-native random UUID and expose its leading identity segment.

## Candidate ideas

1. **UUID — `crypto.randomUUID()`:** Create a standards-shaped random identifier.
2. **Random — `crypto.getRandomValues()`:** Fill a byte array.
3. **Names — `Intl.DisplayNames`:** Resolve a region.

## Selection

Random UUID was selected because it provides a native identity primitive with no library.

## Technology and mechanism

**Technology:** `crypto.randomUUID()`.

**Mechanism Signature:** Browser CSPRNG -> UUID v4 string -> visible identity prefix.

## Verification evidence

`node tools.js verify 064/064.dev.html 064` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and generated token prefix.

## Limitations

The token is intentionally non-deterministic and changes on every load.

The verified development file was sealed as `064/064.html`; `064.dev.html` was removed after review.
