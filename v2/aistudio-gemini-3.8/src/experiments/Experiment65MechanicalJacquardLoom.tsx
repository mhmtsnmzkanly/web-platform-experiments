import React, { useState } from 'react';
import { Layers, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment65MechanicalJacquardLoom() {
  const [threadDensity, setThreadDensity] = useState(18); // picks per inch
  const [weaveTheme, setWeaveTheme] = useState<'silkDamask' | 'indigoTwill' | 'linen'>('silkDamask');

  const themes = {
    silkDamask: { warp: '#ca8a04', weft: '#fef08a', bg: '#422006' },
    indigoTwill: { warp: '#1d4ed8', weft: '#93c5fd', bg: '#0f172a' },
    linen: { warp: '#78716c', weft: '#f5f5f4', bg: '#1c1917' },
  }[weaveTheme];

  const cols = 26;
  const rows = 12;

  // Weave matrix for "HELLO WORLD"
  const weaveMatrix: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const offCtx = off.getContext('2d')!;
  offCtx.font = 'bold 9px monospace';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = '#ffffff';
  offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);
  const data = offCtx.getImageData(0, 0, cols, rows).data;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (data[(r * cols + c) * 4 + 3] > 140) {
        weaveMatrix[r][c] = true;
      }
    }
  }

  return (
    <div className="relative w-full min-h-[620px] bg-[#120f0c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 065</span> // 1804 JACQUARD PUNCHED CARD AUTOMATED LOOM
        </div>
        <div className="flex items-center gap-4">
          <span>WEAVE: BINARY WARP/WEFT FLOAT</span>
          <span>CODE: BINARY PUNCH CARD</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex flex-col items-center justify-center p-4">
        {/* Jacquard Woven Textile Bed */}
        <div
          className="p-6 rounded-2xl shadow-2xl border-4 border-stone-800 flex flex-col gap-1"
          style={{ backgroundColor: themes.bg }}
        >
          {weaveMatrix.map((row, r) => (
            <div key={r} className="flex items-center gap-1">
              {row.map((raised, c) => (
                <div
                  key={c}
                  className="w-5 h-5 md:w-7 md:h-7 rounded-sm shadow-sm transition-transform duration-200"
                  style={{
                    backgroundColor: raised ? themes.weft : themes.warp,
                    borderBottom: raised ? '2px solid rgba(0,0,0,0.4)' : 'none',
                    transform: raised ? 'scale(1.05)' : 'scale(0.95)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-stone-500">
          WARP AND WEFT SILK THREADS INTERLACE IN BINARY FORM ACCORDING TO PUNCHED CARDS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-400">Punched Card Deck:</span>
          {(['silkDamask', 'indigoTwill', 'linen'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setWeaveTheme(t)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                weaveTheme === t ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
              }`}
            >
              {t === 'silkDamask' ? 'Silk Damask' : t === 'indigoTwill' ? 'Indigo Twill' : 'Raw Linen'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Precursor to Binary Computing</span>
        </div>
      </div>
    </div>
  );
}
