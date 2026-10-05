import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment182WiedemannFranzThermalConductivity() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [metalSpecimen, setMetalSpecimen] = useState<'copper' | 'silver' | 'aluminum'>('copper');
  const [ambientTempK, setAmbientTempK] = useState(293); // Kelvin

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Wiedemann-Franz Law (1853):
    // In metals, the ratio of thermal conductivity kappa to electrical conductivity sigma
    // is directly proportional to absolute temperature T:
    // kappa / (sigma * T) = L (Lorenz Number)
    // Theoretical Sommerfeld quantum value: L = (pi^2 / 3) * (k_B / e)^2 = 2.44 x 10^-8 W*Ohm / K^2.

    const metalProps = {
      copper: { sigma: 5.96e7, kappa: 401, color: '#b45309' },
      silver: { sigma: 6.30e7, kappa: 429, color: '#94a3b8' },
      aluminum: { sigma: 3.77e7, kappa: 237, color: '#cbd5e1' },
    };

    const cur = metalProps[metalSpecimen];
    const empiricalLorenz = cur.kappa / (cur.sigma * ambientTempK);
    const theoreticalLorenz = 2.44e-8;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Metal Rod Specimen
      const rodW = 320;
      const rodH = 45;
      ctx.fillStyle = cur.color;
      ctx.fillRect(cx - rodW / 2, cy - rodH / 2, rodW, rodH);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - rodW / 2, cy - rodH / 2, rodW, rodH);

      // Free Electron Fermi Gas moving inside the metal rod
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 45; i++) {
        const ex = cx - rodW / 2 + 10 + ((Date.now() * 0.05 + i * 28) % (rodW - 20));
        const ey = cy - rodH / 2 + 8 + (i % 6) * 5;
        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Heat flow arrows (Thermal Conductivity kappa)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      for (let x = cx - rodW / 2 + 20; x < cx + rodW / 2 - 20; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, cy - rodH / 2 - 20);
        ctx.lineTo(x + 35, cy - rodH / 2 - 20);
        ctx.stroke();
      }
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText(`HEAT FLUX q = -κ·∇T (κ = ${cur.kappa} W/m·K)`, cx - 100, cy - rodH / 2 - 32);

      // Electric Current flow arrows (Electrical Conductivity sigma)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let x = cx - rodW / 2 + 20; x < cx + rodW / 2 - 20; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, cy + rodH / 2 + 20);
        ctx.lineTo(x + 35, cy + rodH / 2 + 20);
        ctx.stroke();
      }
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`CHARGE FLUX J = σ·E (σ = ${(cur.sigma / 1e7).toFixed(2)}×10⁷ S/m)`, cx - 100, cy + rodH / 2 + 38);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 280, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 280, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('WIEDEMANN-FRANZ LORENZ RATIO', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Material: ${metalSpecimen.toUpperCase()} at ${ambientTempK} K`, 45, 72);
      ctx.fillText(`Lorenz No. L = κ/(σ·T): ${(empiricalLorenz * 1e8).toFixed(2)}×10⁻⁸ W·Ω/K²`, 45, 90);
      ctx.fillText(`Sommerfeld Constant L_0: 2.44×10⁻⁸ W·Ω/K²`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1853 WIEDEMANN-FRANZ LAW · CONSTANT RATIO OF THERMAL TO ELECTRICAL CONDUCTION IN FERMI METALS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [metalSpecimen, ambientTempK]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Metal Specimen</span>
            <span className="font-mono uppercase">{metalSpecimen}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['copper', 'silver', 'aluminum'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetalSpecimen(m)}
                className={`flex-1 py-1.5 text-xs font-mono rounded border transition-colors ${
                  metalSpecimen === m
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Specimen Temperature</span>
            <span className="font-mono">{ambientTempK} K ({(ambientTempK - 273.15).toFixed(0)}°C)</span>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="10"
            value={ambientTempK}
            onChange={(e) => setAmbientTempK(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
