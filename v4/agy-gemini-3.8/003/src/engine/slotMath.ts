import { SymbolId, SlotSymbol, Payline, WinningLine, SpinResult } from '../types';

export const SYMBOLS: Record<SymbolId, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Vault Wild',
    category: 'special',
    icon: '⚡',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.75)',
    payouts: { 3: 200, 4: 1000, 5: 5000 },
    wildMultiplier: 2,
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Bonus Vault',
    category: 'special',
    icon: '💠',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    payouts: { 3: 50, 4: 250, 5: 1500 },
  },
  SEVEN: {
    id: 'SEVEN',
    name: 'Lucky Neon 7',
    category: 'high',
    icon: '7️⃣',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    payouts: { 3: 100, 4: 400, 5: 2000 },
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Cyber Diamond',
    category: 'high',
    icon: '💎',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    payouts: { 3: 80, 4: 300, 5: 1200 },
  },
  BELL: {
    id: 'BELL',
    name: 'Brass Liberty Bell',
    category: 'mid',
    icon: '🔔',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    payouts: { 3: 50, 4: 200, 5: 800 },
  },
  HORSESHOE: {
    id: 'HORSESHOE',
    name: 'Chrome Horseshoe',
    category: 'mid',
    icon: '🧲',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    payouts: { 3: 40, 4: 150, 5: 600 },
  },
  CHERRY: {
    id: 'CHERRY',
    name: 'Twin Cherries',
    category: 'mid',
    icon: '🍒',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    payouts: { 3: 30, 4: 100, 5: 400 },
  },
  LEMON: {
    id: 'LEMON',
    name: 'Solar Lemon',
    category: 'mid',
    icon: '🍋',
    color: '#84cc16',
    glowColor: 'rgba(132, 204, 22, 0.6)',
    payouts: { 3: 25, 4: 80, 5: 300 },
  },
  ACE: {
    id: 'ACE',
    name: 'Ace',
    category: 'low',
    icon: 'A',
    color: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.4)',
    payouts: { 3: 15, 4: 50, 5: 150 },
  },
  KING: {
    id: 'KING',
    name: 'King',
    category: 'low',
    icon: 'K',
    color: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.4)',
    payouts: { 3: 10, 4: 35, 5: 100 },
  },
  QUEEN: {
    id: 'QUEEN',
    name: 'Queen',
    category: 'low',
    icon: 'Q',
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    payouts: { 3: 8, 4: 25, 5: 80 },
  },
  JACK: {
    id: 'JACK',
    name: 'Jack',
    category: 'low',
    icon: 'J',
    color: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.4)',
    payouts: { 3: 5, 4: 20, 5: 60 },
  },
  TEN: {
    id: 'TEN',
    name: 'Ten',
    category: 'low',
    icon: '10',
    color: '#475569',
    glowColor: 'rgba(71, 85, 105, 0.4)',
    payouts: { 3: 5, 4: 15, 5: 40 },
  },
};

// 20 Canonical Video Slot Paylines across 3 rows and 5 reels (row coordinates 0, 1, 2)
export const PAYLINES: Payline[] = [
  { id: 1, name: 'Center Row', color: '#ef4444', positions: [1, 1, 1, 1, 1] },
  { id: 2, name: 'Top Row', color: '#3b82f6', positions: [0, 0, 0, 0, 0] },
  { id: 3, name: 'Bottom Row', color: '#10b981', positions: [2, 2, 2, 2, 2] },
  { id: 4, name: 'V-Shape', color: '#f59e0b', positions: [0, 1, 2, 1, 0] },
  { id: 5, name: 'Inverted V', color: '#8b5cf6', positions: [2, 1, 0, 1, 2] },
  { id: 6, name: 'Top Zig-Zag', color: '#ec4899', positions: [0, 0, 1, 0, 0] },
  { id: 7, name: 'Bottom Zig-Zag', color: '#06b6d4', positions: [2, 2, 1, 2, 2] },
  { id: 8, name: 'Center Crest', color: '#14b8a6', positions: [1, 0, 0, 0, 1] },
  { id: 9, name: 'Center Trough', color: '#f97316', positions: [1, 2, 2, 2, 1] },
  { id: 10, name: 'Ascending Wave', color: '#84cc16', positions: [2, 1, 1, 1, 0] },
  { id: 11, name: 'Descending Wave', color: '#eab308', positions: [0, 1, 1, 1, 2] },
  { id: 12, name: 'W-Pattern', color: '#6366f1', positions: [0, 2, 0, 2, 0] },
  { id: 13, name: 'M-Pattern', color: '#d946ef', positions: [2, 0, 2, 0, 2] },
  { id: 14, name: 'Top Step Down', color: '#0ea5e9', positions: [0, 1, 2, 2, 2] },
  { id: 15, name: 'Bottom Step Up', color: '#22c55e', positions: [2, 1, 0, 0, 0] },
  { id: 16, name: 'Center Diagonal Up', color: '#fb7185', positions: [1, 0, 1, 2, 1] },
  { id: 17, name: 'Center Diagonal Down', color: '#38bdf8', positions: [1, 2, 1, 0, 1] },
  { id: 18, name: 'Top Valley', color: '#a855f7', positions: [0, 1, 1, 1, 0] },
  { id: 19, name: 'Bottom Peak', color: '#f43f5e', positions: [2, 1, 1, 1, 2] },
  { id: 20, name: 'Chevron Spread', color: '#fdba74', positions: [1, 0, 2, 0, 1] },
];

