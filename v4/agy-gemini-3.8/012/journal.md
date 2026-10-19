# Engineering Journal — Experiment 012: OPTICA-FORGE

### 2026-10-19 — Project Origination & Architecture
Following user directive `"Kendi fikirlerine donebilirsin"` and completion, dual auditing, remediation, and deployment of Experiment 011 (`AERO-TUNNEL`), originated **OPTICA-FORGE**: an interactive physical wave optics, interferometry, digital holography, and thin-film spectral engineering laboratory.

Key architectural decisions:
1. **Scalar Diffraction & Huygens-Fresnel Wave Engine (`WaveOpticsEngine.ts`)**:
   - 2D scalar optical field represented as decoupled real and imaginary components $\text{Re}\{E\}, \text{Im}\{E\} \in \mathbb{R}^{280 \times 140}$ on contiguous `Float32Array` buffers (39,200 complex cells).
   - Simulates physical diffraction using the Huygens-Fresnel integral and secondary wavelet superposition downstream of customizable aperture masks.
   - Calculates irradiance $I(x, y) = |E|^2$ and wavefront phase $\phi(x, y) = \text{atan2}(\text{Im}, \text{Re})$.
2. **Multi-Beam Interferometer & Optical Cavity Modeling**:
   - Michelson interferometer with sub-nanometer piezoelectric mirror scan, linear Fizeau carrier fringe tilt, and temporal coherence fringe visibility decay factor $\gamma(\Delta L) = \exp(-(\Delta L / L_c)^2)$.
   - Mach-Zehnder refractometer with transparent in-situ sample cell measuring sub-wavelength optical path delay $\Delta\phi = \frac{2\pi}{\lambda}(n_s - 1) L_s$.
   - Fabry-Pérot resonant cavity with variable dielectric reflectivity $R \in [0.60, 0.98]$, resolving ultra-narrow Airy transmission peaks and finesse $\mathcal{F} > 150$.
3. **Exact 2x2 Transfer Matrix Method (TMM) (`ThinFilmEngine.ts`)**:
   - Analytical characteristic matrix multiplication for arbitrary multi-layer dielectric and plasmonic stacks.
   - Solves Maxwell boundary conditions across TE (s) and TM (p) polarization states and arbitrary incidence angles $\theta_0 \in [0^\circ, 75^\circ]$.
   - Continuous spectral integration across visible spectrum 380–780 nm.
4. **Digital Off-Axis Holography**:
   - Off-axis Leith-Upatnieks reference beam recording interfering target object waves with angled plane waves.
   - Numerical 3D wavefront reconstruction regenerating virtual diffracted images.
5. **Zero-GC 60 FPS Canvas Rendering (`WaveBenchCanvas.tsx`)**:
   - Offscreen `<canvas>`, 2D context, `ImageData`, and `Uint32Array` pixel buffer allocated once on mount inside React refs.
   - Pre-computed 256-entry colormap palettes (Laser Green, Cyan Neon, Solar Amber, Phase Color Wheel).
   - Zero per-frame object allocation or garbage collection overhead during continuous 60 FPS animation.
   - Interactive draggable detector slice line and piezoelectric scan gesture.
6. **100% Procedural Web Audio Optical Sonification (`OpticaSonificationEngine.ts`)**:
   - Zero external audio files.
   - Laser beam pink noise hiss modulated by optical frequency bandpass filter.
   - Interferometric Doppler fringe tone dynamically tracking piezoelectric velocity.
   - Fabry-Pérot cavity resonance hum responsive to cavity finesse.
   - Phase step chimes and holographic reconstruction laser pulse sound.
   - Master `DynamicsCompressorNode` (-3 dB, 12:1 ratio) preventing audio clipping.

---

### Implementation Milestones
- `src/types/index.ts`: Optical suite modes, diffraction presets, interferometer types, thin-film layer interfaces, hologram configurations, and telemetry metrics.
- `src/optics/ThinFilmEngine.ts`: 2x2 TMM spectral engine with 6 curated presets (Bare Glass, $\text{MgF}_2$ AR, Broadband V-Coat, DBR Laser Mirror, Fabry-Pérot Filter, Silver Mirror).
- `src/optics/WaveOpticsEngine.ts`: 2D scalar wave engine with Huygens-Fresnel diffraction, Michelson/Mach-Zehnder/Fabry-Pérot interferometry, and holography recording/reconstruction.
- `src/audio/OpticaSonificationEngine.ts`: Procedural optical sonification with Doppler tones, resonance drone, and laser pink noise.
- `src/components/Header.tsx`: Mode switching, live telemetry HUD strip, colormap dropdown, display mode selector, and audio/export controls.
- `src/components/WaveBenchCanvas.tsx`: High-performance 60 FPS canvas with zero-GC offscreen pipeline and detector slice gizmo.
- `src/components/OpticsControlDeck.tsx`: Contextual parameter sliders, real-time SVG detector profile $I(y)$, and visible reflection/transmission spectrum $R(\lambda), T(\lambda)$.
- `src/components/DataExportModal.tsx`: Scientific telemetry export for CSV intensity profiles, CSV spectrum tables, and JSON state files.
- `src/App.tsx` & `src/main.tsx`: App orchestration, state synchronization, audio lifecycle, and 15 Hz telemetry broadcast.

---

### Automated Verification
- Headless automated Chromium test suite (`test-run.cjs`) executed via Puppeteer.
- Verified all 4 suite modes (`DIFFRACTION`, `INTERFEROMETRY`, `THIN_FILM`, `HOLOGRAPHY`), 6 diffraction presets, 3 interferometer types, 6 thin-film coatings, polarization states, holographic 3D reconstruction, display modes, pause/reset, and data export modal.
- Passed with 0 console errors and 0 unhandled exceptions.
