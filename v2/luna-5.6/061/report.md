# Experiment 061 — Relative

## Goal

Render a relative time phrase through the locale engine beside Hello World.

## Candidate ideas

1. **Relative — `Intl.RelativeTimeFormat`:** Format a semantic relative day.
2. **Plural — `Intl.PluralRules`:** Select a locale plural category.
3. **Names — `Intl.DisplayNames`:** Resolve a region label.

## Selection

Relative time was selected because temporal grammar is supplied by the browser's internationalization engine.

## Technology and mechanism

**Technology:** `Intl.RelativeTimeFormat` with English automatic numeric wording.

**Mechanism Signature:** Relative value and unit -> locale grammar -> human phrase -> status.

## Verification evidence

`node tools.js verify 061/061.dev.html 061` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and locale-relative time phrase.

## Limitations

The wording depends on locale and formatter options.

The verified development file was sealed as `061/061.html`; `061.dev.html` was removed after review.
