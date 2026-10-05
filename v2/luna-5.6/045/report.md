# Experiment 045 — List

## Goal

Format the two greeting words with the browser's locale-aware list grammar.

## Candidate ideas

1. **List — `Intl.ListFormat`:** Produce a localized disjunction from the greeting words.
2. **Idle — `requestIdleCallback()`:** Use spare time.
3. **Event — `CustomEvent`:** Deliver a detail payload.

## Selection

Intl.ListFormat was selected because punctuation and conjunction grammar are delegated to the locale engine.

## Technology and mechanism

**Technology:** `Intl.ListFormat` with English long disjunction formatting.

**Mechanism Signature:** Word array -> locale list grammar -> formatted phrase -> visible status.

## Verification evidence

`node tools.js verify 045/045.dev.html 045` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the complete greeting and locale-formatted phrase.

## Limitations

The output depends on the selected locale and list options.

The verified development file was sealed as `045/045.html`; `045.dev.html` was removed after review.
