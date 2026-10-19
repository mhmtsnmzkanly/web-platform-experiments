import { Direction, Position, LetterBlock, GoalSocket, Barrier, LevelConfig, UndoSnapshot } from '../types';

export interface MoveResult {
  valid: boolean;
  pushed: boolean;
  newPlayerPos: Position;
  newBlocks: LetterBlock[];
  newBarriers: Barrier[];
  socketJustMatched: boolean;
  barrierJustUnlocked: boolean;
  isWon: boolean;
}

export function getDelta(dir: Direction): { dc: number; dr: number } {
  switch (dir) {
    case 'UP':
      return { dc: 0, dr: -1 };
    case 'DOWN':
      return { dc: 0, dr: 1 };
    case 'LEFT':
      return { dc: -1, dr: 0 };
    case 'RIGHT':
      return { dc: 1, dr: 0 };
  }
}

export function isWall(col: number, row: number, walls: number[][]): boolean {
  if (row < 0 || row >= walls.length || col < 0 || col >= walls[0].length) {
    return true;
  }
  return walls[row][col] === 1;
}

export function isBarrierActiveAt(col: number, row: number, barriers: Barrier[]): boolean {
  const b = barriers.find((bar) => bar.col === col && bar.row === row);
  return b ? b.active : false;
}

export function findBlockAt(col: number, row: number, blocks: LetterBlock[]): LetterBlock | undefined {
  return blocks.find((b) => b.col === col && b.row === row);
}

/**
 * Checks matching state for each block against sockets.
 */
export function updateSocketMatches(blocks: LetterBlock[], sockets: GoalSocket[]): {
  updatedBlocks: LetterBlock[];
  matchedCount: number;
} {
  let matchedCount = 0;
  const updatedBlocks = blocks.map((b) => {
    const socket = sockets.find((s) => s.col === b.col && s.row === b.row);
    const isMatched = socket ? socket.char === b.char : false;
    if (isMatched) matchedCount++;
    return { ...b, isMatched };
  });

  return { updatedBlocks, matchedCount };
}

/**
 * Evaluate syntactic rule triggers (e.g. sequence 'ACT' matching disables the barrier)
 */
export function updateBarriers(
  level: LevelConfig,
  blocks: LetterBlock[],
  barriers: Barrier[]
): { updatedBarriers: Barrier[]; barrierJustUnlocked: boolean } {
  if (!level.syntacticRule) {
    return { updatedBarriers: barriers, barrierJustUnlocked: false };
  }

  const { triggerWord, barrierPosition } = level.syntacticRule;
  // Check if all letters in triggerWord are currently matched
  const triggerChars = triggerWord.split('');
  const matchedChars = blocks
    .filter((b) => b.isMatched)
    .map((b) => b.char);

  const isTriggerSatisfied = triggerChars.every((ch) => matchedChars.includes(ch));

  let barrierJustUnlocked = false;
  const updatedBarriers = barriers.map((barrier) => {
    if (barrier.col === barrierPosition.col && barrier.row === barrierPosition.row) {
      const willBeActive = !isTriggerSatisfied;
      if (barrier.active && !willBeActive) {
        barrierJustUnlocked = true;
      }
      return { ...barrier, active: willBeActive };
    }
    return barrier;
  });

  return { updatedBarriers, barrierJustUnlocked };
}

/**
 * Execute a move step in the Sokoban world.
 */
