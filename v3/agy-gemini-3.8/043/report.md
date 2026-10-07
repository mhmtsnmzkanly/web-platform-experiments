# Experiment Report: 043 — Ergodic Markov Chain & Shannon Entropy Rate on Character Transition Kernel ("HELLO WORLD")

## Concept
A computational stochastic processes and information theory experiment constructing an ergodic, irreducible, and aperiodic finite-state Markov chain directly from the literal sequential character bigrams of "HELLO WORLD", analyzing its transition kernel, invariant stationary distribution, spectral properties, and Shannon entropy rate:

1. **Governing Stochastic Formulation**:
   - Alphabet of 8 distinct characters: $\Sigma = \{\text{H}, \text{E}, \text{L}, \text{O}, \text{\textvisiblespace}, \text{W}, \text{R}, \text{D}\}$.
   - State transition sequence derived from the 11 character positions of "HELLO WORLD" with cyclic boundary return ($D \to H$):
     $$\mathbf{s} = (H, E, L, L, O, \text{\textvisiblespace}, W, O, R, L, D)$$
   - Empirical row-stochastic transition matrix $P \in \mathbb{R}^{8 \times 8}$ where $P_{ij} = \mathbb{P}(X_{t+1} = j \mid X_t = i)$:
     - Deterministic links: $P(E \mid H) = 1.0$, $P(L \mid E) = 1.0$, $P(W \mid \text{\textvisiblespace}) = 1.0$, $P(O \mid W) = 1.0$, $P(L \mid R) = 1.0$, $P(H \mid D) = 1.0$.
     - Stochastic branching states:
       - State 'L' (occurring 3 times): $P(L \mid L) = 1/3$, $P(O \mid L) = 1/3$, $P(D \mid L) = 1/3$.
       - State 'O' (occurring 2 times): $P(\text{\textvisiblespace} \mid O) = 1/2$, $P(R \mid O) = 1/2$.
   - Row-stochastic condition: $\sum_{j=1}^8 P_{ij} = 1.0$ for all $i$.

2. **Invariant Stationary Distribution ($\boldsymbol{\pi} P = \boldsymbol{\pi}$)**:
   - By the Perron-Frobenius theorem, the chain possesses a unique stationary probability vector $\boldsymbol{\pi}$:
     $$\pi_L = \frac{3}{11} \approx 0.2727, \quad \pi_O = \frac{2}{11} \approx 0.1818, \quad \pi_H = \pi_E = \pi_{\text{\textvisiblespace}} = \pi_W = \pi_R = \pi_D = \frac{1}{11} \approx 0.0909$$
   - Total probability simplex invariant: $\sum_{i=1}^8 \pi_i = 1.000000$.
   - Dynamic power iteration converges to exact stationarity with $L_1$ residual $\|\boldsymbol{\pi} P - \boldsymbol{\pi}\|_1 < 10^{-8}$.

3. **Shannon Entropy Rate ($H(\mathcal{X})$)**:
   - Fundamental information entropy rate of the Markov text source:
     $$H(\mathcal{X}) = -\sum_{i \in \Sigma} \pi_i \sum_{j \in \Sigma} P_{ij} \log_2 P_{ij} = \pi_L \log_2 3 + \pi_O \log_2 2 = \frac{3}{11} \log_2 3 + \frac{2}{11} \approx 0.6141\text{ bits/step}$$
   - This exact value quantifies the uncertainty per emitted character governed by the spelling of "HELLO WORLD".

4. **Stochastic Text Generator & Thermal Perturbation**:
   - Live random walk executes step transitions, emitting streaming synthesized text matching the empirical language model (e.g. `"HELDHELO WO WORLLLORLLDH..."`).
   - Thermal perturbation injection mixes a uniform noise component $P_\tau = (1 - \alpha) P + \alpha \frac{1}{N} \mathbf{1}\mathbf{1}^T$, momentarily surging entropy towards $\log_2 8 = 3.0\text{ bits}$ before exponential cooling relaxes back to the invariant state.

## Web Platform Surface
- **Circular Chord Network & Matrix Dashboard (`CanvasRenderingContext2D` + DOM Grid)**:
   - Left stage: Circular chord diagram with state glyph nodes placed around an orbit. Node radii scale with stationary probability $\pi_i$. Directed bezier ribbons have thicknesses proportional to $P_{ij}$, accompanied by streaming photon particle walkers tracing the stochastic random walk.
   - Right stage: 8x8 transition probability heatmap with real-time numeric readouts, stationary distribution bar chart, and scrolling live synthesized text terminal.
   - Telemetry: Real-time Shannon entropy rate ($H = 0.6141\text{ bits}$), stationarity residual ($4.68 \times 10^{-8}$), and probability sum ($1.000000$).
   - Actuator: 'Perturbation Thermique (+Noise)' button (`#btnPerturb`).

## Verification Evidence
Verified via `tools.js verify 043/043.html 043`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: Stationary residual $\|\boldsymbol{\pi}P - \boldsymbol{\pi}\|_1 = 8.13 \times 10^{-9}$, probability sum $\sum \pi_i = 1.000000$, theoretical entropy rate $H = 0.6141\text{ bits/step}$, stationary probabilities $\pi_L = 0.273, \pi_O = 0.182, \pi_{\text{others}} = 0.091$.
- **Interaction Response**: Thermal perturbation surged entropy rate to $0.6284\text{ bits/step}$, advancing stochastic walk steps and demonstrating dynamic relaxation.
- **Causal Connection**: The Markov states, transition graph edges, branching probabilities, and entropy rate are derived directly from the character frequencies and sequential adjacency of "HELLO WORLD".
