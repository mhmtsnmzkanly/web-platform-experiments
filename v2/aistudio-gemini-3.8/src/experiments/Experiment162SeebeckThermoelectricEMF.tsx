import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment162SeebeckThermoelectricEMF() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tHot, setTHot] = useState(480); // Kelvin
  const [tCold, setTCold] = useState(295); // Kelvin

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.52;

      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, width, height);

      // Seebeck Effect:
      // A temperature gradient Delta T = T_hot - T_cold across thermocouple junctions
      // creates an electromotive force (EMF) voltage:
      // V_Seebeck = S_AB * Delta T
      // For Chromel-Alumel (Type K), Seebeck coefficient S_AB ~ 41 uV/K
      const deltaT = Math.max(0, tHot - tCold);
      const seebeckCoeffUv = 41.2; // uV / K
      const vSeebeckMilliVolts = (seebeckCoeffUv * deltaT) / 1000;

      // Draw Thermocouple Junctions:
      // Hot Junction at (cx - 140, cy)
      // Cold Reference Junction at (cx + 60, cy)
      const hotJunc = { x: cx - 140, y: cy };
      const coldJunc = { x: cx + 40, y: cy };

      // Hot Source Block
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(hotJunc.x - 70, hotJunc.y - 60, 70, 120);
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.strokeRect(hotJunc.x - 70, hotJunc.y - 60, 70, 120);
      ctx.fillStyle = '#fdba74';
      ctx.font = '11px monospace';
      ctx.fillText(`HOT SOURCE`, hotJunc.x - 65, hotJunc.y - 35);
      ctx.fillText(`${tHot} K (${(tHot - 273.15).toFixed(0)}°C)`, hotJunc.x - 65, hotJunc.y - 15);

      // Cold Heat Sink Block
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(coldJunc.x, coldJunc.y - 60, 70, 120);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(coldJunc.x, coldJunc.y - 60, 70, 120);
      ctx.fillStyle = '#bae6fd';
      ctx.fillText(`COLD SINK`, coldJunc.x + 8, coldJunc.y - 35);
      ctx.fillText(`${tCold} K (${(tCold - 273.15).toFixed(0)}°C)`, coldJunc.x + 8, coldJunc.y - 15);

      // Metal A Leg (Chromel wire - gold/yellow)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hotJunc.x, hotJunc.y - 25);
      ctx.lineTo(coldJunc.x, coldJunc.y - 25);
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.fillText('CHROMEL WIRE (+)', cx - 65, hotJunc.y - 35);

      // Metal B Leg (Alumel wire - silver/gray)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hotJunc.x, hotJunc.y + 25);
      ctx.lineTo(coldJunc.x, coldJunc.y + 25);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('ALUMEL WIRE (-)', cx - 60, hotJunc.y + 40);

      // Hot Junction Weld Bead
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(hotJunc.x, hotJunc.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Digital Micro-Voltmeter on right
      const vmX = width * 0.72;
      const vmY = cy - 70;
      const vmW = width * 0.22;
      const vmH = 150;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(vmX, vmY, vmW, vmH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(vmX, vmY, vmW, vmH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('SEEBECK THERMO-EMF', vmX + 14, vmY + 24);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`+${vSeebeckMilliVolts.toFixed(2)} mV`, vmX + 14, vmY + 68);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`ΔT = ${deltaT.toFixed(0)} K Gradient`, vmX + 14, vmY + 100);
      ctx.fillText(`Type K: S = 41.2 μV/K`, vmX + 14, vmY + 120);

      // Lead wires connecting to voltmeter
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(coldJunc.x + 70, coldJunc.y - 25);
      ctx.lineTo(vmX, vmY + 45);
      ctx.moveTo(coldJunc.x + 70, coldJunc.y + 25);
      ctx.lineTo(vmX, vmY + 95);
      ctx.stroke();

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1821 THOMAS SEEBECK EFFECT · THERMOELECTRIC ELECTROMOTIVE FORCE GENERATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [tHot, tCold]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Hot Junction Temperature (T_hot)</span>
            <span className="font-mono">{tHot} K ({(tHot - 273.15).toFixed(0)}°C)</span>
          </div>
          <input
            type="range"
            min="300"
            max="750"
            value={tHot}
            onChange={(e) => setTHot(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Cold Sink Temperature (T_cold)</span>
            <span className="font-mono">{tCold} K ({(tCold - 273.15).toFixed(0)}°C)</span>
          </div>
          <input
            type="range"
            min="260"
            max="320"
            value={tCold}
            onChange={(e) => setTCold(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
