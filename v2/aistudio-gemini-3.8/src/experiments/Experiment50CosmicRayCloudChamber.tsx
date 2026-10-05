import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sparkles, Sliders, Zap } from 'lucide-react';

interface MuonTrack {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  maxLife: number;
  energyGeV: number;
  color: string;
}

export default function Experiment50CosmicRayCloudChamber() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [muonFlux, setMuonFlux] = useState(25); // particles per sec
  const [magneticB, setMagneticB] = useState(0.5); // Tesla
  const tracksRef = useRef<MuonTrack[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Deep cryogenic black velvet base plate with alcohol condensation mist
      ctx.fillStyle = 'rgba(4, 6, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Spawn incoming relativistic cosmic ray muons
      if (Math.random() < muonFlux * 0.04) {
        const energyGeV = Math.random() * 8 + 2;
        const startX = Math.random() * width;
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        const length = Math.random() * 280 + 180;

        tracksRef.current.push({
          x1: startX,
          y1: 0,
          x2: startX + Math.cos(angle) * length,
          y2: Math.sin(angle) * length,
          life: 1,
          maxLife: Math.random() * 40 + 30,
          energyGeV,
          color: energyGeV > 6 ? '#38bdf8' : '#e0f2fe',
        });
      }

      // Draw active cosmic ray muon vapor trails
      const tracks = tracksRef.current;
      for (let i = tracks.length - 1; i >= 0; i--) {
        const t = tracks[i];
        t.life -= 1 / t.maxLife;

        if (t.life <= 0) {
          tracks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.strokeStyle = t.color;
        ctx.lineWidth = t.energyGeV > 6 ? 2.5 : 1.5;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = t.life;
        ctx.stroke();
        ctx.restore();
      }

      // Monument of "HELLO WORLD" illuminated by cosmic rays
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;

      // Radiant white monumental typographic glow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 24;
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [muonFlux, magneticB]);

  const triggerCosmicShower = () => {
    setMuonFlux(90);
    setTimeout(() => setMuonFlux(25), 1000);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#04060a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Orbit size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 050</span> // ASTROPHYSICAL COSMIC RAY MUON CHAMBER
        </div>
        <div className="flex items-center gap-4">
          <span>SOURCE: PRIMARY COSMIC RADIATION (TeV)</span>
          <span>CHAMBER TEMP: -32°C ISOPROPANOL</span>
        </div>
      </div>

      {/* Cosmic Chamber Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer" onClick={triggerCosmicShower}>
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          RELATIVISTIC MUON PARTICLES FROM DEEP SPACE IONIZE SUPERCOOLED VAPOR
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Muon Flux:</span>
            <input
              type="range"
              min="10"
              max="80"
              value={muonFlux}
              onChange={(e) => setMuonFlux(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{muonFlux} /sec</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Magnetic B-Field:</span>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={magneticB}
              onChange={(e) => setMagneticB(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{magneticB}T</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerCosmicShower}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold transition-colors"
          >
            <Sparkles size={13} />
            <span>Trigger Cosmic Ray Shower</span>
          </button>
        </div>
      </div>
    </div>
  );
}
