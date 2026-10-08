# Experiment 202 — Journal: Autonomous Pure CSS Masterpiece

## 1. Candidate Exploration & Creative Thesis

### Candidate A: Chronomètre Mécanique // The Grand Complication Astronomical Tourbillon — [SELECTED]
- **Art Direction**: Haute Horlogerie — 18th/19th-century Swiss-French precision horology (Breguet, Ferdinand Berthoud, A. Lange & Söhne).
- **Visual Vocabulary**: Hand-guilloché engine-turned dial textures (repeating conic & radial gradients), Côtes de Genève (Geneva waves), perlage circular graining, flame-blued steel Breguet pomme hands, synthetic ruby jewel sinks (`box-shadow`, radial gradients), open-worked skeletonized bridges, and an astronomical moonphase aperture on midnight lapis lazuli.
- **Kinetic Mechanics**: Continuous synchronized gear train meshes with mathematically derived gear ratios, 60-second rotating flying tourbillon cage, pulsating balance wheel and Breguet overcoil hairspring, working column-wheel chronograph with running sub-dials, and retrograde date arc.
- **Interactive Depth**:
  1. *Winding & Crown System*: Pushed-in crown winds the mainspring, increasing the 72-hour Réserve de Marche indicator; pulled crown advances calendar and time registers.
  2. *3D Exhibition Caseback*: Interactive 3D flip (`transform-style: preserve-3d`, `rotateY(180deg)`) revealing the reverse sapphire crystal, skeletonized tungsten winding rotor, Geneva stripes, and balance bridge shock protection.
  3. *Monopusher Chronograph*: Tactile pusher cycling start/stop and flyback reset.
  4. *Horological Loupe*: Movable inspection loupe zooming 2.5× into jewel endstones, balance counterweights, and pallet fork teeth.
  5. *Atelier Materiality & UV Luminescence*: Switchable alloys (Rose Gold & Rhodium vs. Platinum & Anthracite vs. Blued Titanium) and a UV blacklight luminescence toggle charging Super-LumiNova phosphor markers.
- **Rationale**: An extraordinary showcase of what pure CSS can achieve. Combines immense aesthetic prestige, microscopic textural detail, mathematically coupled physical rotations, and rich tactile causality without a single line of JavaScript.

### Candidate B: Herbarium Vitreum // The Victorian Botanical Conservatory
- **Art Direction**: 19th-century glasshouse conservatory, cast-iron tracery, cyanotype and hand-tinted specimen plates.
- **Interaction**: Diurnal solar angle slider casting dynamic shadow caustics through stained glass; multi-layer specimen pressing plates unfolding anatomical plant structures.
- **Critique**: Strong atmospheric mood, but lacks the intricate interlocking kinematic causality and kinetic wonder of a multi-gear horological complication.

### Candidate C: Apollo Cartogram // The Lunar Topographic Stereoscope
- **Art Direction**: Mid-century photogrammetry, Hasselblad reseau calibration plates, silver gelatin tonal gradations, and optical stereoscopic relief.
- **Interaction**: Split-prism parallax adjustment, contour line elevation slicer, lunar coordinate reticle.
- **Critique**: High scientific appeal, but risk of leaning too close to instrument/cartography themes explored in previous series runs.

---

## 2. Technical Architecture & CSS Innovation

- **Zero JavaScript Mandate**:
  All states (dial view vs. caseback, chronograph running/paused, alloy selection, UV light, loupe focus, complication views) are strictly controlled via semantic HTML `<input type="radio">` and `<input type="checkbox">` elements, coupled with modern `:has()` and sibling combinators.
- **Advanced CSS Capabilities Deployed**:
  - *Mathematical Gear Dynamics*: Gear trains rotating with reciprocal frequencies based on tooth count ratios using CSS custom properties and `animation-duration: calc(...)`.
  - *Procedural Textures via Pure Gradients*:
    - Guilloché: `repeating-conic-gradient` combined with `radial-gradient` masks creating genuine barleycorn (*grain d'orge*) engine turning.
    - Côtes de Genève: Micro-stepped linear gradients simulating 45-degree hand-applied abrasive lapidary stripes.
    - Perlage: Offset overlapping radial gradient circles creating circular stippled graining on the mainplate.
    - Synthetic Rubies: Multi-stop saturated magenta radial gradients with high-specular white reflections and dark gold chaton borders.
  - *3D Spatial Transforms*: True 3D pocket watch movement with `perspective: 1400px`, `transform-style: preserve-3d`, and double-sided sapphire crystal lenses.
  - *Color Spaces & Lighting*: `oklch()` color adjustments, CSS blend modes (`mix-blend-mode: multiply`, `screen`, `overlay`), and dynamic luminous glow under UV inspection mode.
  - *Full Accessibility & Reduced Motion*: Keyboard-operable crowns, semantic labels, touch target padding $\ge 44\text{ px}$, and respectful pause states under `@media (prefers-reduced-motion: reduce)`.
