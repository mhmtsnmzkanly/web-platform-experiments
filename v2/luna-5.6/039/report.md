# Experiment 039 — Performance

## Goal

Measure a small deterministic computation with the browser's performance timeline.

## Candidate ideas

1. **Performance — marks and measures:** Create named marks and expose a duration entry.
2. **Locks — `navigator.locks`:** Claim an exclusive name.
3. **Abort — `AbortController`:** Cancel work.

## Selection

Performance marks were selected because the browser records named timing entries independently of wall-clock logging.

## Technology and mechanism

**Technology:** `performance.mark()`, `performance.measure()`, and `getEntriesByName()`.

**Mechanism Signature:** Start mark -> computation -> end mark -> measured performance entry.

## Verification evidence

`node tools.js verify 039/039.dev.html 039` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and a measured millisecond duration.

## Limitations

The exact duration varies with machine load and browser scheduling.

The verified development file was sealed as `039/039.html`; `039.dev.html` was removed after review.
