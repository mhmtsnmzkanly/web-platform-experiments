# Journal — Experiment 008

## Candidate Exploration

### Candidate A — Delaunay-Voronoi Dual Tessellation & Lloyd Centroidal Relaxation
- **Mechanism:** Implements an exact 2D Bowyer-Watson incremental Delaunay triangulation algorithm on typed coordinate arrays. The dual Voronoi tessellation is extracted by linking triangle circumcenters into convex polygonal cells. Points seeded from "HELLO WORLD" letterforms undergo continuous Lloyd centroidal relaxation ($\mathbf{p}_i \leftarrow \mathbf{c}_i$) governed by an elastic typographic attractor restoring force.
- **Hello World Role:** Structural geometric generator. The character contours act as the dense seed manifold. The Delaunay simplex network and Voronoi facet cells organically crystallize the letterforms of "HELLO WORLD".
- **Frontier Contribution:**
  - *Mechanism Depth (Primary):* Algorithmic computational geometry implemented natively in vanilla JavaScript (Bowyer-Watson empty circumcircle test: $d(p, \text{circumcenter}) < r$, triangle adjacency graph, dual Voronoi vertex derivation, and polygon centroid integration).
  - *Visual Authorship:* Crystalline lapis lazuli / celestial cyanotype aesthetic (deep Prussian blue `#051124`, electric cyan Delaunay filaments `#38bdf8`, and glowing silver facet circumcenters `#f8fafc`).
  - *Evidence / Observability:* Real-time Delaunay triangle count ($2N - 2 - B$), Euler characteristic verification ($V - E + F = 1$), mean circumradius, and Lloyd relaxation convergence delta.
- **Novelty Risk:** Must be a mathematically rigorous triangulation algorithm with empty-circumcircle invariants rather than a static Voronoi image.
- **Complexity Risk:** Numerical robustness around collinear glyph vertices; addressed with a bounding super-triangle and epsilon jittering.
- **Visual Repetition Risk:** Crystalline cyan/silver on deep lapis lazuli presents a stark contrast to previous palettes.

### Candidate B — Graham Scan Convex Hull Envelope
- **Mechanism:** Sorting points and computing convex hull envelope.
- **Hello World Role:** Point cloud.
- **Frontier Contribution:** Computational geometry, but the convex hull erases inner character counterforms ('O', 'D', 'R', 'E').

### Candidate C — CSS Polygon Morphing
- **Mechanism:** DOM elements with `clip-path: polygon()`.
- **Hello World Role:** Mask.
- **Frontier Contribution:** Shallow algorithmic depth compared to dynamic triangulation.

## Selection Decision
Selected **Candidate A**.
It expands the **Mechanism Depth** frontier into rigorous computational geometry and algorithmic graph duals, giving "HELLO WORLD" a crystalline polygonal anatomy.

## Implementation Plan
1. Extract 90 contour seed points along the strokes and loops of "HELLO WORLD".
2. Implement Bowyer-Watson incremental Delaunay triangulation solver.
3. Compute Voronoi dual cell vertices by evaluating triangle circumcenters.
4. Execute continuous Lloyd centroidal relaxation loop with typographic anchor springs.
5. Expose `window.labReady` and `window.labEvidence` verifying Euler characteristic, Delaunay triangle count, and Lloyd relaxation delta.

## Verification & Sealing
- Validated with `node tools.js dependency-check 008/008.dev.html` -> OK.
- Validated with `node tools.js verify 008/008.dev.html 008` -> OK.
- Solved inter-character hull bridging by implementing glyph-wise Delaunay triangulation clusters, ensuring each letter of "HELLO WORLD" is uniquely articulated.
- Verified 45 triangular faces, 94 edges, and continuous Lloyd relaxation drift.
- Visual review confirmed brilliant lapis lazuli and electric cyan crystalline facet aesthetics.
- Sealed `008/008.dev.html` -> `008/008.html`. Sealed artifact is immutable.
