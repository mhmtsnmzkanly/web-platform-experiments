import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment56NeonPlasmaGlobeArc() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [powerLevel, setPowerLevel] = useState(85);
  const mouseRef = useRef<{ x: number; y: number; isTouching: boolean }>({ x: 450, y: 240, isTouching: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const globeRadius = Math.min(width, height) * 0.44;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark vacuum laboratory backdrop
      ctx.fillStyle = 'rgba(5, 5, 8, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Glass globe spherical enclosure
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#08080f';
      ctx.fill();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Central High-Frequency Tesla Electrode Core
      const coreRadius = 24;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, coreRadius);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, '#c084fc');
      coreGrad.addColorStop(1, '#6b21a8');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Generate Plasma Filaments
      const numFilaments = Math.floor(powerLevel * 0.2);
      const mouse = mouseRef.current;

      for (let f = 0; f < numFilaments; f++) {
        let curX = centerX;
        let curY = centerY;

        // Target: either mouse cursor touch or random point on glass sphere
        let targetX = 0;
        let targetY = 0;

        if (mouse.isTouching && f < numFilaments * 0.7) {
          targetX = mouse.x;
          targetY = mouse.y;
        } else {
          const a = Math.random() * Math.PI * 2;
          targetX = centerX + Math.cos(a) * globeRadius;
          targetY = centerY + Math.sin(a) * globeRadius;
        }

        ctx.strokeStyle = f % 2 === 0 ? '#c084fc' : '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(curX, curY);

        const segments = 8;
        for (let s = 1; s <= segments; s++) {
          const t = s / segments;
          const nextX = centerX + (targetX - centerX) * t + (Math.random() - 0.5) * 18;
          const nextY = centerY + (targetY - centerY) * t + (Math.random() - 0.5) * 18;
          ctx.lineTo(nextX, nextY);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Floating Glow Typographic Centerpiece "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 42px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', centerX, centerY + 85);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [powerLevel]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.isTouching = true;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#050508] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span className="font-bold text-stone-200">STUDY 056</span> // TESLA HIGH-FREQUENCY PLASMA GLOBE
        </div>
        <div className="flex items-center gap-4">
          <span>GAS: NEON-XENON MIXTURE</span>
          <span>POWER: {powerLevel}%</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => (mouseRef.current.isTouching = false)}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-purple-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          TOUCH GLASS SPHERE WITH CURSOR TO ATTRACT FILAMENTS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Tesla Coil RF Power:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={powerLevel}
              onChange={(e) => setPowerLevel(Number(e.target.value))}
              className="w-24 accent-purple-400"
            />
            <span>{powerLevel}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Dielectric Glass Arc Discharge</span>
        </div>
      </div>
    </div>
  );
}
