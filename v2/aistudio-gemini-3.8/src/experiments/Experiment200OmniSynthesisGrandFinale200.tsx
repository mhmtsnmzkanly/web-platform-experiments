import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Orbit, Sliders, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function Experiment200OmniSynthesisGrandFinale200() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [realityCoupling, setRealityCoupling] = useState(1.4); // Multiverse coupling strength
  const [colorFluxSpeed, setColorFluxSpeed] = useState(1.0);
  const [audioSynthesizer, setAudioSynthesizer] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const chordOscsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (!audioSynthesizer) {
      chordOscsRef.current.forEach(o => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      chordOscsRef.current = [];
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const actx = audioCtxRef.current;
      if (actx.state === 'suspended') actx.resume();

      // Harmonically rich 200th milestone chord: C Major 9th with ethereal detuned unison
      const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 493.88, 523.25];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((f, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, actx.currentTime);
        gain.gain.setValueAtTime(0.025 / freqs.length, actx.currentTime);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        oscs.push(osc);
      });

      chordOscsRef.current = oscs;
    } catch {
      // audio fallback
    }

    return () => {
      chordOscsRef.current.forEach(o => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      chordOscsRef.current = [];
    };
  }, [audioSynthesizer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // THE 200TH MONUMENTAL GRAND FINALE:
    // Synthesis of the entire 200-study computational laboratory:
    // Quantum Wavefunctions + Celestial Relativistic Gravitational Mechanics +
    // Prismatic Refraction + High-Energy Plasma + Topological Knots +
    // Pure Monumental "HELLO WORLD" Geometric Genesis!

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.46;

      ctx.fillStyle = '#04050a';
      ctx.fillRect(0, 0, width, height);

      time += 0.02 * colorFluxSpeed;

      // Outer Multiverse Quantum Wave Ring Array
      const numRings = 7;
      for (let r = 1; r <= numRings; r++) {
        const radius = r * 28 + Math.sin(time * 2 + r) * 6 * realityCoupling;
        const pts = 80;

        ctx.beginPath();
        for (let p = 0; p <= pts; p++) {
          const theta = (p / pts) * Math.PI * 2;
          const harmonicWarp = Math.sin(theta * 6 + time * 3) * 8 * realityCoupling;
          const currentR = radius + harmonicWarp;

          const px = cx + Math.cos(theta) * currentR;
          const py = cy + Math.sin(theta) * currentR * 0.65; // Isometric perspective tilt

          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        // Spectral Chromatic Iridescence
        const hue = (time * 40 + r * 35) % 360;
        ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${0.25 + 0.5 * (r / numRings)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Gravitational Singularity Core (Black Hole & Luminous Accretion Disk)
      const coreR = 24;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2.5);
      coreGrad.addColorStop(0, '#ffffff'); // Quantum Core Singularity
      coreGrad.addColorStop(0.3, '#38bdf8');
      coreGrad.addColorStop(0.7, '#ec4899');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Relativistic Swirling Photon Trajectories
      const numPhotons = 48;
      for (let p = 0; p < numPhotons; p++) {
        const pAngle = time * 2.5 + (p * Math.PI * 2) / numPhotons;
        const pDist = 35 + (p % 8) * 16;
        const px = cx + Math.cos(pAngle) * pDist;
        const py = cy + Math.sin(pAngle) * pDist * 0.65;

        ctx.fillStyle = p % 2 === 0 ? '#fde047' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Monumental Central "HELLO WORLD" Typography Hologram
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Chromatic Aberration Shift Behind Primary Text
      ctx.font = 'bold 36px Syne, sans-serif';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fillText('HELLO WORLD', cx - 2, cy - 1);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fillText('HELLO WORLD', cx + 2, cy + 1);

      // Primary Crisp Luminous Foreground
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HELLO WORLD', cx, cy);

      // 200th Study Golden Coronet
      ctx.font = '10px monospace';
      ctx.fillStyle = '#fde047';
      ctx.fillText('★ 200TH GRAND SYNTHESIS SPECIMEN · COMPLETE ARCHIVE ★', cx, cy - 35);
      ctx.restore();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 290, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 290, 95);

      ctx.fillStyle = '#fde047';
      ctx.font = '10px monospace';
      ctx.fillText('COMPUTATIONAL LAB 200TH SYNTHESIS', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Archive Status: 200 EXQUISITE STUDIES', 45, 72);
      ctx.fillText(`Coupling Flux: ${realityCoupling.toFixed(2)} Multi-Domain Tensor`, 45, 90);
      ctx.fillText('Physics · Mathematics · Optics · Signals · Computation', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#4ade80';
      ctx.font = '12px monospace';
      ctx.fillText('200TH MONUMENTAL MILESTONE · COMPLETE NATIVE BROWSER COMPUTATIONAL PHYSICS & MATHEMATICS LABORATORY', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [realityCoupling, colorFluxSpeed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Multi-Domain Quantum Coupling</span>
            <span className="font-mono">{realityCoupling.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={realityCoupling}
            onChange={(e) => setRealityCoupling(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Color Flux Velocity</span>
            <span className="font-mono">{colorFluxSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={colorFluxSpeed}
            onChange={(e) => setColorFluxSpeed(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono">
              {audioSynthesizer ? <Volume2 size={14} /> : <VolumeX size={14} />} Harmonic Drone Audio
            </span>
            <span className="font-mono">{audioSynthesizer ? 'C-MAJ9 ACTIVE' : 'MUTED'}</span>
          </div>
          <button
            onClick={() => setAudioSynthesizer(!audioSynthesizer)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              audioSynthesizer
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {audioSynthesizer ? 'MUTE HARMONIC CHORD' : 'PLAY 200TH CELEBRATION CHORD'}
          </button>
        </div>
      </div>
    </div>
  );
}
