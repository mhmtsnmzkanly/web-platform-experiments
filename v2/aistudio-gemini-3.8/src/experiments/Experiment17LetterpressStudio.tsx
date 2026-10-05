import React, { useState } from 'react';
import { Layers, Sliders, CheckSquare, Sparkles, RotateCcw } from 'lucide-react';

export default function Experiment17LetterpressStudio() {
  const [inkColor, setInkColor] = useState<'charcoal' | 'vermilion' | 'prussian'>('charcoal');
  const [impressionDepth, setImpressionDepth] = useState(4); // px deboss
  const [inkCoverage, setInkCoverage] = useState(90); // %
  const [isPressClosed, setIsPressClosed] = useState(false);

  const colors = {
    charcoal: { ink: '#1c1917', name: 'CARBON BLACK' },
    vermilion: { ink: '#dc2626', name: 'VERMILION RED' },
    prussian: { ink: '#1e3a8a', name: 'PRUSSIAN BLUE' },
  }[inkColor];

  return (
    <div className="relative w-full min-h-[620px] bg-[#F7F4EE] text-[#1c1917] rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-300 font-serif select-none">
      {/* Registration Marks in Corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-stone-400 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-stone-400 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-stone-400 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-stone-400 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-300 pb-3 text-xs font-mono text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">STUDY 017</span> // MOVABLE WOOD TYPE LETTERPRESS
        </div>
        <div className="flex items-center gap-4">
          <span>CHASE SIZE: 420x297 MM</span>
          <span>INK: {colors.name}</span>
        </div>
      </div>

      {/* Proofing Press Bed Stage */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center">
        {/* Paper Sheet with Deep Deboss & Ink Impression */}
        <div
          className={`relative p-8 md:p-14 bg-[#FFFDF9] rounded shadow-xl border border-stone-300 transition-all duration-500 max-w-4xl ${
            isPressClosed ? 'scale-95 shadow-inner' : 'scale-100'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(#1c1917 0.4px, transparent 0.4px), radial-gradient(#1c1917 0.4px, #FFFDF9 0.4px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        >
          {/* Deckle Edge simulated border */}
          <div className="absolute inset-2 border border-dashed border-stone-300 pointer-events-none" />

          {/* Letterpress Relief Specimen */}
          <div
            className="text-5xl md:text-8xl font-black tracking-widest text-center transition-all duration-300"
            style={{
              fontFamily: 'var(--font-serif)',
              color: colors.ink,
              opacity: inkCoverage / 100,
              textShadow: `inset 1px 1px 2px rgba(0,0,0,0.6), ${impressionDepth}px ${impressionDepth}px 2px rgba(255,255,255,0.9), -1px -1px 2px rgba(0,0,0,0.4)`,
              filter: `contrast(${100 + (100 - inkCoverage) * 0.5}%)`,
            }}
          >
            HELLO WORLD
          </div>

          <div className="mt-6 flex justify-between text-[10px] font-mono text-stone-500 tracking-wider">
            <span>EDITION: 1/50 HAND PULLED</span>
            <span>PRESS: VANDERCOOK PROOFING NO. 4</span>
            <span>COTTON RAG: 300 GSM</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-white/90 border border-stone-300 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-600">Impression Depth:</span>
            <input
              type="range"
              min="1"
              max="8"
              value={impressionDepth}
              onChange={(e) => setImpressionDepth(Number(e.target.value))}
              className="w-24 accent-stone-900"
            />
            <span>{impressionDepth}mm</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-600">Ink Density:</span>
            <input
              type="range"
              min="40"
              max="100"
              value={inkCoverage}
              onChange={(e) => setInkCoverage(Number(e.target.value))}
              className="w-24 accent-stone-900"
            />
            <span>{inkCoverage}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {(['charcoal', 'vermilion', 'prussian'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setInkColor(col)}
                className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                  inkColor === col
                    ? 'bg-stone-900 text-stone-100 font-bold border-stone-900'
                    : 'bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsPressClosed(true);
              setTimeout(() => setIsPressClosed(false), 400);
            }}
            className="px-4 py-1.5 rounded bg-stone-900 text-stone-100 font-bold hover:bg-stone-800 transition-colors"
          >
            Pull Proof Lever
          </button>
        </div>
      </div>
    </div>
  );
}
