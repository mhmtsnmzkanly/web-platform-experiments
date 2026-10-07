# Experiment Report: 048 — Relativistic Aberration, Lorentz Contraction & Doppler Beaming at Near-Light-Speed Flyby of Typographic Constellation ("HELLO WORLD")

## Concept
A computational special relativity and 4-vector spacetime kinematics experiment modeling the relativistic visual appearance of an observer flying past a 3D celestial constellation of "HELLO WORLD" at near-light velocities $\beta = v/c \in [0.0, 0.98]$:

1. **Governing Relativistic Kinematics**:
   - Observer traveling forward along the $+Z$ axis with coordinate velocity $\boldsymbol{\beta} = (0, 0, \beta)$, Lorentz factor:
     $$\gamma = \frac{1}{\sqrt{1 - \beta^2}}$$
   - Strict Lorentz invariant: $\gamma \sqrt{1 - \beta^2} = 1.000000 \pm 10^{-6}$.
   - Relativistic aberration of light (Einstein's forward searchlight effect):
     $$\cos \theta' = \frac{\cos \theta - \beta}{1 - \beta \cos \theta}, \quad \sin \theta' = \frac{\sin \theta}{\gamma (1 - \beta \cos \theta)}$$
     where $\theta$ is the angle between the incoming photon ray and the velocity vector in the rest frame, and $\theta'$ is the observed angle in the spacecraft frame.
   - Relativistic longitudinal and transverse Doppler factor:
     $$D(\theta) = \frac{1}{\gamma (1 - \beta \cos \theta)}$$
     shifting rest wavelength $\lambda_0 = 550\text{ nm}$ to $\lambda' = \lambda_0 / D(\theta)$:
     - Ahead ($\theta = 0$): $D(0) = \sqrt{\frac{1+\beta}{1-\beta}} \gg 1$ (intense blueshift into ultraviolet/white).
     - Trailing ($\theta = \pi$): $D(\pi) = \sqrt{\frac{1-\beta}{1+\beta}} \ll 1$ (extreme redshift into infrared/ruby).
   - Relativistic radiance transformation (Doppler beaming):
     $$I'(\theta') = D^4(\theta) I_0$$
     concentrating photon flux into the forward flight cone.
   - Terrell-Penrose effect: apparent 3D rotation of celestial letter forms caused by differential photon travel times $\Delta t = d / c$ across the depth of the characters.

2. **Causal Typographic Constellation ("HELLO WORLD")**:
   - The celestial vertices and connecting filaments are the literal 3D coordinates of each letter of "HELLO WORLD" positioned in interstellar space.
   - As the observer accelerates, the constellation geometry warps dynamically:
     - Characters ahead in the flight corridor ('H', 'E') blueshift to electric cyan and violet-white, magnifying in apparent brightness.
     - Characters falling behind ('L', 'D') redshift to warm amber and deep ruby crimson.
   - Modifying the text changes the 3D spatial distribution of vertices, filament connectivity, and the observed relativistic aberration profile.

3. **Computed Invariants & Telemetry**:
   - Lorentz invariant: $\gamma \sqrt{1 - \beta^2} = 1.000000$.
   - Forward Doppler factor: $D(0) = 2.38\times$ (at $\beta = 0.70$) surging to $5.69\times$ (at $\beta = 0.94$).
   - Relativistic beaming factor: $D^4 \in [32.1\times, 1045.4\times]$.
   - Active typographic constellation vertices: $N = 50$.

## Web Platform Surface
- **Astrophysical Cockpit Navigation Viewport (`CanvasRenderingContext2D`)**:
   - Deep interstellar cockpit canopy canvas (`#03050a`) with 360-degree celestial azimuthal horizon rings and forward velocity reticle.
   - 3D constellation stars and connecting letter filaments projected with relativistic stereographic aberration and Doppler color temperature mapping.
   - Right-side Lorentz 4-vector telemetry HUD showing $\beta$, $\gamma$, $D$, $D^4$, $\lambda'$, and aberration cone angle $\theta'_{\text{cone}}$.
   - In-situ actuators: Relativistic Boost button (`#btnWarp`) surging $\beta$ to $0.94\ c$, and continuous speed slider ($\beta \in [0.0, 0.98\ c]$).

## Verification Evidence
Verified via `tools.js verify 048/048.html 048`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: Lorentz invariant $\gamma \sqrt{1-\beta^2} = 1.000000$, forward Doppler factor $D = 2.38\times$, beaming radiance $D^4 = 32.1\times$, apparent wavelength $\lambda' = 231\text{ nm}$, constellation vertices $N = 50$.
- **Interaction Response**: Relativistic boost button surged velocity to $\beta = 0.94\ c$, increasing $\gamma$ to $2.931$, Doppler factor to $5.69\times$, and beaming to $1045.4\times$, collapsing the constellation into a tight forward aberration ring.
- **Causal Connection**: The celestial stars and filaments are the literal 3D typography of "HELLO WORLD"; their spatial depths and angles physically dictate the relativistic aberration and Doppler shift.
