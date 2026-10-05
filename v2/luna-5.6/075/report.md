# Experiment 075 — Validity

## Goal

Evaluate a native required form control through the browser constraint-validation model.

## Candidate ideas

1. **Validity — `checkValidity()`:** Read a required input's native validity state.
2. **Escape — `CSS.escape()`:** Encode a selector token.
3. **Origin — `performance.timeOrigin`:** Read the navigation clock.

## Selection

Validity was selected because it demonstrates browser-enforced form semantics without custom validation code.

## Technology and mechanism

**Technology:** Required HTML input and `HTMLInputElement.checkValidity()`.

**Mechanism Signature:** Constraint attribute -> native validation algorithm -> validity boolean -> status.

## Verification evidence

`node tools.js verify 075/075.dev.html 075` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and valid native constraint status.

## Limitations

The hidden form is evaluated programmatically; no submit interaction is needed for this isolated demonstration.

The verified development file was sealed as `075/075.html`; `075.dev.html` was removed after review.
