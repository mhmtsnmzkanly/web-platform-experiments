import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment51BirefringencePolarizedLight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [filterAngle, setFilterAngle] = useState(90); // 90 = crossed polarizers (extinction)
  const [stressForce, setStressForce] = useState(3.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Optical polariscope viewing stage
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Light source transmission through crossed polarizers: I = I0 * sin^2(2*theta) * sin^2(delta/2)
    const extinction = Math.abs(Math.sin((filterAngle * Math.PI) / 180));

    // Circular polarizer disc
    const radius = Math.min(width, height) * 0.44;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(18, 22, 32, ${0.4 + extinction * 0.5})`;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Render Photoelastic Isochromatic Stress Fringe Bands on "HELLO WORLD"
    // Isochromatic fringe order n = (sigma1 - sigma2) * d / f_sigma
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(width / 9, 84)}px 'Syne', sans-serif`;

    // Multi-color photoelastic birefringence gradient
    const stressGrad = ctx.createLinearGradient(centerX - 300, centerY - 60, centerX + 300, centerY + 60);
    const t = stressForce;
    stressGrad.addColorStop(0, '#f43f5e'); // Red 1st order
    stressGrad.addColorStop(0.2, '#fbbf24'); // Yellow
    stressGrad.addColorStop(0.4, '#22c55e'); // Green 2nd order
    stressGrad.addColorStop(0.6, '#06b6d4'); // Cyan
    stressGrad.addColorStop(0.8, '#a855f7'); // Violet 3rd order
    stressGrad.addColorStop(1, '#ec4899');

    ctx.fillStyle = stressGrad;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12 * extinction;
    ctx.fillText('HELLO WORLD', centerX, centerY);

    // Isochromatic stress concentration contours
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * extinction})`;
    ctx.lineWidth = 1;
    for (let offset = -40; offset <= 40; offset += 8) {
      ctx.strokeText('HELLO WORLD', centerX + offset * 0.2, centerY + offset * 0.1);
    }
    ctx.restore();
  }, [filterAngle, stressForce]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06070a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 051</span> // PHOTOELASTIC STRESS BIREFRINGENCE
        </div>
        <div className="flex items-center gap-4">
          <span>POLARIZER: {filterAngle}°</span>
          <span>STRESS FORCE: {stressForce} KN</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CROSSED POLARIZING NICOL PRISMS REVEAL ISOCHROMATIC STRESS FRINGES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Polarizer Angle:</span>
            <input
              type="range"
              min="0"
              max="180"
              value={filterAngle}
              onChange={(e) => setFilterAngle(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span>{filterAngle}°</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Mechanical Stress:</span>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={stressForce}
              onChange={(e) => setStressForce(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAngle(filterAngle === 90 ? 45 : 90)}
            className="px-3 py-1.5 rounded border border-stone-700 bg-stone-800 text-stone-200 hover:text-white"
          >
            {filterAngle === 90 ? 'Crossed 90° (Dark)' : 'Parallel 0° (Bright)'}
          </button>
        </div>
      </div>
    </div>
  );
}
