import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

interface ParticleTrack {
  points: { x: number; y: number; r: number }[];
  type: 'alpha' | 'beta' | 'muon';
  age: number;
  maxAge: number;
  color: string;
}

export default function Experiment147WilsonCloudChamberTracks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sourceActivity, setSourceActivity] = useState(12); // Bq
  const [magneticDeflection, setMagneticDeflection] = useState(0.8); // Tesla (curves beta electrons)
  const [supersaturation, setSupersaturation] = useState(4.2); // S-ratio

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const tracks: ParticleTrack[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Cloud chamber active sensitive cylinder
      const chamberR = 180;

      // Dark alcohol bath background with faint supersaturated vapor mist
      const vaporGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, chamberR);
      vaporGrad.addColorStop(0, '#040d1a');
      vaporGrad.addColorStop(0.8, '#020617');
      vaporGrad.addColorStop(1, '#000000');
      ctx.fillStyle = vaporGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, chamberR, 0, Math.PI * 2);
      ctx.fill();

      // Chamber glass perimeter ring
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, chamberR, 0, Math.PI * 2);
      ctx.stroke();

      // Radioactive source pin (Am-241 / Sr-90 pellet on edge of chamber)
      const sourceX = cx - chamberR + 15;
      const sourceY = cy;
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Random particle emissions
      if (Math.random() < sourceActivity * 0.05) {
        const randType = Math.random();
        let type: 'alpha' | 'beta' | 'muon' = 'alpha';
        if (randType > 0.6) type = 'beta';
        if (randType > 0.9) type = 'muon';

        const angle = (Math.random() - 0.5) * 1.4;
        let px = type === 'muon' ? cx + (Math.random() - 0.5) * 200 : sourceX + 8;
        let py = type === 'muon' ? cy - chamberR + 10 : sourceY;
        let vx = type === 'muon' ? (Math.random() - 0.5) * 2 : Math.cos(angle) * 7;
        let vy = type === 'muon' ? 8 : Math.sin(angle) * 7;

        const pts = [{ x: px, y: py, r: type === 'alpha' ? 3.5 : 1.5 }];
        const maxSteps = type === 'alpha' ? 32 : type === 'beta' ? 55 : 45;

        for (let s = 0; s < maxSteps; s++) {
          // Magnetic deflection: beta electrons curve sharply (q/m is huge);
          // alpha particles (He-4 nucleus) barely deviate; muons pierce straight
          if (type === 'beta') {
            const curve = magneticDeflection * 0.18;
            vx += -vy * curve;
            vy += vx * curve;
            // Multiple Coulomb scattering
            vx += (Math.random() - 0.5) * 1.2;
            vy += (Math.random() - 0.5) * 1.2;
          } else if (type === 'alpha') {
            vx += -vy * (magneticDeflection * 0.005);
            vy += vx * (magneticDeflection * 0.005);
          }

          px += vx;
          py += vy;

          // Droplet size depends on supersaturation
          const dropletR = (type === 'alpha' ? 3.2 : 1.2) * (supersaturation / 3);
          pts.push({ x: px, y: py, r: dropletR });
        }

        tracks.push({
          points: pts,
          type,
          age: 0,
          maxAge: 70,
          color: type === 'alpha' ? '#f8fafc' : type === 'beta' ? '#38bdf8' : '#a855f7',
        });
      }

      // Render and age alcohol vapor condensation tracks
      for (let t = tracks.length - 1; t >= 0; t--) {
        const trk = tracks[t];
        trk.age++;
        if (trk.age > trk.maxAge) {
          tracks.splice(t, 1);
          continue;
        }

        const opacity = 1 - trk.age / trk.maxAge;
        ctx.fillStyle = trk.color;
        ctx.globalAlpha = opacity;

        for (let pt of trk.points) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }

      // Legend of Track Signatures
      const legX = 35;
      const legY = 35;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(legX, legY, 210, 110);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(legX, legY, 210, 110);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('IONIZATION TRACK PHENOMENOLOGY', legX + 10, legY + 18);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText('■ ALPHA: Dense Bragg Peak', legX + 10, legY + 40);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('■ BETA (e⁻): Tortuous Cyclotron Spiral', legX + 10, legY + 62);
      ctx.fillStyle = '#a855f7';
      ctx.fillText('■ COSMIC MUON (μ): High-Energy Pierce', legX + 10, legY + 84);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('WILSON CONDENSATION CLOUD CHAMBER (1911) · SUPERSATURATED DROPLET NUCLEATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [sourceActivity, magneticDeflection, supersaturation]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Atom size={14} /> Radioactive Emission Rate</span>
            <span className="font-mono">{sourceActivity} Becquerel (Bq)</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            value={sourceActivity}
            onChange={(e) => setSourceActivity(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Magnetic Deflection Field</span>
            <span className="font-mono">{magneticDeflection.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0"
            max="2.0"
            step="0.05"
            value={magneticDeflection}
            onChange={(e) => setMagneticDeflection(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Alcohol Supersaturation</span>
            <span className="font-mono">S = {supersaturation.toFixed(1)}x critical</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="6.0"
            step="0.1"
            value={supersaturation}
            onChange={(e) => setSupersaturation(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
