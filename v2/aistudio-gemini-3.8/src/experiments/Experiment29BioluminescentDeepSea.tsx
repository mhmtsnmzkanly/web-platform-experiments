import React, { useRef, useEffect, useState } from 'react';
import { Waves, Sparkles, Sliders, Zap } from 'lucide-react';

interface MarineOrganism {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  phase: number;
  glow: number;
  size: number;
  char: string;
}

export default function Experiment29BioluminescentDeepSea() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [depthMeter, setDepthMeter] = useState(3800); // meters
  const [bioluminescence, setBioluminescence] = useState(85);
  const organismsRef = useRef<MarineOrganism[]>([]);

  const letters = 'HELLO WORLD'.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    const spacing = (width - 160) / (letters.length - 1);
    const startX = 80;
    const centerY = height / 2;

    const orgs: MarineOrganism[] = letters.map((char, i) => ({
      x: startX + i * spacing + (Math.random() - 0.5) * 30,
      y: centerY + (Math.random() - 0.5) * 30,
      targetX: startX + i * spacing,
      targetY: centerY,
      phase: Math.random() * Math.PI * 2,
      glow: 1,
      size: 26,
      char,
    }));

    organismsRef.current = orgs;

    // Marine snow specks
    const snow = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: Math.random() * 0.4 + 0.2,
      size: Math.random() * 1.5 + 0.5,
    }));

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.025;

      // Abyssal deep navy ocean
      ctx.fillStyle = '#020611';
      ctx.fillRect(0, 0, width, height);

      // Draw marine snow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      snow.forEach((s) => {
        s.y += s.vy;
        s.x += Math.sin(time + s.y * 0.02) * 0.2;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Bioluminescent Siphonophore Nodes
      orgs.forEach((org, i) => {
        if (org.char === ' ') return;

        // Gentle floating drift
        org.x = org.targetX + Math.sin(time + org.phase) * 12;
        org.y = org.targetY + Math.cos(time * 0.8 + org.phase) * 8;

        const pulse = (Math.sin(time * 2 + org.phase) * 0.5 + 0.5) * (bioluminescence / 100);

        // Bioluminescent radial aura
        const auraGrad = ctx.createRadialGradient(org.x, org.y, 2, org.x, org.y, 45);
        auraGrad.addColorStop(0, `rgba(6, 182, 212, ${pulse * 0.8})`);
        auraGrad.addColorStop(0.4, `rgba(16, 185, 129, ${pulse * 0.3})`);
        auraGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(org.x, org.y, 45, 0, Math.PI * 2);
        ctx.fill();

        // Organism photophore bell
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12 * pulse;
        ctx.beginPath();
        ctx.arc(org.x, org.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tentacle streamers trailing down
        ctx.strokeStyle = `rgba(6, 182, 212, ${pulse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(org.x, org.y);
        for (let seg = 1; seg <= 6; seg++) {
          const segY = org.y + seg * 10;
          const segX = org.x + Math.sin(time * 3 + seg * 0.5 + i) * 6;
          ctx.lineTo(segX, segY);
        }
        ctx.stroke();

        // Inscribed character glowing in the deep
        ctx.font = 'bold 38px "Syne", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(240, 253, 250, ${0.4 + pulse * 0.6})`;
        ctx.fillText(org.char, org.x, org.y - 4);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [depthMeter, bioluminescence]);

  const triggerGlowBurst = () => {
    setBioluminescence(150);
    setTimeout(() => setBioluminescence(85), 600);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#020611] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Waves size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 029</span> // ABYSSAL BIOLUMINESCENT PHOTOPHORES
        </div>
        <div className="flex items-center gap-4">
          <span>ZONE: BATHYPELAGIC ({depthMeter}M)</span>
          <span>PRESSURE: {Math.round(depthMeter / 10)} ATM</span>
        </div>
      </div>

      {/* Deep Sea Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={triggerGlowBurst}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-400 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-cyan-900/60">
          CLICK ABYSS TO STIMULATE BIOLUMINESCENT LUCIFERIN BURST
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Bathymetric Depth:</span>
            <input
              type="range"
              min="1000"
              max="7000"
              step="100"
              value={depthMeter}
              onChange={(e) => setDepthMeter(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span>{depthMeter}m</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Luciferin Glow:</span>
            <input
              type="range"
              min="30"
              max="120"
              value={bioluminescence}
              onChange={(e) => setBioluminescence(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerGlowBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold transition-colors"
          >
            <Zap size={12} />
            <span>Stimulate Organisms</span>
          </button>
        </div>
      </div>
    </div>
  );
}
