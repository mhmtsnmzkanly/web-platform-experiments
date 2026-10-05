# Experiment 013 — Shared Plate

## Goal

Use Shadow DOM boundaries and one constructable stylesheet adopted into multiple scopes to style the Hello World plate and its note.

## Candidate ideas

1. **Shared Plate — Shadow DOM + constructable stylesheet:** Adopt one stylesheet into two custom-element shadow roots while the main greeting remains slotted and scoped.
2. **Refraction — SVG turbulence + displacement map:** Use procedural noise to displace the rendered greeting.
3. **Negative Space — CSS `shape-outside` + float:** Let an exclusion shape bend the available line width around Hello World.

## Selection

Shared Plate was selected because the stylesheet itself becomes a reusable browser object crossing independent shadow scopes. The mechanism is new after the language-generated DOM units in Experiment 012.

## Technology and mechanism

**Technology:** Shadow DOM, custom elements, `CSSStyleSheet.replaceSync()`, and `adoptedStyleSheets`.

**Mechanism Signature:** one constructable stylesheet -> adoption into two shadow roots -> coordinated scoped greeting surfaces.

`greeting-plate` and `greeting-note` each create a shadow root and adopt the same `CSSStyleSheet` instance. The main phrase is delivered through a slot, so its light-DOM text remains the semantic subject while the shadow scope supplies its visual plate.

## Visual design

The greeting is treated as a metal gallery plate: cool steel background, dark charcoal surface, copper edge, and oversized serif typography. The note remains a small secondary echo.

## Verification evidence

`node tools.js verify 013/013.dev.html 013` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document uses no external resources or network calls.

## Visual review

The reviewed screenshot shows Hello World clearly inside the dark scoped plate, with the copper edge and small shared-style note remaining secondary. The first screenshot exposed an over-broad `slot` rule that enlarged the note; scoping the large font to `.plate > slot` fixed the issue.

## Limitations

Constructable stylesheet support and shadow-root styling behavior are browser-dependent. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `013/013.html`; `013.dev.html` was removed after review.
