# Experiment 020 — Digest

## Goal

Derive Hello World's visual palette from its SHA-256 digest using the Web Crypto API.

## Candidate ideas

1. **Digest — Web Crypto SHA-256 + CSS custom properties:** Hash the phrase and map digest bytes into accent and ink colors.
2. **Ambient — MediaQueryList + CSS variables:** Let the active color scheme choose the greeting material.
3. **Paint — PerformanceObserver + CSS variables:** Map first-paint timing into a visual progress line.

## Selection

Digest was selected because the greeting's content becomes the input to a native cryptographic primitive, and the result directly controls its visible palette.

## Technology and mechanism

**Technology:** `crypto.subtle.digest('SHA-256')`, `TextEncoder`, and CSS custom properties.

**Mechanism Signature:** Hello World bytes -> SHA-256 digest -> hex-derived CSS colors -> recolored greeting surface.

The digest's first six hex digits define the accent and the next six define the ink. The result is written to root custom properties, so the card, border, background, and heading update from the same content-derived identity.

## Verification evidence

`node tools.js verify 020/020.dev.html 020` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document has no external resources or network calls.

## Visual review

The reviewed screenshot shows the complete greeting and a populated SHA-256 label. The content-derived accent is visible in the border, background, and metadata.

## Limitations

Web Crypto requires a permitted secure context; the lab's localhost HTTP origin provides the acceptance context.

The verified development file was sealed as `020/020.html`; `020.dev.html` was removed after review.
