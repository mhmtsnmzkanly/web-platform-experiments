import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment58MoireInterferencePatterns() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angleOffset, setAngleOffset] = useState(4.5); // degrees
  const [pitch, setPitch] = useState(6); // line spacing px

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Grating 1: Fixed horizontal / vertical periodic lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += pitch) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Grating 2: Rotated superimposed grating
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angleOffset * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    for (let x = -width; x < width * 2; x += pitch) {
      ctx.beginPath();
      ctx.moveTo(x, -height);
      ctx.lineTo(x, height * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Foreground Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 74px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 24;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [angleOffset, pitch]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#0a0a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 058</span> // SUPERIMPOSED MOIRÉ INTERFERENCE
        </div>
        <div className="flex items-center gap-4">
          <span>ANGLE OFFSET: {angleOffset}°</span>
          <span>GRATING PITCH: {pitch}PX</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SUPERIMPOSED PERIODIC GRATINGS GENERATE MACROSCOPIC MOIRÉ WAVES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Grating Rotation:</span>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={angleOffset}
              onChange={(e) => setAngleOffset(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{angleOffset}°</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Line Pitch:</span>
            <input
              type="range"
              min="3"
              max="16"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{pitch}px</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Optical Vernier Magnification</span>
        </div>
      </div>
    </div>
  );
}
