import React, { useRef, useEffect, useState } from 'react';
import { Radio, Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment94SonarDopplerBathymetry() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sonarFreqKhz, setSonarFreqKhz] = useState(120); // kHz
  const [sweepSpeed, setSweepSpeed] = useState(2.0);
  const [chirpAudio, setChirpAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerSonarChirp = () => {
    if (!chirpAudio) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let scanX = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Abyssal deep ocean abyss
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Multibeam fan sonar swath grid
      const numBeams = 40;
      for (let i = 0; i < numBeams; i++) {
        const x = (i / numBeams) * width;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Bathymetric seafloor elevation contour ridges
      const depthBands = 12;
      for (let b = 0; b < depthBands; b++) {
        const y = 80 + b * 28;
        ctx.strokeStyle = `hsl(${210 + b * 8}, 80%, ${20 + b * 4}%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          const depthWarp = Math.sin(x * 0.02 + b) * 12;
          if (x === 0) ctx.moveTo(x, y + depthWarp);
          else ctx.lineTo(x, y + depthWarp);
        }
        ctx.stroke();
      }

      // Subsea Trench Seafloor Typographic Feature "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 58px "Syne", sans-serif';

      // False-color depth coloring (Yellow/Green = Shallow Ridge, Dark Blue = Deep Trench)
      const grad = ctx.createLinearGradient(0, cy - 40, 0, cy + 40);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#06b6d4');
      grad.addColorStop(1, '#0284c7');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 15;
      ctx.fillText('HELLO WORLD', cx, cy);
      ctx.restore();

      // Sweeping Vessel Sonar Ping Wavefront (vertical scanline bar)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(scanX - 6, 0, 12, height);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      scanX += sweepSpeed;
      if (scanX > width) {
        scanX = 0;
        triggerSonarChirp();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [sweepSpeed, sonarFreqKhz, chirpAudio]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Radio className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 094: MULTIBEAM HYDROACOUSTIC SONAR BATHYMETRY
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Seafloor Time-of-Flight Mapping & Acoustic Doppler Ping Chirp
              </p>
            </div>
          </div>
          <button
            onClick={() => setChirpAudio(!chirpAudio)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              chirpAudio
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            {chirpAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{chirpAudio ? 'PING AUDIO ACTIVE' : 'MUTE CHIRP'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Carrier Frequency:
              </span>
              <span className="text-cyan-400 font-bold">{sonarFreqKhz} kHz</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              value={sonarFreqKhz}
              onChange={(e) => setSonarFreqKhz(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Swath Sweep Velocity:</span>
              <span className="text-cyan-400 font-bold">{sweepSpeed.toFixed(1)}x knots</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={sweepSpeed}
              onChange={(e) => setSweepSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
