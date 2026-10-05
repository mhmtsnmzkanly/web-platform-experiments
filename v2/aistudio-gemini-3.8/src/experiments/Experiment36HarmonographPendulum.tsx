import React, { useRef, useEffect, useState } from 'react';
import { PenTool, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment36HarmonographPendulum() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [f1, setF1] = useState(2.001);
  const [f2, setF2] = useState(3.003);
  const [damping, setDamping] = useState(0.0015);
  const [colorScheme, setColorScheme] = useState<'gold' | 'cyan' | 'monochrome'>('gold');

  const colors = {
    gold: '#fbbf24',
    cyan: '#38bdf8',
    monochrome: '#ffffff',
  }[colorScheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark drafting drawing paper
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Guilloché Harmonograph parametric curve calculation:
    // x(t) = A1 * sin(f1 * t + p1) * exp(-d * t) + A2 * sin(f2 * t + p2) * exp(-d * t)
    // y(t) = A3 * sin(f3 * t + p3) * exp(-d * t) + A4 * sin(f4 * t + p4) * exp(-d * t)
    ctx.save();
    ctx.strokeStyle = colors;
    ctx.lineWidth = 1;
    ctx.shadowColor = colors;
    ctx.shadowBlur = 4;
    ctx.beginPath();

    const maxSteps = 4000;
    const dt = 0.05;
    const A1 = width * 0.22;
    const A2 = width * 0.18;

    for (let step = 0; step < maxSteps; step++) {
      const t = step * dt;
      const decay = Math.exp(-damping * t);

      const x = centerX + (A1 * Math.sin(f1 * t) + A2 * Math.sin(f2 * t + 0.5)) * decay;
      const y = centerY + (A1 * Math.cos(f2 * t) + A2 * Math.cos(f1 * t + 1.2)) * decay;

      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Central inscribed Hello World watermark
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 48px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = colors;
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [f1, f2, damping, colors]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#0a0a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <PenTool size={14} style={{ color: colors }} />
          <span className="font-bold text-stone-200">STUDY 036</span> // HARMONOGRAPH COUPLED PENDULUMS
        </div>
        <div className="flex items-center gap-4">
          <span>RATIO: {f1.toFixed(2)} : {f2.toFixed(2)}</span>
          <span>DAMPING: {damping}</span>
        </div>
      </div>

      {/* Harmonograph Canvas Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          COUPLED PHYSICAL PENDULUMS DRAW INTRICATE GUILLOCHÉ CURVES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Freq Ratio:</span>
            {[
              { label: '3:2', n1: 2.001, n2: 3.003 },
              { label: '5:4', n1: 4.002, n2: 5.001 },
              { label: '2:1', n1: 1.001, n2: 2.002 },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => {
                  setF1(r.n1);
                  setF2(r.n2);
                }}
                className={`px-2 py-1 rounded border transition-colors ${
                  f1 === r.n1 ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Decay:</span>
            <input
              type="range"
              min="0.0005"
              max="0.003"
              step="0.0002"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-20 accent-amber-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['gold', 'cyan', 'monochrome'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColorScheme(c)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                colorScheme === c ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
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
