import React, { useRef, useEffect, useState } from 'react';
import { Microscope, Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface PollenGrain {
  x: number;
  y: number;
  history: { x: number; y: number }[];
  color: string;
}

export default function Experiment46MicroscopicBrownianMotion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureK, setTemperatureK] = useState(298); // Kelvin
  const [trailLength, setTrailLength] = useState(40);
  const grainsRef = useRef<PollenGrain[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#34d399', '#a855f7', '#fb923c'];

    // Sample letter points for initial grain cluster locations
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

    const newGrains: PollenGrain[] = [];
    const step = 20;

    for (let y = 10; y < height - 10; y += step) {
      for (let x = 10; x < width - 10; x += step) {
        if (data[(y * width + x) * 4 + 3] > 160) {
          newGrains.push({
            x,
            y,
            history: [{ x, y }],
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    }

    grainsRef.current = newGrains;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Microscope slide illuminated circular aperture background
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Einstein-Smoluchowski diffusion step: delta_x = sqrt(2 * D * dt) * N(0, 1)
      const thermalKick = (temperatureK / 298) * 2.8;

      const grains = grainsRef.current;
      grains.forEach((g) => {
        // Random stochastic walk kick
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() + Math.random() - 1) * thermalKick;

        g.x += Math.cos(angle) * dist;
        g.y += Math.sin(angle) * dist;

        // Boundary bounce
        if (g.x < 10) g.x = 10;
        if (g.x > width - 10) g.x = width - 10;
        if (g.y < 10) g.y = 10;
        if (g.y > height - 10) g.y = height - 10;

        g.history.push({ x: g.x, y: g.y });
        if (g.history.length > trailLength) g.history.shift();

        // Draw Brownian random walk trail
        if (g.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(g.history[0].x, g.history[0].y);
          for (let p = 1; p < g.history.length; p++) {
            ctx.lineTo(g.history[p].x, g.history[p].y);
          }
          ctx.strokeStyle = g.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Particle head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(g.x, g.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle typographic watermark in center
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [temperatureK, trailLength]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06070a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Microscope size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 046</span> // 1827 MICROSCOPIC BROWNIAN DIFFUSION
        </div>
        <div className="flex items-center gap-4">
          <span>COLLOIDAL POLLEN GRAINS: {grainsRef.current.length}</span>
          <span>THERMAL TEMP: {temperatureK} K</span>
        </div>
      </div>

      {/* Microscope Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          STOCHASTIC MOLECULAR COLLISIONS SCATTER MICROSCOPIC PARTICLES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Fluid Temp:</span>
            <input
              type="range"
              min="270"
              max="370"
              value={temperatureK}
              onChange={(e) => setTemperatureK(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span>{temperatureK} K</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Trail Length:</span>
            <input
              type="range"
              min="10"
              max="80"
              value={trailLength}
              onChange={(e) => setTrailLength(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Einstein-Smoluchowski Diffusivity</span>
        </div>
      </div>
    </div>
  );
}
