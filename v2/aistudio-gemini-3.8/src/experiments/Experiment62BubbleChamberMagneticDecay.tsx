import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw, Zap } from 'lucide-react';

interface SpiralTrack {
  x: number;
  y: number;
  r: number;
  theta: number;
  dTheta: number;
  charge: number; // +1 or -1
  maxPoints: number;
  points: { x: number; y: number }[];
  color: string;
}

export default function Experiment62BubbleChamberMagneticDecay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticB, setMagneticB] = useState(1.5); // Tesla
  const tracksRef = useRef<SpiralTrack[]>([]);

  const spawnTracks = () => {
    const width = 900;
    const height = 480;
    const newTracks: SpiralTrack[] = [];

    for (let i = 0; i < 8; i++) {
      const isPositron = Math.random() > 0.5;
      newTracks.push({
        x: width / 2 + (Math.random() - 0.5) * 120,
        y: height / 2 + (Math.random() - 0.5) * 60,
        r: 10,
        theta: Math.random() * Math.PI * 2,
        dTheta: (isPositron ? 0.08 : -0.08) * magneticB,
        charge: isPositron ? 1 : -1,
        maxPoints: 80,
        points: [],
        color: isPositron ? '#38bdf8' : '#fb923c',
      });
    }
    tracksRef.current = newTracks;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    spawnTracks();

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Cryogenic liquid hydrogen chamber
      ctx.fillStyle = 'rgba(5, 7, 12, 0.18)';
      ctx.fillRect(0, 0, width, height);

      const tracks = tracksRef.current;

      tracks.forEach((t) => {
        t.r += 0.6;
        t.theta += t.dTheta;

        const px = t.x + Math.cos(t.theta) * t.r;
        const py = t.y + Math.sin(t.theta) * t.r;
        t.points.push({ x: px, y: py });

        if (t.points.length > t.maxPoints) t.points.shift();

        // Draw boiling bubble trail
        if (t.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(t.points[0].x, t.points[0].y);
          for (let p = 1; p < t.points.length; p++) {
            ctx.lineTo(t.points[p].x, t.points[p].y);
          }
          ctx.strokeStyle = t.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = t.color;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Bubble bead
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Central Inscribed Monument "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [magneticB]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#05070c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Orbit size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 062</span> // LIQUID HYDROGEN BUBBLE CHAMBER
        </div>
        <div className="flex items-center gap-4">
          <span>MAGNETIC FIELD: {magneticB} T</span>
          <span>LORENTZ SPIRAL CURVATURE</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={spawnTracks}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SUBATOMIC PARTICLES SPIRAL IN OPPOSITE DIRECTIONS BASED ON ELECTRIC CHARGE
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Magnetic Field B:</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.2"
              value={magneticB}
              onChange={(e) => setMagneticB(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{magneticB}T</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={spawnTracks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold transition-colors"
          >
            <Zap size={12} />
            <span>Inject Particle Beam</span>
          </button>
        </div>
      </div>
    </div>
  );
}
