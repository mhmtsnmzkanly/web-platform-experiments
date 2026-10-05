import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Sun, RotateCcw, Sliders } from 'lucide-react';

export default function Experiment05LiquidMercury() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viscosity, setViscosity] = useState(0.88);
  const [surfaceTension, setSurfaceTension] = useState(45);
  const [lightAngle, setLightAngle] = useState(45);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 400, y: 250, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 500);

    interface Blob {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      radius: number;
      phase: number;
    }

    // Sample letter coordinates
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d')!;

    offCtx.fillStyle = '#ffffff';
    offCtx.font = `bold ${Math.min(width / 9, 90)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);

    const data = offCtx.getImageData(0, 0, width, height).data;
    const blobs: Blob[] = [];
    const step = 20;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (data[(y * width + x) * 4 + 3] > 128) {
          blobs.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
            radius: Math.random() * 12 + 16,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    let isRunning = true;
    let animId = 0;
    let t = 0;

    const render = () => {
      if (!isRunning) return;
      t += 0.03;

      // Dark chrome studio background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 1.5);
      bgGrad.addColorStop(0, '#1c1c22');
      bgGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const radAngle = (lightAngle * Math.PI) / 180;
      const lx = Math.cos(radAngle);
      const ly = Math.sin(radAngle);

      // Update blobs
      const mouse = mouseRef.current;

      blobs.forEach((b) => {
        // Organic gentle breathing
        const breath = Math.sin(t + b.phase) * 3;
        const targetX = b.targetX + breath;
        const targetY = b.targetY + Math.cos(t * 0.8 + b.phase) * 3;

        // Spring to target
        const dx = targetX - b.x;
        const dy = targetY - b.y;
        b.vx = (b.vx + dx * 0.05) * viscosity;
        b.vy = (b.vy + dy * 0.05) * viscosity;

        // Mouse interaction (mercury adhesion / disturbance)
        const mdx = mouse.x - b.x;
        const mdy = mouse.y - b.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 140) {
          const force = (1 - mdist / 140) * (mouse.isDown ? 15 : -8);
          b.vx += (mdx / mdist) * force;
          b.vy += (mdy / mdist) * force;
        }

        b.x += b.vx;
        b.y += b.vy;
      });

      // Render mercury metaball droplets
      ctx.save();
      // Draw droplets
      blobs.forEach((b) => {
        const r = b.radius;
        const grad = ctx.createRadialGradient(
          b.x - lx * (r * 0.4),
          b.y - ly * (r * 0.4),
          r * 0.1,
          b.x,
          b.y,
          r
        );
        grad.addColorStop(0, '#ffffff'); // Chrome specular highlight
        grad.addColorStop(0.35, '#d4d4d8');
        grad.addColorStop(0.7, '#71717a');
        grad.addColorStop(1, '#27272a');

        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      // Specular glare glints
      blobs.forEach((b) => {
        const r = b.radius;
        ctx.beginPath();
        ctx.arc(b.x - lx * (r * 0.45), b.y - ly * (r * 0.45), r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [viscosity, surfaceTension, lightAngle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-stone-950 text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Droplet size={14} className="text-zinc-300" />
          <span className="text-zinc-200 font-bold">STUDY 005</span> // LIQUID MERCURY METABALLS
        </div>
        <div className="flex items-center gap-4">
          <span>SURFACE TENSION: {surfaceTension} mN/m</span>
          <span>FLUID DYNAMICS: VISCOUS MERCURY</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative my-auto flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={() => (mouseRef.current.isDown = true)}
          onMouseUp={() => (mouseRef.current.isDown = false)}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] font-mono text-zinc-400 bg-stone-900/60 px-2 py-1 rounded backdrop-blur border border-zinc-800">
          HOVER TO DISPLACE MERCURY · CLICK AND DRAG TO PULL DROPLETS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Viscosity */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Viscosity:</span>
            <input
              type="range"
              min="0.75"
              max="0.96"
              step="0.01"
              value={viscosity}
              onChange={(e) => setViscosity(Number(e.target.value))}
              className="w-24 accent-zinc-300"
            />
          </div>

          {/* Light Angle */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex items-center gap-1"><Sun size={12} /> Specular:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={lightAngle}
              onChange={(e) => setLightAngle(Number(e.target.value))}
              className="w-24 accent-zinc-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setViscosity(0.88);
              setLightAngle(45);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-zinc-200 rounded transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Mercury</span>
          </button>
        </div>
      </div>
    </div>
  );
}
