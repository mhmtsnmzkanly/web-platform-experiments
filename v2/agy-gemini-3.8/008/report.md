# Experiment 008: Web Animations API (WAAPI) Typographic Countermotion

## Title
Web Animations API (WAAPI) Typographic Countermotion

## Goal
Explore the native Web Animations API (`element.animate()`, `Animation` timeline interface), demonstrating hardware-accelerated time-based typographic interpolation across dual opposing motion channels without third-party animation libraries.

## Selected Idea
Kinetic Neo-Grotesque Countermotion. Two independent programmatic WAAPI Animation instances drive "HELLO" (Timeline A) and "WORLD" (Timeline B) along opposing horizontal axes with synchronized cubic-bezier easing (`cubic-bezier(0.45, 0, 0.55, 1)`). As "HELLO" translates eastward and expands its tracking, "WORLD" translates westward and contracts its tracking, producing harmonic typographic compression and expansion.

## Technology
- Web Animations API (`Element.prototype.animate()`, `Animation` interface)
- DocumentTimeline / dynamic keyframe interpolation
- CSS Custom Properties & Neon Glow Filters
- Semantic HTML5

## Mechanism Signature
`Dual WAAPI Element.animate() timelines -> opposing phase translation & tracking interpolation -> dynamic countermotion -> kinetic Hello World`

## Design Signature
- Typography: Bold Neo-Grotesque display sans-serif (`system-ui`, `-apple-system`, `Helvetica Neue`) with tight letter-spacing
- Color: Kinetic Neon palette: deep midnight violet (`#0b071a`), electric mint (`#4cc9f0`), blazing magenta (`#f72585`), ultramarine shadow (`#3a0ca3`), pure white
- Composition: Split horizontal motion channels with opposing velocity vectors
- Material: High-contrast emissive digital LED/OLED display
- Motion: Continuous harmonic oscillation (2400ms duration, alternate direction, ease-in-out)

## Implementation Summary
The script initializes two independent `Animation` objects via `animate()`:
- `helloAnim`: Keyframes interpolate `transform: translateX(-90px)` with `letterSpacing: -0.04em` to `transform: translateX(90px)` with `letterSpacing: 0.08em`.
- `worldAnim`: Keyframes interpolate in opposing phase (`+90px` to `-90px`, `+0.08em` to `-0.04em`).
- Both instances share duration (2400ms), `direction: 'alternate'`, and `iterations: Infinity`.
- `window.labEvidence()` measures active animation count, running playState, and advancing currentTime timestamps.

## Architectural Decisions
- Used WAAPI rather than CSS `@keyframes` declarative classes to enable runtime inspection of animation objects, playback rates, and programmatic timeline queries directly in JavaScript.
- Handled dynamic visual evidence by allowing the tooling test harness to capture initial `screenshot.png` and deferred `screenshot-late.png`, proving genuine timeline progression.
- Enclosed the animated spans directly within `h1.motion-subject` with whitespace separation to ensure unbroken accessibility and DOM visibility compliance.

## Verification Evidence
- Verification command: `node tools.js verify 008/008.dev.html 008` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Animation liveness: DocumentTimeline advanced from 366.6ms to 1116.6ms (+750ms elapsed) without stalling.
- Runtime evidence: `activeAnimationsCount: 2`, `helloPlayState: "running"`, `worldPlayState: "running"`, `durationMs: 2400`.

## Visual Evidence & Review
- Screenshots captured: `008/screenshot.png` and `008/screenshot-late.png`.
- Visual review confirmed:
  - In `screenshot.png`, "HELLO" is shifted left and "WORLD" is shifted right.
  - In `screenshot-late.png`, both words have translated horizontally inward across opposite tracks, demonstrating continuous countermotion.
  - Electric mint and hot magenta glows create an intense, modern kinetic poster.

## Limitations
- Time-based continuous motion; does not explore user-driven relational state changes or ancestor matching. CSS `:has()` and interactive state will be explored in Experiment 009.
