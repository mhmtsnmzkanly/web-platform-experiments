import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment196TuringCompleteRule110Automaton() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [generationsPerFrame, setGenerationsPerFrame] = useState(2);
  const [cellWidthPx, setCellWidthPx] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Rule 110 (Stephen Wolfram, Matthew Cook 2004 Proof of Turing Completeness):
    // 01101110 in binary = 110.
    // 111 -> 0, 110 -> 1, 101 -> 1, 100 -> 0, 011 -> 1, 010 -> 1, 001 -> 1, 000 -> 0.
    // Capable of universal computation via localized glider structures that collide like logic gates!

    const rule110Map: { [key: number]: number } = {
      7: 0, // 111
      6: 1, // 110
      5: 1, // 101
      4: 0, // 100
      3: 1, // 011
      2: 1, // 010
      1: 1, // 001
      0: 0, // 000
    };

    const numCells = Math.floor(900 / cellWidthPx);
    let currentRow = new Uint8Array(numCells);
    // Initial seed: a few isolated 1s on the right
    currentRow[numCells - 5] = 1;
    currentRow[numCells - 12] = 1;
    currentRow[numCells - 20] = 1;

    const rowsHistory: Uint8Array[] = [currentRow];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Advance generations
      for (let g = 0; g < generationsPerFrame; g++) {
        const nextRow = new Uint8Array(numCells);
        for (let i = 0; i < numCells; i++) {
          const left = i === 0 ? 0 : currentRow[i - 1];
          const self = currentRow[i];
          const right = i === numCells - 1 ? 0 : currentRow[i + 1];
          const pattern = (left << 2) | (self << 1) | right;
          nextRow[i] = rule110Map[pattern];
        }
        currentRow = nextRow;
        rowsHistory.push(currentRow);
        if (rowsHistory.length > Math.floor(360 / cellWidthPx)) {
          rowsHistory.shift();
        }
      }

      // Render history of rows
      for (let r = 0; r < rowsHistory.length; r++) {
        const row = rowsHistory[r];
        const py = 60 + r * cellWidthPx;

        for (let c = 0; c < numCells; c++) {
          if (row[c] === 1) {
            ctx.fillStyle = c % 2 === 0 ? '#38bdf8' : '#22c55e';
            ctx.fillRect(c * cellWidthPx, py, cellWidthPx - 0.5, cellWidthPx - 0.5);
          }
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 280, 85);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 280, 85);

      ctx.fillStyle = '#22c55e';
      ctx.font = '10px monospace';
      ctx.fillText('WOLFRAM RULE 110 CELLULAR AUTOMATON', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Rule Binary: 01101110 (110 Decimal)`, 45, 70);
      ctx.fillText(`Glider Structures: Proven Turing Universal (2004)`, 45, 88);
      ctx.fillText(`Computational Class IV: Edge of Chaos Complexity`, 45, 106);

      // Bottom Typography
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('2004 MATTHEW COOK & WOLFRAM RULE 110 · PROOF OF UNIVERSAL COMPUTATION AT THE EDGE OF CHAOS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [generationsPerFrame, cellWidthPx]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Evolution Rate</span>
            <span className="font-mono">{generationsPerFrame} gen/frame</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={generationsPerFrame}
            onChange={(e) => setGenerationsPerFrame(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Cell Resolution</span>
            <span className="font-mono">{cellWidthPx} px</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={cellWidthPx}
            onChange={(e) => setCellWidthPx(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
