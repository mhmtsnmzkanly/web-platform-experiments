import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Grid } from 'lucide-react';

export default function Experiment16ConwayGameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [generation, setGeneration] = useState(0);
  const [aliveCount, setAliveCount] = useState(0);
  const [speed, setSpeed] = useState(60); // ms per step
  const gridRef = useRef<Uint8Array | null>(null);
  const nextGridRef = useRef<Uint8Array | null>(null);
  const dimsRef = useRef<{ cols: number; rows: number }>({ cols: 120, rows: 60 });

  const seedHelloWorld = (cols: number, rows: number) => {
    const grid = new Uint8Array(cols * rows);

    // Render "HELLO WORLD" onto tiny temporary canvas to get binary bitmask
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const ctx = off.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HELLO WORLD', cols / 2, rows / 2);

    const data = ctx.getImageData(0, 0, cols, rows).data;
    let count = 0;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (data[(y * cols + x) * 4 + 3] > 140) {
          grid[y * cols + x] = 1;
          count++;
        }
      }
    }

    gridRef.current = grid;
    nextGridRef.current = new Uint8Array(cols * rows);
    setGeneration(0);
    setAliveCount(count);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 460);

    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;

    seedHelloWorld(cols, rows);

    let active = true;
    let lastStepTime = 0;
    let animId = 0;

    const render = (time: number) => {
      if (!active) return;

      const cellW = width / cols;
      const cellH = height / rows;
      const grid = gridRef.current;
      const nextGrid = nextGridRef.current;

      // Dark bio-laboratory field
      ctx.fillStyle = '#080c10';
      ctx.fillRect(0, 0, width, height);

      if (grid && nextGrid) {
        // Step simulation if running
        if (isRunning && time - lastStepTime > speed) {
          lastStepTime = time;
          let count = 0;

          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              let neighbors = 0;
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (dx === 0 && dy === 0) continue;
                  const nx = (x + dx + cols) % cols;
                  const ny = (y + dy + rows) % rows;
                  neighbors += grid[ny * cols + nx];
                }
              }

              const idx = y * cols + x;
              const alive = grid[idx];

              if (alive && (neighbors === 2 || neighbors === 3)) {
                nextGrid[idx] = 1;
                count++;
              } else if (!alive && neighbors === 3) {
                nextGrid[idx] = 1;
                count++;
              } else {
                nextGrid[idx] = 0;
              }
            }
          }

          // Swap buffers
          grid.set(nextGrid);
          setGeneration((g) => g + 1);
          setAliveCount(count);
        }

        // Draw living cells with bioluminescent glow
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            if (grid[y * cols + x] === 1) {
              ctx.fillStyle = '#10b981';
              ctx.shadowColor = '#059669';
              ctx.shadowBlur = 4;
              ctx.fillRect(x * cellW, y * cellH, cellW - 0.5, cellH - 0.5);
            }
          }
        }
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [isRunning, speed]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !gridRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    const cx = Math.floor(x / cellW);
    const cy = Math.floor(y / cellH);

    // Invert clicked 3x3 brush cluster
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = (cx + dx + cols) % cols;
        const ny = (cy + dy + rows) % rows;
        gridRef.current[ny * cols + nx] = 1;
      }
    }
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#080c10] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Grid size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 016</span> // CELLULAR AUTOMATA (CONWAY'S GAME OF LIFE)
        </div>
        <div className="flex items-center gap-4">
          <span>SEED: HELLO WORLD BITMASK</span>
          <span>GEN: {generation}</span>
          <span>CELLS: {aliveCount}</span>
        </div>
      </div>

      {/* Automata Canvas Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CLICK GRID TO INJECT LIVING CELL CLUSTERS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isRunning ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
          >
            {isRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            <span>{isRunning ? 'PAUSE' : 'RESUME'}</span>
          </button>

          <button
            onClick={() => seedHelloWorld(dimsRef.current.cols, dimsRef.current.rows)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset "Hello World" Seed</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Step Interval:</span>
            <input
              type="range"
              min="20"
              max="200"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span>{speed}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
