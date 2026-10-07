# Experiment 024 Journal — Candidate Concepts & Selection

## Context & Objectives
Proceeding with the 021–030 sequence with strict focus on:
1. **Causal Subject Principle**: "HELLO WORLD" must not be a superficial tag; its overlapping substrings ($k$-mers) must causally generate the vertices, edges, in/out degrees, and topology of the graph.
2. **Honest Scientific Claims**: Strictly quantify discrete graph-theoretic invariants (vertex set $|V|$, directed edge set $|E|$, degree balances $\Delta d = d_{\text{out}} - d_{\text{in}}$, and Eulerian trail continuity) without inflated physical units.
3. **Visual Diversity & Palette Shift**: Establish an 18th-century Linnaean natural history taxonomic manuscript on aged rag parchment with delicate botanical green and copperplate ink.

---

## Candidate 1: De Bruijn Graph Sequence Assembly & Eulerian Path Reconstitution
- **Mechanism**:
  - $k$-mer Decomposition: Decomposes "HELLOWORLD" into 8 contiguous $k=3$ substrings:
    $$\{\text{HEL}, \text{ELL}, \text{LLO}, \text{LOW}, \text{OWO}, \text{WOR}, \text{ORL}, \text{RLD}\}$$
  - Graph Topology: Vertices are $(k-1) = 2$-mers:
    $$V = \{\text{HE}, \text{EL}, \text{LL}, \text{LO}, \text{OW}, \text{WO}, \text{OR}, \text{RL}, \text{LD}\}, \quad |V| = 9$$
    Directed edges represent the overlap transitions ($|E| = 8$).
  - Degree Balance & Semi-Eulerian Condition:
    Computes exact in-degrees $d_{\text{in}}(v)$ and out-degrees $d_{\text{out}}(v)$.
    Identifies source node $\text{HE}$ ($\Delta d = +1$) and sink node $\text{LD}$ ($\Delta d = -1$). All 7 intermediate nodes are strictly balanced ($\Delta d = 0$).
  - Sequence Assembly Traversal:
    Solves and animates the Eulerian path, tracing the directed ribbon edges to reconstruct the original string.
- **Causal Role of "HELLO WORLD"**:
  - The graph topology is an exact mathematical projection of the text overlaps. Changing any letter fractures the overlapping $k$-mers, disconnects vertices, or destroys the Eulerian balance.
- **Visual Aesthetic**:
  - 18th-century botanical taxonomy plate on warm cream rag paper (`#faf7ee`, `#efe7d2`), deep forest emerald ink (`#064e3b`, `#047857`), copperplate sepia lines (`#78350f`), and illuminated gold leaf node pins (`#d97706`).
- **Novelty & Moving Frontier**:
  - Opens Computational Genomics, Bioinformatics, Sequence Assembly, and Directed Graph Topology ($G=(V,E)$) to the lab.

---

## Candidate 2: Wavelet Multiresolution Analysis (Haar & Daubechies D4) on 1D Advance Signal
- **Mechanism**:
  - Decomposes the 1D typographic advance width signal of "HELLO WORLD" into dyadic octave approximation and detail subbands ($A_4, D_4, D_3, D_2, D_1$).
- **Limitations**:
  - While mathematically sound, 1D subband graphs are primarily linear curves; De Bruijn graphs offer richer spatial network geometry.

---

## Candidate 3: Lindenmayer Stochastic Branching with N-Gram Grammar Induction
- **Mechanism**:
  - Grammar induction from letter transition probabilities driving procedural fractal branching.
- **Limitations**:
  - L-systems were already explored in 011.

---

## Selection Decision
**Selected: Candidate 1 (De Bruijn Graph Sequence Assembly & Eulerian Path Reconstitution)**
- "HELLO WORLD" is 100% the causal seed: the $k$-mer substrings literally define every vertex, directed edge, and degree balance in the graph.
- Introduces Computational Genomics and Bioinformatics sequence assembly algorithms to the platform.
- Beautiful 18th-century Linnaean taxonomic manuscript aesthetic on aged rag paper.
- Honest, rigorous discrete graph-theoretic quantities ($|V|=9, |E|=8, d_{\text{in}}, d_{\text{out}}$).
