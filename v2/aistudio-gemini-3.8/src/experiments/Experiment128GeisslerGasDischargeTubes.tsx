import React, { useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment128GeisslerGasDischargeTubes() {
  const [gasElement, setGasElement] = useState<'neon' | 'argon' | 'helium' | 'krypton'>('neon');
  const [inductionVoltageKv, setInductionVoltageKv] = useState(6.0); // kV Ruhmkorff coil
  const [uraniumGlassFluorescence, setUraniumGlassFluorescence] = useState(true);

  const letters = 'HELLO WORLD'.split('');

  const gasColors = {
    neon: { glow: '#f97316', shadow: '#ea580c', text: '#ffedd5' },
    argon: { glow: '#818cf8', shadow: '#6366f1', text: '#e0e7ff' },
    helium: { glow: '#f43f5e', shadow: '#e11d48', text: '#ffe4e6' },
    krypton: { glow: '#38bdf8', shadow: '#0284c7', text: '#e0f2fe' },
  };

  const activeGas = gasColors[gasElement];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 128: 1857 HEINRICH GEISSLER VACUUM DISCHARGE TUBES
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Artisanal Blown Uranium Glass, Ruhmkorff High-Voltage Induction & Rare Gas Glow
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGasElement('neon');
              setInductionVoltageKv(6.0);
              setUraniumGlassFluorescence(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Coil</span>
          </button>
        </div>

        {/* Vintage Darkroom Cabinet */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-[#090b10] p-10 flex flex-col items-center justify-center min-h-[380px]">
          {/* Hand-blown glass tube capillaries */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 p-8 rounded-2xl bg-black/60 border border-stone-800 shadow-2xl">
            {letters.map((char, idx) => {
              if (char === ' ') return <div key={idx} className="w-6 hidden sm:block" />;

              return (
                <div
                  key={idx}
                  className="relative w-14 h-36 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: uraniumGlassFluorescence ? '#84cc16' : '#94a3b8',
                    boxShadow: `0 0 ${inductionVoltageKv * 3}px ${activeGas.shadow}`,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  }}
                >
                  {/* Capillary plasma glow */}
                  <span
                    className="font-serif italic font-bold text-4xl select-none"
                    style={{
                      color: activeGas.text,
                      textShadow: `0 0 12px ${activeGas.glow}, 0 0 25px ${activeGas.shadow}`,
                    }}
                  >
                    {char}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Noble Gas Filling:</span>
              <span className="text-amber-400 font-bold uppercase">{gasElement}</span>
            </div>
            <div className="flex gap-2">
              {(['neon', 'argon', 'helium', 'krypton'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGasElement(g)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    gasElement === g
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Ruhmkorff Potential:
              </span>
              <span className="text-amber-400 font-bold">{inductionVoltageKv.toFixed(1)} kV</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.5"
              value={inductionVoltageKv}
              onChange={(e) => setInductionVoltageKv(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Uranium Glass Glow:</span>
            <button
              onClick={() => setUraniumGlassFluorescence(!uraniumGlassFluorescence)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                uraniumGlassFluorescence
                  ? 'bg-lime-500/10 border-lime-400 text-lime-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {uraniumGlassFluorescence ? 'CANARY GLASS FLUORESCING' : 'CLEAR BOROSILICATE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
