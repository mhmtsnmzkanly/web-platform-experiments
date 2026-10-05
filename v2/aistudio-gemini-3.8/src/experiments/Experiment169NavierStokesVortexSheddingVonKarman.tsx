import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

interface VortexCore {
  x: number;
  y: number;
  sign: number; // +1 clockwise, -1 counter-clockwise
  age: number;
}

export default function Experiment169NavierStokesVortexSheddingVonKarman() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reynoldsNumber, setReynoldsNumber] = useState(180); // Re between 80 and 300
  const [cylinderRadius, setCylinderRadius] = useState(24);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const vortices: VortexCore[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.28;
      const cy = height * 0.48;

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Strouhal Number St = f * D / U ~ 0.21
      // Shedding frequency f = St * U / D
      const uVelocity = 2.4;
      const diameter = cylinderRadius * 2;
      const sheddingPeriod = Math.floor(450 / uVelocity);

      time++;

      // Alternating periodic shedding of vortices from top and bottom of cylinder
      if (time % 32 === 0) {
        const isUpper = (time / 32) % 2 === 0;
        vortices.push({
          x: cx + cylinderRadius + 5,
          y: cy + (isUpper ? -cylinderRadius * 0.8 : cylinderRadius * 0.8),
          sign: isUpper ? -1 : 1,
          age: 0,
        });
      }

      // Draw Upstream Laminar Streamlines entering from left
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.2;
      for (let y = cy - 140; y <= cy + 140; y += 20) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        // Deflection around cylinder
        const dy = y - cy;
        if (Math.abs(dy) < cylinderRadius + 30) {
          ctx.lineTo(cx - cylinderRadius - 20, y);
          ctx.quadraticCurveTo(cx, cy + (dy > 0 ? cylinderRadius + 25 : -cylinderRadius - 25), cx + cylinderRadius + 30, y);
        } else {
          ctx.lineTo(cx + cylinderRadius + 30, y);
        }
        ctx.stroke();
      }

      // Draw Cylinder Obstacle
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy, cylinderRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Update and draw Von Kármán vortex street in cylinder wake
      for (let i = vortices.length - 1; i >= 0; i--) {
        const v = vortices[i];
        v.x += uVelocity * 0.85;
        v.age++;

        if (v.x > width + 40) {
          vortices.splice(i, 1);
          continue;
        }

        // Draw swirling vortex streamlines
        const vortexR = 12 + v.age * 0.45;
        const alpha = Math.max(0.1, 1 - v.age / 240);

        ctx.strokeStyle = v.sign > 0 ? `rgba(244, 63, 94, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1.5;

        // Spiral vortex lines
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.3) {
          const r = (a / (Math.PI * 4)) * vortexR;
          const px = v.x + Math.cos(a * v.sign + time * 0.1) * r;
          const py = v.y + Math.sin(a * v.sign + time * 0.1) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Vortex center core
        ctx.fillStyle = v.sign > 0 ? '#f43f5e' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(v.x, v.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 250, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 250, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('VON KÁRMÁN VORTEX SHEDDING', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Reynolds Number Re: ${reynoldsNumber} (Laminar Wake)`, 45, 72);
      ctx.fillText(`Strouhal Number St = f·D/U ~ 0.21`, 45, 90);
      ctx.fillText(`Wake Vorticity: Alternating Dipole Pairs`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1911 THEODORE VON KÁRMÁN VORTEX STREET · UNSTEADY VISCOUS CYLINDER WAKE INSTABILITY', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [reynoldsNumber, cylinderRadius]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Wind size={14} /> Reynolds Number (Re)</span>
            <span className="font-mono">{reynoldsNumber} (Stable Vortex Street)</span>
          </div>
          <input
            type="range"
            min="80"
            max="300"
            step="10"
            value={reynoldsNumber}
            onChange={(e) => setReynoldsNumber(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Cylinder Bluff Body Radius</span>
            <span className="font-mono">{cylinderRadius} px</span>
          </div>
          <input
            type="range"
            min="16"
            max="36"
            value={cylinderRadius}
            onChange={(e) => setCylinderRadius(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
