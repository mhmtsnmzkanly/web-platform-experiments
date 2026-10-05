# Experiment 049: CSS Motion Path Module Level 1

## Metadata
- **Experiment ID**: 049
- **Technology**: CSS Motion Path Module Level 1 (`offset-path: path(...)`, `offset-distance`, `offset-rotate: auto`, `offset-anchor`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 049 implements an orbital trajectory cartography and satellite constellation system using native CSS Motion Path Module Level 1 primitives.

CSS Motion Path enables declarative, curvilinear positioning and tangential orientation along arbitrary 2D vector splines directly in stylesheet declarations:
1. **Parametric Vector Trajectory (`offset-path: path(...)`)**:
   - A closed cubic Bézier ellipse (`M 120,230 C 120,80 920,80 920,230 C 920,380 120,380 120,230 Z`) establishes the master orbital path.
   - An identical SVG guide track is rendered behind the satellites to visually verify subpixel tracking alignment.
2. **Arc Length Parameterization (`offset-distance`)**:
   - Four independent satellite nodes (`SAT-α`, `SAT-β`, `SAT-γ`, `SAT-δ`) are distributed along the spline at exact parametric intervals (`12.5%`, `37.5%`, `62.5%`, `87.5%`).
3. **Automatic Tangential Rotation (`offset-rotate: auto`)**:
   - The browser automatically derives the derivative tangent vector at each point along the cubic curve, rotating the satellite containers to match the flight vector without manual trigonometric transforms.
4. **Primary Typographic Attractor**:
   - The central celestial mass hosts `<h1 id="subject-hello-world">Hello World</h1>`, styled with deep cyan illumination (`text-shadow: 0 0 24px rgba(0, 240, 255, 0.4)`), serving as the focal coordinate origin for the orbital system.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 049/049.dev.html 049`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **CSS Motion Path Supported**: `true`
- **Constellation Count**: `4 Satellites`
- **Sat Alpha Position**: `(358px, 179px)`
- **Sat Beta Position**: `(794px, 179px)`
- **Rotation Mode**: `auto (Tangential)`
