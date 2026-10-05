# Experiment 051: CSS Anchor Positioning Fallback Strategies

## Metadata
- **Experiment ID**: 051
- **Technology**: CSS Anchor Positioning Level 2 Fallback Strategies (`@position-try`, `position-try-fallbacks`, `position-anchor`, `anchor-name: --hero-anchor`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 051 explores advanced CSS Anchor Positioning Level 2 fallback strategies using native declarative `@position-try` at-rules and the `position-try-fallbacks` property.

Unlike static tethering (demonstrated in Experiment 019), real-world tethered user interfaces (e.g. tooltips, floating badges, contextual menus, popovers) must dynamically adapt when the anchor element scrolls near the boundaries of a scroll container or the viewport. CSS Anchor Positioning introduces declarative fallback chains without requiring JavaScript coordinate math or ResizeObserver listeners:

1. **Declarative Fallback Rules (`@position-try`)**:
   - Two named fallback blocks are defined: `@position-try --flank-bottom` and `@position-try --flank-top`.
   - `--flank-bottom` anchors the tethered badge below the subject (`top: calc(anchor(bottom) + 16px); inset-inline: anchor(center); justify-self: anchor-center;`).
   - `--flank-top` reverses the tether to position above the subject (`bottom: calc(anchor(top) + 16px); inset-inline: anchor(center); justify-self: anchor-center;`) when space below is constrained.
2. **Fallback Resolution Pipeline (`position-try-fallbacks`)**:
   - The tethered badge specifies `position-anchor: --hero-anchor; position-try-fallbacks: --flank-bottom, --flank-top;`.
   - The browser's layout engine calculates available clearance in the containing block and automatically activates the first rule in the list that fits within bounds without overflowing.
3. **Primary Subject Proscenium**:
   - The primary heading `<h1 id="subject-hello-world">Hello World</h1>` is registered as the tether anchor with `anchor-name: --hero-anchor;` and styled with a glowing rounded container and cyan typography.
4. **Fallback Visualizer & Telemetry Matrix**:
   - Displays real-time computed clearance, active fallback state, tether anchor left/top coordinates, and provides controls to shift the anchor vertically to demonstrate automatic fallback flipping.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 051/051.dev.html 051`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Anchor Positioning Supported**: `true`
- **Position-Try-Fallbacks Supported**: `true`
- **Active Rule**: `--flank-bottom`
- **Anchor Center Alignment**: Validated via computed bounding client rects.
