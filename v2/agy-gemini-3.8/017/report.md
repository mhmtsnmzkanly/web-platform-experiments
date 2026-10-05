# Experiment 017: CSS Scroll-driven Animations Astrolabe Observatory

## Title
CSS Scroll-driven Animations Astrolabe Observatory

## Goal
Demonstrate modern CSS Scroll-driven Animations Level 1, tying declarative CSS keyframe animations directly to container scroll progression via `scroll-timeline` (`animation-timeline: --astrolabe-timeline`), executing buttery-smooth rotational and luminous transit transitions entirely on the browser's compositor thread without JavaScript scroll listeners.

## Selected Idea
Astronomical Astrolabe Observatory. An interactive celestial transit tracker where concentric astrolabe alignment rings and a monumental "Hello World" lockup are linked to a native scroll container via CSS Scroll-driven Animations. When mouse wheel scrolling occurs, the compositor advances the scroll timeline: the inner, middle, and outer brass rings rotate in opposing celestial arcs, the heading scales into focal alignment, and the radiant golden corona flares upon reaching the meridian transit.

## Technology
- CSS Scroll-driven Animations Module Level 1
- `scroll-timeline-name: --astrolabe-timeline` / `scroll-timeline-axis: block`
- `animation-timeline: --astrolabe-timeline`
- CSS Sticky Positioning (`position: sticky`)
- Chrome DevTools Protocol mouseWheel interaction dispatch (`scenario.kind = 'scroll'`)

## Mechanism Signature
`CDP mouseWheel scroll dispatch -> scroll container deflection -> CSS scroll() timeline progression -> synchronized scale/rotation/chromatic convergence -> locked Hello World specimen`

## Design Signature
- Typography: Classical astronomical Didone display serif (`"Didot"`, `"Bodoni MT"`, `"Playfair Display"`, serif) with astronomical monospaced telemetry (`ui-monospace`, `"SF Mono"`)
- Color:
  - Deep space void: Midnight obsidian (`#030408`, `#05070f`, `#090d1c`)
  - Stellar instruments: Celestial brass gold (`#d4af37`), muted gold (`#7d6520`), astral cyan (`#38bdf8`)
  - Typography: Incandescent star white (`#ffffff`, `#f8fafc`) with golden corona
- Composition: Observatory console with celestial reticle rings, horizontal meridian crosshair, and telemetry readouts
- Material: Brass instrument gears, dark glass celestial dome, and luminous starlight
- Motion: Scroll-driven compositor keyframe interpolation (0 to 180 degrees counter-rotations and flare scale)

## Implementation Summary
1. Configured an internal scroll container `#scroll-track` with `scroll-timeline: --astrolabe-timeline block`.
2. Created a sticky viewport `.sticky-astrolabe` housing three concentric celestial rings (`.ring-outer`, `.ring-middle`, `.ring-inner`), the meridian crosshair, and the headline lockup.
3. Bound CSS animations to `--astrolabe-timeline`:
   - `.ring-outer` and `.ring-inner`: `animation: rotate-clockwise 1s linear both; animation-timeline: --astrolabe-timeline;`
   - `.ring-middle`: `animation: rotate-counter 1s linear both; animation-timeline: --astrolabe-timeline;`
   - `.headline-wrap`: `animation: transit-convergence 1s linear both; animation-timeline: --astrolabe-timeline;`
4. Provided a 900px scroll spacer inside the track to establish a deep scroll range.
5. Automated interactive verification via CDP `Input.dispatchMouseEvent` with `type: 'mouseWheel'` and `deltaY: 500`.

## Verification Evidence
- Automated verification command: `node tools.js verify 017/017.dev.html 017` exited with code `0` and status `OK`.
- Telemetry measurements in `017/verification.json`:
  - `scrollTop`: `500`
  - `maxScroll`: `844`
  - `progressPercent`: `59.2%`
  - `rotationDegrees`: `106.6 DEG`
  - `timelineProperty`: `"--astrolabe-timeline"`
  - `animations[0].timeline`: `"ScrollTimeline"`
  - `animations[0].currentTime`: `59.24`
- Visual review confirmed `017/screenshot.png` and `017/screenshot-interaction.png`:
  - Initial state displays astrolabe rings at 0 degrees and progression at 0.00%.
  - Post-interaction state reveals rings rotated through 106.6 degrees, scroll thumb advanced, telemetry status upgraded to "MERIDIAN TRANSIT", and the glowing "HELLO WORLD" headline enlarged and ignited with solar flare illumination.
  - Zero layout overflow, zero console errors, zero external dependencies.

## Limitations
- Explores scroll-driven compositor animation; does not utilize declarative Popover API. Popover API (`popover="auto"`, `popovertarget`) will be explored in Experiment 018.
