import React, { useRef, useEffect, useState } from 'react';
import { Waves, Sliders, RotateCcw, Volume2 } from 'lucide-react';

interface Bead {
  x: number;
  y: number;
  nodeY: number;
  phase: number;
  char: string;
}

export default function Experiment68AcousticLevitationNodes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [freqKHz, setFreqKHz] = useState(40); // 40 kHz
  const [soundPressure, setSoundPressure] = useState(140); // dB SPL

  const letters = 'HELLO WORLD'.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerY = height / 2;

    const spacing = (width - 160) / (letters.length - 1);
    const startX = 80;

    const beads: Bead[] = letters.map((char, i) => ({
      x: startX + i * spacing,
      y: centerY,
      nodeY: centerY + Math.sin(i * 0.8) * 15,
      phase: Math.random() * Math.PI * 2,
      char,
    }));

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.05;

      // Dark acoustic levitation clean bench
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Top and bottom 40kHz ultrasonic transducer phased array bars
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, 20, width - 80, 24);
      ctx.fillRect(40, height - 44, width - 80, 24);

      // Transducer emitters
      for (let tx = 60; tx < width - 60; tx += 20) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(tx, 44, 4, 0, Math.PI * 2);
        ctx.arc(tx, height - 44, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Standing Acoustic Pressure Wave Nodes in air
      // Pressure P(y) = P0 * cos(k * y)
      const wavelengthY = 40; // sound wavelength in air at 40kHz ~ 8.5mm scaled
      ctx.save();
      for (let y = 60; y < height - 60; y += wavelengthY) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
      }
      ctx.restore();

      // Update and draw Levitated Styrofoam Beads at pressure nodes
      beads.forEach((b) => {
        if (b.char === ' ') return;

        // Acoustic trap oscillation
        const trapJitter = Math.sin(time * 6 + b.phase) * (180 / soundPressure) * 2;
        b.y = b.nodeY + trapJitter;

        // Acoustic acoustic radiation force trap aura
        const aura = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, 22);
        aura.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 22, 0, Math.PI * 2);
        ctx.fill();

        // Expanded Styrofoam bead sphere
        const beadGrad = ctx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, 7);
        beadGrad.addColorStop(0, '#ffffff');
        beadGrad.addColorStop(0.7, '#e2e8f0');
        beadGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = beadGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Inscribed Letter glyph floating above bead
        ctx.font = 'bold 36px "Syne", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fillText(b.char, b.x, b.y - 32);
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [freqKHz, soundPressure]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#06080e] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Waves size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 068</span> // ULTRASONIC ACOUSTIC LEVITATION TRAP
        </div>
        <div className="flex items-center gap-4">
          <span>FREQUENCY: {freqKHz} KHZ</span>
          <span>PRESSURE: {soundPressure} DB SPL</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-sky-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          STANDING ULTRASONIC SOUND PRESSURE NODES TRAP LEVITATED BEADS
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Transducer Frequency:</span>
            <input
              type="range"
              min="38"
              max="42"
              step="0.2"
              value={freqKHz}
              onChange={(e) => setFreqKHz(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span>{freqKHz} kHz</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Radiation Force:</span>
            <input
              type="range"
              min="100"
              max="160"
              value={soundPressure}
              onChange={(e) => setSoundPressure(Number(e.target.value))}
              className="w-20 accent-sky-400"
            />
            <span>{soundPressure} dB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Acoustic Radiation Force Potential</span>
        </div>
      </div>
    </div>
  );
}
