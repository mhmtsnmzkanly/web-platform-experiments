import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment132LissajousOpticalLaserHarmonics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [freqRatioX, setFreqRatioX] = useState(3);
  const [freqRatioY, setFreqRatioY] = useState(4);
  const [phaseDeltaDeg, setPhaseDeltaDeg] = useState(90);

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

      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Dual Galvanometer Mirror Laser Lissajous Beam:
      // x(t) = A * sin(omega_x * t + delta)
      // y(t) = B * sin(omega_y * t)
      const deltaRad = (phaseDeltaDeg * Math.PI) / 180 + t;
      const ampX = 220;
      const ampY = 140;

      ctx.save();
      ctx.beginPath();
      const steps = 720;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * Math.PI * 2;
        const px = cx + Math.sin(freqRatioX * phi + deltaRad) * ampX;
        const py = cy + Math.sin(freqRatioY * phi) * ampY;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Inscribed Center Specimen "HELLO WORLD"
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#86efac';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `JULES LISSAJOUS 1857 · DUAL GALVANOMETER HARMONIC RATIO ${freqRatioX}:${freqRatioY} · PHASE SHIFT Δ = ${phaseDeltaDeg}°`,
        cx,
        height - 24
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [freqRatioX, freqRatioY, phaseDeltaDeg]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 132: DUAL-GALVANOMETER OPTICAL LASER LISSAJOUS FIGURES
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1857 Jules Lissajous Orthogonal Harmonic Mirrors & Parametric Laser Trajectory
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFreqRatioX(3);
              setFreqRatioY(4);
              setPhaseDeltaDeg(90);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset 3:4 Mode</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> X-Galvo Harmonic Ratio:
              </span>
              <span className="text-emerald-400 font-bold">{freqRatioX}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={freqRatioX}
              onChange={(e) => setFreqRatioX(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Y-Galvo Harmonic Ratio:</span>
              <span className="text-emerald-400 font-bold">{freqRatioY}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={freqRatioY}
              onChange={(e) => setFreqRatioY(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Phase Shift (Δ):</span>
              <span className="text-emerald-400 font-bold">{phaseDeltaDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={phaseDeltaDeg}
              onChange={(e) => setPhaseDeltaDeg(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
