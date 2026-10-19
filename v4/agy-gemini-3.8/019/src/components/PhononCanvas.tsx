/**
 * PhononCanvas.tsx
 * Diatomic lattice vibration & phonon dispersion visualizer.
 * Renders acoustic and optical phonon branches, sound speed tangent,
 * phonon bandgap, and live animated atomic displacement waves.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { SimulationParameters } from '../types/index.js';
import { PhononDispersionEngine, PhononPoint } from '../physics/PhononDispersionEngine.js';

interface PhononCanvasProps {
  params: SimulationParameters;
  simTime: number;
  onUpdatePhononAudio?: (omegaMinus: number, omegaPlus: number, active: boolean) => void;
}

export const PhononCanvas: React.FC<PhononCanvasProps> = ({
  params,
  simTime,
  onUpdatePhononAudio
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dimension caching
  const cachedDimsRef = useRef({ w: 0, h: 0 });

  const [probedQ, setProbedQ] = useState<number>(0.2);

  const phononParams = useMemo(() => ({
    M1_amu: params.M1_amu,
    M2_amu: params.M2_amu,
    Cs: params.Cs_force,
    a_angstrom: params.latticeConstant
  }), [params.M1_amu, params.M2_amu, params.Cs_force, params.latticeConstant]);

  const curveData = useMemo<PhononPoint[]>(() => {
    return PhononDispersionEngine.samplePhononCurve(phononParams, 80);
  }, [phononParams]);

  const soundSpeed = useMemo(() => {
    return PhononDispersionEngine.computeSoundSpeed(phononParams);
  }, [phononParams]);

  const bandgap = useMemo(() => {
    return PhononDispersionEngine.computePhononBandgap(phononParams);
  }, [phononParams]);

  const maxOmega = useMemo(() => {
    if (curveData.length === 0) return 100;
    let max = 0;
    for (let i = 0; i < curveData.length; i++) {
      if (curveData[i].omegaOptical > max) max = curveData[i].omegaOptical;
    }
    return max * 1.15;
  }, [curveData]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || curveData.length === 0) return;

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

    // Layout: Top 70% Phonon Dispersion Plot, Bottom 30% Animated Atomic Chain
    const plotH = Math.floor(height * 0.65);
    const chainH = height - plotH - 30;
    const chainY = plotH + 20;

    const margin = { top: 30, right: 30, bottom: 30, left: 60 };
    const plotW = width - margin.left - margin.right;

    if (plotW <= 10 || plotH <= 10) return;

    const qMax = Math.PI / phononParams.a_angstrom;

    const xFromQ = (q: number) => margin.left + ((q + qMax) / (2 * qMax)) * plotW;
    const yFromOmega = (om: number) => margin.top + (plotH - margin.top) * (1 - om / maxOmega);

    // Grid Lines & Frequency Axis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const omVal = (i / 5) * maxOmega;
      const y = yFromOmega(omVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();

      ctx.fillText(`${omVal.toFixed(1)} rad/ps`, margin.left - 8, y + 3);
    }

    // High Symmetry Ticks: -pi/a, Gamma (0), +pi/a
    ctx.textAlign = 'center';
    const qTicks = [
      { q: -qMax, label: '-π/a' },
      { q: 0, label: 'Γ (0)' },
      { q: qMax, label: '+π/a' }
    ];

    qTicks.forEach((tk) => {
      const x = xFromQ(tk.q);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, plotH);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(tk.label, x, plotH + 16);
    });

    // Phonon Bandgap Shaded Region
    if (bandgap > 0.01) {
      const pEdge = curveData[curveData.length - 1];
      const yAcousticMax = yFromOmega(pEdge.omegaAcoustic);
      const yOpticalMin = yFromOmega(pEdge.omegaOptical);

      ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
      ctx.fillRect(margin.left, yOpticalMin, plotW, yAcousticMax - yOpticalMin);

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yAcousticMax);
      ctx.lineTo(margin.left + plotW, yAcousticMax);
      ctx.moveTo(margin.left, yOpticalMin);
      ctx.lineTo(margin.left + plotW, yOpticalMin);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f472b6';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Phonon Gap Δω = ${bandgap.toFixed(2)} rad/ps`, margin.left + plotW - 12, (yAcousticMax + yOpticalMin) / 2 + 3);
    }

    // Acoustic Branch Curve (Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    curveData.forEach((pt, idx) => {
      const x = xFromQ(pt.q);
      const y = yFromOmega(pt.omegaAcoustic);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Optical Branch Curve (Rose)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    curveData.forEach((pt, idx) => {
      const x = xFromQ(pt.q);
      const y = yFromOmega(pt.omegaOptical);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Sound Speed Tangent at q = 0 (Dashed Lime)
    // vs in m/s. omega = vs * q -> omega(rad/ps) = (vs / 100) * q(1/Angstrom)
    const slope = soundSpeed / 100;
    const tangentQMax = Math.min(qMax * 0.4, maxOmega / slope);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xFromQ(0), yFromOmega(0));
    ctx.lineTo(xFromQ(tangentQMax), yFromOmega(slope * tangentQMax));
    ctx.moveTo(xFromQ(0), yFromOmega(0));
    ctx.lineTo(xFromQ(-tangentQMax), yFromOmega(slope * tangentQMax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Probed Wavevector Marker
    const probedX = xFromQ(probedQ);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(probedX, margin.top);
    ctx.lineTo(probedX, plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    const { omegaMinus, omegaPlus } = PhononDispersionEngine.computePhononFrequencies(probedQ, phononParams);

    // Probe Dots
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(probedX, yFromOmega(omegaMinus), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(probedX, yFromOmega(omegaPlus), 5, 0, 2 * Math.PI);
    ctx.fill();

    // Send audio update
    if (onUpdatePhononAudio) {
      onUpdatePhononAudio(omegaMinus, omegaPlus, true);
    }

    // Legend
    ctx.textAlign = 'left';
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('— Acoustic Mode (ω₋)', margin.left + 15, margin.top + 16);
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('— Optical Mode (ω₊)', margin.left + 15, margin.top + 32);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`-- Sound Speed vs = ${(soundSpeed / 1000).toFixed(2)} km/s`, margin.left + 15, margin.top + 48);

    // ==========================================
    // ANIMATED ATOMIC LATTICE DISPLACEMENT WAVE
    // ==========================================
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(margin.left, chainY, plotW, chainH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(margin.left, chainY, plotW, chainH);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Real-Time Lattice Wave (Acoustic in-phase vs Optical out-of-phase vibrations)', margin.left + 12, chainY + 16);

    const numAtoms = 16;
    const atomSpacing = (plotW - 60) / numAtoms;
    const atomBaseY = chainY + chainH / 2 + 6;

    for (let i = 0; i < numAtoms; i++) {
      const isM1 = i % 2 === 0;
      const x0 = margin.left + 30 + i * atomSpacing;

      // Longitudinal displacement: u(x, t) = A * cos(q*x - omega*t)
      // For acoustic branch: atoms move in-phase
      // For optical branch: alternating atoms move in opposition
      const phase = probedQ * i * 2.0 - omegaMinus * simTime * 4.0;
      const disp = 8 * Math.cos(phase);

      const px = x0 + disp;

      // Spring connection to neighbor
      if (i < numAtoms - 1) {
        const nextX0 = margin.left + 30 + (i + 1) * atomSpacing;
        const nextPhase = probedQ * (i + 1) * 2.0 - omegaMinus * simTime * 4.0;
        const nextDisp = 8 * Math.cos(nextPhase);
        const nextPx = nextX0 + nextDisp;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, atomBaseY);
        ctx.lineTo(nextPx, atomBaseY);
        ctx.stroke();
      }

      // Draw Atom Circle
      ctx.fillStyle = isM1 ? '#38bdf8' : '#fb7185';
      const rAtom = isM1 ? 6 : 8; // M2 is heavier, larger radius
      ctx.beginPath();
      ctx.arc(px, atomBaseY, rAtom, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [curveData, phononParams, soundSpeed, bandgap, maxOmega, probedQ, simTime, onUpdatePhononAudio]);

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

  // Audio unmount cleanup
  useEffect(() => {
    return () => {
      onUpdatePhononAudio?.(0, 0, false);
    };
  }, [onUpdatePhononAudio]);

  const [isDraggingQ, setIsDraggingQ] = useState(false);

  const updateQFromPointer = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;

    const margin = { top: 30, right: 30, bottom: 30, left: 60 };
    const plotW = rect.width - margin.left - margin.right;
    const qMax = Math.PI / phononParams.a_angstrom;

    const q = -qMax + ((mouseX - margin.left) / plotW) * 2 * qMax;
    setProbedQ(Math.max(-qMax, Math.min(qMax, q)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingQ(true);
    updateQFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingQ) {
      updateQFromPointer(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingQ(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block cursor-crosshair touch-none"
      />
      <div className="absolute top-2 left-14 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 pointer-events-none">
        <span>Phonon Dynamics • Drag or click plot to scrub wavevector q and sonify lattice modes</span>
      </div>
    </div>
  );
};
