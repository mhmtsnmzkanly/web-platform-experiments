import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface SandGrain {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Experiment28ChladniResonancePlates() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frequencyN, setFrequencyN] = useState(3);
  const [frequencyM, setFrequencyM] = useState(5);
  const [amplitude, setAmplitude] = useState(1.8);
  const grainsRef = useRef<SandGrain[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const size = Math.min(width, height) * 0.85;
    const startX = (width - size) / 2;
    const startY = (height - size) / 2;

    // Initialize 2,200 sand grains uniformly on the plate
    const numGrains = 2200;
    const newGrains: SandGrain[] = [];
    for (let i = 0; i < numGrains; i++) {
      newGrains.push({
        x: startX + Math.random() * size,
        y: startY + Math.random() * size,
        vx: 0,
        vy: 0,
      });
    }
    grainsRef.current = newGrains;

    let isRunning = true;
    let animId = 0;
    let t = 0;

    const render = () => {
      if (!isRunning) return;
      t += 0.05;

      // Dark acoustic chamber
      ctx.fillStyle = '#0a0a0e';
      ctx.fillRect(0, 0, width, height);

      // Draw Square Brass Chladni Resonator Plate
      ctx.save();
      const plateGrad = ctx.createLinearGradient(startX, startY, startX + size, startY + size);
      plateGrad.addColorStop(0, '#27272a');
      plateGrad.addColorStop(0.5, '#18181b');
      plateGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = plateGrad;
      ctx.fillRect(startX, startY, size, size);

      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, size, size);

      // Inscribed typographic anchor in plate center
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 36px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      // Chladni plate vibration formula:
      // w(x, y) = a * sin(n*pi*x/L) * sin(m*pi*y/L) - b * sin(m*pi*x/L) * sin(n*pi*y/L)
      const grains = grainsRef.current;
      const n = frequencyN;
      const m = frequencyM;

      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];

        // Normalized plate coordinates (0 to 1)
        const u = (g.x - startX) / size;
        const v = (g.y - startY) / size;

        if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
          // Chladni modal displacement amplitude
          const modeVal =
            Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v) -
            Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v);

          // Force pushes sand from high vibration (|modeVal| > 0) to nodal lines (modeVal ~ 0)
          const gradU =
            n * Math.cos(n * Math.PI * u) * Math.sin(m * Math.PI * v) -
            m * Math.cos(m * Math.PI * u) * Math.sin(n * Math.PI * v);
          const gradV =
            m * Math.sin(n * Math.PI * u) * Math.cos(m * Math.PI * v) -
            n * Math.sin(m * Math.PI * u) * Math.cos(n * Math.PI * v);

          const force = Math.abs(modeVal) * amplitude;
          const bounce = Math.sin(t * 10 + i) * force;

          g.vx = -Math.sign(modeVal) * gradU * 0.4 + (Math.random() - 0.5) * bounce;
          g.vy = -Math.sign(modeVal) * gradV * 0.4 + (Math.random() - 0.5) * bounce;

          g.x += g.vx;
          g.y += g.vy;

          // Boundary clamp
          g.x = Math.max(startX + 2, Math.min(startX + size - 2, g.x));
          g.y = Math.max(startY + 2, Math.min(startY + size - 2, g.y));

          // Draw sand grain
          ctx.fillRect(g.x, g.y, 1.5, 1.5);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [frequencyN, frequencyM, amplitude]);

  const handleScatter = () => {
    const width = canvasRef.current?.width || 900;
    const height = canvasRef.current?.height || 480;
    const size = Math.min(width, height) * 0.85;
    const startX = (width - size) / 2;
    const startY = (height - size) / 2;

    grainsRef.current.forEach((g) => {
      g.x = startX + Math.random() * size;
      g.y = startY + Math.random() * size;
    });
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#0a0a0e] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 028</span> // CHLADNI ACOUSTIC RESONANCE NODES
        </div>
        <div className="flex items-center gap-4">
          <span>MODE: (N={frequencyN}, M={frequencyM})</span>
          <span>SAND GRAINS: {grainsRef.current.length}</span>
        </div>
      </div>

      {/* Plate Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          ACOUSTIC VIBRATION ORGANIZES SAND PARTICLES INTO GEOMETRIC NODAL LINES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Harmonic N:</span>
            <input
              type="range"
              min="1"
              max="7"
              value={frequencyN}
              onChange={(e) => setFrequencyN(Number(e.target.value))}
              className="w-16 accent-amber-400"
            />
            <span>{frequencyN}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Harmonic M:</span>
            <input
              type="range"
              min="1"
              max="7"
              value={frequencyM}
              onChange={(e) => setFrequencyM(Number(e.target.value))}
              className="w-16 accent-amber-400"
            />
            <span>{frequencyM}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Vibration:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.2"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-16 accent-amber-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScatter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Scatter Sand</span>
          </button>
        </div>
      </div>
    </div>
  );
}