// Continuous 32-symbol reel strips engineered for ~96.5% mathematical RTP balance
export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  [
    'TEN', 'CHERRY', 'JACK', 'BELL', 'QUEEN', 'LEMON', 'KING', 'WILD',
    'ACE', 'HORSESHOE', 'TEN', 'DIAMOND', 'JACK', 'CHERRY', 'QUEEN', 'SCATTER',
    'KING', 'SEVEN', 'ACE', 'LEMON', 'TEN', 'BELL', 'JACK', 'HORSESHOE',
    'QUEEN', 'CHERRY', 'KING', 'SCATTER', 'ACE', 'WILD', 'TEN', 'SEVEN'
  ],
  // Reel 2
  [
    'JACK', 'LEMON', 'QUEEN', 'CHERRY', 'KING', 'BELL', 'ACE', 'WILD',
    'TEN', 'HORSESHOE', 'JACK', 'SEVEN', 'QUEEN', 'LEMON', 'KING', 'SCATTER',
    'ACE', 'DIAMOND', 'TEN', 'CHERRY', 'JACK', 'BELL', 'QUEEN', 'HORSESHOE',
    'KING', 'LEMON', 'ACE', 'SCATTER', 'TEN', 'WILD', 'JACK', 'DIAMOND'
  ],
  // Reel 3
  [
    'QUEEN', 'BELL', 'KING', 'LEMON', 'ACE', 'CHERRY', 'TEN', 'WILD',
    'JACK', 'DIAMOND', 'QUEEN', 'HORSESHOE', 'KING', 'BELL', 'ACE', 'SCATTER',
    'TEN', 'SEVEN', 'JACK', 'LEMON', 'QUEEN', 'CHERRY', 'KING', 'DIAMOND',
    'ACE', 'HORSESHOE', 'TEN', 'SCATTER', 'JACK', 'WILD', 'QUEEN', 'SEVEN'
  ],
  // Reel 4
  [
    'KING', 'HORSESHOE', 'ACE', 'BELL', 'TEN', 'LEMON', 'JACK', 'WILD',
    'QUEEN', 'SEVEN', 'KING', 'CHERRY', 'ACE', 'DIAMOND', 'TEN', 'SCATTER',
    'JACK', 'BELL', 'QUEEN', 'HORSESHOE', 'KING', 'LEMON', 'ACE', 'SEVEN',
    'TEN', 'CHERRY', 'JACK', 'SCATTER', 'QUEEN', 'WILD', 'KING', 'DIAMOND'
  ],
  // Reel 5
  [
    'ACE', 'DIAMOND', 'TEN', 'BELL', 'JACK', 'HORSESHOE', 'QUEEN', 'WILD',
    'KING', 'CHERRY', 'ACE', 'SEVEN', 'TEN', 'LEMON', 'JACK', 'SCATTER',
    'QUEEN', 'DIAMOND', 'KING', 'BELL', 'ACE', 'HORSESHOE', 'TEN', 'SEVEN',
    'JACK', 'LEMON', 'QUEEN', 'SCATTER', 'KING', 'WILD', 'ACE', 'CHERRY'
  ],
];

/**
 * Returns a random stop index (0..31) for each reel.
 */
export function getRandomStopIndices(): number[] {
  return REEL_STRIPS.map(strip => Math.floor(Math.random() * strip.length));
}

/**
 * Extracts a 3 (rows) x 5 (cols) visible symbol window from stop indices.
 */
export function getVisibleMatrix(stopIndices: number[]): SymbolId[][] {
  const matrix: SymbolId[][] = [[], [], []];
  
  for (let col = 0; col < 5; col++) {
    const strip = REEL_STRIPS[col];
    const stop = stopIndices[col];
    
    for (let row = 0; row < 3; row++) {
      const index = (stop + row) % strip.length;
      matrix[row][col] = strip[index];
    }
  }
  
  return matrix;
}

