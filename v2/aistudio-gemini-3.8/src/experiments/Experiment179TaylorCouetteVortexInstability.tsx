import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment179TaylorCouetteVortexInstability() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [innerSpeedOmega, setInnerSpeedOmega] = useState(2.6); // Inner cylinder rotation speed
  const [gapWidthD, setGapWidthD] = useState(35); // Gap between cylinders

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
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      time += 0.03 * innerSpeedOmega;

      // Taylor-Couette Flow (G.I. Taylor, 1923):
      // Fluid sheared between two concentric rotating cylinders.
      // Rayleigh centrifugal instability criterion:
      // When Taylor number Ta > Ta_c ~ 1708, purely azimuthal flow breaks down into
      // stacked toroidal counter-rotating vortex pairs (Taylor vortex rolls)!

      const innerRadius = 70;
      const outerRadius = innerRadius + gapWidthD;
      const cylinderH = 280;

      // Draw Cross-Section of Annular Gap (left and right sides)
      const leftGapX1 = cx - outerRadius;
      const leftGapX2 = cx - innerRadius;
      const rightGapX1 = cx + innerRadius;
      const rightGapX2 = cx + outerRadius;

      // Outer cylinder stationary walls
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(leftGapX1 - 12, cy - cylinderH / 2, 12, cylinderH);
      ctx.fillRect(rightGapX2, cy - cylinderH / 2, 12, cylinderH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(leftGapX1 - 12, cy - cylinderH / 2, 12, cylinderH);
      ctx.strokeRect(rightGapX2, cy - cylinderH / 2, 12, cylinderH);

      // Inner rotating cylinder core
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(leftGapX2, cy - cylinderH / 2, rightGapX1 - leftGapX2, cylinderH);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(leftGapX2, cy - cylinderH / 2, rightGapX1 - leftGapX2, cylinderH);

      // Inner cylinder rotation chevron markers
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText(`INNER ROTOR (Ω = ${innerSpeedOmega.toFixed(1)})`, cx - 60, cy);

      // Stacked Toroidal Taylor Vortex Rolls in the Annular Gap:
      // Vortices pair up with alternating counter-rotation (clockwise, counter-clockwise)
      const vortexHeight = gapWidthD * 1.05;
      const numVortices = Math.floor(cylinderH / vortexHeight);

      for (let v = 0; v < numVortices; v++) {
        const vy = cy - cylinderH / 2 + (v + 0.5) * vortexHeight;
        const sign = v % 2 === 0 ? 1 : -1;

        // Left annular gap vortex
        ctx.strokeStyle = sign > 0 ? '#38bdf8' : '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse((leftGapX1 + leftGapX2) / 2, vy, gapWidthD * 0.42, vortexHeight * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Right annular gap vortex
        ctx.strokeStyle = sign > 0 ? '#ec4899' : '#38bdf8';
        ctx.beginPath();
        ctx.ellipse((rightGapX1 + rightGapX2) / 2, vy, gapWidthD * 0.42, vortexHeight * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Calculate Taylor Number: Ta = (4 * Omega^2 * R_in^4) / (nu^2 * d)
      const taylorNumber = Math.floor((innerSpeedOmega * innerSpeedOmega * 4200) / (gapWidthD * 0.05));

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('TAYLOR-COUETTE FLOW INSTABILITY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Taylor Number Ta: ${taylorNumber} (${taylorNumber > 1708 ? 'VORTEX ROLLS' : 'PURE COUETTE'})`, 45, 72);
      ctx.fillText(`Gap Aspect Ratio: d/R = ${(gapWidthD / innerRadius).toFixed(2)}`, 45, 90);
      ctx.fillText(`Stack Count: ${numVortices} Toroidal Vortex Rolls`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1923 G.I. TAYLOR HYDRODYNAMIC STABILITY · CENTRIFUGAL TOROIDAL VORTEX INSTABILITY', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [innerSpeedOmega, gapWidthD]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Wind size={14} /> Inner Cylinder Velocity (Ω)</span>
            <span className="font-mono">{innerSpeedOmega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.5"
            step="0.1"
            value={innerSpeedOmega}
            onChange={(e) => setInnerSpeedOmega(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Annular Gap Width (d)</span>
            <span className="font-mono">{gapWidthD} mm</span>
          </div>
          <input
            type="range"
            min="20"
            max="50"
            step="2"
            value={gapWidthD}
            onChange={(e) => setGapWidthD(Number(e.target.value))}
            className="accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
