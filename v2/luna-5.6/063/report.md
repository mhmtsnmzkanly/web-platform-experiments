# Experiment 063 — Names

## Goal

Resolve a standardized region code into a localized display name.

## Candidate ideas

1. **Names — `Intl.DisplayNames`:** Resolve `US` through the locale data set.
2. **Plural — `Intl.PluralRules`:** Select a quantity category.
3. **Relative — `Intl.RelativeTimeFormat`:** Format a temporal phrase.

## Selection

Display names were selected because the browser converts a compact standardized code into human language.

## Technology and mechanism

**Technology:** `Intl.DisplayNames` with region type.

**Mechanism Signature:** Region code -> locale display-name data -> readable label -> status.

## Verification evidence

`node tools.js verify 063/063.dev.html 063` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and resolved region label.

## Limitations

The resolved label depends on the chosen locale.

The verified development file was sealed as `063/063.html`; `063.dev.html` was removed after review.
