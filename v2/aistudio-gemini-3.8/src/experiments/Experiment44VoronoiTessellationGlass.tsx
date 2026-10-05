import React, { useRef, useEffect, useState } from 'react';
import { Layers, Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface Site {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  color: string;
}

export default function Experiment44VoronoiTessellationGlass() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wireframe, setWireframe] = useState(true);
  const [jitter, setJitter] = useState(1);
  const sitesRef = useRef<Site[]>([]);

  const palette = ['#0284c7', '#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#fbbf24'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Sample letter points for Voronoi seeds
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

    const newSites: Site[] = [];
    const step = 18;

    for (let y = 10; y < height - 10; y += step) {
      for (let x = 10; x < width - 10; x += step) {
        if (data[(y * width + x) * 4 + 3] > 140) {
          newSites.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            color: palette[Math.floor(Math.random() * palette.length)],
          });
        }
      }
    }

    sitesRef.current = newSites;

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.03 * jitter;

      // Dark glass studio backdrop
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      const sites = sitesRef.current;

      // Jitter site points gently
      sites.forEach((s, i) => {
        s.x = s.baseX + Math.sin(time + i) * 6;
        s.y = s.baseY + Math.cos(time * 0.8 + i) * 6;
      });

      // Delaunay / Voronoi cell connection visualization
      ctx.save();
      for (let i = 0; i < sites.length; i++) {
        const s1 = sites[i];

        // Draw connections to nearby sites
        for (let j = i + 1; j < sites.length; j++) {
          const s2 = sites[j];
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);

          if (dist < 45) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - dist / 45)})`;
            ctx.lineWidth = wireframe ? 1.5 : 0.5;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }

        // Draw Voronoi site crystal node
        ctx.fillStyle = s1.color;
        ctx.shadowColor = s1.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s1.x, s1.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Inscribed Typographic Core Silhouette
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [wireframe, jitter]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#090a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 044</span> // VORONOI TESSELLATION STAINED GLASS
        </div>
        <div className="flex items-center gap-4">
          <span>SITES: {sitesRef.current.length} CRYSTAL SEEDS</span>
          <span>TESSELLATION: DELAUNAY DUAL</span>
        </div>
      </div>

      {/* Voronoi Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          DELAUNAY TESSELLATION RECONSTRUCTS DYNAMIC CRYSTAL FACETS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Cell Jitter:</span>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.2"
              value={jitter}
              onChange={(e) => setJitter(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              wireframe ? 'bg-sky-500 text-stone-950 font-bold border-sky-400' : 'border-stone-800 text-stone-400'
            }`}
          >
            Delaunay Struts: {wireframe ? 'THICK' : 'THIN'}
          </button>
        </div>
      </div>
    </div>
  );
}
