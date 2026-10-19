# SCIENTIFIC & TECHNICAL CONTRACT: EXP-024 POCKET-TERRARIUM

## 1. Executive Specification & Scientific Phenomenon
**POCKET-TERRARIUM** is an interactive, tactile aquatic vivarium, micro-ecology simulator, and water chemistry laboratory. It models the multi-trophic ecological dynamics, biochemical nitrogen cycle, diurnal photosynthetic/respiratory gas exchange, and carbonate buffer chemistry of a closed aquatic ecosystem.

---

## 2. Scientific Fidelity Classification
- **Nitrogen Cycle & Nitrification Kinetics:** **LEVEL A** — Solves continuous 3-stage biochemical oxidation ODEs ($\text{NH}_3 \to \text{NO}_2^- \to \text{NO}_3^-$) using Monod enzyme kinetics and strict nitrogen mass conservation.
- **Photosynthesis & Dissolved Oxygen (DO):** **LEVEL A** — Models diurnal irradiance curves, chlorophyll oxygen synthesis, aerobic metabolic respiration, and Henry's Law atmospheric boundary gas diffusion.
- **Trophic Population & Predation Dynamics:** **LEVEL B** — Multi-trophic population interactions governed by Lotka-Volterra equations with Holling Type II functional feeding response:
  $$\text{Algae} \xrightarrow{\text{graze}} \text{Daphnia/Snails} \xrightarrow{\text{predation}} \text{Guppy Fish}$$
- **Carbonate Chemistry & pH Dynamics:** **LEVEL B** — Dynamic pH response coupled to dissolved $\text{CO}_2$ concentration and bicarbonate buffering equilibrium.
- **Agent Boids Kinematics:** **LEVEL C** — Flocking, collision avoidance, boundary bounce, and foraging kinematics for fish, zooplankton, and snails.

---

## 3. Governing Equations & Biochemical Kinetics

### 3.1 The Biological Nitrogen Cycle
In an aquatic bio-system, fish excretion and organic decomposition produce toxic Total Ammonia Nitrogen ($\text{TAN} = \text{NH}_3 + \text{NH}_4^+$):
1. **Ammonia Oxidation by *Nitrosomonas*:**
   $$2\text{NH}_3 + 3\text{O}_2 \xrightarrow{k_1} 2\text{NO}_2^- + 2\text{H}^+ + 2\text{H}_2\text{O}$$
   Rate: $\frac{d[\text{NH}_3]}{dt} = -\mu_1 \cdot \frac{[\text{NH}_3]}{K_{\text{NH3}} + [\text{NH}_3]} \cdot \frac{[\text{DO}]}{K_{\text{DO}} + [\text{DO}]} \cdot B_1 + \text{Excretion}$
2. **Nitrite Oxidation by *Nitrobacter*:**
   $$2\text{NO}_2^- + \text{O}_2 \xrightarrow{k_2} 2\text{NO}_3^-$$
   Rate: $\frac{d[\text{NO}_2^-]}{dt} = \mu_1 [\text{NH}_3\text{ consumed}] - \mu_2 \cdot \frac{[\text{NO}_2^-]}{K_{\text{NO2}} + [\text{NO}_2^-]} \cdot \frac{[\text{DO}]}{K_{\text{DO}} + [\text{DO}]} \cdot B_2$
3. **Plant Nitrate Assimilation:**
   $$\frac{d[\text{NO}_3^-]}{dt} = \mu_2 [\text{NO}_2^-\text{ consumed}] - U_{\text{plant}} \cdot \text{Biomass}_{\text{plants}} \cdot \frac{[\text{NO}_3^-]}{K_{\text{plant}} + [\text{NO}_3^-]}$$

### 3.2 Dissolved Oxygen (DO) & Diurnal Irradiance
- **Solar/Light Irradiance $I(t)$:**
  $$I(t) = I_{\max} \cdot \max\left(0, \sin\left(\frac{2\pi (t - t_{\text{dawn}})}{T_{\text{day}}}\right)\right) + I_{\text{lamp}}$$
- **Photosynthetic Oxygen Generation $P(I)$:**
  $$P(I) = P_{\max} \cdot \frac{I(t)}{K_I + I(t)} \cdot (\text{Algae} + 0.6 \cdot \text{Plants})$$
- **Total Aerobic Respiration $R$:**
  $$R = R_{\text{fish}} \cdot N_{\text{fish}} + R_{\text{daphnia}} \cdot N_{\text{daphnia}} + R_{\text{snail}} \cdot N_{\text{snail}} + R_{\text{bacteria}} \cdot (B_1 + B_2) + R_{\text{dark}} \cdot (\text{Algae} + \text{Plants})$$
