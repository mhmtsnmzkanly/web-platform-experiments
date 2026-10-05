import React, { useState } from 'react';
import { Sliders, Grid, Eye, Type, RotateCcw } from 'lucide-react';

export default function Experiment01SemanticGenesis() {
  const [fontSize, setFontSize] = useState(72);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(500);
  const [lineHeight, setLineHeight] = useState(1.1);
  const [showGrid, setShowGrid] = useState(true);
  const [showCalipers, setShowCalipers] = useState(true);
  const [typeface, setTypeface] = useState<'serif' | 'sans' | 'mono'>('sans');

  const handleReset = () => {
    setFontSize(72);
    setLetterSpacing(0);
    setFontWeight(500);
    setLineHeight(1.1);
    setTypeface('sans');
  };

  return (
    <div className="relative w-full min-h-[620px] flex flex-col justify-between p-8 bg-[#FBF9F5] text-[#1C1917] rounded-xl overflow-hidden shadow-2xl transition-colors">
      {/* Background Millimeter Grid */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Top Specimen Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-300 pb-4 text-xs font-mono tracking-wider text-stone-600">
        <div>
          <span className="font-bold text-stone-900">STUDY 001</span> // SEMANTIC GENESIS
        </div>
        <div className="flex items-center gap-4">
          <span>BASELINE: SWISS MODERNIST</span>
          <span>KERNING: {letterSpacing}em</span>
          <span>SIZE: {fontSize}px</span>
        </div>
      </div>

      {/* Primary Specimen Stage */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center text-center">
        {showCalipers && (
          <div className="w-full max-w-3xl flex justify-between text-[10px] font-mono text-stone-400 border-b border-dashed border-stone-400 mb-2 px-2">
            <span>[X: 00.00]</span>
            <span>CAP-HEIGHT RULER: {fontSize}px</span>
            <span>[X: 100.00]</span>
          </div>
        )}

        <div
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}em`,
            fontWeight: fontWeight,
            lineHeight: lineHeight,
            fontFamily:
              typeface === 'serif'
                ? 'var(--font-serif)'
                : typeface === 'mono'
                ? 'var(--font-mono)'
                : 'var(--font-sans)',
          }}
          className="transition-all duration-150 select-none text-stone-900"
        >
          Hello World
        </div>

        {showCalipers && (
          <div className="w-full max-w-3xl flex justify-between text-[10px] font-mono text-stone-400 border-t border-dashed border-stone-400 mt-2 px-2">
            <span>BASE: 0.000</span>
            <span>DESCENT: -{Math.round(fontSize * 0.22)}px</span>
            <span>LEAD: {lineHeight}</span>
          </div>
        )}
      </div>

      {/* Bottom Typographic Control Caliper Bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md border border-stone-300 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-stone-700">
          {/* Font Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between font-mono">
              <span className="flex items-center gap-1.5"><Type size={13} /> Size</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min="32"
              max="130"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="accent-stone-900 cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between font-mono">
              <span className="flex items-center gap-1.5"><Sliders size={13} /> Tracking</span>
              <span>{letterSpacing.toFixed(2)}em</span>
            </div>
            <input
              type="range"
              min="-0.08"
              max="0.35"
              step="0.01"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="accent-stone-900 cursor-pointer"
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between font-mono">
              <span>Weight</span>
              <span>{fontWeight}</span>
            </div>
            <input
              type="range"
              min="300"
              max="800"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              className="accent-stone-900 cursor-pointer"
            />
          </div>

          {/* Toggles & Typeface */}
          <div className="flex items-center justify-between gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-stone-200 md:pl-4">
            <div className="flex items-center gap-1">
              {(['sans', 'serif', 'mono'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTypeface(tf)}
                  className={`px-2 py-1 text-[11px] uppercase rounded transition-colors ${
                    typeface === tf
                      ? 'bg-stone-900 text-stone-100 font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid"
                className={`p-1.5 rounded transition-colors ${showGrid ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
              >
                <Grid size={13} />
              </button>
              <button
                onClick={() => setShowCalipers(!showCalipers)}
                title="Toggle Calipers"
                className={`p-1.5 rounded transition-colors ${showCalipers ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
              >
                <Eye size={13} />
              </button>
              <button
                onClick={handleReset}
                title="Reset Calipers"
                className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
