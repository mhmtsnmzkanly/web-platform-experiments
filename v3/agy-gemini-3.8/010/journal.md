# Experiment 010 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 010 represents the culminating apex of the initial 001–010 autonomous sequence of Hello World Lab V3.
Across 001 to 009, the laboratory explored:
- 001: Parametric differential geometry & curvature tensors (SVG)
- 002: Additive acoustic resonance & nodal particulate cymatics (Web Audio + Canvas 2D)
- 003: Asynchronous reaction-diffusion Turing morphogenesis (Web Worker + zero-copy ArrayBuffer)
- 004: Interactive viscoelastic spring-mass topology & kinematics (Pointer Events + Canvas)
- 005: Spectrographic optical dispersion & Cauchy prisms (100% Pure DOM + CSS Color Level 4)
- 006: Topographic signed distance fields & Eikonal solvers (Typed Arrays + Hillshade)
- 007: Chrono-linguistic statecharts & time-travel ledger (IndexedDB + Cryptographic Hashes)
- 008: Computational geometry & Delaunay-Voronoi dual tessellation (Bowyer-Watson + Lloyd Relaxation)
- 009: Formant acoustic phonetics & articulatory vocal tract synthesis (Source-Filter Model + Spectrogram)

For 010, the Moving Frontier demands not merely an isolated mechanism, but a **Unified Coupled Cybernetic Symbiosis**: an ecosystem where multiple web platform subsystems (multi-threaded concurrent computation, spatialized acoustic synthesis, physical field simulation, and multi-tier graphic rendering) form a continuous, interdependent closed feedback loop focused entirely on "HELLO WORLD".

---

## Candidate 1: Cybernetic N-Body Gravitational Gravitas & Spatial Celestial Organ
- **Concept**: A gravitational N-body orbital dynamics simulator running in a dedicated Web Worker, where each character of "HELLO WORLD" acts as a massive attractor in phase space. The orbital trajectories perturb dynamic space-time geodesics rendered on Canvas, while a Web Audio spatial panner array maps body velocities and inter-body orbital resonance to 3D binaural spatial acoustic tones.
- **Strengths**: High physical visual drama; rich mathematical formulation (symplectic leapfrog or Runge-Kutta 4th order integrator).
- **Weaknesses**: Can feel chaotic or lose glyph legibility if masses drift too far apart; acoustic resonance could sound dissonant if not heavily constrained.

## Candidate 2: Bio-Electric Morphogenetic Neural Synapse & Neuro-Acoustic Field
- **Concept**: A spiking neural network (Izhikevich neuron model) arranged along the contour points of "HELLO WORLD". Action potentials propagate through synaptic weights modulated by pointer proximity. Electrical spikes trigger FM synthesis grains in Web Audio, while neurotransmitter diffusion creates glowing luminescence.
- **Strengths**: Novel computational neuroscience mechanism; distinct aesthetic.
- **Weaknesses**: Spiking dynamics can be difficult to balance deterministically; visual language might resemble simple particle graphs.

## Candidate 3 (SELECTED): Cybernetic Symbiosis — Multi-Threaded Quantum-Kinetic Field, Spatialized Acoustic Resonator & Hydrodynamic Glyph Viscosity
- **Concept**: A unified tri-tier cybernetic system:
  1. **Worker-Driven Kinetic Field Simulation**: An off-thread Web Worker calculates a 2D Navier-Stokes / viscous fluid-particle momentum field interacting with the 10 glyph letters of "HELLO WORLD". Particles carry continuous spin, kinetic energy, and vorticity. Transferable zero-copy `Float32Array` buffers stream state at 60 FPS.
  2. **Spatialized Resonator Audio Core**: The kinetic energy, shear stress, and velocity flux of each glyph letter directly modulate a multichannel Web Audio spatialized synthesizer: each glyph has its own spatial panner positioned in 2D space ($x, y$), driving resonant bandpass chords tuned to microtonal harmonic intervals of the fundamental frequency. Pointer interaction induces physical fluid stirring, directly exciting acoustic Doppler shifts and spatial reverb panning.
  3. **Multi-Tier Hybrid Visual Pipeline**: An obsidian darkfield with bioluminescent auroral emerald (`#10b981`), celestial cyan (`#06b6d4`), and deep ultraviolet amethyst (`#8b5cf6`). Canvas renders the high-velocity particle streamlines and velocity vectors; SVG renders crisp holographic glyph boundary constraints with dynamic tension curvature; semantic DOM renders real-time multi-threaded telemetry (worker transfer latency, total kinetic flux, acoustic spatial energy, and Reynolds number).
- **Rationale for Selection**:
  - Pushes **Technology Integration** to the absolute limit: Web Worker (multi-threading with transferable memory) + Web Audio (spatial panning nodes + stereo resonance + parametric audio automation) + HTML5 Canvas (high-throughput fluid particle kinematics) + SVG (crisp topological glyph boundary hulls) + Semantic DOM (live reactive HUD).
  - Pushes **Mechanism Depth**: Discrete Eulerian-Lagrangian momentum transfer coupled with acoustic spatialization and dynamic equilibrium.
  - Pushes **Interaction**: Direct pointer kinematics stir the fluid field, triggering immediate visual streamlines and spatialized acoustic wave propagation.
  - Flawless **Visual Authorship**: Deep space observatory / bioluminescent cybernetic telemetry aesthetic.

---

## Architectural Specification for Candidate 3
- **HTML/CSS**: Deep obsidian black `#080b10` with auroral gradients, modular 3-column telemetry HUD, zero external dependencies.
- **Web Worker**: Inline worker constructed via Blob URL (`new Worker(URL.createObjectURL(blob))`), executing symplectic velocity-Verlet fluid particle kinematics with periodic boundary conditions and glyph attractor potential wells.
- **Web Audio**: Polyphonic spatial soundscape using `PannerNode` (or `StereoPannerNode`), `BiquadFilterNode`, and resonant carrier oscillators mapped to the 10 glyph letters.
- **Telemetry & Lab Evidence**: Exposes `window.labEvidence` containing:
  - `workerTransferMs`: Worker ping-pong cycle latency.
  - `activeParticleCount`: Total kinetic particles simulated in worker (e.g. 1,200).
  - `systemKineticEnergy`: Integrated $\frac{1}{2} \sum m v^2$.
  - `glyphCouplingFlux`: Total momentum transferred between glyphs and fluid field.
  - `audioSpatialChannels`: Active spatial panner node count (10 nodes).
- **Automated Interaction Scenario (`window.labScenario`)**:
  - Simulates programmatic pointer sweep across the glyph coordinates to stir the fluid field, verifying that kinetic energy jumps and audio modulation responds dynamically during automated test execution.
