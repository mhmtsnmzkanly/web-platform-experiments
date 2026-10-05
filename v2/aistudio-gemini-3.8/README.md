# Hello World Lab — AI Studio Interactive Showcase

An interactive showcase and experimental laboratory featuring 200 distinct visual, interactive, and algorithmic studies centered on the phrase Hello World. Built natively with React 19, Vite, and modern Web APIs, providing real-time exploration, category filtering, and direct DOM inspection.

---

## 🚀 Live Demo & Quick Launch

> **Standalone Build Demo:**  
> To run the pre-built interactive application immediately without any build steps or server setup, open:  
> 👉 **[Launch Demo (dist/index.html)](dist/index.html)**

- **AI Studio Project:** [View app in Google AI Studio](https://ai.studio/apps/c99db4f0-54a8-477d-a29c-1f3fa33e3f91)
- **Source Code:** [`src/experiments/`](src/experiments/)
- **Total Experiments:** 200 registered studies

---

## 🛠️ How to Run Locally

### Option A: Open the Compiled Production Build (Recommended)

The production assets are compiled and ready in the [`dist/`](dist/) directory:

```bash
# Option 1: Serve dist with any local HTTP server
npx serve dist

# Option 2: Use Python simple server
cd dist && python3 -m http.server 3000
```
Then navigate to `http://localhost:3000` in Google Chrome or Chromium.

### Option B: Run the Development Server

To develop or modify the experiments with hot module replacement:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Set GEMINI_API_KEY in .env.local if utilizing server-side generative capabilities
   ```

3. **Start Vite development server:**
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 🏗️ Architecture & Technology Stack

The showcase is designed as a unified cockpit where every experiment is isolated into an independent modular component while sharing inspection tools, state control, and responsive viewports.

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 with `@vitejs/plugin-react`
- **Styling:** Tailwind CSS 4 with `@tailwindcss/vite`
- **Motion & Physics:** Motion (`motion`)
- **Iconography:** Lucide React (`lucide-react`)
- **Generative AI Bridge:** `@google/genai`
- **Native Browser Capabilities:**
  - **HTML5 & Modern CSS:** Container queries, subgrid, `@scope`, `:has()`, view transitions, backdrop filters, CSS motion paths.
  - **Graphics & Vectors:** 2D Canvas direct pixel manipulation, SVG filter displacement, WebGL fragment shaders, SDF raymarching.
  - **Signals & Sound:** Web Audio API oscillator synthesis, Fourier transforms, spectral scopes.
  - **Browser Concurrency & Storage:** Dedicated Web Workers, BroadcastChannel, CompressionStream, IndexedDB.

---

## 🔬 Experiment Categories (200 Studies)

The 200 studies are classified into 5 core domains, each addressing distinct scientific and design challenges:

### 1. Physics & Geometry (40 Studies)
Explores computational physics, kinematics, orbital mechanics, differential geometry, and spatial transformations:
- **019 — Elastic Cloth Mesh:** Mass-spring numerical integration across Verlet particle grids.
- **021 — Ferrofluid Spikes:** Rosensweig magnetic instability simulation with spike deformation.
- **073 — Gravitational Lensing:** General relativistic deflection of light rays around Schwarzschild black holes.
- **077 — Hopf Fibration:** 4D hypersphere projection onto $\mathbb{R}^3$ via linked Villarceau circles.
- **091 — Superconducting Meissner Levitation:** Flux pinning and diamagnetic repulsion visualization.
- **092 — Catenary Chain Arch:** Variational calculus catenary curve equilibrium under gravitational load.

### 2. Simulation & Complex Systems (40 Studies)
Models emergent behaviors, fluid dynamics, reaction-diffusion, and non-linear dynamics:
- **016 — Conway's Game of Life:** 2D cellular automaton computing state transitions around typography.
- **032 — Fluid Navier-Stokes Smoke:** Grid-based Eulerian fluid simulation with advection and vorticity confinement.
- **046 — Microscopic Brownian Motion:** Stochastic Langevin equation modeling molecular collisions.
- **055 — Reaction-Diffusion Turing Morphogenesis:** Gray-Scott chemical substrate concentration kinetics.
- **064 — Sandpile Self-Organized Criticality:** Bak-Tang-Wiesenfeld abelian sandpile avalanche cascades.
- **080 — Lorenz Strange Attractor:** Chaotic non-linear differential equations and butterfly phase space.

### 3. Retro Computing & Optics (40 Studies)
Recreates historical display technology, diffraction phenomena, and optical illusions:
- **002 — CRT Terminal:** Phosphor decay, scanline bloom, barrel distortion, and chromatic aberration.
- **020 — Prismatic Refraction:** Snell's law wavelength-dependent dispersion through optical glass prisms.
- **035 — Anamorphic Cylinder Mirror:** Cylindrical catoptric projection deciphered via reflective core.
- **040 — Diffraction Grating Hologram:** Wave interference patterns producing spectral diffraction orders.
- **058 — Moiré Interference Patterns:** Superimposed periodic grid rotations creating emergent spatial frequencies.
- **081 — Nixie Tube Gas Discharge:** Cold-cathode neon ionization glowing wire numeral electrodes.

### 4. Audio, Signals & Instrumentation (40 Studies)
Transforms acoustic frequencies, electronic measurement tools, and electromagnetic fields:
- **007 — Audio Waveform Synth:** Multi-oscillator harmonic additive synthesis and live oscilloscope.
- **022 — Radar Sonar Sweep:** Plan Position Indicator (PPI) rotating beam with persistence phosphor.
- **028 — Chladni Resonance Plates:** Eigenmode nodal line powder accumulation under acoustic standing waves.
- **048 — Oscilloscope Vector Scope:** XY electron beam deflection drawing Lissajous figures and vector fonts.
- **068 — Acoustic Levitation Nodes:** Ultrasonic standing wave pressure traps suspending matter in air.
- **096 — Resonant Tesla Coil Discharge:** High-frequency electrical streamer breakdown and spark gap simulation.

### 5. Typography & Linguistic Systems (40 Studies)
Deconstructs typography through computational geometry, printing history, and generative fonts:
- **001 — Semantic Genesis:** Pure unstyled HTML document structure establishing the baseline.
- **004 — Bauhaus Assembly:** De Stijl and Bauhaus primary color geometry and constructivist grid lockup.
- **006 — Matrix Cipher Rain:** Japanese kana and glyph stream decoding into the greeting phrase.
- **013 — Zen Sand Rake:** Japanese karesansui gravel raking algorithms circumscribing letterforms.
- **017 — Letterpress Studio:** Mechanical wood type lockup, pressure ink transfer, and paper debossing.
- **200 — Omni-Synthesis Grand Finale:** Unified synthesis combining all modal engines into an orchestral conclusion.

---

## 📁 Repository Layout

```text
v2/aistudio-gemini-3.8/
├── dist/                      # Pre-built production bundle ready to run
│   ├── index.html             # Standalone application entrypoint
│   └── assets/                # Compiled JS/CSS bundles
├── src/
│   ├── App.tsx                # Main gallery shell, search, and inspector
│   ├── index.css              # Global styles and typography
│   ├── main.tsx               # React application root
│   └── experiments/           # 200 standalone study components
│       ├── types.ts           # Experiment metadata schemas
│       ├── registry.ts        # Central registry indexing all 200 studies
│       └── Experiment*.tsx    # Individual experiment implementations (001–200)
├── metadata.json              # Project identity and manifest
├── package.json               # Node.js dependencies and scripts
└── vite.config.ts             # Vite build configuration
```

---

## 🔗 Links & Resources

- **[Open Built Demo Directly](dist/index.html)**
- **[Google AI Studio Project](https://ai.studio/apps/c99db4f0-54a8-477d-a29c-1f3fa33e3f91)**
- **[Parent Repository Root](../../README.md)**
