# Journal — Experiment 001

## Candidate Exploration

### Candidate A — Topological Vector Glyph Deformation & Stress Field
- **Mechanism:** Procedural and parametric Bézier spline topology representing "Hello World", modulated by dynamic anisotropic tension tensors and normal curvature perturbations.
- **Hello World Role:** Central geometric subject. The glyph contour paths and counterforms serve as the deformation manifold.
- **Frontier Contribution:** Establishes the baseline frontier with deep vector mathematical modeling, analytical arc-length curvature measurements, and crisp architectural typographic composition.
- **Novelty Risk:** Low for baseline, but must avoid appearing as a trivial oscillating wave filter.
- **Complexity Risk:** High if control points are unconstrained; mitigated by strictly preserving character baseline and topological genus.
- **Visual Repetition Risk:** Baseline (none).

### Candidate B — Canvas Particle Advection from Rasterized Glyphs
- **Mechanism:** Rasterize "Hello World" to an offscreen buffer, extract pixel density coordinates, and advect points through a curl noise velocity field.
- **Hello World Role:** Initial emitter position.
- **Frontier Contribution:** Continuous particle dynamics.
- **Novelty Risk:** Particle advection is a widespread cliché that quickly obscures the letterforms, threatening Hello World centrality.
- **Complexity Risk:** Heavy simulation loops without deep browser subsystem interplay.
- **Visual Repetition Risk:** Common generic particle cloud aesthetic.

### Candidate C — 3D CSS Perspective Matrix Decomposition
- **Mechanism:** Hierarchical DOM letter spans transformed across a 3D perspective matrix with variable optical weights.
- **Hello World Role:** Direct textual elements.
- **Frontier Contribution:** CSS 3D rendering pipeline.
- **Novelty Risk:** Relies heavily on static CSS transform styling rather than dynamic computational browser primitives.
- **Complexity Risk:** May fail the quality floor regarding mechanism depth.

## Selection Decision
Selected **Candidate A**.
It anchors the run at a high quality floor:
1. The subject "Hello World" is preserved in its topological typographic form while dynamically undergoing continuous geometric deformation.
2. The mechanism is mathematically verifiable through real-time path lengths, Bézier curvature tangents, and tension metrics.
3. The visual composition is clean, deliberate, and architectural, avoiding extraneous telemetry noise.

## Implementation Plan
- Construct SVG vector glyph paths for the letterforms of "Hello World".
- Implement an analytical strain/tension solver that displaces control points along their normal vectors based on time-harmonic spatial waves.
- Display tension strain overlays (curvature comb and normal vectors) aligned directly with the glyph contours.
- Expose `window.labReady` and `window.labEvidence` measuring instantaneous contour path length, deformation strain factor, and curvature inflection count.

## Verification & Sealing
- Overcame static dependency filter issue by querying `namespaceURI` directly from the DOM SVG element.
- Overcame CDP matched styles timeout by consolidating animated sub-elements into 3 persistent SVG paths.
- Verified with `node tools.js verify 001/001.dev.html 001` — All static, dependency, and runtime checks passed with zero errors.
- Visual review confirmed clear legibility of "HELLO WORLD", distinct normal tension vectors, and balanced typography.
- Sealed `001/001.dev.html` -> `001/001.html`. Sealed artifact is immutable.
