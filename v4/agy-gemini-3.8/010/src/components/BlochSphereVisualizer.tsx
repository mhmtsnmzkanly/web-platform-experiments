import React, { useRef, useEffect, useState } from 'react';
import { SingleQubitReducedState } from '../types';

interface BlochSphereVisualizerProps {
  reducedStates: SingleQubitReducedState[];
  selectedQubitIndex: number;
  onSelectQubit: (index: number) => void;
}

export const BlochSphereVisualizer: React.FC<BlochSphereVisualizerProps> = ({
  reducedStates,
  selectedQubitIndex,
  onSelectQubit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Camera rotation angles (pitch, yaw)
  const [pitch, setPitch] = useState<number>(0.35); // rotation around X
  const [yaw, setYaw] = useState<number>(0.65); // rotation around Y
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 300, height: 300 });

  const activeQubitState = reducedStates.find((s) => s.index === selectedQubitIndex) || reducedStates[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasDimensions({ width, height });
        }
      }
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeQubitState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.38;

    // 3D Projector: World (x, y, z) -> 2D Screen (sx, sy)
    // Mathematical Bloch coordinates:
    // +Z points UP (|0⟩)
    // -Z points DOWN (|1⟩)
    // +X points Forward-Right (|+⟩)
    // +Y points In-Depth (|i⟩)
    const project3D = (x: number, y: number, z: number): { x: number; y: number; depth: number } => {
      // 1. Rotate around Y axis (Yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - y * sinY;
      const y1 = x * sinY + y * cosY;
      const z1 = z;

      // 2. Rotate around X axis (Pitch)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const x2 = x1;
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;

      // Screen mapping (Z is up, so invert Y for canvas)
      return {
        x: centerX + x2 * radius,
        y: centerY - z2 * radius,
        depth: y2,
      };
    };

    // 1. Draw Equator & Meridian Wireframes
    const drawCircle3D = (axis: 'XY' | 'XZ' | 'YZ', strokeColor: string, isDashed: boolean = false) => {
      ctx.beginPath();
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        let x = 0;
        let y = 0;
        let z = 0;

        if (axis === 'XY') {
          x = Math.cos(angle);
          y = Math.sin(angle);
          z = 0;
        } else if (axis === 'XZ') {
          x = Math.cos(angle);
          y = 0;
          z = Math.sin(angle);
        } else if (axis === 'YZ') {
          x = 0;
          y = Math.cos(angle);
          z = Math.sin(angle);
        }

        const pt = project3D(x, y, z);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      if (isDashed) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Background sphere shading
    const bgGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
    bgGrad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
    bgGrad.addColorStop(0.8, 'rgba(147, 51, 234, 0.04)');
    bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Wireframes
    drawCircle3D('XY', 'rgba(100, 116, 139, 0.45)'); // Equator
    drawCircle3D('XZ', 'rgba(100, 116, 139, 0.3)', true); // XZ Prime Meridian
    drawCircle3D('YZ', 'rgba(100, 116, 139, 0.3)', true); // YZ Meridian

    // Outer silhouette rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Draw 3D Coordinate Axes (+X, -X, +Y, -Y, +Z, -Z)
    const axes = [
      { label: '|+⟩ (+X)', pos: { x: 1.15, y: 0, z: 0 }, color: '#ec4899' },
      { label: '|-⟩ (-X)', pos: { x: -1.15, y: 0, z: 0 }, color: '#94a3b8' },
      { label: '|i⟩ (+Y)', pos: { x: 0, y: 1.15, z: 0 }, color: '#10b981' },
      { label: '|-i⟩ (-Y)', pos: { x: 0, y: -1.15, z: 0 }, color: '#94a3b8' },
      { label: '|0⟩ (+Z)', pos: { x: 0, y: 0, z: 1.2 }, color: '#38bdf8' },
      { label: '|1⟩ (-Z)', pos: { x: 0, y: 0, z: -1.2 }, color: '#f59e0b' },
    ];

    axes.forEach((ax) => {
      const p = project3D(ax.pos.x, ax.pos.y, ax.pos.z);
      const origin = project3D(0, 0, 0);

      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = ax.color;
      ctx.fillText(ax.label, p.x + 4, p.y + 3);
    });

    // 3. Draw Bloch State Vector
    const bv = activeQubitState.bloch;
    const origin = project3D(0, 0, 0);
    const tip = project3D(bv.x, bv.y, bv.z);

    // Vector line with glow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // Arrowhead point
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = activeQubitState.entangled ? '#ec4899' : '#a855f7';
    ctx.fill();

    // Origin center dot
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b';
    ctx.fill();

    // 4. Projection Drop Lines to XY plane
    const shadowPt = project3D(bv.x, bv.y, 0);
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(shadowPt.x, shadowPt.y);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.setLineDash([2, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }, [activeQubitState, pitch, yaw, canvasDimensions]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setYaw((prev) => prev + dx * 0.01);
    setPitch((prev) => Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, prev + dy * 0.01)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950/80 backdrop-blur border-r border-gray-800 text-xs select-none">
      {/* Qubit Selector Tabs */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-800 bg-gray-900/50">
        <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Qubit:</span>
        {reducedStates.map((s) => (
          <button
            key={s.index}
            onClick={() => onSelectQubit(s.index)}
            className={`px-2 py-1 rounded font-mono font-bold transition-colors ${
              selectedQubitIndex === s.index
                ? 'bg-purple-600 text-white shadow'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            q[{s.index}]
            {s.entangled && <span className="ml-1 text-[9px] text-pink-300">★</span>}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative min-h-[220px]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        />

        {activeQubitState?.entangled && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500/60 text-pink-300 font-mono text-[10px] animate-pulse">
            ENTANGLED MIXED STATE
          </div>
        )}
      </div>

      {/* Spherical & Probability Telemetry Footer */}
      {activeQubitState && (
        <div className="p-3 border-t border-gray-800 bg-gray-950/90 font-mono text-[11px] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-400">Polar Angle (θ):</span>
            <span className="text-purple-300 font-bold">
              {((activeQubitState.theta * 180) / Math.PI).toFixed(1)}° (
              {(activeQubitState.theta / Math.PI).toFixed(2)}π)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Azimuthal Phase (φ):</span>
            <span className="text-indigo-300 font-bold">
              {((activeQubitState.phi * 180) / Math.PI).toFixed(1)}° (
              {(activeQubitState.phi / Math.PI).toFixed(2)}π)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Bloch Vector |a|:</span>
            <span
              className={activeQubitState.entangled ? 'text-pink-400 font-bold' : 'text-emerald-400 font-bold'}
            >
              {Math.sqrt(
                activeQubitState.bloch.x ** 2 + activeQubitState.bloch.y ** 2 + activeQubitState.bloch.z ** 2
              ).toFixed(3)}{' '}
              {activeQubitState.entangled ? '(entangled)' : '(pure)'}
            </span>
          </div>

          <div className="pt-1 grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-gray-900 p-1.5 rounded border border-gray-800">
              <span className="text-sky-400 font-bold block">P(|0⟩):</span>
              <span className="text-slate-100 font-bold">{(activeQubitState.prob0 * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-gray-900 p-1.5 rounded border border-gray-800">
              <span className="text-amber-400 font-bold block">P(|1⟩):</span>
              <span className="text-slate-100 font-bold">{(activeQubitState.prob1 * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
