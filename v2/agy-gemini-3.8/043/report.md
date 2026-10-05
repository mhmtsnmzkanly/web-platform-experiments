# Experiment 043: CSS Container Style Queries Level 3

## Metadata
- **Experiment ID**: 043
- **Technology**: CSS Containment Level 3 Container Style Queries (`@container <name> style(--custom-property: value)`, `container-name: style-reactor`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 043 explores CSS Containment Module Level 3 Container Style Queries (`@container style(...)`), supported natively in Chromium 105+.

While Container Size Queries (`@container (min-width: ...)`) adapt descendant elements based on physical layout geometry, Container Style Queries allow descendants to evaluate the computed values of custom properties declared on ancestor containers. This decouples contextual theming, status variations, and UI component states from global class cascades and rigid DOM hierarchies.

The experiment implements:
1. **Container Declaration (`container-name: style-reactor`)**:
   - Three independent container zones (Chamber Alpha: Solar Fusion, Chamber Beta: Cryogenic Stasis, and Chamber Gamma: Quantum Flux) are designated as named style containers using `container-name: style-reactor`.
   - Each chamber defines distinctive CSS custom properties: `--reactor-theme: solar`, `--reactor-theme: cryogenic`, and `--reactor-theme: quantum`.
2. **Contextual Property Matching (`@container style-reactor style(--reactor-theme: ...)`)**:
   - Child components adapt styling without explicit modifier classes on every element.
   - The style query evaluates `--reactor-theme: cryogenic` on Chamber Beta to dynamically project an emissive cryogenic aesthetic (deep cyan borders, blue radial glow, and titanium card substrates).
3. **Primary Subject Elevation**:
   - The primary subject `<h1 id="subject-hello-world">Hello World</h1>` resides within Chamber Beta and is directly styled by `@container style-reactor style(--reactor-theme: cryogenic)`.
   - Its typography, contrast, color (`#ffffff`), and text-shadow (`0 0 16px rgba(0, 240, 255, 0.7)`) are driven entirely by the ancestor style query match.
4. **Style Query Telemetry**:
   - The telemetry deck displays the exact CSS `@container` query rule and runtime computed style measurements (`window.getComputedStyle(subject)`).

## Verification Summary
- **CDP Verification Script**: `./verify.sh 043/043.dev.html 043`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Computed Color**: `rgb(255, 255, 255)`
- **Text Shadow**: `rgba(0, 240, 255, 0.7) 0px 0px 16px`
- **Active Container Query**: `@container style-reactor style(--reactor-theme: cryogenic)` verified matching.
