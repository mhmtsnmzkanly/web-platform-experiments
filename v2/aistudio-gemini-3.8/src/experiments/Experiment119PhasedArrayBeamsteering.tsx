import React, { useRef, useEffect, useState } from 'react';
import { Radio, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment119PhasedArrayBeamsteering() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [steerAngleDeg, setSteerAngleDeg] = useState(30); // Steer angle theta
  const [arrayElementsN, setArrayElementsN] = useState(16);

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

      // Dark RF Anechoic Chamber
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, width, height);

      // Phased array base line at bottom
      const baseY = height - 40;
      const arraySpan = 520;
      const elementSpacing = arraySpan / (arrayElementsN - 1);
      const startX = cx - arraySpan / 2;

      // Progressive phase shift per antenna element: delta_phi = (2*pi*d / lambda) * sin(theta)
      const thetaRad = (steerAngleDeg * Math.PI) / 180;
      const k = 0.08; // wave number

      // Render coherent RF wavefront ripples
      ctx.lineWidth = 1.2;
      for (let i = 0; i < arrayElementsN; i++) {
        const ex = startX + i * elementSpacing;
        const phaseOffset = i * 28 * Math.sin(thetaRad);

        // Circular wavelets from each emitter element
        for (let w = 20; w < 380; w += 28) {
          const r = ((w + t * 40 - phaseOffset) % 360);
          if (r > 15) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 0.45 - r / 400)})`;
            ctx.beginPath();
            ctx.arc(ex, baseY, r, -Math.PI, 0);
            ctx.stroke();
          }
        }

        // Antenna radiator dipole node
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(ex, baseY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Steered Main Beam Direction Vector Axis
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cx, baseY);
      ctx.lineTo(cx + Math.sin(thetaRad) * 360, baseY - Math.cos(thetaRad) * 360);
      ctx.stroke();
      ctx.setLineDash([]);

      // Illuminated Target "HELLO WORLD" along beam direction
      const targetDist = 240;
      const targetX = cx + Math.sin(thetaRad) * targetDist;
      const targetY = baseY - Math.cos(thetaRad) * targetDist;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', targetX, targetY);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `PHASED ARRAY RADAR BEAMSTEERING · STEER ANGLE θ = ${steerAngleDeg}° · N = ${arrayElementsN} DIPOLES · CONSTRUCTIVE WAVEFRONT INTERFERENCE`,
        cx,
        30
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [steerAngleDeg, arrayElementsN]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Radio className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 119: PHASED ARRAY COHERENT BEAMSTEERING
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Progressive Phase Shift Δφ = k·d·sin(θ) & Constructive Wavefront Vector
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSteerAngleDeg(30);
              setArrayElementsN(16);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Boresight (0°)</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Beam Azimuth (θ):
              </span>
              <span className="text-amber-400 font-bold">{steerAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              value={steerAngleDeg}
              onChange={(e) => setSteerAngleDeg(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Array Elements (N):</span>
              <span className="text-amber-400 font-bold">{arrayElementsN} dipoles</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={arrayElementsN}
              onChange={(e) => setArrayElementsN(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
