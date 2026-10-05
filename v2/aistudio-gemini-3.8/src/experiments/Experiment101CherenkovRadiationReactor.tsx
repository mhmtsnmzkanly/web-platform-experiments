import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment101CherenkovRadiationReactor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [corePowerMw, setCorePowerMw] = useState(15); // Megawatts thermal
  const [refractiveIndexN, setRefractiveIndexN] = useState(1.333); // Water n=1.333
  const [controlRodsInserted, setControlRodsInserted] = useState(40); // % inserted

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

      // Deep cooling pool water darkness
      ctx.fillStyle = '#020712';
      ctx.fillRect(0, 0, width, height);

      // Effective fission rate reduced by control rods
      const activePower = corePowerMw * (1 - controlRodsInserted / 100);
      // Cherenkov condition: particle speed v > c / n -> cos(theta_c) = 1 / (beta * n)
      const beta = 0.98; // Relativistic beta ~ 0.98c
      const cherenkovAngle = Math.acos(1 / (beta * refractiveIndexN));

      // Reactor core underwater glow bloom (intense characteristic 400nm electric blue)
      const glowRadius = Math.max(30, activePower * 14);
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, glowRadius * 2);
      grad.addColorStop(0, `rgba(56, 189, 248, ${Math.min(1, activePower * 0.08)})`);
      grad.addColorStop(0.3, `rgba(14, 165, 233, ${Math.min(0.8, activePower * 0.06)})`);
      grad.addColorStop(0.7, `rgba(2, 132, 199, ${Math.min(0.4, activePower * 0.03)})`);
      grad.addColorStop(1, 'rgba(2, 7, 18, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Relativistic electron tracks emitting Cherenkov shock wavefronts (Mach cones)
      const numElectrons = Math.floor(activePower * 4);
      ctx.lineWidth = 1;
      for (let i = 0; i < numElectrons; i++) {
        const seed = i * 47.1 + t;
        const ex = cx + (Math.sin(seed * 0.8) * glowRadius * 0.8);
        const ey = cy + (Math.cos(seed * 1.1) * glowRadius * 0.6);
        const heading = (i * 137.5 * Math.PI) / 180;

        // V-shaped shockwave cone
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.beginPath();
        const coneL = 25;
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - Math.cos(heading - cherenkovAngle) * coneL, ey - Math.sin(heading - cherenkovAngle) * coneL);
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - Math.cos(heading + cherenkovAngle) * coneL, ey - Math.sin(heading + cherenkovAngle) * coneL);
        ctx.stroke();

        // High-energy particle spark
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ex - 1, ey - 1, 2, 2);
      }

      // Fuel rod grid lattice structure behind water
      const gridW = 320;
      const gridH = 180;
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
      ctx.lineWidth = 1;
      for (let gx = cx - gridW / 2; gx <= cx + gridW / 2; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, cy - gridH / 2);
        ctx.lineTo(gx, cy + gridH / 2);
        ctx.stroke();
      }

      // Central Submerged Typographic Core "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 66px "Syne", sans-serif';

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = Math.min(30, activePower * 2.2);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#7dd3fc';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `CHERENKOV EMISSION ANGLE θ_c = ${(cherenkovAngle * (180 / Math.PI)).toFixed(1)}° · v > c/n (H2O n=${refractiveIndexN}) · CORE: ${activePower.toFixed(1)} MWth`,
        cx,
        cy + 75
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [corePowerMw, refractiveIndexN, controlRodsInserted]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Atom className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 101: NUCLEAR POOL CHERENKOV OPTICAL RADIATION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Pavel Cherenkov 1934 Relativistic Shockwave v &gt; c/n & 400nm Luminescence
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCorePowerMw(15);
              setControlRodsInserted(40);
              setRefractiveIndexN(1.333);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>SCRAM Reset</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Thermal Core Power:
              </span>
              <span className="text-sky-400 font-bold">{corePowerMw} MWth</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={corePowerMw}
              onChange={(e) => setCorePowerMw(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Control Rods Inserted:</span>
              <span className="text-sky-400 font-bold">{controlRodsInserted}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={controlRodsInserted}
              onChange={(e) => setControlRodsInserted(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Coolant Refractive Index n:</span>
              <span className="text-sky-400 font-bold">{refractiveIndexN.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="1.20"
              max="1.60"
              step="0.01"
              value={refractiveIndexN}
              onChange={(e) => setRefractiveIndexN(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
