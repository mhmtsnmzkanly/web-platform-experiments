# Experiment 115 Journal: Material / Metaphor Frontier

## Frontier Assessment: Material / Metaphor Frontier
The Material / Metaphor Frontier demands grounding the computational in a physical material, mechanical apparatus, or tactile craft metaphor.
"Hello World must not be an abstract pixel set; it must behave as an object with material properties, mechanical joints, physical resistance, or craft logic. Do not reduce this to simply applying a wood/metal texture. The internal logic of the material or mechanism must generate Hello World."

## Candidate Formulations

### Candidate A: 1804 Joseph Marie Jacquard Programmable Punch-Card Loom & Silk Weaving Apparatus
- **Concept**: The foundational machine that linked physical textile craft with binary computation (later inspiring Babbage, Lovelace, and Hollerith). A programmable mechanical loom where a chain of punched cards dictates the binary lifting of warp threads via spring needles and griffe hooks, forming the shed through which a flying shuttle throws indigo silk weft threads, interlacing row-by-row into natural linen cloth to weave the typographic damask pattern of "HELLO WORLD".
- **Causal Hello World Integration**: The punch cards physically encode the binary raster rows of the 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D'). The physical cloth is woven row-by-row. If the cards are altered or holes blocked, the weave structure fails. The text is not rendered as graphics; it is physically woven thread-by-thread into the fabric fell.
- **Evidence Strategy**: Weft pick count, active card index, warp threads count ($N = 60$), shuttle position $x(t)$, woven textile row height, and live character pattern recognition.

### Candidate B: Mechanical Clockwork Deadbeat Escapement & Type Wheel
- **Concept**: Brass escapement with pallets and weighted pendulum indexing a wheel of glyphs.
- **Trade-off**: Jacquard loom embodies binary programmability, material thread tension, and textile interlacement with unmatched historical resonance.

### Candidate C: 15th-Century Gutenberg Movable Type Hand Mold
- **Concept**: Hand casting molten lead-tin-antimony alloy into matrices.
- **Trade-off**: Casting is a discrete batch process, whereas the Jacquard loom offers continuous mechanical reciprocating kinematics.

## Selection
**Candidate A** is chosen. It provides:
1. Direct historical and philosophical continuity: The Jacquard loom is where binary code was born as physical material craft.
2. Authentic mechanical apparatus: Punched card prism, reading needles, lifting griffe, warp heddles, flying shuttle, and reed batten.
3. Causal generation of Hello World: Each card hole physically lifts a thread; the 10 characters of "HELLO WORLD" emerge organically from the interlacing of warp and weft.
4. Beautiful 19th-century Lyon silk workshop plate: Polished French oak frame, brass heddle guides, unbleached linen warp, and royal indigo silk weft.

## Mechanical & Textile Model
- **Warp/Weft Binary Interlacement Function**:
  $$\text{Weave}(r, c) = \begin{cases} \text{Indigo Weft (Over)} & \text{if } \text{Hole}(r, c) = 1 \\ \text{Linen Warp (Over)} & \text{if } \text{Hole}(r, c) = 0 \end{cases}$$
- **Shuttle Kinematics**:
  $$x_{\text{shuttle}}(t) = x_{\text{left}} + \frac{1}{2} (x_{\text{right}} - x_{\text{left}}) \left( 1 - \cos(\pi \theta_{\text{crank}}) \right)$$
- **Reed Batten Motion**:
  $$y_{\text{batten}}(\theta) = y_{\text{rest}} + A_{\text{beat}} \sin^2(\pi \theta_{\text{crank}})$$
- **Cloth Take-Up Advance**:
  $$y_{\text{fell}} = y_0 + r \cdot \Delta y_{\text{pick}}$$

## Visual Direction
1804 Lyon Silk Weavers' Guild technical patent plate.
- Antique technical parchment (`#faf7ed`).
- Rich walnut/oak timber loom uprights (`#78350f`, `#92400e`).
- Taut vertical warp strings in unbleached linen cream (`#dcd2ba`).
- Interlaced horizontal weft picks in royal French indigo silk (`#1e40af`, `#3b82f6`).
- Punched card chain unrolling above the griffe frame with visible punched holes.
- Reciprocating wooden shuttle flying across the shed.
