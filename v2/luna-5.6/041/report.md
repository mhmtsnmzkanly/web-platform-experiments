# Experiment 041 — Property

## Goal

Animate a typed CSS custom property so the browser interpolates an angle instead of treating it as text.

## Candidate ideas

1. **Property — `CSS.registerProperty()`:** Register an angle-valued custom property and animate it.
2. **Matrix — `DOMMatrix`:** Build a transform matrix.
3. **Event — `CustomEvent`:** Dispatch a native custom event.

## Selection

Typed custom properties were selected because registration changes CSS interpolation semantics while keeping the greeting in CSS.

## Technology and mechanism

**Technology:** `CSS.registerProperty()` with a `<angle>` syntax and CSS animation.

**Mechanism Signature:** Registered angle property -> typed interpolation -> transform rotation -> Hello World motion.

## Verification evidence

`node tools.js verify 041/041.dev.html 041` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting card and typed-property status.

## Limitations

Older browsers may ignore property registration and use the fallback presentation.

The verified development file was sealed as `041/041.html`; `041.dev.html` was removed after review.
