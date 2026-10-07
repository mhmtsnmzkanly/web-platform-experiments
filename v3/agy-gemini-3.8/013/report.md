# Experiment Report: 013 — Physarum Polycephalum Chemotactic Steiner Network

## Concept
A biological agent-based model of true slime mold plasmodium (*Physarum polycephalum*) executing chemotactic foraging across an agar medium (Jones algorithm).
The ten glyph letters of "HELLO WORLD" act as nutrient oat flake food sources emitting continuous chemoattractant diffusion gradients. A population of 1,800 chemotactic agents forage through a dual-buffered 2D chemoattractant lattice ($270 \times 130$ cells):
1. **Sensory Phase**: Sample chemical concentrations at three sensory antennae (forward, left, right) with angular offset $\phi \approx 33^\circ$ and sensory distance $SO = 12\text{ px}$.
2. **Motor Phase**: Steer forward velocity toward higher chemical gradients with rotational velocity $\alpha \approx 37^\circ$.
3. **Deposition & Evaporation**: Deposit trail chemoattractant into the lattice, which undergoes continuous $3 \times 3$ box blur diffusion and exponential evaporation ($3.5\%$ per tick).
As foraging progresses, the collective plasmodial veins self-organize into resilient vascular conduits approximating the minimal Steiner tree connecting the letters of "HELLO WORLD".

## Web Platform Surface
- **Agent-Based Simulation on Typed Arrays (`Float32Array`)**:
  - Continuous coordinates $(x, y, \theta)$ for 1,800 active chemotactic cells.
  - Double-buffered 2D diffusion lattice executed via typed arrays and $3 \times 3$ mean box blur filtering.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`, `ImageData`)**:
  - Offscreen `ImageData` buffer rendering the diffused chemoattractant field, scaled to the main canvas with screen blending.
  - Over 19,000 canvas drawing operations recorded across verified interactive frames.
- **Pointer Events & Dynamic Perturbation**:
  - Interactive pointer drag acts as a biological pipette depositing concentrated chemoattractant, drawing plasmodial veins toward the cursor.

## Visual & Design Rationale
- **Palette**: Dark agar substrate (`#080c14`, `#0c1424`), bioluminescent plasmodial yellow and amber veins (`#fde047`, `#eab308`), and nutrient oat halo cyan (`#38bdf8`).
- **Composition**: Scientific Petri dish microscopy observation deck with nutrient oat seals arranged along an organic wave, framed by a thin glass rim.
- **Aesthetic**: Biological laboratory microscopy, contrasting with geometric and mechanical archetypes.

## Verification Evidence
Verified via `tools.js verify 013/013.dev.html 013`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Prominently features "Hello World" in page header and across all 10 nutrient oat flake sites.
- **Canvas Evidence**:
  - Canvas ID: `petri-canvas` (1080x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Total canvas draws: > 19,000 draw calls recorded across frames.
- **Technology Measurements**:
  - Active plasmodium agents: 1,800 cells.
  - Nutrient food sources: 10 ("HELLO WORLD").
  - Trail grid cells: 35,100 cells.
  - Total chemoattractant mass: 1,721.46 (rest) up to 2,071.2 (interaction).
  - Transport network density: ~0.049 $\rho$.
  - Drag interaction verified via trusted CDP pointer drag scenario.

## Key Decisions & Trade-offs
1. **Half-Resolution Double-Buffered Trail Lattice**: Computing trail diffusion at $270 \times 130$ and scaling it up smoothly via `ctx.drawImage` provides rich, soft vascular veins while consuming $< 1.5\text{ ms}$ per frame on the CPU.
2. **Three-Antennae Sampling vs. Random Walks**: Implementing true 3-sensor sampling ($v_L, v_F, v_R$) guarantees that agents form cohesive arterial streams rather than dispersing into diffuse particulate clouds.
3. **Nutrient Core Seals**: Giving each food source an inscribed circular core seal ensures that "HELLO WORLD" remains visually and conceptually prominent even as complex veins weave between them.

## Moving Frontier Contribution
- **Agent-Based Collective Intelligence**: Introduced biological multi-agent chemotaxis and swarm foraging.
- **Steiner Transport Optimization**: Explored self-organizing biocomputation for minimal network routing.
- **Bioluminescent Microscopy Aesthetic**: Established a dark agar Petri dish visual identity.
