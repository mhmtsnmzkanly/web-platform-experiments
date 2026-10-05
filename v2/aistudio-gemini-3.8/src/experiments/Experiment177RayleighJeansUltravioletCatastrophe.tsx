import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment177RayleighJeansUltravioletCatastrophe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureKelvin, setTemperatureKelvin] = useState(3500);
  const [quantumEnergyHNu, setQuantumEnergyHNu] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;

      ctx.fillStyle = '#07080f';
      ctx.fillRect(0, 0, width, height);

      // Ultraviolet Catastrophe (Classical Physics Crisis):
      // Classical equipartition predicts each cavity electromagnetic mode has average energy k_B * T.
      // Mode density increases as nu^2 (or 1/lambda^4).
      // Total radiated energy = integral from 0 to infty of (8 * pi * k_B * T / lambda^4) dlambda -> INFINITY!
      // Planck resolved this by postulating discrete energy quanta E = n * h * nu:
      // Modes with h*nu >> k_B*T cannot be excited, naturally cutting off the high frequencies!

      const chartX = 80;
      const chartY = 70;
      const chartW = width - 160;
      const chartH = 260;

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY);
      ctx.lineTo(chartX, chartY + chartH);
      ctx.lineTo(chartX + chartW, chartY + chartH);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('SPECTRAL ENERGY DENSITY u(ν)', chartX + 10, chartY + 15);
      ctx.fillText('FREQUENCY ν (PHz) → ULTRAVIOLET REGIME', chartX + chartW - 240, chartY + chartH + 20);

      // Draw Classical Rayleigh-Jeans Curve (Diverges to infinity as nu increases!)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = chartX; px <= chartX + chartW * 0.45; px += 2) {
        const nu = (px - chartX) / (chartW * 0.45); // normalized frequency
        const uClassical = (nu * nu) * (chartH * 0.85); // quadratic divergence!
        const py = chartY + chartH - uClassical;
        if (px === chartX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText('CLASSICAL RAYLEIGH-JEANS: u(ν) ∝ ν² → ∞ (UV CATASTROPHE)', chartX + 15, chartY + 45);

      // Draw Quantum Planck Curve (Suppressed by Boltzmann factor exp(-h*nu/kT))
      if (quantumEnergyHNu) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let px = chartX; px <= chartX + chartW; px += 2) {
          const nu = ((px - chartX) / chartW) * 4.5;
          const kBT = (temperatureKelvin / 3500) * 1.2;
          const uPlanck = ((nu * nu * nu) / (Math.exp(nu / kBT) - 1)) * (chartH * 0.45);
          const py = chartY + chartH - uPlanck;

          if (px === chartX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('PLANCK QUANTUM CUTOFF: u(ν) ∝ ν³ / (e^{hν/kT} - 1)', chartX + 15, chartY + 70);
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, height - 130, 270, 80);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, height - 130, 270, 80);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('QUANTIZATION RESOLUTION', 45, height - 112);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Cavity Temperature: ${temperatureKelvin} K`, 45, height - 94);
      ctx.fillText(`Mode Energy: ⟨E⟩ = hν / (e^{hν/kT} - 1)`, 45, height - 76);

      // Bottom Typography
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1900 ULTRAVIOLET CATASTROPHE · CLASSICAL EQUIPARTITION BREAKDOWN & QUANTUM DISCRETIZATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temperatureKelvin, quantumEnergyHNu]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Cavity Temperature (T)</span>
            <span className="font-mono">{temperatureKelvin} K</span>
          </div>
          <input
            type="range"
            min="1500"
            max="6000"
            step="100"
            value={temperatureKelvin}
            onChange={(e) => setTemperatureKelvin(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Quantum Discretization (E = n·h·ν)</span>
            <span className="font-mono">{quantumEnergyHNu ? 'PLANCK CUTOFF ACTIVE' : 'CLASSICAL ONLY'}</span>
          </div>
          <button
            onClick={() => setQuantumEnergyHNu(!quantumEnergyHNu)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              quantumEnergyHNu
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {quantumEnergyHNu ? 'REMOVE QUANTUM CUTOFF (FORCE CATASTROPHE)' : 'APPLY PLANCK QUANTUM CUTOFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
