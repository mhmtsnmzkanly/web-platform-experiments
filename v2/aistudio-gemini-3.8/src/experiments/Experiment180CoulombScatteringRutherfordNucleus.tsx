import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

interface AlphaTrajectory {
  impactB: number; // Impact parameter b
  pts: { x: number; y: number }[];
  deflected: boolean;
}

export default function Experiment180CoulombScatteringRutherfordNucleus() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [goldChargeZ, setGoldChargeZ] = useState(79); // Gold Z = 79
  const [alphaEnergyMev, setAlphaEnergyMev] = useState(5.5); // Alpha kinetic energy in MeV

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Rutherford Scattering Formula (1911):
    // Repulsive Coulomb potential: V(r) = (1 / 4*pi*epsilon_0) * (2*Z*e^2 / r)
    // Scattering angle: cot(theta / 2) = (2 * b * E_alpha) / (2 * Z * e^2)
    // Most alpha particles pass straight through with small deflection;
    // but rare direct hits with small impact parameter b recoil backward (> 90°)!

    const trajectories: AlphaTrajectory[] = [];
    const numAlphas = 18;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Gold Nucleus (Massive positive point charge at center)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = '10px monospace';
      ctx.fillText(`GOLD NUCLEUS (Z = ${goldChargeZ})`, cx - 60, cy - 20);

      // Spawn incoming alpha particles from left with various impact parameters b
      if (trajectories.length === 0) {
        for (let i = 0; i < numAlphas; i++) {
          const impactB = (i - numAlphas / 2) * 14;
          let px = 40;
          let py = cy + impactB;
          let vx = 5.0;
          let vy = 0.0;

          const pts = [{ x: px, y: py }];
          const dt = 0.4;

          for (let step = 0; step < 220; step++) {
            const rx = px - cx;
            const ry = py - cy;
            const distSq = rx * rx + ry * ry + 10;
            const dist = Math.sqrt(distSq);

            // Repulsive Coulomb force F = k * (2 * Z) / r^2
            const fCou = (goldChargeZ * 12) / distSq;
            const ax = fCou * (rx / dist);
            const ay = fCou * (ry / dist);

            vx += ax * dt;
            vy += ay * dt;
            px += vx * dt;
            py += vy * dt;

            pts.push({ x: px, y: py });
          }

          trajectories.push({
            impactB,
            pts,
            deflected: Math.abs(impactB) < 18,
          });
        }
      }

      // Draw Alpha trajectories
      for (let trk of trajectories) {
        ctx.strokeStyle = trk.deflected ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = trk.deflected ? 2.5 : 1.2;
        ctx.beginPath();
        for (let i = 0; i < trk.pts.length; i++) {
          if (i === 0) ctx.moveTo(trk.pts[i].x, trk.pts[i].y);
          else ctx.lineTo(trk.pts[i].x, trk.pts[i].y);
        }
        ctx.stroke();
      }

      // Draw Gold Foil Target boundary
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 40);
      ctx.lineTo(cx, height - 60);
      ctx.stroke();
      ctx.setLineDash([]);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('RUTHERFORD ALPHA SCATTERING', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Target Nucleus: Gold Foil (Z = ${goldChargeZ})`, 45, 72);
      ctx.fillText(`Alpha Energy: ${alphaEnergyMev.toFixed(1)} MeV (v ~ 1.6×10⁷ m/s)`, 45, 90);
      ctx.fillText('Discovery: Dense Central Positive Nucleus', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1911 ERNEST RUTHERFORD ALPHA SCATTERING · DISCOVERY OF THE DENSE ATOMIC NUCLEUS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [goldChargeZ, alphaEnergyMev]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Atom size={14} /> Target Nuclear Charge (Z)</span>
            <span className="font-mono">Z = {goldChargeZ} ({goldChargeZ === 79 ? 'Gold' : goldChargeZ === 47 ? 'Silver' : 'Lead'})</span>
          </div>
          <input
            type="range"
            min="29"
            max="82"
            step="1"
            value={goldChargeZ}
            onChange={(e) => setGoldChargeZ(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Alpha Particle Energy</span>
            <span className="font-mono">{alphaEnergyMev.toFixed(1)} MeV</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="8.5"
            step="0.5"
            value={alphaEnergyMev}
            onChange={(e) => setAlphaEnergyMev(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
