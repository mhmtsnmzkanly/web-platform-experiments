import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment171SuperfluidVortexLattice() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angularVelocityOmega, setAngularVelocityOmega] = useState(2.2); // Superfluid rotation speed
  const [healingLengthXi, setHealingLengthXi] = useState(6); // Core radius (healing length)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rot = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      rot += 0.008 * angularVelocityOmega;

      // Superfluid Helium-4 / BEC Quantized Vortices:
      // In a superfluid, curl(v) = 0 everywhere except at singular 1D vortex filaments!
      // Each vortex carries exactly one quantum of circulation: kappa = h / m.
      // Under uniform rotation Omega, vortices self-organize into a regular triangular Abrikosov-Feynman lattice!
      // Feynman's rule: areal vortex density n_v = 2 * m * Omega / h.

      const containerRadius = 160;

      // Cryogenic Helium-4 bucket boundary
      ctx.fillStyle = '#082f49';
      ctx.beginPath();
      ctx.arc(cx, cy, containerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Number of quantized vortex rings in triangular lattice depends on Omega
      const numRings = Math.floor(angularVelocityOmega * 3);
      const latticeSpacing = 32 / Math.sqrt(angularVelocityOmega + 0.1);

      // Generate triangular Abrikosov lattice points
      const vortexPoints: { x: number; y: number }[] = [];

      for (let q = -numRings; q <= numRings; q++) {
        for (let r = -numRings; r <= numRings; r++) {
          const vx = (q + r * 0.5) * latticeSpacing;
          const vy = (r * Math.sqrt(3) / 2) * latticeSpacing;
          const dist = Math.hypot(vx, vy);

          if (dist < containerRadius - 15) {
            // Rotate with overall container
            const rx = vx * Math.cos(rot) - vy * Math.sin(rot);
            const ry = vx * Math.sin(rot) + vy * Math.cos(rot);
            vortexPoints.push({ x: cx + rx, y: cy + ry });
          }
        }
      }

      // Draw superfluid density depletion cores (healing length xi)
      for (let pt of vortexPoints) {
        // Circulation flow phase gradient ring
        const coreGrad = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, healingLengthXi * 2.5);
        coreGrad.addColorStop(0, '#06070e'); // zero density at singularity
        coreGrad.addColorStop(0.5, '#0284c7');
        coreGrad.addColorStop(1, 'rgba(8, 47, 73, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, healingLengthXi * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Vortex singularity core pin
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('SUPERFLUID QUANTIZED CIRCULATION', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Quantized Vortex Count: ${vortexPoints.length} Filaments`, 45, 72);
      ctx.fillText(`Circulation Quantum: κ = h/m = 9.97×10⁻⁸ m²/s`, 45, 90);
      ctx.fillText(`Lattice: Abrikosov Triangular Array`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1955 RICHARD FEYNMAN QUANTIZED SUPERFLUID VORTICES · HE-4 CONDENSATE ABRIKOSOV LATTICE', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [angularVelocityOmega, healingLengthXi]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Cryogenic Rotation Velocity (Ω)</span>
            <span className="font-mono">{angularVelocityOmega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.0"
            step="0.1"
            value={angularVelocityOmega}
            onChange={(e) => setAngularVelocityOmega(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Healing Length Core (ξ)</span>
            <span className="font-mono">{healingLengthXi} px</span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            value={healingLengthXi}
            onChange={(e) => setHealingLengthXi(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
