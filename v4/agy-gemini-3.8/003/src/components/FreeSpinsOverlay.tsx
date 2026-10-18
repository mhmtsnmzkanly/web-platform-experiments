import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';
import { FreeSpinsState } from '../types';

interface FreeSpinsOverlayProps {
  freeSpinsState: FreeSpinsState;
}

export const FreeSpinsOverlay: React.FC<FreeSpinsOverlayProps> = ({ freeSpinsState }) => {
  if (!freeSpinsState.active) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-2 p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-neutral-900 to-cyan-950/80 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-between animate-pulse">
      {/* Feature Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
          <ShieldAlert size={20} className="animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-sm font-mono font-black text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
            VAULT HEIST — FREE SPINS ACTIVE
          </h3>
          <span className="text-[10px] font-mono text-cyan-200/80">
            ALL LINE WINS MULTIPLIED BY {freeSpinsState.currentMultiplier}X
          </span>
        </div>
      </div>

      {/* Multiplier Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-900/60 border border-cyan-400 text-cyan-200 font-mono font-bold text-xs">
        <Zap size={14} className="text-amber-400" />
        <span>{freeSpinsState.currentMultiplier}X MULTIPLIER</span>
      </div>

      {/* Remaining Spins Counter */}
      <div className="flex items-center gap-4">
        <div className="text-right font-mono">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
            VAULT ACCUMULATION
          </span>
          <span className="text-lg font-bold text-emerald-400">
            ${freeSpinsState.totalWonSoFar.toFixed(2)}
          </span>
        </div>
        <div className="bg-cyan-500 text-black font-mono font-black text-base px-3 py-1.5 rounded-xl shadow-lg border border-white">
          {freeSpinsState.remainingSpins} SPINS LEFT
        </div>
      </div>
    </div>
  );
};
