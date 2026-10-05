import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment164RabiQuantumOscillations() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detuningDelta, setDetuningDelta] = useState(0.0); // Laser detuning Delta = omega - omega_0
  const [rabiDriveOmega, setRabiDriveOmega] = useState(2.4); // Rabi frequency Omega_R

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const probHistory: { pExcited: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.35;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070f';
      ctx.fillRect(0, 0, width, height);

      time += 0.04;

      // Rabi Quantum Oscillations in Two-Level Atom:
      // Generalized Rabi frequency: Omega_eff = sqrt(Omega_R^2 + Delta^2)
      // Probability of finding atom in excited state |e>:
      // P_e(t) = (Omega_R^2 / Omega_eff^2) * sin^2( (Omega_eff * t) / 2 )
      const omegaEff = Math.sqrt(rabiDriveOmega * rabiDriveOmega + detuningDelta * detuningDelta);
      const pExcited = ((rabiDriveOmega * rabiDriveOmega) / (omegaEff * omegaEff)) * (Math.sin((omegaEff * time) / 2) ** 2);
      const pGround = 1 - pExcited;

      probHistory.push({ pExcited });
      if (probHistory.length > 220) probHistory.shift();

      // Draw Bloch Sphere on left
      const sphereR = 95;

      // Bloch sphere grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.stroke();

      // Equator ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, sphereR, sphereR * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Polar axis (z-axis: North pole = |0>, South pole = |1>)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - sphereR - 15);
      ctx.lineTo(cx, cy + sphereR + 15);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('|0⟩ Ground', cx - 25, cy - sphereR - 22);
      ctx.fillStyle = '#ec4899';
      ctx.fillText('|1⟩ Excited', cx - 25, cy + sphereR + 30);

      // Bloch State Vector:
      // theta = 2 * arcsin(sqrt(P_e))
      // phi = phase precession
      const blochTheta = 2 * Math.asin(Math.sqrt(pExcited));
      const blochPhi = time * detuningDelta * 1.5;

      const vecX = sphereR * Math.sin(blochTheta) * Math.cos(blochPhi);
      const vecY = sphereR * Math.sin(blochTheta) * Math.sin(blochPhi) * 0.35 - sphereR * Math.cos(blochTheta);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + vecX, cy + vecY);
      ctx.stroke();

      // Bloch vector tip
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + vecX, cy + vecY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Time-domain Rabi Population Oscillation Chart on Right
      const chartX = width * 0.62;
      const chartY = 70;
      const chartW = width * 0.34;
      const chartH = 240;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(chartX, chartY, chartW, chartH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(chartX, chartY, chartW, chartH);

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let g = 1; g <= 3; g++) {
        ctx.beginPath();
        ctx.moveTo(chartX, chartY + (chartH * g) / 4);
        ctx.lineTo(chartX + chartW, chartY + (chartH * g) / 4);
        ctx.stroke();
      }

      // Draw P_e(t) trajectory
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < probHistory.length; i++) {
        const px = chartX + (i / 220) * chartW;
        const py = chartY + chartH - probHistory[i].pExcited * (chartH - 20) - 10;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('EXCITED STATE POPULATION P_e(t)', chartX + 14, chartY + 22);
      ctx.fillText(`P_e = ${(pExcited * 100).toFixed(1)}%`, chartX + 14, chartY + 42);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Rabi Frequency Ω_eff = ${omegaEff.toFixed(2)} rad/s`, chartX + 14, chartY + 62);

      // Bottom Typography
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1937 ISIDOR RABI OSCILLATIONS · TWO-LEVEL QUANTUM SYSTEM COHERENT LASER DRIVE', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [detuningDelta, rabiDriveOmega]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Laser Rabi Driving Coupling (Ω_R)</span>
            <span className="font-mono">{rabiDriveOmega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="5.0"
            step="0.2"
            value={rabiDriveOmega}
            onChange={(e) => setRabiDriveOmega(Number(e.target.value))}
            className="accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Laser Detuning (Δ = ω - ω_0)</span>
            <span className="font-mono">{detuningDelta.toFixed(1)} rad/s ({detuningDelta === 0 ? 'On Resonance' : 'Off Resonance'})</span>
          </div>
          <input
            type="range"
            min="-3.0"
            max="3.0"
            step="0.2"
            value={detuningDelta}
            onChange={(e) => setDetuningDelta(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
