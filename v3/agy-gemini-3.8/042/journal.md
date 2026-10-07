# Experiment 042: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Ray Marching 2D Signed Distance Field (SDF) Snell Refraction & Caustic Irradiance through Solid Typographic Glass Prisms ("HELLO WORLD")
- **Mechanism**: Exact 2D Signed Distance Field $d(\mathbf{x})$ generated from the vector glyph silhouettes of "HELLO WORLD". A bundle of 360 collimated monochromatic laser rays is traced into the glass elements. At each glass-air interface, rays undergo Snell's Law refraction ($n_1 \sin \theta_1 = n_2 \sin \theta_2$) and Fresnel power splitting ($R + T = 1$). Rays exit onto a linear photodetector array, producing caustic cusps, focal concentrations, and shadow zones.
- **Hello World Causality**: Each letter's geometric contour directly acts as the optical dielectric interface. The curved lens surfaces of 'O' and 'D' act as convergent cylindrical lenses focusing rays onto caustic focal spots; planar vertical stems of 'H', 'E', 'L' act as dielectric slabs causing beam shifts; sharp acute corners cause total internal reflection (TIR). Changing the text physically shifts caustic focal lengths, shadow gaps, and total energy distribution.
- **Evidence Strategy**: Compute exact Fresnel energy conservation $\sum (R + T) / N_{\text{rays}} = 1.0 \pm 10^{-4}$ across all interface interactions; verify Snell tangential momentum invariance $|\mathbf{t} \cdot (\mathbf{k}_t - \mathbf{k}_i)| < 10^{-4}$; derive peak caustic irradiance magnification $I_{\max} / I_0 > 2.0$.
- **Composition**: Darkroom Optical Breadboard. Matte black anodized aluminum table with tapped M6 hole grid; laser emitter array at top; glass typographic prisms in center; linear photodiode spectrometer sensor at bottom with real-time irradiance graph overlay. Completely breaks away from standard chassis/sidebar layouts.

### Candidate B: Discrete Typographic Markov Chain & Metropolis-Hastings Stationary Distribution
- **Mechanism**: Character-level stochastic transition matrix $P_{ij}$ derived from the empirical bigrams/trigrams of "HELLO WORLD", computing stationary entropy rate $H = -\sum \pi_i P_{ij} \log_2 P_{ij}$ and Metropolis-Hastings target sampling.
- **Hello World Causality**: Transition probabilities are directly the empirical conditional letter transitions of "HELLO WORLD" (e.g. $P(L|E) = 1.0$, $P(L|L) = 0.5$, $P(O|L) = 0.5$).
- **Evidence Strategy**: Verify stationary distribution eigenvector $\boldsymbol{\pi} P = \boldsymbol{\pi}$ and non-negativity of entropy.

### Candidate C: Euler-Bernoulli Elastic Beam Structural Dynamics & Modal Resonance along Typographic Truss
- **Mechanism**: 1D finite element structural dynamics along the skeletal stroke graph of "HELLO WORLD", computing modal frequencies and harmonic response under base excitation.

## 2. Selection & Frontier Contribution
Candidate A is selected. It establishes a brand-new frontier in **Geometric & Wave Optics, Dielectric Interface Physics, and Caustic Ray Tracing**:
- Introduces exact 2D signed distance field generation directly from glyph contours.
- Solves Snell's refraction, critical angle total internal reflection (TIR), and Fresnel energy conservation.
- Accumulates real-time caustic intensity distributions on a simulated CCD sensor array.
- Spatial composition uses an authentic optical breadboard layout with in-situ optical mounts.

## 3. Mechanism Graph & Governing Equations
- Eikonal equation: $\|\nabla d(\mathbf{x})\| = 1$
- Normal vector at boundary: $\mathbf{n} = \frac{\nabla d}{\|\nabla d\|}$
- Snell's Law in vector form:
  $$\mathbf{t} = \frac{n_1}{n_2} \mathbf{i} + \left(\frac{n_1}{n_2} \cos \theta_1 - \sqrt{1 - \left(\frac{n_1}{n_2}\right)^2 (1 - \cos^2 \theta_1)}\right) \mathbf{n}$$
- Total Internal Reflection (TIR) condition: $\sin^2 \theta_1 > (n_2 / n_1)^2$
- Fresnel reflectance (unpolarized / TM average):
  $$R_s = \left|\frac{n_1 \cos \theta_1 - n_2 \cos \theta_2}{n_1 \cos \theta_1 + n_2 \cos \theta_2}\right|^2, \quad R_p = \left|\frac{n_1 \cos \theta_2 - n_2 \cos \theta_1}{n_1 \cos \theta_2 + n_2 \cos \theta_1}\right|^2, \quad R = \frac{R_s + R_p}{2}, \quad T = 1 - R$$
- Linear Detector Irradiance:
  $$I(x_k) = \frac{1}{\Delta x} \sum_{r \in \text{bin } k} P_r$$
