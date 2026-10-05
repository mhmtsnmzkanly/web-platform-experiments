import React, { useState, useRef } from 'react';
import { Gamepad2, Volume2, VolumeX, Sliders } from 'lucide-react';

export default function Experiment48OscilloscopeVectorGameBoy() {
  const [contrast, setContrast] = useState(100);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChiptune = (freq = 440) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square'; // 8-bit pulse wave
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#222329] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-700 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-700 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Gamepad2 size={14} className="text-lime-400" />
          <span className="font-bold text-stone-200">STUDY 048</span> // 1989 DOT MATRIX 4-SHADE LCD (DMG-01)
        </div>
        <div className="flex items-center gap-4">
          <span>PANEL: 160x144 STN REFLECTIVE</span>
          <span>CHIPSET: LR35902 4.19 MHZ</span>
        </div>
      </div>

      {/* Retro Handheld Screen Housing */}
      <div className="relative my-auto flex-1 flex flex-col items-center justify-center">
        {/* Grey Bezel with Blue/Magenta Pinstripes */}
        <div className="p-8 bg-[#8b8c94] rounded-2xl shadow-2xl border-4 border-[#6e6f76] flex flex-col items-center">
          <div className="w-full flex justify-between text-[9px] font-bold text-stone-700 tracking-wider mb-2">
            <span>DOT MATRIX WITH STEREO SOUND</span>
            <span className="text-rose-700">BATTERY [●]</span>
          </div>

          {/* Olive Green LCD Screen */}
          <div
            className="relative w-[340px] md:w-[480px] h-[260px] bg-[#8bac0f] border-4 border-[#306230] rounded p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden"
            style={{
              filter: `contrast(${contrast}%)`,
              backgroundImage: 'radial-gradient(#87a80e 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          >
            {/* Screen Pixel Ghosting */}
            <div
              className="text-4xl md:text-6xl font-bold font-retro tracking-widest text-[#0f380f] select-none text-center transition-transform duration-100"
              style={{
                transform: `translateY(${offsetY}px)`,
                textShadow: '2px 2px 0px rgba(48, 98, 48, 0.4)',
              }}
            >
              HELLO WORLD
            </div>

            <div className="mt-4 text-[10px] font-retro text-[#306230] tracking-widest text-center">
              (C) 1989 LABORATORIES CORP.
              <br />
              ALL RIGHTS RESERVED
            </div>
          </div>

          {/* D-Pad and Action Buttons Housing */}
          <div className="flex items-center justify-between w-full mt-6 px-4">
            {/* D-Pad Buttons */}
            <div className="grid grid-cols-3 gap-1 w-24">
              <div />
              <button
                onClick={() => {
                  setOffsetY((y) => Math.max(-20, y - 8));
                  playChiptune(660);
                }}
                className="w-7 h-7 bg-stone-900 rounded-sm text-stone-400 font-bold active:bg-stone-800"
              >
                ▲
              </button>
              <div />
              <button
                onClick={() => {
                  setOffsetY(0);
                  playChiptune(440);
                }}
                className="w-7 h-7 bg-stone-900 rounded-sm text-stone-400 font-bold active:bg-stone-800"
              >
                ◀
              </button>
              <div className="w-7 h-7 bg-stone-900 rounded-sm" />
              <button
                onClick={() => {
                  setOffsetY(0);
                  playChiptune(550);
                }}
                className="w-7 h-7 bg-stone-900 rounded-sm text-stone-400 font-bold active:bg-stone-800"
              >
                ▶
              </button>
              <div />
              <button
                onClick={() => {
                  setOffsetY((y) => Math.min(20, y + 8));
                  playChiptune(330);
                }}
                className="w-7 h-7 bg-stone-900 rounded-sm text-stone-400 font-bold active:bg-stone-800"
              >
                ▼
              </button>
              <div />
            </div>

            {/* A/B Round Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => playChiptune(880)}
                className="w-9 h-9 rounded-full bg-rose-800 active:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                B
              </button>
              <button
                onClick={() => playChiptune(1100)}
                className="w-9 h-9 rounded-full bg-rose-800 active:bg-rose-700 text-white font-bold text-xs shadow-md mt-4"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Contrast Dial:</span>
            <input
              type="range"
              min="70"
              max="140"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-24 accent-lime-400"
            />
            <span>{contrast}%</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'Chiptune ON' : 'Sound Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">4-Shade Olive Green Palette</span>
        </div>
      </div>
    </div>
  );
}
