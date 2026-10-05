import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sun, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment20PrismaticRefraction() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prismAngle, setPrismAngle] = useState(0); // degrees
  const [refractiveIndex, setRefractiveIndex] = useState(1.62); // flint glass
  const [beamIntensity, setBeamIntensity] = useState(80);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Dark optical darkroom
    ctx.fillStyle = '#060609';
    ctx.fillRect(0, 0, width, height);

    // Incident white light beam entering from the left
    const startX = 60;
    const startY = height * 0.45;
    const prismCenterX = width * 0.42;
    const prismCenterY = height * 0.48;
    const prismSize = 110;

    // Draw white incident ray
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(prismCenterX - prismSize * 0.4, prismCenterY);
    ctx.stroke();

    // Incident ray glow
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.restore();

    // Draw Equilateral Glass Prism
    ctx.save();
    ctx.translate(prismCenterX, prismCenterY);
    ctx.rotate((prismAngle * Math.PI) / 180);

    const pA = { x: 0, y: -prismSize * 0.8 };
    const pB = { x: -prismSize * 0.7, y: prismSize * 0.6 };
    const pC = { x: prismSize * 0.7, y: prismSize * 0.6 };

    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.lineTo(pC.x, pC.y);
    ctx.closePath();

    // Glass body fill
    const glassGrad = ctx.createLinearGradient(-prismSize, -prismSize, prismSize, prismSize);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    glassGrad.addColorStop(0.5, 'rgba(180, 220, 255, 0.15)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // Beveled glass facet edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Dispersed Spectral Rainbow Wavelengths exiting right face
    const spectrum = [
      { color: '#ef4444', dev: 0.15 }, // Red
      { color: '#f97316', dev: 0.18 }, // Orange
      { color: '#eab308', dev: 0.21 }, // Yellow
      { color: '#22c55e', dev: 0.24 }, // Green
      { color: '#06b6d4', dev: 0.28 }, // Cyan
      { color: '#3b82f6', dev: 0.32 }, // Blue
      { color: '#8b5cf6', dev: 0.36 }, // Violet
    ];

    const exitX = prismCenterX + prismSize * 0.3;
    const exitY = prismCenterY + 10;
    const targetScreenX = width - 100;

    spectrum.forEach((spec) => {
      const spread = spec.dev * (refractiveIndex / 1.5) * (beamIntensity / 60);
      const endY = height * 0.25 + spread * 240;

      ctx.save();
      ctx.strokeStyle = spec.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = spec.color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(targetScreenX, endY);
      ctx.stroke();

      ctx.lineWidth = 7;
      ctx.strokeStyle = `${spec.color}33`;
      ctx.stroke();
      ctx.restore();
    });

    // The Spectral Projection Screen with "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 56px "Syne", sans-serif';

    // Chromatic rainbow gradient on the text
    const textGrad = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.85);
    textGrad.addColorStop(0, '#ef4444');
    textGrad.addColorStop(0.2, '#f97316');
    textGrad.addColorStop(0.4, '#eab308');
    textGrad.addColorStop(0.6, '#22c55e');
    textGrad.addColorStop(0.8, '#06b6d4');
    textGrad.addColorStop(1, '#8b5cf6');

    ctx.fillStyle = textGrad;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.fillText('HELLO WORLD', targetScreenX - 80, height * 0.55);
    ctx.restore();
  }, [prismAngle, refractiveIndex, beamIntensity]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#060609] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sun size={14} className="text-amber-300" />
          <span className="font-bold text-stone-200">STUDY 020</span> // PRISMATIC SNELL DISPERSION CAUSTICS
        </div>
        <div className="flex items-center gap-4">
          <span>MEDIUM: FLINT GLASS (n={refractiveIndex})</span>
          <span>DISPERSION: CAUCHY WAVELENGTH SPLIT</span>
        </div>
      </div>

      {/* Optics Bench Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          INCIDENT WHITE BEAM DISPERSES ACCORDING TO SNELL'S LAW
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Prism Angle:</span>
            <input
              type="range"
              min="-25"
              max="25"
              value={prismAngle}
              onChange={(e) => setPrismAngle(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{prismAngle}°</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Refractive Index:</span>
            <input
              type="range"
              min="1.33"
              max="2.42"
              step="0.05"
              value={refractiveIndex}
              onChange={(e) => setRefractiveIndex(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{refractiveIndex}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: 'Crown 1.52', val: 1.52 },
            { label: 'Flint 1.62', val: 1.62 },
            { label: 'Diamond 2.42', val: 2.42 },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => setRefractiveIndex(m.val)}
              className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                refractiveIndex === m.val ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
