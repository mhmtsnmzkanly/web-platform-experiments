# Experiment 201 — Journal: Colony Operating System

## 1. Candidate Exploration

### Candidate A: Tartarus Heavy Industries // Subterranean Mining Habitat OS (THI-84)
- **Concept**: Harsh planetary borehole mining rig control interface.
- **Visual Direction**: Raw unpainted cast iron, deep olive drab, stencil warnings, heavy bolt heads, analog seismograph charts.
- **Interaction Focus**: Hydraulic drill pressure vents, acoustic seismic monitoring, ore crusher safety interlocks.
- **Critique**: High atmosphere, but potentially narrow in scope for an entire colony OS; tilts heavily toward a singular machinery monitor rather than a comprehensive multi-module operating system.

### Candidate B: Aethelgard Heavy Industries // Hello World Expeditionary Colony OS (Aethel-OS/84) — [SELECTED]
- **Concept**: A comprehensive industrial operating system imagined by 1984 aerospace computer architects and deployed across the Hello World Expeditionary Outpost (Colony Epsilon, Sector 04) in 2180.
- **Visual Direction**: Cassette Futurism × Industrial Brutalism × Space Engineering.
  - Charcoal casing (`#14171a`), oxidized olive drab (`#2c3327`, `#3a4433`), warm bone/cream placards (`#e4dfd3`), rust hazardous orange (`#c95826`), warning amber (`#d89a24`).
  - Strict absence of CRT tropes: no scanlines, no phosphor bloom, no curved glass, no artificial grain. High-contrast, matte industrial segmented instruments, precision engraved panel labels, structural dividing trusses.
- **8 Integrated Modules**:
  1. *Command Terminal*: Native HTML command selection with verified static response dossiers.
  2. *System Monitor*: Life support, atmospheric barometry, centrifuge grav, coolant loops with CSS segmented LED bar meters.
  3. *Data Archive*: Categorized deep-space colony records, classified incident logs, geological core assays via native `<details>`.
  4. *Communications*: Relays, Earth-link packet latency, orbital transceiver channel selector.
  5. *Navigation*: Colony orbital vectors around gas giant Acheron Prime, Lagrange waypoints, trajectory plots.
  6. *Power Management*: Three-way nuclear/photovoltaic bus load distribution presets altering UI load shedding indicators via `:has()`.
  7. *System Configuration*: Genuine CSS-only UI adjustments (High-Contrast Mode, High-Density Data Grid, Amber Monochrome Accent).
  8. *Diagnostics*: Guided subsystem hardware checklist with real-time tally states.
- **Boot Sequence**: Hardware POST sequence with immediate skip toggle and automatic bypass under `prefers-reduced-motion`.
- **Rationale**: Provides maximum depth, rich interconnected fictional lore anchored in "HELLO WORLD", and flawless zero-JavaScript HTML/CSS interaction engineering.

### Candidate C: Pan-Solar Logistics // Orbital Freight Yard Switchyard OS (PSL-84)
- **Concept**: Orbital cargo transfer dock and mass-driver launch catapult controller.
- **Visual Direction**: High-contrast safety yellow, matte graphite, track-switching schematics, magnetic coupler status lights.
- **Interaction Focus**: Cargo container bay sequencing, rail capacitor bank charging, orbital injection vectors.
- **Critique**: Strong industrial visual potential, but less variety in information architecture compared to a general habitat operating system.

---

## 2. Technical Architecture & Constraints

- **Language / Runtime**: 100% Pure Semantic HTML5 + Modern CSS3. Absolutely **ZERO JavaScript** (no inline, external, event handlers, SVG scripts, or libraries).
- **CSS State Machine Engine**:
  - Module Navigation: Mutually exclusive hidden radio inputs (`name="active-module"`) linked to heavy tactile bay tabs via `<label>`.
  - Boot Sequence: `#skip-boot-trigger:checked ~ .boot-overlay { display: none; }`, backed by a 4.5s CSS animation fallback and reduced-motion zeroing.
  - Power Preset Matrix: Mutually exclusive radio buttons inside `#mod-power` triggering local energy telemetry badges and dynamic warning states via `:has(:checked)`.
  - Diagnostics Tally: Checkbox states controlling diagnostic verification states and safety interlocks.
  - System Configuration: Top-level checkbox controls (`#opt-contrast`, `#opt-density`, `#opt-amber`) cascading down via CSS variable redefinitions.
- **Accessibility & Responsive Design**:
  - Semantic landmark structure: `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<fieldset>`, `<legend>`.
  - Explicit accessible names, high color contrast meeting WCAG AAA across dark industrial surfaces.
  - Full keyboard accessibility (Tab, Space, Enter for radio labels and disclosures).
  - Fluid responsive layouts from 360px mobile viewport up to 1920px ultrawide screens.
