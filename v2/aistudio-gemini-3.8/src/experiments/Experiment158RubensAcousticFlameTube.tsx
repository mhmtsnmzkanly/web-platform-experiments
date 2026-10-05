import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment158RubensAcousticFlameTube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundFreq, setSoundFreq] = useState(440); // Sound frequency in Hz (A4)
  const [speakerAmplitude, setSpeakerAmplitude] = useState(1.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let waveTime = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cy = height * 0.58;

      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      waveTime += 0.05;

      // Rubens Flame Tube (1905 Heinrich Rubens):
      // A hollow metal pipe drilled with an array of tiny holes along the top.
      // Flammable gas (propane) fills the pipe and burns in small pilot flames.
      // A loudspeaker at one end sets up acoustic standing waves:
      // High pressure nodes -> Higher gas escape velocity -> Tall flames!
      // Low pressure nodes (displacement antinodes) -> Short flames!

      const tubeX1 = 120;
      const tubeX2 = width - 120;
      const tubeW = tubeX2 - tubeX1;
      const tubeH = 45;

      // Draw Loudspeaker Driver at left end
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(tubeX1 - 40, cy - 40);
      ctx.lineTo(tubeX1, cy - 22);
      ctx.lineTo(tubeX1, cy + 22);
      ctx.lineTo(tubeX1 - 40, cy + 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Speaker cone vibrations
      const coneVibe = Math.sin(waveTime * 8) * speakerAmplitude * 3;
      ctx.strokeStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(tubeX1 - 25 + coneVibe, cy - 20);
      ctx.lineTo(tubeX1 - 25 + coneVibe, cy + 20);
      ctx.stroke();

      // Steel Gas Pipe
      const pipeGrad = ctx.createLinearGradient(0, cy - tubeH / 2, 0, cy + tubeH / 2);
      pipeGrad.addColorStop(0, '#475569');
      pipeGrad.addColorStop(0.5, '#1e293b');
      pipeGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(tubeX1, cy - tubeH / 2, tubeW, tubeH);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(tubeX1, cy - tubeH / 2, tubeW, tubeH);

      // Gas inlet valve at right
      ctx.fillStyle = '#334155';
      ctx.fillRect(tubeX2 - 10, cy + tubeH / 2, 20, 25);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('PROPANE INLET', tubeX2 - 40, cy + tubeH / 2 + 40);

      // Array of Flame Jets along the top of the tube
      // Acoustic standing wave: P(x, t) = P_0 * sin(k * x) * cos(omega * t)
      // Wavenumber k = 2 * pi * f / v_sound (v_sound in gas ~ 350 m/s)
      const numJets = 55;
      const jetSpacing = tubeW / (numJets + 1);
      const kFactor = (soundFreq / 440) * 0.024;

      for (let j = 1; j <= numJets; j++) {
        const jx = tubeX1 + j * jetSpacing;
        const standingPressure = Math.abs(Math.sin((jx - tubeX1) * kFactor));
        const flameHeight = 15 + standingPressure * speakerAmplitude * 45 + (Math.random() - 0.5) * 4;

        // Hole in pipe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(jx, cy - tubeH / 2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Flame teardrop shape
        const flameGrad = ctx.createLinearGradient(jx, cy - tubeH / 2, jx, cy - tubeH / 2 - flameHeight);
        flameGrad.addColorStop(0, '#38bdf8'); // blue gas base
        flameGrad.addColorStop(0.3, '#f97316'); // hot orange
        flameGrad.addColorStop(0.7, '#eab308'); // luminous yellow
        flameGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(jx - 4, cy - tubeH / 2);
        ctx.quadraticCurveTo(jx - 5, cy - tubeH / 2 - flameHeight * 0.6, jx, cy - tubeH / 2 - flameHeight);
        ctx.quadraticCurveTo(jx + 5, cy - tubeH / 2 - flameHeight * 0.6, jx + 4, cy - tubeH / 2);
        ctx.closePath();
        ctx.fill();
      }

      // Standing Wave Pressure Envelope Overlay (dotted blue curve)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = tubeX1; x <= tubeX2; x += 4) {
        const pVal = Math.sin((x - tubeX1) * kFactor);
        const ey = cy - tubeH / 2 - 25 - pVal * 40;
        if (x === tubeX1) ctx.moveTo(x, ey);
        else ctx.lineTo(x, ey);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 230, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 230, 95);

      ctx.fillStyle = '#f97316';
      ctx.font = '10px monospace';
      ctx.fillText('ACOUSTIC PRESSURE STANDING WAVE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Excitation Frequency: ${soundFreq} Hz`, 45, 72);
      ctx.fillText(`Acoustic Wavelength λ: ${(343 / soundFreq).toFixed(2)} m`, 45, 90);
      ctx.fillText(`Flame Height Node Contrast: ${(speakerAmplitude * 100).toFixed(0)}%`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1905 HEINRICH RUBENS FLAME TUBE · ACOUSTIC STANDING WAVE PRESSURE FLAME MANOMETER', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [soundFreq, speakerAmplitude]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Acoustic Frequency (f)</span>
            <span className="font-mono">{soundFreq} Hz</span>
          </div>
          <input
            type="range"
            min="220"
            max="880"
            step="10"
            value={soundFreq}
            onChange={(e) => setSoundFreq(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Loudspeaker Sound Pressure Level</span>
            <span className="font-mono">{speakerAmplitude.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.2"
            step="0.1"
            value={speakerAmplitude}
            onChange={(e) => setSpeakerAmplitude(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
