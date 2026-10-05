import React, { useRef, useEffect, useState } from 'react';
import { Radiation, Volume2, VolumeX, Sliders, Activity } from 'lucide-react';

interface ParticleTrack {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'alpha' | 'beta';
  points: { x: number; y: number }[];
}

export default function Experiment34GeigerRadioactiveDecay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cpm, setCpm] = useState(380); // Counts Per Minute
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [magneticField, setMagneticField] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tracksRef = useRef<ParticleTrack[]>([]);

  const playGeigerClick = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.003, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Target letter waypoints for ionizing trajectories
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('HELLO WORLD', width / 2, height / 2);
    const textData = offCtx.getImageData(0, 0, width, height).data;

    const targetPoints: { x: number; y: number }[] = [];
    for (let y = 10; y < height - 10; y += 12) {
      for (let x = 10; x < width - 10; x += 12) {
        if (textData[(y * width + x) * 4 + 3] > 180) {
          targetPoints.push({ x, y });
        }
      }
    }

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark supersaturated cloud chamber plate
      ctx.fillStyle = 'rgba(6, 8, 12, 0.16)';
      ctx.fillRect(0, 0, width, height);

      // Spawn random ionizing particle emissions based on CPM
      const spawnChance = (cpm / 60) / 60;
      if (Math.random() < spawnChance * 3) {
        const isTargeted = Math.random() > 0.4 && targetPoints.length > 0;
        const origin = isTargeted
          ? targetPoints[Math.floor(Math.random() * targetPoints.length)]
          : { x: Math.random() * width, y: Math.random() * height };

        const isAlpha = Math.random() > 0.6;
        const angle = Math.random() * Math.PI * 2;
        const speed = isAlpha ? Math.random() * 2 + 1.5 : Math.random() * 6 + 4;

        tracksRef.current.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: isAlpha ? 25 : 45,
          type: isAlpha ? 'alpha' : 'beta',
          points: [{ x: origin.x, y: origin.y }],
        });

        playGeigerClick();
      }

      // Draw particle ionization condensation droplets
      const tracks = tracksRef.current;
      for (let i = tracks.length - 1; i >= 0; i--) {
        const t = tracks[i];

        // Magnetic Lorentz force curvature for beta electrons
        if (magneticField && t.type === 'beta') {
          const curl = 0.08;
          const oldVx = t.vx;
          t.vx = t.vx - t.vy * curl;
          t.vy = t.vy + oldVx * curl;
        }

        t.x += t.vx;
        t.y += t.vy;
        t.points.push({ x: t.x, y: t.y });
        t.life -= 1 / t.maxLife;

        if (t.life <= 0) {
          tracks.splice(i, 1);
          continue;
        }

        // Draw cloud track
        ctx.beginPath();
        ctx.moveTo(t.points[0].x, t.points[0].y);
        for (let p = 1; p < t.points.length; p++) {
          ctx.lineTo(t.points[p].x, t.points[p].y);
        }

        ctx.strokeStyle = t.type === 'alpha' ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = t.type === 'alpha' ? 3.5 : 1.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = t.life;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Draw subtle background typographic phantom
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [cpm, magneticField, audioEnabled]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06080c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Radiation size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 034</span> // GEIGER CLOUD CHAMBER CONDENSATION
        </div>
        <div className="flex items-center gap-4">
          <span>RADIATION: {cpm} CPM</span>
          <span>ISOTOPE: U-238 NATURAL</span>
        </div>
      </div>

      {/* Cloud Chamber Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          ALPHA & BETA CONDENSATION TRACKS IONIZE TYPOGRAPHIC CONTOURS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Activity (CPM):</span>
            <input
              type="range"
              min="100"
              max="1200"
              step="50"
              value={cpm}
              onChange={(e) => setCpm(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{cpm}</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'Geiger Click ON' : 'Click Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMagneticField(!magneticField)}
            className={`px-3 py-1 rounded border transition-colors ${
              magneticField ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
            }`}
          >
            Lorentz Field: {magneticField ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
