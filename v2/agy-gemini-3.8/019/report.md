# Experiment 019: CSS Anchor Positioning Survey Theodolite

## Title
CSS Anchor Positioning API Cartographic Survey Theodolite

## Goal
Demonstrate modern CSS Anchor Positioning Module Level 1 (`anchor-name`, `position-anchor`, `anchor()`), tethering independently declared, decoupled sibling DOM elements directly to an immovable coordinate landmark anchor across the layout plane without JavaScript offset recalculations, wrapper hierarchies, or manual coordinate math.

## Selected Idea
Geodetic Triangulation Station & Surveyor Theodolite. The monumental subject "Hello World" serves as the primary geodetic benchmark landmark, declaring `anchor-name: --monument-datum`. Multiple decoupled DOM elements—a top-aligned azimuth theodolite reticle, a bottom-aligned altitude telemetry bar, and corner survey pins—are positioned absolutely with `position-anchor: --monument-datum` and tethered using `anchor(top)`, `anchor(bottom)`, `anchor(left)`, and `anchor(right)`.

## Technology
- CSS Anchor Positioning Module Level 1
- Anchor registration: `anchor-name: --monument-datum`
- Anchor consumption: `position-anchor: --monument-datum`
- Anchor coordinate functions: `anchor(top)`, `anchor(bottom)`, `anchor(left)`, `anchor(right)`, `anchor(center)`
- Semantic HTML5 structure (`<main>`, `<header>`, `<section>`, `<aside>`, `<footer>`)
- Chrome DevTools Protocol telemetry inspection

## Mechanism Signature
`Declaration of anchor-name on typographic landmark -> decoupled DOM callout tethered via position-anchor -> dynamic anchor() coordinate resolution -> surveyor reticle Hello World lockup`

## Design Signature
- Typography: Heavy industrial geometric sans (`-apple-system`, `BlinkMacSystemFont`, `sans-serif`) with emerald laser glow; technical surveyor monospace (`ui-monospace`, `"SF Mono"`)
- Color:
  - Triangulation void: Deep survey navy (`#070e1c`, `#0d1a33`)
  - Laser grid: Precision emerald graticule (`rgba(16, 185, 129, 0.12)`, `rgba(16, 185, 129, 0.28)`)
  - Theodolite accents: Surveyor brass (`#f59e0b`), neon emerald (`#10b981`), titanium white (`#ffffff`, `#f8fafc`)
- Composition: Precision cartographic triangulation sheet with graticule grid lines, centered geodetic monument box, and four decoupled tethered instrument callouts
- Material: Dark glass survey console, illuminated emerald lasers, and brass optical verniers
- Motion: Static specimen display

## Implementation Summary
1. Defined the central landmark element `.datum-monument` containing the heading `<h1 id="primary-anchor">Hello World</h1>`, registered as `anchor-name: --monument-datum`.
2. Created decoupled sibling elements in the DOM:
   - `<aside class="anchored-theodolite-reticle">`: Positioned with `bottom: anchor(top); left: anchor(center); transform: translate(-50%, -18px);`
   - `<aside class="anchored-altitude-telemetry">`: Positioned with `top: anchor(bottom); left: anchor(center); transform: translate(-50%, 18px);`
   - `<div class="anchored-pin-nw">`: Positioned with `bottom: anchor(top); right: anchor(left); transform: translate(-14px, -14px);`
   - `<div class="anchored-pin-se">`: Positioned with `top: anchor(bottom); left: anchor(right); transform: translate(14px, 14px);`
3. Provided `window.labEvidence` verifying that the top reticle is strictly above the datum box, the telemetry bar is strictly below, and `CSS.supports("top", "anchor(bottom)")` evaluates to true.

## Verification Evidence
- Automated verification command: `node tools.js verify 019/019.dev.html 019` returned exit code `0` and status `OK`.
- Telemetry measurements in `019/verification.json`:
  - `cssAnchorSupported`: `true`
  - `reticlePositionAnchor`: `"--monument-datum"`
  - `anchorTop`: `269.5`
  - `anchorBottom`: `513.5`
  - `reticleBottom`: `251.5` (precisely above anchor top)
  - `telemetryTop`: `531.5` (precisely below anchor bottom)
- Visual review confirmed `019/screenshot.png`:
  - Clear visual balance with generous clearance between the monument box and the anchored callouts.
  - Emerald illuminated "HELLO WORLD" headline serves as unmistakable focal anchor.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores CSS Anchor Positioning; does not explore low-level Pointer Events drag with hardware pointer capture. Pointer Events Level 3 (`setPointerCapture`) will be explored in Experiment 020.
