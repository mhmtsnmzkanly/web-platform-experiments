import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Sliders, RotateCcw } from 'lucide-react';

interface FluidParticle {
  r: number; // radial distance from centerline
  x: number;
  color: string;
}

export default function Experiment163PoiseuilleLaminarFluidPipe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pressureDropDeltaP, setPressureDropDeltaP] = useState(2.4); // kPa
  const [fluidViscosityEta, setFluidViscosityEta] = useState(1.0); // mPa.s (water = 1.0, oil = 5.0)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: FluidParticle[] = [];
    const pipeRadius = 90;

    for (let i = 0; i < 180; i++) {
      particles.push({
        r: (Math.random() - 0.5) * 2 * pipeRadius * 0.95,
        x: Math.random() * 800,
        color: Math.random() > 0.5 ? '#38bdf8' : '#0284c7',
      });
    }

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.48;

      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, width, height);

      // Hagen-Poiseuille Laminar Pipe Flow:
      // Velocity profile is a parabolic function of radial distance r:
      // v(r) = (Delta P / (4 * eta * L)) * (R^2 - r^2)
      // Maximum velocity at centerline (r = 0): v_max = (Delta P * R^2) / (4 * eta * L)
      // Zero velocity at pipe walls (r = R) due to no-slip boundary condition!

      const pipeTop = cy - pipeRadius;
      const pipeBottom = cy + pipeRadius;
      const pipeX1 = 40;
      const pipeX2 = width - 40;

      // Pipe upper wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(pipeX1, pipeTop - 20, pipeX2 - pipeX1, 20);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipeX1, pipeTop - 20, pipeX2 - pipeX1, 20);

      // Pipe lower wall
      ctx.fillRect(pipeX1, pipeBottom, pipeX2 - pipeX1, 20);
      ctx.strokeRect(pipeX1, pipeBottom, pipeX2 - pipeX1, 20);

      // Flow velocity coefficient
      const vMax = (pressureDropDeltaP / fluidViscosityEta) * 4.5;

      // Update and draw fluid tracer particles
      for (let p of particles) {
        const rFrac = p.r / pipeRadius;
        const localVelocity = vMax * (1 - rFrac * rFrac);

        p.x += localVelocity;
        if (p.x > pipeX2) p.x = pipeX1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, cy + p.r, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parabolic Velocity Profile Vector Arrows
      const profileX = width * 0.65;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let r = -pipeRadius; r <= pipeRadius; r += 2) {
        const rFrac = r / pipeRadius;
        const v = vMax * (1 - rFrac * rFrac);
        const px = profileX + v * 12;
        const py = cy + r;
        if (r === -pipeRadius) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Parabolic profile base vertical line
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(profileX, pipeTop);
      ctx.lineTo(profileX, pipeBottom);
      ctx.stroke();

      // Velocity vectors from base line to curve
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      for (let r = -pipeRadius + 15; r < pipeRadius; r += 15) {
        const rFrac = r / pipeRadius;
        const v = vMax * (1 - rFrac * rFrac);
        ctx.beginPath();
        ctx.moveTo(profileX, cy + r);
        ctx.lineTo(profileX + v * 12, cy + r);
        ctx.stroke();
      }

      // Centerline dashed marker
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pipeX1, cy);
      ctx.lineTo(pipeX2, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Volumetric Flow Rate Q = (pi * R^4 * Delta P) / (8 * eta * L)
      const qFlow = ((Math.PI * (pipeRadius ** 4) * pressureDropDeltaP) / (8 * fluidViscosityEta * 1e6)).toFixed(2);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('HAGEN-POISEUILLE HYDRODYNAMICS', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Centerline Peak Velocity: ${vMax.toFixed(1)} mm/s`, 45, 72);
      ctx.fillText(`Volumetric Flow Rate Q: ${qFlow} mL/s`, 45, 90);
      ctx.fillText(`No-Slip Boundary: v(±R) = 0.00 mm/s`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1840 HAGEN-POISEUILLE LAMINAR FLOW · PARABOLIC VELOCITY PROFILE & NO-SLIP VISCOUS SHEAR', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [pressureDropDeltaP, fluidViscosityEta]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Droplet size={14} /> Driving Pressure Gradient (ΔP)</span>
            <span className="font-mono">{pressureDropDeltaP.toFixed(1)} kPa</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={pressureDropDeltaP}
            onChange={(e) => setPressureDropDeltaP(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Dynamic Viscosity (η)</span>
            <span className="font-mono">{fluidViscosityEta.toFixed(1)} mPa·s</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="4.0"
            step="0.1"
            value={fluidViscosityEta}
            onChange={(e) => setFluidViscosityEta(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
