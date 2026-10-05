import React, { useRef, useEffect, useState } from 'react';
import { Box, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment33IsometricVoxelMatrix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [extrudeHeight, setExtrudeHeight] = useState(24);
  const [waveSpeed, setWaveSpeed] = useState(1);
  const [theme, setTheme] = useState<'monolith' | 'cyber' | 'terracotta'>('monolith');

  const themes = {
    monolith: { top: '#f4f4f5', left: '#a1a1aa', right: '#52525b', bg: '#09090b' },
    cyber: { top: '#22d3ee', left: '#0284c7', right: '#0369a1', bg: '#020617' },
    terracotta: { top: '#fed7aa', left: '#ea580c', right: '#9a3412', bg: '#1c1917' },
  }[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    const cols = 48;
    const rows = 24;
    const voxelW = 16;
    const voxelH = 8;
    const originX = width / 2;
    const originY = height * 0.28;

    // Sample text bitmap
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d')!;
    offCtx.font = 'bold 9px sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);
    const textData = offCtx.getImageData(0, 0, cols, rows).data;

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.04 * waveSpeed;

      ctx.fillStyle = themes.bg;
      ctx.fillRect(0, 0, width, height);

      // Render isometric voxels back-to-front
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isLetter = textData[(r * cols + c) * 4 + 3] > 128;
          const wave = Math.sin(time + (c + r) * 0.3) * 6;
          const h = isLetter ? extrudeHeight + wave : 2;

          // Isometric coordinate transformation
          const isoX = originX + (c - r) * (voxelW * 0.5);
          const isoY = originY + (c + r) * (voxelH * 0.5) - h;

          // Draw Isometric 3D Voxel Cube (Top, Left, Right faces)
          // 1. Top Face
          ctx.beginPath();
          ctx.moveTo(isoX, isoY);
          ctx.lineTo(isoX + voxelW * 0.5, isoY + voxelH * 0.5);
          ctx.lineTo(isoX, isoY + voxelH);
          ctx.lineTo(isoX - voxelW * 0.5, isoY + voxelH * 0.5);
          ctx.closePath();
          ctx.fillStyle = isLetter ? themes.top : '#18181b';
          ctx.fill();

          // 2. Left Face
          ctx.beginPath();
          ctx.moveTo(isoX - voxelW * 0.5, isoY + voxelH * 0.5);
          ctx.lineTo(isoX, isoY + voxelH);
          ctx.lineTo(isoX, isoY + voxelH + h);
          ctx.lineTo(isoX - voxelW * 0.5, isoY + voxelH * 0.5 + h);
          ctx.closePath();
          ctx.fillStyle = isLetter ? themes.left : '#121214';
          ctx.fill();

          // 3. Right Face
          ctx.beginPath();
          ctx.moveTo(isoX, isoY + voxelH);
          ctx.lineTo(isoX + voxelW * 0.5, isoY + voxelH * 0.5);
          ctx.lineTo(isoX + voxelW * 0.5, isoY + voxelH * 0.5 + h);
          ctx.lineTo(isoX, isoY + voxelH + h);
          ctx.closePath();
          ctx.fillStyle = isLetter ? themes.right : '#0a0a0c';
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [extrudeHeight, waveSpeed, theme, themes]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#09090b] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Box size={14} className="text-zinc-300" />
          <span className="font-bold text-stone-200">STUDY 033</span> // ISOMETRIC VOXEL HEIGHTFIELD MATRIX
        </div>
        <div className="flex items-center gap-4">
          <span>PROJECTION: 30° ISOMETRIC</span>
          <span>EXTRUSION: {extrudeHeight}PX</span>
        </div>
      </div>

      {/* Voxel Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CHUNKY 3D VOXEL BLOCKS EXTRUDE TO BUILD RELIEF TYPOGRAPHY
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Voxel Height:</span>
            <input
              type="range"
              min="8"
              max="45"
              value={extrudeHeight}
              onChange={(e) => setExtrudeHeight(Number(e.target.value))}
              className="w-24 accent-zinc-300"
            />
            <span>{extrudeHeight}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Wave Velocity:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.2"
              value={waveSpeed}
              onChange={(e) => setWaveSpeed(Number(e.target.value))}
              className="w-20 accent-zinc-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['monolith', 'cyber', 'terracotta'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                theme === t ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
