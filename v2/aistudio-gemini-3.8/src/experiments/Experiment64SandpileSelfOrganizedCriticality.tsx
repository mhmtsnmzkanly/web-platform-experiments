import React, { useRef, useEffect, useState } from 'react';
import { Layers, Sliders, RotateCcw, Play, Pause } from 'lucide-react';

export default function Experiment64SandpileSelfOrganizedCriticality() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [avalancheCount, setAvalancheCount] = useState(0);
  const dimsRef = useRef<{ cols: number; rows: number }>({ cols: 100, rows: 54 });
  const gridRef = useRef<Int32Array | null>(null);

  const colors = ['#08090f', '#0284c7', '#38bdf8', '#fbbf24', '#f43f5e'];

  const initGrid = () => {
    const { cols, rows } = dimsRef.current;
    const grid = new Int32Array(cols * rows).fill(2);

    // Seed "HELLO WORLD" with critical height 3 grains
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d')!;
    offCtx.font = 'bold 12px monospace';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);
    const data = offCtx.getImageData(0, 0, cols, rows).data;

    for (let i = 0; i < cols * rows; i++) {
      if (data[i * 4 + 3] > 140) {
        grid[i] = 3; // near critical threshold
      }
    }
    gridRef.current = grid;
    setAvalancheCount(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const { cols, rows } = dimsRef.current;

    initGrid();

    const cellW = width / cols;
    const cellH = height / rows;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      const grid = gridRef.current;
      if (grid && isPlaying) {
        // Drop sand grains randomly in center
        for (let k = 0; k < 12; k++) {
          const rx = Math.floor(cols / 2 + (Math.random() - 0.5) * 30);
          const ry = Math.floor(rows / 2 + (Math.random() - 0.5) * 15);
          if (rx >= 0 && rx < cols && ry >= 0 && ry < rows) {
            grid[ry * cols + rx]++;
          }
        }

        // Toppling avalanches step
        let toppled = false;
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const idx = y * cols + x;
            if (grid[idx] >= 4) {
              grid[idx] -= 4;
              grid[idx - 1]++;
              grid[idx + 1]++;
              grid[idx - cols]++;
              grid[idx + cols]++;
              toppled = true;
            }
          }
        }

        if (toppled) {
          setAvalancheCount((c) => c + 1);
        }

        // Draw cells
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const h = Math.min(4, grid[y * cols + x]);
            ctx.fillStyle = colors[h];
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#08090f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 064</span> // ABELIAN SANDPILE SELF-ORGANIZED CRITICALITY
        </div>
        <div className="flex items-center gap-4">
          <span>TOPPLE THRESHOLD: Z_C = 4</span>
          <span>AVALANCHES: {avalancheCount}</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          PER BAK'S SELF-ORGANIZED CRITICALITY: FRACTAL POWER-LAW AVALANCHES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isPlaying ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-200'
            }`}
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            <span>{isPlaying ? 'PAUSE AVALANCHES' : 'DROP SAND'}</span>
          </button>

          <button
            onClick={initGrid}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            <RotateCcw size={12} />
            <span>Reset Sandpile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Power-Law 1/f Pink Noise</span>
        </div>
      </div>
    </div>
  );
}
