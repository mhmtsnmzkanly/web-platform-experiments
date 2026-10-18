import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { SYMBOLS, PAYLINES } from '../engine/slotMath';
import { soundFx } from '../audio/SlotAudioEngine';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
  betPerLine: number;
  onSelectPreviewLine: (lineId: number | null) => void;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({
  isOpen,
  onClose,
  betPerLine,
  onSelectPreviewLine,
}) => {
  const [activeTab, setActiveTab] = useState<'payouts' | 'features' | 'paylines'>('payouts');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#181d28] via-[#10141d] to-[#0c0f17] border-2 border-[#3b4760] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700 bg-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={22} />
            <h2 className="text-lg md:text-xl font-mono font-bold tracking-wider text-amber-300 uppercase">
              AERO-VAULT 777 — PAYTABLE & RULES
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/60 px-6 pt-2">
          {(['payouts', 'features', 'paylines'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundFx.playButtonClick();
                setActiveTab(tab);
              }}
              className={`py-2 px-5 font-mono text-xs uppercase font-bold border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-amber-400 text-amber-300 bg-neutral-800/60 rounded-t'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'payouts' ? 'Symbol Payouts' : tab === 'features' ? 'Special Features' : '20 Payline Maps'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'payouts' && (
            <div>
              <p className="text-xs font-mono text-neutral-400 mb-4">
                Payouts dynamically calculated based on current <strong className="text-amber-400">${betPerLine.toFixed(2)}</strong> Bet Per Line. Wins pay left to right on adjacent reels along active paylines.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.values(SYMBOLS).map((sym) => (
                  <div
                    key={sym.id}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center text-center shadow"
                  >
                    <span className="text-3xl mb-1 drop-shadow" style={{ textShadow: `0 0 10px ${sym.glowColor}` }}>
                      {sym.icon}
                    </span>
                    <strong className="text-xs font-mono uppercase mb-2" style={{ color: sym.color }}>
                      {sym.name}
                    </strong>
                    <div className="w-full text-[11px] font-mono text-neutral-300 space-y-0.5 border-t border-neutral-800 pt-1.5">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">5x</span>
                        <span className="font-bold text-amber-400">${(sym.payouts[5] * betPerLine).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">4x</span>
                        <span className="font-bold text-neutral-200">${(sym.payouts[4] * betPerLine).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">3x</span>
                        <span className="font-bold text-neutral-400">${(sym.payouts[3] * betPerLine).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              {/* Wild Feature */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-600/40 flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl text-3xl">⚡</div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Zap size={16} />
                    VAULT WILD (2X MULTIPLIER)
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    The Vault Wild substitutes for all symbols except the Bonus Scatter. Any winning payline containing one or more Vault Wilds is awarded an automatic <strong>2x multiplier</strong>!
                  </p>
                </div>
              </div>

              {/* Scatter & Free Spins Feature */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-neutral-900 border border-cyan-600/40 flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl text-3xl">💠</div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    VAULT HEIST FREE SPINS (SCATTER)
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Landing 3 or more Scatter symbols anywhere on the reels triggers the lucrative <strong>Vault Heist Free Spins</strong> feature with locked 3x global multiplier:
                  </p>
                  <ul className="text-xs text-cyan-200/90 font-mono mt-2 space-y-1 list-disc list-inside">
                    <li>3 Scatters = 10 Free Spins + 2x Total Bet Cash Prize</li>
                    <li>4 Scatters = 15 Free Spins + 10x Total Bet Cash Prize</li>
                    <li>5 Scatters = 25 Free Spins + 50x Total Bet Mega Cash Prize</li>
                  </ul>
                </div>
              </div>

              {/* Gamble Feature */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-600/40 flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl text-3xl">🃏</div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-purple-400 uppercase">
                    DOUBLE OR NOTHING GAMBLE MINIGAME
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    After any winning spin, test your luck in the card gamble room! Guess the card color (Red or Black) for a <strong>2x Double</strong>, or predict the exact card suit (Hearts, Diamonds, Clubs, Spades) for a huge <strong>4x Quadruple</strong> win!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paylines' && (
            <div>
              <p className="text-xs font-mono text-neutral-400 mb-4">
                Hover or click on any payline button below to preview its exact path across the 3x5 reel matrix:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {PAYLINES.map((pl) => (
                  <button
                    key={pl.id}
                    onMouseEnter={() => onSelectPreviewLine(pl.id)}
                    onMouseLeave={() => onSelectPreviewLine(null)}
                    onClick={() => {
                      soundFx.playButtonClick();
                      onSelectPreviewLine(pl.id);
                    }}
                    className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 flex flex-col items-center gap-1.5 transition-all text-center"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pl.color }} />
                      <span className="font-mono text-xs font-bold text-neutral-200">Line {pl.id}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 truncate max-w-full">
                      {pl.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black/40 flex justify-end">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
