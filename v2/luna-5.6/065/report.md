# Experiment 065 — Random

## Goal

Fill a byte field with browser cryptographic randomness and display the resulting hex.

## Candidate ideas

1. **Random — `crypto.getRandomValues()`:** Generate secure random bytes.
2. **UUID — `crypto.randomUUID()`:** Generate a UUID token.
3. **Plural — locale category:** Resolve quantity grammar.

## Selection

Random values were selected because the byte-level primitive differs from UUID formatting and exposes the underlying entropy surface.

## Technology and mechanism

**Technology:** `crypto.getRandomValues()` on a `Uint8Array`.

**Mechanism Signature:** CSPRNG -> typed byte array -> hexadecimal projection -> status.

## Verification evidence

`node tools.js verify 065/065.dev.html 065` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and random byte field.

## Limitations

The displayed bytes are intentionally non-deterministic.

The verified development file was sealed as `065/065.html`; `065.dev.html` was removed after review.
