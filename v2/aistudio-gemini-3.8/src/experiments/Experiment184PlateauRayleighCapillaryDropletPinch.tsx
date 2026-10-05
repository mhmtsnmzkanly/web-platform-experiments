import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment184PlateauRayleighCapillaryDropletPinch() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [surfaceTensionGamma, setSurfaceTensionGamma] = useState(72.8); // mN/m (water)
  const [jetFlowSpeed, setJetFlowSpeed] = useState(2.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.48;

      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, width, height);

      time += 0.04 * jetFlowSpeed;

      // Plateau-Rayleigh Capillary Instability:
      // A falling cylindrical jet of liquid minimizes surface area under surface tension gamma.
      // Perturbations with wavelength lambda > 2 * pi * R_0 are unstable (growth rate omega > 0).
      // The fastest-growing mode (lambda ~ 9.01 * R_0) pinches the continuous jet into
      // discrete spherical droplets, accompanied by tiny satellite droplets!

      const nozzleX = 80;
      const nozzleR = 24;

      // Draw Nozzle Emitter
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(nozzleX - 40, cy - nozzleR - 10, 40, (nozzleR + 10) * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(nozzleX - 40, cy - nozzleR - 10, 40, (nozzleR + 10) * 2);

      // Jet stream profile from nozzle to pinch-off
      const pinchStartX = nozzleX + 160;
      const dropRegionX = nozzleX + 320;

      // Continuous necking jet
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(nozzleX, cy - nozzleR);

      // Upper contour
      for (let x = nozzleX; x <= pinchStartX; x += 3) {
        const dist = (x - nozzleX) / (pinchStartX - nozzleX);
        const wave = Math.sin((x * 0.05 - time * 2)) * dist * 14;
        const currentR = Math.max(2, nozzleR - dist * 8 + wave);
        ctx.lineTo(x, cy - currentR);
      }

      // Lower contour (return back)
      for (let x = pinchStartX; x >= nozzleX; x -= 3) {
        const dist = (x - nozzleX) / (pinchStartX - nozzleX);
        const wave = Math.sin((x * 0.05 - time * 2)) * dist * 14;
        const currentR = Math.max(2, nozzleR - dist * 8 + wave);
        ctx.lineTo(x, cy + currentR);
      }
      ctx.closePath();
      ctx.fill();

      // Pinched-off spherical droplets moving to the right
      const dropletSpacing = 68;
      const numDroplets = 6;

      for (let d = 0; d < numDroplets; d++) {
        const dx = pinchStartX + ((d * dropletSpacing + time * 35) % (width - pinchStartX));
        if (dx < width - 40) {
          // Main primary spherical droplet
          const dropR = 15;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(dx, cy, dropR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Tiny satellite droplet (characteristic of nonlinear capillary pinch-off)
          const satX = dx - dropletSpacing * 0.45;
          if (satX > pinchStartX) {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(satX, cy, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('PLATEAU-RAYLEIGH CAPILLARY PINCH', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Surface Tension γ: ${surfaceTensionGamma.toFixed(1)} mN/m (Water)`, 45, 72);
      ctx.fillText(`Rayleigh Criterion: λ_opt ~ 9.014·R_0`, 45, 90);
      ctx.fillText('Instability: Laplace Pressure Gradient Pinch', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1873 PLATEAU-RAYLEIGH INSTABILITY · CAPILLARY SURFACE TENSION DRIVEN LIQUID JET PINCH-OFF', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [surfaceTensionGamma, jetFlowSpeed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Droplet size={14} /> Surface Tension (γ)</span>
            <span className="font-mono">{surfaceTensionGamma.toFixed(1)} mN/m</span>
          </div>
          <input
            type="range"
            min="25.0"
            max="120.0"
            step="1.0"
            value={surfaceTensionGamma}
            onChange={(e) => setSurfaceTensionGamma(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Jet Flow Velocity</span>
            <span className="font-mono">{jetFlowSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.0"
            step="0.1"
            value={jetFlowSpeed}
            onChange={(e) => setJetFlowSpeed(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
