import React, { useRef, useEffect, useState } from 'react';
import { Sun, Sliders, RotateCcw } from 'lucide-react';

interface AbsorptionLine {
  name: string;
  wl: number; // nm
  element: string;
  width: number;
}

export default function Experiment70SolarSpectrographFraunhofer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [slitWidth, setSlitWidth] = useState(2);
  const [showLabels, setShowLabels] = useState(true);

  // Key Fraunhofer Solar Absorption Lines (380nm to 700nm):
  const lines: AbsorptionLine[] = [
    { name: 'K', wl: 393.4, element: 'Ca II', width: 4 },
    { name: 'H', wl: 396.8, element: 'Ca II', width: 3.5 },
    { name: 'G', wl: 430.8, element: 'Fe / Ca', width: 2.5 },
    { name: 'F', wl: 486.1, element: 'H-beta', width: 2 },
    { name: 'b1', wl: 518.4, element: 'Mg I', width: 2 },
    { name: 'E2', wl: 527.0, element: 'Fe I', width: 1.5 },
    { name: 'D2', wl: 589.0, element: 'Na I', width: 3 },
    { name: 'D1', wl: 589.6, element: 'Na I', width: 2.5 },
    { name: 'C', wl: 656.3, element: 'H-alpha', width: 3.5 },
    { name: 'B', wl: 686.7, element: 'O2 (terr)', width: 4 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Dark astrophysics spectrograph chamber
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, width, height);

    // Continuous Solar Emission Spectrum Band
    const specY = height * 0.35;
    const specHeight = 160;

    const specGrad = ctx.createLinearGradient(40, 0, width - 40, 0);
    specGrad.addColorStop(0.0, '#581c87'); // 380nm Violet
    specGrad.addColorStop(0.15, '#2563eb'); // 450nm Blue
    specGrad.addColorStop(0.3, '#06b6d4'); // 490nm Cyan
    specGrad.addColorStop(0.5, '#22c55e'); // 530nm Green
    specGrad.addColorStop(0.7, '#eab308'); // 580nm Yellow
    specGrad.addColorStop(0.85, '#f97316'); // 620nm Orange
    specGrad.addColorStop(1.0, '#dc2626'); // 700nm Red

    ctx.fillStyle = specGrad;
    ctx.fillRect(40, specY, width - 80, specHeight);

    // Draw Dark Fraunhofer Absorption Slit Lines
    const minWl = 380;
    const maxWl = 700;
    const bandW = width - 80;

    ctx.fillStyle = '#050608';
    lines.forEach((line) => {
      const frac = (line.wl - minWl) / (maxWl - minWl);
      const lx = 40 + frac * bandW;
      const lw = line.width * (slitWidth * 0.7);

      ctx.fillRect(lx - lw / 2, specY, lw, specHeight);

      if (showLabels) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(line.name, lx, specY - 8);
        ctx.fillStyle = '#a1a1aa';
        ctx.fillText(line.element, lx, specY + specHeight + 14);
        ctx.fillStyle = '#050608';
      }
    });

    // Inscribed Monumental Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(width / 9, 78)}px 'Syne', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 15;
    ctx.fillText('HELLO WORLD', width / 2, specY + specHeight / 2);
    ctx.restore();
  }, [slitWidth, showLabels]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#050608] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sun size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 070</span> // SOLAR FRAUNHOFER ABSORPTION LINES
        </div>
        <div className="flex items-center gap-4">
          <span>SPECTRUM: 380 NM - 700 NM</span>
          <span>ATOMIC BALMER & SODIUM DOUBLET</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SOLAR PHOTOSPHERE ABSORPTION LINES SILHOUETTE SPECTRAL TYPOGRAPHY
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Spectrograph Slit:</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={slitWidth}
              onChange={(e) => setSlitWidth(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{slitWidth}x</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              showLabels ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
            }`}
          >
            Element Labels: {showLabels ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
