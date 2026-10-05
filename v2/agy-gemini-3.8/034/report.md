# Experiment 034: CSS Masking Level 1 Holographic X-Ray Proscenium

## Overview
Experiment 034 explores the W3C CSS Masking Module Level 1 specification, demonstrating alpha-channel image masking (`mask-image`, `-webkit-mask-image`, `mask-size`, `mask-repeat`) to selectively punch through an opaque surface layer and reveal an underlying architectural substrate. The experiment models an industrial optical X-ray inspection proscenium where a monumental "Hello World" subject seamlessly transitions between solid opaque titanium letterforms and internal luminous cyan wireframe anatomy through a circular focal aperture.

## Technical Architecture & Mechanism
1. **Dual-Layer Anatomical Stacking**:
   - **Substrate Layer (Z: 1)**: Renders the internal cybernetic vector skeleton of "Hello World" using `-webkit-text-stroke: 1.5px #00f0ff; color: transparent;` against a cyan coordinate graticule grid.
   - **Surface Plate Layer (Z: 2)**: Renders the solid, opaque monumental typography (`color: #f8fafc; font-size: 82px; font-weight: 900;`) on a dark metallic titanium chassis.
2. **Radial Alpha Stencil Masking**:
   - The surface plate applies an inverted radial gradient mask:
     ```css
     mask-image: radial-gradient(circle 150px at 32% 50%, transparent 0%, transparent 85%, black 100%);
     -webkit-mask-image: radial-gradient(circle 150px at 32% 50%, transparent 0%, transparent 85%, black 100%);
     ```
   - In regions where the mask color is `transparent` ($\alpha = 0.0$), the browser compositor discards surface plate pixels, exposing the glowing wireframe letterforms underneath.
   - In regions where the mask color is `black` ($\alpha = 1.0$), the surface plate remains 100% opaque, displaying the solid white typography.
   - A feathered transition zone ($85\% \to 100\%$) provides continuous Hermite anti-aliasing across the aperture perimeter.
3. **CDP Centroid Hit Verification**:
   - Because the aperture focal center is positioned at $X = 32\%$, the subject's center coordinates at $X = 50\%$ reside within the fully opaque ($\alpha = 1.0$) shield region, allowing headless Chromium's `document.elementFromPoint(x, y)` to directly hit the primary `h1.hero-subject` element.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Static baseline verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: CSS Masking Level 1 radial-gradient alpha stencil aperture revealing underlying wireframe substrate
  - Measurements:
    - `hasRadialMask`: `true`
    - `apertureRadiusPx`: 150
    - `apertureCenterX`: `"32%"`
    - `apertureCenterY`: `"50%"`
    - `subjectComputedColor`: `"rgb(248, 250, 252)"`
    - `subjectFontSize`: `"82px"`

## Design Signature
- **Typography**: Ultra-bold geometric sans-serif (`-apple-system`, `Segoe UI`, `sans-serif`) for both solid surface typography and internal wireframe vector letterforms; high-precision monospaced typography (`SF Mono`, `Consolas`, monospace) for coordinate readouts and alpha transfer metrics.
- **Color**: Dark cybernetic palette—void navy (`#080b11`, `#0f141f`), bioluminescent cyan (`#00f0ff`, `#38bdf8`), titanium slate (`#161e2e`), and laser reticle cyan.
- **Composition**: Symmetrical proscenium chamber with an optical X-ray circular loupe at 32% width, supported by a 3-card diagnostics deck below.
- **Material**: Matte slate chassis, dashed circular reticle, glowing text-stroke wireframes, and linear alpha gradient ribbons.
- **Motion**: Static optical composite demonstrating hardware-accelerated Skia alpha stencil rendering.
