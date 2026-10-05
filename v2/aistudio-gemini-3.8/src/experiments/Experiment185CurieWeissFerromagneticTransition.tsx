import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

interface SpinSite {
  x: number;
  y: number;
  theta: number; // spin orientation
}

export default function Experiment185CurieWeissFerromagneticTransition() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureK, setTemperatureK] = useState(950); // Kelvin (Curie Temp of Iron T_c = 1043 K)
  const [externalFieldB, setExternalFieldB] = useState(0.2); // Tesla

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Curie-Weiss Law (1895 Pierre Curie, 1907 Pierre Weiss):
    // For T < T_c (1043 K for iron): Spontaneous magnetization M > 0 (Ferromagnetic state).
    // Thermal fluctuations are weaker than quantum exchange interaction J.
    // For T > T_c: Thermal fluctuations destroy long-range magnetic order;
    // susceptibility follows Curie-Weiss law: chi = C / (T - T_c) (Paramagnetic state).

    const curieTempK = 1043;
    const isFerro = temperatureK < curieTempK;
    const orderParamM = isFerro ? Math.sqrt(1 - temperatureK / curieTempK) : 0;

    const gridSize = 14;
    const sites: SpinSite[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        sites.push({
          x,
          y,
          theta: 0,
        });
      }
    }

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.38;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Thermal Monte Carlo fluctuations on spin orientations
      const thermalNoise = (temperatureK / curieTempK) * 1.8;

      const spacing = 18;
      const startX = cx - (gridSize * spacing) / 2;
      const startY = cy - (gridSize * spacing) / 2;

      // Draw Spin Lattice
      ctx.lineWidth = 1.8;
      for (let s of sites) {
        // Alignment towards external field (+Y or angle 0) modulated by spontaneous order M
        const alignedAngle = 0; // pointing right
        const randomAngle = (Math.random() - 0.5) * Math.PI * 2;
        const netAngle = isFerro ? randomAngle * (1 - orderParamM) : randomAngle;

        const px = startX + s.x * spacing;
        const py = startY + s.y * spacing;

        const arrowLen = 7;
        const x2 = px + Math.cos(netAngle) * arrowLen;
        const y2 = py + Math.sin(netAngle) * arrowLen;

        ctx.strokeStyle = isFerro ? '#ef4444' : '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = isFerro ? '#f87171' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spontaneous Magnetization M(T) Phase Diagram Curve on Right
      const plotX = width * 0.64;
      const plotY = 70;
      const plotW = width * 0.32;
      const plotH = 240;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(plotX, plotY, plotW, plotH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(plotX, plotY, plotW, plotH);

      // T_c vertical line at 1043 K
      const xTc = plotX + (curieTempK / 1400) * plotW;
      ctx.strokeStyle = '#eab308';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xTc, plotY);
      ctx.lineTo(xTc, plotY + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#eab308';
      ctx.font = '10px monospace';
      ctx.fillText('T_c = 1043 K', xTc - 35, plotY + 20);

      // M(T) curve: M ~ sqrt(1 - T/T_c)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = plotX; px <= xTc; px += 2) {
        const tVal = ((px - plotX) / plotW) * 1400;
        const mVal = Math.sqrt(Math.max(0, 1 - tVal / curieTempK));
        const py = plotY + plotH - mVal * (plotH * 0.75) - 20;
        if (px === plotX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Paramagnetic tail M = 0 for T > T_c
      ctx.beginPath();
      ctx.moveTo(xTc, plotY + plotH - 20);
      ctx.lineTo(plotX + plotW, plotY + plotH - 20);
      ctx.stroke();

      // Current operating point dot
      const curX = plotX + (temperatureK / 1400) * plotW;
      const curY = plotY + plotH - orderParamM * (plotH * 0.75) - 20;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Box
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('SPONTANEOUS MAGNETIZATION M(T)', plotX + 14, plotY + 45);
      ctx.fillStyle = isFerro ? '#ef4444' : '#38bdf8';
      ctx.fillText(`State: ${isFerro ? 'FERROMAGNETIC (ORDERED)' : 'PARAMAGNETIC (DISORDERED)'}`, plotX + 14, plotY + 65);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Spontaneous M: ${(orderParamM * 100).toFixed(1)}% Saturation`, plotX + 14, plotY + 85);

      // Bottom Typography
      ctx.fillStyle = isFerro ? '#ef4444' : '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1895 PIERRE CURIE & WEISS TRANSITION · SECOND-ORDER FERROMAGNETIC PHASE TRANSITION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temperatureK, externalFieldB]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Specimen Temperature (T)</span>
            <span className="font-mono">{temperatureK} K (Curie Pt T_c = 1043 K)</span>
          </div>
          <input
            type="range"
            min="300"
            max="1350"
            step="10"
            value={temperatureK}
            onChange={(e) => setTemperatureK(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> External Aligning Field (B)</span>
            <span className="font-mono">{externalFieldB.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={externalFieldB}
            onChange={(e) => setExternalFieldB(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
