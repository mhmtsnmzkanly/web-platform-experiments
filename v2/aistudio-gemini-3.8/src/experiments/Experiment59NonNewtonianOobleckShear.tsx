import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment59NonNewtonianOobleckShear() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shearThreshold, setShearThreshold] = useState(15);
  const [solidificationTime, setSolidificationTime] = useState(0);
  const mouseRef = useRef<{ x: number; y: number; lastX: number; lastY: number; velocity: number }>({
    x: 450,
    y: 240,
    lastX: 450,
    lastY: 240,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    let isRunning = true;
    let animId = 0;
    let t = 0;

    const render = () => {
      if (!isRunning) return;
      t += 0.03;

      const mouse = mouseRef.current;
      const isSolid = mouse.velocity > shearThreshold;

      // Dark laboratory basin
      ctx.fillStyle = '#100f14';
      ctx.fillRect(0, 0, width, height);

      // Cornstarch milky white pool
      const poolGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width * 0.5);
      if (isSolid) {
        // Fractured chalky solid state
        poolGrad.addColorStop(0, '#f4f4f5');
        poolGrad.addColorStop(1, '#a1a1aa');
      } else {
        // Viscous glossy fluid state
        poolGrad.addColorStop(0, '#fafaf9');
        poolGrad.addColorStop(1, '#d6d3d1');
      }
      ctx.fillStyle = poolGrad;
      ctx.fillRect(40, 40, width - 80, height - 80);

      // Fracture cracks if solid impact
      if (isSolid) {
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2;
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(mouse.x + Math.cos(a) * 45, mouse.y + Math.sin(a) * 45);
          ctx.stroke();
        }
      }

      // "HELLO WORLD" Relief in Oobleck pool
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 72px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = '#292524';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = isSolid ? 2 : 12;
      ctx.fillText('HELLO WORLD', centerX, centerY);
      ctx.restore();

      // Decay velocity
      mouse.velocity *= 0.88;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [shearThreshold]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    const dx = x - mouse.lastX;
    const dy = y - mouse.lastY;
    mouse.velocity = Math.hypot(dx, dy);
    mouse.x = x;
    mouse.y = y;
    mouse.lastX = x;
    mouse.lastY = y;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#100f14] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Droplet size={14} className="text-stone-300" />
          <span className="font-bold text-stone-200">STUDY 059</span> // NON-NEWTONIAN SHEAR-THICKENING OOBLECK
        </div>
        <div className="flex items-center gap-4">
          <span>RHEOLOGY: DILATANT SHEAR-THICKENING</span>
          <span>THRESHOLD: {shearThreshold} PX/FRAME</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-700 bg-white/70 px-3 py-1.5 rounded backdrop-blur border border-stone-300">
          MOVE SLOWLY TO FLOW LIKE LIQUID · STRIKE RAPIDLY TO SOLIDIFY AND FRACTURE
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Shear Stress Limit:</span>
            <input
              type="range"
              min="8"
              max="30"
              value={shearThreshold}
              onChange={(e) => setShearThreshold(Number(e.target.value))}
              className="w-24 accent-stone-300"
            />
            <span>{shearThreshold}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Dilatant Viscosity Transition</span>
        </div>
      </div>
    </div>
  );
}
