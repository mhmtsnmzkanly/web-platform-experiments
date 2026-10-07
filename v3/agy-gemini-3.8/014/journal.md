# Experiment 014 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 014 advances the Moving Frontier into **Coherent Wave Optics & Physical Electromagnetism**.
While earlier experiments addressed geometric optics (005 Cauchy refraction) and acoustic pressure waves (002, 009), 014 explores **Wave Superposition, Fraunhofer Diffraction, and Coherent Laser Interferometry** through a micro-aperture mask of "HELLO WORLD".

---

## Candidate 1 (SELECTED): Coherent Optical Wavefront Diffraction & Fraunhofer Multi-Aperture Interferometry
- **Concept**: A monochromatic coherent laser beam ($\lambda = 532.0\text{ nm}$ emerald green laser) passes through a precision optical slit mask containing ten micro-apertures shaped as the characters of "HELLO WORLD". The optical field on the observation screen is calculated via the Huygens-Fresnel principle and Fraunhofer diffraction integral:
  $$U(x) = \sum_{k=1}^{10} A_k \operatorname{sinc}\left(\frac{\pi a}{\lambda D} (x - x_k)\right) \exp\left(i \frac{2\pi}{\lambda} \frac{d_k x}{D} - i \omega t\right)$$
  The observed intensity on the screen is the squared magnitude of the complex electric field $I(x) = |U(x)|^2 = \operatorname{Re}(U)^2 + \operatorname{Im}(U)^2$. 
  The system calculates constructive and destructive interference fringes, diffraction sinc envelopes, and spatial coherence fringes in real time at 60 FPS.
- **Strengths**:
  - Genuinely new mechanism family (Physical wave optics, electromagnetic phase interference, Fourier diffraction).
  - Distinct visual aesthetic: Anodized black optical breadboard bench, micrometer vernier stage, collimated emerald laser beam, and luminous monochromatic interference fringe waterfall.
  - Interactive optical micrometer: Dragging adjusts slit aperture separation $d$ or projection distance $D$, directly altering fringe spatial frequency ($\Delta x = \frac{\lambda D}{d}$).
  - Clean analytical wave mathematics, zero external libraries.
- **Weaknesses**: Must calculate wave superposition efficiently across the screen array without redundant trigonometrics.

## Candidate 2: Gyroscopic Precession & Quaternion Euler Dynamics
- **Concept**: Simulating torque-free and torque-induced precession of spinning gyroscopic rings inscribed with "HELLO WORLD".
- **Strengths**: Classical 3D rigid body dynamics.
- **Weaknesses**: Mechanically complex; visual language might resemble earlier 3D wireframes.

## Candidate 3: Margolus Partitioning Cellular Automata
- **Concept**: Reversible block cellular automaton simulating energy-conserving lattice gas typography.
- **Strengths**: Discrete computation.
- **Weaknesses**: Discrete grid visual language shares traits with 003 and 013.

---

## Architectural Specification for Candidate 1 (Wave Optics & Interferometry)
- **Optical Laser Parameters**:
  - Wavelength $\lambda = 532.0\text{ nm}$ (emerald laser) with tunable Doppler shift.
  - Screen distance $D = 1.20\text{ m}$.
  - Aperture slit width $a = 0.08\text{ mm}$, slit pitch $d = 0.32\text{ mm}$.
- **Aperture Mask**:
  - 10 micro-slits corresponding to the 10 glyph letters of "HELLO WORLD".
- **Interferogram Profile**:
  - 1D high-resolution analytical intensity array $I(x)$ evaluated across 600 screen pixels.
  - 2D rolling interferogram waterfall displaying wave phase coherence and interference fringe persistence.
- **Interactive Micrometer**:
  - Dragging across the optical breadboard rotates the vernier micrometer, modulating slit aperture spacing and wavelength.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures laser wavelength $\lambda$, fringe spatial period $\Delta x$, peak fringe visibility $(I_{\max} - I_{\min})/(I_{\max} + I_{\min})$, and coherence length.
