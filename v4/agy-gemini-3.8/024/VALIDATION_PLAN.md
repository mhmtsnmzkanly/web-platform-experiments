# VALIDATION PLAN: EXP-024 POCKET-TERRARIUM

## 1. Verification Strategy
This document establishes the empirical validation suite and a priori numerical tolerances for **POCKET-TERRARIUM (EXP-024)**, adhering strictly to Hardening Protocol 2.0.

---

## 2. Test Suites & Pass Criteria

### Suite 1: Nitrogen Cycle & Mass Conservation (NITRO)
- **NITRO-01:** Three-Stage Cascading Oxidation Kinetics:
  Inoculated with *Nitrosomonas* and *Nitrobacter*, an initial spike of Ammonia ($2.0\text{ mg/L}$) must sequentially convert into a transient peak of Nitrite ($\text{NO}_2^-$), followed by conversion to stable Nitrate ($\text{NO}_3^-$).
  - *Tolerance:* Peak time ordering $t_{\text{peak}}(\text{NH}_3) < t_{\text{peak}}(\text{NO}_2^-) < t_{\text{peak}}(\text{NO}_3^-)$.
- **NITRO-02:** Strict Nitrogen Mass Accounting:
  In a closed sterile test volume without plants:
  $$N_{\text{inorganic}} = [\text{NH}_3] \cdot \frac{14}{17} + [\text{NO}_2^-] \cdot \frac{14}{46} + [\text{NO}_3^-] \cdot \frac{14}{62}$$
  - *Tolerance:* Nitrogen mass drift $\le 0.05\%$ over 500 integration steps.
- **NITRO-03:** Plant Nitrate Assimilation:
  Planted vivarium with initial $[\text{NO}_3^-] = 20.0\text{ mg/L}$ demonstrates monotonic uptake into plant biomass.
  - *Tolerance:* $[\text{NO}_3^-]$ decreases monotonically toward steady-state with $> 30\%$ depletion over 10 simulated hours.

### Suite 2: Photosynthesis, Respiration & Gas Exchange (OXY)
- **OXY-01:** Diurnal Oxygen Cycle:
  During daylight hours ($I > 0$), photosynthetic production $P(I) > R$, driving $[\text{DO}]$ above dark levels. During darkness ($I = 0$), respiration consumes oxygen.
  - *Tolerance:* $[\text{DO}]_{\text{day}} > [\text{DO}]_{\text{night}}$ with $[\text{DO}] \in [0, 15.0]\text{ mg/L}$.
- **OXY-02:** Henry's Law Equilibrium:
  Zero-biomass aerated water converges to saturation $[\text{DO}]_{\text{sat}} = 8.24\text{ mg/L} \pm 0.1\text{ mg/L}$ from hypoxic initial conditions ($1.0\text{ mg/L}$).
  - *Tolerance:* $|\text{DO}(t_{\text{end}}) - 8.24| \le 0.1\text{ mg/L}$ after sufficient surface reaeration.
- **OXY-03:** Aerator Bubbler Boost:
  Active bubbler accelerates dissolved oxygen infusion rate ($k_{\text{bubbler}} > k_{\text{surface}}$).
  - *Tolerance:* Time to 90% saturation with bubbler is $\le 50\%$ of natural surface diffusion time.

### Suite 3: Carbonate Buffer Chemistry & pH (PH)
- **PH-01:** Daytime Alkalinity Shift:
  Active $\text{CO}_2$ consumption raises pH by $+0.3$ to $+1.0$ units relative to baseline.
  - *Tolerance:* $\Delta \text{pH}_{\text{day}} > 0$.
- **PH-02:** Nighttime Respiration Acidification:
  $\text{CO}_2$ accumulation lowers pH by $-0.2$ to $-0.8$ units.
  - *Tolerance:* $\Delta \text{pH}_{\text{night}} < 0$, strictly bounded by buffer capacity $\text{pH} \in [6.2, 8.8]$.

### Suite 4: Multi-Trophic Predation & Grazing (PRED)
- **PRED-01:** Holling Type II Satiation Curve:
  Zooplankton grazing rate saturates monotonically with increasing algal density.
  - *Tolerance:* $\frac{\partial f}{\partial A} > 0$ and $\frac{\partial^2 f}{\partial A^2} < 0$.
- **PRED-02:** Guppy Predation & Energetic Satiation:
  Fish hunting Daphnia increments stomach satiety and triggers fry reproduction once reproductive threshold is reached.
  - *Tolerance:* Non-negative satiety, successful reproduction when conditions met.
- **PRED-03:** Hypoxic & Toxic Mortality:
  Prolonged exposure to $[\text{DO}] < 1.0\text{ mg/L}$ or $[\text{NH}_3] > 1.5\text{ mg/L}$ initiates mortality queue without negative population counts.
  - *Tolerance:* Living fish count $\ge 0$ strictly enforced.

### Suite 5: Simulation Lifecycle & Water Changes (STATE)
- **STATE-01:** Deterministic Dilution on Partial Water Change:
  A $50\%$ water change with clean fresh water dilutes all dissolved chemical solutes ($[\text{NH}_3], [\text{NO}_2^-], [\text{NO}_3^-]$) by exactly $50\%$.
  - *Tolerance:* Relative error $\le 0.01\%$.
- **STATE-02:** Unique Entity ID Invariant:
  All fish, snails, and plants maintain strictly unique string IDs throughout birth and death lifecycles.
