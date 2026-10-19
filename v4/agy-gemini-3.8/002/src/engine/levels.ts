import { LevelConfig, PaletteName, PaletteColors } from '../types';

export const PALETTES: Record<PaletteName, PaletteColors> = {
  DMG_ORIGINAL: {
    name: '1989 DMG Green',
    darkest: '#0f380f',
    dark: '#306230',
    light: '#8bac0f',
    lightest: '#9bbc0f',
  },
  POCKET_MONO: {
    name: 'Game Boy Pocket',
    darkest: '#18181b',
    dark: '#52525b',
    light: '#a1a1aa',
    lightest: '#e4e4e7',
  },
  CYBER_NEON: {
    name: 'Cyber Cyan',
    darkest: '#08141e',
    dark: '#0e3a53',
    light: '#06b6d4',
    lightest: '#67e8f9',
  },
  AMBER_PLASMA: {
    name: 'Amber Plasma',
    darkest: '#1a0f00',
    dark: '#593200',
    light: '#d97706',
    lightest: '#fbbf24',
  },
};

export const LEVELS: LevelConfig[] = [
  // LEVEL 1: BOOT SECTOR (Word: CODE)
  {
    id: 1,
    name: 'LEVEL 1: BOOT SECTOR',
    subtitle: 'Lexical Socket Initialization',
    targetWord: 'CODE',
    cols: 10,
    rows: 8,
    walls: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sockets: [
      { id: 0, char: 'C', col: 3, row: 6 },
      { id: 1, char: 'O', col: 4, row: 6 },
      { id: 2, char: 'D', col: 5, row: 6 },
      { id: 3, char: 'E', col: 6, row: 6 },
    ],
    blocks: [
      { id: 0, char: 'C', col: 3, row: 3 },
      { id: 1, char: 'O', col: 4, row: 2 },
      { id: 2, char: 'D', col: 5, row: 3 },
      { id: 3, char: 'E', col: 6, row: 2 },
    ],
    playerStart: { col: 1, row: 1 },
    parMoves: 38,
  },

  // LEVEL 2: LOGIC GATE (Word: ALGO)
  {
    id: 2,
    name: 'LEVEL 2: LOGIC GATE',
    subtitle: 'Corridor Routing & Obstacle Bypass',
    targetWord: 'ALGO',
    cols: 10,
    rows: 8,
    walls: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sockets: [
      { id: 0, char: 'A', col: 3, row: 6 },
      { id: 1, char: 'L', col: 4, row: 6 },
      { id: 2, char: 'G', col: 5, row: 6 },
      { id: 3, char: 'O', col: 6, row: 6 },
    ],
    blocks: [
      { id: 0, char: 'A', col: 2, row: 3 },
      { id: 1, char: 'L', col: 4, row: 4 },
      { id: 2, char: 'G', col: 5, row: 4 },
      { id: 3, char: 'O', col: 7, row: 3 },
    ],
    playerStart: { col: 1, row: 1 },
    parMoves: 46,
  },

  // LEVEL 3: SYNTACTIC SHIFT (Word: REACT) + Guaranteed Chokepoint Electro-Barrier!
  {
    id: 3,
    name: 'LEVEL 3: SYNTACTIC SHIFT',
    subtitle: 'Grammar Trigger: Spell ACT to Unlock Lab Vault (R)',
    targetWord: 'REACT',
    cols: 11,
    rows: 9,
    walls: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1], // (3,4) is the ONLY passage into vault (cols 1-3, rows 1-3)
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sockets: [
      { id: 0, char: 'R', col: 3, row: 7 },
      { id: 1, char: 'E', col: 4, row: 7 },
      { id: 2, char: 'A', col: 5, row: 7 },
      { id: 3, char: 'C', col: 6, row: 7 },
      { id: 4, char: 'T', col: 7, row: 7 },
    ],
    blocks: [
      { id: 0, char: 'R', col: 2, row: 2 }, // Sealed inside lab vault!
      { id: 1, char: 'E', col: 5, row: 5 },
      { id: 2, char: 'A', col: 5, row: 2 },
      { id: 3, char: 'C', col: 6, row: 3 },
      { id: 4, char: 'T', col: 7, row: 2 },
    ],
    playerStart: { col: 6, row: 1 },
    parMoves: 56,
    syntacticRule: {
      triggerWord: 'ACT',
      description: 'Seat A, C, T to disengage vault barrier at (3,4)',
      barrierPosition: { col: 3, row: 4 },
    },
  },

  // LEVEL 4: QUANTUM LOOP (Word: CYBER)
  {
    id: 4,
    name: 'LEVEL 4: QUANTUM LOOP',
    subtitle: 'Dual-Chamber Block Transposition',
    targetWord: 'CYBER',
    cols: 11,
    rows: 9,
    walls: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sockets: [
      { id: 0, char: 'C', col: 3, row: 7 },
      { id: 1, char: 'Y', col: 4, row: 7 },
      { id: 2, char: 'B', col: 5, row: 7 },
      { id: 3, char: 'E', col: 6, row: 7 },
      { id: 4, char: 'R', col: 7, row: 7 },
    ],
    blocks: [
      { id: 0, char: 'C', col: 3, row: 3 },
      { id: 1, char: 'Y', col: 4, row: 3 }, // Completely open floor with 4-way push freedom
      { id: 2, char: 'B', col: 5, row: 3 },
      { id: 3, char: 'E', col: 6, row: 3 },
      { id: 4, char: 'R', col: 7, row: 3 },
    ],
    playerStart: { col: 1, row: 1 },
    parMoves: 58,
  },

  // LEVEL 5: MASTER RUNTIME (Word: HELLO WORLD - 10 letters, fully open & solvable!)
  {
    id: 5,
    name: 'LEVEL 5: MASTER RUNTIME',
    subtitle: 'The Grand Typographic Challenge (10 Letters)',
    targetWord: 'HELLO WORLD',
    cols: 14,
    rows: 11,
    walls: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1], // Clean central support pillars at row 5
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    sockets: [
      { id: 0, char: 'H', col: 2, row: 9 },
      { id: 1, char: 'E', col: 3, row: 9 },
      { id: 2, char: 'L', col: 4, row: 9 },
      { id: 3, char: 'L', col: 5, row: 9 },
      { id: 4, char: 'O', col: 6, row: 9 },
      { id: 5, char: 'W', col: 7, row: 9 },
      { id: 6, char: 'O', col: 8, row: 9 },
      { id: 7, char: 'R', col: 9, row: 9 },
      { id: 8, char: 'L', col: 10, row: 9 },
      { id: 9, char: 'D', col: 11, row: 9 },
    ],
    blocks: [
      { id: 0, char: 'H', col: 2, row: 3 },
      { id: 1, char: 'E', col: 3, row: 2 },
      { id: 2, char: 'L', col: 4, row: 3 },
      { id: 3, char: 'L', col: 5, row: 2 },
      { id: 4, char: 'O', col: 6, row: 3 },
      { id: 5, char: 'W', col: 7, row: 2 },
      { id: 6, char: 'O', col: 8, row: 3 },
      { id: 7, char: 'R', col: 9, row: 2 },
      { id: 8, char: 'L', col: 10, row: 3 }, // Clean floor at (10,3)
      { id: 9, char: 'D', col: 11, row: 2 },
    ],
    playerStart: { col: 1, row: 1 },
    parMoves: 86,
  },
];
