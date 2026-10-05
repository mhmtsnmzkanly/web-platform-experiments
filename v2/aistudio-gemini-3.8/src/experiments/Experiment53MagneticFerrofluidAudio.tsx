import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Volume2, VolumeX, Play, Square } from 'lucide-react';

export default function Experiment53MagneticFerrofluidAudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bassGain, setBassGain] = useState(1.6);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Create synthetic audio beat loop
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(analyser);
      gain.connect(ctx.destination);
      osc.start();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    const numSpikes = 64;
    const baseRadius = 130;
    const dataArray = new Uint8Array(128);

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.03;

      // Dark magnetic container dish
      ctx.fillStyle = '#09090d';
      ctx.fillRect(0, 0, width, height);

      let audioMod = 12;
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
        audioMod = (dataArray[2] / 255) * 45 * bassGain;
      }

      // Draw Ferrofluid Magnetic Spike Cluster Ring
      ctx.save();
      ctx.translate(centerX, centerY);

      // Dish rim
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 45, 0, Math.PI * 2);
      ctx.stroke();

      // Ferrofluid oily spiked silhouette
      ctx.beginPath();
      for (let i = 0; i <= numSpikes; i++) {
        const theta = (i / numSpikes) * Math.PI * 2;
        const spikeLen = Math.sin(theta * 8 + time * 4) * audioMod + audioMod * 0.8;
        const r = baseRadius + Math.max(0, spikeLen);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Liquid black metallic gradient
      const metalGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, baseRadius + 50);
      metalGrad.addColorStop(0, '#38bdf8');
      metalGrad.addColorStop(0.3, '#1e293b');
      metalGrad.addColorStop(0.8, '#0a0a0c');
      metalGrad.addColorStop(1, '#020617');

      ctx.fillStyle = metalGrad;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isPlaying ? 25 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Centerpiece "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 36px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.fillText('HELLO WORLD', 0, 0);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, bassGain]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#09090d] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Magnet size={14} className="text-cyan-400" />
          <span className="font-bold text-stone-200">STUDY 053</span> // FERROFLUID ACOUSTIC MODULATION
        </div>
        <div className="flex items-center gap-4">
          <span>COUPLING: AUDIO FFT SPECTRUM</span>
          <span>BASS GAIN: {bassGain.toFixed(1)}X</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-cyan-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          WEB AUDIO BASS FREQUENCIES DRIVE DYNAMIC MAGNETIC SPIKES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              initAudio();
              setIsPlaying(!isPlaying);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-bold transition-all ${
              isPlaying ? 'bg-cyan-500 text-stone-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-stone-800 text-stone-300'
            }`}
          >
            {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            <span>{isPlaying ? 'STOP PULSE' : 'PLAY AUDIO'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Bass Gain:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={bassGain}
              onChange={(e) => setBassGain(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Rosensweig Acoustic Coupling</span>
        </div>
      </div>
    </div>
  );
}
