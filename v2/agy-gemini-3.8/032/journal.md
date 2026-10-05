# Experiment 032: CSS Cascade Layers Level 1 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore stylesheet architecture, cascade mechanics, and specificity resolution, three candidate ideas were formulated:
- **Candidate A**: CSS Cascading & Inheritance Level 5 (`@layer`, `CSSLayerBlockRule`) specificity inversion matrix.
- **Candidate B**: Intersection Observer API Level 2 (`IntersectionObserver`, multi-thresholds, `rootBounds`, `intersectionRatio`) optical focal aperture.
- **Candidate C**: CSS Masking Level 1 (`mask-image`, `mask-composite`) holographic X-ray proscenium.

**Selection**: Candidate A was selected. It introduces modern CSS Cascade Layers, highlighting how layer declaration order fundamentally overturns classical CSS specificity algorithms (allowing lower-specificity rules in later layers to override higher-specificity ID selectors in earlier layers).

### 2. Implementation & The Specificity Inversion Setup
During implementation:
- An explicit declaration `@layer reset, tokens, architecture, typography, components, stateOverrides;` was placed at the top of the stylesheet.
- An ID selector `#subject-hello-world` with specificity tuple `(1, 0, 0)` was declared in `@layer architecture`, styling the text red at 32px.
- Subsequent layers (`typography`, `components`, `stateOverrides`) declared lower-specificity rules (`(0, 1, 1)` and `(0, 1, 0)`), progressively adjusting the style.
- `@layer stateOverrides` declared `.hero-subject` with specificity `(0, 1, 0)` at 74px in white (`#f8fafc`).
- In addition, runtime JavaScript was written to inspect `document.styleSheets[0].cssRules` via CSSOM, detecting `CSSLayerBlockRule` objects and dynamically populating the detected layer count.

### 3. Verification & CDP Capture
Verification via `./verify.sh 032/032.dev.html 032` passed on the first run with exit code 0 (`OK`).
Headless Chromium captured:
- Perfect 74px `#f8fafc` text rendering matching `@layer stateOverrides`.
- Primary subject `Hello World` identified and confirmed visible in `h1.hero-subject`.
- CSSOM inspection confirmed all 6 layers recognized.
- Visual review confirmed clean Bauhaus-inspired layout, sharp typography, and zero layout overflow.

### 4. Sealing
The experiment was sealed to `032/032.html`.
