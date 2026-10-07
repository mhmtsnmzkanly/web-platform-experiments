# Candidate Journal: Experiment 041

## Objective
Begin the 041–050 frontier run with a non-repeating, deeply causal fluid dynamics mechanism: Lattice Boltzmann Method (LBM) D2Q9 flow through a typographic porous medium. Address all three user directives:
1. Derived evidence (never hardcoded, exact momentum exchange and mass conservation).
2. Causal Hello World (fluid Navier-Stokes behavior dictated by actual raster apertures, enclosed cavities, and frontal drag of "HELLO WORLD").
3. Compositional novelty (wide aerodynamic wind tunnel test-section with bottom Schlieren polar waterfall; avoiding the framed chassis / left canvas / right sidebar silhouette).

## Candidates

### Candidate A: 2D Lattice Boltzmann (D2Q9) Wind Tunnel with Typographic Porous Obstacles
- **Mechanism**:
  - D2Q9 velocity lattice with Bhatnagar-Gross-Krook (BGK) collision operator:
    $$f_i(\mathbf{x} + \mathbf{c}_i \Delta t, t + \Delta t) = f_i(\mathbf{x}, t) - \frac{1}{\tau} \left( f_i(\mathbf{x}, t) - f_i^{eq}(\rho, \mathbf{u}) \right)$$
  - Equilibrium distribution functions:
    $$f_i^{eq} = w_i \rho \left( 1 + \frac{3 \mathbf{c}_i \cdot \mathbf{u}}{c^2} + \frac{9 (\mathbf{c}_i \cdot \mathbf{u})^2}{2 c^4} - \frac{3 |\mathbf{u}|^2}{2 c^2} \right)$$
  - Half-way bounce-back boundary conditions on the exact solid binary bitmap of "HELLO WORLD" (`CHARS = 'HELLOWORLD'`).
  - Hydrodynamic drag and lift forces computed via momentum exchange method at all fluid-solid interface links:
    $$\mathbf{F}_{drag} = \sum_{\mathbf{x}_b} \sum_{i} \mathbf{c}_i \left( f_i(\mathbf{x}_b, t) + f_{\bar{i}}(\mathbf{x}_f, t) \right)$$
  - Vorticity field $\omega = \partial_x u_y - \partial_y u_x$ showing von Kármán vortex street shedding downstream of the letters.
- **Causal Subject Integration**:
  - The literal typographic bitmap of "HELLO WORLD" acts as the physical porous obstacle. Air must squeeze through the inter-letter gaps, circulate inside the hollow bowls of 'O' and 'D', and shear along the serifs of 'H', 'E', 'L', 'W', 'R'. Total aerodynamic drag $C_D$ and pressure drop $\Delta P$ are direct functions of the typographic font metrics and letter spacing.
- **Evidence Strategy**:
  - Total mass $\sum \rho$ strictly conserved to within $10^{-5}\%$.
  - Drag force $F_D(t)$ dynamically integrated over all solid boundary nodes.
  - Vorticity magnitude and Reynolds number $Re = U L / \nu$ dynamically computed from live velocity fields.
  - Interaction: Inflow velocity perturbation jumps Reynolds number and triggers vortex shedding transition, verified by live vorticity variance.
- **Composition Silhouette**:
  - Horizontal aerodynamic Schlieren wind tunnel stream spanning the full width of the view, with dual aerodynamic polar trace panels underneath. No chassis framing or generic sidebars.

### Candidate B: 2D Navier-Stokes Vorticity-Streamfunction Finite Difference Solver
- **Mechanism**:
  - 4th-order Runge-Kutta integration of vorticity transport equation $\partial_t \omega + (\mathbf{u} \cdot \nabla) \omega = \nu \nabla^2 \omega$ coupled to Poisson solver $\nabla^2 \psi = -\omega$.
- **Trade-offs**:
  - Complex immersed boundary conditions on irregular typographic geometries require penalization or cut-cell methods which can be numerically stiff and slower than LBM in real-time JavaScript.

### Candidate C: Smoothed Particle Hydrodynamics (SPH) Viscoelastic Non-Newtonian Flow
- **Mechanism**:
  - SPH particles with Oldroyd-B polymer stress tensor.
- **Trade-offs**:
  - Similar particle lineage to Experiment 038; would risk mechanism overlap with SPH rather than expanding to discrete velocity Boltzmann gas lattices.

## Selection & Decision
**Candidate A (Lattice Boltzmann D2Q9 Typographic Porous Wind Tunnel)** is selected. It introduces a major new computational physics lineage (mesoscopic kinetic theory / LBM), embeds the literal typographic bitmap of "HELLO WORLD" directly into the bounce-back boundary links, computes dynamic aerodynamic forces via momentum exchange, and features an aerodynamic Schlieren wind tunnel composition.
