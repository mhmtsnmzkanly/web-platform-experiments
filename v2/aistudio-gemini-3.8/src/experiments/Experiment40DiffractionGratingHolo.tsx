import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw, Zap } from 'lucide-react';

export default function Experiment40DiffractionGratingHolo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gratingLines, setGratingLines] = useState(600); // lines per mm
  const [wavelength, setWavelength] = useState<'green' | 'red' | 'blue'>('green');

  const laser = {
    green: { color: '#22c55e', wl: 532, glow: 'rgba(34, 197, 94, 0.8)' },
    red: { color: '#ef4444', wl: 650, glow: 'rgba(239, 68, 68, 0.8)' },
    blue: { color: '#3b82f6', wl: 450, glow: 'rgba(59, 130, 246, 0.8)' },
  }[wavelength];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark optics lab bench
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, width, height);

    // Optical grating formula: sin(theta) = m * lambda / d
    const d = 1e6 / gratingLines; // nm slit pitch
    const theta1 = (1 * laser.wl) / d; // radians
    const spreadX = Math.min(width * 0.45, theta1 * 800);

    const orders = [-2, -1, 0, 1, 2];

    orders.forEach((m) => {
      const offsetX = m * (spreadX * 0.5);
      const intensity = m === 0 ? 1 : Math.pow(0.5, Math.abs(m));

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 11, 64)}px 'Syne', sans-serif`;

      ctx.fillStyle = laser.color;
      ctx.shadowColor = laser.glow;
      ctx.shadowBlur = 15 * intensity;
      ctx.globalAlpha = intensity;
      ctx.fillText('HELLO WORLD', centerX + offsetX, centerY);

      // Diffraction order label
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`m = ${m}`, centerX + offsetX, centerY + 55);

      ctx.restore();
    });

    // Central transmission laser beam axis line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [gratingLines, wavelength, laser]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#05070a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: laser.color }} />
          <span className="font-bold text-stone-200">STUDY 040</span> // TRANSMISSION DIFFRACTION GRATING
        </div>
        <div className="flex items-center gap-4">
          <span>PITCH: {gratingLines} LINES/MM</span>
          <span>WAVELENGTH: {laser.wl} NM</span>
        </div>
      </div>

      {/* Optics Screen Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          COHERENT LASER INTERFERENCE SPLITS SPATIAL ORDERS (m = 0, ±1, ±2)
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Grating Pitch:</span>
            <input
              type="range"
              min="300"
              max="1200"
              step="50"
              value={gratingLines}
              onChange={(e) => setGratingLines(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span>{gratingLines} l/mm</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['green', 'red', 'blue'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWavelength(w)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                wavelength === w ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