- **Atmospheric Gas Exchange (Henry's Law Surface Reaeration):**
  $$F_{\text{air}} = K_L \cdot ([\text{DO}]_{\text{sat}} - [\text{DO}])$$
  where $[\text{DO}]_{\text{sat}} \approx 8.24\text{ mg/L}$ at $25^\circ\text{C}$.
- **Net DO ODE:**
  $$\frac{d[\text{DO}]}{dt} = P(I) - R + F_{\text{air}} + F_{\text{bubbler}}$$

### 3.3 Carbonate Buffer System & pH Evolution
Dissolved carbon dioxide hydrates to carbonic acid, dissociating into bicarbonate:
$$\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 \rightleftharpoons \text{H}^+ + \text{HCO}_3^-$$
During active photosynthesis, $\text{CO}_2$ is rapidly consumed, driving equilibrium left and shifting $\text{pH}$ up ($7.2 \to 8.2$). At night, cumulative respiration releases $\text{CO}_2$, lowering $\text{pH}$ ($8.0 \to 6.9$).
$$\text{pH}(t) = \text{pH}_0 + \gamma \log_{10}\left(\frac{P(I) + 0.05}{R + 0.05}\right)$$

### 3.4 Multi-Trophic Foraging Kinetics (Holling Type II)
- **Zooplankton (Daphnia) grazing on Micro-Algae $A$:**
  $$f_{\text{graze}}(A) = \frac{a_A \cdot A}{1 + a_A h_A A}$$
- **Guppy predation on Daphnia $D$:**
  $$f_{\text{pred}}(D) = \frac{a_D \cdot D}{1 + a_D h_D D}$$
- Satiated fish accumulate reproductive energy $E_{\text{rep}} \ge E_{\text{thresh}} \implies$ birth of fry.
- Starving or suffocating ($[\text{DO}] < 2.0\text{ mg/L}$) organisms suffer mortality.

---

## 4. Dimensional Analysis & Unit Ledger

| Physical Quantity | Symbol | Internal Unit | Standard Unit | Operational Range |
| :--- | :--- | :--- | :--- | :--- |
| Water Volume | $V$ | Liters ($\text{L}$) | $\text{m}^3$ ($1\text{ L} = 10^{-3}\text{ m}^3$) | $10.0 - 50.0\text{ L}$ (Default $25.0\text{ L}$) |
| Dissolved Oxygen | $[\text{DO}]$ | $\text{mg/L}$ (ppm) | $\text{g/m}^3$ | $0.0 - 15.0\text{ mg/L}$ (Hypoxic $< 2.0$) |
| Ammonia | $[\text{NH}_3]$ | $\text{mg/L}$ (ppm) | $\text{g/m}^3$ | $0.0 - 10.0\text{ mg/L}$ (Toxic $> 0.5$) |
| Nitrite | $[\text{NO}_2^-]$ | $\text{mg/L}$ (ppm) | $\text{g/m}^3$ | $0.0 - 10.0\text{ mg/L}$ (Toxic $> 0.75$) |
| Nitrate | $[\text{NO}_3^-]$ | $\text{mg/L}$ (ppm) | $\text{g/m}^3$ | $0.0 - 150.0\text{ mg/L}$ (Plant nutrient) |
| pH | $\text{pH}$ | Dimensionless | $-\log_{10}[H^+]$ | $6.0 - 9.0$ |
| Water Temperature | $T_w$ | ${}^\circ\text{C}$ | Kelvin ($\text{K}$) | $18.0 - 32.0^\circ\text{C}$ |
| Diurnal Time | $t_{\text{day}}$ | Hours ($0-24\text{ h}$) | Seconds ($\text{s}$) | $1\text{ sim hr} = 5\text{ real seconds}$ |

---

## 5. Numerical Integrator & Invariants
- **Integrator:** 4th-order Runge-Kutta (RK4) for coupled water chemistry ODEs ($[\text{NH}_3], [\text{NO}_2^-], [\text{NO}_3^-], [\text{DO}], \text{Algae}$) with fixed sub-stepping ($\Delta t = 0.05\text{ s}$).
- **Nitrogen Conservation Invariant:** In a closed vivarium without water change or feeding:
  $$N_{\text{total}} = V \cdot \left( [\text{NH}_3] + [\text{NO}_2^-] + [\text{NO}_3^-] \right) + \sum N_{\text{biomass}} = \text{Constant} \pm 0.01\%$$
- **Oxygen Balance Invariant:** $\Delta [\text{DO}] = \int (P(I) - R + F_{\text{surface}} + F_{\text{bubbler}}) dt$ holds to within floating-point tolerance.
- **Population Integrity:** Entity collections managed via single-owner staged mutation queues (read state $\to$ compute feeding/death $\to$ commit births/deaths $\to$ validate non-negative populations).
