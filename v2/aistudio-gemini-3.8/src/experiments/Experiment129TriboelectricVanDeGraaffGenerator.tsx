import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment129TriboelectricVanDeGraaffGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [beltSpeedRpm, setBeltSpeedRpm] = useState(1800);
  const [humidityPercent, setHumidityPercent] = useState(25); // Lower humidity = bigger sparks!
  const [sparkDischargeTrigger, setSparkDischargeTrigger] = useState(false);

  const triggerSpark = () => {
    setSparkDischargeTrigger(true);
    setTimeout(() => setSparkDischargeTrigger(false), 200);
  };

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

      // Dark physics lab
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, width, height);

      // Van de Graaff terminal potential calculation: V = Q / (4*pi*epsilon_0 * R)
      // Limited by dielectric breakdown of humid air (3 MV/m in dry air)
      const maxPotentialMv = (3.0 * (1 - humidityPercent / 120)).toFixed(2);

      // Large Polished Aluminum Dome Terminal Sphere at left
      const domeR = 90;
      const domeX = cx - 180;
      const domeY = cy - 20;

      // Insulating column column support
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(domeX - 25, domeY, 50, height - domeY);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(domeX - 25, domeY, 50, height - domeY);

      // Rubber charging belt moving inside column
      ctx.fillStyle = '#78350f';
      ctx.fillRect(domeX - 12, domeY + 10, 24, height - domeY);

      // Metallic top dome sphere
      const domeGrad = ctx.createRadialGradient(domeX - 20, domeY - 20, 10, domeX, domeY, domeR);
      domeGrad.addColorStop(0, '#f8fafc');
      domeGrad.addColorStop(0.5, '#94a3b8');
      domeGrad.addColorStop(1, '#334155');

      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.arc(domeX, domeY, domeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Grounded discharge sphere at right
      const groundR = 50;
      const groundX = cx + 180;
      const groundY = cy - 20;

      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(groundX, groundY, groundR, 0, Math.PI * 2);
      ctx.fill();

      // Giant violent electrostatic spark jumping between spheres
      if (sparkDischargeTrigger || Math.random() < 0.08) {
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(domeX + domeR, domeY);
        let curX = domeX + domeR;
        let curY = domeY;
        const steps = 14;
        for (let s = 1; s <= steps; s++) {
          const targetX = domeX + domeR + (s / steps) * (groundX - groundR - (domeX + domeR));
          const targetY = domeY + (Math.random() - 0.5) * 55;
          ctx.lineTo(targetX, targetY);
          curX = targetX;
          curY = targetY;
        }
        ctx.lineTo(groundX - groundR, groundY);
        ctx.stroke();
      }

      // Central Inscribed Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 52px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', cx, cy - 130);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `ROBERT J. VAN DE GRAAFF 1929 · TRIBOELECTRIC HIGH-VOLTAGE SPARK · V_MAX ~ ${maxPotentialMv} MV · HUMIDITY ${humidityPercent}%`,
        cx,
        height - 20
      );
      ctx.restore();

      t += 0.04;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [beltSpeedRpm, humidityPercent, sparkDischargeTrigger]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 129: TRIBOELECTRIC VAN DE GRAAFF ELECTROSTATIC GENERATOR
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1929 Dielectric Belt Charge Transport & 3,000,000V Atmospheric Spark Gap
              </p>
            </div>
          </div>
          <button
            onClick={triggerSpark}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Zap size={13} />
            <span>DISCHARGE SPARK</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Belt Motor RPM:
              </span>
              <span className="text-sky-400 font-bold">{beltSpeedRpm} RPM</span>
            </div>
            <input
              type="range"
              min="600"
              max="3000"
              step="100"
              value={beltSpeedRpm}
              onChange={(e) => setBeltSpeedRpm(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Ambient Relative Humidity:</span>
              <span className="text-sky-400 font-bold">{humidityPercent}% RH</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={humidityPercent}
              onChange={(e) => setHumidityPercent(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
