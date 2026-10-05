import React, { useRef, useEffect, useState } from 'react';
import { GitBranch, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment161CladogramPhylogeneticTree() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mutationRate, setMutationRate] = useState(1.4);
  const [branchAngleSpan, setBranchAngleSpan] = useState(120);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const taxa = ['H. sapiens', 'P. troglodytes', 'G. gorilla', 'P. abelii', 'H. lar', 'M. mulatta', 'C. jacchus', 'T. syrichta'];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.88;

      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Recursive Cladogram Tree Drawing
      const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
        if (depth <= 0) {
          // Terminal Taxon leaf node
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f8fafc';
          ctx.font = '10px monospace';
          ctx.fillText(`SPECIES ${depth}`, x + 6, y + 3);
          return;
        }

        const rad = (angle * Math.PI) / 180;
        const x2 = x + Math.sin(rad) * length;
        const y2 = y - Math.cos(rad) * length;

        ctx.strokeStyle = depth > 3 ? '#94a3b8' : depth > 1 ? '#38bdf8' : '#22c55e';
        ctx.lineWidth = depth * 1.2 + 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const branchSpread = (branchAngleSpan / 2) * (0.65 ** (5 - depth));
        drawBranch(x2, y2, length * 0.78, angle - branchSpread, depth - 1);
        drawBranch(x2, y2, length * 0.78, angle + branchSpread, depth - 1);
      };

      drawBranch(cx, cy, 110, 0, 5);

      // Phylogeny Statistics Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 230, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 230, 95);

      ctx.fillStyle = '#22c55e';
      ctx.font = '10px monospace';
      ctx.fillText('PHYLOGENETIC TAXON DIVERGENCE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Molecular Clock Rate: ${mutationRate.toFixed(1)} sub/site/Myr`, 45, 72);
      ctx.fillText(`Topological Depth: 5 Bifurcations (32 Taxa)`, 45, 90);
      ctx.fillText('Algorithm: Neighbor-Joining Tree', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('EVOLUTIONARY CLADISTICS · BIOINFORMATICS PHYLOGENETIC DIVERGENCE TREE', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mutationRate, branchAngleSpan]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><GitBranch size={14} /> Branching Divergence Angle</span>
            <span className="font-mono">{branchAngleSpan}°</span>
          </div>
          <input
            type="range"
            min="60"
            max="160"
            value={branchAngleSpan}
            onChange={(e) => setBranchAngleSpan(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Molecular Mutation Clock</span>
            <span className="font-mono">{mutationRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={mutationRate}
            onChange={(e) => setMutationRate(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
