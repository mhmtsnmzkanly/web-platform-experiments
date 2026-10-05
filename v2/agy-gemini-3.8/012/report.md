# Experiment 012: HTML <dialog> Element & Native Top Layer Promotion

## Title
HTML <dialog> Element & Native Top Layer Promotion

## Goal
Explore the HTML Living Standard `<dialog>` element and the browser's native Top Layer rendering stack, demonstrating programmatic modal promotion via `dialog.showModal()`, viewport dimming via `::backdrop`, and modal focus isolation without JavaScript z-index manipulation or external modal libraries.

## Selected Idea
Theatrical Stage Proscenium Spotlight. Initial state displays a dimmed backstage call board with the standby greeting. When triggered via trusted user interaction on the brass cue button, `dialog.showModal()` is invoked. The browser natively elevates the proscenium dialog into the Top Layer, dims and blurs the background through `::backdrop`, and illuminates "Hello World" in glowing champagne and neon coral.

## Technology
- HTML Living Standard `<dialog>` element (`showModal()`, `:modal` pseudo-class)
- CSS `::backdrop` pseudo-element (radial gradient and `backdrop-filter: blur()`)
- Chrome DevTools Protocol trusted click dispatch (`Input.dispatchMouseEvent`)
- Semantic HTML5

## Mechanism Signature
`Trusted user activation -> dialog.showModal() top layer elevation -> ::backdrop viewport illumination -> foregrounded Hello World spotlight`

## Design Signature
- Typography: Backstage industrial sans transitioning to modern theatrical display serif (`"Didot"`, `"Georgia"`, serif)
- Color:
  - Initial backstage: Obsidian charcoal (`#0a0b0e`), antique brass (`#c99a3e`), pewter (`#5a5f6e`)
  - Elevated modal: Midnight velvet (`#140d24`), neon coral (`#ff4d5a`), incandescent champagne (`#fff0db`)
- Composition: Central proscenium modal elevated into browser top layer with radial backdrop
- Material: Deep velvet stage drapery with glowing spotlight glass
- Motion: Instantaneous top-layer modal elevation

## Implementation Summary
The markup contains an initial backstage display with an accessible `h1.stage-title` and a `<button id="cue-button">`. An unrendered `<dialog id="proscenium-modal">` sits in the DOM. Upon click:
- `dialog.showModal()` is invoked.
- The browser elevates `#proscenium-modal` into the Top Layer.
- `dialog::backdrop` renders an 8px blurred radial vignette across the entire 1280x800 viewport.
- The modal frame displays the spotlighted `h1.spotlight-title` reading "Hello World".

## Architectural Decisions
- Used the native `<dialog>` element rather than `<div>` overlays with `position: fixed` and arbitrary `z-index: 999999`. The Top Layer sits in an isolated rendering plane above the document root.
- Maintained a visible baseline greeting in the initial state so DOM visibility checks pass both prior to and following the interaction.
- Verified top-layer state via `window.labInteractionEvidence()`, asserting `dialog.open === true` and `dialog.matches(':modal') === true`.

## Verification Evidence
- Automated verification command: `node tools.js verify 012/012.dev.html 012` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Trusted interaction: CDP mouse click dispatched on `#cue-button`.
- Runtime evidence: `dialogOpen: true`, `matchesModalPseudo: true`, `modalWidth: 760px`, `modalHeight: 232px`.

## Visual Evidence & Review
- Screenshots captured: `012/screenshot.png` and `012/screenshot-interaction.png`.
- Visual review confirmed:
  - Before state shows dimmed backstage auditorium.
  - After state shows native `::backdrop` blur and glowing coral proscenium modal promoting "Hello World" into unmistakable foreground focus.

## Limitations
- Modal dialog interaction; does not explore native text segmentation or linguistic boundary analysis. Intl.Segmenter will be explored in Experiment 013.
