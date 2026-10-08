# Experiment 203: Journal — Grand Appareil Photographique d'Atelier N° 203

## Candidate Ideation & Evaluation

### Candidate A: Grand Appareil Photographique d'Atelier N° 203 (Selected)
- **Concept**: A masterwork 1888 large-format field view camera crafted in dark Cuban mahogany, polished brass fittings, articulated accordion-folded leather bellows, and a Petzval brass portrait lens.
- **Physical & Optical System**:
  - Ground glass (*verre dépoli*) back projecting an inverted and laterally reversed optical image with frosted glass grain, composition grid, and spirit level indicators.
  - Articulated 3D accordion leather bellows that expand and contract smoothly with focusing rail adjustments.
  - Multi-blade brass iris diaphragm with continuous aperture stops (f/2.8, f/5.6, f/11, f/32, f/64) altering depth of field and bokeh circles.
  - Scheimpflug tilt and rise/fall front standard adjustments skewing the optical plane of focus.
  - Historical emulsion processes: *Collodion Humide* (1851 tintype/ambrotype), *Cyanotype* (1842 Prussian blue), *Platinotype* (1873 archival platinum gray), and *Autochrome Lumière* (1907 potato starch color plates).
  - Pneumatic shutter release bulb (*déclencheur à poire*) connected with woven braided silk tubing.
  - Dark cloth (*voile de mise au point*) toggle and red darkroom safelight inspection mode (*lanterne inactinique*).
- **CSS Frontier Potential**: Extremely high. Combines 3D perspective accordion folding, optical lens rendering, frosted glass texture, realistic brass and mahogany materials, inverted camera obscura projection, and a rich multi-state CSS engine.

### Candidate B: Microscopium Petrographicum Leitz 1892
- **Concept**: A high-precision petrographic polarizing microscope for mineralogical thin-section analysis.
- **Physical System**: Heavy cast-iron tripod base, knurled brass body tube, 360° graduated rotating stage, crossed Nicol prisms (polarizer & analyzer), Bertrand lens, and quartz wedge compensator.
- **Evaluation**: Scientifically rigorous, but the visual stage is largely restricted to a circular microscopic field of view, limiting spatial and 3D architectural dynamism.

### Candidate C: Theatrum Stereoscopicum & Praxinoscope 1889
- **Concept**: A Victorian parlour optical theatre with a central 12-sided mirrored drum (praxinoscope) surrounded by a moving animation band under candlelit brass chandeliers.
- **Physical System**: Rotating mirrored polygon, slotted zoetrope drum, painted card sequence, hand-crank gearing.
- **Evaluation**: Charming motion illusion, but less opportunity for complex multi-variable state interaction (aperture, focal plane, emulsion chemistry, shutter release, tilt/shift) compared to the large-format view camera.

---

## Architectural Decisions & CSS Engineering

1. **Zero Runtime JavaScript**:
   - Strictly 0 `<script>` tags, zero inline handlers, zero external assets, fonts, or network requests.
   - All state transitions (perspective views, bellows extension, aperture diaphragm, tilt/shift, emulsions, dark cloth, shutter trigger) are managed via semantic `<input type="radio">` and `<input type="checkbox">` elements utilizing CSS `:has()` and adjacent/general sibling selectors.

2. **Procedural Material Systems**:
   - **Cuban Mahogany**: Layered linear and radial gradients reproducing natural deep reddish-brown wood grain with clear lacquer sheen.
   - **Polished & Knurled Brass**: Multi-stop linear gradients (`#f4d068`, `#d4a034`, `#8c6010`, `#543806`) with micro-ridges representing knurled thumbscrews and rack-and-pinion gearing.
   - **Accordion Bellows**: 3D geometric pleats utilizing CSS polygon gradients and directional shadow casting that stretch and compress realistically.
   - **Frosted Ground Glass**: Micro-textured matte surface overlaying an inverted (`transform: scale(-1, -1)`) optical projection of an artisanal Parisian atelier still life.

3. **Optical Emulsion Color Chemistry**:
   - *Collodion Humide*: Deep warm sepia-charcoal shadows, delicate silver mid-tones, micro-vignette, and subtle collodion pour marks.
   - *Cyanotype*: Authentic Prussian blue (`#0f2b48`) iron salts with brilliant unexposed parchment whites.
   - *Platinotype*: Neutral silvery platinum gradations, velvety darks, and high-key highlight delicacy.
   - *Autochrome Lumière*: Microscopic RGB potato starch filter grain producing a painterly 1907 color palette.

4. **Multi-View Spatial Architecture**:
   - *Vue d'Atelier (Studio Bench)*: The full view camera mounted on its wooden tripod with focusing rail and pneumatic bulb.
   - *Verre Dépoli (Ground Glass 8×10)*: Direct full-screen framing of the camera back with grid lines, crop marks, and focusing loupe.
   - *Chambre Noire (Darkroom Safelight)*: Laboratory inspection under 630nm deep ruby safelight illumination.

5. **Responsive & Accessible Design**:
   - Complete layout reflow for mobile devices ($\le 480\text{px}$) with scaled camera geometry, touch-target compliance ($\ge 44\text{px}$), and clear label hierarchy.
   - `@media (prefers-reduced-motion: reduce)` disabling continuous oscillations and providing immediate static calibrated positions.
