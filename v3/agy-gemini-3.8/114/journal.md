# Experiment 114 Journal: Data Transformation Frontier

## Frontier Assessment: Data Transformation Frontier
The Data Transformation Frontier requires that "Hello World" be handled as a data stream passing through distinct mathematical representations, encodings, or error-tolerant transformations.
"Do not reduce this to: simply calling btoa('HELLO WORLD') and logging output. The intermediate steps, reversibility, or error tolerance must constitute the mechanism."

## Candidate Formulations

### Candidate A: Linear Algebraic Hamming [7, 4] Error-Correcting Transceiver & Shannon Entropy Pipeline
- **Concept**: A 5-stage information-theoretic pipeline:
  1. *Source Encoding*: 10 ASCII characters of "HELLO WORLD" decomposed into 20 4-bit data nibbles (80 bits total).
  2. *Systematic Linear Encoding*: Generator matrix $G = [I_4 \mid P]$ generates 20 7-bit codewords with 3 parity bits ($140\text{ bits}$).
  3. *Noisy Transmission Channel*: Controllable binary symmetric channel with interactive bit-flip error injection.
  4. *Syndrome Decoding & Error Correction*: Parity-check matrix $H = [P^T \mid I_3]$ calculates the syndrome $\vec{s} = H \vec{r}^T \pmod 2$. If non-zero, it deterministically locates the flipped bit index $k \in \{1..7\}$ and inverts it back to truth.
  5. *Reconstitution & Entropy Measurement*: Re-assembles corrected nibbles into ASCII, validating recovery against "HELLO WORLD", and computing empirical Shannon bit entropy $H(X)$.
- **Causal Hello World Integration**: The payload is "HELLO WORLD". Every nibble ($H_1, H_2, \dots, D_2$) generates a distinct codeword vector $\vec{c} \in \mathbb{F}_2^7$. Corrupting bits during transmission alters the received words; syndrome decoding mathematically reconstructs "HELLO WORLD".
- **Evidence Strategy**: Total transmitted bits (140), injected error count, detected syndromes count, corrected bits count, recovered text match, and measured Shannon entropy.

### Candidate B: Huffman Dynamic Prefix Tree & Run-Length Encoding
- **Concept**: Dynamic Huffman tree construction from character frequencies in "HELLO WORLD".
- **Trade-off**: Good for compression, but does not feature active channel error recovery.

### Candidate C: Lexer, Recursive-Descent AST Parser & Stack VM
- **Concept**: Parsing an expression that evaluates to "HELLO WORLD".
- **Trade-off**: High syntactic code volume with less tactile bitwise algebraic visibility than Hamming code.

## Selection
**Candidate A** is chosen. It demonstrates:
1. Authentic information theory: Richard Hamming's 1950 [7,4] linear code and Claude Shannon's noisy-channel coding theorem.
2. Complete mathematical rigour: Matrix multiplication over Galois field $\mathbb{F}_2$ ($G$ generator matrix, $H$ parity-check matrix, syndrome $\vec{s}$).
3. Interactive error injection & self-healing: Users can flip bits and watch the syndrome vector isolate and repair the exact corrupted bit.
4. Causal payload: "HELLO WORLD" is the transmitted message whose recovery validates the code.

## Mathematical Model
- **Generator Matrix $G$ ($4 \times 7$)**:
  $$G = \begin{pmatrix}
  1 & 0 & 0 & 0 & 1 & 1 & 0 \\
  0 & 1 & 0 & 0 & 1 & 0 & 1 \\
  0 & 0 & 1 & 0 & 0 & 1 & 1 \\
  0 & 0 & 0 & 1 & 1 & 1 & 1
  \end{pmatrix}$$
- **Parity-Check Matrix $H$ ($3 \times 7$)**:
  $$H = \begin{pmatrix}
  1 & 1 & 0 & 1 & 1 & 0 & 0 \\
  1 & 0 & 1 & 1 & 0 & 1 & 0 \\
  0 & 1 & 1 & 1 & 0 & 0 & 1
  \end{pmatrix}$$
- **Syndrome Vector**:
  $$\vec{s} = H \vec{r}^T \pmod 2$$
  If $\vec{s} \neq \vec{0}$, $\vec{s}$ matches column $k$ of $H$, indicating error at position $k$.

## Visual Direction
1950 Bell Telephone Laboratories Information Theory drafting plate.
- Warm technical ivory drafting paper (`#fbf9f2`).
- Deep slate and copper circuit traces (`#1e293b`, `#b45309`).
- 20 interactive codeword registers (140 bits total) with color-coded data bits ($d_1..d_4$, cyan `#0284c7`) and parity bits ($p_1..p_3$, orange `#ea580c`).
- Parity-check matrix visualization and live syndrome indicator LEDs.
