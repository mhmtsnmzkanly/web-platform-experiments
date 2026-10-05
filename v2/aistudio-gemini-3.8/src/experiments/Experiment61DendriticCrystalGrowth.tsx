import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RotateCcw } from 'lucide-react';

interface CrystalBranch {
  x: number;
  y: number;
  length: number;
  angle: number;
  depth: number;
}

export default function Experiment61DendriticCrystalGrowth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supersaturation, setSupersaturation] = useState(1.4);
  const [growthSteps, setGrowthSteps] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark frosty winter windowpane
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, width, height);

    // Letter nucleation sites for dendritic crystal growth
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 86)}px 'Instrument Serif', Georgia, serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', centerX, centerY);
    const textData = offCtx.getImageData(0, 0, width, height).data;

    const seeds: { x: number; y: number }[] = [];
    for (let y = 10; y < height - 10; y += 14) {
      for (let x = 10; x < width - 10; x += 14) {
        if (textData[(y * width + x) * 4 + 3] > 180) {
          seeds.push({ x, y });
        }
      }
    }

    // Recursive dendritic crystal branching
    ctx.save();
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;

    const drawDendrite = (x: number, y: number, len: number, angle: number, curDepth: number) => {
      if (curDepth === 0 || len < 2) return;

      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const branchAngle = (Math.PI / 3) * 0.5; // 30-degree ice lattice
      drawDendrite(x2, y2, len * 0.72, angle + branchAngle, curDepth - 1);
      drawDendrite(x2, y2, len * 0.72, angle - branchAngle, curDepth - 1);
    };

    seeds.forEach((s) => {
      for (let arm = 0; arm < 6; arm++) {
        const a = (arm / 6) * Math.PI * 2;
        drawDendrite(s.x, s.y, 8 * supersaturation, a, growthSteps);
      }
    });
    ctx.restore();

    // Central frosty typographic core
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(width / 9, 86)}px 'Instrument Serif', Georgia, serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [supersaturation, growthSteps]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06080e] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-sky-300" />
          <span className="font-bold text-stone-200">STUDY 061</span> // DENDRITIC ICE CRYSTAL NUCLEATION
        </div>
        <div className="flex items-center gap-4">
          <span>SUPERSATURATION: {supersaturation}X</span>
          <span>SYMMETRY: 6-FOLD HEXAGONAL ICE</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          HEXAGONAL DENDRITIC ICE CRYSTALS GROW FROM TYPOGRAPHIC SEED NUCLEI
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Crystal Branching:</span>
            <input
              type="range"
              min="2"
              max="5"
              value={growthSteps}
              onChange={(e) => setGrowthSteps(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{growthSteps}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Supersaturation:</span>
            <input
              type="range"
              min="0.8"
              max="2.2"
              step="0.2"
              value={supersaturation}
              onChange={(e) => setSupersaturation(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Snowflake Branching Fractals</span>
        </div>
      </div>
    </div>
  );
}
