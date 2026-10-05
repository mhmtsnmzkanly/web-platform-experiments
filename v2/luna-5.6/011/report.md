# Experiment 011 — Annotation

## Goal

Paint a selected range inside Hello World through the CSS Custom Highlight API without changing the DOM structure or text content.

## Candidate ideas

1. **Annotation — Range + CSS Custom Highlight:** Register a text range and let `::highlight()` paint the first word.
2. **Spotlight — IntersectionObserver + clip-path:** Reveal the greeting as it enters a clipped viewport.
3. **Units — `Intl.Segmenter` + DOM tiles:** Map linguistic boundaries into independent text blocks.

## Selection

Annotation was selected because the browser's selection model becomes a visual paint layer. The range-to-highlight flow differs from the CSS state and layout measurements used in prior experiments.

## Technology and mechanism

**Technology:** `Range`, `Highlight`, `CSS.highlights`, and `::highlight()`.

**Mechanism Signature:** text node offsets -> registered Highlight range -> CSS highlight paint over Hello World.

The script creates a Range covering the first five characters of the heading, registers it under `greeting-mark`, and CSS paints that range with lime background, dark text, and an underline. The underlying DOM remains one unchanged text node.

## Visual design

The greeting is presented as a marked manuscript: plum paper, pale serif type, lime annotation ink, and a dusty-pink rule. The highlighted range remains part of the primary phrase rather than a separate control.

## Verification evidence

`node tools.js verify 011/011.dev.html 011` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document has no external resources or network calls.

## Visual review

The reviewed screenshot shows the complete Hello World phrase intact, with only `Hello` receiving the lime registered highlight and underline treatment.

## Limitations

Custom Highlight API support is required for the annotation layer. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `011/011.html`; `011.dev.html` was removed after review.
