import React, { useState, useRef } from 'react';
import { Grid, Volume2, VolumeX, RotateCcw, Play } from 'lucide-react';

export default function Experiment57FlipDiscMatrixVane() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const cols = 28;
  const rows = 12;

  // Initialize bitmask for "HELLO WORLD"
  const [discGrid, setDiscGrid] = useState<number[][]>(() => {
    const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    // Sample bitmap
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d')!;
    offCtx.fillStyle = '#ffffff';
    offCtx.font = 'bold 9px monospace';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);
    const data = offCtx.getImageData(0, 0, cols, rows).data;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (data[(r * cols + c) * 4 + 3] > 140) {
          grid[r][c] = 1; // Yellow disc
        }
      }
    }
    return grid;
  });

  const playClack = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch {
      // Audio fallback
    }
  };

  const flipDisc = (r: number, c: number) => {
    playClack();
    setDiscGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
  };

  const clearBoard = () => {
    setDiscGrid(Array.from({ length: rows }, () => Array(cols).fill(0)));
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#121318] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Grid size={14} className="text-yellow-400" />
          <span className="font-bold text-stone-200">STUDY 057</span> // ELECTROMECHANICAL FLIP-DISC VANE
        </div>
        <div className="flex items-center gap-4">
          <span>PANEL: 28x12 FERRANTI-PACKARD DISCS</span>
          <span>BISTABLE SOLENOID FLIP</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex flex-col items-center justify-center p-4">
        {/* Flip-Disc Modular Frame */}
        <div className="p-5 bg-[#090a0d] border-4 border-[#272833] rounded-2xl shadow-2xl flex flex-col gap-1.5">
          {discGrid.map((row, r) => (
            <div key={r} className="flex items-center gap-1.5">
              {row.map((val, c) => (
                <button
                  key={c}
                  onMouseEnter={() => flipDisc(r, c)}
                  onClick={() => flipDisc(r, c)}
                  className={`w-5 h-5 md:w-7 md:h-7 rounded-full border border-stone-900 transition-transform duration-150 cursor-pointer ${
                    val === 1
                      ? 'bg-yellow-400 text-stone-950 shadow-md scale-100'
                      : 'bg-[#181920] border-stone-800 scale-95'
                  }`}
                  style={{
                    transform: val === 1 ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-stone-500">
          HOVER OR CLICK INDIVIDUAL DISCS TO ELECTROMAGNETICALLY FLIP POLARITIES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'Mechanical Clack ON' : 'Clack Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            <RotateCcw size={12} />
            <span>Blank Discs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
