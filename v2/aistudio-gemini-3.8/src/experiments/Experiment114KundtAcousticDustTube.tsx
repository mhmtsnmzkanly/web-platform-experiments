import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment114KundtAcousticDustTube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundFreqHz, setSoundFreqHz] = useState(1200); // Hz
  const [audioActive, setAudioActive] = useState(false);
  const [tubePistonL, setTubePistonL] = useState(0.85); // meters
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (audioActive) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(soundFreqHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

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
      oscRef.current.frequency.setValueAtTime(soundFreqHz, audioCtxRef.current.currentTime);
    }
  }, [soundFreqHz]);

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

      // Dark acoustic test bench
      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, width, height);

      // Glass tube dimensions
      const tubeW = width - 160;
      const tubeH = 70;
      const tubeX = 80;
      const tubeY = cy - tubeH / 2;

      // Glass tube outline
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.fillRect(tubeX, tubeY, tubeW, tubeH);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(tubeX, tubeY, tubeW, tubeH);

      // Acoustic standing wave: lambda = v / f (v_air ~ 343 m/s)
      const lambdaM = 343 / soundFreqHz;
      const spatialWavelengthPx = (lambdaM / tubePistonL) * tubeW;

      // Lycopodium spore cork dust mounds gather at velocity displacement nodes (pressure antinodes)
      const numParticles = 600;
      ctx.fillStyle = '#fef08a';

      for (let i = 0; i < numParticles; i++) {
        const px = tubeX + (i / numParticles) * (tubeW - 20) + 10;
        const relX = (px - tubeX);

        // Standing wave particle displacement node gathering: amplitude ~ sin(2*pi*x / lambda)
        const nodeFactor = Math.abs(Math.cos((relX * Math.PI * 2) / spatialWavelengthPx));

        // Piles form at nodes where velocity is zero
        const moundHeight = (1 - nodeFactor) * 22;
        const py = tubeY + tubeH - 6 - (moundHeight * Math.random());

        ctx.fillRect(px, py, 1.8, 1.8);
      }

      // Loudspeaker driver diaphragm on left end
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(tubeX - 12, tubeY + 4, 12, tubeH - 8);

      // Reflecting piston on right end
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(tubeX + tubeW, tubeY + 4, 10, tubeH - 8);

      // Inscribed Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy - 85);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `AUGUST KUNDT 1866 ACOUSTIC TUBE · SPEED OF SOUND v = f·λ = 343 m/s · λ = ${(lambdaM * 100).toFixed(1)} cm · FREQ ${soundFreqHz} Hz`,
        cx,
        cy + 85
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [soundFreqHz, tubePistonL]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Volume2 className="text-yellow-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 114: AUGUST KUNDT 1866 ACOUSTIC RESONANCE DUST TUBE
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Lycopodium Spore Nodal Striation Mounds & Longitudinal Sound Waveforms
              </p>
            </div>
          </div>
          <button
            onClick={() => setAudioActive(!audioActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              audioActive
                ? 'bg-yellow-400 text-stone-950 font-bold border-yellow-400'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioActive ? 'SPEAKER AUDIO ON' : 'MUTE SPEAKER'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-yellow-400" /> Loudspeaker Tone Pitch:
              </span>
              <span className="text-yellow-400 font-bold">{soundFreqHz} Hz</span>
            </div>
            <input
              type="range"
              min="400"
              max="2400"
              step="50"
              value={soundFreqHz}
              onChange={(e) => setSoundFreqHz(Number(e.target.value))}
              className="w-full accent-yellow-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Resonator Tube Length:</span>
              <span className="text-yellow-400 font-bold">{(tubePistonL * 100).toFixed(0)} cm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={tubePistonL}
              onChange={(e) => setTubePistonL(Number(e.target.value))}
              className="w-full accent-yellow-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
