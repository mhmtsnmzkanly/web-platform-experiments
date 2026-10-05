import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment115CasimirVacuumForcePlates() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [plateSeparationNm, setPlateSeparationNm] = useState(30); // Nanometers d
  const [vacuumFluctuationsActive, setVacuumFluctuationsActive] = useState(true);

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

      // Dark ultra-high vacuum chamber
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0, 0, width, height);

      // Casimir attractive pressure: F / A = -(pi^2 * hbar * c) / (240 * d^4)
      const d4 = Math.pow(plateSeparationNm / 10, 4);
      const casimirPressurePascals = (13000 / (d4 + 0.1)).toFixed(1);

      // Plates visual coordinates
      const plateH = 240;
      const halfGap = plateSeparationNm * 2.4;
      const leftPlateX = cx - halfGap;
      const rightPlateX = cx + halfGap;

      // Draw quantum vacuum virtual photon standing waves
      if (vacuumFluctuationsActive) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;

        // Outside plates: all virtual wavelengths permitted (higher radiation pressure pushing inward)
        for (let y = cy - plateH / 2; y <= cy + plateH / 2; y += 12) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(leftPlateX, y + Math.sin(t * 3 + y) * 8);
          ctx.moveTo(rightPlateX, y + Math.cos(t * 3 + y) * 8);
          ctx.lineTo(width - 40, y);
          ctx.stroke();
        }

        // Inside cavity: only discrete standing modes lambda = 2d / n allowed (depleted energy density)
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        for (let y = cy - plateH / 2; y <= cy + plateH / 2; y += 24) {
          ctx.beginPath();
          ctx.moveTo(leftPlateX, y);
          ctx.quadraticCurveTo(cx, y + Math.sin(t * 4 + y) * 6, rightPlateX, y);
          ctx.stroke();
        }
      }

      // Parallel Polished Gold Conducting Plates
      const plateW = 16;
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;

      ctx.fillRect(leftPlateX - plateW, cy - plateH / 2, plateW, plateH);
      ctx.fillRect(rightPlateX, cy - plateH / 2, plateW, plateH);

      // Inward attractive force arrows (Casimir squeeze)
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;

      // Left plate arrow pointing right
      ctx.beginPath();
      ctx.moveTo(leftPlateX - 50, cy);
      ctx.lineTo(leftPlateX - 18, cy);
      ctx.stroke();

      // Right plate arrow pointing left
      ctx.beginPath();
      ctx.moveTo(rightPlateX + 50, cy);
      ctx.lineTo(rightPlateX + 18, cy);
      ctx.stroke();

      // Central Inscribed Specimen "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 52px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', cx, cy - 150);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `HENDRIK CASIMIR 1948 · VACUUM ZERO-POINT ENERGY · SEPARATION d = ${plateSeparationNm} nm · F/A ~ ${casimirPressurePascals} Pa (1/d⁴ FORCE)`,
        cx,
        cy + 155
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [plateSeparationNm, vacuumFluctuationsActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Atom className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 115: QUANTUM VACUUM CASIMIR ATTRACTIVE FORCE
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Hendrik Casimir 1948 Zero-Point Fluctuations & 1/d⁴ Cavity Pressure
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPlateSeparationNm(30);
              setVacuumFluctuationsActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset 30nm Gap</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Plate Gap Distance (d):
              </span>
              <span className="text-amber-400 font-bold">{plateSeparationNm} nm</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={plateSeparationNm}
              onChange={(e) => setPlateSeparationNm(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Zero-Point Fluctuations:</span>
            <button
              onClick={() => setVacuumFluctuationsActive(!vacuumFluctuationsActive)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                vacuumFluctuationsActive
                  ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {vacuumFluctuationsActive ? 'QUANTUM VACUUM ACTIVE' : 'CLASSICAL VACUUM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
