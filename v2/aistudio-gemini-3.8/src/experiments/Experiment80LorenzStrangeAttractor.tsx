import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment80LorenzStrangeAttractor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paramSigma, setParamSigma] = useState(10);
  const [paramRho, setParamRho] = useState(28);
  const [paramBeta, setParamBeta] = useState(2.666);
  const [speed, setSpeed] = useState(1.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let x = 0.1, y = 0, z = 0;
    const points: { x: number; y: number; z: number }[] = [];
    const maxPoints = 1400;
    let rotY = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2 + 30;

      // Dark chaotic phase space
      ctx.fillStyle = '#06070c';
      ctx.fillRect(0, 0, width, height);

      // Integrate Lorenz equations: dx/dt = sigma*(y-x), dy/dt = x*(rho-z)-y, dz/dt = x*y - beta*z
      const dt = 0.008 * speed;
      for (let step = 0; step < 6; step++) {
        const dx = paramSigma * (y - x) * dt;
        const dy = (x * (paramRho - z) - y) * dt;
        const dz = (x * y - paramBeta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        points.push({ x, y, z });
        if (points.length > maxPoints) points.shift();
      }

      // Draw 3D projected chaotic attractor butterfly trajectories
      ctx.save();
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);
      const scale = 7.8;

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        // Rotate in 3D
        const rx = pt.x * cosR - pt.y * sinR;
        const ry = pt.x * sinR + pt.y * cosR;
        const rz = pt.z;

        const screenX = cx + rx * scale;
        const screenY = cy - (rz - 25) * scale;

        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      }

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Current attractor head particle
      if (points.length > 0) {
        const head = points[points.length - 1];
        const rx = head.x * cosR - head.y * sinR;
        const rz = head.z;
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx + rx * scale, cy - (rz - 25) * scale, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Central typographic manifold "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', cx, cy - 80);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(`LORENZ STRANGE ATTRACTOR · σ=${paramSigma} ρ=${paramRho} β=${paramBeta.toFixed(2)}`, cx, cy + 160);
      ctx.restore();

      rotY += 0.006;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [paramSigma, paramRho, paramBeta, speed]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 080: EDWARD LORENZ CHAOTIC STRANGE ATTRACTOR
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Atmospheric Convection Equations & 3D Phase Space Butterfly Trajectory
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setParamSigma(10);
              setParamRho(28);
              setParamBeta(2.666);
              setSpeed(1.5);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Attractor</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Prandtl Number (σ):</span>
              <span className="text-amber-400 font-bold">{paramSigma}</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={paramSigma}
              onChange={(e) => setParamSigma(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Rayleigh Number (ρ):</span>
              <span className="text-amber-400 font-bold">{paramRho}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={paramRho}
              onChange={(e) => setParamRho(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Integration Speed:
              </span>
              <span className="text-amber-400 font-bold">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
