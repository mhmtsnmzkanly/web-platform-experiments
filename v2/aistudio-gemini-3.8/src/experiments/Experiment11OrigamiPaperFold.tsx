import React, { useState } from 'react';
import { Layers, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment11OrigamiPaperFold() {
  const [foldAngle, setFoldAngle] = useState(0); // 0 = flat unfolded, 80 = sharply folded
  const [paperTexture, setPaperTexture] = useState<'washi' | 'kraft' | 'obsidian'>('washi');
  const [isAccordion, setIsAccordion] = useState(false);

  const textures = {
    washi: {
      bg: '#FBF9F5',
      paper: '#FFFFFF',
      text: '#1C1917',
      shadow: 'rgba(0, 0, 0, 0.12)',
      crease: 'rgba(0, 0, 0, 0.08)',
    },
    kraft: {
      bg: '#E2D3B8',
      paper: '#D0BFA1',
      text: '#3E2F1C',
      shadow: 'rgba(50, 30, 10, 0.2)',
      crease: 'rgba(60, 40, 10, 0.15)',
    },
    obsidian: {
      bg: '#141416',
      paper: '#1F2024',
      text: '#E5E7EB',
      shadow: 'rgba(0, 0, 0, 0.5)',
      crease: 'rgba(255, 255, 255, 0.06)',
    },
  }[paperTexture];

  const letters = 'HELLO WORLD'.split('');

  return (
    <div
      className="relative w-full min-h-[620px] p-6 rounded-xl flex flex-col justify-between overflow-hidden shadow-2xl transition-colors font-sans select-none"
      style={{ backgroundColor: textures.bg, color: textures.text }}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b pb-3 text-xs font-mono opacity-80" style={{ borderColor: textures.crease }}>
        <div className="flex items-center gap-2">
          <Layers size={14} />
          <span className="font-bold">STUDY 011</span> // ORIGAMI 3D PAPER ACCORDION FOLD
        </div>
        <div className="flex items-center gap-4">
          <span>CREASE ANGLE: {foldAngle}°</span>
          <span>MATERIAL: {paperTexture.toUpperCase()}</span>
        </div>
      </div>

      {/* 3D Paper Stage */}
      <div
        className="relative z-10 my-auto py-16 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div className="flex items-center justify-center gap-1 transition-all duration-300">
          {letters.map((char, i) => {
            const isEven = i % 2 === 0;
            const currentAngle = isEven ? foldAngle : -foldAngle;
            const shadowIntensity = (foldAngle / 90) * 0.4;

            if (char === ' ') {
              return <div key={i} className="w-6 md:w-10" />;
            }

            return (
              <div
                key={i}
                className="relative flex items-center justify-center p-4 md:p-6 rounded-sm transition-transform duration-300"
                style={{
                  backgroundColor: textures.paper,
                  transform: `rotateY(${currentAngle}deg) translateZ(${Math.abs(currentAngle) * 0.4}px)`,
                  boxShadow: `0 15px 30px ${textures.shadow}, inset ${isEven ? '2px' : '-2px'} 0 10px ${textures.crease}`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Crease shadow gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    background: isEven
                      ? `linear-gradient(to right, rgba(0,0,0,${shadowIntensity}) 0%, transparent 100%)`
                      : `linear-gradient(to left, rgba(0,0,0,${shadowIntensity}) 0%, transparent 100%)`,
                  }}
                />

                <span
                  className="text-4xl md:text-7xl font-extrabold tracking-tight relative z-10"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: textures.text,
                  }}
                >
                  {char}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div
        className="relative z-10 bg-white/70 dark:bg-stone-900/70 border rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono"
        style={{ borderColor: textures.crease }}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span>Fold Angle:</span>
            <input
              type="range"
              min="0"
              max="72"
              value={foldAngle}
              onChange={(e) => setFoldAngle(Number(e.target.value))}
              className="w-32 accent-stone-800"
            />
            <span className="w-10">{foldAngle}°</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {(['washi', 'kraft', 'obsidian'] as const).map((mat) => (
              <button
                key={mat}
                onClick={() => setPaperTexture(mat)}
                className={`px-2.5 py-1 uppercase rounded text-[11px] transition-all ${
                  paperTexture === mat
                    ? 'bg-stone-900 text-stone-100 font-bold'
                    : 'bg-stone-200/60 hover:bg-stone-300 text-stone-800'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFoldAngle(foldAngle > 30 ? 0 : 60)}
            className="px-3 py-1.5 rounded bg-stone-900 text-stone-100 font-bold hover:bg-stone-800 transition-colors"
          >
            {foldAngle > 30 ? 'Unfold Flat' : 'Fold Accordion'}
          </button>
        </div>
      </div>
    </div>
  );
}
