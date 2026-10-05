import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw, Activity } from 'lucide-react';

interface Spike {
  baseX: number;
  baseY: number;
  length: number;
  angle: number;
}

export default function Experiment21FerrofluidSpikes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticField, setMagneticField] = useState(80); // Gauss
  const [viscosity, setViscosity] = useState(0.85);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 450, y: 240, active: true });

  const letters = 'HELLO WORLD'.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Points along letters
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d')!;

    offCtx.font = `bold ${Math.min(width / 9, 86)}px "Syne", sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const spikes: Spike[] = [];
    const step = 8;

    for (let y = 10; y < height - 10; y += step) {
      for (let x = 10; x < width - 10; x += step) {
        if (imgData[(y * width + x) * 4 + 3] > 160) {
          spikes.push({
            baseX: x,
            baseY: y,
            length: 0,
            angle: 0,
          });
        }
      }
    }

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark metallic dish container
      const bg = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * 0.6);
      bg.addColorStop(0, '#18181b');
      bg.addColorStop(1, '#09090b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw Ferrofluid Spikes towards magnetic cursor
      ctx.save();
      for (let i = 0; i < spikes.length; i++) {
        const s = spikes[i];
        const dx = mouse.x - s.baseX;
        const dy = mouse.y - s.baseY;
        const dist = Math.hypot(dx, dy);

        // Magnetic attraction curve
        const targetLen = Math.max(0, (1 - dist / (magneticField * 4)) * 26);
        s.length += (targetLen - s.length) * 0.15;
        s.angle = Math.atan2(dy, dx);

        const tipX = s.baseX + Math.cos(s.angle) * s.length;
        const tipY = s.baseY + Math.sin(s.angle) * s.length;

        // Draw spiky organic ferrofluid cone
        ctx.beginPath();
        ctx.moveTo(s.baseX - 2, s.baseY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(s.baseX + 2, s.baseY);
        ctx.closePath();

        // Oily dark gloss with subtle iridescent sheen
        ctx.fillStyle = dist < 120 ? '#38bdf8' : '#0a0a0c';
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();

        // Gloss tip highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Magnetic Pole cursor indicator
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [magneticField, viscosity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#09090b] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Magnet size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 021</span> // MAGNETIC FERROFLUID SPIKES
        </div>
        <div className="flex items-center gap-4">
          <span>SURFACE CONES: ROSENSWEIG INSTABILITY</span>
          <span>FIELD: {magneticField} GAUSS</span>
        </div>
      </div>

      {/* Ferrofluid Stage */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-none">
        <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          HOVER NEODYMIUM MAGNETIC POLE TO INDUCE SURFACE SPIKES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Magnetic Strength:</span>
            <input
              type="range"
              min="30"
              max="160"
              value={magneticField}
              onChange={(e) => setMagneticField(Number(e.target.value))}
              className="w-28 accent-cyan-400"
            />
            <span>{magneticField}G</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMagneticField(80)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Pole</span>
          </button>
        </div>
      </div>
    </div>
  );
}
