import React, { useRef, useEffect, useState } from 'react';
import { Wind, RotateCcw, Sliders, Sparkles } from 'lucide-react';

interface Stone {
  char: string;
  x: number;
  y: number;
  r: number;
}

export default function Experiment13ZenSandRake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rakeWidth, setRakeWidth] = useState(24);
  const isRakingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const letters = 'HELLO WORLD'.split('');

  const initSand = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Warm limestone raked sand base
    ctx.fillStyle = '#EFE9DE';
    ctx.fillRect(0, 0, width, height);

    // Initial concentric sand ripples around center
    ctx.strokeStyle = '#D9CFBF';
    ctx.lineWidth = 1.5;

    for (let r = 20; r < Math.max(width, height); r += 16) {
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, r * 1.3, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw the Zen Rock Typographic Stones
    const spacing = (width - 160) / (letters.length - 1);
    const startX = 80;
    const centerY = height / 2;

    letters.forEach((char, i) => {
      if (char === ' ') return;
      const x = startX + i * spacing;
      const y = centerY + Math.sin(i * 0.8) * 20;

      // Stone shadow
      ctx.fillStyle = 'rgba(40, 35, 30, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x + 4, y + 8, 22, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Stone body (dark river basalt)
      const stoneGrad = ctx.createRadialGradient(x - 5, y - 6, 2, x, y, 22);
      stoneGrad.addColorStop(0, '#57534e');
      stoneGrad.addColorStop(0.7, '#292524');
      stoneGrad.addColorStop(1, '#1c1917');

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.ellipse(x, y, 22, 18, (i * 0.3) % 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Inscribed golden kanji/character
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 16px "Instrument Serif", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, x, y);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    initSand(ctx, width, height);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isRakingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRakingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw rake tines
    const last = lastPosRef.current;
    const dx = x - last.x;
    const dy = y - last.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) + Math.PI / 2;

    const tines = 5;
    const spacing = rakeWidth / tines;

    ctx.save();
    ctx.lineWidth = 2;

    for (let i = -tines / 2; i <= tines / 2; i++) {
      const offsetX = Math.cos(angle) * (i * spacing);
      const offsetY = Math.sin(angle) * (i * spacing);

      // Deep groove
      ctx.strokeStyle = '#BAAC97';
      ctx.beginPath();
      ctx.moveTo(last.x + offsetX, last.y + offsetY);
      ctx.lineTo(x + offsetX, y + offsetY);
      ctx.stroke();

      // Sand crest highlight
      ctx.strokeStyle = '#F7F4EE';
      ctx.beginPath();
      ctx.moveTo(last.x + offsetX + 1, last.y + offsetY - 1);
      ctx.lineTo(x + offsetX + 1, y + offsetY - 1);
      ctx.stroke();
    }

    ctx.restore();

    lastPosRef.current = { x, y };
  };

  const handleMouseUp = () => {
    isRakingRef.current = false;
    lastPosRef.current = null;
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initSand(ctx, canvas.width, canvas.height);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#EBE4D5] text-[#292524] rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl font-serif select-none border border-[#D5C9B3]">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#D5C9B3] pb-3 text-xs font-mono text-stone-600">
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-stone-700" />
          <span className="font-bold text-stone-900">STUDY 013</span> // KARESANSUI ZEN SAND RAKE
        </div>
        <div className="flex items-center gap-4">
          <span>STONE COUNT: 10 BASALT SLABS</span>
          <span>DRAG TO RAKE MEDITATIVE SAND</span>
        </div>
      </div>

      {/* Canvas Rake Surface */}
      <div className="relative my-auto flex-1 flex items-center justify-center cursor-crosshair overflow-hidden rounded-lg shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] font-mono text-stone-600 bg-white/70 px-3 py-1.5 rounded backdrop-blur border border-stone-300">
          DRAG MOUSE ACROSS GRAVEL TO RAKE CONCENTRIC WAVES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-white/80 border border-[#D5C9B3] rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-stone-600">Rake Tines Width:</span>
            <input
              type="range"
              min="14"
              max="44"
              value={rakeWidth}
              onChange={(e) => setRakeWidth(Number(e.target.value))}
              className="w-28 accent-stone-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 text-stone-100 font-bold hover:bg-stone-800 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Smooth Sand</span>
          </button>
        </div>
      </div>
    </div>
  );
}
