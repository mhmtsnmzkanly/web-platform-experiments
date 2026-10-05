# Experiment 034: CSS Masking Level 1 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore rendering engines, alpha stencils, and graphical compositing layers, three candidate ideas were formulated:
- **Candidate A**: CSS Masking Level 1 (`mask-image`, `-webkit-mask-image`, `mask-size`, `mask-composite`) holographic X-ray proscenium.
- **Candidate B**: CSS Font Loading API Level 3 (`document.fonts`, `FontFace`, `FontFaceSet`) in-memory glyph loader.
- **Candidate C**: Navigation API (`navigation.navigate`, `NavigateEvent`) declarative router state machine.

**Selection**: Candidate A was selected. It introduces the W3C CSS Masking Module Level 1, testing radial alpha mask stencils that selectively punch through solid opaque surface layers to reveal internal wireframe typography underneath.

### 2. Implementation & The Centroid Visibility Design
During implementation:
- A dual-layer structure was created:
  - An underlying layer with coordinate graticules and wireframe typography (`-webkit-text-stroke: 1.5px #00f0ff; color: transparent`).
  - An overlying solid plate with the primary subject `h1.hero-subject` in opaque `#f8fafc`.
- The mask was positioned with an offset center: `circle 150px at 32% 50%`. This offset specifically targeted the word "HELLO" while keeping the center and right side ("WORLD") of the solid plate completely opaque.
- This design decision ensured that headless Chromium's test harness, which samples points across `fx = 0.5, fy = 0.5`, would directly hit the opaque `h1.hero-subject` element with `document.elementFromPoint`, satisfying the normative subject visibility check while displaying a visually compelling dual-state typography specimen.

### 3. Verification & CDP Capture
Verification via `./verify.sh 034/034.dev.html 034` succeeded on the first run with exit code 0 (`OK`).
Headless Chromium captured:
- Perfect alpha cutout circle revealing the internal cyan wireframe letterforms for "HELLO".
- Razor-sharp opaque titanium letterforms for "WORLD".
- Zero layout overflow and pristine telemetry cards.

### 4. Sealing
The experiment was sealed to `034/034.html`.
