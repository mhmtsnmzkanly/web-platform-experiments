import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment154KelvinHelmholtzHydrodynamicInstability() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shearVelocity, setShearVelocity] = useState(2.2); // Velocity difference Delta U
  const [fluidDensityRatio, setFluidDensityRatio] = useState(1.4); // rho1 / rho2
  const [viscosity, setViscosity] = useState(0.015);

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
      const cy = height * 0.48;

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      time += 0.025 * shearVelocity;

      // Kelvin-Helmholtz Instability:
      // Two continuous fluids moving at different velocities with interface perturbed:
      // Forms characteristic curling "cat's-eye" vortex billows!
      const numLines = 28;
      const pts = 140;

      for (let l = 0; l < numLines; l++) {
        const baseLayerOffset = (l - numLines / 2) * 10;
        const isUpper = l >= numLines / 2;

        ctx.beginPath();
        for (let p = 0; p <= pts; p++) {
          const x = (p / pts) * width;
          const k = 0.018; // wavenumber
          const wavePhase = k * x - time * 2.5;

          // Non-linear cat's-eye vortex roll-up amplitude
          const rollUpFactor = Math.sin(wavePhase);
          const billowY = Math.sin(wavePhase) * 45 * Math.exp(-Math.abs(baseLayerOffset) * 0.035);
          const vortexCurls = Math.sin(wavePhase * 2 + time) * 18 * Math.cos(k * x);

          const y = cy + baseLayerOffset + billowY + vortexCurls;

          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Color gradient from upper fluid (warm amber/orange) to lower fluid (cyan/blue)
        const frac = l / numLines;
        const red = Math.floor(245 * (1 - frac) + 14 * frac);
        const green = Math.floor(158 * (1 - frac) + 165 * frac);
        const blue = Math.floor(11 * (1 - frac) + 233 * frac);

        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.15 + 0.65 * (1 - Math.abs(l - numLines / 2) / (numLines / 2))})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Streamline Velocity Vector Arrows
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 1.5;
      for (let ax = 50; ax < width - 50; ax += 120) {
        // Upper layer flowing right (U1)
        ctx.beginPath();
        ctx.moveTo(ax, cy - 80);
        ctx.lineTo(ax + 35 * (shearVelocity / 2), cy - 80);
        ctx.stroke();

        // Lower layer flowing left (U2)
        ctx.beginPath();
        ctx.moveTo(ax, cy + 80);
        ctx.lineTo(ax - 35 * (shearVelocity / 2), cy + 80);
        ctx.stroke();
      }

      // Richardson number calculation: Ri = g*(Delta rho / rho) / (Delta U)^2
      const riNumber = ((9.8 * (fluidDensityRatio - 1)) / (shearVelocity * shearVelocity + 0.1)).toFixed(2);

      // Telemetry Badge
      const tbX = 35;
      const tbY = 35;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(tbX, tbY, 240, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(tbX, tbY, 240, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('KELVIN-HELMHOLTZ INSTABILITY PROBE', tbX + 12, tbY + 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Shear Velocity ΔU: ${shearVelocity.toFixed(1)} m/s`, tbX + 12, tbY + 40);
      ctx.fillText(`Density Ratio ρ1/ρ2: ${fluidDensityRatio.toFixed(2)}`, tbX + 12, tbY + 58);
      ctx.fillStyle = Number(riNumber) < 0.25 ? '#f87171' : '#4ade80';
      ctx.fillText(`Richardson No. Ri = ${riNumber} (${Number(riNumber) < 0.25 ? 'UNSTABLE Ri < 0.25' : 'STABLE'})`, tbX + 12, tbY + 78);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('HYDRODYNAMIC SHEAR INSTABILITY · CAT’S-EYE VORTEX BILLOW ROLL-UP DYNAMICS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [shearVelocity, fluidDensityRatio, viscosity]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Wind size={14} /> Fluid Shear Velocity (ΔU)</span>
            <span className="font-mono">{shearVelocity.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.5"
            step="0.1"
            value={shearVelocity}
            onChange={(e) => setShearVelocity(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Stratified Density Ratio (ρ1 / ρ2)</span>
            <span className="font-mono">{fluidDensityRatio.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={fluidDensityRatio}
            onChange={(e) => setFluidDensityRatio(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
