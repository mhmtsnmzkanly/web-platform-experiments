# Experiment 074 — Escape

## Goal

Convert a greeting-derived token into a selector-safe CSS identifier.

## Candidate ideas

1. **Escape — `CSS.escape()`:** Encode punctuation for selector use.
2. **Origin — performance clock:** Read navigation timing anchor.
3. **Ready — document lifecycle:** Read parser state.

## Selection

CSS.escape was selected because it is a focused browser utility for safely moving text into selector syntax.

## Technology and mechanism

**Technology:** `CSS.escape()` on a string containing whitespace and punctuation.

**Mechanism Signature:** Raw token -> CSS identifier escaping -> selector-safe status.

## Verification evidence

`node tools.js verify 074/074.dev.html 074` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and escaped selector token.

## Limitations

Escaping makes a token syntactically safe; it does not validate application-level meaning.

The verified development file was sealed as `074/074.html`; `074.dev.html` was removed after review.
