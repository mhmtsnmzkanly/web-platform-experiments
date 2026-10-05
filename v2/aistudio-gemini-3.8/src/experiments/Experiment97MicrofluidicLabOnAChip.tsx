import React, { useRef, useEffect, useState } from 'react';
import { Droplet, Sliders, RotateCcw } from 'lucide-react';

interface DyeDroplet {
  x: number;
  y: number;
  color: string;
  radius: number;
  speed: number;
}

export default function Experiment97MicrofluidicLabOnAChip() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flowRate, setFlowRate] = useState(2.4); // uL/min
  const [dyeType, setDyeType] = useState<'fluorescein' | 'rhodamine'>('fluorescein');
  const dropletsRef = useRef<DyeDroplet[]>([]);

  useEffect(() => {
    dropletsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 800 + 50,
      y: Math.random() * 20 - 10,
      color: dyeType === 'fluorescein' ? '#a3e635' : '#f43f5e',
      radius: Math.random() * 3 + 2,
      speed: Math.random() * 0.8 + 0.6,
    }));
  }, [dyeType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Transparent PDMS silicone elastomer micro-chip with UV darkfield
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Microfluidic PDMS molded channel boundaries (100 micron width)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 48;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Serpentine microchannel path through "HELLO WORLD"
      ctx.beginPath();
      ctx.moveTo(60, cy);
      ctx.lineTo(cx - 200, cy);
      ctx.bezierCurveTo(cx - 100, cy - 80, cx + 100, cy + 80, cx + 200, cy);
      ctx.lineTo(width - 60, cy);
      ctx.stroke();

      // Channel fluid core
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 42;
      ctx.stroke();

      // Update and draw fluorescent micro-droplets
      dropletsRef.current.forEach((d) => {
        d.x += flowRate * d.speed;
        if (d.x > width - 60) d.x = 60;

        // Path Y follows serpentine channel
        const relX = (d.x - cx) / 200;
        const channelCenterY = cy + Math.sin(relX * Math.PI) * 40;

        ctx.fillStyle = d.color;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(d.x, channelCenterY + d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Typographic Lab-on-a-chip specimen "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 64px "Syne", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = dyeType === 'fluorescein' ? '#a3e635' : '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `PDMS MICROFLUIDIC CHIP · LOW REYNOLDS NUMBER LAMINAR FLOW (Re << 1) · FLOW: ${flowRate.toFixed(1)} μL/min`,
        cx,
        cy + 90
      );
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [flowRate, dyeType]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Droplet className="text-lime-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 097: PDMS MICROFLUIDIC LAB-ON-A-CHIP
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Laminar Capillary Flow & Fluorescein Droplet Sorting
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFlowRate(2.4);
              setDyeType('fluorescein');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Flush Channels</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-lime-400" /> Syringe Pump Flow:
              </span>
              <span className="text-lime-400 font-bold">{flowRate.toFixed(1)} μL/min</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.2"
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              className="w-full accent-lime-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Fluorophore Dye:</span>
              <span className="text-lime-400 font-bold uppercase">{dyeType}</span>
            </div>
            <div className="flex gap-2">
              {(['fluorescein', 'rhodamine'] as const).map((dye) => (
                <button
                  key={dye}
                  onClick={() => setDyeType(dye)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    dyeType === dye
                      ? 'bg-lime-400 text-stone-950 font-bold border-lime-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {dye}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
