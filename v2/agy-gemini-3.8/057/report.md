# Experiment 057: CSS Content Visibility & Containment Level 2

## Metadata
- **Experiment ID**: 057
- **Technology**: CSS Containment Level 2 Content Visibility (`content-visibility: auto`, `contain-intrinsic-size: auto 90px`, `contain: layout style paint`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 057 explores native rendering virtualization and off-screen subtree layout suppression utilizing the CSS Containment Module Level 2 `content-visibility` and `contain-intrinsic-size` properties.

In data-intensive web applications with deep DOM trees, layout calculation and rendering passes for off-screen elements impose significant main-thread latency. Traditional client-side virtual scrolling requires complex scroll calculations, placeholder DOM nodes, and fragile ResizeObserver loops. `content-visibility: auto` offloads subtree virtualization directly to the browser engine:

1. **Subtree Rendering Virtualization (`content-visibility: auto`)**:
   - Applied to `.virtual-node` stream items: the browser completely skips rendering work (layout, paint, hit-testing) for nodes outside the viewport bounds while maintaining accessibility tree availability.
   - When scrolled into or near the viewport, rendering resumes transparently.
2. **Scrollbar Jitter Suppression (`contain-intrinsic-size`)**:
   - `contain-intrinsic-size: auto 90px` declares estimated placeholder dimensions before layout is calculated.
   - The `auto` keyword instructs the browser to remember the rendered dimensions once measured, eliminating scrollbar jump artifacts as users scroll back and forth.
3. **Primary Subject Proscenium**:
   - The primary heading `<h1 id="subject-hello-world">Hello World</h1>` is anchored at the top of the viewport in `.hero-stage` with `content-visibility: visible`, ensuring perpetual layout visibility, radiant cyan text-shadows, and centroid hit-test integrity.
4. **Policy Toggling & Telemetry Deck**:
   - Features real-time switching between `content-visibility: auto` (Optimized) and `content-visibility: visible` (Uncontained).
   - Telemetry monitors active containment policies, intrinsic estimates, and CSS engine conformance.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 057/057.dev.html 057`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Content-Visibility Supported**: `true`
- **Contain-Intrinsic-Size Supported**: `true`
- **Virtual Nodes**: 6 units
- **Subject Typography**: `64px` font size with centered hero anchor.
