import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment99QuantumHallPlateauResistance() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFieldTesla, setMagneticFieldTesla] = useState(8.5); // Tesla B
  const [temperatureMilliK, setTemperatureMilliK] = useState(25); // mK

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Millikelvin Cryostat dilution refrigerator chamber
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Coordinate axes for Hall Resistance R_xy (h / nu*e^2) vs Magnetic Field B
    const plotMargin = { top: 60, bottom: 80, left: 100, right: 60 };
    const plotW = width - plotMargin.left - plotMargin.right;
    const plotH = height - plotMargin.top - plotMargin.bottom;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = plotMargin.top + (i / 6) * plotH;
      ctx.beginPath();
      ctx.moveTo(plotMargin.left, y);
      ctx.lineTo(plotMargin.left + plotW, y);
      ctx.stroke();
    }

    // Von Klitzing constant R_K = 25812.807 ohm
    // Quantized Hall resistance plateaus: R_xy = R_K / nu (nu = 1, 2, 3, 4, ...)
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    const maxB = 14;
    for (let px = 0; px <= plotW; px++) {
      const bField = (px / plotW) * maxB;
      // Filling factor nu proportional to 1 / B
      const nuContinuous = 12 / (bField + 0.01);
      const nuQuantized = Math.max(1, Math.round(nuContinuous));

      // Thermal broadening transition function
      const thermalTransition = Math.min(1.0, temperatureMilliK / 400);
      const effectiveNu = (1 - thermalTransition) * nuQuantized + thermalTransition * nuContinuous;

      // Resistance norm
      const rNorm = 1 / effectiveNu;
      const py = plotMargin.top + plotH - rNorm * plotH * 0.9;

      if (px === 0) ctx.moveTo(plotMargin.left + px, py);
      else ctx.lineTo(plotMargin.left + px, py);
    }
    ctx.stroke();

    // Current Operating Point Cursor
    const cursorX = plotMargin.left + (magneticFieldTesla / maxB) * plotW;
    const currentNu = Math.max(1, Math.round(12 / magneticFieldTesla));
    const currentRNorm = 1 / currentNu;
    const cursorY = plotMargin.top + plotH - currentRNorm * plotH * 0.9;

    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, plotMargin.top);
    ctx.lineTo(cursorX, plotMargin.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Central Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 50px "Syne", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, plotMargin.top + 70);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `INTEGER QUANTUM HALL EFFECT · LANDAU FILLING FACTOR ν = ${currentNu} · R_H = ${(25812.8 / currentNu).toFixed(2)} Ω`,
      cx,
      plotMargin.top + 110
    );
    ctx.restore();
  }, [magneticFieldTesla, temperatureMilliK]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 099: KLAUS VON KLITZING INTEGER QUANTUM HALL EFFECT
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                2D Electron Gas Landau Levels & Topological Resistance Plateaus h/(ν·e²)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMagneticFieldTesla(8.5);
              setTemperatureMilliK(25);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Magnet</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Superconducting Magnet (Tesla):
              </span>
              <span className="text-amber-400 font-bold">{magneticFieldTesla.toFixed(1)} T</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="13.5"
              step="0.1"
              value={magneticFieldTesla}
              onChange={(e) => setMagneticFieldTesla(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Cryostat Temp (mK):</span>
              <span className="text-amber-400 font-bold">{temperatureMilliK} mK</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={temperatureMilliK}
              onChange={(e) => setTemperatureMilliK(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
