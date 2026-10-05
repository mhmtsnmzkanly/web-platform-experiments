import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment116ShepardScaleInfiniteTone() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pitchRate, setPitchRate] = useState(1.0); // pitch ascension speed
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscsRef = useRef<{ osc: OscillatorNode; gain: GainNode; baseFreq: number }[]>([]);

  useEffect(() => {
    if (audioActive) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      // Shepard tone uses 6-8 sine oscillators spaced exactly 1 octave apart
      // with a bell-shaped Gaussian spectral envelope
      const baseFreqs = [55, 110, 220, 440, 880, 1760];
      const list: { osc: OscillatorNode; gain: GainNode; baseFreq: number }[] = [];

      baseFreqs.forEach((bf) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(bf, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        list.push({ osc, gain, baseFreq: bf });
      });

      audioCtxRef.current = ctx;
      oscsRef.current = list;
    } else {
      oscsRef.current.forEach(({ osc }) => {
        osc.stop();
        osc.disconnect();
      });
      oscsRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    }

    return () => {
      oscsRef.current.forEach(({ osc }) => osc.disconnect());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [audioActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#06070c';
      ctx.fillRect(0, 0, width, height);

      // Auditory helical pitch spiral (pitch height vs pitch chroma)
      const spiralR = 120;
      ctx.save();
      ctx.translate(cx, cy);

      const numOctaves = 6;
      for (let oct = 0; oct < numOctaves; oct++) {
        // Continuous upward frequency glide
        const frac = ((t * 0.08 * pitchRate + oct / numOctaves) % 1.0);
        const radius = 30 + frac * 140;
        const angle = frac * Math.PI * 4;

        // Gaussian loudness bell curve (inaudible at extremes, loudest in center)
        const loudness = Math.exp(-Math.pow((frac - 0.5) / 0.22, 2));

        // Update real Web Audio pitch glide if active
        if (oscsRef.current[oct] && audioCtxRef.current) {
          const freq = 55 * Math.pow(2, frac * 5);
          oscsRef.current[oct].osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
          oscsRef.current[oct].gain.gain.setValueAtTime(loudness * 0.05, audioCtxRef.current.currentTime);
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${loudness * 0.9})`;
        ctx.lineWidth = 2 + loudness * 4;
        ctx.beginPath();
        ctx.arc(0, 0, radius, angle, angle + 0.8);
        ctx.stroke();
      }

      // Centerpiece Inscribed Core "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 52px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', 0, 0);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `ROGER SHEPARD 1964 AUDITORY ILLUSION · INFINITE DISCRETE PITCH ASCENSION · GLIDE ${pitchRate.toFixed(1)}x`,
        0,
        height / 2 - 30
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [pitchRate]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Volume2 className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 116: ROGER SHEPARD 1964 INFINITE TONE ILLUSION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Psychoacoustic Pitch Chroma Spiral & Continuous Octave Ascension
              </p>
            </div>
          </div>
          <button
            onClick={() => setAudioActive(!audioActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              audioActive
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioActive ? 'SHEPARD TONE ACTIVE' : 'MUTE ILLUSION'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Ascension Rate:
              </span>
              <span className="text-cyan-400 font-bold">{pitchRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={pitchRate}
              onChange={(e) => setPitchRate(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Harmonic Gaussian Envelope:</span>
            <span className="text-amber-400 font-bold">6 Octaves Parallel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
