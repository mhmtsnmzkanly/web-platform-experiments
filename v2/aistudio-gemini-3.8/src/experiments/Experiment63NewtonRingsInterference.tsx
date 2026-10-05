import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment63NewtonRingsInterference() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lensRadius, setLensRadius] = useState(120);
  const [lightSource, setLightSource] = useState<'white' | 'sodium589'>('white');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxR = Math.min(width, height) * 0.44;

    // Dark optical flat base
    ctx.fillStyle = '#060609';
    ctx.fillRect(0, 0, width, height);

    // Circular glass plate contact aperture
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxR, 0, Math.PI * 2);
    ctx.fillStyle = '#0f111a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Newton's Rings thin-film interference: r_m = sqrt(m * lambda * R)
    // Dark central contact spot due to phase reversal (pi shift) at glass-air boundary
    const spectrum = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

    for (let r = 8; r < maxR; r += 7) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

      if (lightSource === 'sodium589') {
        const isBright = Math.sin(r * 0.4) > 0;
        ctx.strokeStyle = isBright ? '#fbbf24' : 'rgba(0, 0, 0, 0.8)';
      } else {
        const colIdx = Math.floor((r * 0.3) % spectrum.length);
        ctx.strokeStyle = spectrum[colIdx];
      }

      ctx.lineWidth = Math.max(1, 4 - r * 0.015);
      ctx.stroke();
    }

    // Central dark zero-order contact spot
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Inscribed Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 52px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [lensRadius, lightSource]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#060609] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 063</span> // NEWTON'S THIN-FILM INTERFERENCE RINGS
        </div>
        <div className="flex items-center gap-4">
          <span>SOURCE: {lightSource === 'white' ? 'POLYCHROMATIC WHITE' : 'SODIUM 589 NM'}</span>
          <span>AIR WEDGE PHASE SHIFT: π</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CONVEX LENS CONTACT FORMS THIN AIR WEDGE INTERFERENCE FRINGES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Lens Curvature:</span>
            <input
              type="range"
              min="80"
              max="200"
              value={lensRadius}
              onChange={(e) => setLensRadius(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{lensRadius}mm</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['white', 'sodium589'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setLightSource(s)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                lightSource === s ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
              }`}
            >
              {s === 'white' ? 'White Spectrum' : 'Sodium 589nm'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
