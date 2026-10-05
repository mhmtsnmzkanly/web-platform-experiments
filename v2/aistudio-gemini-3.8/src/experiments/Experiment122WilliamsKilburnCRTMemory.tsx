import React, { useRef, useEffect, useState } from 'react';
import { Tv, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment122WilliamsKilburnCRTMemory() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [refreshRateHz, setRefreshRateHz] = useState(50); // Hz CRT refresh
  const [phosphorGlow, setPhosphorGlow] = useState(80); // %

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark Green CRT Phosphor Screen (P1 Phosphor)
      ctx.fillStyle = '#030a05';
      ctx.fillRect(0, 0, width, height);

      // Williams-Kilburn tube 32x32 electrostatic dot matrix
      const gridSize = 32;
      const cellW = 12;
      const gridW = gridSize * cellW;
      const gridH = gridSize * cellW;
      const startX = cx - gridW / 2;
      const startY = cy - gridH / 2;

      // Raster Scanline Sweep Bar
      const scanlineY = startY + ((t * refreshRateHz * 8) % gridH);

      // Binary charge wells: "dot" (0, uncharged) vs "dash" (1, secondary electron emission positive well)
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const px = startX + x * cellW + cellW / 2;
          const py = startY + y * cellW + cellW / 2;

          // Encode binary pattern of "HELLO WORLD" in the central region
          const isSignal = (x >= 4 && x <= 27 && y >= 12 && y <= 20);

          if (isSignal) {
            // "Dash" bit: secondary electron emission creates positive potential well
            ctx.fillStyle = `rgba(74, 222, 128, ${phosphorGlow / 100})`;
            ctx.fillRect(px - 4, py - 1, 8, 2);
          } else {
            // "Dot" bit
            ctx.fillStyle = `rgba(34, 197, 94, ${(phosphorGlow / 100) * 0.4})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Scanline sweep
      ctx.fillStyle = 'rgba(134, 239, 172, 0.25)';
      ctx.fillRect(startX, scanlineY - 2, gridW, 4);

      // Superimposed Stenciled Specimen "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#86efac';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `1947 MANCHESTER SSEM BABY · WILLIAMS-KILBURN CRT ELECTROSTATIC RAM (1024 BITS) · REFRESH ${refreshRateHz} Hz`,
        cx,
        height - 20
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [refreshRateHz, phosphorGlow]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Tv className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 122: 1947 WILLIAMS-KILBURN CRT ELECTROSTATIC RAM
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Manchester Baby SSEM Secondary Electron Emission Storage Wells (1024 Bits)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRefreshRateHz(50);
              setPhosphorGlow(80);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Regenerate Raster</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Regeneration Refresh Rate:
              </span>
              <span className="text-emerald-400 font-bold">{refreshRateHz} Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={refreshRateHz}
              onChange={(e) => setRefreshRateHz(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>P1 Green Phosphor Persistence:</span>
              <span className="text-emerald-400 font-bold">{phosphorGlow}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={phosphorGlow}
              onChange={(e) => setPhosphorGlow(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
