import React, { useRef, useEffect, useState } from 'react';
import { Camera, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment27SlitScanDistortion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [slitSpeed, setSlitSpeed] = useState(2);
  const [warpFrequency, setWarpFrequency] = useState(0.04);
  const [colorMode, setColorMode] = useState<'stargate' | 'monochrome' | 'chroma'>('stargate');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    let isRunning = true;
    let animId = 0;
    let time = 0;
    let slitX = 0;

    // Buffer to hold accumulated slit scan columns
    const buffer = ctx.createImageData(width, height);
    const bufData = buffer.data;

    // Pre-clear to dark
    for (let i = 0; i < bufData.length; i += 4) {
      bufData[i] = 10;
      bufData[i + 1] = 12;
      bufData[i + 2] = 18;
      bufData[i + 3] = 255;
    }

    const render = () => {
      if (!isRunning) return;
      time += 0.04;

      // Virtual animated specimen stage rendered offscreen
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const offCtx = off.getContext('2d')!;

      // Undulating kinetic text
      offCtx.fillStyle = '#0a0d14';
      offCtx.fillRect(0, 0, width, height);

      const waveY = Math.sin(time * 2) * 60;
      offCtx.save();
      offCtx.translate(width / 2, height / 2 + waveY);
      offCtx.rotate(Math.sin(time) * 0.2);
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.font = `900 ${Math.min(width / 8, 88)}px 'Syne', sans-serif`;

      // Chromatic style
      if (colorMode === 'stargate') {
        const grad = offCtx.createLinearGradient(-300, 0, 300, 0);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, '#f59e0b');
        offCtx.fillStyle = grad;
      } else if (colorMode === 'chroma') {
        offCtx.fillStyle = '#22d3ee';
      } else {
        offCtx.fillStyle = '#ffffff';
      }

      offCtx.fillText('HELLO WORLD', 0, 0);
      offCtx.restore();

      const offData = offCtx.getImageData(0, 0, width, height).data;

      // Record column into buffer at slitX position with vertical warp
      const steps = Math.round(slitSpeed);
      for (let s = 0; s < steps; s++) {
        const curSlitX = (slitX + s) % width;
        const warpYOffset = Math.sin(curSlitX * warpFrequency + time) * 35;

        for (let y = 0; y < height; y++) {
          const sampleY = Math.floor(y + warpYOffset);
          if (sampleY >= 0 && sampleY < height) {
            const srcIdx = (sampleY * width + (width / 2)) * 4;
            const destIdx = (y * width + curSlitX) * 4;

            bufData[destIdx] = offData[srcIdx];
            bufData[destIdx + 1] = offData[srcIdx + 1];
            bufData[destIdx + 2] = offData[srcIdx + 2];
            bufData[destIdx + 3] = 255;
          }
        }
      }

      slitX = (slitX + steps) % width;

      // Draw accumulated slit scan buffer
      ctx.putImageData(buffer, 0, 0);

      // Draw active scanner slit line
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(slitX, 0);
      ctx.lineTo(slitX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [slitSpeed, warpFrequency, colorMode]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#0a0d14] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-pink-400" />
          <span className="font-bold text-stone-200">STUDY 027</span> // EXPERIMENTAL SLIT-SCAN STARGATE
        </div>
        <div className="flex items-center gap-4">
          <span>TEMPORAL DISPLACEMENT PHOTOGRAPHY</span>
          <span>SPEED: {slitSpeed} PX/FRAME</span>
        </div>
      </div>

      {/* Slit-Scan Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SPATIAL SLIT MAPS TIME-OFFSET COLUMNS CONTINUOUSLY
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Scan Speed:</span>
            <input
              type="range"
              min="1"
              max="6"
              value={slitSpeed}
              onChange={(e) => setSlitSpeed(Number(e.target.value))}
              className="w-20 accent-pink-400"
            />
            <span>{slitSpeed}x</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Warp Frequency:</span>
            <input
              type="range"
              min="0.01"
              max="0.12"
              step="0.01"
              value={warpFrequency}
              onChange={(e) => setWarpFrequency(Number(e.target.value))}
              className="w-20 accent-pink-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['stargate', 'chroma', 'monochrome'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setColorMode(m)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                colorMode === m ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