export function executeMove(
  player: Position,
  dir: Direction,
  level: LevelConfig,
  blocks: LetterBlock[],
  barriers: Barrier[]
): MoveResult {
  const { dc, dr } = getDelta(dir);
  const targetCol = player.col + dc;
  const targetRow = player.row + dr;

  // 1. Check if target is a solid wall
  if (isWall(targetCol, targetRow, level.walls)) {
    return {
      valid: false,
      pushed: false,
      newPlayerPos: player,
      newBlocks: blocks,
      newBarriers: barriers,
      socketJustMatched: false,
      barrierJustUnlocked: false,
      isWon: false,
    };
  }

  // 2. Check if target is an active barrier
  if (isBarrierActiveAt(targetCol, targetRow, barriers)) {
    return {
      valid: false,
      pushed: false,
      newPlayerPos: player,
      newBlocks: blocks,
      newBarriers: barriers,
      socketJustMatched: false,
      barrierJustUnlocked: false,
      isWon: false,
    };
  }

  // 3. Check if target contains a movable letter block
  const blockAtTarget = findBlockAt(targetCol, targetRow, blocks);

  if (blockAtTarget) {
    // Attempting a push
    const pushCol = targetCol + dc;
    const pushRow = targetRow + dr;

    // Push destination cannot be wall
    if (isWall(pushCol, pushRow, level.walls)) {
      return {
        valid: false,
        pushed: false,
        newPlayerPos: player,
        newBlocks: blocks,
        newBarriers: barriers,
        socketJustMatched: false,
        barrierJustUnlocked: false,
        isWon: false,
      };
    }

    // Push destination cannot be active barrier
    if (isBarrierActiveAt(pushCol, pushRow, barriers)) {
      return {
        valid: false,
        pushed: false,
        newPlayerPos: player,
        newBlocks: blocks,
        newBarriers: barriers,
        socketJustMatched: false,
        barrierJustUnlocked: false,
        isWon: false,
      };
    }

    // Push destination cannot contain another block
    if (findBlockAt(pushCol, pushRow, blocks)) {
      return {
        valid: false,
        pushed: false,
        newPlayerPos: player,
        newBlocks: blocks,
        newBarriers: barriers,
        socketJustMatched: false,
        barrierJustUnlocked: false,
        isWon: false,
      };
    }

    // Valid push!
    const updatedBlocks = blocks.map((b) =>
      b.id === blockAtTarget.id ? { ...b, col: pushCol, row: pushRow } : b
    );

    const { updatedBlocks: matchedBlocks, matchedCount } = updateSocketMatches(updatedBlocks, level.sockets);
    const oldMatchedCount = blocks.filter((b) => b.isMatched).length;
    const socketJustMatched = matchedCount > oldMatchedCount;

    const { updatedBarriers, barrierJustUnlocked } = updateBarriers(level, matchedBlocks, barriers);
    const isWon = matchedBlocks.every((b) => b.isMatched);

    return {
      valid: true,
      pushed: true,
      newPlayerPos: { col: targetCol, row: targetRow },
      newBlocks: matchedBlocks,
      newBarriers: updatedBarriers,
      socketJustMatched,
      barrierJustUnlocked,
      isWon,
    };
  }

  // 4. Normal movement into empty space
  const isWon = blocks.every((b) => b.isMatched);

  return {
    valid: true,
    pushed: false,
    newPlayerPos: { col: targetCol, row: targetRow },
    newBlocks: blocks,
    newBarriers: barriers,
    socketJustMatched: false,
    barrierJustUnlocked: false,
    isWon,
  };
}

/**
 * Creates an initial state for a given level.
 */
export function initializeLevelState(level: LevelConfig) {
  const blocks: LetterBlock[] = level.blocks.map((b) => ({
    ...b,
    isMatched: false,
  }));

  const barriers: Barrier[] = [];
  if (level.syntacticRule) {
    barriers.push({
      col: level.syntacticRule.barrierPosition.col,
      row: level.syntacticRule.barrierPosition.row,
      active: true,
      requiredWordTrigger: level.syntacticRule.triggerWord,
    });
  }

  const { updatedBlocks } = updateSocketMatches(blocks, level.sockets);
  const { updatedBarriers } = updateBarriers(level, updatedBlocks, barriers);

  return {
    playerPos: { ...level.playerStart },
    blocks: updatedBlocks,
    barriers: updatedBarriers,
    playerDir: 'DOWN' as Direction,
    turnCount: 0,
    pushCount: 0,
    isWon: false,
    history: [] as UndoSnapshot[],
  };
}
