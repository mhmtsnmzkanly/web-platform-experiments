# Experiment Report: 206 — HADAL-7 // Bathymetric Deep-Trench Probe & Oceanic Stratigraphic Atlas

## Frontier Classification: Deep Oceanic Cartography, Scroll-Driven Environmental Timelines & CSS Anchor Positioning

Experiment 206 establishes an entirely new frontier for the repository, moving beyond physical hardware cabinets, mechanical horology, optical art galleries, and desktop software forms into an **epic, vertical deep-earth environmental exploration atlas**:

### 1. Creative Concept & User Experience
- **Concept**: HADAL-7 is an oceanographic deep-trench exploration probe and bathymetric stratigraphic atlas chronicling an 11,000-meter vertical descent down the Mariana Trench into the Challenger Deep ($0\,\text{m}$ down to $-10,935\,\text{m}$).
- **The Journey**: The user scrolls through the five distinct pelagic divisions of the ocean column:
  1. **Epipelagic Stratum ($0\,\text{m} \to 200\,\text{m}$)**: The sunlit euphotic zone, surface primary biomass synthesis, Praya dubia siphonophore aggregations.
  2. **Mesopelagic Stratum ($200\,\text{m} \to 1,000\,\text{m}$)**: The dysphotic twilight zone, rapid thermocline temperature drop, Ceratias holboelli anglerfish counter-illumination.
  3. **Bathypelagic Stratum ($1,000\,\text{m} \to 4,000\,\text{m}$)**: The midnight zone, complete aphotic darkness, hydrothermal polymetallic sulfide black smoker chimneys ($368^\circ\text{C}$).
  4. **Abyssopelagic Stratum ($4,000\,\text{m} \to 6,000\,\text{m}$)**: The vast abyssal plains, siliceous ooze, Pseudoliparis swirei Mariana snailfish with piezolyte TMAO cellular adaptations.
  5. **Hadalpelagic Horizon ($6,000\,\text{m} \to 10,935\,\text{m}$)**: The tectonic subduction trench floor, crushing hydrostatic pressure exceeding $1,086\,\text{atm}$ ($110.1\,\text{MPa}$).
- **Causal Hello World Integration**: At the floor of the Challenger Deep ($-10,935\,\text{m}$), the probe locks onto the **Hadal Benthic Telemetry Transponder**, receiving and rendering the continuous low-frequency hydroacoustic carrier transmission:
  `"HELLO WORLD"`
  modulated at an 8.5 kHz carrier frequency, visualized across real-time frequency waterfall bars and acoustic echogram telemetry.

---

## 2. Unexplored CSS Frontiers Mastered in Experiment 206

1. **Native CSS Scroll-Driven Animations (`animation-timeline: scroll(root block)`)**:
   - Zero-JavaScript scroll binding. The physical descent through the water column is tied directly to native user scroll:
     - **Vernier Descent Tape**: Slides vertically across depth ticks ($0\,\text{m} \to 10,935\,\text{m}$) aligned to a stationary red needle cursor.
     - **Hydrostatic Pressure Gauge**: Fills continuously from $1\,\text{atm}$ to $1,086\,\text{atm}$ ($110\,\text{MPa}$) using a linear fill keyframe.
     - **Beer-Lambert Light Attenuation**: Deepens the ambient water column background from sunlit sapphire azure (`oklch(0.58 0.16 230)`) down through dysphotic twilight indigo into complete hadal obsidian (`oklch(0.06 0.02 260)`).
     - **Marine Snow Multi-Layer Parallax**: Drifts suspended organic particulate layers at staggered vertical rates.
2. **CSS Anchor Positioning (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`)**:
   - Deep-sea biological and geological specimens (`#anchor-target-siphonophore`, `#anchor-target-anglerfish`, `#anchor-target-smoker`, `#anchor-target-snailfish`, `#anchor-target-beacon`) define explicit CSS anchor names.
   - Dynamic scientific telemetry callout cards tether directly to their target via `position-anchor: --anchor-target-*` and `position-area: block-end span-inline-end`.
   - Incorporates `@position-try` fallback strategies (`flip-block`, `flip-inline`) for responsive collision avoidance, with seamless graceful fallbacks for browsers lacking anchor positioning.
3. **Container Queries (`container-type: inline-size`, `@container`)**:
   - Left and right telemetry flanks use named inline-size containers (`container-name: flank-left`, `container-name: flank-right`), automatically transforming radar displays, values, and typography when column width shifts.
4. **Relational `:has()` Sensor Engine**:
   - The probe cockpit HUD offers four multi-spectral sensor arrays:
     1. *Optical*: Standard broad-spectrum bathyscaphe floodlights.
     2. *Biolum 470nm*: Blue/violet excitation mode highlighting organic photophores and symbiotic luciferin reactions.
     3. *Sonar*: High-frequency bathymetric echogram scanlines and coordinate grid.
     4. *Thermal IR*: Infrared thermography mapping superheated hydrothermal effluents.
   - Filtering is precisely applied to `.trench-descent-column`, preserving `position: fixed` containing blocks for the cockpit HUD and instrumentation flanks across all zoom and scroll positions.

---

## 3. Verification & Observability Evidence

- **Dependency Certification**: Passed `node tools.js dependency-check 206/206.html` (`OK`, 0 external dependencies, 0 CDNs, 0 iframes).
- **Runtime Purity**: 0 `<script>` tags, 0 inline event attributes, 0 external font or image assets.
- **Headless Chromium CDP Verification Suite**:
  - `screenshot.png` (1280 × 800): Default surface entry state, Epipelagic stratum ($0\,\text{m} \to 200\,\text{m}$), 1 atm pressure, anchored Siphonophore colony callout.
  - `screenshot-late.png` (1280 × 800): Terminal Hadal sanctuary at $-10,935\,\text{m}$, fully filled $1,086\,\text{atm}$ pressure bar, Vernier tape at terminal tick, luminous `"HELLO WORLD"` hydroacoustic carrier broadcast, and waterfall spectrum.
  - `screenshot-interaction.png` (1280 × 800): Mesopelagic zone under Bioluminescence 470nm sensor excitation, displaying Ceratias holboelli anglerfish photophore telemetry.
  - `screenshot-interaction-late.png` (1280 × 800): Abyssopelagic zone under Sonar Bathymetry scan mode, displaying Mariana Snailfish (Pseudoliparis swirei) piezolyte telemetry over green sonar coordinate grid.
  - `screenshot-mobile.png` (390 × 844): Mobile phone viewport testing responsive cockpit HUD, wrapped sensor selector buttons, and fluid stratum typography.
- **Accessibility & Resilience**:
  - Full keyboard focusability on sensor radio buttons via `:focus-visible`.
  - Comprehensive `@media (prefers-reduced-motion: reduce)` disabling scroll timelines and particle drift while maintaining complete document readability.
