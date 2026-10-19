import React, { useRef, useEffect } from 'react';
import { FieldProbe } from '../types';

interface OscilloscopePanelProps {
  probes: FieldProbe[];
  activeProbeIndex: number;
  onSelectProbeIndex: (idx: number) => void;
}

const OscilloscopePanelComponent: React.FC<OscilloscopePanelProps> = ({
  probes,
  activeProbeIndex,
  onSelectProbeIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const probesRef = useRef(probes);

  useEffect(() => {
    probesRef.current = probes;
  }, [probes]);

  // Single continuous CRT Oscilloscope render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const curProbes = probesRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear CRT screen background
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Oscilloscope Grid Lines
      ctx.strokeStyle = '#111d33';
      ctx.lineWidth = 1;

      // Vertical divisions
      const divX = width / 10;
      for (let x = 0; x <= width; x += divX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal divisions
      const divY = height / 6;
      for (let y = 0; y <= height; y += divY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center zero line
      ctx.strokeStyle = '#1e3355';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // 3. Draw Probe Waveforms
      curProbes.forEach((probe) => {
        const hist = probe.history;
        if (hist.length < 2) return;

        ctx.strokeStyle = probe.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();

        const stepX = width / (hist.length - 1);
        for (let i = 0; i < hist.length; i++) {
          const val = hist[i];
          const x = i * stepX;
          // Scale field [-1.2, +1.2] to canvas height
          const y = height / 2 - val * (height * 0.38);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []); // Run once on mount!

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200">OSCILLOSCOPE TELEMETRY [Ez(t)]</span>
        </div>

        {/* Probe Target Selectors & Instant Field Readouts */}
        <div className="flex items-center gap-3 text-[11px]">
          {probes.map((p, idx) => {
            const current = p.history[p.history.length - 1] || 0;
            const isSelected = activeProbeIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProbeIndex(idx)}
                style={{ borderColor: isSelected ? p.color : 'transparent' }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-800 font-bold' : 'bg-slate-950 text-slate-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span style={{ color: p.color }}>{p.name}:</span>
                <span className="font-mono text-slate-200">
                  {current >= 0 ? `+${current.toFixed(3)}` : current.toFixed(3)} V/m
                </span>
                {isSelected && (
                  <span className="text-[9px] bg-slate-700 px-1 rounded text-white ml-0.5">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full h-28 bg-[#060a14] rounded border border-slate-800 overflow-hidden relative">
        <canvas ref={canvasRef} width={480} height={112} className="w-full h-full block" />
      </div>
    </div>
  );
};

export const OscilloscopePanel = React.memo(OscilloscopePanelComponent);
