import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment127RayleighBenardConvectionCells() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rayleighNumberRa, setRayleighNumberRa] = useState(2400); // Critical Ra_c ~ 1708
  const [temperatureDiffDeltaT, setTemperatureDiffDeltaT] = useState(35); // °C

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark silicone oil thermal basin
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Rayleigh-Bénard instability: Ra = g * beta * deltaT * d^3 / (nu * alpha)
      // When Ra > 1708, buoyant heat overcomes viscous dissipation, forming hexagonal roll cells
      const isConvecting = rayleighNumberRa >= 1708;
      const cellRadius = 40;

      // Draw hexagonal Bénard convection roll cells across the plate
      const cols = Math.floor(width / (cellRadius * 1.7)) + 1;
      const rows = Math.floor(height / (cellRadius * 1.5)) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offsetX = (r % 2 === 0 ? 0 : cellRadius * 0.85);
          const px = c * cellRadius * 1.7 + offsetX;
          const py = r * cellRadius * 1.5;

          // Thermal circulation pulse
          const circ = Math.sin(t * 1.5 + c * 0.5 + r * 0.8);

          // Draw hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const hx = px + Math.cos(angle) * cellRadius;
            const hy = py + Math.sin(angle) * cellRadius;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();

          if (isConvecting) {
            // Rising hot central plume (warm amber) with descending cold borders (blue)
            ctx.fillStyle = circ > 0 ? '#b45309' : '#1e3a8a';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1;
          } else {
            // Pure conductive flat state (no rolls)
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 0.5;
          }

          ctx.fill();
          ctx.stroke();
        }
      }

      // Central Stenciled Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 58px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#06070a';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = isConvecting ? '#f59e0b' : '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `HENRI BÉNARD 1900 / LORD RAYLEIGH 1916 · RAYLEIGH NUMBER Ra = ${rayleighNumberRa} (${
          isConvecting ? 'CRITICAL CONVECTION INSTABILITY ENGAGED: HEXAGONAL ROLLS' : 'SUB-CRITICAL Ra < 1708: PURE CONDUCTION'
        })`,
        cx,
        height - 20
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [rayleighNumberRa, temperatureDiffDeltaT]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 127: RAYLEIGH-BÉNARD HEXAGONAL CONVECTION CELLS
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Thermal Buoyancy Instability & Self-Organizing Hexagonal Fluid Vortex Columns
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRayleighNumberRa(2400);
              setTemperatureDiffDeltaT(35);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Heat Bath</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Rayleigh Number (Ra):
              </span>
              <span className="text-amber-400 font-bold">{rayleighNumberRa} (Ra_c = 1708)</span>
            </div>
            <input
              type="range"
              min="1000"
              max="4500"
              step="50"
              value={rayleighNumberRa}
              onChange={(e) => setRayleighNumberRa(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Plate Temperature ΔT:</span>
              <span className="text-amber-400 font-bold">{temperatureDiffDeltaT}°C</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={temperatureDiffDeltaT}
              onChange={(e) => setTemperatureDiffDeltaT(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
