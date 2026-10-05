import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment108TalbotSelfImagingGrating() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [talbotDistanceFraction, setTalbotDistanceFraction] = useState(1.0); // z / z_T
  const [gratingPitchA, setGratingPitchA] = useState(36); // px

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Optical bench dark field
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, width, height);

    // Talbot effect near-field diffraction:
    // Talbot distance z_T = 2 * a^2 / lambda
    // At z = z_T: exact replica self-image
    // At z = z_T / 2: reversed replica phase shift a/2
    // At z = z_T / 4: doubled spatial frequency (fractional Talbot effect!)
    const zFrac = talbotDistanceFraction;
    const a = gratingPitchA;

    // Simulate Fresnel near-field diffraction plane
    const numBars = Math.floor(width / a);
    const phaseShift = Math.sin(zFrac * Math.PI) * (a / 2);
    const frequencyMultiplier = Math.abs(zFrac - 0.5) < 0.15 ? 2 : 1;

    ctx.save();
    ctx.font = 'bold 58px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Render periodic diffraction carpet
    for (let i = 0; i <= numBars * frequencyMultiplier; i++) {
      const x = i * (a / frequencyMultiplier) + phaseShift;
      const alpha = 0.15 + 0.65 * Math.abs(Math.cos(zFrac * Math.PI));

      ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.fillRect(x - 2, 60, 4, height - 120);
    }

    // Central Typographic Self-Image "HELLO WORLD"
    // At exact integer Talbot distances, image is perfectly sharp
    const clarity = Math.abs(Math.cos(zFrac * Math.PI));
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + clarity * 0.6})`;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = clarity * 18;
    ctx.fillText('HELLO WORLD', cx, cy);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `HENRY FOX TALBOT 1836 · NEAR-FIELD FRESNEL DIFFRACTION · z = ${zFrac.toFixed(2)} z_T (${
        zFrac === 1.0 ? 'INTEGER TALBOT PLANE: EXACT REPLICA' : zFrac === 0.5 ? 'SUB-HARMONIC HALF TALBOT' : 'FRACTIONAL CARPET'
      })`,
      cx,
      height - 24
    );
    ctx.restore();
  }, [talbotDistanceFraction, gratingPitchA]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 108: TALBOT EFFECT OPTICAL SELF-IMAGING GRATING
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Henry Fox Talbot 1836 Near-Field Fresnel Plane Wave Regeneration
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setTalbotDistanceFraction(1.0);
              setGratingPitchA(36);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset z = z_T</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Propagation Distance (z / z_T):
              </span>
              <span className="text-sky-400 font-bold">{talbotDistanceFraction.toFixed(2)} z_T</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={talbotDistanceFraction}
              onChange={(e) => setTalbotDistanceFraction(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Grating Pitch Period (a):</span>
              <span className="text-sky-400 font-bold">{gratingPitchA} px</span>
            </div>
            <input
              type="range"
              min="18"
              max="64"
              value={gratingPitchA}
              onChange={(e) => setGratingPitchA(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
