import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment166FraunhoferDiffractionSlits() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [numSlitsN, setNumSlitsN] = useState<number>(2); // 1 = Single slit, 2 = Young's Double slit, 5 = Diffraction Grating
  const [slitSeparationD, setSlitSeparationD] = useState(2.5); // um
  const [laserWavelengthNm, setLaserWavelengthNm] = useState(633); // nm (Red He-Ne)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.45;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Fraunhofer Diffraction Equation for N Slits:
      // I(theta) = I_0 * [ sin(beta) / beta ]^2 * [ sin(N * alpha) / sin(alpha) ]^2
      // Single slit diffraction envelope: beta = (pi * b / lambda) * sin(theta)
      // Multi-slit interference factor: alpha = (pi * d / lambda) * sin(theta)
      // where b = slit width (~0.8 um), d = slit separation

      const lambda = laserWavelengthNm * 1e-9;
      const d = slitSeparationD * 1e-6;
      const b = 0.8e-6;

      const screenX = width * 0.5;
      const screenH = 180;

      // Color mapping for laser wavelength
      const laserColor = laserWavelengthNm < 500 ? '#38bdf8' : laserWavelengthNm < 570 ? '#22c55e' : '#ef4444';

      // Draw Diffraction Intensity Curve on upper half
      ctx.strokeStyle = laserColor;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const screenPts: { x: number; int: number }[] = [];

      for (let px = 40; px <= width - 40; px += 1.5) {
        // Spatial angle theta relative to central axis
        const xDist = (px - screenX) * 0.001; // meters
        const L = 1.0; // 1 meter distance to screen
        const sinTheta = xDist / Math.sqrt(xDist * xDist + L * L);

        const beta = (Math.PI * b * sinTheta) / lambda + 1e-9;
        const alpha = (Math.PI * d * sinTheta) / lambda + 1e-9;

        const diffractionEnvelope = (Math.sin(beta) / beta) ** 2;
        const interferenceFactor = (Math.sin(numSlitsN * alpha) / (numSlitsN * Math.sin(alpha))) ** 2;

        const totalIntensity = diffractionEnvelope * (numSlitsN === 1 ? 1 : interferenceFactor);
        const plotY = cy - 20 - totalIntensity * 120;

        screenPts.push({ x: px, int: totalIntensity });

        if (px === 40) ctx.moveTo(px, plotY);
        else ctx.lineTo(px, plotY);
      }
      ctx.stroke();

      // Draw Simulated Photonic Screen Interference Pattern on lower strip
      const stripY = cy + 45;
      const stripH = 50;

      for (let pt of screenPts) {
        ctx.fillStyle = laserColor;
        ctx.globalAlpha = Math.max(0.01, Math.min(1.0, pt.int));
        ctx.fillRect(pt.x, stripY, 2, stripH);
      }
      ctx.globalAlpha = 1.0;

      // Strip border
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, stripY, width - 80, stripH);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 260, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 260, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('FRAUNHOFER N-SLIT DIFFRACTION', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Slit Count: N = ${numSlitsN} (${numSlitsN === 1 ? 'Single Slit' : numSlitsN === 2 ? "Young's Double Slit" : 'Transmission Grating'})`, 45, 72);
      ctx.fillText(`Slit Pitch: d = ${slitSeparationD.toFixed(1)} μm · λ = ${laserWavelengthNm} nm`, 45, 90);
      ctx.fillText(`Primary Peak Width: Δθ ~ λ/(N·d)`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = laserColor;
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1821 JOSEPH VON FRAUNHOFER · N-SLIT MULTI-WAVE INTERFERENCE & DIFFRACTION ENVELOPE', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [numSlitsN, slitSeparationD, laserWavelengthNm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Slit Configuration (N)</span>
            <span className="font-mono">N = {numSlitsN}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {[1, 2, 4, 8].map((n) => (
              <button
                key={n}
                onClick={() => setNumSlitsN(n)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  numSlitsN === n
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {n === 1 ? '1 Slit' : n === 2 ? '2 Slits' : `${n} Slits`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Slit Pitch (d)</span>
            <span className="font-mono">{slitSeparationD.toFixed(1)} μm</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={slitSeparationD}
            onChange={(e) => setSlitSeparationD(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Laser Wavelength</span>
            <span className="font-mono">{laserWavelengthNm} nm</span>
          </div>
          <input
            type="range"
            min="450"
            max="680"
            step="10"
            value={laserWavelengthNm}
            onChange={(e) => setLaserWavelengthNm(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
