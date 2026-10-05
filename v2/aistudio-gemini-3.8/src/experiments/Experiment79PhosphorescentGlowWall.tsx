import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RotateCcw, Zap } from 'lucide-react';

export default function Experiment79PhosphorescentGlowWall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [decayHalfLife, setDecayHalfLife] = useState(4.0); // seconds
  const [laserWattage, setLaserWattage] = useState(500); // mW (395nm UV)
  const isDrawingRef = useRef(false);
  const glowGridRef = useRef<Float32Array | null>(null);
  const gridDim = { w: 180, h: 96 };

  useEffect(() => {
    // Initialize glow energy grid
    const totalCells = gridDim.w * gridDim.h;
    glowGridRef.current = new Float32Array(totalCells);

    // Initial pre-charged "HELLO WORLD" stencil excitation
    const canvas = document.createElement('canvas');
    canvas.width = gridDim.w;
    canvas.height = gridDim.h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, gridDim.w, gridDim.h);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 22px "Syne", sans-serif';
      ctx.fillText('HELLO WORLD', gridDim.w / 2, gridDim.h / 2);

      const imgData = ctx.getImageData(0, 0, gridDim.w, gridDim.h);
      for (let i = 0; i < totalCells; i++) {
        if (imgData.data[i * 4] > 120) {
          glowGridRef.current[i] = 1.0;
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      // Deep dark strontium aluminate phosphorescent backdrop
      ctx.fillStyle = '#030806';
      ctx.fillRect(0, 0, width, height);

      const grid = glowGridRef.current;
      if (!grid) return;

      const cellW = width / gridDim.w;
      const cellH = height / gridDim.h;
      const decayFactor = Math.pow(0.5, 1 / (60 * decayHalfLife));

      for (let y = 0; y < gridDim.h; y++) {
        for (let x = 0; x < gridDim.w; x++) {
          const idx = y * gridDim.w + x;
          let energy = grid[idx];
          if (energy > 0.005) {
            // Decay over time
            energy *= decayFactor;
            grid[idx] = energy;

            // Emerald phosphorescence color: #10b981 / #34d399 / #6ee7b7
            const alpha = Math.min(1, energy);
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 0.85})`;
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [decayHalfLife]);

  const rechargeCellAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const grid = glowGridRef.current;
    if (!canvas || !grid) return;

    const rect = canvas.getBoundingClientRect();
    const gx = Math.floor(((clientX - rect.left) / rect.width) * gridDim.w);
    const gy = Math.floor(((clientY - rect.top) / rect.height) * gridDim.h);

    const radius = Math.floor((laserWattage / 500) * 3) + 1;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx >= 0 && nx < gridDim.w && ny >= 0 && ny < gridDim.h) {
          const dist = Math.hypot(dx, dy);
          if (dist <= radius) {
            const idx = ny * gridDim.w + nx;
            grid[idx] = Math.min(1.0, grid[idx] + 0.5);
          }
        }
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    rechargeCellAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current) {
      rechargeCellAt(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const flashRecharge = () => {
    const totalCells = gridDim.w * gridDim.h;
    const canvas = document.createElement('canvas');
    canvas.width = gridDim.w;
    canvas.height = gridDim.h;
    const ctx = canvas.getContext('2d');
    if (ctx && glowGridRef.current) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, gridDim.w, gridDim.h);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 22px "Syne", sans-serif';
      ctx.fillText('HELLO WORLD', gridDim.w / 2, gridDim.h / 2);

      const imgData = ctx.getImageData(0, 0, gridDim.w, gridDim.h);
      for (let i = 0; i < totalCells; i++) {
        if (imgData.data[i * 4] > 120) {
          glowGridRef.current[i] = 1.0;
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 079: STRONTIUM ALUMINATE PHOSPHORESCENT GLOW WALL
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Eu2+ Dy3+ Persistent Luminescence Traps & UV Laser Pointer Writing
              </p>
            </div>
          </div>
          <button
            onClick={flashRecharge}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <Zap size={13} />
            <span>UV Flash Recharge</span>
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-black cursor-crosshair">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-[480px] block touch-none"
          />
          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-emerald-400/80 bg-stone-950/80 px-2.5 py-1 rounded border border-emerald-900 pointer-events-none">
            395nm UV Stylus Active · Drag pointer across phosphorescent wall to charge electron traps
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Phosphorescence Half-Life:
              </span>
              <span className="text-emerald-400 font-bold">{decayHalfLife.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={decayHalfLife}
              onChange={(e) => setDecayHalfLife(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>UV Laser Power:</span>
              <span className="text-emerald-400 font-bold">{laserWattage} mW</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={laserWattage}
              onChange={(e) => setLaserWattage(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
