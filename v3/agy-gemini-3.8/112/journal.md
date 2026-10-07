# Experiment 112 Journal: Accessibility / Semantic Frontier

## Frontier Assessment: Accessibility / Semantic Frontier
The Accessibility / Semantic Frontier demands that accessibility and semantic HTML be active, living drivers of the mechanism—not an afterthought or a superficial `aria-label`.
"Hello World must not be merely a visual spectacle, but a deeply semantic, accessible experience with screen-reader-first interaction, rich ARIA live orchestration, roving keyboard navigation, and dual visual/aural representation."

## Candidate Formulations

### Candidate A: Dual-Modality Tactile Braille Cell Synthesizer & Acoustic Board ("HELLO WORLD")
- **Concept**: A fully accessible semantic matrix of 10 interactive Grade 1 Braille cells representing the 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D'). Each cell contains 6 discrete tactile dot switches (`role="switch"`, `aria-checked="true|false"`). Roving `tabindex` keyboard navigation enables full two-dimensional traversal (Left/Right between letters, Up/Down between dots) with Space/Enter activation. An `aria-live="polite"` region orchestrates real-time announcements.
- **Causal Hello World Integration**: The standard Grade 1 Louis Braille 6-dot matrix encoding directly dictates the raised dot configurations:
  - 'H' = dots 1, 2, 5 (⠓)
  - 'E' = dots 1, 5 (⠑)
  - 'L' = dots 1, 2, 3 (⠇)
  - 'O' = dots 1, 3, 5 (⠕)
  - 'W' = dots 2, 4, 5, 6 (⠺)
  - 'R' = dots 1, 2, 3, 5 (⠗)
  - 'D' = dots 1, 4, 5 (⠙)
  The semantic parser decodes dot patterns into ASCII text in real time, validating fidelity against "HELLO WORLD".
- **Evidence Strategy**: Live ARIA announcement counter, focused element selector, roving tabindex index, total active dots, Braille decoding accuracy, and high-contrast toggle state.

### Candidate B: Accessible Stepper State Machine
- **Concept**: A stepper wizard tracking lexical transitions with `aria-current="step"`.
- **Trade-off**: Lower mechanical depth compared to full tactile Braille cell modeling.

### Candidate C: Screen-Reader Spatial Sonification Grid
- **Concept**: Navigating an aural coordinate grid where audio pitches announce letters.
- **Trade-off**: Harder to visually inspect than tactile embossed Braille cells.

## Selection
**Candidate A** is chosen. It demonstrates:
1. Historical typographic depth: Louis Braille's 1824 tactile system as the foundation of modern accessibility.
2. Complete keyboard navigability: Roving `tabindex` and Arrow key event dispatching.
3. Live ARIA region orchestration: `aria-live="polite"` and `aria-live="assertive"`.
4. Causal typographic fidelity: The 60 dots across 10 cells form the canonical Braille representation of "HELLO WORLD".

## Mathematical & Linguistic Model
- **Braille 6-Dot Bitfield Encoding**:
  $$\text{Byte} = \sum_{k=1}^6 \text{dot}_k \cdot 2^{k-1}$$
- **Standard Braille Mapping for "HELLO WORLD"**:
  - H: $\{1, 2, 5\} \implies 0\text{b}010011$
  - E: $\{1, 5\} \implies 0\text{b}010001$
  - L: $\{1, 2, 3\} \implies 0\text{b}000111$
  - O: $\{1, 3, 5\} \implies 0\text{b}010101$
  - W: $\{2, 4, 5, 6\} \implies 0\text{b}111010$
  - R: $\{1, 2, 3, 5\} \implies 0\text{b}010111$
  - D: $\{1, 4, 5\} \implies 0\text{b}011001$
- **Total Canonical Raised Dots**: $3 + 2 + 3 + 3 + 3 + 4 + 3 + 4 + 3 + 3 = 31\text{ dots}$ out of $60$.

## Visual Direction
1890s Paris National Institute for Blind Children tactile embossing slate on heavy cream linen paper (`#fbf8ee`), debossed dot sockets, raised tactile domes, high-contrast dark mode switch (`#111827`), and an accessible live transcript log.
