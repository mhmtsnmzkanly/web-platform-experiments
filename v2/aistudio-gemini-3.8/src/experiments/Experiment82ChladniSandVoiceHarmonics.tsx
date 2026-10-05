import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw, Activity } from 'lucide-react';

export default function Experiment82ChladniSandVoiceHarmonics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frequency, setFrequency] = useState(440); // Hz
  const [harmonicM, setHarmonicM] = useState(3);
  const [harmonicN, setHarmonicN] = useState(5);
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (audioActive) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    }

    return () => {
      if (oscRef.current) oscRef.current.disconnect();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [audioActive]);

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

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

      // Dark brushed steel square plate
      ctx.fillStyle = '#0f1117';
      ctx.fillRect(0, 0, width, height);

      const plateSize = Math.min(width, height) * 0.78;
      const halfP = plateSize / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Plate background
      ctx.fillStyle = '#1c1f26';
      ctx.fillRect(-halfP, -halfP, plateSize, plateSize);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(-halfP, -halfP, plateSize, plateSize);

      // Render Chladni sand grains: w(x,y) = a*sin(n*pi*x/L)*sin(m*pi*y/L) - b*sin(m*pi*x/L)*sin(n*pi*y/L)
      // Sand grains are kicked away from antinodes (high vibration) and gather at nodal lines (w=0)
      const numSand = 1800;
      ctx.fillStyle = '#fef08a';

      for (let i = 0; i < numSand; i++) {
        // Pseudo-random distribution biased toward nodal lines
        const u = ((i * 19.3) % plateSize) - halfP;
        const v = ((i * 37.7) % plateSize) - halfP;

        const nx = (u / halfP) * Math.PI;
        const ny = (v / halfP) * Math.PI;

        const vibration = Math.abs(
          Math.sin(harmonicN * nx) * Math.sin(harmonicM * ny) -
          Math.sin(harmonicM * nx) * Math.sin(harmonicN * ny)
        );

        if (vibration < 0.28) {
          // Sand grain settled on nodal line
          const jx = u + (Math.sin(t + i) * 0.8 * vibration);
          const jy = v + (Math.cos(t + i) * 0.8 * vibration);
          ctx.fillRect(jx, jy, 1.8, 1.8);
        }
      }

      // Centerpiece Inscribed Specimen "HELLO WORLD"
      ctx.font = 'bold 44px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', 0, 0);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(`CHLADNI NODAL PLATE · FREQ: ${frequency} Hz · MODE (m=${harmonicM}, n=${harmonicN})`, 0, halfP - 18);
      ctx.restore();

      t += 0.05;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [frequency, harmonicM, harmonicN]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 082: CHLADNI ACOUSTIC SAND VOICE HARMONICS
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Ernst Chladni 1787 Nodal Cymatic Equations & Web Audio Sine Excitation
              </p>
            </div>
          </div>
          <button
            onClick={() => setAudioActive(!audioActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              audioActive
                ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioActive ? 'AUDIO TONE ACTIVE' : 'MUTE TONE'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Pitch Frequency:
              </span>
              <span className="text-amber-400 font-bold">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="110"
              max="880"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Modal Index m:</span>
              <span className="text-amber-400 font-bold">{harmonicM}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={harmonicM}
              onChange={(e) => setHarmonicM(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Modal Index n:</span>
              <span className="text-amber-400 font-bold">{harmonicN}</span>
            </div>
            <input
              type="range"
              min="1"
              max="9"
              value={harmonicN}
              onChange={(e) => setHarmonicN(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
