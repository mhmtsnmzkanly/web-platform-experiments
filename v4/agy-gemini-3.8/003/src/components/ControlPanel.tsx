import React, { useState } from 'react';
import { Volume2, VolumeX, Info, BarChart2, Sparkles, RefreshCw, Shield, X } from 'lucide-react';
import { soundFx } from '../audio/SlotAudioEngine';

export interface AutoSpinSettings {
  count: number;
  stopOnWinLimit: number; // 0 = any
  stopOnLossLimit: number; // 0 = any
  stopOnBonus: boolean;
}

interface ControlPanelProps {
  balance: number;
  betPerLine: number;
  activeLines: number;
  lastWin: number;
  isSpinning: boolean;
  isFreeSpin: boolean;
  canGamble: boolean;
  onSpin: () => void;
  onChangeBet: (newBet: number) => void;
  onChangeLines: (newLines: number) => void;
  onMaxBet: () => void;
  onOpenPaytable: () => void;
  onOpenStats: () => void;
  onOpenGamble: () => void;
  autoSpinCount: number;
  onStartAutoSpin: (settings: AutoSpinSettings) => void;
  onStopAutoSpin: () => void;
  onReloadCredits: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const BET_STEPS = [0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  balance,
  betPerLine,
  activeLines,
  lastWin,
  isSpinning,
  isFreeSpin,
  canGamble,
  onSpin,
  onChangeBet,
  onChangeLines,
  onMaxBet,
  onOpenPaytable,
  onOpenStats,
  onOpenGamble,
  autoSpinCount,
  onStartAutoSpin,
  onStopAutoSpin,
  onReloadCredits,
  isMuted,
  onToggleMute,
}) => {
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [selectedSpins, setSelectedSpins] = useState<number>(25);
  const [stopOnWinLimit, setStopOnWinLimit] = useState<number>(100);
  const [stopOnLossLimit, setStopOnLossLimit] = useState<number>(200);
  const [stopOnBonus, setStopOnBonus] = useState<boolean>(true);

  const totalBet = activeLines * betPerLine;
  const canSpin = !isSpinning && (isFreeSpin || balance >= totalBet);
  const isBankrupt = balance < totalBet && !isFreeSpin;

  const handleBetMinus = () => {
    soundFx.playButtonClick();
    const currIdx = BET_STEPS.indexOf(betPerLine);
    if (currIdx > 0) {
      onChangeBet(BET_STEPS[currIdx - 1]);
    }
  };

  const handleBetPlus = () => {
    soundFx.playButtonClick();
    const currIdx = BET_STEPS.indexOf(betPerLine);
    if (currIdx < BET_STEPS.length - 1) {
      onChangeBet(BET_STEPS[currIdx + 1]);
    }
  };

  const handleLinesMinus = () => {
    soundFx.playButtonClick();
    if (activeLines > 1) {
      onChangeLines(activeLines - 1);
    }
  };

  const handleLinesPlus = () => {
    soundFx.playButtonClick();
    if (activeLines < 20) {
      onChangeLines(activeLines + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 p-4 rounded-xl bg-gradient-to-b from-[#181d28] via-[#10141d] to-[#0c0f17] border-2 border-[#2b3548] shadow-2xl flex flex-col gap-3">
      {/* Upper Status Ribbon */}
      <div className="grid grid-cols-3 gap-3 bg-black/90 p-2.5 rounded-lg border border-neutral-800 shadow-inner">
        {/* Balance Display */}
        <div className="flex flex-col items-center justify-center bg-[#090b10] border border-cyan-900/60 rounded px-3 py-1.5 shadow-sm relative">
          <span className="text-[10px] tracking-widest text-cyan-500 font-mono uppercase font-bold">
            CREDITS / BALANCE
          </span>
          <span className="text-xl md:text-2xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {/* Bankruptcy Replenish Button */}
          {isBankrupt && (
            <button
              onClick={() => {
                soundFx.playButtonClick();
                onReloadCredits();
              }}
              className="absolute -bottom-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded shadow-lg border border-white animate-bounce flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={10} />
              RELOAD $1,000
            </button>
          )}
        </div>

        {/* Total Bet Display */}
        <div className="flex flex-col items-center justify-center bg-[#090b10] border border-amber-900/60 rounded px-3 py-1.5 shadow-sm">
          <span className="text-[10px] tracking-widest text-amber-500 font-mono uppercase font-bold">
            {isFreeSpin ? 'FREE SPIN ROUND' : 'TOTAL WAGER'}
          </span>
          <span className="text-xl md:text-2xl font-mono font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
            {isFreeSpin ? '$0.00 (FREE)' : `$${totalBet.toFixed(2)}`}
          </span>
        </div>

        {/* Last Win Display */}
        <div className="flex flex-col items-center justify-center bg-[#090b10] border border-emerald-900/60 rounded px-3 py-1.5 shadow-sm">
          <span className="text-[10px] tracking-widest text-emerald-500 font-mono uppercase font-bold">
            PAID OUT / WIN
          </span>
          <span
            className={`text-xl md:text-2xl font-mono font-bold transition-all ${
              lastWin > 0
                ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse'
                : 'text-neutral-500'
            }`}
          >
            ${lastWin.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Interactive Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Sub-Controls: Mute, Info, Stats, Lines, Bet */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mute Button */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onToggleMute();
            }}
            className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors shadow cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Paytable Button */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onOpenPaytable();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-bold uppercase border border-neutral-700 transition-colors shadow cursor-pointer"
          >
            <Info size={16} />
            <span>PAYTABLE</span>
          </button>

          {/* Telemetry / Stats Button */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onOpenStats();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-bold uppercase border border-neutral-700 transition-colors shadow cursor-pointer"
          >
            <BarChart2 size={16} />
            <span>STATS</span>
          </button>

          {/* Lines Selector */}
          <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden shadow">
            <span className="px-2.5 text-[11px] font-mono text-neutral-400 uppercase font-bold">
              LINES: <strong className="text-white text-sm">{activeLines}</strong>
            </span>
            <button
              onClick={handleLinesMinus}
              disabled={isSpinning || activeLines <= 1 || isFreeSpin}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-bold border-l border-neutral-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              -
            </button>
            <button
              onClick={handleLinesPlus}
              disabled={isSpinning || activeLines >= 20 || isFreeSpin}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-bold border-l border-neutral-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Bet Per Line Selector */}
          <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden shadow">
            <span className="px-2.5 text-[11px] font-mono text-neutral-400 uppercase font-bold">
              BET/LINE: <strong className="text-amber-400 text-sm">${betPerLine.toFixed(2)}</strong>
            </span>
            <button
              onClick={handleBetMinus}
              disabled={isSpinning || betPerLine <= BET_STEPS[0] || isFreeSpin}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-bold border-l border-neutral-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              -
            </button>
            <button
              onClick={handleBetPlus}
              disabled={isSpinning || betPerLine >= BET_STEPS[BET_STEPS.length - 1] || isFreeSpin}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-bold border-l border-neutral-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Max Bet Shortcut */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpin}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase shadow transition-all border border-amber-500/50 cursor-pointer disabled:cursor-not-allowed"
          >
            MAX BET
          </button>
        </div>

        {/* Right Action Controls: Gamble, Auto, Spin */}
        <div className="flex items-center gap-2.5">
          {/* Double or Nothing Gamble Trigger Button */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onOpenGamble();
            }}
            disabled={!canGamble || isSpinning}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl font-mono font-bold text-xs uppercase shadow-lg transition-all border cursor-pointer ${
              canGamble && !isSpinning
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-pink-400 animate-pulse hover:scale-105 shadow-[0_0_15px_rgba(219,39,119,0.7)]'
                : 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed opacity-40'
            }`}
          >
            <Sparkles size={16} />
            <span>GAMBLE</span>
          </button>

          {/* Auto Spin Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playButtonClick();
                if (autoSpinCount > 0) {
                  onStopAutoSpin();
                } else {
                  setShowAutoModal(!showAutoModal);
                }
              }}
              disabled={isSpinning && autoSpinCount === 0}
              className={`px-3 py-3 rounded-xl font-mono font-bold text-xs uppercase border transition-all shadow cursor-pointer ${
                autoSpinCount > 0
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              {autoSpinCount > 0 ? `STOP AUTO (${autoSpinCount})` : 'AUTO PLAY'}
            </button>

            {/* Configurable Auto Play & Responsible Gaming Safety Limits Dialog */}
            {showAutoModal && autoSpinCount === 0 && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-neutral-900 border-2 border-amber-500/80 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50 text-neutral-100 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Shield size={14} />
                    <span>AUTO-PLAY SAFETY LIMITS</span>
                  </div>
                  <button
                    onClick={() => setShowAutoModal(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Spin Count Choices */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Number of Rounds
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 25, 50, 100].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSelectedSpins(count)}
                        className={`py-1 rounded text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          selectedSpins === count
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Single Win Limit */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Stop if Single Win Exceeds:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[50, 100, 500].map((limit) => (
                      <button
                        key={limit}
                        onClick={() => setStopOnWinLimit(limit)}
                        className={`py-1 rounded text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                          stopOnWinLimit === limit
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        ${limit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stop on Bonus Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={stopOnBonus}
                    onChange={(e) => setStopOnBonus(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-[11px] font-mono text-neutral-300">
                    Stop if Vault Heist Triggered
                  </span>
                </label>

                {/* Start Auto-Spin Button */}
                <button
                  onClick={() => {
                    soundFx.playButtonClick();
                    setShowAutoModal(false);
                    onStartAutoSpin({
                      count: selectedSpins,
                      stopOnWinLimit,
                      stopOnLossLimit,
                      stopOnBonus,
                    });
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-black text-xs uppercase rounded-lg shadow-lg cursor-pointer"
                >
                  START {selectedSpins} SPINS
                </button>
              </div>
            )}
          </div>

          {/* Massive Tactile Red Arcade Spin Button */}
          <button
            onClick={() => {
              if (canSpin) {
                soundFx.playButtonClick();
                onSpin();
              }
            }}
            disabled={!canSpin}
            className={`w-28 md:w-32 py-3.5 rounded-2xl font-mono font-black text-lg md:text-xl tracking-wider uppercase transition-all transform shadow-2xl border-2 cursor-pointer ${
              isSpinning
                ? 'bg-neutral-800 text-neutral-500 border-neutral-700 scale-95 opacity-70 cursor-wait'
                : !canSpin
                ? 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed opacity-50'
                : isFreeSpin
                ? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-700 text-black border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] animate-pulse'
                : 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:to-red-700 active:scale-95 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.7)]'
            }`}
          >
            {isFreeSpin ? 'FREE SPIN' : 'SPIN'}
          </button>
        </div>
      </div>
    </div>
  );
};
