import React, { useRef, useEffect, useState } from 'react';
import { Zap, Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment96ResonantTeslaCoilDischarge() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pulseFreqHz, setPulseFreqHz] = useState(330); // Note E4
  const [sparkPower, setSparkPower] = useState(80); // %
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (audioActive) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sharp buzzy pulse train characteristic of musical solid state tesla coil sparks
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pulseFreqHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.06 * (sparkPower / 100), ctx.currentTime);

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
      oscRef.current.frequency.setValueAtTime(pulseFreqHz, audioCtxRef.current.currentTime);
    }
  }, [pulseFreqHz]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, width, height);

      // Tesla coil secondary topload toroid (aluminum ring) at bottom center
      const toroidX = cx;
      const toroidY = height - 70;

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(toroidX, toroidY, 80, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Letters of "HELLO WORLD" target breakout electrodes above
      const text = 'HELLO WORLD';
      const spacing = width / (text.length + 1);

      ctx.save();
      ctx.font = 'bold 44px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      text.split('').map((char, idx) => {
        const tx = (idx + 1) * spacing;
        const ty = 110;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 12;
        ctx.fillText(char, tx, ty);

        // Branching electrical streamer jumping from toroid to this letter
        if (Math.random() < (sparkPower / 100) * 0.45) {
          ctx.beginPath();
          ctx.moveTo(toroidX, toroidY - 15);

          let curX = toroidX;
          let curY = toroidY - 15;
          const segments = 12;

          for (let s = 1; s <= segments; s++) {
            const frac = s / segments;
            const targetX = toroidX + (tx - toroidX) * frac + (Math.random() - 0.5) * 45;
            const targetY = toroidY - 15 + (ty - (toroidY - 15)) * frac + (Math.random() - 0.5) * 25;
            ctx.lineTo(targetX, targetY);
            curX = targetX;
            curY = targetY;
          }
          ctx.lineTo(tx, ty);

          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 18;
          ctx.stroke();

          // High-intensity white spark core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [sparkPower]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-purple-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 096: MUSICAL SOLID-STATE TESLA COIL (DRSSTC)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Dual-Resonant Spark Modulation & Polyphonic Audio Interrupter
              </p>
            </div>
          </div>
          <button
            onClick={() => setAudioActive(!audioActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              audioActive
                ? 'bg-purple-500/10 border-purple-400 text-purple-400 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioActive ? 'SPARK AUDIO ACTIVE' : 'MUTE SPARK'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-purple-400" /> Pulse Note Frequency:
              </span>
              <span className="text-purple-400 font-bold">{pulseFreqHz} Hz</span>
            </div>
            <input
              type="range"
              min="110"
              max="880"
              value={pulseFreqHz}
              onChange={(e) => setPulseFreqHz(Number(e.target.value))}
              className="w-full accent-purple-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Primary Spark Power:</span>
              <span className="text-purple-400 font-bold">{sparkPower}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={sparkPower}
              onChange={(e) => setSparkPower(Number(e.target.value))}
              className="w-full accent-purple-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
