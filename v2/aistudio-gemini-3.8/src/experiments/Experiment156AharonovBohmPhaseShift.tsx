import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment156AharonovBohmPhaseShift() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [solenoidFluxPhi, setSolenoidFluxPhi] = useState(1.5); // Flux in units of h/e
  const [electronEnergy, setElectronEnergy] = useState(50); // eV

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let wavePhase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      wavePhase += 0.12;

      // Aharonov-Bohm Effect:
      // An electron beam splits around an infinite solenoid with magnetic flux Phi.
      // Outside the solenoid, magnetic field B = 0 everywhere!
      // But magnetic vector potential A != 0:
      // Delta Phase = (q / hbar) * oint A . dl = (e / hbar) * Phi
      // Produces an observable interference fringe shift purely from the vector potential!

      // Solenoid cross section at center
      const solR = 42;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, solR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Magnetic flux B lines inside solenoid (strictly contained inside!)
      ctx.fillStyle = '#fef08a';
      ctx.font = '10px monospace';
      ctx.fillText('SOLENOID', cx - 24, cy - 8);
      ctx.fillText('B > 0 (INSIDE)', cx - 34, cy + 8);
      ctx.fillText(`Φ = ${solenoidFluxPhi.toFixed(2)} (h/e)`, cx - 38, cy + 24);

      // Outside Solenoid: B = 0, but Vector Potential A circles around
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      for (let r = solR + 25; r < 140; r += 25) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('OUTSIDE: B = 0, but A = (Φ/2πr) φ̂ ≠ 0', cx + 70, cy - 85);

      // Electron Emitter Source on left
      const srcX = cx - 180;
      const srcY = cy;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(srcX - 25, srcY - 15, 25, 30);
      ctx.strokeStyle = '#60a5fa';
      ctx.strokeRect(srcX - 25, srcY - 15, 25, 30);

      // Beam Upper Path 1 (passes above solenoid)
      // Phase shifts by + (e/2hbar)*Phi
      const abPhaseRad = solenoidFluxPhi * Math.PI;

      // Draw Upper Wave Packet
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(srcX, srcY);
      ctx.quadraticCurveTo(cx, cy - 90, cx + 180, cy);
      ctx.stroke();

      // Draw Lower Wave Packet
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(srcX, srcY);
      ctx.quadraticCurveTo(cx, cy + 90, cx + 180, cy);
      ctx.stroke();

      // Recombination Screen at cx + 220
      const scrX = width * 0.78;
      const scrY = 60;
      const scrW = 18;
      const scrH = 260;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(scrX, scrY, scrW, scrH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(scrX, scrY, scrW, scrH);

      // Interference Fringe Intensity on Screen:
      // I(y) = I_0 * cos^2( (pi * d * y) / (lambda * L) + Delta Phase / 2 )
      const fringeW = width * 0.16;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = scrY; y <= scrY + scrH; y += 2) {
        const normY = (y - (scrY + scrH / 2)) * 0.08;
        const phaseVal = normY + abPhaseRad / 2;
        const intensity = Math.cos(phaseVal) ** 2 * Math.exp(-normY * normY * 0.06);
        const fx = scrX + scrW + intensity * fringeW;

        if (y === scrY) ctx.moveTo(fx, y);
        else ctx.lineTo(fx, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText('INTERFERENCE FRINGES', scrX - 10, scrY - 14);
      ctx.fillText(`Δφ_AB = ${(abPhaseRad * (180 / Math.PI)).toFixed(1)}°`, scrX - 10, scrY + scrH + 20);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1959 AHARONOV-BOHM EFFECT · NON-LOCAL QUANTUM VECTOR POTENTIAL PHASE SHIFT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [solenoidFluxPhi, electronEnergy]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Solenoid Enclosed Flux (Φ / Φ_0)</span>
            <span className="font-mono">{solenoidFluxPhi.toFixed(2)} h/e</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.05"
            value={solenoidFluxPhi}
            onChange={(e) => setSolenoidFluxPhi(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Electron Kinetic Energy</span>
            <span className="font-mono">{electronEnergy} eV</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            value={electronEnergy}
            onChange={(e) => setElectronEnergy(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
