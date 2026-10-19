/**
 * MARBLE-FORGE (EXP-023) — Curated Challenge Levels & Contraption Presets
 */

import { LevelDefinition } from '../types/index.js';

export const MARBLE_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: 'The First Drop',
    tagline: 'Gravitational acceleration & inclined rail kinematics',
    briefing: 'Drop the marble down the inclined rail system and ring the tuned chime bell.',
    requiredHits: 1,
    spawnMaterial: 'GLASS',
    bounds: { width: 12.0, height: 8.0 },
    availableTools: ['SELECT', 'STRAIGHT_RAIL', 'BUMPER', 'DELETE'],
    elements: [
      // Top Spawner
      {
        type: 'MARBLE_SPAWNER',
        id: 'spawner-1',
        x: 1.5,
        y: 1.2,
        material: 'GLASS',
        spawnInterval: 2.5,
        lastSpawnTime: -2.0,
        spawnVx: 0.8,
        spawnVy: 0.0,
        autoSpawn: true,
      },
      // First Incline
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-1',
        x1: 1.0,
        y1: 1.8,
        x2: 5.5,
        y2: 3.2,
        friction: 0.005,
      },
      // Second Counter Incline
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-2',
        x1: 5.8,
        y1: 3.8,
        x2: 2.2,
        y2: 5.2,
        friction: 0.005,
      },
      // Final Run to Target
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-3',
        x1: 2.0,
        y1: 5.8,
        x2: 9.0,
        y2: 7.0,
        friction: 0.005,
      },
      // Objective Chime Bell
      {
        type: 'TARGET_BELL',
        id: 'bell-1',
        x: 9.5,
        y: 6.8,
        radius: 0.35,
        noteFrequency: 523.25, // C5
        hitCount: 0,
        hasTriggeredObjective: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Loop the Loop',
    tagline: 'Centripetal force & energy conservation (v >= sqrt(27/7 g R))',
    briefing: 'Launch down a steep drop to accumulate kinetic energy, clear the 360° vertical loop without detaching, and hit the bell.',
    requiredHits: 1,
    spawnMaterial: 'STEEL',
    bounds: { width: 12.0, height: 8.0 },
    availableTools: ['SELECT', 'STRAIGHT_RAIL', 'LOOP_THE_LOOP', 'BUMPER', 'DELETE'],
    elements: [
      {
        type: 'MARBLE_SPAWNER',
        id: 'spawner-2',
        x: 1.2,
        y: 0.8,
        material: 'STEEL',
        spawnInterval: 3.0,
        lastSpawnTime: -2.5,
        spawnVx: 0.6,
        spawnVy: 0.0,
        autoSpawn: true,
      },
      // High steep launch ramp
      {
        type: 'STRAIGHT_RAIL',
        id: 'ramp-1',
        x1: 0.8,
        y1: 1.2,
        x2: 4.8,
        y2: 6.2,
        friction: 0.002,
      },
      // Transition base into loop
      {
        type: 'STRAIGHT_RAIL',
        id: 'ramp-base',
        x1: 4.8,
        y1: 6.2,
        x2: 6.2,
        y2: 6.2,
        friction: 0.002,
      },
      // Vertical Loop
      {
        type: 'LOOP_THE_LOOP',
        id: 'loop-1',
        cx: 7.2,
        cy: 5.2,
        radius: 1.0,
        entrySide: 'LEFT',
      },
      // Exit run
      {
        type: 'STRAIGHT_RAIL',
        id: 'exit-rail',
        x1: 8.2,
        y1: 6.2,
        x2: 10.5,
        y2: 6.4,
        friction: 0.002,
      },
      // Target Bell
      {
        type: 'TARGET_BELL',
        id: 'bell-2',
        x: 11.0,
        y: 6.3,
        radius: 0.35,
        noteFrequency: 659.25, // E5
        hitCount: 0,
        hasTriggeredObjective: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Domino Cascade & Seesaw',
    tagline: 'Momentum transfer, chain toppling & torque balance',
    briefing: 'Roll into the domino chain to trigger a sequential cascade that tips the seesaw and launches the ball into the bell.',
    requiredHits: 1,
    spawnMaterial: 'WOOD',
    bounds: { width: 12.0, height: 8.0 },
    availableTools: ['SELECT', 'STRAIGHT_RAIL', 'SEESAW', 'DOMINO', 'DELETE'],
    elements: [
      {
        type: 'MARBLE_SPAWNER',
        id: 'spawner-3',
        x: 1.0,
        y: 1.5,
        material: 'WOOD',
        spawnInterval: 3.5,
        lastSpawnTime: -3.0,
        spawnVx: 1.2,
        spawnVy: 0.0,
        autoSpawn: true,
      },
      // Incline to Domino Platform
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-domino-lead',
        x1: 0.8,
        y1: 2.0,
        x2: 3.5,
        y2: 3.2,
        friction: 0.008,
      },
      // Flat Domino Platform
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-domino-plat',
        x1: 3.5,
        y1: 3.2,
        x2: 6.5,
        y2: 3.2,
        friction: 0.008,
      },
      // Domino Chain (6 upright dominoes)
      {
        type: 'DOMINO',
        id: 'domino-chain-1',
        dominoes: [
          { id: 'd-1', x: 3.8, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
          { id: 'd-2', x: 4.15, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
          { id: 'd-3', x: 4.5, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
          { id: 'd-4', x: 4.85, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
          { id: 'd-5', x: 5.2, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
          { id: 'd-6', x: 5.55, y: 3.0, width: 0.06, height: 0.35, angle: 0, angularVelocity: 0, toppled: false },
        ],
      },
      // Tilting Seesaw below dominoes
      {
        type: 'SEESAW',
        id: 'seesaw-1',
        px: 7.2,
        py: 4.8,
        length: 2.8,
        angle: -0.22, // Tilted left towards dominoes
        angularVelocity: 0,
        minAngle: -0.35,
        maxAngle: 0.35,
        mass: 0.25,
      },
      // Lower ramp to bell
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-lower',
        x1: 7.8,
        y1: 5.6,
        x2: 10.2,
        y2: 6.8,
        friction: 0.005,
      },
      // Target Bell
      {
        type: 'TARGET_BELL',
        id: 'bell-3',
        x: 10.6,
        y: 6.6,
        radius: 0.35,
        noteFrequency: 783.99, // G5
        hitCount: 0,
        hasTriggeredObjective: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Spiral Vortex & Pinball Bumpers',
    tagline: 'Orbital funnel dynamics & high-restitution impulse kicks',
    briefing: 'Watch the marble spiral through the gravity funnel, drop through the bottom drain, and rebound off the pinball bumper array.',
    requiredHits: 2,
    spawnMaterial: 'RUBBER',
    bounds: { width: 12.0, height: 8.0 },
    availableTools: ['SELECT', 'STRAIGHT_RAIL', 'FUNNEL', 'BUMPER', 'TARGET_BELL', 'DELETE'],
    elements: [
      {
        type: 'MARBLE_SPAWNER',
        id: 'spawner-4',
        x: 1.5,
        y: 1.0,
        material: 'RUBBER',
        spawnInterval: 2.8,
        lastSpawnTime: -2.0,
        spawnVx: 1.4,
        spawnVy: 0.0,
        autoSpawn: true,
      },
      // Lead-in rail
      {
        type: 'STRAIGHT_RAIL',
        id: 'rail-funnel-in',
        x1: 1.2,
        y1: 1.5,
        x2: 3.5,
        y2: 2.4,
        friction: 0.005,
      },
      // Gravity Funnel
      {
        type: 'FUNNEL',
        id: 'funnel-1',
        cx: 5.0,
        cy: 3.2,
        outerRadius: 1.5,
        drainRadius: 0.25,
        drainX: 5.0,
        drainY: 4.8,
      },
      // Pinball Bumpers Below
      {
        type: 'BUMPER',
        id: 'bumper-1',
        x: 4.2,
        y: 5.6,
        radius: 0.45,
        kickImpulse: 3.8,
        cooldownTimer: 0,
      },
      {
        type: 'BUMPER',
        id: 'bumper-2',
        x: 5.8,
        y: 5.6,
        radius: 0.45,
        kickImpulse: 3.8,
        cooldownTimer: 0,
      },
      {
        type: 'BUMPER',
        id: 'bumper-3',
        x: 5.0,
        y: 6.8,
        radius: 0.45,
        kickImpulse: 4.2,
        cooldownTimer: 0,
      },
      // Side Rails catch
      {
        type: 'STRAIGHT_RAIL',
        id: 'catch-left',
        x1: 2.8,
        y1: 7.2,
        x2: 4.5,
        y2: 7.6,
        friction: 0.01,
      },
      {
        type: 'STRAIGHT_RAIL',
        id: 'catch-right',
        x1: 5.5,
        y1: 7.6,
        x2: 9.5,
        y2: 7.2,
        friction: 0.01,
      },
      // Target Bell
      {
        type: 'TARGET_BELL',
        id: 'bell-4',
        x: 9.8,
        y: 6.9,
        radius: 0.35,
        noteFrequency: 880.0, // A5
        hitCount: 0,
        hasTriggeredObjective: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Perpetual Machine',
    tagline: 'Continuous closed-loop kinetic circulation & Archimedes lift',
    briefing: 'A continuous, mesmerizing Rube Goldberg machine utilizing an Archimedes screw conveyor to circulate marbles perpetually.',
    requiredHits: 3,
    spawnMaterial: 'GLASS',
    bounds: { width: 12.0, height: 8.0 },
    availableTools: ['SELECT', 'STRAIGHT_RAIL', 'ARCHIMEDES_LIFT', 'BUMPER', 'TARGET_BELL', 'DELETE'],
    elements: [
      {
        type: 'MARBLE_SPAWNER',
        id: 'spawner-5',
        x: 2.5,
        y: 1.0,
        material: 'GLASS',
        spawnInterval: 3.0,
        lastSpawnTime: -2.5,
        spawnVx: 1.0,
        spawnVy: 0.0,
        autoSpawn: false, // User triggers or auto starts with initial marble
      },
      // Archimedes Screw Lift on Left side
      {
        type: 'ARCHIMEDES_LIFT',
        id: 'lift-1',
        x: 1.8,
        bottomY: 6.8,
        topY: 1.6,
        radius: 0.45,
        liftSpeed: 2.2, // m/s upward lift
        spiralPhase: 0,
      },
      // Top summit chute from lift
      {
        type: 'STRAIGHT_RAIL',
        id: 'summit-rail',
        x1: 1.8,
        y1: 1.6,
        x2: 5.8,
        y2: 2.6,
        friction: 0.003,
      },
      // Mid-level zig-zag
      {
        type: 'STRAIGHT_RAIL',
        id: 'mid-rail-1',
        x1: 6.0,
        y1: 3.0,
        x2: 9.5,
        y2: 4.2,
        friction: 0.003,
      },
      // Bumper redirection
      {
        type: 'BUMPER',
        id: 'bumper-corner',
        x: 10.0,
        y: 4.4,
        radius: 0.4,
        kickImpulse: 2.8,
        cooldownTimer: 0,
      },
      // Return ramp towards base of Archimedes Lift
      {
        type: 'STRAIGHT_RAIL',
        id: 'return-rail-1',
        x1: 9.5,
        y1: 5.2,
        x2: 4.0,
        y2: 6.4,
        friction: 0.003,
      },
      {
        type: 'STRAIGHT_RAIL',
        id: 'return-rail-2',
        x1: 4.0,
        y1: 6.4,
        x2: 1.8,
        y2: 6.8,
        friction: 0.003,
      },
      // Resonating Chime Bell
      {
        type: 'TARGET_BELL',
        id: 'bell-5',
        x: 5.8,
        y: 2.9,
        radius: 0.35,
        noteFrequency: 1046.5, // C6
        hitCount: 0,
        hasTriggeredObjective: false,
      },
    ],
  },
];
