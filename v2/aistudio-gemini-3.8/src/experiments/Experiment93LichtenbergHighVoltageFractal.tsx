import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

interface SparkBranch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
}

export default function Experiment93LichtenbergHighVoltageFractal() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dischargeVoltageMV, setDischargeVoltageMV] = useState(2.5); // Megavolts
  const [branchRecursion, setBranchRecursion] = useState(7);
  const branchesRef = useRef<SparkBranch[]>([]);

  const generateLichtenbergTree = (width: number, height: number) => {
    const list: SparkBranch[] = [];
    const rootX = width / 2;
    const rootY = height - 40;

    const buildBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth > branchRecursion || length < 4) return;

      const nextX = x + Math.cos(angle) * length;
      const nextY = y + Math.sin(angle) * length;

      list.push({ x1: x, y1: y, x2: nextX, y2: nextY, depth });

      // Stochastic branching forks (2 to 3 sub-streamers)
      const numForks = Math.random() > 0.4 ? 2 : 3;
      for (let f = 0; f < numForks; f++) {
        const spread = (Math.random() - 0.5) * 0.9;
        const decay = Math.random() * 0.25 + 0.65;
        buildBranch(nextX, nextY, length * decay, angle + spread, depth + 1);
      }
    };

    // Upward propagating tree into acrylic block
    buildBranch(rootX, rootY, 70 * (dischargeVoltageMV / 2), -Math.PI / 2, 1);
    branchesRef.current = list;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    generateLichtenbergTree(width, height);
  }, [dischargeVoltageMV, branchRecursion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Dark clear acrylic block with internal glow
    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, width, height);

    // Render tree streamers
    branchesRef.current.forEach((b) => {
      const alpha = Math.max(0.2, 1.0 - b.depth / branchRecursion);
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
      ctx.lineWidth = Math.max(0.8, (branchRecursion - b.depth) * 0.6);
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 8;
      ctx.stroke();
    });

    // Central Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 60px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;
    ctx.fillText('HELLO WORLD', cx, cy - 40);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#93c5fd';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `HIGH-ENERGY ELECTRON BEAM DIELECTRIC BREAKDOWN · ${dischargeVoltageMV.toFixed(1)} MV DISCHARGE`,
      cx,
      30
    );
    ctx.restore();
  }, [dischargeVoltageMV, branchRecursion]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 093: GEORG LICHTENBERG 1777 DIELECTRIC BREAKDOWN FRACTAL
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Trapped Electron Cloud Ground Discharge & Dendritic Fractal Tree
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (canvasRef.current) {
                generateLichtenbergTree(canvasRef.current.width, canvasRef.current.height);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Zap size={13} />
            <span>DISCHARGE (PULSE)</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Beam Energy (MV):
              </span>
              <span className="text-amber-400 font-bold">{dischargeVoltageMV.toFixed(1)} MV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={dischargeVoltageMV}
              onChange={(e) => setDischargeVoltageMV(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Branching Recursion Depth:</span>
              <span className="text-amber-400 font-bold">Level {branchRecursion}</span>
            </div>
            <input
              type="range"
              min="4"
              max="9"
              value={branchRecursion}
              onChange={(e) => setBranchRecursion(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
