import React, { useRef, useEffect } from 'react';
import { proceduralAudio } from '../engine/ProceduralAudioEngine';
import { ActiveVoiceInfo } from '../types';
import { Activity, BarChart2, Radio } from 'lucide-react';

interface OscilloscopeVisualizerProps {
  activeVoices: ActiveVoiceInfo[];
}

const OscilloscopeVisualizerComponent: React.FC<OscilloscopeVisualizerProps> = ({ activeVoices }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Handle HiDPI Device Pixel Ratio scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    }

    const logicalW = rect.width || canvas.width;
    const logicalH = rect.height || canvas.height;

    // Pre-allocate vertical gradient for spectrum bars once
    const barGrad = ctx.createLinearGradient(0, 0, 0, logicalH);
    barGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
    barGrad.addColorStop(1, 'rgba(99, 102, 241, 0.15)');

    const render = () => {
      // 1. CLEAR BACKGROUND WITH PHOSPHOR PERSISTENCE TRAIL
      ctx.fillStyle = 'rgba(3, 7, 18, 0.35)';
      ctx.fillRect(0, 0, logicalW, logicalH);

      // Subtle frequency grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.lineWidth = 1;
      for (let y = logicalH / 4; y < logicalH; y += logicalH / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(logicalW, y);
        ctx.stroke();
      }

      // 2. DRAW 64-BAND LOGARITHMIC FFT SPECTRUM BARS
      const freqData = proceduralAudio.getFrequencyData();
      const numBars = 64;
      const barWidth = logicalW / numBars;

      ctx.fillStyle = barGrad;
      for (let i = 0; i < numBars; i++) {
        // Logarithmic frequency bin mapping
        const binIndex = Math.floor(Math.pow(i / numBars, 1.8) * (freqData.length * 0.7));
        const val = freqData[binIndex] || 0;
        const barHeight = (val / 255) * (logicalH * 0.75);

        const x = i * barWidth;
        const y = logicalH - barHeight;
        ctx.fillRect(x + 1, y, barWidth - 1, barHeight);
      }

      // 3. DRAW REAL-TIME TIME-DOMAIN OSCILLOSCOPE WAVEFORM (Dual-pass glow without slow shadowBlur)
      const timeData = proceduralAudio.getTimeDomainData();
      const sliceWidth = logicalW / timeData.length;

      // Pass A: Wide soft ambient glow
      ctx.beginPath();
      ctx.lineWidth = 4.0;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
      let x = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * logicalH) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(logicalW, logicalH / 2);
      ctx.stroke();

      // Pass B: Sharp crisp core beam
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#38bdf8';
      x = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * logicalH) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(logicalW, logicalH / 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-44 bg-slate-950/90 border-b border-slate-800/80 relative flex flex-col overflow-hidden select-none">
      <div className="absolute top-2.5 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] font-bold font-mono tracking-wider text-slate-400 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-md">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          OSCILLOSCOPE &amp; 64-BAND FFT SPECTRUM
        </span>

        {/* Real-time active voice badges */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-md">
          {activeVoices.map((v) => (
            <span
              key={v.id}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
            >
              MIDI {v.note} ({v.freq}Hz)
            </span>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} width={1200} height={180} className="w-full h-full block" />
    </div>
  );
};

export const OscilloscopeVisualizer = React.memo(OscilloscopeVisualizerComponent);
