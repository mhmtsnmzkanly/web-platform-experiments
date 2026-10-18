export type SymbolId =
  | 'SEVEN'
  | 'DIAMOND'
  | 'BELL'
  | 'HORSESHOE'
  | 'CHERRY'
  | 'LEMON'
  | 'ACE'
  | 'KING'
  | 'QUEEN'
  | 'JACK'
  | 'TEN'
  | 'WILD'
  | 'SCATTER';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  category: 'special' | 'high' | 'mid' | 'low';
  icon: string;
  color: string;
  glowColor: string;
  payouts: {
    3: number;
    4: number;
    5: number;
  };
  wildMultiplier?: number;
}

export type GridPosition = [number, number]; // [row, col]

export interface Payline {
  id: number;
  name: string;
  color: string;
  positions: number[]; // row index for columns 0..4
}

export interface WinningLine {
  lineId: number;
  symbol: SymbolId;
  count: number;
  multiplier: number;
  payout: number;
  positions: GridPosition[];
  isWildSubstituted: boolean;
}

export interface SpinResult {
  matrix: SymbolId[][]; // 3 rows x 5 columns
  winningLines: WinningLine[];
  totalPayout: number;
  scatterCount: number;
  freeSpinsTriggered: boolean;
  freeSpinsWon: number;
  isJackpot: boolean;
}

export interface ReelPhysicsState {
  offset: number; // continuous float symbol offset
  velocity: number;
  targetOffset: number | null;
  stopping: boolean;
  bouncing: boolean;
  stopped: boolean;
  anticipating: boolean;
}

export interface SessionStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  hitCount: number; // spins with win > 0
  freeSpinsTriggeredCount: number;
  currentRTP: number; // percentage
}

export interface SpinHistoryItem {
  id: string;
  timestamp: number;
  bet: number;
  payout: number;
  winningLinesCount: number;
  freeSpinsTriggered: boolean;
}

export type CabinetLightPattern = 'IDLE' | 'SPINNING' | 'ANTICIPATION' | 'WIN' | 'BIG_WIN' | 'JACKPOT' | 'BONUS';

export interface GambleCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  color: 'red' | 'black';
  value: string;
}

export interface GambleState {
  active: boolean;
  currentStake: number;
  history: GambleCard[];
  revealing: boolean;
  lastOutcome?: 'win' | 'loss';
}

export interface FreeSpinsState {
  active: boolean;
  remainingSpins: number;
  totalWonSoFar: number;
  currentMultiplier: number;
}
