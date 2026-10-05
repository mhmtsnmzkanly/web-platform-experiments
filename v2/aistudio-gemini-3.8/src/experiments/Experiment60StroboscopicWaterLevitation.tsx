import React, { useRef, useEffect, useState } from 'react';
import { Droplets, Sliders, Zap } from 'lucide-react';

interface Drop {
  x: number;
  y: number;
  speed: number;
}

export default function Experiment60StroboscopicWaterLevitation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strobeFreq, setStrobeFreq] = useState(50.2); // Hz
  const [pumpRate, setPumpRate] = useState(50.0); // Droplet frequency Hz
  const dropsRef = useRef<Drop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Initialize regular stream of water droplets
    const numColumns = 14;
    const spacing = (width - 160) / numColumns;
    const startX = 80;

    const newDrops: Drop[] = [];
    for (let c = 0; c < numColumns; c++) {
      for (let y = 0; y < height; y += 35) {
        newDrops.push({
          x: startX + c * spacing,
          y: y + (Math.random() - 0.5) * 5,
          speed: 4,
        });
      }
    }
    dropsRef.current = newDrops;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark optical strobe stage
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, width, height);

      // Stroboscopic beat frequency: Delta f = pumpRate - strobeFreq
      // If Delta f < 0 -> appears to levitate upwards!
      // If Delta f = 0 -> appears frozen!
      // If Delta f > 0 -> appears falling slowly!
      const apparentSpeed = (pumpRate - strobeFreq) * 1.5;

      const drops = dropsRef.current;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += apparentSpeed;

        if (d.y > height) d.y = 0;
        if (d.y < 0) d.y = height;

        // Draw illuminated water droplet bead
        ctx.beginPath();
        ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Droplet specular glint
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
        ctx.fillStyle = '#38bdf8';
      }
      ctx.shadowBlur = 0;

      // Inscribed Typographic Backdrop
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 74px "Syne", sans-serif';
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
  }, [strobeFreq, pumpRate]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06080d] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 060</span> // STROBOSCOPIC WATER LEVITATION
        </div>
        <div className="flex items-center gap-4">
          <span>STROBE: {strobeFreq.toFixed(1)} HZ</span>
          <span>APPARENT FLOW: {strobeFreq > pumpRate ? 'LEVITATING UP' : strobeFreq === pumpRate ? 'SUSPENDED' : 'FALLING'}</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          STROBOSCOPIC FLASH SYNCHRONIZATION CREATES WATER LEVITATION ILLUSION
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Strobe Flash Rate:</span>
            <input
              type="range"
              min="48"
              max="52"
              step="0.1"
              value={strobeFreq}
              onChange={(e) => setStrobeFreq(Number(e.target.value))}
              className="w-28 accent-cyan-400"
            />
            <span>{strobeFreq.toFixed(1)} Hz</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: 'Levitate Up', f: 50.8 },
            { label: 'Freeze in Mid-Air', f: 50.0 },
            { label: 'Slow Fall', f: 49.2 },
          ].map((mode) => (
            <button
              key={mode.label}
              onClick={() => setStrobeFreq(mode.f)}
              className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                strobeFreq === mode.f ? 'bg-cyan-500 text-stone-950 font-bold border-cyan-400' : 'border-stone-800 text-stone-400'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
