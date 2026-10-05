import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment71LiquidCrystalSchlierenTexture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nematicDirector, setNematicDirector] = useState(45); // degrees
  const [thermalPhase, setThermalPhase] = useState<'nematic' | 'smectic' | 'isotropic'>('nematic');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Polarized light microscope view of nematic liquid crystal
    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, width, height);

    // Topological disclination defect brush lines (Schlieren brush textures)
    ctx.save();
    const rad = (nematicDirector * Math.PI) / 180;
    const numBrushes = 120;

    for (let i = 0; i < numBrushes; i++) {
      const bx = (i * 37) % width;
      const by = (i * 53) % height;
      const len = 40 + Math.sin(i + rad) * 20;

      const grad = ctx.createLinearGradient(bx, by, bx + Math.cos(rad) * len, by + Math.sin(rad) * len);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#fbbf24');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + 15, by - 20, bx + Math.cos(rad) * len, by + Math.sin(rad) * len);
      ctx.stroke();
    }
    ctx.restore();

    // Inscribed Nematic Alignment Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(width / 9, 82)}px 'Syne', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.fillText('HELLO WORLD', centerX, centerY);
    ctx.restore();
  }, [nematicDirector, thermalPhase]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06060c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 071</span> // LIQUID CRYSTAL SCHLIEREN TEXTURES
        </div>
        <div className="flex items-center gap-4">
          <span>PHASE: {thermalPhase.toUpperCase()}</span>
          <span>DIRECTOR ANGLE: {nematicDirector}°</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          POLARIZED MICROSCOPY OF NEMATIC TOPOLOGICAL DISCLINATIONS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Director Vector:</span>
            <input
              type="range"
              min="0"
              max="180"
              value={nematicDirector}
              onChange={(e) => setNematicDirector(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span>{nematicDirector}°</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['nematic', 'smectic', 'isotropic'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setThermalPhase(p)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                thermalPhase === p ? 'bg-cyan-500 text-stone-950 font-bold border-cyan-400' : 'border-stone-800 text-stone-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
