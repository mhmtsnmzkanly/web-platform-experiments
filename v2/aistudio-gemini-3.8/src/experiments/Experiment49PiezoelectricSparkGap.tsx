import React, { useRef, useEffect, useState } from 'react';
import { Zap, Volume2, VolumeX, Sliders } from 'lucide-react';

interface ArcSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Experiment49PiezoelectricSparkGap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gapDistance, setGapDistance] = useState(25); // mm
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSparking, setIsSparking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const letters = 'HELLO WORLD'.split('');

  const playSparkAudio = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Sharp dielectric snap sound
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch {
      // Audio fallback
    }
  };

  const triggerSpark = () => {
    setIsSparking(true);
    playSparkAudio();
    setTimeout(() => setIsSparking(false), 220);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerY = height / 2;

    // Dark dielectric testing chamber
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, width, height);

    const spacing = (width - 160) / (letters.length - 1);
    const startX = 80;

    // Draw Electrode Tungsten Posts for each letter
    letters.forEach((char, i) => {
      if (char === ' ') return;
      const x = startX + i * spacing;

      // Tungsten electrode needle post
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, centerY + 80);
      ctx.lineTo(x, centerY + 20);
      ctx.stroke();

      // Sharp spark gap tip
      ctx.fillStyle = '#e4e4e7';
      ctx.beginPath();
      ctx.arc(x, centerY + 20, 3, 0, Math.PI * 2);
      ctx.fill();

      // Letter engraved above electrode
      ctx.font = 'bold 36px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isSparking ? '#38bdf8' : '#a1a1aa';
      ctx.fillText(char, x, centerY - 35);
    });

    // Draw Jagged High-Voltage Electric Arc Jump when sparked
    if (isSparking) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let curX = startX;
      let curY = centerY + 20;
      ctx.moveTo(curX, curY);

      for (let i = 1; i < letters.length; i++) {
        if (letters[i] === ' ') continue;
        const targetX = startX + i * spacing;
        const targetY = centerY + 20;

        // Draw multi-segment lightning jagged bolt
        const segments = 6;
        for (let seg = 1; seg <= segments; seg++) {
          const t = seg / segments;
          const sx = curX + (targetX - curX) * t;
          const sy = curY + (targetY - curY) * t + (Math.random() - 0.5) * gapDistance;
          ctx.lineTo(sx, sy);
        }

        curX = targetX;
        curY = targetY;
      }
      ctx.stroke();

      // Secondary cyan corona glow
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();
      ctx.restore();
    }
  }, [gapDistance, isSparking]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#08080c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 049</span> // PIEZOELECTRIC QUARTZ SPARK GAP
        </div>
        <div className="flex items-center gap-4">
          <span>VOLTAGE: 25,000V IMPULSE</span>
          <span>DIELECTRIC AIR BREAKDOWN</span>
        </div>
      </div>

      {/* Spark Gap Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={triggerSpark}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CLICK STAGE TO STRIKE PIEZOELECTRIC HAMMER & DISCHARGE ELECTRIC ARC
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Electrode Gap:</span>
            <input
              type="range"
              min="10"
              max="50"
              value={gapDistance}
              onChange={(e) => setGapDistance(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{gapDistance}mm</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'Spark Snap ON' : 'Snap Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerSpark}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold transition-colors"
          >
            <Zap size={13} />
            <span>Strike Hammer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
