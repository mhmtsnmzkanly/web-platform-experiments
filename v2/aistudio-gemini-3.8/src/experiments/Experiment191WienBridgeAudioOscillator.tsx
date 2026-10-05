import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment191WienBridgeAudioOscillator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [oscFrequencyHz, setOscFrequencyHz] = useState(440); // 440 Hz (Concert A)
  const [bulbWarmth, setBulbWarmth] = useState(1.0); // Incandescent bulb stabilization
  const [audioOn, setAudioOn] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!audioOn) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const actx = audioCtxRef.current;
      if (actx.state === 'suspended') actx.resume();

      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(oscFrequencyHz, actx.currentTime);
      gain.gain.setValueAtTime(0.08, actx.currentTime);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      oscRef.current = osc;
    } catch {
      // audio fallback
    }

    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    };
  }, [audioOn, oscFrequencyHz]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let waveTime = 0;

    // HP-200A Wien Bridge Oscillator (William Hewlett & David Packard, 1939):
    // Hewlett's Stanford thesis breakthrough: using a small incandescent lightbulb
    // as a temperature-dependent nonlinear resistor in the negative feedback loop.
    // If output amplitude rises, the bulb filament heats up, resistance increases,
    // reducing gain back to exactly 3.0, producing a pure, distortion-free sine wave!
    // Disney bought 8 units for the movie Fantasia (first HP commercial product).

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.38;
      const cy = height * 0.5;

      ctx.fillStyle = '#08090f';
      ctx.fillRect(0, 0, width, height);

      waveTime += 0.08 * (oscFrequencyHz / 440);

      // Draw Vintage HP-200A Style Oscilloscope Screen on right
      const oscX = width * 0.58;
      const oscY = 70;
      const oscW = width * 0.38;
      const oscH = 240;

      ctx.fillStyle = '#022c22';
      ctx.fillRect(oscX, oscY, oscW, oscH);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(oscX, oscY, oscW, oscH);

      // Oscilloscope Phosphor Graticule
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      for (let gy = oscY + 30; gy < oscY + oscH; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(oscX, gy);
        ctx.lineTo(oscX + oscW, gy);
        ctx.stroke();
      }
      for (let gx = oscX + 30; gx < oscX + oscW; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, oscY);
        ctx.lineTo(gx, oscY + oscH);
        ctx.stroke();
      }

      // Pure Sine Wave on Phosphor Screen
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= oscW; x += 2) {
        const tVal = (x / oscW) * 4 * Math.PI + waveTime;
        const py = oscY + oscH / 2 + Math.sin(tVal) * (oscH * 0.38);
        if (x === 0) ctx.moveTo(oscX + x, py);
        else ctx.lineTo(oscX + x, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = '10px monospace';
      ctx.fillText(`AUDIO OUTPUT: ${oscFrequencyHz} Hz SINE WAVE`, oscX + 14, oscY + 22);
      ctx.fillText('THD DISTORTION: < 0.08% (PURE TONAL FIDELITY)', oscX + 14, oscY + 42);

      // Draw Wien Bridge Circuit Diagram on Left
      // Operational Amplifier / Vacuum Tube Triangle
      const opX = cx;
      const opY = cy;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(opX - 60, opY - 60);
      ctx.lineTo(opX + 40, opY);
      ctx.lineTo(opX - 60, opY + 60);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText('-', opX - 50, opY - 25);
      ctx.fillText('+', opX - 50, opY + 35);

      // Hewlett's Incandescent Tungsten Light Bulb (Nonlinear feedback resistor)
      const bulbX = opX - 110;
      const bulbY = opY - 45;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glowing filament
      ctx.strokeStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(bulbX - 6, bulbY + 6);
      ctx.lineTo(bulbX, bulbY - 6);
      ctx.lineTo(bulbX + 6, bulbY + 6);
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.font = '10px monospace';
      ctx.fillText('HEWLETT BULB (R_T)', bulbX - 45, bulbY - 22);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#34d399';
      ctx.font = '10px monospace';
      ctx.fillText('HP-200A WIEN BRIDGE OSCILLATOR', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Resonance f = 1 / (2π·R·C): ${oscFrequencyHz} Hz`, 45, 72);
      ctx.fillText(`Bulb PTC Dynamic Equilibrium Gain: A = 3.00`, 45, 90);
      ctx.fillText('Historical: First Product of Hewlett-Packard (1939)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1939 WILLIAM HEWLETT WIEN BRIDGE · INCANDESCENT BULB THERMAL NONLINEAR STABILIZATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [oscFrequencyHz, bulbWarmth]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Bridge Tuning Frequency</span>
            <span className="font-mono">{oscFrequencyHz} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="10"
            value={oscFrequencyHz}
            onChange={(e) => setOscFrequencyHz(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono">
              {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />} Audio Synthesizer Output
            </span>
            <span className="font-mono">{audioOn ? 'LIVE SOUND ACTIVE' : 'MUTED'}</span>
          </div>
          <button
            onClick={() => setAudioOn(!audioOn)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              audioOn
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {audioOn ? 'MUTE AUDIO OUTPUT' : 'LISTEN TO PURE WIEN BRIDGE SINE TONE'}
          </button>
        </div>
      </div>
    </div>
  );
}
