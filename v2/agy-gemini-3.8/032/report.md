# Experiment 032: CSS Cascade Layers Level 1 Specificity Inversion

## Overview
Experiment 032 explores the W3C CSS Cascading & Inheritance Level 5 specification (`@layer`), demonstrating the fundamental architectural shift where explicit layer declaration ordering supersedes traditional CSS selector specificity hierarchies `(A, B, C)`. The experiment structures a Bauhaus-inspired typographic laboratory displaying a monumental "Hello World" subject styled across competing cascade layers, accompanied by a real-time cascade precedence ledger.

## Technical Architecture & Mechanism
1. **Explicit Layer Ordering**:
   - The document establishes an explicit ascending layer order at the root of the stylesheet:
     ```css
     @layer reset, tokens, architecture, typography, components, stateOverrides;
     ```
   - In standard CSS cascade resolution without `@layer`, selector specificity rules unconditionally. With `@layer`, properties declared in later layers always defeat properties in earlier layers, regardless of how specific the selector in the earlier layer is.
2. **Specificity Inversion Demonstration**:
   - In `@layer architecture`, the subject is targeted via an ID selector:
     ```css
     #subject-hello-world { color: #ef4444; font-size: 32px; } /* Specificity: (1, 0, 0) */
     ```
   - In `@layer stateOverrides`, the subject is targeted via a simple class selector:
     ```css
     .hero-subject { color: #f8fafc; font-size: 74px; } /* Specificity: (0, 1, 0) */
     ```
   - Despite having an order-of-magnitude lower specificity tuple (`(0, 1, 0)` vs `(1, 0, 0)`), the declaration in `stateOverrides` wins the cascade because `stateOverrides` is declared later in the `@layer` sequence than `architecture`.
3. **CSSOM Introspection**:
   - Through `document.styleSheets[0].cssRules`, the runtime dynamically enumerates instances of `CSSLayerBlockRule` and `CSSLayerStatementRule`, introspecting layer names (`reset`, `tokens`, `architecture`, `typography`, `components`, `stateOverrides`) and confirming 6 active layers in the stylesheet.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Automated verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: CSS Cascading & Inheritance Level 5 @layer specificity inversion matrix
  - Measurements:
    - `computedFontSize`: `"74px"`
    - `computedColor`: `"rgb(248, 250, 252)"`
    - `expectedWinner`: `"stateOverrides"`
    - `winningLayerFontSize`: `"74px"`
    - `overriddenIdFontSize`: `"32px"`
    - `layerOrderOverrodeSpecificity`: `true`
    - `detectedLayers`: `["reset", "tokens", "architecture", "typography", "components", "stateOverrides"]`

## Design Signature
- **Typography**: Heavy grotesque sans-serif (`-apple-system`, `Segoe UI`, `sans-serif`) for the monumental "HELLO WORLD" monument; crisp monospaced typography (`SF Mono`, `Consolas`, monospace) for specificity tuples, selector strings, and layer order indices.
- **Color**: Modernist dark obsidian palette (`#0e1117`, `#151a24`), active layer cyan (`#38bdf8`), overridden red (`#ef4444`), intermediate amber (`#f59e0b`), and winning emerald (`#10b981`).
- **Composition**: Dual-section architectural layout featuring a proscenium monument stage on top and a 5-row cascade precedence ledger at the bottom.
- **Material**: Matte slate chassis, subtle laser divider rules, specificity badges, and glowing layer status pills.
- **Motion**: Static architectural balance displaying the computed cascade resolution.
