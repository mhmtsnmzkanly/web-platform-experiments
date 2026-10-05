# Experiment 014: Shadow DOM v1 & Constructable Stylesheets

## Title
Shadow DOM v1 & Constructable Stylesheets Encapsulation Chamber

## Goal
Demonstrate modern Web Components primitives including autonomous Custom Elements (`customElements.define`), DOM encapsulation with Shadow DOM v1 (`attachShadow({ mode: 'open' })`), performant styling sharing via Constructable Stylesheets (`new CSSStyleSheet()`, `replaceSync()`, `adoptedStyleSheets`), and controlled external piercing via CSS Shadow Parts (`::part()`).

## Selected Idea
Cleanroom Cryogenic Specimen Chamber. The subject "Hello World" is encapsulated inside an autonomous custom element `<specimen-capsule>`, sealed within a Shadow DOM root. Scoped styling is delivered through programmatic constructable stylesheets linked via `shadowRoot.adoptedStyleSheets`, while the parent document adopts its own root constructable stylesheet and accesses the encapsulated headline across the boundary using `::part(capsule-heading)`.

## Technology
- Autonomous Custom Elements (`CustomElementRegistry`)
- Shadow DOM v1 (`Element.attachShadow({ mode: 'open' })`)
- Constructable Stylesheets API (`CSSStyleSheet`, `sheet.replaceSync()`, `document.adoptedStyleSheets`, `shadowRoot.adoptedStyleSheets`)
- CSS Shadow Parts Level 1 (`::part()`)
- Semantic HTML5 and Chrome DevTools Protocol telemetry

## Mechanism Signature
`Autonomous Custom Element + Shadow DOM v1 + Constructable Stylesheets (adoptedStyleSheets) + CSS ::part styling`

## Design Signature
- Typography: Heavy futuristic geometric sans (`-apple-system`, `BlinkMacSystemFont`, `sans-serif`) with intense bioluminescent glow; monospaced telemetry (`ui-monospace`, `"SF Mono"`, monospace)
- Color:
  - Cleanroom hull: Deep space obsidian (`#05080c`, `#090e15`)
  - Plasma glow: Electric cyan (`#00f2fe`), neon aqua (`#00ffaa`), deep cobalt (`#0072ff`)
  - Telemetry: Cool slate gray (`#5c708a`, `#7b94ad`), crisp luminous white (`#ffffff`, `#e2eaf5`)
- Composition: Horizontal cleanroom terminal hosting a central cylindrical cryogenic containment capsule with laser isolation barriers and telemetry status cards
- Material: Polished obsidian carbon shell, glowing plasma gas, and laser containment fields
- Motion: Static specimen display

## Implementation Summary
1. Created an autonomous custom element class `SpecimenCapsule` extending `HTMLElement`.
2. Created a programmatic constructable stylesheet (`capsuleStyleSheet`) via `new CSSStyleSheet()` and populated rules with `replaceSync()`.
3. Inside `SpecimenCapsule.connectedCallback`/constructor, attached an open shadow root and set `shadow.adoptedStyleSheets = [capsuleStyleSheet]`.
4. Rendered the encapsulated `<h1 class="capsule-title" part="capsule-heading">Hello World</h1>`.
5. Created a second constructable stylesheet for the host document (`docSheet`) and linked it via `document.adoptedStyleSheets = [docSheet]`.
6. Styled the encapsulated element from the outer document using `specimen-capsule::part(capsule-heading)`.

## Verification Evidence
- Automated verification command: `node tools.js verify 014/014.dev.html 014` exited with code `0` and returned `OK`.
- Telemetry measurements in `014/verification.json`:
  - `customElementDefined`: `true`
  - `hasShadowRoot`: `true`
  - `shadowMode`: `"open"`
  - `shadowAdoptedSheets`: `1`
  - `documentAdoptedSheets`: `1`
  - `encapsulatedText`: `"Hello World"`
- Visual review confirmed `014/screenshot.png`:
  - Encapsulated heading "HELLO WORLD" is prominently visible and intensely glowing within the cryogenic chamber.
  - Zero styling leakage outside the capsule.
  - Zero layout overflow, zero console issues, zero external network requests.

## Limitations
- Explores DOM and style encapsulation; does not utilize SVG filter displacement primitives. SVG Filter displacement maps (`feTurbulence`, `feDisplacementMap`) will be explored in Experiment 015.
