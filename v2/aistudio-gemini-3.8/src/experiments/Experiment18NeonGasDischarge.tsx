import React, { useState, useEffect } from 'react';
import { Zap, Power, Sliders, Volume2, VolumeX } from 'lucide-react';

export default function Experiment18NeonGasDischarge() {
  const [gasType, setGasType] = useState<'neon' | 'argon' | 'helium' | 'xenon'>('neon');
  const [isPowered, setIsPowered] = useState(true);
  const [flickerRate, setFlickerRate] = useState(0.1);
  const [isFlickering, setIsFlickering] = useState(false);

  const gases = {
    neon: { name: 'NEON (Ne)', color: '#ff3300', glow: 'rgba(255, 51, 0, 0.9)', bgGlow: 'rgba(255, 51, 0, 0.15)' },
    argon: { name: 'ARGON (Ar)', color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.9)', bgGlow: 'rgba(0, 229, 255, 0.15)' },
    helium: { name: 'HELIUM (He)', color: '#ffb700', glow: 'rgba(255, 183, 0, 0.9)', bgGlow: 'rgba(255, 183, 0, 0.15)' },
    xenon: { name: 'XENON (Xe)', color: '#b347ff', glow: 'rgba(179, 71, 255, 0.9)', bgGlow: 'rgba(179, 71, 255, 0.15)' },
  }[gasType];

  useEffect(() => {
    if (!isPowered) return;
    const interval = setInterval(() => {
      if (Math.random() < flickerRate) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 80 + Math.random() * 120);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isPowered, flickerRate]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#07070a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Dark SoHo Brick Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #202028 1px, transparent 1px), linear-gradient(to bottom, #202028 1px, transparent 1px)',
          backgroundSize: '40px 20px',
        }}
      />

      {/* Ambient Gas Radiance Bloom */}
      {isPowered && !isFlickering && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${gases.bgGlow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: gases.color }} />
          <span className="font-bold text-stone-200">STUDY 018</span> // HIGH-VOLTAGE NEON GAS DISCHARGE
        </div>
        <div className="flex items-center gap-4">
          <span>GAS: {gases.name}</span>
          <span>TRANSFORMER: 12,000V AC</span>
        </div>
      </div>

      {/* Neon Sign Stage */}
      <div className="relative z-10 my-auto py-16 flex flex-col items-center justify-center">
        {/* Support wire and glass standoffs */}
        <div className="absolute top-1/3 inset-x-20 h-1 bg-stone-800/80 rounded" />

        {/* The Neon Glass Tube "HELLO WORLD" */}
        <div
          className={`relative text-5xl md:text-8xl font-black tracking-widest text-center transition-all duration-100 uppercase ${
            !isPowered || isFlickering ? 'opacity-20' : 'opacity-100'
          }`}
          style={{
            fontFamily: 'var(--font-display)',
            color: isPowered && !isFlickering ? '#ffffff' : '#33333e',
            textShadow:
              isPowered && !isFlickering
                ? `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${gases.color}, 0 0 40px ${gases.color}, 0 0 80px ${gases.color}`
                : 'none',
          }}
        >
          HELLO WORLD
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-stone-500">
          <span>COLD CATHODE LUMINESCENCE</span>
          <span>·</span>
          <span>BOROSILICATE GLASS TUBE 15MM</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPowered(!isPowered)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
              isPowered ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-stone-800 text-stone-400'
            }`}
          >
            <Power size={13} />
            <span>{isPowered ? 'TRANSFORMER ON' : 'POWER OFF'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Instability Flicker:</span>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={flickerRate}
              onChange={(e) => setFlickerRate(Number(e.target.value))}
              className="w-24 accent-rose-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['neon', 'argon', 'helium', 'xenon'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGasType(g)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                gasType === g ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
