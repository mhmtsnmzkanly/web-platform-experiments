# Experiment 018: HTML Popover API Blueprint Table

## Title
HTML Popover API Architectural Blueprint Drafting Table

## Goal
Demonstrate the declarative HTML Living Standard Popover API (`popover="auto"`, `popovertarget`), leveraging browser-native Top Layer promotion, automatic backdrop rendering via `::backdrop`, and native light-dismissal behaviors without JavaScript modal state managers, z-index tricks, or event listeners.

## Selected Idea
Architectural Blueprint Table with Optical Drafting Loupe. An engineering blueprint sheet displays an elevation plan with the initial "Hello World" primary lockup and a declarative button `<button popovertarget="specimen-loupe">`. Upon user click, the browser natively promotes `#specimen-loupe` to the Top Layer, activates `:popover-open`, blurs the underlying blueprint table with `::backdrop`, and displays a magnified optical inspection loupe presenting "Hello World" in golden Didone typography.

## Technology
- HTML Living Standard Popover API (`popover="auto"`, `popovertarget`)
- CSS `:popover-open` pseudo-class
- CSS `::backdrop` pseudo-element with `backdrop-filter: blur()`
- Declarative user-activation triggering
- Chrome DevTools Protocol trusted click dispatch (`scenario.kind = 'click'`)

## Mechanism Signature
`Declarative button[popovertarget] click -> browser native popover="auto" top layer elevation -> :popover-open activation -> floating blueprint Hello World loupe`

## Design Signature
- Typography: Technical drafting monospace (`ui-monospace`, `"SF Mono"`, monospace) and heavy engineering sans-serif on the blueprint; classical high-contrast serif (`"Didot"`, `"Bodoni MT"`, serif) inside the magnified optical loupe
- Color:
  - Blueprint sheet: Architectural drafting navy (`#071326`, `#0b1e3d`) with cyan grid lines (`rgba(56, 189, 248, 0.22)`)
  - Loupe overlay: Deep navy glass (`#08162d`), drafting amber border (`#f59e0b`), illuminated white glyphs (`#ffffff`)
  - Typography: Blueprint cyan (`#38bdf8`), pencil graphite (`#7aa5d2`), crisp white (`#f8fafc`)
- Composition: Precision technical blueprint sheet with grid graticules, title block, and floating drafting loupe popover elevated into the Top Layer
- Material: Heavy blueprint paper and optical acrylic drafting loupe
- Motion: Instantaneous declarative top-layer elevation

## Implementation Summary
1. Declared an architectural drawing workspace containing `<h1 class="plan-title" id="primary-heading">Hello World</h1>`.
2. Created a native trigger `<button id="drafting-trigger" popovertarget="specimen-loupe">`.
3. Created the popover target element `<div id="specimen-loupe" popover="auto">` containing the magnified inspection lockup.
4. Styled `#specimen-loupe` with fixed centered positioning, amber border, and `::backdrop` radial blur.
5. Configured CDP scenario `{ kind: 'click', selector: '#drafting-trigger' }` to test declarative activation.
6. Registered `window.labInteractionEvidence` hook verifying `:popover-open` pseudo-class match and dimension metrics.

## Verification Evidence
- Automated verification command: `node tools.js verify 018/018.dev.html 018` returned exit code `0` and status `OK`.
- Telemetry measurements in `018/verification.json`:
  - `popoverOpen`: `true`
  - `popoverAttribute`: `"auto"`
  - `triggerTarget`: `"specimen-loupe"`
  - `loupeRectWidth`: `680`
  - `loupeRectHeight`: `280`
- Visual review confirmed `018/screenshot.png` and `018/screenshot-interaction.png`:
  - Initial state displays pristine blueprint elevation drawing.
  - Interactive state displays the top-layer optical loupe elevated with rich amber glow and backdrop blur, focusing on "Hello World".
  - Zero layout overflow, zero console warnings, zero external requests.

## Limitations
- Explores declarative Popover API; does not utilize CSS Anchor Positioning API for tethering. CSS Anchor Positioning (`anchor-name`, `position-anchor`, `anchor()`) will be explored in Experiment 019.
