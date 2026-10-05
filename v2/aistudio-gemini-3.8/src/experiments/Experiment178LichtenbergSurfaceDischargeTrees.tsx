import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

interface LichtenbergBranch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
}

export default function Experiment178LichtenbergSurfaceDischargeTrees() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dielectricVoltageMv, setDielectricVoltageMv] = useState(3.2); // Megavolts trapped electron charge
  const [fractalDepth, setFractalDepth] = useState(6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;

    // Lichtenberg Figure (Dielectric Breakdown Fractal):
    // Clear PMMA acrylic irradiated with relativistic electron beam (linac) stores trapped space charge.
    // When a grounded steel punch creates an indent, dielectric breakdown discharges like miniature lightning,
    // carving permanent fractal dendrites into the plastic matrix!
    const branches: LichtenbergBranch[] = [];

    const generateTree = (x: number, y: number, angle: number, len: number, depth: number) => {
      if (depth <= 0) return;

      const rad = (angle * Math.PI) / 180;
      const x2 = x + Math.cos(rad) * len;
      const y2 = y + Math.sin(rad) * len;

      branches.push({ x1: x, y1: y, x2, y2, depth });

      const numSplits = Math.random() > 0.4 ? 2 : 3;
      for (let s = 0; s < numSplits; s++) {
        const spread = (Math.random() - 0.5) * 65;
        const decay = 0.65 + Math.random() * 0.18;
        generateTree(x2, y2, angle + spread, len * decay, depth - 1);
      }
    };

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.52;

      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, width, height);

      // Acrylic Block outline
      const blockW = width * 0.65;
      const blockH = 320;
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(cx - blockW / 2, cy - blockH / 2, blockW, blockH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - blockW / 2, cy - blockH / 2, blockW, blockH);

      // Generate branches starting from center punch if empty
      if (branches.length === 0) {
        for (let a = 0; a < 360; a += 45) {
          generateTree(cx, cy, a + (Math.random() - 0.5) * 20, 48 * (dielectricVoltageMv / 3.0), fractalDepth);
        }
      }

      // Draw glowing fractal branches
      for (let b of branches) {
        const alpha = Math.min(1.0, (b.depth / fractalDepth) * 0.8 + 0.2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = b.depth * 0.6 + 0.6;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
      }

      // Center discharge punch impact point
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('DIELECTRIC BREAKDOWN TREE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Trapped Electron Charge: ${dielectricVoltageMv.toFixed(1)} MV`, 45, 72);
      ctx.fillText(`Fractal Branch Count: ${branches.length} Segments`, 45, 90);
      ctx.fillText(`Substrate: PMMA Acrylic (Dielectric Strength ~20 kV/mm)`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1777 GEORG CHRISTOPH LICHTENBERG FIGURES · HIGH-VOLTAGE DIELECTRIC ELECTRON BREAKDOWN', 220, height - 25);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [dielectricVoltageMv, fractalDepth]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Zap size={14} /> Trapped Acceleration Potential</span>
            <span className="font-mono">{dielectricVoltageMv.toFixed(1)} Megavolts</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="5.0"
            step="0.1"
            value={dielectricVoltageMv}
            onChange={(e) => setDielectricVoltageMv(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Fractal Branching Depth</span>
            <span className="font-mono">{fractalDepth} recursive levels</span>
          </div>
          <input
            type="range"
            min="4"
            max="7"
            value={fractalDepth}
            onChange={(e) => setFractalDepth(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
