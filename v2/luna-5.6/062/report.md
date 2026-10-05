# Experiment 062 — Plural

## Goal

Resolve the browser's locale plural category for a numeric greeting count.

## Candidate ideas

1. **Plural — `Intl.PluralRules`:** Select the category for a count.
2. **Relative — `Intl.RelativeTimeFormat`:** Format a day.
3. **Names — `Intl.DisplayNames`:** Resolve a language name.

## Selection

Plural rules were selected because they expose grammatical categorization rather than just string formatting.

## Technology and mechanism

**Technology:** `Intl.PluralRules.select()`.

**Mechanism Signature:** Numeric count -> locale plural rule -> category -> visible status.

## Verification evidence

`node tools.js verify 062/062.dev.html 062` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and selected plural category.

## Limitations

Plural categories are locale-specific and do not directly translate to English nouns.

The verified development file was sealed as `062/062.html`; `062.dev.html` was removed after review.
