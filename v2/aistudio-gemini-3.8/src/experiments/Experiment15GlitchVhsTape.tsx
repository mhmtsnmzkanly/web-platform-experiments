import React, { useState, useEffect } from 'react';
import { Tv, Play, Pause, Rewind, FastForward, Sliders, Sparkles } from 'lucide-react';

export default function Experiment15GlitchVhsTape() {
  const [tapeMode, setTapeMode] = useState<'PLAY' | 'PAUSE' | 'REW' | 'FF'>('PLAY');
  const [trackingNoise, setTrackingNoise] = useState(40);
  const [chromaSplit, setChromaSplit] = useState(6);
  const [timeCode, setTimeCode] = useState('00:14:22');

  useEffect(() => {
    const timer = setInterval(() => {
      if (tapeMode === 'PLAY') {
        const now = new Date();
        const s = String(now.getSeconds()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        setTimeCode(`00:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [tapeMode]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#08080c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Scanline CRT overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.6) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%',
        }}
      />

      {/* Header */}
      <div className="relative z-30 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Tv size={14} className="text-rose-400" />
          <span className="font-bold text-stone-200">STUDY 015</span> // VCR MAGNETIC TAPE HEAD GLITCH
        </div>
        <div className="flex items-center gap-4">
          <span>STANDARD: NTSC 480i</span>
          <span>TAPE FORMAT: VHS HI-FI</span>
        </div>
      </div>

      {/* VCR Display Viewport */}
      <div className="relative my-auto flex-1 flex flex-col items-center justify-center overflow-hidden">
        {/* VHS On-Screen Display (OSD) */}
        <div className="absolute top-6 left-8 z-30 text-green-400 text-lg md:text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          {tapeMode} {tapeMode === 'PLAY' ? '►' : tapeMode === 'PAUSE' ? '❚❚' : '◄◄'} SP
        </div>

        <div className="absolute top-6 right-8 z-30 text-green-400 text-lg md:text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          {timeCode}
        </div>

        {/* Glitched Chromatic Typography Stage */}
        <div className="relative flex items-center justify-center my-12">
          {/* Cyan layer */}
          <div
            className="absolute text-5xl md:text-8xl font-black tracking-wider text-cyan-400 opacity-80 mix-blend-screen pointer-events-none"
            style={{
              transform: `translate(${-chromaSplit}px, ${Math.sin(Date.now() * 0.01) * 2}px)`,
              fontFamily: 'var(--font-sans)',
            }}
          >
            HELLO WORLD
          </div>

          {/* Red/Magenta layer */}
          <div
            className="absolute text-5xl md:text-8xl font-black tracking-wider text-rose-500 opacity-80 mix-blend-screen pointer-events-none"
            style={{
              transform: `translate(${chromaSplit}px, ${-Math.cos(Date.now() * 0.01) * 2}px)`,
              fontFamily: 'var(--font-sans)',
            }}
          >
            HELLO WORLD
          </div>

          {/* Main White Layer */}
          <div
            className="relative z-10 text-5xl md:text-8xl font-black tracking-wider text-white"
            style={{
              fontFamily: 'var(--font-sans)',
              textShadow: '0 0 15px rgba(255,255,255,0.7)',
            }}
          >
            HELLO WORLD
          </div>
        </div>

        {/* Horizontal Tracking Noise Bar */}
        <div
          className="absolute inset-x-0 h-10 bg-white/10 backdrop-invert pointer-events-none mix-blend-difference animate-pulse"
          style={{
            top: `${(trackingNoise * 4.5) % 80}%`,
            filter: 'blur(1px)',
          }}
        />

        <div className="absolute bottom-6 left-8 z-30 text-xs text-stone-500">
          AUTO-TRACKING LOCK ACTIVE // TAPE SPEED 33.35 MM/S
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-30 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* VCR Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTapeMode('PLAY')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold transition-colors ${
              tapeMode === 'PLAY' ? 'bg-green-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700'
            }`}
          >
            <Play size={12} fill="currentColor" />
            <span>PLAY</span>
          </button>
          <button
            onClick={() => setTapeMode('PAUSE')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold transition-colors ${
              tapeMode === 'PAUSE' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700'
            }`}
          >
            <Pause size={12} fill="currentColor" />
            <span>PAUSE</span>
          </button>
          <button
            onClick={() => setTapeMode('REW')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold transition-colors ${
              tapeMode === 'REW' ? 'bg-sky-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700'
            }`}
          >
            <Rewind size={12} fill="currentColor" />
            <span>REW</span>
          </button>
          <button
            onClick={() => setTapeMode('FF')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold transition-colors ${
              tapeMode === 'FF' ? 'bg-sky-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700'
            }`}
          >
            <FastForward size={12} fill="currentColor" />
            <span>FF</span>
          </button>
        </div>

        {/* Glitch & Tracking Sliders */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Tracking:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={trackingNoise}
              onChange={(e) => setTrackingNoise(Number(e.target.value))}
              className="w-24 accent-rose-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Chroma Split:</span>
            <input
              type="range"
              min="0"
              max="24"
              value={chromaSplit}
              onChange={(e) => setChromaSplit(Number(e.target.value))}
              className="w-24 accent-rose-400"
            />
            <span>{chromaSplit}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
