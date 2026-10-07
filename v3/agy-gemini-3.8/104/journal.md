# Experiment 104 — Journal: Frontier Atlas (Visual System / Art Direction Frontier)

## Frontier Interpretation: 104 — Visual System / Art Direction Frontier
The visual system frontier demands authentic visual authorship. The experiment must not default to the generic scientific chassis (central canvas + right telemetry + top status strip). Instead, mechanism, spatial layout, hierarchy, material language, and Hello World presentation must form a unified visual concept. Restraint and intentionality are prized over ornamental clutter.

---

## Candidates Considered

### Candidate A: De Stijl / Bauhaus Dynamic Asymmetric Neoplastic Grid & Chromatic Equilibrium
- **Concept & Authorship**:
  - Neoplastic constructivism (Piet Mondrian, Gerrit Rietveld, Theo van Doesburg).
  - Spatial composition: Asymmetric rectilinear partition of the viewport bounded by deep black grid mullions ($8\text{px}$ to $18\text{px}$), primary color planes (Cadmium Red, Ultramarine Blue, Chrome Yellow, Stark Alabaster White), and architectural typography.
  - Core Mechanism: **Harmonic Visual Mass Equilibrium**:
    - Each cell $k$ has area $A_k$, center $\mathbf{x}_k$, and chromatic density $\rho_k$ (Red $= 2.0$, Blue $= 1.6$, Yellow $= 1.3$, White $= 0.7$).
    - Center of visual gravity:
      $$\mathbf{C}_{\text{vis}} = \frac{\sum_k \rho_k A_k \mathbf{x}_k}{\sum_k \rho_k A_k}$$
    - The letters of "HELLO WORLD" are spatial architectural occupants of the 10 grid cells. Each letter dynamically scales and aligns within its chromatic volume.
    - Interacting with the dividing mullion axes redistributes the cell areas along orthogonal rails, shifting visual tension and re-establishing harmonic equilibrium.
- **Causal Typographic Role**:
  - The 10 letters of "HELLO WORLD" directly occupy the 10 neoplastic cells. Character aspect ratios (narrow 'l' vs wide 'W') and glyph contrasts dictate the cell minimum bounds and layout equilibrium.
- **Visual Composition**:
  - Pure Neoplastic Canvas/DOM Broadsheet: No telemetry dials, no sci-fi panels, no cockpit hud. Pure asymmetric primary geometry, bold black lines, crisp constructivist typography, and Bauhaus architectural titling.

### Candidate B: Japanese Ukiyo-e Woodblock Print & Bokashi Pigment Layering
- **Concept**: Multi-block color registration pins, washi paper fiber, and indigo/sumi ink washes.
- **Why Deferred**:
  - Candidate A offers a more radical compositional departure from previous runs by replacing the entire UI layout with an asymmetric neoplastic painting whose geometry is the physical mechanism.

### Candidate C: Concrete Brutalist Monolith & Chiseled Typographic Relief
- **Concept**: Monolithic architectural concrete blocks with cast shadow relief.
- **Why Deferred**:
  - Candidate A's dynamic neoplastic grid directly links color theory, area partitioning, and typography into a unified visual system.

---

## Selected Candidate: Candidate A (De Stijl / Bauhaus Dynamic Asymmetric Neoplastic Grid)

### Mechanism Graph
```
Neoplastic Orthogonal Rails (X_div, Y_div)
                 |
                 v
Asymmetric 10-Cell Partition Matrix (HELLO WORLD Occupants)
                 |
                 +-----------------------------------+
                 |                                   |
                 v                                   v
    Cell Areas & Aspect Ratios            Chromatic Densities rho_k
       (A_k = w_k * h_k)               (Cadmium Red, Blue, Yellow, White)
                 |                                   |
                 +-----------------+-----------------+
                                   |
                                   v
             Center of Visual Mass Equilibrium C_vis
                                   |
                                   v
         Dynamic Glyphtropic Scaling & Orthogonal Rail Gliding
```

### Invariant & Evidence Strategy
- **Total Area Conservation**: $\sum_{k=1}^{10} A_k = W_{\text{viewport}} \times H_{\text{viewport}} - A_{\text{mullions}}$ within $0.01\%$.
- **Visual Gravity Computation**: Dynamic center of visual mass $\mathbf{C}_{\text{vis}}$ derived from live cell geometries and chromatic weights.
- **`labScenario`**: Click `#btnRebalance` to trigger constructivist rail translation and chromatic transposition.
- **`labInteractionEvidence()`**: Verifies that shifting rails moved the visual center of mass ($\Delta \mathbf{C}_{\text{vis}} > 15\text{px}$) and re-proportioned cell areas across all 10 letters of "HELLO WORLD".
