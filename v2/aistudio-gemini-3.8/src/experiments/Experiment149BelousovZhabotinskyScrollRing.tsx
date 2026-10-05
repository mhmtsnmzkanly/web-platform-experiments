import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment149BelousovZhabotinskyScrollRing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spiralTwist, setSpiralTwist] = useState(3.4);
  const [waveSpeed, setWaveSpeed] = useState(1.2);
  const [coreRadius, setCoreRadius] = useState(48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.46;

      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, width, height);

      time += 0.02 * waveSpeed;

      // 3D Scroll Ring: In excitable chemical media (like BZ reaction with ferroin catalyst),
      // 2D spiral waves extend into 3D as vortex filaments. When the filament closes into a ring,
      // it forms a self-rotating, twisting scroll ring that emits concentric toroidal chemical waves!
      const numRings = 24;
      const ptsPerRing = 70;

      for (let r = 0; r < numRings; r++) {
        const ringPhase = r * 0.28 - time * 2;
        const majorR = coreRadius + r * 6.5;
        const tubeR = 24 + Math.sin(ringPhase) * 12;

        ctx.beginPath();
        for (let p = 0; p <= ptsPerRing; p++) {
          const theta = (p / ptsPerRing) * Math.PI * 2;
          const phi = theta * spiralTwist + ringPhase;

          // 3D Toroidal coordinates with twist
          const x3 = (majorR + tubeR * Math.cos(phi)) * Math.cos(theta);
          const y3 = tubeR * Math.sin(phi);
          const z3 = (majorR + tubeR * Math.cos(phi)) * Math.sin(theta);

          // Perspective projection with slight tilt
          const tilt = 0.55;
          const px = cx + x3 * 1.1;
          const py = cy + y3 * Math.cos(tilt) - z3 * Math.sin(tilt) * 0.45;

          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        // Color mapped to oxidized state (blue ferriin) vs reduced state (red ferroin)
        const oxFraction = 0.5 + 0.5 * Math.sin(ringPhase);
        const red = Math.floor(180 * (1 - oxFraction) + 20);
        const green = Math.floor(50 * (1 - oxFraction) + 90 * oxFraction);
        const blue = Math.floor(240 * oxFraction + 40);

        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.15 + 0.6 * (1 - r / numRings)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Draw central singularity vortex filament ring
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let p = 0; p <= 60; p++) {
        const theta = (p / 60) * Math.PI * 2;
        const fx = cx + Math.cos(theta) * coreRadius * 1.1;
        const fy = cy - Math.sin(theta) * coreRadius * 0.45 * Math.sin(0.55);
        if (p === 0) ctx.moveTo(fx, fy);
        else ctx.lineTo(fx, fy);
      }
      ctx.stroke();

      // Filament core label
      ctx.fillStyle = '#fef08a';
      ctx.font = '10px monospace';
      ctx.fillText('VORTEX FILAMENT CORE (PHASE SINGULARITY)', cx - 120, cy - coreRadius * 0.4 - 15);

      // Chemical Species Legend
      const legX = 35;
      const legY = 35;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(legX, legY, 230, 85);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(legX, legY, 230, 85);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('EXCITABLE MEDIUM CONCENTRATION', legX + 12, legY + 18);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('● [Fe(phen)3]3+ (Oxidized / Blue Front)', legX + 12, legY + 38);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('● [Fe(phen)3]2+ (Reduced / Red Bulk)', legX + 12, legY + 58);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Topological Twist: ${spiralTwist.toFixed(1)} rad/turn`, legX + 12, legY + 76);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('3D EXCITABLE CHEMICAL WAVE · TOROIDAL SCROLL RING SINGULARITY FILAMENT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [spiralTwist, waveSpeed, coreRadius]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Filament Helical Twist</span>
            <span className="font-mono">{spiralTwist.toFixed(1)} rad</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={spiralTwist}
            onChange={(e) => setSpiralTwist(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Reaction Propagation Velocity</span>
            <span className="font-mono">{waveSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={waveSpeed}
            onChange={(e) => setWaveSpeed(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Vortex Singularity Radius</span>
            <span className="font-mono">{coreRadius} px</span>
          </div>
          <input
            type="range"
            min="25"
            max="80"
            value={coreRadius}
            onChange={(e) => setCoreRadius(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
