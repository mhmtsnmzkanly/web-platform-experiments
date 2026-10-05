import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment198KaluzaKleinExtraDimensionCompact() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [compactRadiusR5, setCompactRadiusR5] = useState(25); // Planck scale compact dimension radius
  const [rotationSpeed, setRotationSpeed] = useState(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Kaluza-Klein Theory (Theodor Kaluza 1921, Oskar Klein 1926):
    // General Relativity in 5 dimensions:
    // Spacetime has 4 extended macroscopic dimensions + 1 compact microscopic circular dimension S^1.
    // The 5D metric tensor splits into:
    // g_mu_nu (4D Graviton) + A_mu (4D Electromagnetic Photon Vector Potential!) + phi (Dilaton scalar)!
    // First geometric unification of gravity and electromagnetism, foundation of modern String Theory.

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      time += 0.02 * rotationSpeed;

      // Draw Extended Macroscopic 1D/2D Spacetime Membrane Cylinder
      // with S^1 Compactified Fiber Bundle Circles at each point!
      const cylinderLength = width * 0.65;
      const x1 = cx - cylinderLength / 2;
      const x2 = cx + cylinderLength / 2;

      // Macro-Spacetime axis line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1 - 30, cy);
      ctx.lineTo(x2 + 30, cy);
      ctx.stroke();

      // Array of S^1 Compactified Extra Dimensions (Circles along the macroscopic axis)
      const numFibers = 18;
      const fiberStep = cylinderLength / numFibers;

      for (let f = 0; f <= numFibers; f++) {
        const fx = x1 + f * fiberStep;
        const phaseOffset = f * 0.35 + time;

        // Circular fiber S^1 in 5th dimension
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(fx, cy, compactRadiusR5 * 0.4, compactRadiusR5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Quantized Kaluza-Klein momentum excitation mode circling S^1
        const chargePhase = phaseOffset * 3;
        const qx = fx + Math.cos(chargePhase) * (compactRadiusR5 * 0.4);
        const qy = cy + Math.sin(chargePhase) * compactRadiusR5;

        // Electromagnetic U(1) gauge charge quantum
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(qx, qy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5D Metric Tensor Decomposition Diagram
      const tensX = width * 0.68;
      const tensY = 70;
      const tensW = width * 0.28;
      const tensH = 140;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(tensX, tensY, tensW, tensH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(tensX, tensY, tensW, tensH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('5D METRIC DECOMPOSITION G_MN', tensX + 12, tensY + 22);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('┌ g_μν (4D Gravity)   A_μ (Maxwell EM) ┐', tensX + 12, tensY + 50);
      ctx.fillText('└ A_ν (Maxwell EM)    ϕ (Dilaton Scalar) ┘', tensX + 12, tensY + 70);
      ctx.fillStyle = '#eab308';
      ctx.fillText('U(1) Gauge Symmetry = S¹ Isometry', tensX + 12, tensY + 105);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('KALUZA-KLEIN COMPACTIFICATION', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Compact Radius R₅: ~${(compactRadiusR5 * 0.1).toFixed(1)} ℓ_Planck`, 45, 72);
      ctx.fillText(`KK Mode Mass: m_n = n / R₅`, 45, 90);
      ctx.fillText('First Geometric Gauge Unification (1921)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1921 THEODOR KALUZA & OSKAR KLEIN · 5D SPACETIME S¹ CIRCLE COMPACTIFICATION & GAUGE UNIFICATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [compactRadiusR5, rotationSpeed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Compactified 5th Dimension Radius (R₅)</span>
            <span className="font-mono">{compactRadiusR5} px</span>
          </div>
          <input
            type="range"
            min="12"
            max="45"
            step="1"
            value={compactRadiusR5}
            onChange={(e) => setCompactRadiusR5(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> S¹ Circulation Velocity</span>
            <span className="font-mono">{rotationSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
