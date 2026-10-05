import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment55ReactionDiffusionTuring() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [feedRate, setFeedRate] = useState(0.055);
  const [killRate, setKillRate] = useState(0.062);
  const dimsRef = useRef<{ cols: number; rows: number }>({ cols: 100, rows: 50 });
  const gridURef = useRef<Float32Array | null>(null);
  const gridVRef = useRef<Float32Array | null>(null);

  const initTuring = () => {
    const { cols, rows } = dimsRef.current;
    const u = new Float32Array(cols * rows).fill(1);
    const v = new Float32Array(cols * rows).fill(0);

    // Seed "HELLO WORLD" with inhibitor chemical V
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
        v[i] = 1;
        u[i] = 0.5;
      }
    }

    gridURef.current = u;
    gridVRef.current = v;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const { cols, rows } = dimsRef.current;

    initTuring();

    const nextU = new Float32Array(cols * rows);
    const nextV = new Float32Array(cols * rows);
    const cellW = width / cols;
    const cellH = height / rows;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      const u = gridURef.current;
      const v = gridVRef.current;

      if (u && v) {
        // Gray-Scott Reaction-Diffusion Steps
        const Du = 0.2097;
        const Dv = 0.105;
        const F = feedRate;
        const K = killRate;

        for (let iter = 0; iter < 4; iter++) {
          for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
              const idx = y * cols + x;
              const uvv = u[idx] * v[idx] * v[idx];

              // Laplacian
              const lapU = u[idx - 1] + u[idx + 1] + u[idx - cols] + u[idx + cols] - 4 * u[idx];
              const lapV = v[idx - 1] + v[idx + 1] + v[idx - cols] + v[idx + cols] - 4 * v[idx];

              nextU[idx] = u[idx] + (Du * lapU - uvv + F * (1 - u[idx]));
              nextV[idx] = v[idx] + (Dv * lapV + uvv - (F + K) * v[idx]);
            }
          }

          u.set(nextU);
          v.set(nextV);
        }

        // Render Turing morphogenetic patterns
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const val = Math.max(0, Math.min(1, v[y * cols + x]));
            if (val > 0.15) {
              ctx.fillStyle = `rgb(${Math.round(val * 56)}, ${Math.round(val * 189)}, ${Math.round(val * 248)})`;
            } else {
              ctx.fillStyle = '#06090e';
            }
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
  }, [feedRate, killRate]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06090e] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 055</span> // TURING MORPHOGENESIS REACTION-DIFFUSION
        </div>
        <div className="flex items-center gap-4">
          <span>MODEL: GRAY-SCOTT (F={feedRate}, K={killRate})</span>
          <span>ACTIVATOR-INHIBITOR EQUATIONS</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          ALAN TURING'S 1952 CHEMICAL REACTION EQUATIONS EMERGE INTO LIVING GLYPHS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Feed (F):</span>
            <input
              type="range"
              min="0.02"
              max="0.08"
              step="0.002"
              value={feedRate}
              onChange={(e) => setFeedRate(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Kill (K):</span>
            <input
              type="range"
              min="0.04"
              max="0.07"
              step="0.002"
              value={killRate}
              onChange={(e) => setKillRate(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={initTuring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Re-Seed Morphogenesis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
