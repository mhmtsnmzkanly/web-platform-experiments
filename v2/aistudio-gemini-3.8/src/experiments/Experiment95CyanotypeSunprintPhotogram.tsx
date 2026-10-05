import React, { useState } from 'react';
import { Sun, Sliders, RotateCcw, Droplets } from 'lucide-react';

export default function Experiment95CyanotypeSunprintPhotogram() {
  const [exposureTime, setExposureTime] = useState(180); // seconds UV exposure
  const [washed, setWashed] = useState(false);
  const [paperTexture, setPaperTexture] = useState<'smooth' | 'rough' | 'linen'>('linen');

  const progress = Math.min(1.0, exposureTime / 300);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Sun className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 095: 1842 SIR JOHN HERSCHEL CYANOTYPE SUNPRINT
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Ferric Ammonium Citrate & Potassium Ferricyanide Prussian Blue Photogram
              </p>
            </div>
          </div>
          <button
            onClick={() => setWashed(!washed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              washed
                ? 'bg-blue-600 text-white font-bold border-blue-500'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            <Droplets size={13} />
            <span>{washed ? 'WASHED & OXIDIZED' : 'UNWASHED EMULSION'}</span>
          </button>
        </div>

        {/* Cyanotype Paper Sheet */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 p-8 flex items-center justify-center min-h-[380px] bg-stone-950">
          <div
            className="w-full max-w-2xl h-80 rounded-xl p-8 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-500"
            style={{
              backgroundColor: washed
                ? `rgb(10, ${Math.round(40 + (1 - progress) * 60)}, ${Math.round(110 + progress * 80)})` // Deep Prussian Blue
                : `rgb(${Math.round(120 - progress * 50)}, ${Math.round(150 - progress * 40)}, ${Math.round(60 + progress * 60)})`, // Olive bronze unwashed
            }}
          >
            {/* Cotton paper grain */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

            {/* Botanical silhouette shadow elements */}
            <div className="absolute inset-0 flex justify-between p-6 opacity-40 pointer-events-none">
              <span className="text-6xl select-none">🌿</span>
              <span className="text-6xl select-none">🌾</span>
              <span className="text-6xl select-none">🍃</span>
            </div>

            {/* Masked Unexposed Emulsion "HELLO WORLD" */}
            <h2
              className="font-serif italic font-bold text-5xl md:text-6xl text-center tracking-wide select-none transition-all"
              style={{
                color: washed ? '#ffffff' : '#fef9c3', // Pure white paper after wash
                textShadow: washed ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              HELLO WORLD
            </h2>

            <div className="mt-6 text-xs font-mono tracking-wider opacity-80" style={{ color: washed ? '#bae6fd' : '#fef08a' }}>
              EXPOSURE: {exposureTime}s / 300s UV-A · {washed ? 'FE4[FE(CN)6]3 PRUSSIAN BLUE' : 'SENSITIZED EMULSION'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> UV Solar Exposure Time:
              </span>
              <span className="text-amber-400 font-bold">{exposureTime} seconds</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={exposureTime}
              onChange={(e) => setExposureTime(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Paper Substrate Grade:</span>
              <span className="text-amber-400 font-bold uppercase">{paperTexture}</span>
            </div>
            <div className="flex gap-2">
              {(['smooth', 'rough', 'linen'] as const).map((tex) => (
                <button
                  key={tex}
                  onClick={() => setPaperTexture(tex)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    paperTexture === tex
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {tex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
