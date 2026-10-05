import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment189BoseEinsteinCondensateVelocityDistribution() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureNanokelvin, setTemperatureNanokelvin] = useState(120); // nK (T_c ~ 170 nK for Rubidium-87)
  const [trapTrapTightness, setTrapTrapTightness] = useState(1.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Bose-Einstein Condensation (1924 Bose & Einstein; 1995 Cornell & Wieman Nobel):
    // Below critical temperature T_c, a macroscopic fraction of bosonic atoms (Rubidium-87)
    // drops into the single lowest quantum ground state of the magnetic trap.
    // Time-Of-Flight (TOF) absorption imaging reveals a distinctive bimodal velocity distribution:
    // Broad thermal Gaussian cloud + an extremely sharp, dense quantum condensate peak!

    const tc_nK = 170;
    const isCondensed = temperatureNanokelvin < tc_nK;
    const condensateFraction = isCondensed ? 1 - Math.pow(temperatureNanokelvin / tc_nK, 3) : 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.52;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Time-of-Flight (TOF) False-Color Density Map on Left
      const mapW = 200;
      const mapH = 200;
      const mapX = cx - 120;
      const mapY = cy - 100;

      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(mapX, mapY, mapW, mapH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mapX, mapY, mapW, mapH);

      // Thermal cloud (broad Gaussian halo)
      const thermalSigma = (temperatureNanokelvin / tc_nK) * 55 + 20;
      const haloGrad = ctx.createRadialGradient(cx - 20, cy, 5, cx - 20, cy, thermalSigma);
      haloGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      haloGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.25)');
      haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx - 20, cy, thermalSigma, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Quantum Condensate Peak (Thomas-Fermi parabolic density)
      if (isCondensed) {
        const becR = condensateFraction * 28 + 6;
        const becGrad = ctx.createRadialGradient(cx - 20, cy, 1, cx - 20, cy, becR);
        becGrad.addColorStop(0, '#ffffff'); // pure white saturation peak
        becGrad.addColorStop(0.3, '#38bdf8');
        becGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = becGrad;
        ctx.beginPath();
        ctx.arc(cx - 20, cy, becR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('TOF ABSORPTION DENSITY', mapX + 15, mapY - 10);

      // Cross-Section Velocity Distribution Profile Curve on Right
      const plotX = width * 0.62;
      const plotY = 80;
      const plotW = width * 0.34;
      const plotH = 220;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(plotX, plotY, plotW, plotH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(plotX, plotY, plotW, plotH);

      // Bimodal Distribution Profile: Broad Thermal Gaussian + Sharp BEC Peak
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const midPlotX = plotX + plotW / 2;
      for (let px = plotX; px <= plotX + plotW; px += 2) {
        const v = (px - midPlotX) / (plotW * 0.15); // normalized velocity
        // Thermal Gaussian
        const thermalVal = Math.exp(-0.5 * v * v) * 45 * (1 - condensateFraction * 0.6);
        // Condensate sharp peak
        const becVal = isCondensed ? Math.max(0, 1 - (v / 0.8) ** 2) * condensateFraction * 130 : 0;

        const totalDensity = thermalVal + becVal;
        const py = plotY + plotH - totalDensity - 15;

        if (px === plotX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('BIMODAL VELOCITY DISTRIBUTION', plotX + 14, plotY + 22);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Condensate Fraction N_0/N: ${(condensateFraction * 100).toFixed(1)}%`, plotX + 14, plotY + 42);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('BOSE-EINSTEIN CONDENSATE (Rb-87)', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Temperature: ${temperatureNanokelvin} nK (T_c = 170 nK)`, 45, 72);
      ctx.fillText(`Macroscopic Quantum Phase: ${isCondensed ? 'CONDENSED WAVE' : 'CLASSICAL GAS'}`, 45, 90);
      ctx.fillText('de Broglie Wavelength: λ_dB > Interparticle Spacing', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1995 CORNELL & WIEMAN BOSE-EINSTEIN CONDENSATION · MACROSCOPIC GROUND STATE BIMODALITY', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temperatureNanokelvin, trapTrapTightness]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Atom size={14} /> Cryogenic Temperature (T)</span>
            <span className="font-mono">{temperatureNanokelvin} nK (T_c = 170 nK)</span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="5"
            value={temperatureNanokelvin}
            onChange={(e) => setTemperatureNanokelvin(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Magnetic Trap Confinement</span>
            <span className="font-mono">{trapTrapTightness.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={trapTrapTightness}
            onChange={(e) => setTrapTrapTightness(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
