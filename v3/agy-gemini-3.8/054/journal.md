# Experiment 054 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 053 (liquid crystal continuum elasticity and birefringence), Experiment 054 ventures into **non-Euclidean Riemannian geometry and conformal automorphism groups**: Hyperbolic Escher Tessellations on the Poincaré Disk $\mathbb{D}^2$.

## 2. Candidates Explored

### Candidate 1: Poincaré Disk Conformal Hyperbolic Tessellation & Möbius Isometries
- **Mechanism**: The 2D hyperbolic plane modeled on the open unit disk $\mathbb{D}^2 = \{z \in \mathbb{C} : |z| < 1\}$ equipped with the Poincaré metric $ds^2 = \frac{4 |dz|^2}{(1 - |z|^2)^2}$. Isometries belong to the projective special unitary group $PSU(1,1)$ of Möbius automorphisms $T_a(z) = \frac{z - a}{1 - \bar{a}z}$. A regular hyperbolic $\{p, q\}$ reflection group tiles the disk with infinitely many congruent copies of a fundamental polygon.
- **Causal Hello World**: The 10 characters ('H','E','L','L','O','W','O','R','L','D') are embedded into the fundamental domain tile as hyperbolic geodesic arcs; their metric coordinates and conformal shapes transform under Möbius reflections, tiling the entire hyperbolic universe.
- **Visual & Interaction**: Antique celestial Poincaré disc projection on dark slate with golden boundary horizon circle $S^1$; continuous pointer dragging performing hyperbolic translation $T_a(z)$ that flows the entire manifold across infinity while strictly preserving hyperbolic geodesics and angles.

### Candidate 2: Belousov-Zhabotinsky (BZ) Excitable Medium & Oregonator Chemical Spirals
- **Mechanism**: PDE solver for Oregonator kinetic equations with circulating spiral waves.
- **Causal Hello World**: Letter strokes serve as catalytic PACEMAKER sites.

### Candidate 3: Granular Flow & Bagnold Rheology in Typographic Hoppers
- **Mechanism**: Discrete element method for granular material flowing through typographic funnels with $\mu(I)$ rheology.
- **Causal Hello World**: Characters form hopper boundaries.

## 3. Candidate Selection
**Selection: Candidate 1 (Poincaré Disk Conformal Hyperbolic Tessellation & Möbius Isometries)**.
- Establishes the non-Euclidean Riemannian geometry frontier in V3.
- Exact Möbius automorphisms preserve conformal angles and hyperbolic distance $d_{\mathbb{H}}(z_1, z_2) = 2 \text{arctanh}|\frac{z_1 - z_2}{1 - \bar{z}_1 z_2}|$.
- Pure mathematical rigor and striking geometric aesthetics.

## 4. Mechanism Graph
```
[10 Hello World Fundamental Tile Glyphs]
              │
              ▼
[Hyperbolic Reflection Group Generators: {p, q} Coxeter Inversions]
              │
              ▼
[Poincaré Conformal Metric: ds² = 4|dz|² / (1 - |z|²)²]
              │
              ▼
[Möbius Isometry Group PSU(1,1): T_a(z) = (z - a) / (1 - ā z)]
              │
              ▼
[Infinite Tile Horizon Scaling toward Boundary Circle S¹ (|z| = 1)]
              │
              ▼
[Canvas Rendering: Circular Geodesic Arcs, Disk Vignette & Telemetry]
```

## 5. Evidence Strategy
- `labReady`: Signals when Poincaré disk tiling, Möbius isometry engine, and fundamental domain glyphs are initialized.
- `labEvidence()`: Computes actual runtime geometric invariants:
  - Unit disk boundary containment $\max |z| < 1.0$,
  - Hyperbolic distance invariance under translation $d_{\mathbb{H}}(0, z_k)$,
  - Total tiled polygon count $N_{\text{tiles}} > 50$,
  - Conformal metric curvature $K \equiv -1.0$.
- `labScenario`: Click `#btnTranslateCenter` to apply a discrete Möbius translation along the real axis ($\Delta a = 0.35$), shifting the origin of the hyperbolic plane.
- `labInteractionEvidence()`: Verifies that post-translation coordinates remain strictly inside $\mathbb{D}^2$ ($|z| < 1$) and hyperbolic distances between pairs of glyphs are preserved ($|\Delta d_{\mathbb{H}}| < 10^{-6}$).
