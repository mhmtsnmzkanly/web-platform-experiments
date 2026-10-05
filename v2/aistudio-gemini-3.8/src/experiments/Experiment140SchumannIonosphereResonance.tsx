import React, { useRef, useEffect, useState } from 'react';
import { Radio, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment140SchumannIonosphereResonance() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [harmonicMode, setHarmonicMode] = useState<number>(1); // n=1 (7.83Hz), n=2 (14.3Hz), n=3 (20.8Hz)
  const [ionosphereHeight, setIonosphereHeight] = useState(85); // km (60 - 100 km D/E layers)
  const [lightningIntensity, setLightningIntensity] = useState(8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Lightning discharge events
    const lightningFlashes: { lat: number; age: number; maxAge: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      time += 0.03;

      // Spawn lightning events around terrestrial globe
      if (Math.random() < lightningIntensity * 0.04) {
        lightningFlashes.push({
          lat: Math.random() * Math.PI * 2,
          age: 0,
          maxAge: 15 + Math.random() * 15,
        });
      }

      // Earth radius and Ionosphere boundary
      const rEarth = 110;
      const rIonosphere = rEarth + (ionosphereHeight / 100) * 45;

      // Earth Globe
      const earthGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, rEarth);
      earthGrad.addColorStop(0, '#1e3a8a');
      earthGrad.addColorStop(0.7, '#0f172a');
      earthGrad.addColorStop(1, '#020617');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rEarth, 0, Math.PI * 2);
      ctx.fill();

      // Earth Continent Silhouettes (simplified stylized landmasses)
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const offset = (time * 0.15 + i * 1.3) % (Math.PI * 2);
        ctx.beginPath();
        ctx.arc(cx, cy, rEarth - 2, offset, offset + 0.8);
        ctx.stroke();
      }

      // Ionosphere Cavity Boundary
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rIonosphere, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ionospheric glow
      const ionoGlow = ctx.createRadialGradient(cx, cy, rEarth + 10, cx, cy, rIonosphere + 15);
      ionoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      ionoGlow.addColorStop(0.7, 'rgba(147, 51, 234, 0.12)');
      ionoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ionoGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, rIonosphere + 15, 0, Math.PI * 2);
      ctx.fill();

      // Standing Electromagnetic Waves in Cavity: mode n determines number of azimuthal nodes
      // f_n = (c / 2*pi*a) * sqrt(n*(n+1)) ~ 7.83 Hz for n=1
      const numNodes = harmonicMode;
      const freq = harmonicMode === 1 ? 7.83 : harmonicMode === 2 ? 14.3 : 20.8;

      ctx.lineWidth = 2.5;
      for (let r = 0; r < 4; r++) {
        const waveRadius = rEarth + ((r + 0.5) / 4) * (rIonosphere - rEarth);
        ctx.beginPath();
        const pts = 120;
        for (let p = 0; p <= pts; p++) {
          const theta = (p / pts) * Math.PI * 2;
          const standingWaveAmp = Math.cos(numNodes * theta) * Math.sin(time * 3 * (freq / 7.83));
          const currentR = waveRadius + standingWaveAmp * 14;

          const px = cx + Math.cos(theta) * currentR;
          const py = cy + Math.sin(theta) * currentR;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = harmonicMode === 1 ? '#38bdf8' : harmonicMode === 2 ? '#a855f7' : '#ec4899';
        ctx.stroke();
      }

      // Draw active lightning discharges sparking into cavity
      for (let l = lightningFlashes.length - 1; l >= 0; l--) {
        const lf = lightningFlashes[l];
        lf.age++;
        if (lf.age > lf.maxAge) {
          lightningFlashes.splice(l, 1);
          continue;
        }

        const alpha = 1 - lf.age / lf.maxAge;
        const lx1 = cx + Math.cos(lf.lat) * rEarth;
        const ly1 = cy + Math.sin(lf.lat) * rEarth;
        const lx2 = cx + Math.cos(lf.lat + 0.05) * rIonosphere;
        const ly2 = cy + Math.sin(lf.lat + 0.05) * rIonosphere;

        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx1 + (lx2 - lx1) * 0.4 + (Math.random() - 0.5) * 10, ly1 + (ly2 - ly1) * 0.4 + (Math.random() - 0.5) * 10);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();
      }

      // Spectral Power Monitor Box
      const specX = 35;
      const specY = 35;
      const specW = 210;
      const specH = 130;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(specX, specY, specW, specH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(specX, specY, specW, specH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('ELF CAVITY RESONANCE (Hz)', specX + 12, specY + 20);

      // Spectrum bars: 7.83Hz, 14.3Hz, 20.8Hz, 27.3Hz
      const modes = [
        { label: '7.83', active: harmonicMode === 1, amp: harmonicMode === 1 ? 0.9 : 0.25 },
        { label: '14.3', active: harmonicMode === 2, amp: harmonicMode === 2 ? 0.85 : 0.2 },
        { label: '20.8', active: harmonicMode === 3, amp: harmonicMode === 3 ? 0.75 : 0.15 },
        { label: '27.3', active: false, amp: 0.1 },
      ];

      modes.forEach((m, idx) => {
        const bx = specX + 20 + idx * 45;
        const barH = m.amp * 65 + Math.sin(time * 4 + idx) * 4;
        ctx.fillStyle = m.active ? '#38bdf8' : '#475569';
        ctx.fillRect(bx, specY + 105 - barH, 24, barH);
        ctx.fillStyle = m.active ? '#f8fafc' : '#64748b';
        ctx.fillText(m.label, bx - 2, specY + 120);
      });

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`TERRESTRIAL CAVITY RESONANCE · f_${harmonicMode} = ${freq} Hz · SPEED OF LIGHT WAVEGUIDE`, 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [harmonicMode, ionosphereHeight, lightningIntensity]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Radio size={14} /> Eigenmode Order (n)</span>
            <span className="font-mono">n = {harmonicMode} ({harmonicMode === 1 ? '7.83' : harmonicMode === 2 ? '14.3' : '20.8'} Hz)</span>
          </div>
          <div className="flex gap-2 mt-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setHarmonicMode(n)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  harmonicMode === n
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                n = {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Ionospheric D/E Altitude</span>
            <span className="font-mono">{ionosphereHeight} km</span>
          </div>
          <input
            type="range"
            min="60"
            max="120"
            value={ionosphereHeight}
            onChange={(e) => setIonosphereHeight(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Lightning Excitation</span>
            <span className="font-mono">{lightningIntensity} strokes/sec</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={lightningIntensity}
            onChange={(e) => setLightningIntensity(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
