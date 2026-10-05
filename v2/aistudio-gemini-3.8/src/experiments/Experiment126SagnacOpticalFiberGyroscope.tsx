import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment126SagnacOpticalFiberGyroscope() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationRateDegS, setRotationRateDegS] = useState(45); // deg/s
  const [coilTurnsN, setCoilTurnsN] = useState(800); // meters of fiber

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

      ctx.fillStyle = '#06070f';
      ctx.fillRect(0, 0, width, height);

      // Sagnac phase difference: delta_phi = (8 * pi * A * N * Omega) / (c * lambda)
      const omegaRad = (rotationRateDegS * Math.PI) / 180;
      const sagnacShiftPx = Math.sin(omegaRad) * (coilTurnsN / 800) * 45;

      // Optical fiber coiled ring bobbin
      const coilR = 130;

      ctx.save();
      ctx.translate(cx, cy);

      // Rotating reference frame ring
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(0, 0, coilR, 0, Math.PI * 2);
      ctx.stroke();

      // Counter-propagating laser beams (Clockwise Red and Counter-Clockwise Blue)
      // Clockwise beam (CW)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, coilR - 2, 0, Math.PI * 2);
      ctx.stroke();

      // Counter-Clockwise beam (CCW)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, coilR + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Laser photons circling
      const photonAngleCW = t * 2;
      const photonAngleCCW = -t * 2 + (sagnacShiftPx * 0.05);

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(Math.cos(photonAngleCW) * coilR, Math.sin(photonAngleCW) * coilR, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.arc(Math.cos(photonAngleCCW) * coilR, Math.sin(photonAngleCCW) * coilR, 4, 0, Math.PI * 2);
      ctx.fill();

      // Central Inscribed Typographic Core "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', 0, 0);

      ctx.restore();

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(
        `GEORGES SAGNAC 1913 · FIBER OPTIC GYROSCOPE (FOG) · ROTATION RATE Ω = ${rotationRateDegS}°/s · FIBER LENGTH ${coilTurnsN}m · SAGNAC SHIFT Δφ = ${sagnacShiftPx.toFixed(2)} rad`,
        cx,
        height - 24
      );

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [rotationRateDegS, coilTurnsN]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 126: SAGNAC EFFECT FIBER-OPTIC GYROSCOPE (FOG)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Counter-Propagating Laser Interference & Relativistic Rotation Sensing
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRotationRateDegS(45);
              setCoilTurnsN(800);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Zero Rotation</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Angular Rotation Rate:
              </span>
              <span className="text-cyan-400 font-bold">{rotationRateDegS}°/s</span>
            </div>
            <input
              type="range"
              min="-120"
              max="120"
              value={rotationRateDegS}
              onChange={(e) => setRotationRateDegS(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Optical Fiber Coil Length:</span>
              <span className="text-cyan-400 font-bold">{coilTurnsN} m</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={coilTurnsN}
              onChange={(e) => setCoilTurnsN(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
