# Experiment 009: CSS :has() Relational Stencil & Interactive Registration

## Title
CSS :has() Relational Stencil & Interactive Registration

## Goal
Explore the CSS Selectors Level 4 `:has()` relational pseudo-class in conjunction with native unscripted interactive form controls (`<input type="checkbox">`), demonstrating how ancestor styling and global custom property tokens can be instantaneously transformed without JavaScript class toggling or state-management frameworks.

## Selected Idea
Risograph Print Stencil Press. Initial state represents a monochrome raw kraft paper proof. When a user interacts with the native toggle lever, the ancestor container `.print-bed:has(#plate-toggle:checked)` activates, dynamically reassigning CSS custom properties. The design inverts into a two-color overprinted Risograph poster with hot fluorescent pink and solar canary yellow plates, mechanical registration offsets, and screen blend modes.

## Technology
- CSS Selectors Level 4 (`:has()` relational pseudo-class, `:checked` pseudo-class)
- Native HTML `<input type="checkbox">` and `<label>` binding
- CSS Custom Properties (dynamic token recalculation)
- Chrome DevTools Protocol trusted click dispatch (`Input.dispatchMouseEvent`)
- Semantic HTML5

## Mechanism Signature
`Native checkbox input -> CSS :has(:checked) relational ancestor matching -> dual-plate registration shift & chromatic inversion -> transformed Hello World`

## Design Signature
- Typography: Heavy brutalist display sans-serif (`Arial Black`, `Impact`, sans-serif) with tight tracking
- Color:
  - Initial state: Raw kraft paper (`#eae4d6`), carbon black ink (`#181716`), muted zinc (`#78736a`)
  - Engaged state: Midnight indigo (`#0f0720`), hot fluorescent pink (`#ff0055`), solar canary yellow (`#ffee00`)
- Composition: Mechanical screen-print bed with perimeter crosshairs and registration registration marks
- Material: Heavy fibrous risograph stencil paper with mechanical ink offset
- Motion: Instantaneous mechanical state transition

## Implementation Summary
The HTML declares an `<input type="checkbox" id="plate-toggle">` positioned within `.print-bed`. A visible `<label for="plate-toggle">` provides the trusted click target.
When `:checked`, the selector `.print-bed:has(#plate-toggle:checked)` overrides custom properties:
- `--bg-bed: #0f0720`
- `--color-hello: #ff0055` (displaced by `-8px, -6px`)
- `--color-world: #ffee00` (displaced by `8px, 6px`)
- `--blend-mode: screen`
The headline elements `.plate-hello` and `.plate-world` instantaneously receive new colors and mechanical registration offsets.

## Architectural Decisions
- Used pure native CSS `:has(:checked)` rather than JavaScript `.classList.toggle('active')`. The styling pipeline is entirely declarative and reactive to browser form state.
- Automated testing via CDP trusted click (`window.labScenario = { kind: 'click', selector: '#action-lever' }`), verifying that native event bubbling triggers the layout update.
- Captured deterministic before-and-after visual evidence (`screenshot.png` and `screenshot-interaction.png`).

## Verification Evidence
- Verification command: `node tools.js verify 009/009.dev.html 009` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Trusted interaction: CDP mouse click dispatched successfully on `#action-lever`.
- Runtime evidence: `checkboxChecked: true`, `bedBackgroundColor: "rgb(15, 7, 32)"`, `helloColor: "rgb(104, 15, 44)"`.

## Visual Evidence & Review
- Screenshots captured: `009/screenshot.png` and `009/screenshot-interaction.png`.
- Visual review confirmed:
  - Initial proof shows clean carbon black typography on raw kraft paper.
  - Interactive proof shows complete chromatic inversion to midnight indigo, fluorescent pink, and solar yellow with physical registration offset.
  - "Hello World" remains the unequivocal central visual and semantic subject across both states.

## Limitations
- Element-level state trigger; does not explore element-dimension-aware layout adaptation. CSS Container Queries will be explored in Experiment 010.
