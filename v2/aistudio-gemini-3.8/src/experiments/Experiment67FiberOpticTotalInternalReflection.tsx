import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

interface FiberStrand {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  ctrlX: number;
  ctrlY: number;
  pulses: number[];
}

export default function Experiment67FiberOpticTotalInternalReflection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pulseSpeed, setPulseSpeed] = useState(2);
  const [coreIndex, setCoreIndex] = useState(1.48); // silica core
  const fibersRef = useRef<FiberStrand[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Target terminal points for "HELLO WORLD"
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', width / 2, height * 0.45);
    const data = offCtx.getImageData(0, 0, width, height).data;

    const endpoints: { x: number; y: number }[] = [];
    for (let y = 10; y < height - 10; y += 14) {
      for (let x = 10; x < width - 10; x += 14) {
        if (data[(y * width + x) * 4 + 3] > 180) {
          endpoints.push({ x, y });
        }
      }
    }

    // Fiber strands bundle emerging from bottom center transmitter
    const startX = width / 2;
    const startY = height - 20;

    const strands: FiberStrand[] = endpoints.map((pt) => ({
      startX,
      startY,
      endX: pt.x,
      endY: pt.y,
      ctrlX: startX + (pt.x - startX) * 0.5 + (Math.random() - 0.5) * 60,
      ctrlY: startY - (startY - pt.y) * 0.4,
      pulses: [Math.random(), Math.random() + 0.5],
    }));

    fibersRef.current = strands;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark telecom optoelectronics cleanroom
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, width, height);

      const strands = fibersRef.current;

      // Draw glass core fibers
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;

      strands.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(f.startX, f.startY);
        ctx.quadraticCurveTo(f.ctrlX, f.ctrlY, f.endX, f.endY);
        ctx.stroke();

        // Advance and draw laser pulses propagating through total internal reflection
        f.pulses.forEach((pos, pIdx) => {
          f.pulses[pIdx] = (pos + 0.008 * pulseSpeed) % 1;
          const t = f.pulses[pIdx];

          // Quadratic Bezier interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const bx = Math.pow(1 - t, 2) * f.startX + 2 * (1 - t) * t * f.ctrlX + Math.pow(t, 2) * f.endX;
          const by = Math.pow(1 - t, 2) * f.startY + 2 * (1 - t) * t * f.ctrlY + Math.pow(t, 2) * f.endY;

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Fiber emitting tip light spot
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(f.endX, f.endY, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // Laser transmitter diode module box at bottom
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(startX - 60, startY - 8, 120, 20);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LASER DIODE ARRAY 1550 NM', startX, startY + 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [pulseSpeed, coreIndex]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#05070d] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 067</span> // TOTAL INTERNAL REFLECTION FIBER OPTICS
        </div>
        <div className="flex items-center gap-4">
          <span>STRANDS: {fibersRef.current.length} GLASS CORES</span>
          <span>SILICA INDEX: n={coreIndex}</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          COHERENT LASER PULSES GUIDE THROUGH GLASS CORES VIA TOTAL INTERNAL REFLECTION
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Pulse Velocity:</span>
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.5"
              value={pulseSpeed}
              onChange={(e) => setPulseSpeed(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{pulseSpeed}x</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Snell Critical Angle: θ_c = arcsin(n2/n1)</span>
        </div>
      </div>
    </div>
  );
}
