import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment175LorenzWaterWheelChaoticDynamics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inflowRate, setInflowRate] = useState(2.4); // Water flow into top buckets
  const [leakRate, setLeakRate] = useState(1.0); // Leaky holes at bottom of buckets

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Malkus Chaotic Water Wheel (Isomorphic to Edward Lorenz's Attractor equations!):
    // A tilted wheel with leaky paper cups around its rim.
    // Water flows into the top cups at a steady constant rate.
    // Cups leak water out of holes in their bottoms.
    // At low flow, it remains stationary or rotates smoothly in one direction.
    // Above critical inflow, it exhibits sudden chaotic direction reversals!

    const numBuckets = 12;
    const bucketsWater: number[] = new Array(numBuckets).fill(0.2);
    let wheelAngle = 0;
    let wheelOmega = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Simulation step
      const wheelR = 120;
      let netTorque = 0;

      for (let i = 0; i < numBuckets; i++) {
        const theta = wheelAngle + (i * Math.PI * 2) / numBuckets;

        // Top inflow zone (within 25 degrees of top vertical)
        const topDist = Math.abs(Math.sin(theta));
        if (Math.cos(theta) < -0.85) {
          bucketsWater[i] += inflowRate * 0.015;
        }

        // Leaking out
        bucketsWater[i] -= bucketsWater[i] * leakRate * 0.01;
        bucketsWater[i] = Math.max(0, Math.min(1.0, bucketsWater[i]));

        // Gravitational torque tau = m * g * r * sin(theta)
        // Positive sin(theta) produces clockwise torque
        netTorque += bucketsWater[i] * Math.sin(theta) * 0.08;
      }

      // Wheel rotational dynamics with bearing friction
      wheelOmega += netTorque * 0.05 - wheelOmega * 0.025; // damping
      wheelAngle += wheelOmega;

      // Draw Top Water Inflow Spout
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - 6, cy - wheelR - 55, 12, 25);
      // Falling water stream
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy - wheelR - 30);
      ctx.lineTo(cx, cy - wheelR);
      ctx.stroke();

      // Draw Wheel Spokes and Rim
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, wheelR, 0, Math.PI * 2);
      ctx.stroke();

      // Center Hub
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Leaky Buckets around the rim
      for (let i = 0; i < numBuckets; i++) {
        const theta = wheelAngle + (i * Math.PI * 2) / numBuckets;
        const bx = cx + Math.sin(theta) * wheelR;
        const by = cy - Math.cos(theta) * wheelR;

        // Spoke from center
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Bucket cup
        const cupW = 20;
        const cupH = 26;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx - cupW / 2, by - cupH / 2, cupW, cupH);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx - cupW / 2, by - cupH / 2, cupW, cupH);

        // Water level inside cup
        const waterH = bucketsWater[i] * cupH;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx - cupW / 2 + 2, by + cupH / 2 - waterH, cupW - 4, waterH);

        // Leaking drops from bottom of cup
        if (bucketsWater[i] > 0.05) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.beginPath();
          ctx.arc(bx, by + cupH / 2 + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('MALKUS CHAOTIC WATER WHEEL', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Angular Velocity ω: ${(wheelOmega * 60).toFixed(1)} RPM`, 45, 72);
      ctx.fillText(`Rotation Sense: ${wheelOmega > 0 ? 'CLOCKWISE' : 'COUNTER-CLOCKWISE'}`, 45, 90);
      ctx.fillText('Equivalence: Edward Lorenz Attractor (1963)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1963 WILLEM MALKUS CHAOTIC WATER WHEEL · MECHANICAL HOMOMORPHISM TO LORENZ EQUATIONS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [inflowRate, leakRate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Water Inflow Rate (Chaos Knob)</span>
            <span className="font-mono">{inflowRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.5"
            step="0.1"
            value={inflowRate}
            onChange={(e) => setInflowRate(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Cup Drain Leakage Rate</span>
            <span className="font-mono">{leakRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={leakRate}
            onChange={(e) => setLeakRate(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
