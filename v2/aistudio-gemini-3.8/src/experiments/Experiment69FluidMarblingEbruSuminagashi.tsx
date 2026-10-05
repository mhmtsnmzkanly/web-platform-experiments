import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Wind, RotateCcw, Sparkles } from 'lucide-react';

interface InkRing {
  x: number;
  y: number;
  r: number;
  color: string;
}

export default function Experiment69FluidMarblingEbruSuminagashi() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [combAngle, setCombAngle] = useState(45);
  const ringsRef = useRef<InkRing[]>([]);

  const colors = ['#dc2626', '#1d4ed8', '#ca8a04', '#047857', '#7c3aed'];

  const dropInkRings = (cx: number, cy: number) => {
    for (let i = 0; i < 6; i++) {
      ringsRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        r: Math.random() * 80 + 30,
        color: colors[i % colors.length],
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize with central drops
    ringsRef.current = [];
    dropInkRings(centerX, centerY);

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Viscous water marbling bath shallow tray
      ctx.fillStyle = '#f5efe6';
      ctx.fillRect(0, 0, width, height);

      const rings = ringsRef.current;

      // Draw Ebru floating ink rings with combing deformation
      ctx.save();
      rings.forEach((ring) => {
        ctx.beginPath();
        const numPts = 60;
        for (let i = 0; i <= numPts; i++) {
          const theta = (i / numPts) * Math.PI * 2;
          const combMod = Math.sin(theta * 3 + (combAngle * Math.PI) / 180) * 12;
          const px = ring.x + Math.cos(theta) * (ring.r + combMod);
          const py = ring.y + Math.sin(theta) * (ring.r + combMod);

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = `${ring.color}33`;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();

      // Transferred Paper Typography "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 74px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = '#1c1917';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.fillText('HELLO WORLD', centerX, centerY);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [combAngle]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dropInkRings(x, y);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#f5efe6] text-[#1c1917] rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-300 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-300 pb-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Droplet size={14} className="text-amber-800" />
          <span className="font-bold text-stone-900">STUDY 069</span> // EBRU SUMINAGASHI WATER MARBLING
        </div>
        <div className="flex items-center gap-4">
          <span>SURFACE TENSION: OX-GALL VISCOSITY</span>
          <span>COMB ANGLE: {combAngle}°</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-700 bg-white/70 px-3 py-1.5 rounded backdrop-blur border border-stone-300">
          CLICK SHALLOW WATER BATH TO DROP NATURAL PIGMENT RINGS
        </div>
      </div>

      <div className="relative z-10 bg-white/80 border border-stone-300 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-600">Comb Angle:</span>
            <input
              type="range"
              min="0"
              max="180"
              value={combAngle}
              onChange={(e) => setCombAngle(Number(e.target.value))}
              className="w-24 accent-stone-900"
            />
            <span>{combAngle}°</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              ringsRef.current = [];
              dropInkRings(450, 240);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 text-stone-100 font-bold hover:bg-stone-800 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Clear Water Bath</span>
          </button>
        </div>
      </div>
    </div>
  );
}
