import React, { useRef, useEffect, useState } from 'react';
import { Waves, Sliders, RotateCcw, Volume2 } from 'lucide-react';

export default function Experiment42CymaticsLiquidVibration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frequency, setFrequency] = useState(64); // Hz
  const [liquidViscosity, setLiquidViscosity] = useState(0.85);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const dishRadius = Math.min(width, height) * 0.44;

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.04;

      // Dark acoustics studio
      ctx.fillStyle = '#060a0f';
      ctx.fillRect(0, 0, width, height);

      // Circular speaker petri basin
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, dishRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0b1320';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      // Faraday Standing Wave Rings
      // Bessel-like radial harmonic ripples
      const mode = Math.round(frequency / 12);
      ctx.save();
      ctx.clip(); // clip inside dish

      for (let r = 20; r < dishRadius; r += 12) {
        ctx.beginPath();
        const numVertices = 120;

        for (let i = 0; i <= numVertices; i++) {
          const theta = (i / numVertices) * Math.PI * 2;
          const radialMod = Math.sin(theta * mode + time * 3) * Math.cos(r * 0.1 - time * 2) * 8;
          const rad = r + radialMod;
          const x = centerX + Math.cos(theta) * rad;
          const y = centerY + Math.sin(theta) * rad;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + (1 - r / dishRadius) * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Floating Centerpiece Typographic Seal
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 11, 56)}px 'Syne', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', centerX, centerY);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [frequency, liquidViscosity]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#060a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Waves size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 042</span> // FARADAY CYMATIC LIQUID VIBRATION
        </div>
        <div className="flex items-center gap-4">
          <span>DRIVE FREQUENCY: {frequency} HZ</span>
          <span>FARADAY RIPPLE HARMONICS</span>
        </div>
      </div>

      {/* Cymatics Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          ACOUSTIC DRIVER INDUCES POLYGONAL LIQUID STANDING WAVES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Audio Tone (Hz):</span>
            <input
              type="range"
              min="24"
              max="180"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-28 accent-sky-400"
            />
            <span>{frequency} Hz</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[48, 64, 96, 128].map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                frequency === f ? 'bg-sky-400 text-stone-950 font-bold border-sky-300' : 'border-stone-800 text-stone-400'
              }`}
            >
              {f} Hz
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
