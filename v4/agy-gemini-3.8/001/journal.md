# Engineering Journal — Experiment 001 (Goal 1: Infinite 2D Space Exploration Game)

## Concept & Objectives
To build a boundless, 2D space exploration action RPG running entirely client-side on the web platform:
- Unbounded 2D universe dynamically divided into procedural sectors ($1200 \times 1200$ units per chunk).
- Newtonian inertial flight dynamics with forward/reverse thrusters and afterburner boost.
- Combat against hostile pirate fleets (Scout Drones, Pirate Interceptors, heavy Void Dreadnoughts).
- Asteroid mining with shattering physics, ore drops (Iron, Titanium, Tritium, Nova Crystals, Dark Matter), and proximity tractor beam collection.
- Orbital spaceports for docking, trading raw minerals for credits, hull repairs, and multi-tier ship upgrades.
- Holographic 360-degree tactical radar HUD.
- Procedural Web Audio chiptune & ambient sound design (engine rumble, blasters, detonations, docking fanfares).

## Architectural Implementation
1. **Procedural Chunk Generation**:
   - Deterministic pseudo-random seed hash based on chunk grid coordinates `(cx, cy)`.
   - Distant culling (> 2.5 chunks away from player) keeps memory usage bounded while granting an infinite world.
2. **Inertial Flight Mechanics**:
   - Linear momentum, angular damping, reverse retro-thrusters, boost meter depletion/recharge.
3. **Combat & Mining Loop**:
   - Dual-barrel plasma blaster with cooldown.
   - Asteroid fragmentation into harvestable resource crystals.
   - Enemy AI tracking, strafing, and laser salvos.
4. **Economy & Starport Upgrades**:
   - 5 mineral commodity classes with distinct market valuations.
   - Station drydock with hull repair and 4 upgrade paths (Engine, Shield, Weapons, Cargo Capacity).
5. **Dual Flight Modalities**:
   - Full desktop keyboard/mouse navigation alongside mobile touch on-screen flight controls.
