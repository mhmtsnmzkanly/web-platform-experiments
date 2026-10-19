/**
 * FermiSurfaceCanvas.tsx
 * 2D Brillouin Zone momentum-space visualizer.
 * Renders Fermi surface contour isolines via Marching Squares,
 * draggable k-probe handle with live sonification, and real-space atomic lattice inset.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimulationParameters } from '../types/index.js';
import { TightBindingSolver, ContourSegment } from '../physics/TightBindingSolver.js';

interface FermiSurfaceCanvasProps {
  params: SimulationParameters;
  onUpdateProbe?: (kx: number, ky: number) => void;
  onProbeHover?: (energy_eV: number, active: boolean) => void;
}

export const FermiSurfaceCanvas: React.FC<FermiSurfaceCanvasProps> = ({
  params,
  onUpdateProbe,
  onProbeHover
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);

  // Dimension caching
  const cachedDimsRef = useRef({ w: 0, h: 0 });

  // Contours computed from Marching Squares
  const [contours, setContours] = useState<ContourSegment[]>([]);

  useEffect(() => {
    const segs = TightBindingSolver.computeFermiSurfaceContours(
      params.latticeType,
      {
        t: params.t,
        tp: params.tp,
        latticeParam: params.latticeConstant
      },
      params.ef,
      60
    );
    setContours(segs);
  }, [params.latticeType, params.t, params.tp, params.latticeConstant, params.ef]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      cachedDimsRef.current = { w: targetW, h: targetH };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping: center at (cx, cy)
    const cx = width / 2;
    const cy = height / 2;
    const kMax = (2.2 * Math.PI) / params.latticeConstant;
    const scale = Math.min(width, height) / (2.2 * kMax);

    const screenX = (kx: number) => cx + kx * scale;
    const screenY = (ky: number) => cy - ky * scale; // Invert y for standard Cartesian

    // 1. Grid Axes in Reciprocal Space
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // 2. First Brillouin Zone (FBZ) Boundary
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    if (params.latticeType === 'GRAPHENE') {
      // Hexagonal BZ boundary
      const acc = params.latticeConstant;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const rK = (4 * Math.PI) / (3 * Math.sqrt(3) * acc);
        const hx = rK * Math.cos(angle);
        const hy = rK * Math.sin(angle);
        if (i === 0) ctx.moveTo(screenX(hx), screenY(hy));
        else ctx.lineTo(screenX(hx), screenY(hy));
      }
      ctx.closePath();
      ctx.stroke();
    } else {
      // Square BZ boundary [-pi/a, pi/a]
      const piOverA = Math.PI / params.latticeConstant;
      ctx.strokeRect(
        screenX(-piOverA),
        screenY(piOverA),
        2 * piOverA * scale,
        2 * piOverA * scale
      );
    }
    ctx.setLineDash([]);

    // 3. High-Symmetry Points
    const highSymPoints = TightBindingSolver.getHighSymmetryPoints(
      params.latticeType,
      params.latticeConstant
    );

    highSymPoints.forEach((pt) => {
      const px = screenX(pt.kx);
      const py = screenY(pt.ky);

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(pt.name, px + 7, py - 4);
    });

    // 4. Fermi Surface Contour Lines (Marching Squares)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    contours.forEach((seg) => {
      ctx.moveTo(screenX(seg.x1), screenY(seg.y1));
      ctx.lineTo(screenX(seg.x2), screenY(seg.y2));
    });
    ctx.stroke();

    // 5. Draggable k-Probe Indicator
    const probeX = screenX(params.probeKx);
    const probeY = screenY(params.probeKy);

    // Glowing halo
    const grad = ctx.createRadialGradient(probeX, probeY, 2, probeX, probeY, 18);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(probeX, probeY, 18, 0, 2 * Math.PI);
    ctx.fill();

    // Probe circle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(probeX, probeY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Energy at Probe
    let probeEnergy = 0;
    if (params.latticeType === 'GRAPHENE') {
      const [eMinus, ePlus] = TightBindingSolver.computeGrapheneEnergy(
        params.probeKx,
        params.probeKy,
        params.t,
        params.latticeConstant
      );
      probeEnergy = Math.abs(eMinus - params.ef) < Math.abs(ePlus - params.ef) ? eMinus : ePlus;
    } else if (params.latticeType === 'SQUARE') {
      probeEnergy = TightBindingSolver.computeSquareEnergy(
        params.probeKx,
        params.probeKy,
        params.t,
        params.tp,
        params.latticeConstant
      );
    } else {
      probeEnergy = TightBindingSolver.computeTriangularEnergy(
        params.probeKx,
        params.probeKy,
        params.t,
        params.latticeConstant
      );
    }

    // Call sonification probe
    if (onProbeHover) {
      onProbeHover(probeEnergy, true);
    }

    // Probe HUD Tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(probeX + 12, probeY - 26, 130, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`k: (${params.probeKx.toFixed(2)}, ${params.probeKy.toFixed(2)}) Å⁻¹`, probeX + 18, probeY - 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`E(k): ${probeEnergy.toFixed(3)} eV`, probeX + 18, probeY + 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Δ(E-EF): ${(probeEnergy - params.ef).toFixed(3)} eV`, probeX + 18, probeY + 16);

    // ==========================================
    // REAL-SPACE ATOMIC LATTICE INSET (TOP-RIGHT)
    // ==========================================
    const insetW = 120;
    const insetH = 120;
    const insetX = width - insetW - 16;
    const insetY = 16;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(insetX, insetY, insetW, insetH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Real-Space Lattice', insetX + insetW / 2, insetY + 14);

    // Draw small crystal lattice
    const iCx = insetX + insetW / 2;
    const iCy = insetY + insetH / 2 + 6;
    const iScale = 14;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;

    if (params.latticeType === 'GRAPHENE') {
      // Small honeycomb
      for (let ring = 0; ring < 2; ring++) {
        for (let a = 0; a < 6; a++) {
          const ang = (Math.PI / 3) * a;
          const ax = iCx + iScale * Math.cos(ang);
          const ay = iCy + iScale * Math.sin(ang);

          ctx.fillStyle = a % 2 === 0 ? '#38bdf8' : '#ec4899'; // Sublattice A / B
          ctx.beginPath();
          ctx.arc(ax, ay, 3, 0, 2 * Math.PI);
          ctx.fill();

          const nextAng = (Math.PI / 3) * (a + 1);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(iCx + iScale * Math.cos(nextAng), iCy + iScale * Math.sin(nextAng));
          ctx.stroke();
        }
      }
    } else {
      // Small square lattice
      const step = 18;
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          const px = iCx + ix * step;
          const py = iCy + iy * step;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, 2 * Math.PI);
          ctx.fill();

          if (ix < 1) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + step, py);
            ctx.stroke();
          }
          if (iy < 1) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + step);
            ctx.stroke();
          }
        }
      }
    }
  }, [contours, params, onProbeHover]);

  useEffect(() => {
    render();
  }, [render]);

  // Window resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [render]);

  // Audio probe unmount cleanup
  useEffect(() => {
    return () => {
      onProbeHover?.(0, false);
    };
  }, [onProbeHover]);

  // Pointer dragging for k-probe
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const kMax = (2.2 * Math.PI) / params.latticeConstant;
    const scale = Math.min(rect.width, rect.height) / (2.2 * kMax);

    const probePx = cx + params.probeKx * scale;
    const probePy = cy - params.probeKy * scale;

    if (Math.hypot(mouseX - probePx, mouseY - probePy) < 25) {
      setIsDraggingProbe(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingProbe || !onUpdateProbe) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const kMax = (2.2 * Math.PI) / params.latticeConstant;
    const scale = Math.min(rect.width, rect.height) / (2.2 * kMax);

    const newKx = (mouseX - cx) / scale;
    const newKy = (cy - mouseY) / scale;

    onUpdateProbe(newKx, newKy);
  };

  const handlePointerUp = () => {
    setIsDraggingProbe(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block cursor-pointer touch-none"
      />
      <div className="absolute top-2 left-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 pointer-events-none">
        <span>2D Brillouin Zone • Cyan: Fermi Contours • Drag Amber Probe to inspect E(k)</span>
      </div>
    </div>
  );
};
