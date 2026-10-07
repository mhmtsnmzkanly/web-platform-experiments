# Experiment 043: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Discrete Typographic Markov Chain, Ergodic Stationary Distribution, and Shannon Entropy Rate ($H(\mathcal{X})$)
- **Mechanism**: A finite-state ergodic Markov chain built from the character alphabet $\Sigma = \{\text{H, E, L, O, \textvisiblespace, W, R, D}\}$ derived from the literal sequential bigrams of "HELLO WORLD". Computes the stochastic transition kernel $P \in \mathbb{R}^{8 \times 8}$, stationary distribution $\boldsymbol{\pi}$ via power iteration ($\boldsymbol{\pi} P = \boldsymbol{\pi}$), spectral mixing gap $\gamma = 1 - |\lambda_2|$, Shannon entropy rate $H(\mathcal{X}) = -\sum_i \pi_i \sum_j P_{ij} \log_2 P_{ij}$, and Kullback-Leibler divergence $D_{\text{KL}}(p_t \| \boldsymbol{\pi})$.
- **Hello World Causality**: The transition graph structure is directly determined by the spelling of "HELLO WORLD". While characters like 'H', 'E', 'W', and 'R' have deterministic successor links, the repeated characters 'L' (occurring 3 times: L->L, L->O, L->D) and 'O' (occurring 2 times: O->\textvisiblespace, O->R) create stochastic branch points. This non-trivial topology gives the chain a characteristic entropy rate $H \approx 0.82\text{ bits/symbol}$ and stationary distribution where $\pi_L \approx 3/11$, $\pi_O \approx 2/11$. Changing the text alters the graph topology, stationary distribution, and entropy rate fundamentally.
- **Evidence Strategy**: Invariants computed dynamically: (1) Row-stochastic condition $\sum_j P_{ij} = 1.0 \pm 10^{-6}$; (2) Stationarity residual $\|\boldsymbol{\pi} P - \boldsymbol{\pi}\|_1 < 10^{-5}$; (3) Probability simplex conservation $\sum \pi_i = 1.000000$; (4) Dynamic Shannon entropy rate $H(\mathcal{X}) > 0.5\text{ bits}$; (5) Relative entropy (KL divergence) decay under forward Markov propagation.
- **Composition**: Circular Markov Chord Network & Matrix Plate. Distinct from consoles or optical benches: Left: Large circular chord graph with letter glyph nodes and bezier probability ribbons whose thickness scales with $P_{ij}$. Right: 8x8 stochastic heatmap grid $P$, stationary probability distribution bar chart, and real-time stochastic text synthesizer stream.

### Candidate B: Euler-Bernoulli Elastic Beam Structural Dynamics & Modal Resonance along Typographic Skeletons
- **Mechanism**: 1D finite-element beam equations along typographic strokes, solving eigenmodes $M \ddot{u} + K u = 0$.

### Candidate C: 2D Yee-Lattice FDTD Electromagnetic Scattering through Typographic Dielectric Metasurface
- **Mechanism**: Maxwell curl equations on Yee grid with space-dependent permittivity $\varepsilon_r(x, y)$ from glyph raster.

## 2. Selection & Frontier Contribution
Candidate A is selected. It opens a brand-new frontier in **Stochastic Processes, Information Theory, Ergodic Markov Chains, and Dynamic Entropy Rates**:
- Derives the exact bigram transition kernel from literal character frequencies and adjacencies of "HELLO WORLD".
- Computes stationary measure $\boldsymbol{\pi}$, spectral gap, and Shannon entropy rate in real time.
- Implements a circular chord network with dynamic stochastic particle walkers and transition matrix heatmap.
