# Engineering Journal — Experiment 002 (Goal 2: Typographic Sokoban V3)

## Historical Analysis of Prior Version (v3/agy-gemini-3.8/108)
Inspection of the predecessor `108` revealed:
- **Trivial Gameplay**: 8 out of 10 letters were already placed directly on their sockets at startup. The player only had to nudge 2 blocks across 2 cells.
- **Zero Progression**: A single static chamber with no level transition or difficulty curve.
- **No Undo/Redo**: Any mistake meant hard reload.
- **No Audio**: Completely silent.
- **Vanilla DOM**: Manipulated raw DOM nodes without reactive architecture.

## Architecture Decisions for V3
1. **Physical DMG-01 Chassis & Dot-Matrix Shader**:
   - Recreated the iconic 1989 Nintendo Game Boy handheld form factor with 4-shade LCD color palettes (`1989 DMG Green`, `Game Boy Pocket`, `Cyber Cyan`, `Amber Plasma`).
   - HTML5 `<canvas>` rendering engine with integer pixel grid snapping, scanline mesh, and custom glyph drawing.
2. **Syntactic Goal Grammar & Barrier Mechanics**:
   - Level 3 introduces syntactic triggers: spelling intermediate words (e.g. `ACT` within `REACT`) discharges high-voltage electro-barriers to unlock subsequent puzzle corridors.
3. **5-Level Campaign**:
   - Stage 1: `CODE` (Boot Sector)
   - Stage 2: `ALGO` (Logic Gate Routing)
   - Stage 3: `REACT` (Syntactic Barrier Trigger)
   - Stage 4: `CYBER` (Quantum Loop Transposition)
   - Stage 5: `HELLO WORLD` (Master Runtime — 10 letters, fully unsolved multi-room labyrinth)
4. **4-Channel DMG Synthesizer**:
   - Pulse 1: frequency sweep for steps & pushes.
   - Pulse 2: ascending arpeggio for lexical socket latching.
   - Wave: saw/wave generator for barrier discharge.
   - Noise: pseudo-LFSR noise buffer for mechanical thuds and friction.
   - Auto-disconnect on `osc.onended` to ensure zero Web Audio memory accumulation.
5. **Full Player Agency**:
   - Arbitrary step undo (`B` button / `Z` / `Backspace`).
   - Instant restart (`Start` button / `R`).
   - Palette switching (`Select` button / `P`).
   - Campaign browser with par move evaluations, stars, and local storage record persistence.
