# Experiment 108 Journal: Game System Frontier

## Frontier Assessment: Game System Frontier
The Game System Frontier demands that the experiment operate as a true game: with formal rules, player agency, objectives, resources, progression, and win/loss conditions.
Crucially: "Hello World must be an intrinsic component of the game rules, objectives, or resources—not merely a decorative title or background sprite."

## Candidate Formulations

### Candidate A: Typographic Sokoban & Syntactic Goal Grammar ("HELLO WORLD" Grid Puzzle)
- **Concept**: A 2D discrete grid-based puzzle game where a player avatar navigates a chamber, pushing 10 physical glyph blocks ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') toward 10 target lexical sockets. Movement and push rules are strictly deterministic (standard Sokoban push mechanics, obstacle collision, push resistance, undo stack, turn counter).
- **Causal Hello World Integration**: The win condition is achieved only when the 10 glyph blocks are seated on their matching target sockets to complete the word "HELLO WORLD". Each block's identity is verified by the game engine. An auto-solve / test solver allows demonstrating state transitions from unsolved to partially solved and fully solved.
- **Evidence Strategy**: Turn counter, player position $(x, y)$, block positions, matched goal count ($0 \le k \le 10$), undo stack depth, and boolean `isWon` derived from live state.

### Candidate B: "BABA IS YOU" Typographic Rule-Rewriter Cellular Metagame
- **Concept**: Moveable text tiles that rewrite physics predicates (e.g. `[H] [IS] [PUSH]`, `[W] [IS] [WIN]`).
- **Trade-off**: Requires extensive cellular grammar parser which can become unwieldy to verify cleanly in automated CDP without high complexity risk.

### Candidate C: Turn-Based Glyph-Resource Deckbuilder
- **Concept**: A card combat game where drawing letters costs AP to cast spells against enemy HP.
- **Trade-off**: High complexity, harder to visually inspect in a single static screenshot than a spatial grid puzzle.

## Selection
**Candidate A** is chosen. It provides:
1. Strict, unambiguous game rules (discrete 2D grid, collision, push physics, move counter, undo).
2. Explicit objective and agency: player moves via keyboard (WASD / Arrows) or on-screen D-Pad.
3. Intrinsic Hello World role: The 10 blocks ARE the 10 characters of "HELLO WORLD", and the game objective is their lexicographic alignment in target sockets.
4. Beautiful retro aesthetic: 1989 Game Boy 4-shade LCD dot-matrix console (`#0f380f`, `#306230`, `#8bac0f`, `#9bbc0f`) with physical D-pad and bezel.

## Mathematical & Game Model
- **Grid State**: $G(x, y) \in \{\text{WALL}, \text{FLOOR}, \text{SOCKET}_i\}$.
- **Block States**: $B_i = (x_i, y_i, \text{char}_i)$ for $i \in \{0, \dots, 9\}$.
- **Push Dynamics**:
  If player moves to $(x', y')$ occupied by $B_i$, $B_i$ moves to $(x' + dx, y' + dy)$ if and only if $(x' + dx, y' + dy)$ is empty floor or socket.
- **Win Condition Function**:
  $$\text{Win} = \bigwedge_{i=0}^9 \left( B_i.x = S_i.x \land B_i.y = S_i.y \right)$$
