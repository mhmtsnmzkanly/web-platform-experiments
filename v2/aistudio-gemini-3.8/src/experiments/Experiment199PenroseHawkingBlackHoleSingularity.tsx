import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment199PenroseHawkingBlackHoleSingularity() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blackHoleMassM, setBlackHoleMassM] = useState(2.4); // Solar masses M
  const [conformalTime, setConformalTime] = useState(0.8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Penrose Singularity Theorem (Roger Penrose 1965, 2020 Nobel Prize in Physics):
    // Gravitational collapse of matter creates a closed "trapped surface":
    // A 2D surface where both outgoing and ingoing light rays have negative expansion (theta < 0).
    // Once a trapped surface forms, General Relativity guarantees that a spacetime singularity (r = 0)
    // is physically inevitable, independent of spherical symmetry!
    // Visualized via Penrose-Carter Conformal Diagram where light cones are at 45 degrees.

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.52;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Draw Penrose-Carter Conformal Diamond Diagram
      const diaW = 160;
      const diaH = 160;

      // Spacetime Boundary Triangles/Diamond
      const topSingularity = { x: cx, y: cy - diaH }; // r = 0 spacelike singularity (wavy jagged line)
      const futureNullInfinity = { x: cx + diaW, y: cy }; // I+
      const pastNullInfinity = { x: cx + diaW, y: cy + diaH }; // I-
      const centerOrigin = { x: cx - diaW, y: cy };

      // Singularity r = 0 (top boundary: jagged zigzag line)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = cx - diaW / 2; x <= cx + diaW / 2; x += 10) {
        const zig = (x % 20 === 0) ? -4 : 4;
        if (x === cx - diaW / 2) ctx.moveTo(x, cy - diaH + zig);
        else ctx.lineTo(x, cy - diaH + zig);
      }
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText('SPACELIKE SINGULARITY (r = 0)', cx - 75, cy - diaH - 12);

      // Event Horizon (r = 2M) at 45 degrees
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - diaW / 2, cy - diaH);
      ctx.lineTo(cx + diaW / 2, cy);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('EVENT HORIZON (r = 2M)', cx + 25, cy - diaH / 2);

      // Infalling Worldline with 45-degree Light Cones tipping inward!
      const infallPoints = [
        { x: cx + diaW * 0.4, y: cy + diaH * 0.7 },
        { x: cx + diaW * 0.25, y: cy + diaH * 0.3 },
        { x: cx + diaW * 0.1, y: cy - diaH * 0.1 },
        { x: cx, y: cy - diaH * 0.5 },
      ];

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < infallPoints.length; i++) {
        if (i === 0) ctx.moveTo(infallPoints[i].x, infallPoints[i].y);
        else ctx.lineTo(infallPoints[i].x, infallPoints[i].y);
      }
      ctx.stroke();

      // Light Cones tipping towards r = 0 inside horizon
      for (let pt of infallPoints) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // 45 degree bounds
        ctx.moveTo(pt.x - 12, pt.y - 12);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(pt.x + 12, pt.y - 12);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Trapped Surface Highlight Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(width * 0.68, 70, width * 0.28, 170);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(width * 0.68, 70, width * 0.28, 170);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('PENROSE TRAPPED SURFACE THEOREM', width * 0.68 + 12, 92);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Ingoing Light Expansion: θ_in < 0', width * 0.68 + 12, 118);
      ctx.fillText('Outgoing Light Expansion: θ_out < 0', width * 0.68 + 12, 138);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('SINGULARITY INEVITABILITY: GUARANTEED', width * 0.68 + 12, 168);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Nobel Prize in Physics 2020 (Roger Penrose)', width * 0.68 + 12, 198);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('GENERAL RELATIVITY SINGULARITY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Schwarzschild Radius: r_s = ${(blackHoleMassM * 2.95).toFixed(2)} km`, 45, 72);
      ctx.fillText(`Spacetime Incompleteness: Geodesic End`, 45, 90);
      ctx.fillText('Conformal Light Cones Tilted Past Horizon', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1965 ROGER PENROSE SINGULARITY THEOREM · TRAPPED SURFACES & INEVITABLE GRAVITATIONAL COLLAPSE', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [blackHoleMassM, conformalTime]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Black Hole Mass (M_☉)</span>
            <span className="font-mono">{blackHoleMassM.toFixed(1)} Solar Masses</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.2"
            value={blackHoleMassM}
            onChange={(e) => setBlackHoleMassM(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Infall Conformal Time</span>
            <span className="font-mono">{conformalTime.toFixed(2)} τ</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={conformalTime}
            onChange={(e) => setConformalTime(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
