import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment74KaleidoscopeHexagonalMirror() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symmetrySlices, setSymmetrySlices] = useState(6); // 6-fold equilateral or 8/12-fold
  const [rotationSpeed, setRotationSpeed] = useState(1.5);
  const [particleDensity, setParticleDensity] = useState(48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, width, height);

      const maxR = Math.min(width, height) * 0.44;
      const sliceAngle = (Math.PI * 2) / symmetrySlices;

      // Draw reflective circular vignette chamber
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.clip();

      // For each slice of the kaleidoscope
      for (let s = 0; s < symmetrySlices; s++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s * sliceAngle);
        if (s % 2 === 1) {
          ctx.scale(1, -1); // Optical mirror reflection
        }

        // Draw rotated typographic and geometric fragments
        ctx.save();
        ctx.rotate(angle * 0.015 * rotationSpeed);

        // Letter glyph "HELLO WORLD" fragments
        ctx.font = 'bold 36px "Instrument Serif", Georgia, serif';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText('HELLO WORLD', maxR * 0.45, 0);

        ctx.font = 'bold 22px "Syne", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('H · E · L · L · O', maxR * 0.25, 20);

        // Shimmering jewel glass shards
        for (let p = 0; p < particleDensity; p++) {
          const pr = ((p * 29) % (maxR * 0.85)) + 15;
          const pa = (p * 47) % (Math.PI * 2) + angle * 0.02;
          const px = Math.cos(pa) * pr;
          const py = Math.sin(pa) * pr;

          ctx.beginPath();
          ctx.arc(px, py, (p % 4) + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p % 3 === 0 ? '#ec4899' : p % 3 === 1 ? '#06b6d4' : '#fbbf24';
          ctx.fill();
        }

        ctx.restore();
        ctx.restore();
      }
      ctx.restore();

      // Brass outer telescope aperture bezel
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxR + 6, 0, Math.PI * 2);
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#b45309';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fde68a';
      ctx.stroke();
      ctx.restore();

      angle += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [symmetrySlices, rotationSpeed, particleDensity]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 074: EQUILATERAL KALEIDOSCOPE MIRROR PRISM
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Brewster 60° Planar Reflections & Radial Mandala Symmetries
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSymmetrySlices(6);
              setRotationSpeed(1.5);
              setParticleDensity(48);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Optics</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Symmetry Fold Slices:</span>
              <span className="text-amber-400 font-bold">{symmetrySlices}-Fold</span>
            </div>
            <div className="flex gap-2">
              {[4, 6, 8, 12].map((slices) => (
                <button
                  key={slices}
                  onClick={() => setSymmetrySlices(slices)}
                  className={`flex-1 py-1.5 rounded border transition-all cursor-pointer ${
                    symmetrySlices === slices
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {slices}x
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Angular Velocity:
              </span>
              <span className="text-amber-400 font-bold">{rotationSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Vitreous Jewel Shards:
              </span>
              <span className="text-amber-400 font-bold">{particleDensity}</span>
            </div>
            <input
              type="range"
              min="16"
              max="96"
              value={particleDensity}
              onChange={(e) => setParticleDensity(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
