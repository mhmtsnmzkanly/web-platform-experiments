# Experiment 035 — FormData

## Goal

Move the greeting through native form data and URL encoding primitives.

## Candidate ideas

1. **Form — `FormData` + `URLSearchParams`:** Encode a form field without submitting a request.
2. **Parser — `DOMParser`:** Adopt a parsed heading.
3. **Pattern — `URLPattern`:** Match a route.

## Selection

FormData was selected because it demonstrates the browser's form serialization boundary without a server.

## Technology and mechanism

**Technology:** `FormData` construction and conversion to `URLSearchParams`.

**Mechanism Signature:** Form control -> FormData entry -> URL encoding -> visible serialized greeting.

## Verification evidence

`node tools.js verify 035/035.dev.html 035` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and its encoded form field.

## Limitations

No network request is made; this isolates the browser's serialization behavior.

The verified development file was sealed as `035/035.html`; `035.dev.html` was removed after review.
