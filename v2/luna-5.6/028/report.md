# Experiment 028 — Pattern

## Goal

Use native URL pattern grammar to match a route representing the greeting.

## Candidate ideas

1. **Pattern — `URLPattern`:** Match `/hello-world` and expose the named route capture.
2. **Fonts — `document.fonts.ready`:** Resolve the browser's font set before reporting readiness.
3. **Clone — `structuredClone()`:** Round-trip a structured greeting record.

## Selection

Pattern was selected because route matching is performed by a browser-native grammar rather than string slicing.

## Technology and mechanism

**Technology:** `URLPattern` with a named `:greeting` pathname segment.

**Mechanism Signature:** Path string -> URLPattern grammar -> named capture -> matched greeting status.

## Verification evidence

`node tools.js verify 028/028.dev.html 028` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and the matched route capture.

## Limitations

URLPattern support varies by browser; a visible fallback reports unavailable support.

The verified development file was sealed as `028/028.html`; `028.dev.html` was removed after review.
