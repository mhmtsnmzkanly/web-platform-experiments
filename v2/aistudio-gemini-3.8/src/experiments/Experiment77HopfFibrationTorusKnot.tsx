import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment77HopfFibrationTorusKnot() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paramP, setParamP] = useState(3); // Torus knot winding p
  const [paramQ, setParamQ] = useState(5); // Torus knot winding q
  const [fiberCount, setFiberCount] = useState(24);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let tAngle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#06070f';
      ctx.fillRect(0, 0, width, height);

      // Stereographic projection of Hopf fibration fiber circles S3 -> S2
      const R_major = 130;
      const r_minor = 60;

      for (let f = 0; f < fiberCount; f++) {
        const fiberOffset = (f / fiberCount) * Math.PI * 2;
        ctx.beginPath();

        const steps = 180;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2 * paramP;
          const phi = (i / steps) * Math.PI * 2 * paramQ + fiberOffset + tAngle;

          // 3D coordinates on torus
          const x3 = (R_major + r_minor * Math.cos(phi)) * Math.cos(theta);
          const y3 = (R_major + r_minor * Math.cos(phi)) * Math.sin(theta);
          const z3 = r_minor * Math.sin(phi);

          // Perspective tilt rotation
          const rotY = tAngle * 0.4;
          const px = x3 * Math.cos(rotY) + z3 * Math.sin(rotY);
          const pz = -x3 * Math.sin(rotY) + z3 * Math.cos(rotY);
          const py = y3;

          const fov = 400;
          const scale = fov / (fov + pz + 180);
          const scrX = cx + px * scale;
          const scrY = cy + py * scale * 0.75;

          if (i === 0) ctx.moveTo(scrX, scrY);
          else ctx.lineTo(scrX, scrY);
        }

        ctx.strokeStyle = `hsla(${(f * 360) / fiberCount + tAngle * 30}, 85%, 65%, 0.45)`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Center Inscribed Core "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 52px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#c7d2fe';
      ctx.shadowBlur = 0;
      ctx.fillText(`HOPF S³ FIBER BUNDLE (p=${paramP}, q=${paramQ}) · STEREOGRAPHIC PROJECTION`, cx, cy + 40);
      ctx.restore();

      tAngle += 0.015;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [paramP, paramQ, fiberCount]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Orbit className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 077: 4D HOPF FIBRATION TORUS KNOT PROJECTION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                S³ to S² Stereographic Projection & Interlocking Fiber Bundles
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setParamP(3);
              setParamQ(5);
              setFiberCount(24);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Fibers</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Winding Number p:</span>
              <span className="text-amber-400 font-bold">{paramP}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={paramP}
              onChange={(e) => setParamP(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Winding Number q:</span>
              <span className="text-amber-400 font-bold">{paramQ}</span>
            </div>
            <input
              type="range"
              min="1"
              max="9"
              value={paramQ}
              onChange={(e) => setParamQ(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Nested Fiber Count:
              </span>
              <span className="text-amber-400 font-bold">{fiberCount}</span>
            </div>
            <input
              type="range"
              min="8"
              max="48"
              value={fiberCount}
              onChange={(e) => setFiberCount(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
