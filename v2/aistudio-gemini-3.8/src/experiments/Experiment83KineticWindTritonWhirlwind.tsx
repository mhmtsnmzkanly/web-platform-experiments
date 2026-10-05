import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

interface VortexDust {
  r: number;
  theta: number;
  z: number;
  speed: number;
  color: string;
}

export default function Experiment83KineticWindTritonWhirlwind() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vortexSpeed, setVortexSpeed] = useState(2.2);
  const [updraftVelocity, setUpdraftVelocity] = useState(3.5);
  const [coreRadius, setCoreRadius] = useState(45);
  const dustParticlesRef = useRef<VortexDust[]>([]);

  useEffect(() => {
    dustParticlesRef.current = Array.from({ length: 900 }, () => ({
      r: Math.random() * 220 + coreRadius,
      theta: Math.random() * Math.PI * 2,
      z: Math.random() * 400 - 200,
      speed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? '#fcd34d' : '#f97316',
    }));
  }, [coreRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#07080b';
      ctx.fillRect(0, 0, width, height);

      // Render whirlwind particles
      dustParticlesRef.current.forEach((p) => {
        // Rankine vortex angular velocity: omega = Gamma / (2*pi*r^2)
        const omega = (vortexSpeed / Math.max(20, p.r * 0.08)) * 0.04;
        p.theta += omega;
        p.z -= updraftVelocity * 0.6; // Upward draft
        if (p.z < -200) {
          p.z = 200;
          p.r = Math.random() * 200 + coreRadius;
        }

        // Funnel shape: radius expands with height
        const funnelR = p.r * (1 + (p.z + 200) / 300);
        const px = cx + Math.cos(p.theta) * funnelR;
        const py = cy + p.z + Math.sin(p.theta) * (funnelR * 0.25);

        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, 1.6, 1.6);
      });

      // Typographic eye of the storm "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(`CYCLONIC VORTEX CORE · EYE RADIUS: ${coreRadius}px · UPDRAFT: ${updraftVelocity} m/s`, cx, cy + 42);
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [vortexSpeed, updraftVelocity, coreRadius]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Wind className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 083: KINETIC TRITON CYCLONIC WHIRLWIND
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Rankine Atmospheric Vortex Particle Dynamics & Updraft Funnel
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setVortexSpeed(2.2);
              setUpdraftVelocity(3.5);
              setCoreRadius(45);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Wind</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Angular Velocity:
              </span>
              <span className="text-amber-400 font-bold">{vortexSpeed.toFixed(1)} rad/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={vortexSpeed}
              onChange={(e) => setVortexSpeed(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Updraft Velocity:</span>
              <span className="text-amber-400 font-bold">{updraftVelocity.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={updraftVelocity}
              onChange={(e) => setUpdraftVelocity(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Eye Core Radius:</span>
              <span className="text-amber-400 font-bold">{coreRadius}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={coreRadius}
              onChange={(e) => setCoreRadius(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
