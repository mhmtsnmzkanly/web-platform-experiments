import React, { useState } from 'react';
import { Layers, RotateCcw, Shuffle, Sparkles } from 'lucide-react';

export default function Experiment04BauhausAssembly() {
  const [assemblyProgress, setAssemblyProgress] = useState(100); // 0 = disassembled, 100 = assembled
  const [palette, setPalette] = useState<'bauhaus' | 'monochrome' | 'neoplasticism'>('bauhaus');
  const [isRotating, setIsRotating] = useState(false);

  const palettes = {
    bauhaus: {
      bg: '#F4EFEB',
      black: '#121212',
      red: '#D32F2F',
      yellow: '#FBC02D',
      blue: '#1976D2',
      border: '#2c2b29',
    },
    monochrome: {
      bg: '#EAEAEA',
      black: '#111111',
      red: '#333333',
      yellow: '#777777',
      blue: '#000000',
      border: '#333333',
    },
    neoplasticism: {
      bg: '#FAF8F5',
      black: '#0A0A0A',
      red: '#E53935',
      yellow: '#FFD600',
      blue: '#0D47A1',
      border: '#000000',
    },
  }[palette];

  const factor = (100 - assemblyProgress) / 100;

  return (
    <div
      className="relative w-full min-h-[620px] p-8 rounded-xl flex flex-col justify-between overflow-hidden shadow-2xl transition-colors duration-300 font-sans select-none"
      style={{ backgroundColor: palettes.bg, color: palettes.black }}
    >
      {/* Bauhaus Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, ${palettes.black} 2px, transparent 2px), linear-gradient(to bottom, ${palettes.black} 2px, transparent 2px)`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Top Header */}
      <div
        className="relative z-10 flex items-center justify-between border-b-2 pb-4 font-mono text-xs tracking-wider"
        style={{ borderColor: palettes.black }}
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold px-2 py-0.5 bg-black text-white">004</span>
          <span className="font-bold">BAUHAUS DE STIJL CONSTRUCTIVISM</span>
        </div>
        <div className="flex items-center gap-4">
          <span>WEIMAR / DESSAU 1919-1933</span>
          <span>ASSEMBLY: {assemblyProgress}%</span>
        </div>
      </div>

      {/* Primary Constructivist Kinetic Canvas */}
      <div className="relative z-10 my-auto py-10 flex flex-col items-center justify-center">
        {/* Geometric Accents floating in space */}
        <div
          className="absolute -top-6 -left-4 w-28 h-28 rounded-full border-4 transition-transform duration-500"
          style={{
            borderColor: palettes.yellow,
            backgroundColor: palettes.yellow,
            transform: `translate(${factor * -120}px, ${factor * -80}px) scale(${1 - factor * 0.4})`,
            zIndex: 1,
          }}
        />
        <div
          className="absolute bottom-4 right-10 w-24 h-48 transition-transform duration-500"
          style={{
            backgroundColor: palettes.blue,
            transform: `translate(${factor * 160}px, ${factor * 100}px) rotate(${factor * 45}deg)`,
            zIndex: 1,
          }}
        />
        <div
          className="absolute -bottom-10 left-1/4 w-40 h-8 transition-transform duration-500"
          style={{
            backgroundColor: palettes.red,
            transform: `translate(${factor * -90}px, ${factor * 140}px)`,
            zIndex: 1,
          }}
        />

        {/* The Constructivist "HELLO WORLD" Wordmark */}
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-4xl md:text-7xl font-extrabold tracking-tight">
          {/* WORD 1: HELLO */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* H */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * -60}px, ${factor * -40}px) rotate(${factor * -25}deg)`,
              }}
            >
              <span className="inline-block px-3 py-2 bg-stone-900 text-white border-2 border-black">H</span>
            </div>

            {/* E */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * -30}px, ${factor * 50}px) rotate(${factor * 30}deg)`,
              }}
            >
              <span
                className="inline-block px-3 py-2 text-white border-2 border-black"
                style={{ backgroundColor: palettes.red }}
              >
                E
              </span>
            </div>

            {/* L */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 20}px, ${factor * -60}px) rotate(${factor * -40}deg)`,
              }}
            >
              <span className="inline-block px-3 py-2 bg-stone-900 text-white border-2 border-black">L</span>
            </div>

            {/* L */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 50}px, ${factor * 30}px) rotate(${factor * 20}deg)`,
              }}
            >
              <span
                className="inline-block px-3 py-2 text-white border-2 border-black"
                style={{ backgroundColor: palettes.blue }}
              >
                L
              </span>
            </div>

            {/* O */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 90}px, ${factor * -35}px) rotate(${factor * 90}deg)`,
              }}
            >
              <span
                className="inline-block w-14 h-14 md:w-20 md:h-20 rounded-full text-black flex items-center justify-center border-4 border-black font-extrabold"
                style={{ backgroundColor: palettes.yellow }}
              >
                O
              </span>
            </div>
          </div>

          {/* WORD 2: WORLD */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* W */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * -80}px, ${factor * 70}px) rotate(${factor * 35}deg)`,
              }}
            >
              <span
                className="inline-block px-3 py-2 text-white border-2 border-black"
                style={{ backgroundColor: palettes.blue }}
              >
                W
              </span>
            </div>

            {/* O */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * -20}px, ${factor * -80}px) rotate(${factor * -55}deg)`,
              }}
            >
              <span
                className="inline-block w-14 h-14 md:w-20 md:h-20 rounded-full text-white flex items-center justify-center border-4 border-black font-extrabold"
                style={{ backgroundColor: palettes.red }}
              >
                O
              </span>
            </div>

            {/* R */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 40}px, ${factor * 45}px) rotate(${factor * -20}deg)`,
              }}
            >
              <span className="inline-block px-3 py-2 bg-stone-900 text-white border-2 border-black">R</span>
            </div>

            {/* L */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 75}px, ${factor * -50}px) rotate(${factor * 45}deg)`,
              }}
            >
              <span
                className="inline-block px-3 py-2 text-black border-2 border-black"
                style={{ backgroundColor: palettes.yellow }}
              >
                L
              </span>
            </div>

            {/* D */}
            <div
              className="relative transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate(${factor * 110}px, ${factor * 60}px) rotate(${factor * -60}deg)`,
              }}
            >
              <span className="inline-block px-3 py-2 bg-stone-900 text-white border-2 border-black">D</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs font-mono uppercase tracking-widest text-stone-600">
          Form Follows Function · Drag slider to deconstruct into abstract geometry
        </p>
      </div>

      {/* Bottom Architectural Control Bar */}
      <div
        className="relative z-10 bg-white/80 backdrop-blur-md border-2 p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs"
        style={{ borderColor: palettes.black }}
      >
        {/* Assembly Slider */}
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <span className="font-bold whitespace-nowrap">DECONSTRUCT:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={assemblyProgress}
            onChange={(e) => setAssemblyProgress(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
          <span className="font-bold w-12 text-right">{assemblyProgress}%</span>
        </div>

        {/* Palette & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-2 border-black p-0.5 bg-white">
            {(['bauhaus', 'monochrome', 'neoplasticism'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPalette(p)}
                className={`px-2 py-1 uppercase text-[10px] font-bold transition-all ${
                  palette === p ? 'bg-black text-white' : 'text-black hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAssemblyProgress(assemblyProgress === 100 ? 0 : 100)}
            className="px-3 py-1.5 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
          >
            {assemblyProgress === 100 ? 'Explode' : 'Assemble'}
          </button>
        </div>
      </div>
    </div>
  );
}
