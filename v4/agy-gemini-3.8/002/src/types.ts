export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  col: number;
  row: number;
}

export interface LetterBlock {
  id: number;
  char: string;
  col: number;
  row: number;
  isMatched: boolean;
}

export interface GoalSocket {
  id: number;
  char: string;
  col: number;
  row: number;
}

export interface Barrier {
  col: number;
  row: number;
  active: boolean; // active = blocked, false = passed through
  requiredWordTrigger?: string; // word that deactivates this barrier
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  targetWord: string;
  cols: number;
  rows: number;
  walls: number[][]; // 2D grid: 1 = wall, 0 = floor
  sockets: GoalSocket[];
  blocks: { id: number; char: string; col: number; row: number }[];
  playerStart: Position;
  parMoves: number;
  syntacticRule?: {
    triggerWord: string;
    description: string;
    barrierPosition: Position;
  };
}

export interface UndoSnapshot {
  player: Position;
  blocks: LetterBlock[];
  barriers: Barrier[];
  turnCount: number;
  pushCount: number;
  direction: Direction;
}

export type PaletteName = 'DMG_ORIGINAL' | 'POCKET_MONO' | 'CYBER_NEON' | 'AMBER_PLASMA';

export interface PaletteColors {
  name: string;
  darkest: string;
  dark: string;
  light: string;
  lightest: string;
}

export interface PlayerStats {
  completedLevels: number[];
  bestMoves: Record<number, number>; // levelId -> minMoves
  totalPushes: number;
}
