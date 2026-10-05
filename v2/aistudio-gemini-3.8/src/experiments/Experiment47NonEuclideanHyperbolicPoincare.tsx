import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment47NonEuclideanHyperbolicPoincare() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [warpFactor, setWarpFactor] = useState(0.85);
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
    const discRadius = Math.min(width, height) * 0.44;

    // Dark non-Euclidean geometry chamber
    ctx.fillStyle = '#08080f';
    ctx.fillRect(0, 0, width, height);

    // Poincaré Disc Outer Boundary Horizon Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, discRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0f111a';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#4f46e5';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Draw Hyperbolic Geodesic Circular Arcs
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, discRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.lineWidth = 1;

    for (let r = 0.2; r < 0.95; r += 0.15) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, discRadius * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial spokes
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(a) * discRadius, centerY + Math.sin(a) * discRadius);
      ctx.stroke();
    }

    // Render Hyperbolic Scaled Letter Rings
    // In Poincaré geometry, objects shrink towards the horizon boundary
    const rings = [0, 0.35, 0.65, 0.85];

    rings.forEach((ringR, ringIdx) => {
      const ringRadius = discRadius * ringR;
      const scale = Math.pow(1 - ringR, 0.7);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180 + ringIdx * 0.4);

      if (ringR === 0) {
        // Centerpiece
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 36px "Instrument Serif", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 12;
        ctx.fillText(text, 0, 0);
      } else {
        const step = (Math.PI * 2) / text.length;
        for (let i = 0; i < text.length; i++) {
          const a = i * step;
          const char = text[i];
          if (char === ' ') continue;

          const x = Math.cos(a) * ringRadius;
          const y = Math.sin(a) * ringRadius;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a + Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `bold ${Math.round(24 * scale)}px "Instrument Serif", Georgia, serif`;
          ctx.fillStyle = `rgba(224, 231, 255, ${scale * 0.9})`;
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }

      ctx.restore();
    });

    ctx.restore();
  }, [warpFactor, rotation]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#08080f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-indigo-400" />
          <span className="font-bold text-stone-200">STUDY 047</span> // POINCARÉ HYPERBOLIC DISC GEOMETRY
        </div>
        <div className="flex items-center gap-4">
          <span>CURVATURE: K = -1 GAUSSIAN</span>
          <span>GEODESICS: HYPERBOLIC CIRCLES</span>
        </div>
      </div>

      {/* Hyperbolic Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-indigo-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          NON-EUCLIDEAN DISTANCE EXPANDS EXPONENTIALLY TOWARD BOUNDARY HORIZON
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Möbius Rotation:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-28 accent-indigo-400"
            />
            <span>{rotation}°</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRotation((r) => (r + 45) % 360)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Rotate Geodesics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
