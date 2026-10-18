import React, { useEffect, useState } from 'react';
import { CabinetLightPattern } from '../types';

interface SlotMachineCabinetProps {
  lightPattern: CabinetLightPattern;
  children: React.ReactNode;
  leverComponent: React.ReactNode;
}

const BULB_COUNT = 36;

export const SlotMachineCabinet: React.FC<SlotMachineCabinetProps> = ({
  lightPattern,
  children,
  leverComponent,
}) => {
  const [chaseOffset, setChaseOffset] = useState(0);

  // Drive LED bulb chase sequence
  useEffect(() => {
    let speed = 120; // ms per step
    if (lightPattern === 'SPINNING') speed = 50;
    else if (lightPattern === 'ANTICIPATION') speed = 35;
    else if (lightPattern === 'BIG_WIN' || lightPattern === 'JACKPOT') speed = 40;

    const interval = setInterval(() => {
      setChaseOffset((prev) => (prev + 1) % BULB_COUNT);
    }, speed);

    return () => clearInterval(interval);
  }, [lightPattern]);

  const getBulbColor = (index: number) => {
    const isLit = (index + chaseOffset) % 4 === 0;
    const isAltLit = (index + chaseOffset) % 4 === 2;

    if (lightPattern === 'JACKPOT') {
      return (index + chaseOffset) % 2 === 0
        ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]'
        : 'bg-red-500 shadow-[0_0_12px_#ef4444]';
    }
    if (lightPattern === 'BIG_WIN') {
      return (index + chaseOffset) % 3 === 0
        ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
        : 'bg-amber-400 shadow-[0_0_12px_#f59e0b]';
    }
    if (lightPattern === 'ANTICIPATION') {
      return (index + chaseOffset) % 2 === 0
        ? 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
        : 'bg-indigo-500 shadow-[0_0_8px_#6366f1]';
    }
    if (lightPattern === 'SPINNING') {
      return isLit
        ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
        : isAltLit
        ? 'bg-red-400 shadow-[0_0_8px_#f87171]'
        : 'bg-neutral-800';
    }
    // Idle pattern
    return isLit
      ? 'bg-amber-300 shadow-[0_0_8px_#fcd34d]'
      : isAltLit
      ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
      : 'bg-neutral-900';
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-4 md:p-6 bg-gradient-to-b from-[#262f40] via-[#161a24] to-[#0f121a] border-4 border-[#414f6b] shadow-[0_0_60px_rgba(0,0,0,0.95)]">
      {/* Chrome Perimeter Edge Inset */}
      <div className="absolute inset-1.5 rounded-[22px] border-2 border-white/10 pointer-events-none" />

      {/* LED Perimeter Chase Lights Ring (Top Bar) */}
      <div className="flex justify-between items-center px-4 mb-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-75 ${getBulbColor(i)}`}
          />
        ))}
      </div>

      {/* Top Retro Marquee Sign */}
      <div className="relative mb-4 py-3 px-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-[#526385] shadow-2xl flex items-center justify-between overflow-hidden">
        {/* Subtle background rays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="text-3xl animate-pulse">💎</div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
              ★ NEVADA-GRADE MECHANICAL SIMULATOR ★
            </div>
            <h1 className="text-2xl md:text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
              AERO-VAULT 777
            </h1>
          </div>
        </div>

        {/* Marquee Center Badge */}
        <div className="hidden sm:flex flex-col items-center border border-amber-500/40 rounded-xl px-4 py-1 bg-amber-950/20 shadow-inner">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">
            PROGRESSIVE JACKPOT
          </span>
          <span className="text-lg font-mono font-black text-amber-300 animate-pulse">
            5,000X TOP MULTIPLIER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
            20 PAYLINES
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-neutral-800 text-emerald-400 border border-neutral-700">
            96.5% RTP
          </span>
        </div>
      </div>

      {/* Main Play Area: Reel Matrix on Left + Mechanical Lever on Right */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
        <div className="flex-1 w-full">{children}</div>

        {/* Right Mounted Lever (Desktop & Tablet) */}
        <div className="hidden md:flex items-center justify-center pl-2">
          {leverComponent}
        </div>
      </div>

      {/* LED Perimeter Chase Lights Ring (Bottom Bar) */}
      <div className="flex justify-between items-center px-4 mt-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-75 ${getBulbColor(i + 12)}`}
          />
        ))}
      </div>
    </div>
  );
};
