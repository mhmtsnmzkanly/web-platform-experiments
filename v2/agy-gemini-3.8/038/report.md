# Experiment 038: CSS Typed Object Model API Level 1 Algebraic Typography

## Metadata
- **Experiment ID**: 038
- **Technology**: CSS Typed Object Model API Level 1 (`element.attributeStyleMap`, `computedStyleMap()`, `CSSUnitValue`, `CSSMathSum`, `CSSMathProduct`, `CSSTransformValue`, `CSSTranslate`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 038 implements an algebraic typographic calculus engine using the W3C CSS Houdini Typed Object Model (Typed OM) API Level 1. 

Traditional CSS styling in JavaScript relies on string concatenation (`el.style.fontSize = val + 'px'`), which causes performance overhead from repeated string serializing, parsing, and type coercion, and lacks native algebraic composition.

Typed OM replaces string-based styling with typed JavaScript objects and expression trees:
1. **Direct `attributeStyleMap` Injection**:
   The primary heading `h1#subject-hello-world` receives its geometric and typographic styles without string formatting, utilizing `el.attributeStyleMap.set()`.
2. **Algebraic Math Expression Trees (`CSSMathValue`)**:
   - `fontSize`: Formed as an addition tree `new CSSMathSum(CSS.rem(3.5), CSS.vw(0.4))` that resolves dynamically across relative viewports.
   - `letterSpacing`: Formed as a multiplication tree `new CSSMathProduct(CSS.px(1.5), 1.2)`.
   - `transform`: Formed via typed transform components `new CSSTransformValue([new CSSTranslate(CSS.px(0), CSS.px(-2))])`.
3. **AST Introspection & Dual Map Resolution**:
   - The runtime extracts tree nodes from `CSSMathSum.values` and renders an Abstract Syntax Tree (AST) visualization.
   - The resolution matrix validates input expressions against browser-computed values returned by `el.computedStyleMap()`.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 038/038.dev.html 038`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Typed Properties in Map**: 3 properties (`font-size`, `letter-spacing`, `transform`).
- **Computed Font Size**: `61.12 px` (computed from 3.5rem + 0.4vw).
- **Computed Letter Spacing**: `1.80 px` (computed from 1.5px * 1.2).
- **CSSMathSum Terms**: 2 operands verified (`CSSUnitValue` 3.5 rem and 0.4 vw).
