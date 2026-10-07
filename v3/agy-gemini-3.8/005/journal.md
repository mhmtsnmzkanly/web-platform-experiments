# Journal — Experiment 005

## Candidate Exploration

### Candidate A — Spectrographic Glyph Decomposition & Cauchy Optical Dispersion (Pure DOM + OKLCH + 3D Matrices)
- **Mechanism:** Pure DOM and modern CSS architecture without Canvas or SVG graphics tags. "HELLO WORLD" is decomposed into discrete spectral optical wavebands ($\lambda_i \in [400\text{nm}, 700\text{nm}]$). Cauchy's dispersion equation ($n(\lambda) = n_0 + B/\lambda^2$) governs differential spatial offsets and refractive shearing via 3D CSS transforms and CSS custom properties. Overlapping spectral bands recombine via `mix-blend-mode: screen`, reconstituting pure white light at chromatic focal nodes.
- **Hello World Role:** Central optical subject undergoing chromatic decomposition and optical recombining.
- **Frontier Contribution:**
  - *Technology Integration:* Pure modern DOM layout engine, CSS Color Level 4 (`oklch()`), `mix-blend-mode`, 3D CSS transform matrices, and dynamic CSS custom property binding.
  - *Visual Authorship:* Swiss optical science editorial poster with vivid chromatic aberration and additive prism recombination on deep optical black.
  - *Evidence / Observability:* Computes Cauchy dispersion index, OKLCH spectral delta $E$, and computed bounding box channel offsets.
- **Novelty Risk:** Must avoid static decorative text shadows; the spectral separation must be a calculated physical Cauchy dispersion function.
- **Complexity Risk:** Managing blend mode compositing layers without GPU pipeline artifacts.
- **Visual Repetition Risk:** Zero graphics tags (`canvas` or `svg`), completely shifting medium away from previous canvas and vector experiments.

### Candidate B — CSS Grid Typographic Matrix Rearrangement
- **Mechanism:** Grid layout swapping letter cells.
- **Hello World Role:** Cell text.
- **Frontier Contribution:** CSS Grid, but visually looks like a tile puzzle.

### Candidate C — Web Speech API Phonetic Synthesizer
- **Mechanism:** Synthesizing speech via `speechSynthesis`.
- **Hello World Role:** Utterance string.
- **Frontier Contribution:** Web Speech.
- **Complexity Risk:** Chromium headless speech synthesis often lacks audio output or stalls without native OS voices installed.

## Selection Decision
Selected **Candidate A**.
It represents a major milestone in the run: achieving high mechanism depth and striking visual authorship using **pure DOM and modern CSS capabilities** alone, proving that advanced Web Platform experimentation does not depend exclusively on canvas or vector graphics.

## Implementation Plan
1. Construct layered DOM hierarchy with 7 distinct spectral waveband channels for "HELLO WORLD".
2. Implement Cauchy's dispersion law in JavaScript, dynamically injecting wavelength-dependent spatial shifts and OKLCH color parameters into CSS variables.
3. Apply `mix-blend-mode: screen` so decomposed colors additively reconstruct pure white light at optical nodes.
4. Expose `window.labReady` and `window.labEvidence` measuring Cauchy dispersion factor, spectral channel separation distance, and OKLCH hue coverage.

## Verification & Sealing
- Validated with `node tools.js dependency-check 005/005.dev.html` -> OK.
- Validated with `node tools.js verify 005/005.dev.html 005` -> OK.
- Verified 100% pure DOM execution (0 graphics elements), confirming subject visibility and Cauchy dispersion mathematics ($n = 1.5203$, peak offset >30 px).
- Visual review confirmed vivid prismatic chromatic aberration and additive white light recombination on optical black.
- Sealed `005/005.dev.html` -> `005/005.html`. Sealed artifact is immutable.
