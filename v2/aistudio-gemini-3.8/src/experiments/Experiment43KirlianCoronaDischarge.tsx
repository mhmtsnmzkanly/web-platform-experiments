import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface Streamer {
  x: number;
  y: number;
  angle: number;
  length: number;
  segments: { x: number; y: number }[];
}

export default function Experiment43KirlianCoronaDischarge() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [voltageKV, setVoltageKV] = useState(38); // Kilovolts
  const [plasmaColor, setPlasmaColor] = useState<'violet' | 'cyan' | 'amber'>('violet');

  const colors = {
    violet: { core: '#ffffff', streamer: '#a855f7', glow: 'rgba(168, 85, 247, 0.8)' },
    cyan: { core: '#ffffff', streamer: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)' },
    amber: { core: '#ffffff', streamer: '#f59e0b', glow: 'rgba(245, 158, 11, 0.8)' },
  }[plasmaColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Outline sample points for "HELLO WORLD"
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);
    const data = offCtx.getImageData(0, 0, width, height).data;

    const edgePoints: { x: number; y: number }[] = [];
    for (let y = 10; y < height - 10; y += 8) {
      for (let x = 10; x < width - 10; x += 8) {
        if (data[(y * width + x) * 4 + 3] > 180) {
          const isEdge =
            data[((y - 1) * width + x) * 4 + 3] <= 180 ||
            data[((y + 1) * width + x) * 4 + 3] <= 180 ||
            data[(y * width + (x - 1)) * 4 + 3] <= 180 ||
            data[(y * width + (x + 1)) * 4 + 3] <= 180;
          if (isEdge) {
            edgePoints.push({ x, y });
          }
        }
      }
    }

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark photographic emulsion background
      ctx.fillStyle = 'rgba(5, 5, 10, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Generate electric plasma streamers from edge points
      ctx.save();
      ctx.strokeStyle = colors.streamer;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.2;

      const numStreamers = Math.floor(voltageKV * 0.8);
      for (let s = 0; s < numStreamers; s++) {
        if (edgePoints.length === 0) break;
        const pt = edgePoints[Math.floor(Math.random() * edgePoints.length)];
        const baseAngle = Math.random() * Math.PI * 2;
        const maxLen = Math.random() * (voltageKV * 0.8) + 10;

        let curX = pt.x;
        let curY = pt.y;

        ctx.beginPath();
        ctx.moveTo(curX, curY);

        for (let seg = 0; seg < 6; seg++) {
          const angle = baseAngle + (Math.random() - 0.5) * 1.4;
          curX += Math.cos(angle) * (maxLen / 6);
          curY += Math.sin(angle) * (maxLen / 6);
          ctx.lineTo(curX, curY);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Inscribed Solid Glyph Core
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = colors.streamer;
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [voltageKV, plasmaColor, colors]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#05050a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: colors.streamer }} />
          <span className="font-bold text-stone-200">STUDY 043</span> // KIRLIAN HIGH-VOLTAGE CORONA AURA
        </div>
        <div className="flex items-center gap-4">
          <span>CORONA FIELD: {voltageKV} KV RF</span>
          <span>DIELECTRIC IONIZATION STREAMERS</span>
        </div>
      </div>

      {/* Corona Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          HIGH-FREQUENCY CORONA IONIZATION DISCHARGES FROM LETTER EDGES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Excitation Voltage:</span>
            <input
              type="range"
              min="15"
              max="70"
              value={voltageKV}
              onChange={(e) => setVoltageKV(Number(e.target.value))}
              className="w-24 accent-purple-400"
            />
            <span>{voltageKV} kV</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['violet', 'cyan', 'amber'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setPlasmaColor(c)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                plasmaColor === c ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
