# Experiment 052: CSS Color Module Level 4 & 5 OKLCH Spectral Mixer

## Metadata
- **Experiment ID**: 052
- **Technology**: CSS Color Module Level 4 & 5 (`color-mix(in oklch, ...)`, `oklch(L C H)` color space, perceptual uniform interpolation)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 052 explores the CSS Color Module Level 4 & 5 specifications, implementing perceptual color space mixing and dynamic color gamut manipulation using native `oklch()` color definitions and the `color-mix()` functional notation.

Unlike legacy sRGB interpolation—which suffers from perceptual non-uniformity, hue shifts, and desaturated "gray dead zones" when blending complementary colors—the OKLCH color space models human visual perception with independent axes for Lightness ($L \in [0, 1]$), Chroma ($C \ge 0$), and Hue angle ($H \in [0, 360^\circ]$).

1. **Perceptual Color Blending (`color-mix(in oklch, ...)`):**
   - The central mixing engine generates real-time color transitions across polar coordinates:
     `--mix-result: color-mix(in oklch, var(--color-primary) var(--mix-ratio), var(--color-secondary));`
   - By specifying `in oklch`, color transitions preserve perceived brightness and chromatic saturation without intermediate mudiness.
2. **Quantized 11-Step Chromatic Ramp:**
   - A sequence of 11 swatches decomposes the continuous mixing curve into discrete 10% interpolation increments from 0% to 100%.
   - Each step demonstrates native declarative style declaration: `color-mix(in oklch, var(--color-primary) 70%, var(--color-secondary) 30%)`.
3. **Primary Subject Proscenium:**
   - The primary heading `<h1 id="subject-hello-world">Hello World</h1>` is dynamically illuminated using `color-mix(in oklch, var(--mix-result) 85%, white)` with multi-tiered glowing text shadows matching the mixed chrominance.
4. **Interactive Spectrophotometer Console:**
   - Interactive slider and preset buttons allow testing across various hue axes (Cyan/Magenta, Amber/Emerald, Solar/Violet), demonstrating wide-gamut reproduction directly in the browser engine.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 052/052.dev.html 052`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **ColorMix Supported**: `true`
- **OKLCH Supported**: `true`
- **Computed Value**: `oklch(0.75 0.24 262.5)`
- **Dynamic Mix Ratio**: `50%`
- **Subject Typography**: `72px` font size with perceptual drop shadows.
