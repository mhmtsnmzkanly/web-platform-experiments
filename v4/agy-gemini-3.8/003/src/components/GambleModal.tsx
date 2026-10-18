import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, ArrowRight, X } from 'lucide-react';
import { GambleCard } from '../types';
import { soundFx } from '../audio/SlotAudioEngine';

interface GambleModalProps {
  isOpen: boolean;
  initialWin: number;
  onCollect: (finalWin: number) => void;
  onExit: () => void;
}

const SUITS: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const GambleModal: React.FC<GambleModalProps> = ({
  isOpen,
  initialWin,
  onCollect,
  onExit,
}) => {
  const [stake, setStake] = useState<number>(initialWin);
  const [history, setHistory] = useState<GambleCard[]>([]);
  const [currentCard, setCurrentCard] = useState<GambleCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [roundResult, setRoundResult] = useState<'WIN' | 'LOSS' | null>(null);

  // Synchronize local stake when modal opens with new initialWin
  useEffect(() => {
    if (isOpen) {
      setStake(initialWin);
      setCurrentCard(null);
      setRoundResult(null);
      setIsFlipping(false);
    }
  }, [isOpen, initialWin]);

  if (!isOpen) return null;

  const drawCard = (): GambleCard => {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
    const value = VALUES[Math.floor(Math.random() * VALUES.length)];
    return { suit, color, value };
  };

  const handleGuessColor = (guessedColor: 'red' | 'black') => {
    if (isFlipping || stake <= 0) return;
    setIsFlipping(true);
    setRoundResult(null);
    soundFx.playCardFlip();

    setTimeout(() => {
      const card = drawCard();
      setCurrentCard(card);
      setHistory((prev) => [card, ...prev.slice(0, 4)]);
      setIsFlipping(false);

      if (card.color === guessedColor) {
        const newStake = stake * 2;
        setStake(newStake);
        setRoundResult('WIN');
        soundFx.playGambleWin();
      } else {
        setStake(0);
        setRoundResult('LOSS');
        soundFx.playGambleLoss();
        setTimeout(() => {
          onCollect(0);
          onExit();
        }, 1400);
      }
    }, 600);
  };

  const handleGuessSuit = (guessedSuit: 'hearts' | 'diamonds' | 'clubs' | 'spades') => {
    if (isFlipping || stake <= 0) return;
    setIsFlipping(true);
    setRoundResult(null);
    soundFx.playCardFlip();

    setTimeout(() => {
      const card = drawCard();
      setCurrentCard(card);
      setHistory((prev) => [card, ...prev.slice(0, 4)]);
      setIsFlipping(false);

      if (card.suit === guessedSuit) {
        const newStake = stake * 4;
        setStake(newStake);
        setRoundResult('WIN');
        soundFx.playGambleWin();
      } else {
        setStake(0);
        setRoundResult('LOSS');
        soundFx.playGambleLoss();
        setTimeout(() => {
          onCollect(0);
          onExit();
        }, 1400);
      }
    }, 600);
  };

  const handleCollect = () => {
    soundFx.playButtonClick();
    onCollect(stake);
    onExit();
  };

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
      case 'spades':
        return '♠';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isFlipping) {
          handleCollect();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#201026] via-[#120a16] to-[#0a050d] border-2 border-pink-600/70 rounded-2xl shadow-[0_0_50px_rgba(219,39,119,0.5)] p-6 text-neutral-100 flex flex-col items-center">
        {/* Top Header with Close Button */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-400 animate-pulse" size={24} />
            <h2 className="text-xl font-mono font-black text-pink-300 tracking-wider uppercase">
              DOUBLE OR NOTHING GAMBLE
            </h2>
          </div>
          <button
            onClick={handleCollect}
            disabled={isFlipping}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors border border-neutral-700"
            title="Collect and Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs font-mono text-neutral-400 mb-4 text-center">
          Guess Red / Black for <strong>2X</strong>, or pick exact Suit for <strong>4X</strong>!
        </p>

        {/* Current Stake Banner */}
        <div className="w-full bg-black/70 border border-pink-500/50 rounded-xl p-3 flex justify-around items-center mb-6">
          <div className="text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              CURRENT STAKE
            </span>
            <span className="text-2xl font-mono font-bold text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
              ${stake.toFixed(2)}
            </span>
          </div>
          <ArrowRight className="text-neutral-500" size={20} />
          <div className="text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              POTENTIAL 2X / 4X
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400">
              ${(stake * 2).toFixed(2)} / ${(stake * 4).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card Arena */}
        <div className="relative w-36 h-52 perspective mb-6">
          <div
            className={`w-full h-full rounded-xl border-4 transition-all duration-500 flex flex-col items-center justify-center shadow-2xl relative select-none ${
              isFlipping
                ? 'rotate-y-180 scale-95 bg-neutral-900 border-neutral-700'
                : currentCard
                ? 'bg-white border-neutral-300 text-neutral-900'
                : 'bg-gradient-to-br from-red-900 via-pink-900 to-indigo-950 border-pink-500 text-pink-200'
            }`}
          >
            {isFlipping ? (
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
                FLIPPING...
              </span>
            ) : currentCard ? (
              <div
                className={`flex flex-col items-center justify-between w-full h-full p-3 font-mono font-bold ${
                  currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'
                }`}
              >
                <div className="self-start text-xl leading-none">
                  {currentCard.value}
                  <span className="block text-sm">{getSuitIcon(currentCard.suit)}</span>
                </div>
                <div className="text-6xl my-auto">{getSuitIcon(currentCard.suit)}</div>
                <div className="self-end text-xl leading-none rotate-180">
                  {currentCard.value}
                  <span className="block text-sm">{getSuitIcon(currentCard.suit)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-2">
                <span className="text-4xl mb-1">🃏</span>
                <span className="text-xs font-mono font-bold tracking-widest text-pink-300">AERO DECK</span>
              </div>
            )}
          </div>

          {/* Outcome Badge */}
          {roundResult && !isFlipping && (
            <div
              className={`absolute -bottom-4 inset-x-0 mx-auto w-max px-3 py-1 rounded-full font-mono font-bold text-xs uppercase shadow-xl animate-bounce ${
                roundResult === 'WIN' ? 'bg-emerald-500 text-black' : 'bg-red-600 text-white'
              }`}
            >
              {roundResult === 'WIN' ? 'CORRECT! WIN!' : 'INCORRECT!'}
            </div>
          )}
        </div>

        {/* Previous Cards History */}
        {history.length > 0 && (
          <div className="flex items-center gap-1.5 mb-6">
            <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1">History:</span>
            {history.map((c, i) => (
              <span
                key={i}
                className={`text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-bold ${
                  c.color === 'red' ? 'text-red-400' : 'text-neutral-200'
                }`}
              >
                {c.value}
                {getSuitIcon(c.suit)}
              </span>
            ))}
          </div>
        )}

        {/* Prediction Buttons */}
        <div className="w-full space-y-3">
          {/* Red / Black (2x) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGuessColor('red')}
              disabled={isFlipping || stake <= 0}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-40 text-white font-mono font-bold text-sm uppercase shadow-lg border border-red-400 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>RED (2X)</span>
              <span>♥♦</span>
            </button>
            <button
              onClick={() => handleGuessColor('black')}
              disabled={isFlipping || stake <= 0}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 disabled:opacity-40 text-white font-mono font-bold text-sm uppercase shadow-lg border border-neutral-600 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>BLACK (2X)</span>
              <span>♠♣</span>
            </button>
          </div>

          {/* Suits (4x) */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { suit: 'hearts', label: '♥', color: 'text-red-500 hover:bg-red-950/40' },
              { suit: 'diamonds', label: '♦', color: 'text-red-500 hover:bg-red-950/40' },
              { suit: 'clubs', label: '♣', color: 'text-neutral-200 hover:bg-neutral-800' },
              { suit: 'spades', label: '♠', color: 'text-neutral-200 hover:bg-neutral-800' },
            ].map(({ suit, label, color }) => (
              <button
                key={suit}
                onClick={() => handleGuessSuit(suit as 'hearts' | 'diamonds' | 'clubs' | 'spades')}
                disabled={isFlipping || stake <= 0}
                className={`py-2 px-1 rounded-lg bg-neutral-900 border border-neutral-800 disabled:opacity-40 font-mono font-bold text-lg transition-all active:scale-95 flex flex-col items-center shadow cursor-pointer disabled:cursor-not-allowed ${color}`}
              >
                <span>{label}</span>
                <span className="text-[10px] font-sans text-neutral-400 font-semibold uppercase">4X</span>
              </button>
            ))}
          </div>
        </div>

        {/* Collect / Exit Button */}
        <div className="w-full mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
          <span className="text-xs font-mono text-neutral-400">Bank & return anytime</span>
          <button
            onClick={handleCollect}
            disabled={isFlipping}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 text-black font-mono font-black text-xs uppercase shadow-xl transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <DollarSign size={16} />
            <span>COLLECT ${stake.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
