import React, { useRef, useEffect, useState } from 'react';
import { Droplets, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment39HydrodynamicWaveTank() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [damping, setDamping] = useState(0.97);
  const [causticBloom, setCausticBloom] = useState(1.4);
  const waveBuffer1Ref = useRef<Float32Array | null>(null);
  const waveBuffer2Ref = useRef<Float32Array | null>(null);
  const dimsRef = useRef<{ w: number; h: number; cols: number; rows: number }>({ w: 900, h: 480, cols: 120, rows: 64 });

  const dropRipple = (cx: number, cy: number, strength = 18) => {
    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;
    const buf = waveBuffer1Ref.current;
    if (!buf) return;

    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          const d = Math.hypot(dx, dy);
          if (d <= 3) {
            buf[ny * cols + nx] += (1 - d / 3) * strength;
          }
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;

    let buf1 = new Float32Array(cols * rows);
    let buf2 = new Float32Array(cols * rows);
    waveBuffer1Ref.current = buf1;
    waveBuffer2Ref.current = buf2;

    const cellW = width / cols;
    const cellH = height / rows;

    let isRunning = true;
    let animId = 0;
    let frame = 0;

    const render = () => {
      if (!isRunning) return;
      frame++;

      // Random gentle ambient raindrops
      if (frame % 45 === 0) {
        dropRipple(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 12);
      }

      // Shallow water 2D wave equation step
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const idx = y * cols + x;
          buf2[idx] =
            ((buf1[idx - 1] + buf1[idx + 1] + buf1[idx - cols] + buf1[idx + cols]) * 0.5 -
              buf2[idx]) *
            damping;
        }
      }

      // Swap buffers
      const temp = buf1;
      buf1 = buf2;
      buf2 = temp;
      waveBuffer1Ref.current = buf1;
      waveBuffer2Ref.current = buf2;

      // Pool tile turquoise backdrop
      const poolGrad = ctx.createLinearGradient(0, 0, 0, height);
      poolGrad.addColorStop(0, '#0284c7');
      poolGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = poolGrad;
      ctx.fillRect(0, 0, width, height);

      // Submerged Ceramic Tile Typography "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      // Render Optical Wave Caustic Highlights
      ctx.save();
      for (let y = 1; y < rows - 1; y += 2) {
        for (let x = 1; x < cols - 1; x += 2) {
          const idx = y * cols + x;
          const hDiff = buf1[idx];

          if (Math.abs(hDiff) > 0.4) {
            // Refracted caustic displacement
            const causticAlpha = Math.min(1, Math.abs(hDiff) * 0.08 * causticBloom);
            ctx.fillStyle = `rgba(240, 253, 250, ${causticAlpha})`;
            ctx.beginPath();
            ctx.arc(x * cellW, y * cellH, cellW * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [damping, causticBloom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;
    const cx = Math.floor((x / canvas.width) * cols);
    const cy = Math.floor((y / canvas.height) * rows);
    dropRipple(cx, cy, 26);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#0369a1] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-sky-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-sky-700 pb-3 text-xs text-sky-200">
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-sky-300" />
          <span className="font-bold text-white">STUDY 039</span> // HYDRODYNAMIC WAVE TANK CAUSTICS
        </div>
        <div className="flex items-center gap-4">
          <span>MEDIUM: SHALLOW WATER REFRACTION</span>
          <span>DAMPING: {Math.round(damping * 100)}%</span>
        </div>
      </div>

      {/* Wave Tank Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-100 bg-sky-950/60 px-3 py-1.5 rounded backdrop-blur border border-sky-800">
          CLICK SURFACE TO GENERATE HYDRODYNAMIC WATER RIPPLES & CAUSTICS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-sky-950/80 border border-sky-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sky-300">Surface Tension Damping:</span>
            <input
              type="range"
              min="0.92"
              max="0.99"
              step="0.01"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-24 accent-sky-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sky-300">Caustic Bloom:</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.2"
              value={causticBloom}
              onChange={(e) => setCausticBloom(Number(e.target.value))}
              className="w-20 accent-sky-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              dropRipple(60, 32, 35);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold transition-colors"
          >
            <Sparkles size={12} />
            <span>Drop Center Splash</span>
          </button>
        </div>
      </div>
    </div>
  );
}
