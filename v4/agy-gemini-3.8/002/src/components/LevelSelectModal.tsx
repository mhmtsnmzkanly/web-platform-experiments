import React from 'react';
import { LevelConfig, PlayerStats } from '../types';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelConfig[];
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
  stats: PlayerStats;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelId,
  onSelectLevel,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-neutral-900 border-2 border-neutral-700 rounded-lg p-6 shadow-2xl text-neutral-100 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-black tracking-wider text-emerald-400">
              [CARTRIDGE DIRECTORY]
            </h2>
            <p className="text-xs text-neutral-400">Select a Lexical Stage to Compile</p>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-600 cursor-pointer"
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Levels Grid */}
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {levels.map((lvl) => {
            const isCompleted = stats.completedLevels.includes(lvl.id);
            const isCurrent = lvl.id === currentLevelId;
            const bestMove = stats.bestMoves[lvl.id];

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-300">
                      STAGE {lvl.id}: {lvl.name.replace(/^LEVEL \d+:\s*/, '')}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                        CLEARED ★
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-0.5">{lvl.subtitle}</p>

                  <div className="mt-1 flex items-center gap-3 text-[10px] text-neutral-500">
                    <span>TARGET: <strong className="text-amber-400">{lvl.targetWord}</strong></span>
                    <span>PAR: {lvl.parMoves} MOVES</span>
                    {bestMove !== undefined && (
                      <span className="text-cyan-400 font-bold">BEST: {bestMove}</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <button className="px-3 py-1.5 text-xs font-bold rounded bg-neutral-800 hover:bg-emerald-600 hover:text-black border border-neutral-700 transition-colors">
                    {isCurrent ? 'ACTIVE' : 'BOOT'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>PROGRESS: {stats.completedLevels.length} / {levels.length} COMPLETED</span>
          <span>TOTAL PUSHES: {stats.totalPushes}</span>
        </div>
      </div>
    </div>
  );
};
