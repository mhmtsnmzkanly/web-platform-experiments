import React, { useRef, useEffect, useState } from 'react';
import { Waves, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment159KortewegDeVriesSolitonWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [solitonAmp1, setSolitonAmp1] = useState(1.8); // Tall fast soliton
  const [solitonAmp2, setSolitonAmp2] = useState(0.8); // Small slow soliton

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.55;

      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, width, height);

      time += 0.03;

      // Korteweg-de Vries (KdV) Soliton Dynamics:
      // partial u / partial t + 6 u * (partial u / partial x) + partial^3 u / partial x^3 = 0
      // Single soliton solution: u(x, t) = 2 * c * sech^2( sqrt(c) * (x - 4*c*t - x_0) )
      // Two solitons of different amplitudes: taller soliton travels faster, passes directly
      // through the slower one, suffering only a phase shift without losing its shape!

      const c1 = solitonAmp1 * 0.8;
      const c2 = solitonAmp2 * 0.8;
      const v1 = 4 * c1 * 18;
      const v2 = 4 * c2 * 18;

      // Soliton positions wrap across channel
      const x1 = ((time * v1) % (width + 200)) - 100;
      const x2 = ((time * v2 + width * 0.4) % (width + 200)) - 100;

      // Canal water bed
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, cy + 90, width - 80, 20);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, cy + 90, width - 80, 20);

      // Water channel surface profile
      ctx.beginPath();
      ctx.moveTo(40, cy + 80);

      const surfacePts: { x: number; y: number }[] = [];
      for (let x = 40; x <= width - 40; x += 2) {
        // KdV sech^2 profile:
        const d1 = (x - x1) * 0.04;
        const s1 = 1 / Math.cosh(d1 * Math.sqrt(c1));
        const u1 = 2 * c1 * s1 * s1 * 35;

        const d2 = (x - x2) * 0.04;
        const s2 = 1 / Math.cosh(d2 * Math.sqrt(c2));
        const u2 = 2 * c2 * s2 * s2 * 35;

        // Nonlinear interaction superposition
        const totalHeight = u1 + u2;
        const y = cy + 40 - totalHeight;
        surfacePts.push({ x, y });
      }

      for (let i = 0; i < surfacePts.length; i++) {
        if (i === 0) ctx.moveTo(surfacePts[i].x, surfacePts[i].y);
        else ctx.lineTo(surfacePts[i].x, surfacePts[i].y);
      }
      ctx.lineTo(width - 40, cy + 80);
      ctx.lineTo(40, cy + 80);
      ctx.closePath();

      // Fluid fill gradient
      const waterGrad = ctx.createLinearGradient(0, cy - 60, 0, cy + 80);
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(0.4, '#0284c7');
      waterGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Surface line highlight
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < surfacePts.length; i++) {
        if (i === 0) ctx.moveTo(surfacePts[i].x, surfacePts[i].y);
        else ctx.lineTo(surfacePts[i].x, surfacePts[i].y);
      }
      ctx.stroke();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 250, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 250, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('KORTEWEG-DE VRIES SOLITON WAVEGUIDE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Soliton 1: A1 = ${solitonAmp1.toFixed(1)} · Speed v1 = ${v1.toFixed(1)} u/s`, 45, 72);
      ctx.fillText(`Soliton 2: A2 = ${solitonAmp2.toFixed(1)} · Speed v2 = ${v2.toFixed(1)} u/s`, 45, 90);
      ctx.fillText('Nonlinear Balance: Dispersion == Steepening', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1895 KORTEWEG-DE VRIES SOLITARY WAVE · NONLINEAR INTEGRABLE HAMILTONIAN SOLITON', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [solitonAmp1, solitonAmp2]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Waves size={14} /> Soliton 1 Amplitude (Fast Wave)</span>
            <span className="font-mono">{solitonAmp1.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={solitonAmp1}
            onChange={(e) => setSolitonAmp1(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Soliton 2 Amplitude (Slow Wave)</span>
            <span className="font-mono">{solitonAmp2.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="1.2"
            step="0.05"
            value={solitonAmp2}
            onChange={(e) => setSolitonAmp2(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
