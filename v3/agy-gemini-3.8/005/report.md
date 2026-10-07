# Experiment 005 — Spectrographic Glyph Decomposition & Optical Dispersion

## Experiment
- **ID:** 005
- **Title:** Spectrographic Glyph Decomposition & Cauchy Optical Dispersion
- **File:** `005.html`
- **Sealing Date:** 2026-10-07

## Goal
Demonstrate that deep mechanism novelty and visual authorship can be achieved exclusively through the native browser DOM and modern CSS engine (zero Canvas, zero SVG), decomposing "HELLO WORLD" into 7 spectral wavebands via physical Cauchy optical dispersion laws and CSS Color Module Level 4 (`oklch()`).

## Frontier Contribution
- **Technology Integration:** Pure modern DOM architecture without graphics contexts (`canvas` or `svg`). Combines CSS Color Level 4 OKLCH color spaces, `mix-blend-mode: screen` additive chromatic recombination, 3D CSS transforms (`translate3d`, `skewX`), and dynamic JavaScript-to-CSS variable synchronization.
- **Mechanism Depth:** Implements Cauchy's dispersion equation for crown glass ($n(\lambda) = A + B/\lambda^2$), calculating wavelength-dependent refraction indices ($\lambda \in [400\text{nm}, 680\text{nm}]$) that modulate spatial offset and optical shear.
- **Visual Authorship:** An optical science editorial poster set on deep obsidian black (`#05070a`), featuring intense prismatic refraction fringes that additively converge into pure white light at optical focal points.
- **Evidence / Observability:** Directly measures Cauchy mean refractive index ($n = 1.5203$), peak dispersion offset in pixels, and chromatic color difference $\Delta E$.

## Candidate Selection
Three candidates were considered in `journal.md`:
1. *Spectrographic Glyph Decomposition (Candidate A)* — Selected for its pure DOM execution, novel color spaces, and physical optical dispersion model.
2. *CSS Grid Matrix Rearrangement (Candidate B)* — Rejected as a mechanical rearrangement puzzle rather than a continuous physical system.
3. *Web Speech API Synthesizer (Candidate C)* — Rejected due to headless environment voice synthesis unreliability.

## Technology
- **CSS Color Module Level 4:** Perceptually uniform `oklch(L C H)` color space declarations (`oklch(0.65 0.28 300)` through `oklch(0.68 0.28 25)`).
- **CSS Compositing & Blending:** `mix-blend-mode: screen` for additive optical light mixing.
- **CSS 3D Transforms:** Hardware-accelerated `translate3d` and `skewX` driven by time-varying ray incidence vectors.
- **Pure DOM Elements:** `<span>` and `<h1>` structural hierarchy with zero raster or vector canvas tags.

## Mechanism Graph
```text
7 SPECTRAL WAVEBANDS (λ = 400 nm TO 680 nm)
↓
CAUCHY DISPERSION EQUATION: n(λ) = 1.5046 + 0.0042 / λ²
↓
TIME-VARYING INCIDENCE ANGLE θ(t)
↓
WAVELENGTH-DEPENDENT VECTOR SHIFTS (Δx(λ), Δy(λ), shear(λ))
↓
HARDWARE-ACCELERATED CSS 3D TRANSFORMS ON DOM SPANS
↓
ADDITIVE SCREEN BLENDING IN OKLCH COLOR SPACE
↓
PRISMATIC CHROMATIC DECOMPOSITION OF "HELLO WORLD"
```

## Hello World Role
"HELLO WORLD" is the subject and optical substrate. The unperturbed white typographic baseline provides structural contrast, while the 7 spectral layers decompose and refract the characters into individual optical wavebands that recombine into legible white letterforms at convergence nodes.

## Design Signature
- **Typography:** Bold Swiss modernist sans-serif rendered at 6.5rem ($104\text{ px}$) with expansive letter-spacing.
- **Color:** Pure optical black substrate (`#05070a`), deep chamber backing (`#0d1117`), and 7 vivid OKLCH spectral primaries (violet, blue, cyan, green, yellow, orange, red).
- **Composition:** Asymmetric optical testing bench with vertical alignment calibration lines and bottom data colophon.
- **Material / Surface:** Optical laboratory prism chamber with faint calibration reticles.
- **Motion / Temporal Behavior:** Continuous fluid prismatic pulsation as optical incidence angle $\theta$ precesses through the crown glass medium.

## Implementation
- 7 distinct DOM `<span>` elements represent spectral wavebands across the visible spectrum.
- Each frame computes exact refractive indices $n(\lambda)$ and projects them into spatial offsets $\Delta x, \Delta y$.
- Additive blending reconstructs pure white text at the overlap center while leaving chromatic fringes along outer letter contours.

## Evidence
- **Automated Validation:** Passed `dependency-check` (zero external resources) and `verify`.
- **`verification.json` Metrics:**
  - Viewport: 1280 × 800
  - Graphics tags: 0 (Pure DOM verified)
  - Visible subject: "Hello World" verified visible and unoccluded
  - Cauchy refractive index: $n = 1.5203$
  - Peak dispersion offset: 21.16 px to 34.27 px
  - Chromatic $\Delta E$: 38.9 to 63.0
  - Zero permission escalations, zero errors.

## Visual Review
Visual inspection of `screenshot.png` and `screenshot-late.png`:
- "HELLO WORLD" is bold, sharp, and unmistakably visible in the center of the frame.
- Chromatic fringes cleanly illustrate Cauchy optical dispersion without muddiness.
- High-contrast additive lighting creates a clean aesthetic distinctly different from prior experiments.

## Problems and Fixes
- Fine-tuned layer blurring and blend modes to prevent clipping artifacts across container boundaries while keeping the core text legible.

## Complexity Review
The experiment completely eschews heavy graphic libraries, shaders, or canvas contexts, demonstrating high visual and mathematical sophistication using 100% native DOM and modern CSS features in under 200 lines of code.

## Limitations
Refraction is simulated through geometric affine displacement matrices rather than ray-traced volume caustic calculation.

## Result
Experiment 005 is complete, verified, and sealed as a breakthrough demonstration of pure DOM and modern CSS visual authorship.
