import React, { useState } from 'react';
import { Zap, Sliders, RotateCcw, Power } from 'lucide-react';

export default function Experiment81NixieTubeGasDischarge() {
  const [anodeVoltage, setAnodeVoltage] = useState(170); // V DC
  const [powerOn, setPowerOn] = useState(true);
  const [poisonCureMode, setPoisonCureMode] = useState(false);

  const letters = 'HELLO WORLD'.split('');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 081: 1968 IN-14 COLD-CATHODE NIXIE DISCHARGE TUBES
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Penning Gas Mixture (Ne-Ar 99.5:0.5) & Stacked Wire Filament Glow
              </p>
            </div>
          </div>
          <button
            onClick={() => setPowerOn(!powerOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              powerOn
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <Power size={13} />
            <span>{powerOn ? 'HT POWER ON' : 'HT DISCONNECTED'}</span>
          </button>
        </div>

        {/* Nixie Tube Bench Display */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-[#0d0907] p-8 flex items-center justify-center min-h-[380px]">
          {/* Chassis Backing Wood and Bakelite */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {letters.map((char, idx) => {
              if (char === ' ') {
                return <div key={idx} className="w-6 h-48 hidden sm:block" />;
              }

              const isGlowing = powerOn && anodeVoltage >= 140;
              const glowIntensity = isGlowing ? (anodeVoltage - 130) / 70 : 0;

              return (
                <div
                  key={idx}
                  className="relative w-16 md:w-20 h-52 bg-gradient-to-b from-stone-800/40 via-stone-900/60 to-black rounded-t-full border border-stone-700/60 shadow-inner flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    boxShadow: isGlowing
                      ? `0 0 ${glowIntensity * 25}px rgba(249, 115, 22, ${glowIntensity * 0.4})`
                      : 'none',
                  }}
                >
                  {/* Glass Tube Specular Reflection */}
                  <div className="absolute top-2 left-3 w-1.5 h-36 bg-white/20 rounded-full blur-[0.5px]" />
                  <div className="absolute top-3 right-3 w-0.5 h-32 bg-white/10 rounded-full" />

                  {/* Wire Anode Mesh Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:6px_6px] opacity-30 pointer-events-none" />

                  {/* Active Cathode Filament Letter */}
                  <span
                    className={`font-mono font-bold text-4xl md:text-5xl transition-all duration-150 select-none ${
                      isGlowing
                        ? poisonCureMode
                          ? 'text-cyan-200'
                          : 'text-amber-200'
                        : 'text-stone-700'
                    }`}
                    style={{
                      textShadow: isGlowing
                        ? poisonCureMode
                          ? `0 0 10px #38bdf8, 0 0 25px #0284c7, 0 0 40px #0369a1`
                          : `0 0 8px #ffedd5, 0 0 18px #f97316, 0 0 35px #ea580c, 0 0 55px #c2410c`
                        : 'none',
                    }}
                  >
                    {char}
                  </span>

                  {/* Anode base ceramic cup */}
                  <div className="absolute bottom-0 w-full h-6 bg-stone-800 border-t border-stone-600 flex justify-center items-center">
                    <span className="text-[9px] font-mono text-stone-500">IN-14 #{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> DC Anode Potential:
              </span>
              <span className="text-amber-400 font-bold">{anodeVoltage} V DC</span>
            </div>
            <input
              type="range"
              min="100"
              max="210"
              value={anodeVoltage}
              onChange={(e) => setAnodeVoltage(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Cathode Poisoning Burn-in:</span>
            <button
              onClick={() => setPoisonCureMode(!poisonCureMode)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                poisonCureMode
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {poisonCureMode ? 'BLUE MERCURY ION CURE ACTIVE' : 'STANDARD NEON GLOW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
