# Experiment 038 — Locks

## Goal

Claim and release a browser-managed exclusive lock named for the greeting.

## Candidate ideas

1. **Locks — `navigator.locks`:** Acquire a named exclusive lock and expose its lifecycle.
2. **Abort — `AbortController`:** Cancel pending work.
3. **Clone — `structuredClone()`:** Deep-copy a record.

## Selection

Web Locks was selected because the browser coordinates named mutual exclusion even inside one standalone page.

## Technology and mechanism

**Technology:** `navigator.locks.request()` and the lock callback lifecycle.

**Mechanism Signature:** Named lock request -> exclusive grant -> callback work -> release.

## Verification evidence

`node tools.js verify 038/038.dev.html 038` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the complete greeting and released lock status.

## Limitations

Support varies by browser; the page reports unavailable support when needed.

The verified development file was sealed as `038/038.html`; `038.dev.html` was removed after review.
