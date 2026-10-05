import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw, Droplets } from 'lucide-react';

export default function Experiment32FluidNavierStokesSmoke() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viscosity, setViscosity] = useState(0.96);
  const [smokeColor, setSmokeColor] = useState<'aurora' | 'ink' | 'crimson'>('aurora');
  const mouseRef = useRef<{ x: number; y: number; lastX: number; lastY: number; isDown: boolean }>({
    x: 450,
    y: 240,
    lastX: 450,
    lastY: 240,
    isDown: false,
  });

  const smokeThemes = {
    aurora: ['#06b6d4', '#10b981', '#3b82f6', '#8b5cf6'],
    ink: ['#ffffff', '#d4d4d8', '#a1a1aa', '#71717a'],
    crimson: ['#f43f5e', '#fb923c', '#e11d48', '#f59e0b'],
  }[smokeColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Particles for smoke simulation
    interface SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    const particles: SmokeParticle[] = [];

    // Obstacle text "HELLO WORLD" rendered offscreen to test collisions
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);
    const textData = offCtx.getImageData(0, 0, width, height).data;

    let isRunning = true;
    let animId = 0;
    let frame = 0;

    const render = () => {
      if (!isRunning) return;
      frame++;

      // Semi-transparent dark background for fluid trails
      ctx.fillStyle = 'rgba(7, 10, 15, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Inject smoke along mouse velocity
      const mouse = mouseRef.current;
      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 1 || mouse.isDown) {
        for (let k = 0; k < 6; k++) {
          particles.push({
            x: mouse.x + (Math.random() - 0.5) * 16,
            y: mouse.y + (Math.random() - 0.5) * 16,
            vx: dx * 0.35 + (Math.random() - 0.5) * 2,
            vy: dy * 0.35 + (Math.random() - 0.5) * 2 - 0.5,
            life: 1,
            maxLife: Math.random() * 80 + 40,
            size: Math.random() * 12 + 8,
            color: smokeThemes[Math.floor(Math.random() * smokeThemes.length)],
          });
        }
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      // Update and draw smoke particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= viscosity;
        p.vy *= viscosity;
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.25;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft smoke puff
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.3;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw Colliding Typographic Obstacle Core "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = smokeThemes[0];
      ctx.shadowBlur = 15;
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [viscosity, smokeColor, smokeThemes]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#070a0f] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 032</span> // EULERIAN FLUID NAVIER-STOKES SMOKE
        </div>
        <div className="flex items-center gap-4">
          <span>VORTEX SHEDDING FLOW</span>
          <span>DAMPING: {Math.round(viscosity * 100)}%</span>
        </div>
      </div>

      {/* Smoke Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={() => (mouseRef.current.isDown = true)}
          onMouseUp={() => (mouseRef.current.isDown = false)}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          DRAG CURSOR ACROSS SCREEN TO INJECT SWIRLING SMOKE EDDIES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Viscosity Damping:</span>
            <input
              type="range"
              min="0.88"
              max="0.99"
              step="0.01"
              value={viscosity}
              onChange={(e) => setViscosity(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['aurora', 'ink', 'crimson'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSmokeColor(c)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                smokeColor === c ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
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
