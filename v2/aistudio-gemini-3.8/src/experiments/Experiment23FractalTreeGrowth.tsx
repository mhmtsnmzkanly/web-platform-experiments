import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RotateCcw, Trees } from 'lucide-react';

export default function Experiment23FractalTreeGrowth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [depth, setDepth] = useState(6);
  const [branchAngle, setBranchAngle] = useState(25); // degrees
  const [season, setSeason] = useState<'sakura' | 'pine' | 'autumn'>('sakura');

  const seasons = {
    sakura: { branch: '#443322', leaf: '#f472b6', bg: '#0d0d12' },
    pine: { branch: '#292524', leaf: '#10b981', bg: '#060d09' },
    autumn: { branch: '#3e2723', leaf: '#f97316', bg: '#0f0a06' },
  }[season];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    ctx.fillStyle = seasons.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw central typographic anchor "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 72px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = seasons.leaf;
    ctx.shadowBlur = 18;
    ctx.fillText('HELLO WORLD', width / 2, height * 0.38);
    ctx.restore();

    // Recursive fractal tree branching function
    const drawBranch = (x: number, y: number, len: number, angle: number, curDepth: number) => {
      if (curDepth === 0) {
        // Draw blossoming leaf / flower
        ctx.fillStyle = seasons.leaf;
        ctx.shadowColor = seasons.leaf;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        return;
      }

      const rad = (angle * Math.PI) / 180;
      const x2 = x + Math.sin(rad) * len;
      const y2 = y - Math.cos(rad) * len;

      ctx.strokeStyle = seasons.branch;
      ctx.lineWidth = curDepth * 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const radAngle = branchAngle;
      drawBranch(x2, y2, len * 0.76, angle - radAngle, curDepth - 1);
      drawBranch(x2, y2, len * 0.76, angle + radAngle, curDepth - 1);
    };

    // Draw twin botanical trees framing the typographic centerpiece
    drawBranch(width * 0.22, height - 20, 85, 8, depth);
    drawBranch(width * 0.78, height - 20, 85, -8, depth);
  }, [depth, branchAngle, season, seasons]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#0d0d12] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Trees size={14} className="text-pink-400" />
          <span className="font-bold text-stone-200">STUDY 023</span> // BOTANICAL L-SYSTEM FRACTAL GROWTH
        </div>
        <div className="flex items-center gap-4">
          <span>RECURSION DEPTH: {depth} LEVELS</span>
          <span>SEASON: {season.toUpperCase()}</span>
        </div>
      </div>

      {/* Botanical Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          RECURSIVE BOTANICAL BRANCHING FRAMES TYPOGRAPHIC CORE
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Branching Angle:</span>
            <input
              type="range"
              min="15"
              max="45"
              value={branchAngle}
              onChange={(e) => setBranchAngle(Number(e.target.value))}
              className="w-24 accent-pink-400"
            />
            <span>{branchAngle}°</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Recursion Depth:</span>
            <input
              type="range"
              min="3"
              max="8"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-20 accent-pink-400"
            />
            <span>{depth}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['sakura', 'pine', 'autumn'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                season === s ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
