import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment35AnamorphicCylinderMirror() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cylinderRadius, setCylinderRadius] = useState(65);
  const [rotation, setRotation] = useState(0);

  const text = 'HELLO WORLD';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark walnut curio optical chamber
    ctx.fillStyle = '#120f0d';
    ctx.fillRect(0, 0, width, height);

    // Circular drafting desk paper grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let r = cylinderRadius + 20; r <= 220; r += 30) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 1. Draw Anamorphic Radially Distorted Typography on the table around the mirror
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const arcSpread = Math.PI * 1.2;
    const charStep = arcSpread / (text.length - 1);
    const startAngle = Math.PI / 2 - arcSpread / 2;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') continue;

      const angle = startAngle + i * charStep;

      ctx.save();
      ctx.rotate(angle);
      // Radical anamorphic radial stretching
      ctx.translate(0, cylinderRadius + 75);
      ctx.scale(1.8, 0.5); // distorted flat
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 28px "Syne", sans-serif';
      ctx.fillStyle = '#e2d5c3';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // 2. Draw Polished Chrome Cylindrical Mirror at Center
    ctx.save();
    const mirrorGrad = ctx.createLinearGradient(centerX - cylinderRadius, 0, centerX + cylinderRadius, 0);
    mirrorGrad.addColorStop(0, '#52525b');
    mirrorGrad.addColorStop(0.2, '#f4f4f5'); // specular chrome highlight
    mirrorGrad.addColorStop(0.5, '#71717a');
    mirrorGrad.addColorStop(0.8, '#f4f4f5');
    mirrorGrad.addColorStop(1, '#27272a');

    ctx.fillStyle = mirrorGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cylinderRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Draw Undistorted Optical Catoptric Reflection Inside the Mirror!
    // The reflection corrects the curved anamorphic text into clean horizontal reading
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, cylinderRadius - 4, 0, Math.PI * 2);
    ctx.clip();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(cylinderRadius * 0.32)}px 'Instrument Serif', Georgia, serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();

    ctx.restore();
  }, [cylinderRadius, rotation]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#120f0d] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-amber-300" />
          <span className="font-bold text-stone-200">STUDY 035</span> // 17TH-C. ANAMORPHIC CYLINDER MIRROR
        </div>
        <div className="flex items-center gap-4">
          <span>CATOPTRIC PROJECTION: CYLINDRICAL REFLECTION</span>
          <span>RADIUS: {cylinderRadius}MM</span>
        </div>
      </div>

      {/* Optical Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200/90 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          DISTORTED RADIAL PRINT OUTSIDE RESOLVES INSIDE CYLINDRICAL MIRROR
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Mirror Radius:</span>
            <input
              type="range"
              min="45"
              max="95"
              value={cylinderRadius}
              onChange={(e) => setCylinderRadius(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{cylinderRadius}mm</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Rotation Angle:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{rotation}°</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCylinderRadius(65);
              setRotation(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Alignment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
