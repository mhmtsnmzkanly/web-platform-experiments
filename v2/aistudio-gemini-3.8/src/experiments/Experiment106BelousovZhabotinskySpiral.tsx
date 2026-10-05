import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment106BelousovZhabotinskySpiral() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reactionSpeed, setReactionSpeed] = useState(1.8);
  const [spiralCount, setSpiralCount] = useState(4);

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

      // Dark mineral reaction basin
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, width, height);

      // Procedural Oregonator BZ reaction spiral wave generation:
      // u(r, theta, t) = cos(k*r - m*theta + omega*t)
      const scale = 12;
      const cols = Math.floor(width / scale);
      const rows = Math.floor(height / scale);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * scale;
          const py = y * scale;

          const dx = px - cx;
          const dy = py - cy;
          const r = Math.hypot(dx, dy);
          const theta = Math.atan2(dy, dx);

          // Archimedean chemical spiral wave
          const phase = r * 0.05 - spiralCount * theta - t * reactionSpeed;
          const wave = Math.cos(phase);

          // BZ Color scheme: Cerium(III) / Ferroin redox indicator:
          // Reduced Ferroin (Crimson Red) <-> Oxidized Ferriin (Cerulean Blue)
          const norm = (wave + 1) / 2;
          ctx.fillStyle = norm > 0.5 ? '#f43f5e' : '#0284c7';
          ctx.fillRect(px, py, scale + 0.5, scale + 0.5);
        }
      }

      // Central Stenciled Specimen "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 66px "Syne", sans-serif';
      ctx.fillStyle = '#06060c';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `BELOUSOV-ZHABOTINSKY OSCILLATING REACTION · ${spiralCount}-ARMED SPIRAL CORES · REDOX WAVE SPEED ${reactionSpeed.toFixed(1)}x`,
        cx,
        cy + 52
      );
      ctx.restore();

      t += 0.04;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [reactionSpeed, spiralCount]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-rose-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 106: BELOUSOV-ZHABOTINSKY CHEMICAL SPIRAL WAVES
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1951 Non-Equilibrium Chemical Oscillator & Ferroin Redox Waves
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setReactionSpeed(1.8);
              setSpiralCount(4);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Stir Basin</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-rose-400" /> Reaction Oscillation Speed:
              </span>
              <span className="text-rose-400 font-bold">{reactionSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={reactionSpeed}
              onChange={(e) => setReactionSpeed(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Spiral Rotor Arms:</span>
              <span className="text-rose-400 font-bold">{spiralCount}-Armed</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={spiralCount}
              onChange={(e) => setSpiralCount(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
