# Experiment 030: CSS Compositing & Blending Level 1 Chromatic Proof

## Overview
Experiment 030 explores the W3C Compositing and Blending Level 1 specification, implementing native browser per-pixel blend transfer equations (`mix-blend-mode: difference`, `multiply`, and `screen`), multi-layer background blending (`background-blend-mode`), and isolated stacking contexts (`isolation: isolate`). The experiment models a high-precision prepress lithography and optical proofing folio, demonstrating how overlapping process color plates interact mathematically through the browser's hardware-accelerated compositor pipeline.

## Technical Architecture & Mechanism
1. **Isolated Stacking Context (`isolation: isolate`)**:
   - The central compositing chamber establishes an isolated blending group via `isolation: isolate`.
   - By creating a boundary for backdrop root computation, blend modes applied to internal elements calculate color transfer functions strictly against the chamber's local backdrop, preventing blend bleeding into the external folio canvas.
2. **Optical Difference Inversion ($C_m = |D_c - S_c|$)**:
   - The primary subject (`<h1 class="hero-master-subject" id="subject-hello-world">Hello World</h1>`) is styled with `mix-blend-mode: difference; color: #ffffff;`.
   - The chamber floor is bisected into a carbon negative field (`#0c0e12`) and a titanium positive field (`#ffffff`).
   - Over the dark background ($D_c \approx 0$), the formula yields $C_m = |0 - 1| = 1$ (luminous white).
   - Over the bright background ($D_c = 1$), the formula yields $C_m = |1 - 1| = 0$ (optical carbon black).
3. **Subtractive and Additive Color Synthesis**:
   - **Subtractive Multiply ($C_m = S_c \times D_c$)**: Overlapping Cyan, Magenta, and Yellow circular plates on a white ground multiply their transmittance, synthesizing pure Key Black where all three intersect.
   - **Additive Screen ($C_m = 1 - (1 - S_c)(1 - D_c)$)**: Overlapping Red, Green, and Blue emissive disks on an obsidian ground sum their luminance, synthesizing pure peak white at their common intersection.
4. **Registration Offset Plates**:
   - High-contrast chromatic ghost plates in Cyan (`#00f0ff`) and Magenta (`#ff007f`) with subpixel coordinate shifts ($\pm 5\text{px} \, \Delta X$, $\pm 3\text{px} \, \Delta Y$) simulate prepress plate misregistration fringes using `mix-blend-mode: screen`.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Automated verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: CSS Compositing and Blending Level 1 isolated stacking context with difference, multiply, and screen transfer equations
  - Measurements:
    - `chamberIsolation`: `"isolate"`
    - `subjectMixBlendMode`: `"difference"`
    - `subtractiveMixBlendMode`: `"multiply"`
    - `additiveMixBlendMode`: `"screen"`
    - `ribbonLeftBackgroundBlend`: `"screen, screen, normal"`
    - `ribbonRightBackgroundBlend`: `"multiply, multiply, normal"`

## Design Signature
- **Typography**: Monumental ultra-bold sans-serif (`Impact`, system grotesque) for the central "Hello World" subject; technical monospaced typography (`SF Mono`, `Consolas`, monospace) for density scales, transfer formulas, and registration telemetry.
- **Color**: Archival prepress sheet (`#f2f1ec`), process Cyan (`#00f0ff`), process Magenta (`#ff007f`), process Yellow (`#ffe600`), and carbon black (`#11141a`).
- **Composition**: Prepress proofing folio with 4-channel CMYK halftone density wedge strips at the top, a split-ground optical compositing chamber in the center, and tripartite scientific blend mode synthesis panels at the bottom.
- **Material**: Matte coated paper texture graticule, optical glass reticle, and fine registration crosshairs.
- **Motion**: Static optical specimen capturing pure hardware compositor blend state.
