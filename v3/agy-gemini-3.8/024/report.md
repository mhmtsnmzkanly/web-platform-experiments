# Experiment Report: 024 — De Bruijn Graph Sequence Assembly & Eulerian Path Reconstitution

## Concept
A computational genomics and discrete graph theory apparatus where the string "HELLOWORLD" acts as the **direct causal genome** decomposed into overlapping $k$-mers, constructing an exact De Bruijn graph $G = (V, E)$ and solving sequence assembly via Eulerian trail traversal:
1. **$k$-mer Decomposition ($k=3$)**:
   The string "HELLOWORLD" (length 10) is fragmented into $10 - 3 + 1 = 8$ overlapping contiguous 3-mers:
   $$\{\text{HEL}, \text{ELL}, \text{LLO}, \text{LOW}, \text{OWO}, \text{WOR}, \text{ORL}, \text{RLD}\}$$
2. **De Bruijn Graph Topology ($G = (V, E)$)**:
   - Vertices ($V$): Directed $(k-1)$-mers (2-mers) forming the prefix/suffix nodes:
     $$V = \{\text{HE}, \text{EL}, \text{LL}, \text{LO}, \text{OW}, \text{WO}, \text{OR}, \text{RL}, \text{LD}\}, \quad |V| = 9$$
   - Directed Edges ($E$): Directed transitions where an edge from prefix $(c_1 c_2)$ to suffix $(c_2 c_3)$ carries the 3-mer $(c_1 c_2 c_3)$:
     $$|E| = 8$$
3. **In/Out-Degree Balance & Semi-Eulerian Condition**:
   Evaluates node in-degrees $d_{\text{in}}(v)$ and out-degrees $d_{\text{out}}(v)$ analytically:
   - Source node: $\text{HE}$ with $d_{\text{in}} = 0, d_{\text{out}} = 1$ ($\Delta d = +1$).
   - Sink node: $\text{LD}$ with $d_{\text{in}} = 1, d_{\text{out}} = 0$ ($\Delta d = -1$).
   - Internal nodes: 7 vertices ($\text{EL}, \text{LL}, \text{LO}, \text{OW}, \text{WO}, \text{OR}, \text{RL}$) strictly balanced with $d_{\text{in}} = 1, d_{\text{out}} = 1$ ($\Delta d = 0$).
   - By Euler's theorem for directed multigraphs, the presence of exactly one node with $d_{\text{out}} - d_{\text{in}} = 1$ and one node with $d_{\text{in}} - d_{\text{out}} = 1$ guarantees a unique directed Eulerian path traversing every edge exactly once.
4. **Sequence Reconstruction Tour**:
   Traversing the Eulerian path reconstructs the continuous sequence without ambiguity:
   $$\text{HE} \xrightarrow{\text{HEL}} \text{EL} \xrightarrow{\text{ELL}} \text{LL} \xrightarrow{\text{LLO}} \text{LO} \xrightarrow{\text{LOW}} \text{OW} \xrightarrow{\text{OWO}} \text{WO} \xrightarrow{\text{WOR}} \text{OR} \xrightarrow{\text{ORL}} \text{RL} \xrightarrow{\text{RLD}} \text{LD}$$
   recovering "HELLOWORLD" in 8 consecutive assembly steps.

## Web Platform Surface
- **Canvas 2D Directed Graph Layout (`CanvasRenderingContext2D`)**:
  - Arranges vertices in an organic serpentine loop on warm aged rag paper.
  - Renders quadratic Bézier directed ribbon arcs with tangent-aligned directional arrowheads and $k$-mer annotation tags.
  - Illuminated node rings with status-coded borders (amber for source, crimson for sink, emerald for traversed, sepia for pending).
  - Continuous animated traveling pulse tracing the active assembly trajectory.
- **Interactive Sequence Assembly Stepper**:
  - Draggable stepper slider (`#step-slider`) allowing manual step-by-step assembly of the sequence from step 0 (`HE`) to step 8 (`HELLOWORLD`), updating the live assembly banner and graph illumination in real time.

## Visual & Design Rationale
- **Palette**: Warm aged rag paper (`#faf6ed`, `#f5ebd5`, `#eee4ce`), botanical forest emerald (`#064e3b`, `#047857`, `#d1fae5`), copperplate sepia (`#78350f`, `#8c7355`), and illuminated gold leaf (`#b45309`, `#d97706`).
- **Composition**: Natural history taxonomic plate layout with the sequence reconstruction banner at top, directed graph network in the center, and the De Bruijn Taxonomic Record table on the right.
- **Aesthetic**: 18th-century Linnaean natural history botanical manuscript, maintaining the fresh light-mode historical scientific document lineage.

## Verification Evidence
Verified via `tools.js verify 024/024.dev.html 024`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header, sequence target banner, and assembly trail.
- **Canvas Evidence**:
  - Canvas ID: `debruijn-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 18 frames, 532 draw operations.
- **Technology Measurements**:
  - $k$-mer Window Length: 3.
  - Graph Vertices $|V|$: 9 unique 2-mers.
  - Directed Edges $|E|$: 8 overlap 3-mers.
  - Source Node: `HE` ($d_{\text{in}}=0, d_{\text{out}}=1, \Delta=+1$).
  - Sink Node: `LD` ($d_{\text{in}}=1, d_{\text{out}}=0, \Delta=-1$).
  - Balanced Nodes: 7 vertices ($d_{\text{in}}=1, d_{\text{out}}=1, \Delta=0$).
  - Semi-Eulerian Verification: `true`.
  - Active Step: Initial step 8 (`HELLOWORLD`) $\to$ scrubbed to step 3 (`HELLO`, 5 BP) under CDP interaction.

## Key Decisions & Trade-offs
1. **Canonical $k=3$ Parameterization**: Choosing $k=3$ on length 10 creates a clean 9-vertex, 8-edge directed graph where each edge represents an informative 3-letter codon, yielding an unbranched Eulerian trail without cycle ambiguity.
2. **Tangent Arrowhead Geometry**: Computing exact quadratic Bézier tangent derivatives ensures directed arrowheads align cleanly with the curved ribbon edges.
3. **Discrete Graph Invariant Rigor**: Reported strictly discrete graph quantities (in/out-degrees, Eulerian degree differences $\Delta d$, vertex/edge cardinalities) without physical unit inflation.

## Moving Frontier Contribution
- **Computational Genomics & Bioinformatics**: Introduced De Bruijn graphs, $k$-mer sequence assembly, and Eulerian path reconstruction to the platform.
- **Overlapping Substrings as Causal Topology**: The character transitions of "HELLO WORLD" literally define the vertex and edge sets of the graph.
- **Linnaean Natural History Manuscript Aesthetic**: Established an 18th-century botanical taxonomy plate design language with forest emerald ink and copperplate calligraphy.
