import React, { useRef, useEffect } from 'react';
import { DAWAudioEngine } from '../audio/DAWAudioEngine';

interface AudioVisualizerProps {
  engine: DAWAudioEngine;
  isPlaying: boolean;
}

const AudioVisualizerComponent: React.FC<AudioVisualizerProps> = ({ engine, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = engine.analyser ? engine.analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      if (engine.analyser && isPlaying) {
        engine.analyser.getByteFrequencyData(dataArray);

        const barCount = 36;
        const barWidth = (width / barCount) - 1.5;

        for (let i = 0; i < barCount; i++) {
          const dataIdx = Math.floor((i / barCount) * (bufferLength * 0.75));
          const val = dataArray[dataIdx] || 0;
          const barHeight = Math.max(2, (val / 255) * (height - 6));

          const x = i * (barWidth + 1.5);
          const y = height - barHeight;

          // Gradient from cyan to purple
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.6, '#6366f1');
          grad.addColorStop(1, '#ec4899');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Idle ambient subtle sine baseline
        const t = performance.now() * 0.002;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.sin(x * 0.04 + t) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [engine, isPlaying]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-inner">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono font-bold text-cyan-400">SPECTRUM ANALYZER</span>
        <span className="text-[9px] font-mono text-slate-500">Real-time Master FFT</span>
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={42}
        className="h-10 w-full max-w-sm rounded bg-[#060913] border border-slate-800/80 block"
      />
    </div>
  );
};

export const AudioVisualizer = React.memo(AudioVisualizerComponent);
