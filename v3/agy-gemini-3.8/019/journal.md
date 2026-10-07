# Experiment 019 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 019 advances the Moving Frontier into **Information Theory, Discrete Computer Science, and Optimal Source Coding**.
Previous experiments established thermodynamics (018), relativistic mechanics (017), and celestial gravitation (016). Experiment 019 explores **Claude Shannon's Mathematical Theory of Communication (1948), Prefix-Free Huffman Tree Construction, Symbol Entropy $H(X)$, and Punched Paper Tape Serialization** encoding "HELLO WORLD" into an optimal binary prefix code.

---

## Candidate 1 (SELECTED): Shannon Information Theory, Huffman Prefix Coding & Punched Paper Tape Teletypewriter
- **Concept**: A 1948 Bell Telephone Laboratories communication theory apparatus that analyzes the discrete symbol distribution of "HELLO WORLD" ($N=10$ characters across 7 unique alphabet symbols: H, E, L, O, W, R, D).
  The system computes:
  1. Empirical Symbol Probabilities: $p_i = \text{freq}_i / N$.
  2. Shannon Source Entropy:
     $$H(X) = -\sum_{i=1}^{k} p_i \log_2 p_i \approx 2.725\text{ bits/symbol}$$
  3. Priority-Queue Huffman Tree Synthesis: Merging the two lowest-probability leaf nodes recursively until a single root binary trie is established, assigning prefix-free binary codewords ($\{0, 1\}^*$) with Kraft-McMillan inequality $\sum 2^{-l_i} \le 1$.
  4. Average Codeword Length: $\bar{L} = \sum p_i l_i \approx 2.80\text{ bits/symbol}$, achieving coding efficiency $\eta = H / \bar{L} \approx 97.3\%$ approaching the Shannon Source Coding Theorem fundamental limit.
  5. Continuous Punched Paper Tape Encoder: The full message "HELLO WORLD" is serialized into an animated 8-channel punched paper teletypewriter tape with sprocket feed holes and ASCII/Baudot bit punches.
  6. Interactive Teletype Tape Feeder: Pointer drag advances the punched paper tape, decoding the incoming bitstream through the binary tree in real time.
- **Strengths**:
  - Genuinely new mechanism family (Information theory, Shannon entropy, Huffman coding trees, prefix-free binary grammars).
  - Distinct aesthetic: 1948 Bell Telephone Laboratories / Bletchley Park telegraphy desk — creamy perforated punched paper tape, Baudot telegraph relays, glowing emerald bitstream indicators, and an interactive hierarchical binary decision tree.
  - Interactive tape feed: Dragging advances the punched tape and decodes bits symbol by symbol along the tree branches.
  - Mathematically pristine, zero external libraries.
- **Weaknesses**: Must render the hierarchical binary tree clearly without layout clutter.

## Candidate 2: Deployable Origami Kinematics & Miura-Ori Auxetic Metamaterial
- **Concept**: Deployable origami facet geometry folding the characters of "HELLO WORLD" with negative Poisson ratio $\nu_{xy} < 0$.
- **Strengths**: Geometric space engineering.
- **Weaknesses**: Visual motion is primarily 1D parametric scale; less structural variety.

## Candidate 3: Crystallographic Bravais Lattices & Laue X-Ray Bragg Diffraction
- **Concept**: 2D crystal reciprocal lattice vectors and Bragg diffraction spots for the 10 glyphs.
- **Strengths**: Solid-state crystallography.
- **Weaknesses**: Visual diffraction spots share traits with 014's laser interference patterns.

---

## Architectural Specification for Candidate 1 (Shannon Information Theory)
- **Alphabet & Symbol Statistics**:
  - String: "HELLO WORLD" (10 characters, 7 unique alphabet symbols).
  - Symbol Frequencies: L (3), O (2), H (1), E (1), W (1), R (1), D (1).
  - Shannon Entropy: $H = -\sum p_i \log_2 p_i = 2.725\text{ bits/symbol}$.
- **Huffman Trie Engine**:
  - Exact binary tree construction: Nodes contain symbol, frequency, left child (bit 0), right child (bit 1).
  - Generated Codewords:
    - `L`: `00` (length 2)
    - `O`: `01` (length 2)
    - `H`: `100` (length 3)
    - `E`: `101` (length 3)
    - `W`: `110` (length 3)
    - `R`: `1110` (length 4)
    - `D`: `1111` (length 4)
- **Punched Paper Tape Rendering**:
  - Perforated teletype tape moving across the top/middle deck.
  - Feed sprocket holes, binary code holes (punch = 1, blank = 0), and human-readable stamped character labels.
- **Interactive Tape Slider**:
  - Pointer drag advances the tape offset, highlighting the active bit in the bitstream and tracing the path down the Huffman tree.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures Shannon entropy $H$, average code length $\bar{L}$, coding efficiency $\eta$, total encoded bits (28 bits vs 80 uncompressed bits), and compression ratio (65.0% saving).
