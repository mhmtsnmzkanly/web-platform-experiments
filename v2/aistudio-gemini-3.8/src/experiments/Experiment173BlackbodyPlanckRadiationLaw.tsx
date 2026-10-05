import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment173BlackbodyPlanckRadiationLaw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureKelvin, setTemperatureKelvin] = useState(5778); // Kelvin (Sun surface = 5778 K)
  const [showClassicalRayleighJeans, setShowClassicalRayleighJeans] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.5;
      const cy = height * 0.45;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Max Planck (1900) Blackbody Spectral Radiance Law:
      // B_lambda(T) = (2 * h * c^2 / lambda^5) * (1 / (exp(h*c / (lambda*k_B*T)) - 1))
      // Wien's Displacement Law: lambda_peak * T = b = 2.898 x 10^-3 m*K
      // Rayleigh-Jeans Classical Law (Ultraviolet Catastrophe): B_RJ = 2*c*k_B*T / lambda^4 -> diverges to infinity as lambda -> 0!

      const wienPeakNm = (2.898e6 / temperatureKelvin);

      const chartX = 80;
      const chartY = 60;
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

      // Visible Light Spectrum Band (380 nm - 750 nm)
      const nmMin = 100;
      const nmMax = 2000;
      const xVisStart = chartX + ((380 - nmMin) / (nmMax - nmMin)) * chartW;
      const xVisEnd = chartX + ((750 - nmMin) / (nmMax - nmMin)) * chartW;

      const rainbowGrad = ctx.createLinearGradient(xVisStart, 0, xVisEnd, 0);
      rainbowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)'); // violet
      rainbowGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.15)'); // blue
      rainbowGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)'); // green
      rainbowGrad.addColorStop(0.75, 'rgba(234, 179, 8, 0.15)'); // yellow
      rainbowGrad.addColorStop(1, 'rgba(239, 68, 68, 0.15)'); // red

      ctx.fillStyle = rainbowGrad;
      ctx.fillRect(xVisStart, chartY, xVisEnd - xVisStart, chartH);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('VISIBLE BAND (380-750 nm)', xVisStart + 15, chartY + 18);

      // Draw Planck Spectral Radiance Curve
      const h = 6.626e-34;
      const c = 3.0e8;
      const kB = 1.38e-23;
      const T = temperatureKelvin;

      // Calculate peak height for normalization
      const peakVal = (T ** 5) * 1.5e-19;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let px = chartX; px <= chartX + chartW; px += 2) {
        const lambdaNm = nmMin + ((px - chartX) / chartW) * (nmMax - nmMin);
        const lambdaM = lambdaNm * 1e-9;

        // Planck formula
        const expTerm = (h * c) / (lambdaM * kB * T);
        let bPlanck = 0;
        if (expTerm < 100) {
          bPlanck = (2 * h * c * c) / (Math.pow(lambdaM, 5) * (Math.exp(expTerm) - 1));
        }

        const normH = Math.min(chartH - 10, (bPlanck / peakVal) * (chartH * 0.75));
        const py = chartY + chartH - normH;

        if (px === chartX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Peak vertical marker line (Wien's law)
      const xPeak = chartX + ((wienPeakNm - nmMin) / (nmMax - nmMin)) * chartW;
      if (xPeak >= chartX && xPeak <= chartX + chartW) {
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(xPeak, chartY);
        ctx.lineTo(xPeak, chartY + chartH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px monospace';
        ctx.fillText(`λ_peak = ${wienPeakNm.toFixed(0)} nm`, xPeak + 4, chartY + 40);
      }

      // Classical Rayleigh-Jeans UV Catastrophe Curve (if enabled)
      if (showClassicalRayleighJeans) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = chartX + 30; px <= chartX + chartW; px += 3) {
          const lambdaNm = nmMin + ((px - chartX) / chartW) * (nmMax - nmMin);
          const lambdaM = lambdaNm * 1e-9;
          const bRJ = (2 * c * kB * T) / Math.pow(lambdaM, 4);
          const normH = Math.min(chartH + 40, (bRJ / peakVal) * (chartH * 0.75));
          const py = chartY + chartH - normH;

          if (px === chartX + 30) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.fillText('RAYLEIGH-JEANS UV CATASTROPHE (CLASSICAL DIVERGENCE)', chartX + 40, chartY + 60);
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, height - 135, 290, 85);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, height - 135, 290, 85);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('PLANCK BLACKBODY EMISSION SPECTRUM', 45, height - 118);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Absolute Temperature: ${temperatureKelvin} K`, 45, height - 100);
      ctx.fillText(`Wien Peak: λ_max = 2.898×10⁶ / T = ${wienPeakNm.toFixed(0)} nm`, 45, height - 82);
      ctx.fillText(`Total Stefan-Boltzmann Power: σ·T⁴`, 45, height - 64);

      // Bottom Typography
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1900 MAX PLANCK BLACKBODY SPECTRUM · BIRTH OF QUANTUM PHYSICS (E = h·ν)', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temperatureKelvin, showClassicalRayleighJeans]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Blackbody Surface Temperature</span>
            <span className="font-mono">{temperatureKelvin} K ({temperatureKelvin === 5778 ? 'Sun' : temperatureKelvin < 4000 ? 'Incandescent' : 'Blue Giant'})</span>
          </div>
          <input
            type="range"
            min="2500"
            max="10000"
            step="100"
            value={temperatureKelvin}
            onChange={(e) => setTemperatureKelvin(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Classical Comparison</span>
            <span className="font-mono">{showClassicalRayleighJeans ? 'RAYLEIGH-JEANS VISIBLE' : 'PLANCK ONLY'}</span>
          </div>
          <button
            onClick={() => setShowClassicalRayleighJeans(!showClassicalRayleighJeans)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              showClassicalRayleighJeans
                ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {showClassicalRayleighJeans ? 'HIDE UV CATASTROPHE CURVE' : 'SHOW RAYLEIGH-JEANS CATASTROPHE'}
          </button>
        </div>
      </div>
    </div>
  );
}
