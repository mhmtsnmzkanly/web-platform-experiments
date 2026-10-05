import React, { useState } from 'react';
import { RefreshCw, Sliders, Layers, Sparkles } from 'lucide-react';

export default function Experiment31ElectrophoreticEInk() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ghosting, setGhosting] = useState(true);
  const [fontScale, setFontScale] = useState(72);
  const [ditherMode, setDitherMode] = useState<'1bit' | 'greyscale'>('1bit');

  const triggerEInkRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#E8E6E1] text-[#111111] rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-300 font-mono select-none">
      {/* Matte E-Paper Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#111 0.5px, transparent 0.5px)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-400 pb-3 text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <span className="font-bold">STUDY 031</span> // ELECTROPHORETIC E-INK MICROCAPSULE
        </div>
        <div className="flex items-center gap-4">
          <span>PANEL: E-INK CARTA 1200 (300 PPI)</span>
          <span>WAVEFORM: REGAL CLEAR FLASH</span>
        </div>
      </div>

      {/* E-Ink Refresh Flashing State Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-pulse bg-white">
          <div className="w-full h-full bg-black/80 animate-ping" />
        </div>
      )}

      {/* E-Ink Specimen Canvas Stage */}
      <div className="relative z-10 my-auto py-16 flex flex-col items-center justify-center">
        {/* Subtle ghosting silhouette of previous page */}
        {ghosting && (
          <div
            className="absolute text-5xl md:text-8xl font-black tracking-widest text-stone-400/20 select-none uppercase blur-[0.6px]"
            style={{
              fontFamily: 'var(--font-serif)',
              transform: 'translate(4px, 3px)',
            }}
          >
            HELLO WORLD
          </div>
        )}

        {/* Primary Crisp 1-Bit Microcapsule Pigment Letterforms */}
        <div
          className="text-5xl md:text-8xl font-black tracking-widest text-center select-none uppercase transition-all duration-75 text-[#0d0d0d]"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: `${fontScale}px`,
            letterSpacing: '0.08em',
            filter: ditherMode === '1bit' ? 'contrast(250%)' : 'none',
          }}
        >
          HELLO WORLD
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-stone-600">
          <span>TITANIUM DIOXIDE (WHITE +)</span>
          <span>·</span>
          <span>CARBON BLACK (BLACK -)</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-white/80 border border-stone-300 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <button
            onClick={triggerEInkRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 text-stone-100 font-bold hover:bg-stone-800 transition-colors"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Full Waveform Refresh</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-600">Font Scale:</span>
            <input
              type="range"
              min="48"
              max="96"
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-24 accent-stone-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGhosting(!ghosting)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              ghosting ? 'bg-stone-900 text-stone-100' : 'bg-transparent text-stone-700 border-stone-400'
            }`}
          >
            Ghosting Artifacts: {ghosting ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center gap-1">
            {(['1bit', 'greyscale'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setDitherMode(m)}
                className={`px-2 py-1 uppercase rounded text-[11px] ${
                  ditherMode === m ? 'bg-stone-900 text-white font-bold' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
