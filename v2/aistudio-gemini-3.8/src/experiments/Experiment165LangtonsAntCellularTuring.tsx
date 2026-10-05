import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment165LangtonsAntCellularTuring() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stepsPerFrame, setStepsPerFrame] = useState(45);
  const [gridSize, setGridSize] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Langton's Ant 2D Grid:
    // Rules:
    // At a white square (0): turn 90° right, flip the color of the square, move forward one unit
    // At a black square (1): turn 90° left, flip the color of the square, move forward one unit
    // After ~10,000 steps of pseudo-random chaotic wandering, it miraculously organizes
    // into a self-repeating 104-step diagonal "highway"!
    const gridW = gridSize;
    const gridH = gridSize;
    const grid = new Uint8Array(gridW * gridH);

    let antX = Math.floor(gridW / 2);
    let antY = Math.floor(gridH / 2);
    let antDir = 0; // 0=Up, 1=Right, 2=Down, 3=Left
    let totalSteps = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Advance ant by stepsPerFrame
      for (let s = 0; s < stepsPerFrame; s++) {
        const idx = antY * gridW + antX;
        const currentColor = grid[idx];

        if (currentColor === 0) {
          // White square: turn right (clockwise)
          antDir = (antDir + 1) % 4;
          grid[idx] = 1;
        } else {
          // Black square: turn left (counter-clockwise)
          antDir = (antDir + 3) % 4;
          grid[idx] = 0;
        }

        // Move forward
        if (antDir === 0) antY--;
        else if (antDir === 1) antX++;
        else if (antDir === 2) antY++;
        else if (antDir === 3) antX--;

        // Wrap boundaries
        if (antX < 0) antX = gridW - 1;
        if (antX >= gridW) antX = 0;
        if (antY < 0) antY = gridH - 1;
        if (antY >= gridH) antY = 0;

        totalSteps++;
      }

      // Render grid cells
      const cellSize = 3.6;
      const originX = cx - (gridW * cellSize) / 2;
      const originY = cy - (gridH * cellSize) / 2;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(originX, originY, gridW * cellSize, gridH * cellSize);

      ctx.fillStyle = '#38bdf8';
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          if (grid[y * gridW + x] === 1) {
            ctx.fillRect(originX + x * cellSize, originY + y * cellSize, cellSize, cellSize);
          }
        }
      }

      // Draw active Ant cursor
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(originX + antX * cellSize + cellSize / 2, originY + antY * cellSize + cellSize / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 230, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 230, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('LANGTON’S ANT 2D AUTOMATON', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Elapsed Iterations: ${totalSteps.toLocaleString()}`, 45, 72);
      ctx.fillText(`Regime: ${totalSteps > 10000 ? 'RECURRENT HIGHWAY (104-STEP)' : 'CHAOTIC CARDIOID WANDER'}`, 45, 90);
      ctx.fillText('Turing Universality: Proven (1990)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1986 CHRIS LANGTON’S ANT · TWO-RULE TURING-COMPLETE EMERGENT HIGHWAY DYNAMICS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [stepsPerFrame, gridSize]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Simulation Speed (Steps/Frame)</span>
            <span className="font-mono">{stepsPerFrame}x</span>
          </div>
          <input
            type="range"
            min="10"
            max="180"
            step="5"
            value={stepsPerFrame}
            onChange={(e) => setStepsPerFrame(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Lattice Dimensions</span>
            <span className="font-mono">{gridSize} × {gridSize} Torus</span>
          </div>
          <input
            type="range"
            min="60"
            max="120"
            step="10"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
