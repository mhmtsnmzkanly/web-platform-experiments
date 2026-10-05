# Experiment 020R — Color Identity

## Revision intent

Keep Web Crypto SHA-256 color derivation, but let the user author the bytes that determine the visual identity.

## Visual and interaction design

The phrase, digest, border, gradient, and ink are one identity system. Editing the source and recalculating produces a new palette from the browser's cryptographic digest.

## Technology

`TextEncoder`, `crypto.subtle.digest()`, SHA-256, CSS custom properties, and editable input.

## Verification

```text
node tools.js verify 020R/020R.html 020R
```
