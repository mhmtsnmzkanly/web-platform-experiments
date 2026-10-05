import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment133PeltierThermoelectricHeatPump() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAmps, setCurrentAmps] = useState(4.2); // Amperes DC
  const [reversePolarity, setReversePolarity] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Peltier effect: Q = Pi * I * t
    // One side absorbs heat (cold side, down to -15°C with frost), opposite side ejects heat (hot side, up to +70°C)
    const effectiveI = reversePolarity ? -currentAmps : currentAmps;
    const topTempC = (25 - effectiveI * 8.5).toFixed(1);
    const bottomTempC = (25 + effectiveI * 8.5).toFixed(1);

    // Ceramic Peltier Module Sandwich
    const moduleW = 380;
    const moduleH = 120;
    const modX = cx - moduleW / 2;
    const modY = cy - moduleH / 2;

    // Top Ceramic Plate
    const topColor = Number(topTempC) < 15 ? '#38bdf8' : '#f97316';
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(modX, modY, moduleW, 16);
    ctx.strokeStyle = topColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(modX, modY, moduleW, 16);

    // Bottom Ceramic Plate
    const bottomColor = Number(bottomTempC) < 15 ? '#38bdf8' : '#f97316';
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(modX, modY + moduleH - 16, moduleW, 16);
    ctx.strokeStyle = bottomColor;
    ctx.strokeRect(modX, modY + moduleH - 16, moduleW, 16);

    // Bismuth Telluride (Bi2Te3) P-N Semiconductor Couples
    const numCouples = 18;
    const coupleW = moduleW / (numCouples * 2);
    for (let i = 0; i < numCouples; i++) {
      // P-type pellet
      ctx.fillStyle = '#64748b';
      ctx.fillRect(modX + i * coupleW * 2 + 4, modY + 16, coupleW - 4, moduleH - 32);

      // N-type pellet
      ctx.fillStyle = '#475569';
      ctx.fillRect(modX + i * coupleW * 2 + coupleW + 4, modY + 16, coupleW - 4, moduleH - 32);
    }

    // Thermal Temperature Readouts
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = topColor;
    ctx.textAlign = 'center';
    ctx.fillText(`TOP CERAMIC FACE: ${topTempC}°C (${Number(topTempC) < 0 ? 'FROST CONDENSATION' : 'COOLED'})`, cx, modY - 14);

    ctx.fillStyle = bottomColor;
    ctx.fillText(`BOTTOM CERAMIC FACE: ${bottomTempC}°C (${Number(bottomTempC) > 50 ? 'HOT HEAT SINK' : 'WARMED'})`, cx, modY + moduleH + 24);

    // Center Inscribed Specimen "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 50px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = topColor;
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, cy - 130);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `JEAN CHARLES PELTIER 1834 · SOLID-STATE THERMOELECTRIC EFFECT · CURRENT I = ${currentAmps.toFixed(1)} A DC · BISMUTH TELLURIDE P-N MATRIX`,
      cx,
      height - 20
    );
    ctx.restore();
  }, [currentAmps, reversePolarity]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 133: PELTIER SOLID-STATE THERMOELECTRIC HEAT PUMP
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1834 Jean Charles Peltier Semiconductor Bismuth Telluride (Bi₂Te₃) Matrix
              </p>
            </div>
          </div>
          <button
            onClick={() => setReversePolarity(!reversePolarity)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              reversePolarity
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <RotateCcw size={13} />
            <span>{reversePolarity ? 'POLARITY REVERSED' : 'NORMAL POLARITY'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> DC Drive Current:
              </span>
              <span className="text-amber-400 font-bold">{currentAmps.toFixed(1)} Amperes</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={currentAmps}
              onChange={(e) => setCurrentAmps(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Heat Pump Status:</span>
              <span className="text-amber-400 font-bold">Bi₂Te₃ Active</span>
            </div>
            <div className="text-stone-400 text-xs font-mono">
              Adjust current to increase Peltier thermal differential ΔT across module plates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
