import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS, PALETTES } from './engine/levels';
import {
  Direction,
  LevelConfig,
  LetterBlock,
  Barrier,
  Position,
  PaletteName,
  PlayerStats,
  UndoSnapshot,
} from './types';
import { executeMove, initializeLevelState } from './engine/sokobanLogic';
import { soundFx } from './audio/GameBoyAudioEngine';
import { DotMatrixDisplay } from './components/DotMatrixDisplay';
import { DPad } from './components/DPad';
import { ActionButtons } from './components/ActionButtons';
import { LevelSelectModal } from './components/LevelSelectModal';

const STATS_STORAGE_KEY = 'typographic_sokoban_v3_stats';

const PALETTE_CYCLE: PaletteName[] = ['DMG_ORIGINAL', 'POCKET_MONO', 'CYBER_NEON', 'AMBER_PLASMA'];

function saveStatsToStorage(stats: PlayerStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Gracefully ignore storage quota / iframe security errors
  }
}

export function App() {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevel: LevelConfig = LEVELS[levelIndex];

  // Game state
  const [playerPos, setPlayerPos] = useState<Position>(currentLevel.playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('DOWN');
  const [blocks, setBlocks] = useState<LetterBlock[]>([]);
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [pushCount, setPushCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [history, setHistory] = useState<UndoSnapshot[]>([]);

  // System state
  const [paletteKey, setPaletteKey] = useState<PaletteName>('DMG_ORIGINAL');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('USE D-PAD OR ARROW KEYS TO MOVE');

  // Stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { completedLevels: [], bestMoves: {}, totalPushes: 0 };
  });

  // Keep ref for immediate, synchronous state tracking to prevent key repeat races
  const stateRef = useRef({
    levelIndex,
    currentLevel,
    playerPos,
    playerDir,
    blocks,
    barriers,
    turnCount,
    pushCount,
    isWon,
    history,
    isModalOpen,
  });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      levelIndex,
      currentLevel,
      playerPos,
      playerDir,
      blocks,
      barriers,
      turnCount,
      pushCount,
      isWon,
      history,
      isModalOpen,
    };
  });

  // Cleanup Web Audio on component unmount
  useEffect(() => {
    return () => {
      soundFx.dispose();
    };
  }, []);

  // Synchronous Level Loader & Initializer
  const applyLevel = useCallback((lvlIndex: number) => {
    const lvl = LEVELS[lvlIndex];
    const init = initializeLevelState(lvl);

    setLevelIndex(lvlIndex);
    setPlayerPos(init.playerPos);
    setPlayerDir(init.playerDir);
    setBlocks(init.blocks);
    setBarriers(init.barriers);
    setTurnCount(0);
    setPushCount(0);
    setIsWon(false);
    setHistory([]);

    const msg = lvl.syntacticRule
      ? `BARRIER LOCKED: ${lvl.syntacticRule.description}`
      : `SPELL: "${lvl.targetWord}" IN THE SOCKETS`;
    setStatusMessage(msg);

    // Update stateRef synchronously to avoid race conditions
    stateRef.current = {
      ...stateRef.current,
      levelIndex: lvlIndex,
      currentLevel: lvl,
      playerPos: init.playerPos,
      playerDir: init.playerDir,
      blocks: init.blocks,
      barriers: init.barriers,
      turnCount: 0,
      pushCount: 0,
      isWon: false,
      history: [],
    };
  }, []);

  // Initialize level on mount
  useEffect(() => {
    applyLevel(0);
  }, [applyLevel]);

  // Movement execution handler (with synchronous state update)
  const handleMove = useCallback((dir: Direction) => {
    const s = stateRef.current;
    if (s.isWon) return;

    // Snapshot for undo (including pushCount)
    const snapshot: UndoSnapshot = {
      player: { ...s.playerPos },
      blocks: s.blocks.map((b) => ({ ...b })),
      barriers: s.barriers.map((bar) => ({ ...bar })),
      turnCount: s.turnCount,
      pushCount: s.pushCount,
      direction: s.playerDir,
    };

    const res = executeMove(s.playerPos, dir, s.currentLevel, s.blocks, s.barriers);

    setPlayerDir(dir);

    if (!res.valid) {
      soundFx.playBump();
      return;
    }

    // Valid move!
    const nextTurnCount = s.turnCount + 1;
    const nextPushCount = res.pushed ? s.pushCount + 1 : s.pushCount;
    const nextHistory = [...s.history, snapshot];

    // Synchronously update ref so rapid keydown events operate on newest state
    stateRef.current = {
      ...s,
      playerPos: res.newPlayerPos,
      playerDir: dir,
      blocks: res.newBlocks,
      barriers: res.newBarriers,
      turnCount: nextTurnCount,
      pushCount: nextPushCount,
      isWon: res.isWon,
      history: nextHistory,
    };

    // React state updates
    setPlayerPos(res.newPlayerPos);
    setBlocks(res.newBlocks);
    setBarriers(res.newBarriers);
    setTurnCount(nextTurnCount);
    setHistory(nextHistory);

    if (res.pushed) {
      setPushCount(nextPushCount);
      setStats((prev) => {
        const updated = { ...prev, totalPushes: prev.totalPushes + 1 };
        saveStatsToStorage(updated);
        return updated;
      });
      soundFx.playPush();
    } else {
      soundFx.playStep();
    }

    if (res.socketJustMatched) {
      soundFx.playSocketMatch();
      setStatusMessage('LETTER SEATED! LEXICAL BUS CONNECTED.');
    }

    if (res.barrierJustUnlocked) {
      soundFx.playBarrierUnlocked();
      setStatusMessage('SYNTACTIC RULE RESOLVED: BARRIER DEACTIVATED!');
    }

    if (res.isWon) {
      setIsWon(true);
      soundFx.playLevelClear();
      setStatusMessage('TARGET WORD ASSEMBLED! LEVEL CLEAR ★');

      // Update stats
      setStats((prev) => {
        const newMoves = nextTurnCount;
        const currentBest = prev.bestMoves[s.currentLevel.id];
        const bestMoves = {
          ...prev.bestMoves,
          [s.currentLevel.id]: currentBest ? Math.min(currentBest, newMoves) : newMoves,
        };
        const completedLevels = Array.from(new Set([...prev.completedLevels, s.currentLevel.id]));
        const updated = { ...prev, completedLevels, bestMoves };
        saveStatsToStorage(updated);
        return updated;
      });
    }
  }, []);

  // Undo handler (B button)
  const handleUndo = useCallback(() => {
    const s = stateRef.current;
    if (s.history.length === 0 || s.isWon) return;

    const last = s.history[s.history.length - 1];
    const nextHistory = s.history.slice(0, -1);

    // Synchronously update ref
    stateRef.current = {
      ...s,
      playerPos: last.player,
      blocks: last.blocks,
      barriers: last.barriers,
      turnCount: last.turnCount,
      pushCount: last.pushCount,
      playerDir: last.direction,
      history: nextHistory,
    };

    setPlayerPos(last.player);
    setBlocks(last.blocks);
    setBarriers(last.barriers);
    setTurnCount(last.turnCount);
    setPushCount(last.pushCount);
    setPlayerDir(last.direction);
    setHistory(nextHistory);

    soundFx.playUndo();
    setStatusMessage('STEP REVERTED.');
  }, []);

  // Action / Next Level handler (A button)
  const handleAButton = useCallback(() => {
    soundFx.playClick();
    if (stateRef.current.isWon) {
      // Proceed to next level synchronously
      const nextIndex = (stateRef.current.levelIndex + 1) % LEVELS.length;
      applyLevel(nextIndex);
    } else {
      // Show word hint in status
      setStatusMessage(`TARGET WORD: [ ${stateRef.current.currentLevel.targetWord} ]`);
    }
  }, [applyLevel]);

  // Reset handler (Start button)
  const handleReset = useCallback(() => {
    soundFx.playClick();
    applyLevel(stateRef.current.levelIndex);
  }, [applyLevel]);

  // Toggle Palette handler (Select button)
  const handleCyclePalette = useCallback(() => {
    soundFx.playClick();
    setPaletteKey((curr) => {
      const idx = PALETTE_CYCLE.indexOf(curr);
      return PALETTE_CYCLE[(idx + 1) % PALETTE_CYCLE.length];
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.isModalOpen) {
        if (e.key === 'Escape') setIsModalOpen(false);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        case 'z':
        case 'Z':
        case 'u':
        case 'Backspace':
          e.preventDefault();
          handleUndo();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleAButton();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'p':
        case 'P':
        case 'Tab':
          e.preventDefault();
          handleCyclePalette();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(soundFx.toggleMute());
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setIsModalOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMove, handleUndo, handleAButton, handleReset, handleCyclePalette]);

  const activePalette = PALETTES[paletteKey];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-3 select-none">
      {/* Top Banner / Breadcrumb */}
      <header className="w-full max-w-md flex items-center justify-between py-2 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-bold text-neutral-200 tracking-wider">TYPOGRAPHIC SOKOBAN V3</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="hover:text-emerald-400 border border-neutral-800 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            [SELECT STAGE]
          </button>
          <button
            onClick={() => setIsMuted(soundFx.toggleMute())}
            className="hover:text-emerald-400 border border-neutral-800 px-2 py-0.5 rounded cursor-pointer transition-colors"
            aria-label="Toggle Audio"
          >
            {isMuted ? '🔇 MUTE' : '🔊 AUDIO'}
          </button>
        </div>
      </header>

      {/* Physical DMG-01 Game Boy Chassis */}
      <section aria-label="Game Boy Console" className="relative w-full max-w-[420px] bg-neutral-300 rounded-[24px] rounded-br-[64px] border-4 border-neutral-400 p-5 shadow-2xl flex flex-col items-center text-neutral-800">
        {/* Top Groove & Header Line */}
        <div className="w-full flex items-center justify-between pb-2 mb-1 border-b-2 border-neutral-400/60 px-1 text-[10px] font-mono font-bold text-neutral-500 tracking-wider">
          <span>DOT MATRIX WITH STEREO SOUND</span>
          <span>DMG-CPU-V3</span>
        </div>

        {/* Screen Bezel (Classic Dark Grey Lens) */}
        <div className="w-full bg-neutral-800 rounded-t-lg rounded-b-xl p-4 shadow-inner border border-neutral-700 flex flex-col items-center">
          {/* Bezel Title & Battery Indicator */}
          <div className="w-full flex items-center justify-between mb-2 px-2 text-[10px] font-mono tracking-widest text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-sm animate-pulse" />
              <span className="text-[9px] text-neutral-400 font-bold">BATTERY</span>
            </div>
            <span className="text-neutral-300 font-bold tracking-wider">
              {currentLevel.name}
            </span>
          </div>

          {/* LCD Dot Matrix Canvas Display */}
          <DotMatrixDisplay
            level={currentLevel}
            playerPos={playerPos}
            playerDir={playerDir}
            blocks={blocks}
            barriers={barriers}
            palette={activePalette}
            isWon={isWon}
            parMoves={currentLevel.parMoves}
            turnCount={turnCount}
          />

          {/* Real-time Telemetry HUD Bar under screen */}
          <div className="w-full mt-2 pt-2 border-t border-neutral-700/80 flex items-center justify-between text-[11px] font-mono text-emerald-400 px-1">
            <span>MOVES: <strong className="text-white">{turnCount}</strong> / {currentLevel.parMoves}</span>
            <span>PUSHES: <strong className="text-white">{pushCount}</strong></span>
            <span className="text-amber-400 font-bold">
              {blocks.filter((b) => b.isMatched).length} / {blocks.length} MATCHED
            </span>
          </div>
        </div>

        {/* Sub-screen Status / Lexical Instruction Ticker */}
        <div className="w-full mt-3 px-3 py-1.5 bg-neutral-400/60 rounded border border-neutral-400 text-neutral-900 font-mono text-[10px] text-center font-bold tracking-wide truncate">
          {statusMessage}
        </div>

        {/* Nintendo-Style Typographic Logo */}
        <div className="w-full flex items-center justify-between mt-3 px-3">
          <span className="font-sans font-black italic tracking-tighter text-blue-900 text-sm">
            <i>Antigravity</i> <span className="text-[11px] font-normal not-italic tracking-normal text-neutral-600">GAME BOY™</span>
          </span>
          <span className="text-[9px] font-mono text-neutral-600 font-bold">
            PALETTE: {activePalette.name}
          </span>
        </div>

        {/* Lower Control Section: D-Pad + Action Buttons */}
        <div className="w-full flex items-center justify-between px-2 mt-4 pt-2">
          {/* Directional Pad */}
          <DPad onMove={handleMove} disabled={isWon} />

          {/* Action & Meta Buttons */}
          <ActionButtons
            onA={handleAButton}
            onB={handleUndo}
            onSelect={handleCyclePalette}
            onStart={handleReset}
            canUndo={history.length > 0 && !isWon}
            isWon={isWon}
          />
        </div>

        {/* Speaker Slats (Bottom-right diagonal grooves) */}
        <div className="w-full flex justify-end gap-1.5 mt-3 pr-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-neutral-400/80 rounded-full rotate-[-30deg] shadow-inner"
            />
          ))}
        </div>
      </section>

      {/* Control Helper Bar for Desktop Keyboard */}
      <footer className="mt-4 text-center font-mono text-[11px] text-neutral-400 space-x-3">
        <span>[WASD / ARROWS] Move</span>
        <span>•</span>
        <span>[Z / Backspace] Undo</span>
        <span>•</span>
        <span>[Enter] Next / Action</span>
        <span>•</span>
        <span>[R] Restart</span>
        <span>•</span>
        <span>[P] Palette</span>
        <span>•</span>
        <span>[M] Mute</span>
      </footer>

      {/* Level Select Modal */}
      <LevelSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        levels={LEVELS}
        currentLevelId={currentLevel.id}
        onSelectLevel={(id) => {
          const idx = LEVELS.findIndex((l) => l.id === id);
          if (idx !== -1) applyLevel(idx);
        }}
        stats={stats}
      />
    </main>
  );
}
