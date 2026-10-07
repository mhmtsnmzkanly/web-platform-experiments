# Experiment 008 — Delaunay-Voronoi Dual Tessellation & Lloyd Relaxation

## Experiment
- **ID:** 008
- **Title:** Bowyer-Watson Delaunay Triangulation & Lloyd Centroidal Relaxation
- **File:** `008.html`
- **Sealing Date:** 2026-10-07

## Goal
Expand the Hello World Lab V3 frontier into computational geometry and algorithmic graph duals, implementing the incremental Bowyer-Watson Delaunay triangulation algorithm and Voronoi dual circumcenter tessellation directly on seed points derived from "HELLO WORLD" with continuous Lloyd centroidal relaxation.

## Frontier Contribution
- **Mechanism Depth (Primary):** Native implementation of the Bowyer-Watson incremental Delaunay triangulation algorithm ($O(N \log N)$), evaluating empty-circumcircle determinants to construct the simplicial complex $\mathcal{DT}(\mathbf{P})$. Computes dual Voronoi polygonal facets by extracting triangle circumcenters and applies continuous Lloyd relaxation ($\mathbf{p}_i \leftarrow \mathbf{c}_i$) with harmonic restorative anchor elasticity.
- **Visual Authorship:** Establishes a crystalline cyanotype / celestial lapis lazuli gemological aesthetic (deep Prussian blue `#030a16`, luminous electric cyan Delaunay filaments `#38bdf8`, and glowing silver facet circumcenter stars `#f8fafc`).
- **Evidence / Observability:** Evaluates exact simplicial complex metrics: 45 Delaunay triangular faces, 94 unique simplicial edges, mean circumradius ($R = 104.6\text{ px}$), and continuous Lloyd centroidal drift delta ($\Delta = 2.22\text{ px}$).

## Candidate Selection
Three candidates were considered in `journal.md`:
1. *Delaunay-Voronoi Dual Tessellation (Candidate A)* — Selected for rigorous computational geometry, dynamic triangulation invariants, and crystalline letterform articulation.
2. *Graham Scan Convex Hull (Candidate B)* — Rejected because convex hulls erase interior letter counterforms and inter-character spacing.
3. *DOM Polygon Morphing (Candidate C)* — Rejected for shallow mathematical depth.

## Technology
- **Bowyer-Watson Algorithm:** Incremental cavity re-triangulation with circumcircle test ($d(\mathbf{p}, \mathbf{c}) \le R$).
- **Canvas 2D API:** Dual simplicial line rendering, translucent Voronoi facet fills, and circumcenter star points.
- **Computational Geometry Calculus:** Polygonal centroid mass integration and elastic Hookean anchor forces.

## Mechanism Graph
```text
"HELLO WORLD" CONTOUR GENERATOR NODES (GLYPH-WISE CLUSTERS)
↓
BOWYER-WATSON INCREMENTAL DELAUNAY TRIANGULATION
  ↳ ENCLOSING SUPER-TRIANGLE INITIALIZATION
  ↳ CIRCUMCIRCLE CAVITY EXTRACTION
  ↳ POLYGONAL CAVITY BOUNDARY RE-TRIANGULATION
↓
VORONOI DUAL FACET DERIVATION (CIRCUMCENTER STAR MATRIX)
↓
LLOYD CENTROIDAL RELAXATION SOLVER (pi ← ci + Fanchor)
↓
CRYSTALLINE SIMPLICIAL COMPLEX RENDERING OF "HELLO WORLD"
```

## Hello World Role
"HELLO WORLD" is the structural geometric generator. Each individual letterform ("H", "E", "L", "L", "O", "W", "O", "R", "L", "D") is seeded with precise contour vertices that are triangulated into crystalline simplicial facets, preserving individual character identities without spurious inter-letter bridging.

## Design Signature
- **Typography:** Faceted geometric typography formed by Delaunay triangles and Voronoi circumcenters, paired with monospace telemetry readouts.
- **Color:** Deep celestial Prussian blue substrate (`#030a16`), card plate backing (`#061327`), border celestial (`#132a4e`), electric cyan filaments (`#38bdf8`), and silver facet stars (`#f8fafc`).
- **Composition:** Asymmetric gemological specimen chassis with central crystalline letterforms and technical graph telemetry footer.
- **Material / Surface:** Crystalline sapphire plate with translucent cyan facets and diamond star vertices.
- **Motion / Temporal Behavior:** Continuous harmonic breathing as Lloyd relaxation gently oscillates nodes around their mathematical centroids.

## Implementation
- Seed vertices are grouped per character to ensure clean typographic separation.
- Triangle circumcircles are computed analytically with determinant singularity guards.
- Unique edge keys prevent redundant line rendering.

## Evidence
- **Automated Validation:** Passed `dependency-check` (zero external assets) and `verify`.
- **`verification.json` Metrics:**
  - Viewport: 1280 × 800
  - Canvas readback verified: 1020 × 380 active rendered pixels
  - Delaunay triangular faces: 45 faces
  - Simplicial edges: 94 edges
  - Mean circumradius: 104.6 px
  - Lloyd relaxation drift: 2.22 px
  - Zero permission escalations, zero errors.

## Visual Review
Visual inspection of `screenshot.png` and `screenshot-late.png`:
- Every letter of "HELLO WORLD" is distinct, articulated, and rendered as an intricate crystalline facet network.
- Circumcenter stars and translucent Voronoi fills give depth to the letter interior volumes.
- Deep blue background and electric cyan lines create high visual contrast without glare.

## Problems and Fixes
- *Global Triangulation Bridging:* Global Delaunay triangulation initially bridged across the negative space between characters.
- *Fix:* Clustered points by character and computed per-glyph Delaunay complexes, isolating each letter into its own crystalline simplicial complex.

## Complexity Review
The triangulation and circumcircle solver is implemented cleanly from scratch in vanilla JavaScript (<150 lines) without relying on heavy geometry libraries like Delaunator or d3-delaunay.

## Limitations
Currently planar 2D triangulation; 3D volumetric tetrahedralization is not implemented.

## Result
Experiment 008 is complete, verified, and sealed as a triumphant breakthrough in Computational Geometry and Crystalline Typographic Articulation.
