# Experiment 045: W3C Screen Orientation API Avionics Horizon

## Metadata
- **Experiment ID**: 045
- **Technology**: W3C Screen Orientation API (`screen.orientation`, `screen.orientation.type`, `screen.orientation.angle`, `screen.orientation.onchange`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 045 implements an avionics Primary Flight Display (PFD) and Attitude Director Indicator (ADI) driven natively by the W3C Screen Orientation API.

The Screen Orientation API provides runtime introspection into physical device orientation and viewport rotation dynamics:
1. **Orientation Vector Telemetry**:
   - `screen.orientation.type` reports whether the display is operating in `landscape-primary`, `portrait-primary`, `landscape-secondary`, or `portrait-secondary`.
   - `screen.orientation.angle` delivers the discrete clockwise rotation angle in degrees relative to the natural orientation (`0°`, `90°`, `180°`, `270°`).
2. **Attitude Horizon Integration**:
   - The artificial horizon gyroscope sphere reflects orientation pitch and roll dynamics, with cyan sky and earth terrain split across the horizontal datum.
   - Flanking flight director wings (`director-wing`) and airspeed/altimeter instrument tapes complete the avionics cockpit environment.
3. **Primary Subject Flight Director**:
   - Centered directly on the horizon focal point is `<h1 id="subject-hello-world">Hello World</h1>`, styled with cyan luminescence (`text-shadow: 0 0 20px rgba(0, 240, 255, 0.8)`).
   - All reticles and decorative flight director elements use `pointer-events: none` to preserve hit-testing centroid fidelity.
4. **Orientation Event Binding**:
   - `screen.orientation.addEventListener('change', ...)` listens for hardware gyroscopic rotation events, dynamically reorienting the attitude display and refreshing telemetry cards.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 045/045.dev.html 045`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Orientation Type**: `landscape-primary`
- **Rotation Angle**: `0°`
- **Display Dimensions**: `800 × 600`
- **Viewport Dimensions**: `1280 × 800`
