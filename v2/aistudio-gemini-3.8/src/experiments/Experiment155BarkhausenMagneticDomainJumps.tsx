import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

interface BarkhausenSpike {
  x: number;
  y: number;
  amp: number;
  age: number;
}

export default function Experiment155BarkhausenMagneticDomainJumps() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hFieldRate, setHFieldRate] = useState(1.4); // dH/dt driving rate
  const [pinningDensity, setPinningDensity] = useState(24); // Impurity pinning sites
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let drivePhase = 0;
    const spikes: BarkhausenSpike[] = [];
    const hysteresisPoints: { h: number; b: number }[] = [];

    const playClick = () => {
      if (!audioEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const actx = audioCtxRef.current;
        if (actx.state === 'suspended') actx.resume();

        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 2400, actx.currentTime);
        gain.gain.setValueAtTime(0.04, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.015);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.015);
      } catch {
        // audio fallback
      }
    };

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#07080d';
      ctx.fillRect(0, 0, width, height);

      drivePhase += 0.015 * hFieldRate;
      const currentH = Math.sin(drivePhase); // Applied external magnetic field H(t)

      // Barkhausen effect:
      // When H changes continuously, magnetic domain walls do NOT glide smoothly;
      // they get pinned by crystal impurities, then suddenly snap forward in discontinuous avalanche jumps!
      let snapOccurred = false;
      if (Math.random() < Math.abs(Math.cos(drivePhase)) * 0.45) {
        snapOccurred = true;
        playClick();
        spikes.push({
          x: width * 0.72 + (Math.random() - 0.5) * 60,
          y: height * 0.65,
          amp: (Math.random() * 0.8 + 0.2) * 55,
          age: 0,
        });
      }

      // Draw Hysteresis B-H Curve on Left
      const hysX = width * 0.28;
      const hysY = height * 0.48;
      const hysW = 120;
      const hysH = 120;

      // Calculate B with Barkhausen discrete steps
      const smoothB = Math.tanh(currentH * 2.2);
      const barkhausenB = smoothB + (snapOccurred ? (Math.random() - 0.5) * 0.08 : 0);

      hysteresisPoints.push({ h: currentH, b: barkhausenB });
      if (hysteresisPoints.length > 250) hysteresisPoints.shift();

      // Hysteresis box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(hysX - hysW - 20, hysY - hysH - 10, hysW * 2 + 40, hysH * 2 + 20);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(hysX - hysW - 20, hysY - hysH - 10, hysW * 2 + 40, hysH * 2 + 20);

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hysX - hysW, hysY);
      ctx.lineTo(hysX + hysW, hysY);
      ctx.moveTo(hysX, hysY - hysH);
      ctx.lineTo(hysX, hysY + hysH);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('+H (A/m)', hysX + hysW - 35, hysY - 6);
      ctx.fillText('+B (Tesla)', hysX + 6, hysY - hysH + 14);

      // Draw Hysteresis loop trace
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < hysteresisPoints.length; i++) {
        const pt = hysteresisPoints[i];
        const px = hysX + pt.h * (hysW * 0.85);
        const py = hysY - pt.b * (hysH * 0.85);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current operating point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(hysX + currentH * (hysW * 0.85), hysY - barkhausenB * (hysH * 0.85), 5, 0, Math.PI * 2);
      ctx.fill();

      // Oscilloscope Barkhausen Noise Signal Display on Right
      const oscX = width * 0.58;
      const oscY = 65;
      const oscW = width * 0.38;
      const oscH = 220;

      ctx.fillStyle = '#022c22';
      ctx.fillRect(oscX, oscY, oscW, oscH);
      ctx.strokeStyle = '#059669';
      ctx.strokeRect(oscX, oscY, oscW, oscH);

      // Oscilloscope grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      for (let gy = oscY + 30; gy < oscY + oscH; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(oscX, gy);
        ctx.lineTo(oscX + oscW, gy);
        ctx.stroke();
      }

      // Draw Barkhausen voltage spikes dB/dt picked up by induction coil
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      const midOscY = oscY + oscH / 2;
      for (let x = 0; x < oscW; x += 3) {
        const noise = (Math.random() - 0.5) * 3;
        let spikeAmp = 0;
        for (let s of spikes) {
          const dist = Math.abs(x - (s.x - oscX));
          if (dist < 15) {
            spikeAmp += s.amp * Math.exp(-dist * 0.2) * (1 - s.age / 25);
          }
        }
        const py = midOscY + noise - spikeAmp;
        if (x === 0) ctx.moveTo(oscX + x, py);
        else ctx.lineTo(oscX + x, py);
      }
      ctx.stroke();

      // Age spikes
      for (let i = spikes.length - 1; i >= 0; i--) {
        spikes[i].age++;
        if (spikes[i].age > 25) spikes.splice(i, 1);
      }

      ctx.fillStyle = '#34d399';
      ctx.font = '11px monospace';
      ctx.fillText('INDUCTION COIL dB/dt VOLTAGE (ACOUSTIC BARKHAUSEN NOISE)', oscX + 14, oscY + 22);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1919 HEINRICH BARKHAUSEN EFFECT · DISCONTINUOUS FERROMAGNETIC DOMAIN WALL JUMPS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [hFieldRate, pinningDensity, audioEnabled]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Magnetic Driving Rate (dH/dt)</span>
            <span className="font-mono">{hFieldRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.1"
            value={hFieldRate}
            onChange={(e) => setHFieldRate(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Domain Pinning Defects</span>
            <span className="font-mono">{pinningDensity} sites</span>
          </div>
          <input
            type="range"
            min="8"
            max="45"
            value={pinningDensity}
            onChange={(e) => setPinningDensity(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono">
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} Acoustic Audio Clicks
            </span>
            <span className="font-mono">{audioEnabled ? 'SPEAKER ON' : 'MUTED'}</span>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              audioEnabled
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {audioEnabled ? 'MUTE ACOUSTIC CLICKS' : 'ENABLE BARKHAUSEN AUDIO'}
          </button>
        </div>
      </div>
    </div>
  );
}
