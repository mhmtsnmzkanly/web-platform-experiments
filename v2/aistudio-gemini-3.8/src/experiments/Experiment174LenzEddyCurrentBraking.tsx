import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment174LenzEddyCurrentBraking() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tubeConductivity, setTubeConductivity] = useState<'copper' | 'aluminum' | 'plastic'>('copper');
  const [magnetStrengthB, setMagnetStrengthB] = useState(1.4); // Tesla

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Lenz's Law Eddy Current Dynamics:
    // A strong neodymium magnet falls down a conductive metal tube (copper/aluminum).
    // As it falls, changing magnetic flux induces circulating swirl eddy currents in the pipe walls.
    // By Lenz's law, these induced currents create an opposing magnetic field:
    // F_braking = - sigma * v * B^2 * Area.
    // The magnet quickly reaches a slow, floating terminal velocity!

    const conductivityMap = {
      copper: 5.96e7,
      aluminum: 3.77e7,
      plastic: 0,
    };

    let magnetY = 60;
    let magnetVy = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;

      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Terminal velocity and drag calculation
      const sigma = conductivityMap[tubeConductivity];
      const magneticBrakingConst = (sigma / 5.96e7) * (magnetStrengthB * magnetStrengthB) * 0.18;

      const g = 0.25;
      const dragForce = magnetVy * magneticBrakingConst;
      magnetVy += g - dragForce;
      magnetY += magnetVy;

      // Reset when reaching bottom
      if (magnetY > 370) {
        magnetY = 60;
        magnetVy = 0;
      }

      // Draw Transparent Conductive Tube cross-section
      const tubeTopY = 45;
      const tubeBottomY = 400;
      const tubeRadius = 45;

      const tubeCol = tubeConductivity === 'copper' ? '#b45309' : tubeConductivity === 'aluminum' ? '#94a3b8' : '#334155';

      // Left tube wall
      ctx.fillStyle = tubeCol;
      ctx.fillRect(cx - tubeRadius - 16, tubeTopY, 16, tubeBottomY - tubeTopY);
      // Right tube wall
      ctx.fillRect(cx + tubeRadius, tubeTopY, 16, tubeBottomY - tubeTopY);

      // Bore interior glow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(cx - tubeRadius, tubeTopY, tubeRadius * 2, tubeBottomY - tubeTopY);

      // Draw Falling Neodymium Magnet (Dipole N and S poles)
      const magW = tubeRadius * 1.6;
      const magH = 34;

      // North Pole (Red)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx - magW / 2, magnetY - magH / 2, magW, magH / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('N', cx - 4, magnetY - 4);

      // South Pole (Blue)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - magW / 2, magnetY, magW, magH / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('S', cx - 4, magnetY + magH / 2 - 4);

      // Circulating Eddy Current Rings in the copper walls!
      if (tubeConductivity !== 'plastic') {
        const numEddies = 4;
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        for (let e = -numEddies; e <= numEddies; e++) {
          if (e === 0) continue;
          const ey = magnetY + e * 16;
          if (ey >= tubeTopY && ey <= tubeBottomY) {
            ctx.beginPath();
            ctx.ellipse(cx, ey, tubeRadius + 8, 8, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#eab308';
      ctx.font = '10px monospace';
      ctx.fillText('LENZ’S LAW EDDY CURRENT BRAKE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Material: ${tubeConductivity.toUpperCase()} CYLINDER`, 45, 72);
      ctx.fillText(`Terminal Fall Velocity: ${(magnetVy * 10).toFixed(1)} cm/s`, 45, 90);
      ctx.fillText(`Lenz Opposing Force: ${(dragForce * 25).toFixed(1)} N`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1834 HEINRICH LENZ’S LAW · INDUCED EDDY CURRENT MAGNETIC BRAKING & TERMINAL FLOAT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [tubeConductivity, magnetStrengthB]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Tube Material Conductivity</span>
            <span className="font-mono uppercase">{tubeConductivity}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['copper', 'aluminum', 'plastic'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTubeConductivity(m)}
                className={`flex-1 py-1.5 text-xs font-mono rounded border transition-colors ${
                  tubeConductivity === m
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {m === 'copper' ? 'Copper (High σ)' : m === 'aluminum' ? 'Aluminum (Mid σ)' : 'Plastic (σ = 0)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Magnet size={14} /> Neodymium Magnet Flux (B)</span>
            <span className="font-mono">{magnetStrengthB.toFixed(1)} Tesla</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={magnetStrengthB}
            onChange={(e) => setMagnetStrengthB(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
