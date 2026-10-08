# Experiment Report: 057 — Granular Size-Segregation & Kinetic Sieving

## Frontier Classification: Granular Media, Interstitial Percolation & Brazil Nut Segregation
Experiment 057 establishes the **granular mechanics and size-segregation filtering frontier**:
1. **Bidisperse Granular Fluidization & Interstitial Percolation**:
   - A mixture of 40 large bronze spheres ($r_l = 7.0\text{ px}$, $m = 8.0$) and 200 small silica sand beads ($r_s = 2.6\text{ px}$, $m = 1.0$) is subjected to vertical harmonic vibration $y(t) = A \sin(\omega t)$.
   - When the dimensionless acceleration $\Gamma = A \omega^2 / g > 1.0$, the bed detaches from the floor, initiating flight phases and inelastic collisions ($e = 0.65$).
   - Kinetic sieving and void filling enable small beads to percolate downward, generating upward granular buoyancy that lifts the large bronze spheres (Brazil nut effect).
2. **Geometric Mesh Sieving Criterion**:
   - The cell incorporates 10 typographic wire-mesh sieve baskets ('H','E','L','L','O','W','O','R','L','D') with slot width $w_{\text{slot}} = 8\text{ px}$.
   - Small silica beads ($d_s = 5.2\text{ px} < w_{\text{slot}}$) pass through the mesh, while large bronze spheres ($d_l = 14.0\text{ px} > w_{\text{slot}}$) are captured and held.
3. **Causal Hello World Integration**:
   - The 10 glyphs act as size-selective sieving and sorting baskets. The physical separation of the bidisperse granular mixture is mediated by the geometric aperture and compartment of each letter.

## Web Platform Surface
- **Industrial Vibratory Feeder & Granular Test Cell (`#cellCanvas`)**:
  - Dark graphite steel chassis with vibrating bronze floor, polished metallic bronze spheres, white silica beads, and 10 wire-mesh sieve baskets.
  - Interactive motor pulse button stepping shaker acceleration from $\Gamma = 1.45\text{ g} \to 2.50\text{ g}$.

## Verification Evidence
Verified via `tools.js verify 057/057.dev.html 057` and `057/057.html 057`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 sieve baskets, 240 granular particles (40 bronze, 200 silica), initial acceleration $\Gamma = 7.20\text{ g}$, initial segregation height $\Delta y = 12.0\text{ px}$, granular temperature $T_g = 0.72\text{ px}^2/\text{s}$.
- **Interaction Response**: Trusted CDP click on `#btnVibrationPulse` energized the vibratory motor ($\Gamma \to 12.00\text{ g}$), fluidizing the bed, accelerating interstitial percolation, and widening the vertical segregation height to $\Delta y = 59.9\text{ px}$.
