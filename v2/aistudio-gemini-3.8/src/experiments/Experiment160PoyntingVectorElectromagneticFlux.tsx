import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment160PoyntingVectorElectromagneticFlux() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadResistance, setLoadResistance] = useState(50); // Ohms
  const [lineVoltage, setLineVoltage] = useState(120); // Volts DC

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let fluxPhase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.48;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      fluxPhase += 0.08;

      // Poynting Vector Energy Flow:
      // S = E x H (W/m^2)
      // Energy flows NOT through the inside of the copper wires, but through the electromagnetic
      // fields in the dielectric vacuum space SURROUNDING the wires into the resistive load!

      const sourceX = 140;
      const loadX = width - 140;
      const wireTopY = cy - 80;
      const wireBottomY = cy + 80;

      // Top Wire (+V rail, current flows right)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(sourceX, wireTopY - 4, loadX - sourceX, 8);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(sourceX, wireTopY - 4, loadX - sourceX, 8);

      // Bottom Wire (-V rail, current flows left)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(sourceX, wireBottomY - 4, loadX - sourceX, 8);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(sourceX, wireBottomY - 4, loadX - sourceX, 8);

      // DC Voltage Source on left
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sourceX - 35, wireTopY - 15, 35, wireBottomY - wireTopY + 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(sourceX - 35, wireTopY - 15, 35, wireBottomY - wireTopY + 30);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`DC SOURCE`, sourceX - 30, cy - 10);
      ctx.fillText(`${lineVoltage} V`, sourceX - 25, cy + 10);

      // Resistive Load on right
      ctx.fillStyle = '#334155';
      ctx.fillRect(loadX, wireTopY - 15, 35, wireBottomY - wireTopY + 30);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(loadX, wireTopY - 15, 35, wireBottomY - wireTopY + 30);
      ctx.fillStyle = '#f87171';
      ctx.font = '11px monospace';
      ctx.fillText(`LOAD R`, loadX + 5, cy - 10);
      ctx.fillText(`${loadResistance} Ω`, loadX + 5, cy + 10);

      // Electric Field E vectors (pointing downwards from +rail to -rail)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      for (let x = sourceX + 40; x < loadX - 20; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, wireTopY + 6);
        ctx.lineTo(x, wireBottomY - 6);
        ctx.stroke();
        // Downward arrowhead
        ctx.beginPath();
        ctx.moveTo(x - 3, wireBottomY - 12);
        ctx.lineTo(x, wireBottomY - 6);
        ctx.lineTo(x + 3, wireBottomY - 12);
        ctx.stroke();
      }

      // Poynting Vector S energy stream arrows flowing into load through surrounding space!
      // S = E x B points towards the right!
      const currentI = lineVoltage / loadResistance;
      const powerWatts = lineVoltage * currentI;

      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2;

      for (let gy = wireTopY + 16; gy < wireBottomY - 10; gy += 25) {
        for (let gx = sourceX + 25; gx < loadX - 10; gx += 50) {
          const moveX = (gx + fluxPhase * 25) % (loadX - sourceX - 30) + sourceX + 15;
          ctx.beginPath();
          ctx.moveTo(moveX, gy);
          ctx.lineTo(moveX + 18, gy);
          ctx.stroke();

          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(moveX + 14, gy - 3);
          ctx.lineTo(moveX + 20, gy);
          ctx.lineTo(moveX + 14, gy + 3);
          ctx.fill();
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('ELECTROMAGNETIC ENERGY FLUX PROBE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Current I = V/R: ${currentI.toFixed(2)} A`, 45, 72);
      ctx.fillText(`Transmitted Power: ${powerWatts.toFixed(1)} Watts`, 45, 90);
      ctx.fillText('Poynting Vector S: EXCLUSIVELY IN DIELECTRIC SPACE', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1884 JOHN HENRY POYNTING VECTOR S = E × H · ENERGY TRANSPORT THROUGH ELECTROMAGNETIC FIELDS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [loadResistance, lineVoltage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Zap size={14} /> Line Voltage</span>
            <span className="font-mono">{lineVoltage} V DC</span>
          </div>
          <input
            type="range"
            min="20"
            max="240"
            step="5"
            value={lineVoltage}
            onChange={(e) => setLineVoltage(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Load Resistance (R)</span>
            <span className="font-mono">{loadResistance} Ω</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={loadResistance}
            onChange={(e) => setLoadResistance(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
