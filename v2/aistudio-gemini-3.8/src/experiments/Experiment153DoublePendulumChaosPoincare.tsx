import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment153DoublePendulumChaosPoincare() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [initialAngle1, setInitialAngle1] = useState(120); // deg
  const [initialAngle2, setInitialAngle2] = useState(90); // deg
  const [gravityG, setGravityG] = useState(9.8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Double Pendulum Lagrangian dynamic state:
    // theta1, theta2, omega1, omega2
    let theta1 = (initialAngle1 * Math.PI) / 180;
    let theta2 = (initialAngle2 * Math.PI) / 180;
    let omega1 = 0;
    let omega2 = 0;

    const l1 = 95;
    const l2 = 95;
    const m1 = 1.0;
    const m2 = 1.0;

    const trailHistory: { x: number; y: number }[] = [];
    const poincarePoints: { theta1: number; omega1: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.36;
      const cy = height * 0.42;

      ctx.fillStyle = '#06070c';
      ctx.fillRect(0, 0, width, height);

      // RK4 or high-precision Euler-Cromer physics integration
      const dt = 0.08;
      for (let step = 0; step < 4; step++) {
        const deltaTheta = theta1 - theta2;
        const g = gravityG;

        // Equations of motion for double pendulum:
        const num1 = -g * (2 * m1 + m2) * Math.sin(theta1) - m2 * g * Math.sin(theta1 - 2 * theta2) - 2 * Math.sin(deltaTheta) * m2 * (omega2 * omega2 * l2 + omega1 * omega1 * l1 * Math.cos(deltaTheta));
        const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
        const alpha1 = num1 / den1;

        const num2 = 2 * Math.sin(deltaTheta) * (omega1 * omega1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(theta1) + omega2 * omega2 * l2 * m2 * Math.cos(deltaTheta));
        const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
        const alpha2 = num2 / den2;

        omega1 += alpha1 * (dt / 4);
        omega2 += alpha2 * (dt / 4);
        theta1 += omega1 * (dt / 4);
        theta2 += omega2 * (dt / 4);

        // Check for Poincaré section crossing: theta2 crosses 0 with omega2 > 0
        if (Math.abs(theta2 % (Math.PI * 2)) < 0.08 && omega2 > 0) {
          poincarePoints.push({
            theta1: ((theta1 + Math.PI) % (Math.PI * 2)) - Math.PI,
            omega1,
          });
          if (poincarePoints.length > 350) poincarePoints.shift();
        }
      }

      // Compute Cartesian coordinates of bobs
      const x1 = cx + l1 * Math.sin(theta1);
      const y1 = cy + l1 * Math.cos(theta1);

      const x2 = x1 + l2 * Math.sin(theta2);
      const y2 = y1 + l2 * Math.cos(theta2);

      trailHistory.push({ x: x2, y: y2 });
      if (trailHistory.length > 200) trailHistory.shift();

      // Draw chaotic tip trajectory
      ctx.lineWidth = 1.5;
      for (let i = 1; i < trailHistory.length; i++) {
        const alpha = i / trailHistory.length;
        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(trailHistory[i - 1].x, trailHistory[i - 1].y);
        ctx.lineTo(trailHistory[i].x, trailHistory[i].y);
        ctx.stroke();
      }

      // Draw Pendulum Rods
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Pivot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Bob 1
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, Math.PI * 2);
      ctx.fill();

      // Bob 2
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(x2, y2, 12, 0, Math.PI * 2);
      ctx.fill();

      // Poincaré Section Phase Space Map on right side
      const poincareX = width * 0.68;
      const poincareY = 60;
      const poincareW = width * 0.28;
      const poincareH = 260;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(poincareX, poincareY, poincareW, poincareH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(poincareX, poincareY, poincareW, poincareH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('POINCARÉ RETURN MAP (θ1 vs ω1)', poincareX + 12, poincareY + 22);

      // Phase map grid
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(poincareX, poincareY + poincareH / 2);
      ctx.lineTo(poincareX + poincareW, poincareY + poincareH / 2);
      ctx.moveTo(poincareX + poincareW / 2, poincareY);
      ctx.lineTo(poincareX + poincareW / 2, poincareY + poincareH);
      ctx.stroke();

      // Draw Poincaré section points
      ctx.fillStyle = '#f43f5e';
      for (let p of poincarePoints) {
        const px = poincareX + poincareW / 2 + (p.theta1 / Math.PI) * (poincareW * 0.45);
        const py = poincareY + poincareH / 2 - (p.omega1 / 15) * (poincareH * 0.45);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bottom Typography
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('HAMILTONIAN CHAOS · DOUBLE PENDULUM LAGRANGIAN PHASE DYNAMICS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [initialAngle1, initialAngle2, gravityG]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Initial Angle θ1</span>
            <span className="font-mono">{initialAngle1}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="170"
            value={initialAngle1}
            onChange={(e) => setInitialAngle1(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Initial Angle θ2</span>
            <span className="font-mono">{initialAngle2}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="170"
            value={initialAngle2}
            onChange={(e) => setInitialAngle2(Number(e.target.value))}
            className="accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Gravitational Accel g</span>
            <span className="font-mono">{gravityG.toFixed(1)} m/s²</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="25.0"
            step="0.5"
            value={gravityG}
            onChange={(e) => setGravityG(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
