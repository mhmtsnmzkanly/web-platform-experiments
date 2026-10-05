# Experiment 020: Pointer Events Level 3 & Pointer Capture Caliper

## Title
Pointer Events Level 3 & Hardware Pointer Capture Precision Vernier Caliper

## Goal
Demonstrate modern Pointer Events Level 3 hardware capture APIs (`setPointerCapture`, `hasPointerCapture`, `releasePointerCapture`), proving seamless continuous tracking of dragging gestures across element boundaries without coordinate loss or mouse detachment during rapid cursor deflection.

## Selected Idea
Precision Metrology Vernier Caliper. A brushed stainless steel industrial caliper gauge hosts the landmark subject "Hello World" atop an optical measurement bench. The user drags a movable vernier slide jaw across a 100mm graduated steel beam. On `pointerdown`, the slider executes `slider.setPointerCapture(e.pointerId)`, locking all subsequent pointer movement to the slide jaw. As the jaw translates, real-time millimeters and pixel displacements update on a high-contrast digital readout and the metrology state transitions into a calibrated lock.

## Technology
- Pointer Events Level 3 API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`)
- Hardware Pointer Capture (`Element.setPointerCapture()`, `Element.hasPointerCapture()`, `Element.releasePointerCapture()`)
- Semantic HTML5 structure (`<main>`, `<header>`, `<section>`, `<div role="slider">`, `<footer>`)
- Chrome DevTools Protocol drag gesture dispatch (`scenario.kind = 'drag'`, `deltaX: 280`)

## Mechanism Signature
`CDP drag gesture dispatch -> pointerdown hardware pointer capture -> continuous pointermove coordinate translation -> vernier index alignment -> illuminated calibrated Hello World lockup`

## Design Signature
- Typography: Classical Didone display serif (`"Didot"`, `"Bodoni MT"`, serif) with warm incandescent glow; high-precision digital gauge monospace (`ui-monospace`, `"SF Mono"`)
- Color:
  - Metrology void: Deep slate navy (`#0a0e17`, `#101624`)
  - Steel scale beam: Milled steel (`#1e293b`, `#334155`) with bright silver tick graduations (`#cbd5e1`)
  - Vernier jaw & laser: Incandescent amber (`#f59e0b`), ruby jewel index line (`#ef4444`), calibrated emerald (`#10b981`)
- Composition: Precision industrial vernier workbench with upper digital readout and lower graduated slide bed
- Material: Brushed stainless steel, ruby optical alignment jewel, and digital phosphor display
- Motion: Interactive continuous drag translation across graduated millimeter beam

## Implementation Summary
1. Built a metrology console featuring the illuminated `<h1 class="caliper-title" id="specimen-headline">Hello World</h1>` and a digital LED millimeter readout.
2. Formed a steel beam scale with 1mm minor and 5mm major graduations and numeric millimeter legends.
3. Created an interactive slider jaw `<div id="vernier-slider" role="slider">` with a central ruby indicator line.
4. Bound `pointerdown`: captured pointer ID with `slider.setPointerCapture(e.pointerId)` and updated active state.
5. Bound `pointermove`: calculated delta displacement relative to start position, clamped between 0 and 500px, updated `transform: translateX()`, and rendered computed millimeters.
6. Bound `pointerup` / `pointercancel`: released pointer capture and confirmed final calibrated displacement.

## Verification Evidence
- Automated verification command: `node tools.js verify 020/020.dev.html 020` returned exit code `0` and status `OK`.
- Telemetry measurements in `020/verification.json`:
  - `sliderDisplacementPx`: `280`
  - `calibratedMm`: `"28.00"`
  - `sliderStyleTransform`: `"translateX(280px)"`
  - `caliperTitleText`: `"Hello World"`
- Visual review confirmed `020/screenshot.png` and `020/screenshot-interaction.png`:
  - Before interaction: Slider positioned at 0 mm; readout indicates 00.00 mm UNCALIBRATED.
  - After interaction: Slider displaced 280px along the steel beam, aligning with the 28.00 mm mark, digital readout displaying 28.00 mm, status upgraded to CALIBRATED LOCK in glowing green.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores pointer capture and drag interaction; does not explore Web Cryptography hashing. Web Cryptography API (`crypto.subtle.digest`) will be explored in Experiment 021.