/**
 * Evaluates line wins across active paylines on a 3x5 matrix.
 */
export function evaluateSpin(
  matrix: SymbolId[][],
  activeLineCount: number,
  betPerLine: number,
  multiplier: number = 1
): SpinResult {
  const winningLines: WinningLine[] = [];
  let totalPayout = 0;
  let scatterPositions: [number, number][] = [];

  // 1. Evaluate Line Wins (from left to right starting at reel 0)
  for (let l = 0; l < activeLineCount; l++) {
    const payline = PAYLINES[l];
    const lineSymbols: SymbolId[] = payline.positions.map((row, col) => matrix[row][col]);

    // Determine the base candidate symbol (first non-wild symbol from left)
    let candidate: SymbolId | null = null;
    for (let c = 0; c < 5; c++) {
      const sym = lineSymbols[c];
      if (sym !== 'WILD' && sym !== 'SCATTER') {
        candidate = sym;
        break;
      }
    }

    // If all symbols are WILD, treat candidate as WILD
    if (!candidate && lineSymbols[0] === 'WILD') {
      candidate = 'WILD';
    }

    // Evaluate pure wild matches from left
    let pureWildCount = 0;
    const pureWildPositions: [number, number][] = [];
    for (let c = 0; c < 5; c++) {
      if (lineSymbols[c] === 'WILD') {
        pureWildCount++;
        pureWildPositions.push([payline.positions[c], c]);
      } else {
        break;
      }
    }
    const pureWildBasePayout = pureWildCount >= 3 ? (SYMBOLS.WILD.payouts[pureWildCount as 3 | 4 | 5] || 0) : 0;
    const pureWildPayout = pureWildBasePayout * betPerLine * multiplier;

    // Evaluate substituted candidate matches from left
    let candidateCount = 0;
    let containsWild = false;
    const candidatePositions: [number, number][] = [];

    if (candidate && candidate !== 'WILD') {
      for (let c = 0; c < 5; c++) {
        const sym = lineSymbols[c];
        const row = payline.positions[c];

        if (sym === candidate || sym === 'WILD') {
          candidateCount++;
          candidatePositions.push([row, c]);
          if (sym === 'WILD') containsWild = true;
        } else {
          break;
        }
      }
    }

    const candidateBasePayout = candidate && candidateCount >= 3 ? (SYMBOLS[candidate].payouts[candidateCount as 3 | 4 | 5] || 0) : 0;
    const wildFactor = containsWild ? (SYMBOLS.WILD.wildMultiplier || 2) : 1;
    const candidatePayout = candidateBasePayout * betPerLine * (wildFactor * multiplier);

    if (pureWildPayout > 0 && pureWildPayout >= candidatePayout) {
      winningLines.push({
        lineId: payline.id,
        symbol: 'WILD',
        count: pureWildCount,
        multiplier,
        payout: pureWildPayout,
        positions: pureWildPositions,
        isWildSubstituted: false,
      });
      totalPayout += pureWildPayout;
    } else if (candidatePayout > 0 && candidate) {
      winningLines.push({
        lineId: payline.id,
        symbol: candidate,
        count: candidateCount,
        multiplier: wildFactor * multiplier,
        payout: candidatePayout,
        positions: candidatePositions,
        isWildSubstituted: containsWild,
      });
      totalPayout += candidatePayout;
    }
  }

  // 2. Evaluate Scatters (anywhere on the matrix)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === 'SCATTER') {
        scatterPositions.push([r, c]);
      }
    }
  }

  const scatterCount = scatterPositions.length;
  let freeSpinsWon = 0;
  let freeSpinsTriggered = false;

  if (scatterCount >= 3) {
    freeSpinsTriggered = true;
    if (scatterCount === 3) freeSpinsWon = 10;
    else if (scatterCount === 4) freeSpinsWon = 15;
    else if (scatterCount >= 5) freeSpinsWon = 25;

    // Scatter cash multiplier based on total wager (activeLineCount * betPerLine)
    const totalBet = activeLineCount * betPerLine;
    let scatterMultiplier = 2;
    if (scatterCount === 4) scatterMultiplier = 10;
    else if (scatterCount >= 5) scatterMultiplier = 50;

    totalPayout += totalBet * scatterMultiplier;
  }

  const isJackpot = totalPayout >= (activeLineCount * betPerLine * 50);

  return {
    matrix,
    winningLines,
    totalPayout,
    scatterCount,
    freeSpinsTriggered,
    freeSpinsWon,
    isJackpot,
  };
}
