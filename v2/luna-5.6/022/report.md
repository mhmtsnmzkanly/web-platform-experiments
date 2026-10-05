# Experiment 022 — Stream

## Goal

Compress and restore the greeting through native streaming transforms, then expose the round-trip as the visual caption.

## Candidate ideas

1. **Stream — `CompressionStream` + `DecompressionStream`:** Run a gzip round trip with browser-native transform streams.
2. **Clone — `structuredClone()` + transfer:** Show a transferred payload crossing a native clone boundary.
3. **Pattern — `URLPattern`:** Parse the greeting as a route-like native URL pattern.

## Selection

Stream was selected because the browser performs a real reversible binary transformation without a library or server.

## Technology and mechanism

**Technology:** `CompressionStream('gzip')`, `DecompressionStream('gzip')`, `ReadableStream.pipeThrough()`, and `Response.arrayBuffer()`.

**Mechanism Signature:** UTF-8 greeting bytes -> gzip transform stream -> compressed bytes -> gunzip transform -> restored text.

The resulting byte counts and restored phrase are written below the greeting, making the native stream pipeline observable.

## Verification evidence

`node tools.js verify 022/022.dev.html 022` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows a readable greeting on a teal streaming card and a populated gzip round-trip line.

## Limitations

Compression stream support is browser-dependent; the acceptance environment is installed Chrome/Chromium.

The verified development file was sealed as `022/022.html`; `022.dev.html` was removed after review.
