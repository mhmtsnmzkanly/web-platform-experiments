import React, { useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment90VitreousEnamelCloisonne() {
  const [wireMetal, setWireMetal] = useState<'gold' | 'silver' | 'copper'>('gold');
  const [enamelColor, setEnamelColor] = useState<'cobalt' | 'emerald' | 'ruby' | 'amethyst'>('cobalt');
  const [kilnFiring, setKilnFiring] = useState(false);

  const letters = 'HELLO WORLD'.split('');

  const wireColors = {
    gold: { stroke: '#fbbf24', highlight: '#fef08a' },
    silver: { stroke: '#cbd5e1', highlight: '#ffffff' },
    copper: { stroke: '#f97316', highlight: '#fed7aa' },
  };

  const enamelPalettes = {
    cobalt: { bg: 'from-blue-900 to-indigo-950', fill: '#1e3a8a', shadow: '#3b82f6' },
    emerald: { bg: 'from-emerald-900 to-teal-950', fill: '#064e3b', shadow: '#10b981' },
    ruby: { bg: 'from-rose-900 to-red-950', fill: '#881337', shadow: '#f43f5e' },
    amethyst: { bg: 'from-purple-900 to-violet-950', fill: '#581c87', shadow: '#a855f7' },
  };

  const triggerFiring = () => {
    setKilnFiring(true);
    setTimeout(() => setKilnFiring(false), 800);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 090: VITREOUS ENAMEL CLOISONNÉ FILIGREE
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Byzantine Metal Cell Wire Enclosures & Kiln Fired Crushed Glass Glaze
              </p>
            </div>
          </div>
          <button
            onClick={triggerFiring}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Flame size={13} />
            <span>KILN FIRE 850°C</span>
          </button>
        </div>

        {/* Cloisonne Plaque */}
        <div
          className={`relative rounded-xl overflow-hidden border-4 border-stone-700 bg-stone-950 p-10 flex items-center justify-center min-h-[380px] transition-all duration-700 ${
            kilnFiring ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 scale-[1.01]' : ''
          }`}
        >
          {/* Beveled hammered brass plate */}
          <div className="relative flex flex-wrap items-center justify-center gap-3 md:gap-4 p-8 rounded-2xl bg-stone-950/80 border border-stone-700/60 shadow-2xl">
            {letters.map((char, idx) => {
              if (char === ' ') {
                return <div key={idx} className="w-8 h-24 hidden sm:block" />;
              }

              return (
                <div
                  key={idx}
                  className={`relative w-16 h-28 sm:w-20 sm:h-36 rounded-xl flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                    enamelPalettes[enamelColor].bg
                  }`}
                  style={{
                    borderColor: wireColors[wireMetal].stroke,
                    boxShadow: kilnFiring
                      ? '0 0 25px #f59e0b'
                      : `inset 0 0 15px rgba(0,0,0,0.8), 0 0 10px ${enamelPalettes[enamelColor].shadow}40`,
                  }}
                >
                  {/* Filigree decorative wire curls */}
                  <div
                    className="absolute inset-1.5 rounded-lg border border-dashed opacity-60 pointer-events-none"
                    style={{ borderColor: wireColors[wireMetal].highlight }}
                  />

                  {/* Letter Glyph in wire cloison */}
                  <span
                    className="font-serif italic font-bold text-4xl sm:text-5xl select-none"
                    style={{
                      color: wireColors[wireMetal].highlight,
                      textShadow: `1px 1px 0px ${wireColors[wireMetal].stroke}, 0 0 12px ${enamelPalettes[enamelColor].shadow}`,
                    }}
                  >
                    {char}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Cloison Filigree Wire Metal:</span>
              <span className="text-amber-400 font-bold uppercase">{wireMetal} WIRE</span>
            </div>
            <div className="flex gap-2">
              {(['gold', 'silver', 'copper'] as const).map((metal) => (
                <button
                  key={metal}
                  onClick={() => setWireMetal(metal)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    wireMetal === metal
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Vitreous Enamel Glass Pigment:</span>
              <span className="text-amber-400 font-bold uppercase">{enamelColor}</span>
            </div>
            <div className="flex gap-2">
              {(['cobalt', 'emerald', 'ruby', 'amethyst'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setEnamelColor(color)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    enamelColor === color
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
