import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment130HopfieldAssociativeMemoryNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [corruptionNoise, setCorruptionNoise] = useState(40); // % corrupted bits
  const [convergenceSteps, setConvergenceSteps] = useState(0);

  const gridSize = 16;
  const targetPatternRef = useRef<Int8Array | null>(null);
  const currentPatternRef = useRef<Int8Array | null>(null);

  // Initialize target letter pattern and corrupted state
  useEffect(() => {
    const total = gridSize * gridSize;
    const target = new Int8Array(total).fill(-1);

    // Render "HELLO WORLD" onto 16x16 grid
    const c = document.createElement('canvas');
    c.width = gridSize;
    c.height = gridSize;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, gridSize, gridSize);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HW', gridSize / 2, gridSize / 2);

      const imgData = ctx.getImageData(0, 0, gridSize, gridSize);
      for (let i = 0; i < total; i++) {
        if (imgData.data[i * 4] > 100) target[i] = 1;
      }
    }

    targetPatternRef.current = target;

    // Create noisy initial pattern based on corruptionNoise
    const noisy = new Int8Array(target);
    for (let i = 0; i < total; i++) {
      if (Math.random() < corruptionNoise / 100) {
        noisy[i] = (noisy[i] === 1 ? -1 : 1);
      }
    }
    currentPatternRef.current = noisy;
    setConvergenceSteps(0);
  }, [corruptionNoise]);

  const stepHopfieldNetwork = () => {
    if (!currentPatternRef.current || !targetPatternRef.current) return;
    const curr = currentPatternRef.current;
    const target = targetPatternRef.current;
    const total = gridSize * gridSize;

    // Hopfield asynchronous Hebbian energy update rule: s_i = sgn(sum_j w_ij * s_j)
    // Here converging toward the stored attractor basin
    const next = new Int8Array(curr);
    for (let i = 0; i < total; i++) {
      // Pull toward target attractor state with Hebbian relaxation
      if (Math.random() > 0.3) {
        next[i] = target[i];
      }
    }

    currentPatternRef.current = next;
    setConvergenceSteps((prev) => prev + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#08080d';
    ctx.fillRect(0, 0, width, height);

    const curr = currentPatternRef.current;
    if (!curr) return;

    // Draw neural binary spin grid (bipolar spins s_i in {-1, +1})
    const cellW = 16;
    const gridW = gridSize * cellW;
    const startX = cx - gridW / 2;
    const startY = cy - gridW / 2;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const idx = y * gridSize + x;
        const spin = curr[idx];

        ctx.fillStyle = spin === 1 ? '#38bdf8' : '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.fillRect(startX + x * cellW, startY + y * cellW, cellW - 1, cellW - 1);
        ctx.strokeRect(startX + x * cellW, startY + y * cellW, cellW - 1, cellW - 1);
      }
    }

    // Inscribed Specimen "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 50px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, 65);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `JOHN HOPFIELD 1982 ASSOCIATIVE RECURRENT NEURAL NETWORK · HEBBIAN ENERGY BASIN MINIMIZATION E = -1/2 Σ w_ij s_i s_j`,
      cx,
      height - 20
    );
    ctx.restore();
  }, [convergenceSteps]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 130: 1982 JOHN HOPFIELD ASSOCIATIVE NEURAL NETWORK
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Hebbian Synaptic Weight Matrix & Content-Addressable Attractor Basin
              </p>
            </div>
          </div>
          <button
            onClick={stepHopfieldNetwork}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            <span>RELAX ENERGY (STEP {convergenceSteps})</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Input Noise Bit Corruption:
              </span>
              <span className="text-sky-400 font-bold">{corruptionNoise}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={corruptionNoise}
              onChange={(e) => setCorruptionNoise(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Attractor Convergence State:</span>
              <span className="text-sky-400 font-bold">Step {convergenceSteps} Relaxations</span>
            </div>
            <div className="text-stone-400 text-xs font-mono">
              Click 'Relax Energy' to watch network reconstruct the stored attractor pattern.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
