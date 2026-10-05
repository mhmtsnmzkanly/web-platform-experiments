import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment72PenroseAperiodicTiling() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deflationLevel, setDeflationLevel] = useState(3);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark architectural geometric slate
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Penrose Rhombi generation with 5-fold radial golden ratio symmetry
    const phi = (1 + Math.sqrt(5)) / 2; // 1.6180339887...
    const baseR = 190;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw 10-fold Penrose Rhombi petals
    for (let i = 0; i < 10; i++) {
      const a1 = (i / 10) * Math.PI * 2;
      const a2 = ((i + 1) / 10) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a1) * baseR, Math.sin(a1) * baseR);
      ctx.lineTo(
        (Math.cos(a1) + Math.cos(a2)) * (baseR * 0.618),
        (Math.sin(a1) + Math.sin(a2)) * (baseR * 0.618)
      );
      ctx.lineTo(Math.cos(a2) * baseR, Math.sin(a2) * baseR);
      ctx.closePath();

      ctx.fillStyle = i % 2 === 0 ? '#1e3a8a' : '#d97706';
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Centerpiece Inscribed Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 54px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [deflationLevel, rotation]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#090a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 072</span> // PENROSE APERIODIC 5-FOLD TILING
        </div>
        <div className="flex items-center gap-4">
          <span>GOLDEN RATIO: φ = 1.618</span>
          <span>SYMMETRY: QUASICRYSTALLINE P2</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          QUASICRYSTAL TILING TILES THE PLANE WITHOUT PERIODIC TRANSLATION
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Tile Rotation:</span>
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

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Non-Repeating Aperiodic Rhombi</span>
        </div>
      </div>
    </div>
  );
}
