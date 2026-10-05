import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment157ChuaChaoticCircuitAttractor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [alphaParam, setAlphaParam] = useState(10.2); // Chua alpha parameter (bifurcation knob)
  const [betaParam, setBetaParam] = useState(14.8); // Chua beta parameter

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Chua Circuit Equations:
    // dx/dt = alpha * (y - x - f(x))
    // dy/dt = x - y + z
    // dz/dt = -beta * y
    // where f(x) is Chua's diode nonlinear piecewise linear characteristic:
    // f(x) = m1 * x + 0.5 * (m0 - m1) * (|x + 1| - |x - 1|)
    let x = 0.1;
    let y = 0.0;
    let z = 0.0;
    const m0 = -1.143;
    const m1 = -0.714;

    const trajectory: { x: number; y: number; z: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070f';
      ctx.fillRect(0, 0, width, height);

      // Integrate 35 steps per frame
      const dt = 0.02;
      for (let s = 0; s < 35; s++) {
        const fx = m1 * x + 0.5 * (m0 - m1) * (Math.abs(x + 1) - Math.abs(x - 1));
        const dx = alphaParam * (y - x - fx);
        const dy = x - y + z;
        const dz = -betaParam * y;

        x += dx * dt;
        y += dy * dt;
        z += dz * dt;

        trajectory.push({ x, y, z });
        if (trajectory.length > 700) trajectory.shift();
      }

      // Draw 3D Double-Scroll Attractor trajectory with isometric rotation
      const rotAngle = Date.now() * 0.0006;
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);
      const scale = 58;

      ctx.lineWidth = 1.4;
      for (let i = 1; i < trajectory.length; i++) {
        const p1 = trajectory[i - 1];
        const p2 = trajectory[i];

        // 3D rotation around Y
        const rx1 = p1.x * cosR - p1.z * sinR;
        const rz1 = p1.x * sinR + p1.z * cosR;
        const rx2 = p2.x * cosR - p2.z * sinR;
        const rz2 = p2.x * sinR + p2.z * cosR;

        const scrX1 = cx + rx1 * scale;
        const scrY1 = cy - (p1.y * scale * 0.8 + rz1 * scale * 0.35);
        const scrX2 = cx + rx2 * scale;
        const scrY2 = cy - (p2.y * scale * 0.8 + rz2 * scale * 0.35);

        // Color based on which of the two scrolls the trajectory is orbiting
        const isScrollLeft = p2.x < 0;
        const alpha = Math.min(1.0, (i / trajectory.length) * 0.9 + 0.1);
        ctx.strokeStyle = isScrollLeft ? `rgba(56, 189, 248, ${alpha})` : `rgba(244, 63, 94, ${alpha})`;

        ctx.beginPath();
        ctx.moveTo(scrX1, scrY1);
        ctx.lineTo(scrX2, scrY2);
        ctx.stroke();
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 230, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 230, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('LEON CHUA CIRCUIT BIFURCATION', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`α = ${alphaParam.toFixed(2)} (C2/C1 capacitance)`, 45, 72);
      ctx.fillText(`β = ${betaParam.toFixed(2)} (Inductance coupling)`, 45, 90);
      ctx.fillText('Attractor: DOUBLE SCROLL CHAOS', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1983 CHUA’S CIRCUIT · NONLINEAR PIECEWISE-LINEAR DOUBLE-SCROLL CHAOTIC ATTRACTOR', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [alphaParam, betaParam]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Chua Bifurcation Parameter (α)</span>
            <span className="font-mono">{alphaParam.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="7.0"
            max="14.0"
            step="0.1"
            value={alphaParam}
            onChange={(e) => setAlphaParam(Number(e.target.value))}
            className="accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Inductive Ratio Parameter (β)</span>
            <span className="font-mono">{betaParam.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="10.0"
            max="22.0"
            step="0.2"
            value={betaParam}
            onChange={(e) => setBetaParam(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
