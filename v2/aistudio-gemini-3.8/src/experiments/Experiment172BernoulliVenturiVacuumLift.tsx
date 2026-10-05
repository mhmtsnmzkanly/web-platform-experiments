import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment172BernoulliVenturiVacuumLift() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inletFlowVelocity, setInletFlowVelocity] = useState(2.2); // m/s
  const [constrictionRatio, setConstrictionRatio] = useState(0.4); // Throat diameter ratio d_throat / d_inlet

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.45;

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      time += 0.05 * inletFlowVelocity;

      // Bernoulli Continuity & Pressure Equation:
      // Mass conservation: A1 * v1 = A2 * v2 => v_throat = v_inlet / constrictionRatio
      // Energy conservation: P1 + 0.5 * rho * v1^2 = P2 + 0.5 * rho * v2^2
      // Pressure drop in throat: Delta P = 0.5 * rho * (v_throat^2 - v_inlet^2)
      // Hydrostatic manometer height difference: h = Delta P / (rho_fluid * g)

      const vThroat = inletFlowVelocity / constrictionRatio;
      const deltaP = 0.5 * 1.225 * (vThroat * vThroat - inletFlowVelocity * inletFlowVelocity);
      const manometerDropH = deltaP * 12;

      // Venturi Tube Profile geometry
      const x1 = 60;
      const xThroatStart = width * 0.42;
      const xThroatEnd = width * 0.58;
      const x2 = width - 60;

      const inletRadius = 75;
      const throatRadius = inletRadius * constrictionRatio;

      // Upper Wall Path
      ctx.beginPath();
      ctx.moveTo(x1, cy - inletRadius);
      ctx.lineTo(xThroatStart - 40, cy - inletRadius);
      ctx.quadraticCurveTo(xThroatStart, cy - throatRadius, xThroatStart + 20, cy - throatRadius);
      ctx.lineTo(xThroatEnd - 20, cy - throatRadius);
      ctx.quadraticCurveTo(xThroatEnd, cy - throatRadius, xThroatEnd + 40, cy - inletRadius);
      ctx.lineTo(x2, cy - inletRadius);
      ctx.lineTo(x2, cy - inletRadius - 20);
      ctx.lineTo(x1, cy - inletRadius - 20);
      ctx.closePath();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lower Wall Path
      ctx.beginPath();
      ctx.moveTo(x1, cy + inletRadius);
      ctx.lineTo(xThroatStart - 40, cy + inletRadius);
      ctx.quadraticCurveTo(xThroatStart, cy + throatRadius, xThroatStart + 20, cy + throatRadius);
      ctx.lineTo(xThroatEnd - 20, cy + throatRadius);
      ctx.quadraticCurveTo(xThroatEnd, cy + throatRadius, xThroatEnd + 40, cy + inletRadius);
      ctx.lineTo(x2, cy + inletRadius);
      ctx.lineTo(x2, cy + inletRadius + 20);
      ctx.lineTo(x1, cy + inletRadius + 20);
      ctx.closePath();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Flow streamlines inside Venturi tube
      const numStreamlines = 9;
      for (let s = 1; s < numStreamlines; s++) {
        const frac = (s / numStreamlines) * 2 - 1; // -1 to +1

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let x = x1; x <= x2; x += 10) {
          let currentR = inletRadius;
          if (x >= xThroatStart - 40 && x <= xThroatEnd + 40) {
            if (x < xThroatStart + 20) {
              const blend = (x - (xThroatStart - 40)) / 60;
              currentR = inletRadius - (inletRadius - throatRadius) * (0.5 - 0.5 * Math.cos(blend * Math.PI));
            } else if (x > xThroatEnd - 20) {
              const blend = (x - (xThroatEnd - 20)) / 60;
              currentR = throatRadius + (inletRadius - throatRadius) * (0.5 - 0.5 * Math.cos(blend * Math.PI));
            } else {
              currentR = throatRadius;
            }
          }
          const y = cy + frac * currentR * 0.9;
          if (x === x1) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Vertical Manometer Tubes:
      // Tube 1 at Inlet (x = 180)
      // Tube 2 at Constriction Throat (x = width / 2)
      const mano1X = 180;
      const mano2X = width / 2;
      const manoH = 120;

      // Manometer glass tubes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(mano1X - 8, cy - inletRadius - manoH, 16, manoH);
      ctx.fillRect(mano2X - 8, cy - throatRadius - manoH, 16, manoH);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(mano1X - 8, cy - inletRadius - manoH, 16, manoH);
      ctx.strokeRect(mano2X - 8, cy - throatRadius - manoH, 16, manoH);

      // Liquid column in manometers (water columns)
      // Inlet has higher pressure P1 => Lower suction column
      // Throat has lower pressure P2 (vacuum suction) => Liquid pulled upwards!
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(mano1X - 6, cy - inletRadius - 20, 12, 20);
      const throatLiquidH = Math.min(manoH - 10, 20 + manometerDropH);
      ctx.fillRect(mano2X - 6, cy - throatRadius - throatLiquidH, 12, throatLiquidH);

      ctx.fillStyle = '#f87171';
      ctx.font = '10px monospace';
      ctx.fillText(`Δh = ${(manometerDropH).toFixed(1)} mm`, mano2X + 14, cy - throatRadius - throatLiquidH);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 250, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 250, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('VENTURI TUBE BERNOULLI VACUUM', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Inlet Velocity v1: ${inletFlowVelocity.toFixed(1)} m/s`, 45, 72);
      ctx.fillText(`Throat Velocity v2: ${vThroat.toFixed(1)} m/s (${(1 / constrictionRatio).toFixed(1)}x)`, 45, 90);
      ctx.fillText(`Venturi Vacuum Suction ΔP: ${deltaP.toFixed(1)} Pa`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1738 DANIEL BERNOULLI PRINCIPLE · VENTURI CONSTRICTION TUBE & MANOMETER VACUUM LIFT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [inletFlowVelocity, constrictionRatio]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Wind size={14} /> Inlet Velocity (v1)</span>
            <span className="font-mono">{inletFlowVelocity.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.0"
            step="0.1"
            value={inletFlowVelocity}
            onChange={(e) => setInletFlowVelocity(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Throat Constriction Ratio</span>
            <span className="font-mono">{constrictionRatio.toFixed(2)}x diameter</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="0.75"
            step="0.05"
            value={constrictionRatio}
            onChange={(e) => setConstrictionRatio(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
