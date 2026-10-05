import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment52SpirographEpicycloid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [R, setR] = useState(180); // Outer fixed gear
  const [r, setR_inner] = useState(72); // Inner rolling cog
  const [d, setD] = useState(85); // Pen hole distance
  const [penColor, setPenColor] = useState<'cyan' | 'gold' | 'magenta'>('cyan');

  const colors = {
    cyan: '#38bdf8',
    gold: '#fbbf24',
    magenta: '#f43f5e',
  }[penColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark drawing drafting table
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, width, height);

    // Fixed outer ring gear circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, R, 0, Math.PI * 2);
    ctx.stroke();

    // Hypotrochoid mathematical equations:
    // x(theta) = (R - r) * cos(theta) + d * cos((R - r) * theta / r)
    // y(theta) = (R - r) * sin(theta) - d * sin((R - r) * theta / r)
    ctx.save();
    ctx.strokeStyle = colors;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = colors;
    ctx.shadowBlur = 4;
    ctx.beginPath();

    const maxSteps = 3000;
    const stepAngle = 0.05;

    for (let step = 0; step < maxSteps; step++) {
      const theta = step * stepAngle;
      const x = centerX + (R - r) * Math.cos(theta) + d * Math.cos(((R - r) * theta) / r);
      const y = centerY + (R - r) * Math.sin(theta) - d * Math.sin(((R - r) * theta) / r);

      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Central Typographic Core
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 44px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = colors;
    ctx.shadowBlur = 15;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [R, r, d, colors]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#080a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Compass size={14} style={{ color: colors }} />
          <span className="font-bold text-stone-200">STUDY 052</span> // GEARED HYPOTROCHOID SPIROGRAPH
        </div>
        <div className="flex items-center gap-4">
          <span>GEAR TEETH: {R}:{r}</span>
          <span>RADIUS D: {d}MM</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          ROLLING INNER PINION COG GENERATES EPICYCLOID HARMONICS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Pinion Cog (r):</span>
            <input
              type="range"
              min="30"
              max="120"
              value={r}
              onChange={(e) => setR_inner(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{r}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Pen Hole (d):</span>
            <input
              type="range"
              min="30"
              max="140"
              value={d}
              onChange={(e) => setD(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{d}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['cyan', 'gold', 'magenta'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setPenColor(c)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                penColor === c ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
