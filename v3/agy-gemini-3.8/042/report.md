# Experiment Report: 042 — Snell-Descartes Refraction & Caustic Irradiance through Typographic Glass Prisms ("HELLO WORLD")

## Concept
A computational geometric optics and wave propagation experiment tracing Snell-Descartes refraction, Fresnel transmission/reflection power splitting, and caustic irradiance accumulation through solid glass typographic prisms shaped as "HELLO WORLD":

1. **Governing Optical Equations**:
   - Snell's Law in vector form across dielectric boundaries (air $n_1 = 1.00$ to glass $n_2 = 1.52$ crown glass, adjustable to flint $1.65$ or diamond $2.42$):
     $$\mathbf{t} = \frac{n_1}{n_2} \mathbf{i} + \left(\frac{n_1}{n_2} \cos \theta_1 - \sqrt{1 - \left(\frac{n_1}{n_2}\right)^2 (1 - \cos^2 \theta_1)}\right) \mathbf{n}$$
   - Total Internal Reflection (TIR) occurs whenever $\sin^2 \theta_1 > (n_2 / n_1)^2$. The ray undergoes specular reflection:
     $$\mathbf{r} = \mathbf{i} - 2 (\mathbf{i} \cdot \mathbf{n}) \mathbf{n}$$
   - Exact Fresnel equations for unpolarized light (TM/TE average):
     $$R = \frac{1}{2} \left(\left|\frac{n_1 \cos \theta_1 - n_2 \cos \theta_2}{n_1 \cos \theta_1 + n_2 \cos \theta_2}\right|^2 + \left|\frac{n_1 \cos \theta_2 - n_2 \cos \theta_1}{n_1 \cos \theta_2 + n_2 \cos \theta_1}\right|^2\right), \quad T = 1 - R$$
     Strict energy conservation invariant: $R + T = 1.0000$.

2. **Causal Typographic Dielectric Bodies ("HELLO WORLD")**:
   - The optical prisms are directly shaped as the polygonal letter contours of "HELLO WORLD":
     - 'H', 'E', 'L', 'L': Planar dielectric slabs that induce parallel lateral beam displacements $\Delta x = d \sin(\theta_1 - \theta_2) / \cos \theta_2$.
     - 'O', 'D': Annular cylindrical meniscus lenses with curved outer and inner boundaries, acting as convergent refractive lenses that focus collimated rays into high-intensity caustic focal cusps and caustic sheets.
     - 'W': Angled wedge prisms with alternating oblique facets, producing acute beam splitting and internal reflections.
     - 'R': Hybrid prism combining a planar stem, curved upper bowl, and diagonal refractive leg.
   - Modifying the literal character sequence physically changes the focal locations, beam steering angles, and shadow zone widths.

3. **Linear CCD Detector & Caustic Irradiance Reconstruction**:
   - A 320-bin simulated linear photodiode array integrates the photon power flux of rays reaching the bottom boundary:
     $$I(x_k) = \frac{1}{\Delta x} \sum_{r \in \text{bin } k} P_r$$
   - Computes the spatial caustic magnification factor $I_{\max} / I_0$, revealing sharp caustic focal peaks reaching $> 2.9\times$ nominal beam irradiance.

4. **Computed Invariants & Telemetry**:
   - Fresnel power conservation: $\sum (R + T) / N_{\text{interfaces}} = 1.0000$.
   - Snell tangential momentum invariance: $|n_1 \sin \theta_1 - n_2 \sin \theta_2| < 10^{-16}$.
   - Caustic peak concentration: $I_{\max} / I_0 \in [1.96, 2.93]$.
   - Intercepted beam count: $417 - 474$ interface interactions across 200 laser rays.

## Web Platform Surface
- **Optical Bench Breadboard (`CanvasRenderingContext2D`)**:
   - Matte black anodized optical breadboard (`#07090e`) with tapped M6 mounting hole pattern (25mm grid).
   - Top collimated laser emitter rail ($532\text{ nm}$ emerald laser) with in-situ goniometric knobs: incident angle slider ($\theta_{\text{in}} \in [-25^\circ, +25^\circ]$), refractive index knob ($n_2 \in [1.20, 2.40]$), and ray count selector ($80 - 320$).
   - Solid typographic glass bodies rendered with dielectric fill (`rgba(56, 189, 248, 0.09)`), polished beveled contours, and internal focal node highlights.
   - Screen-space additive beam tracing rendering caustic tracks and focal nodes.
   - Bottom linear CCD spectrometer screen displaying the real-time continuous caustic irradiance waveform $I(x)$.

## Verification Evidence
Verified via `tools.js verify 042/042.html 042`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: Fresnel energy conservation $R+T = 1.0000$, Snell invariant residual $< 10^{-16}$, caustic peak ratio $1.96\times$, rays intercepted $417 / 200$.
- **Interaction Response**: Goniometric beam angle sweep (`#btnSweep`) rotated incidence by $+6.0^\circ$, altering ray paths across all letter prisms, shifting caustic focal positions, and surging peak irradiance to $2.93\times$.
- **Causal Subject**: The refractive optical elements are literally the glass bodies of "HELLO WORLD".
