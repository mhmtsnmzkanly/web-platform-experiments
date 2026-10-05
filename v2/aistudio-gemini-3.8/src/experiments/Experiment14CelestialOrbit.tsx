import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Compass, Sliders, RotateCcw, Plus } from 'lucide-react';

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
  color: string;
}

export default function Experiment14CelestialOrbit() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gravityG, setGravityG] = useState(800);
  const [satellitesCount, setSatellitesCount] = useState(12);
  const bodiesRef = useRef<Body[]>([]);

  const letters = 'HELLO WORLD'.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Positions of letter gravity wells
    const wells: { x: number; y: number; char: string; mass: number }[] = [];
    const spacing = (width - 140) / (letters.length - 1);
    const startX = 70;
    const centerY = height / 2;

    letters.forEach((char, i) => {
      if (char === ' ') return;
      wells.push({
        x: startX + i * spacing,
        y: centerY,
        char,
        mass: 120,
      });
    });

    // Initialize celestial orbiting satellites
    const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399', '#f97316'];
    const newBodies: Body[] = [];

    for (let i = 0; i < satellitesCount; i++) {
      const angle = (i / satellitesCount) * Math.PI * 2;
      const dist = 160 + Math.random() * 120;
      const speed = Math.sqrt(gravityG / dist) * 0.45;

      newBodies.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: -Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed,
        trail: [],
        color: colors[i % colors.length],
      });
    }

    bodiesRef.current = newBodies;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Deep space cosmos with light trail persistence
      ctx.fillStyle = 'rgba(3, 7, 18, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw celestial background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

      // Draw Letter Gravity Wells
      wells.forEach((w) => {
        // Gravitational ring field
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w.x, w.y, 40, 0, Math.PI * 2);
        ctx.stroke();

        // Star core
        const starGrad = ctx.createRadialGradient(w.x, w.y, 2, w.x, w.y, 16);
        starGrad.addColorStop(0, '#ffffff');
        starGrad.addColorStop(0.5, '#93c5fd');
        starGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(w.x, w.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Inscribed Letter glyph
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Instrument Serif", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(w.char, w.x, w.y);
      });

      // Update and draw Orbiting Bodies
      bodiesRef.current.forEach((b) => {
        // Compute total gravitational acceleration
        let ax = 0;
        let ay = 0;

        wells.forEach((w) => {
          const dx = w.x - b.x;
          const dy = w.y - b.y;
          const distSq = dx * dx + dy * dy + 400; // softening factor
          const dist = Math.sqrt(distSq);
          const force = (gravityG * w.mass) / distSq;
          ax += (dx / dist) * force * 0.001;
          ay += (dy / dist) * force * 0.001;
        });

        b.vx += ax;
        b.vy += ay;
        b.x += b.vx;
        b.y += b.vy;

        // Save trail
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 50) b.trail.shift();

        // Draw trail curve
        if (b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let i = 1; i < b.trail.length; i++) {
            ctx.lineTo(b.trail[i].x, b.trail[i].y);
          }
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw satellite head
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [gravityG, satellitesCount]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bodiesRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      trail: [],
      color: '#38bdf8',
    });
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#030712] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Orbit size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 014</span> // CELESTIAL GRAVITATIONAL ORBITS
        </div>
        <div className="flex items-center gap-4">
          <span>GRAVITY WELLS: 10 SOLAR MASSES</span>
          <span>CONSTANT G: {gravityG}</span>
        </div>
      </div>

      {/* Orbit Canvas Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CLICK DEEP SPACE TO LAUNCH NEW ORBITING SATELLITES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Gravitational Constant:</span>
            <input
              type="range"
              min="200"
              max="1800"
              value={gravityG}
              onChange={(e) => setGravityG(Number(e.target.value))}
              className="w-28 accent-sky-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Satellites:</span>
            <input
              type="range"
              min="4"
              max="24"
              value={satellitesCount}
              onChange={(e) => setSatellitesCount(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{satellitesCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGravityG(800)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Orbits</span>
          </button>
        </div>
      </div>
    </div>
  );
}
