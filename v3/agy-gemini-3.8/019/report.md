# Experiment Report: 019 — Shannon Information Theory & Huffman Binary Trie Coding

## Concept
An information theory and source coding apparatus inspired by Claude Shannon's 1948 *A Mathematical Theory of Communication*, analyzing the discrete symbol distribution of "HELLO WORLD" ($N=10$ characters over 7 unique alphabet symbols: L:3, O:2, H:1, E:1, W:1, R:1, D:1).
The system evaluates the mathematical foundations of data compression:
1. **Shannon Source Entropy**:
   $$H(X) = -\sum_{i=1}^{k} p_i \log_2 p_i = 2.646\text{ bits/symbol}$$
   establishing the absolute theoretical lower bound for lossless compression.
2. **Optimal Prefix-Free Huffman Binary Trie**:
   Constructed via a recursive priority-queue merger of lowest-probability leaf nodes, assigning variable-length binary codewords:
   - `L`: `10` ($l=2$)
   - `O`: `01` ($l=2$)
   - `H`: `000` ($l=3$), `E`: `001` ($l=3$), `W`: `110` ($l=3$)
   - `R`: `1110` ($l=4$), `D`: `1111` ($l=4$)
   Average code length $\bar{L} = \sum p_i l_i = 2.700\text{ bits/symbol}$, achieving $98.0\%$ coding efficiency approaching the Shannon limit.
3. **Kraft-McMillan Equality Verification**:
   $$\sum_{i=1}^{7} 2^{-l_i} = \frac{1}{4} + \frac{1}{4} + \frac{1}{8} + \frac{1}{8} + \frac{1}{8} + \frac{1}{16} + \frac{1}{16} = 1.000$$
   proving mathematical completeness without redundant codebook waste.
4. **Punched Paper Tape Serialization**:
   Serializes "HELLO WORLD" into a 27-bit continuous punched paper tape with center sprocket tractor feed holes, stamped typewriter characters, and punched data tracks.

## Web Platform Surface
- **Discrete Information Theory Algorithms on JavaScript Objects**:
  - Exact symbol frequency counting, probability mapping, and priority-queue Huffman tree synthesis.
  - Verification of Kraft-McMillan inequality and Shannon source coding bounds in real time.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - Over 11,000 drawing operations recorded across test frames.
  - Multi-layer visual rendering: creamy perforated punched paper tape with realistic sprocket tractor holes and punched bit tracks, optical red read head tracker, hierarchical binary trie tree diagram with active branch path tracing, and Claude Shannon codebook matrix.
- **Pointer Events & Teletype Tape Feeder**:
  - Interactive pointer drag on the tape slider (`#tape-slider`) advances the punched tape symbol by symbol, dynamically lighting up the decoding path down the Huffman tree.

## Visual & Design Rationale
- **Palette**: Bakelite telegraph black (`#090c10`, `#101520`), creamy perforated punched paper tape (`#fef3c7`), typewriter ink black (`#0f172a`), emerald relay lamp phosphor (`#10b981`), and amber codebook callouts (`#f59e0b`).
- **Composition**: Communication terminal layout featuring the continuous teletypewriter punched tape along the top, the branching binary trie tree on the bottom left, and Shannon's source coding codebook on the bottom right.
- **Aesthetic**: 1948 Bell Telephone Laboratories communication theory desk (Claude Shannon and Alan Turing era), distinct from physics apparatuses, fluid lattices, or planetary orbits.

## Verification Evidence
Verified via `tools.js verify 019/019.dev.html 019`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header, stamped typewriter tape, and codebook.
- **Canvas Evidence**:
  - Canvas ID: `info-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
- **Technology Measurements**:
  - Source Entropy $H(X)$: $2.646\text{ bits/symbol}$.
  - Average Codeword Length $\bar{L}$: $2.700\text{ bits/symbol}$.
  - Coding Efficiency $\eta$: $98.0\%$.
  - Kraft Sum $\sum 2^{-l}$: Strictly $1.000$.
  - Total Encoded Bitstream: 27 bits (vs 80 uncompressed ASCII bits, $66.3\%$ compression saving).
  - Interactive scrubbing: Advance from index 0 (`H`) to index 6 (`O`) under CDP drag.

## Key Decisions & Trade-offs
1. **Full Message Tape Representation**: Laying out all 10 characters along the punched paper tape with stamped letters and punched bit holes makes the abstract concept of variable-length source coding immediately physical and visual.
2. **Interactive Active Path Highlight**: Dynamically illuminating the traversal edges from root to leaf on the binary tree as each character is selected provides instant intuition for prefix-free prefix decoding.
3. **Exact Fractional Kraft Sums**: Displaying exact dyadic powers ($1/4 + 1/8 + \dots$) emphasizes the mathematical beauty of prefix-free trees.

## Moving Frontier Contribution
- **Information Theory & Discrete Computer Science**: Introduced Shannon entropy, optimal Huffman coding, and prefix-free binary grammars to the lab.
- **Bell Labs Telegraphy Aesthetic**: Established a 1940s telecommunications and punched paper tape design language.
- **Quantitative Compression Verification**: Proved source coding efficiency ($98.0\%$) and Kraft-McMillan equality.
