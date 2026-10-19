import React, { useState, useRef, useEffect } from 'react';
import { BasisStateAmplitude, Complex } from '../types';
import { C } from '../quantum/ComplexMath';
import { BarChart3, Grid, Activity } from 'lucide-react';

interface StateHistogramVisualizerProps {
  amplitudes: BasisStateAmplitude[];
  numQubits: number;
}

export const StateHistogramVisualizer: React.FC<StateHistogramVisualizerProps> = ({
  amplitudes,
  numQubits,
}) => {
  const [viewMode, setViewMode] = useState<'HISTOGRAM' | 'DENSITY_MATRIX'>('HISTOGRAM');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    r: number;
    c: number;
    rhoVal: Complex;
    mag: number;
    phase: number;
  } | null>(null);

  // Compute color from complex phase angle [-PI, PI] -> [0, 360] degrees
  const getPhaseColor = (phaseRad: number): string => {
    let deg = (phaseRad * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return `hsl(${Math.round(deg)}, 85%, 60%)`;
  };

  // Canvas drawing for density matrix
  useEffect(() => {
    if (viewMode !== 'DENSITY_MATRIX') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const n = amplitudes.length;
    const size = 280;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, size, size);

    const pad = 2;
    const cellSize = (size - pad * 2) / n;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const rhoVal = C.mul(amplitudes[r].amplitude, C.conj(amplitudes[c].amplitude));
        const mag = C.mag(rhoVal);
        const phase = C.phase(rhoVal);
        const color = getPhaseColor(phase);

        const x = pad + c * cellSize;
        const y = pad + r * cellSize;

        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.08, Math.min(1.0, mag * 1.5));
        ctx.fillRect(x, y, Math.max(1, cellSize - 1), Math.max(1, cellSize - 1));

        if (hoveredCell && hoveredCell.r === r && hoveredCell.c === c) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, Math.max(1, cellSize - 1), Math.max(1, cellSize - 1));
        }
      }
    }
  }, [viewMode, amplitudes, hoveredCell]);

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 2;
    const y = e.clientY - rect.top - 2;
    const size = 280;
    const n = amplitudes.length;
    const cellSize = (size - 4) / n;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);

    if (r >= 0 && r < n && c >= 0 && c < n) {
      const rhoVal = C.mul(amplitudes[r].amplitude, C.conj(amplitudes[c].amplitude));
      setHoveredCell({
        r,
        c,
        rhoVal,
        mag: C.mag(rhoVal),
        phase: C.phase(rhoVal),
      });
    } else {
      setHoveredCell(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950/80 backdrop-blur border-l border-gray-800 text-xs select-none">
      {/* Header Tabs */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('HISTOGRAM')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              viewMode === 'HISTOGRAM'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>PROBABILITIES</span>
          </button>

          <button
            onClick={() => setViewMode('DENSITY_MATRIX')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              viewMode === 'DENSITY_MATRIX'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>DENSITY MATRIX</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-500 font-mono">
          STATES: {amplitudes.length} (2^{numQubits})
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-3 overflow-y-auto">
        {viewMode === 'HISTOGRAM' ? (
          <div className="space-y-2">
            {amplitudes.map((amp) => {
              const phaseColor = getPhaseColor(amp.phaseRad);
              const percent = (amp.probability * 100).toFixed(1);

              return (
                <div key={amp.index} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-gray-200">|{amp.binaryString}⟩</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-[10px]">
                        {amp.amplitude.re >= 0 ? '+' : ''}
                        {amp.amplitude.re.toFixed(3)}
                        {amp.amplitude.im >= 0 ? '+' : ''}
                        {amp.amplitude.im.toFixed(3)}i
                      </span>
                      <span className="font-bold text-purple-300 w-12 text-right">{percent}%</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-gray-900 rounded overflow-hidden border border-gray-800 flex">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, amp.probability * 100))}%`,
                        backgroundColor: phaseColor,
                        boxShadow: amp.probability > 0.05 ? `0 0 8px ${phaseColor}` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Density Matrix Heatmap via HTML5 Canvas (O(1) DOM nodes) */
          <div className="flex flex-col items-center justify-center p-2 space-y-3">
            <div className="relative p-1 bg-gray-900 rounded-lg border border-gray-800 shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onPointerMove={handleCanvasPointerMove}
                onPointerLeave={() => setHoveredCell(null)}
                className="cursor-crosshair rounded"
                style={{ width: '280px', height: '280px' }}
              />
            </div>

            {hoveredCell ? (
              <div className="font-mono text-xs text-purple-300 bg-gray-900 px-3 py-1.5 rounded border border-gray-800 text-center max-w-full truncate">
                ρ[{amplitudes[hoveredCell.r]?.binaryString}][{amplitudes[hoveredCell.c]?.binaryString}] ={' '}
                {hoveredCell.rhoVal.re.toFixed(3)} + {hoveredCell.rhoVal.im.toFixed(3)}i (|ρ| ={' '}
                {hoveredCell.mag.toFixed(3)})
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 font-mono text-center">
                Hover over matrix cells to inspect amplitudes & off-diagonal coherences.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Complex Phase Legend */}
      <div className="p-2 border-t border-gray-800 bg-gray-950 font-mono text-[10px] flex items-center justify-between text-gray-400">
        <div className="flex items-center space-x-1.5">
          <span>Phase:</span>
          <div className="flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-[hsl(0,85%,60%)]" title="0 rad" />
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-[hsl(90,85%,60%)]" title="π/2 rad (+i)" />
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-[hsl(180,85%,60%)]" title="π rad (-1)" />
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-[hsl(270,85%,60%)]" title="3π/2 rad (-i)" />
          </div>
        </div>
        <span>0 → π/2 → π → 3π/2</span>
      </div>
    </div>
  );
};
