import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RefreshCw, Zap } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export default function Experiment03ParticleFlocking() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleTheme, setParticleTheme] = useState<'cyan' | 'amber' | 'aurora' | 'monochrome'>('cyan');
  const [elasticity, setElasticity] = useState(0.06);
  const [repulsionRadius, setRepulsionRadius] = useState(100);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number>(0);

  const themeColors = {
    cyan: ['#22d3ee', '#38bdf8', '#0284c7', '#e0f2fe'],
    amber: ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7'],
    aurora: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
    monochrome: ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a'],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 520);

    // Render "HELLO WORLD" offscreen to extract pixel coordinate targets
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d')!;

    offCtx.fillStyle = '#ffffff';
    offCtx.font = `bold ${Math.min(width / 8.5, 110)}px 'Plus Jakarta Sans', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const targets: { x: number; y: number }[] = [];
    const step = 5; // density sampling

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = imgData[(y * width + x) * 4 + 3];
        if (alpha > 128) {
          targets.push({ x, y });
        }
      }
    }

    const currentPalette = themeColors[particleTheme];
    const newParticles: Particle[] = targets.map((t) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      originX: t.x,
      originY: t.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
      size: Math.random() * 2 + 1.2,
    }));

    particlesRef.current = newParticles;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.fillStyle = 'rgba(9, 9, 11, 0.22)'; // Motion blur trail
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Spring force towards origin target
        const dx = p.originX - p.x;
        const dy = p.originY - p.y;
        p.vx += dx * elasticity;
        p.vy += dy * elasticity;

        // Friction damping
        p.vx *= 0.86;
        p.vy *= 0.86;

        // Mouse repulsion
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          if (dist < repulsionRadius) {
            const force = (1 - dist / repulsionRadius) * 14;
            const angle = Math.atan2(mdy, mdx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [particleTheme, elasticity, repulsionRadius]);

  const triggerExplosion = () => {
    particlesRef.current.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 25 + 10;
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-stone-950 text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800">
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-stone-200 font-bold">STUDY 003</span> // KINETIC PARTICLE FLOCKING
        </div>
        <div className="flex items-center gap-4">
          <span>PARTICLES: ~{particlesRef.current.length || 1400}</span>
          <span>DISPERSION: SPRING-DAMPED</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center cursor-crosshair overflow-hidden rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={triggerExplosion}
          className="w-full h-[460px] block rounded-lg"
        />
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono text-stone-500 bg-stone-900/60 px-2 py-1 rounded backdrop-blur">
          MOVE CURSOR TO DISPERSE · CLICK TO DETONATE
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Spring Elasticity */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Tension:</span>
            <input
              type="range"
              min="0.02"
              max="0.14"
              step="0.01"
              value={elasticity}
              onChange={(e) => setElasticity(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>

          {/* Repulsion Radius */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Radius:</span>
            <input
              type="range"
              min="40"
              max="200"
              value={repulsionRadius}
              onChange={(e) => setRepulsionRadius(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
        </div>

        {/* Color Palette & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1">
            {(['cyan', 'amber', 'aurora', 'monochrome'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setParticleTheme(th)}
                className={`px-2.5 py-1 uppercase rounded text-[11px] transition-all ${
                  particleTheme === th
                    ? 'bg-stone-100 text-stone-900 font-bold'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {th}
              </button>
            ))}
          </div>

          <button
            onClick={triggerExplosion}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold rounded transition-colors"
          >
            <Zap size={13} />
            <span>PULSE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
