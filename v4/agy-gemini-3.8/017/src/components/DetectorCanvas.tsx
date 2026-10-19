import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CollisionEvent, Particle, SuiteMode, DetectorConfig } from '../types';
import { DETECTOR_SPECS, DetectorGeometry } from '../physics/DetectorGeometry';

interface DetectorCanvasProps {
  event: CollisionEvent | null;
  config: DetectorConfig;
  mode: SuiteMode;
  onSelectParticle: (particle: Particle | null) => void;
  selectedParticle: Particle | null;
}

export const DetectorCanvas: React.FC<DetectorCanvasProps> = ({
  event,
  config,
  mode,
  onSelectParticle,
  selectedParticle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoveredParticleRef = useRef<Particle | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{
    particle: Particle;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Precompute track points when event or B-field changes to eliminate GC churn
  const trackPointsMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; z: number; r: number }[]>();
    if (!event) return map;
    for (const p of event.visibleParticles) {
      map.set(
        p.id,
        DetectorGeometry.calculateTrackPoints(p, config.magneticFieldB, DETECTOR_SPECS.muonOuterRadius)
      );
    }
    return map;
  }, [event, config.magneticFieldB]);

  // Animation frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = '#030712'; // Deep cosmic background
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      if (mode === 'TRANSVERSE_DETECTOR') {
        renderTransverseView(ctx, width, height, centerX, centerY);
      } else if (mode === 'LONGITUDINAL_RZ') {
        renderLongitudinalView(ctx, width, height, centerX, centerY);
      }

      animId = requestAnimationFrame(render);
    };

    const renderTransverseView = (
      c: CanvasRenderingContext2D,
      w: number,
      h: number,
      cx: number,
      cy: number
    ) => {
      // Scale: detector outer muon chamber radius is 6.2 m
      const maxRadius = DETECTOR_SPECS.muonOuterRadius * 1.15;
      const scale = Math.min(w, h) * 0.45 / maxRadius;

      // 1. Draw Subdetector Layers
      drawTransverseDetectorGeometry(c, cx, cy, scale);

      if (!event) return;

      // 2. Draw Anti-kt Jet Cones (transverse projection)
      for (const jet of event.jets) {
        c.save();
        c.beginPath();
        c.moveTo(cx, cy);
        const rInner = DETECTOR_SPECS.hcalInnerRadius * scale;
        const rOuter = DETECTOR_SPECS.hcalOuterRadius * scale;
        const jetPhi = jet.phi;
        const halfR = jet.coneRadius * 0.5;

        c.arc(cx, cy, rOuter, jetPhi - halfR, jetPhi + halfR);
        c.closePath();
        c.fillStyle = 'rgba(56, 189, 248, 0.12)';
        c.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        c.lineWidth = 1.5;
        c.fill();
        c.stroke();

        // Label jet pt
        const labelR = rOuter + 14;
        const lx = cx + labelR * Math.cos(jetPhi);
        const ly = cy + labelR * Math.sin(jetPhi);
        c.fillStyle = '#38bdf8';
        c.font = '10px monospace';
        c.textAlign = 'center';
        c.fillText(`Jet ${jet.pt.toFixed(0)} GeV`, lx, ly);
        c.restore();
      }

      // 3. Draw Missing Transverse Energy (MET) Vector
      if (event.missingET.mag > 15.0) {
        c.save();
        const metLen = Math.min(DETECTOR_SPECS.muonOuterRadius * scale * 0.95, (event.missingET.mag / 200) * DETECTOR_SPECS.muonOuterRadius * scale);
        const arrowX = cx + metLen * Math.cos(event.missingET.phi);
        const arrowY = cy + metLen * Math.sin(event.missingET.phi);

        c.strokeStyle = '#ec4899';
        c.lineWidth = 3;
        c.setLineDash([8, 4]);
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(arrowX, arrowY);
        c.stroke();
        c.setLineDash([]);

        // Arrow head
        const headLen = 10;
        const headAngle = Math.PI / 6;
        c.fillStyle = '#ec4899';
        c.beginPath();
        c.moveTo(arrowX, arrowY);
        c.lineTo(
          arrowX - headLen * Math.cos(event.missingET.phi - headAngle),
          arrowY - headLen * Math.sin(event.missingET.phi - headAngle)
        );
        c.lineTo(
          arrowX - headLen * Math.cos(event.missingET.phi + headAngle),
          arrowY - headLen * Math.sin(event.missingET.phi + headAngle)
        );
        c.closePath();
        c.fill();

        // Label MET
        c.font = 'bold 11px monospace';
        c.fillStyle = '#f472b6';
        c.textAlign = 'center';
        c.fillText(
          `E_T^miss = ${event.missingET.mag.toFixed(1)} GeV`,
          arrowX + 20 * Math.cos(event.missingET.phi),
          arrowY + 20 * Math.sin(event.missingET.phi)
        );
        c.restore();
      }

      // 4. Draw Particle Tracks
      for (const p of event.visibleParticles) {
        if (p.pt < config.ptCutGeV) continue;

        const isHovered = hoveredParticleRef.current?.id === p.id;
        const isSelected = selectedParticle?.id === p.id;
        const isHighlighted = isHovered || isSelected;

        const points = trackPointsMap.get(p.id) || [];
        if (points.length < 2) continue;

        c.save();
        c.beginPath();
        c.moveTo(cx + points[0].x * scale, cy + points[0].y * scale);

        for (let i = 1; i < points.length; i++) {
          c.lineTo(cx + points[i].x * scale, cy + points[i].y * scale);
        }

        if (p.charge === 0) {
          c.setLineDash([4, 4]);
        }

        c.strokeStyle = isHighlighted ? '#ffffff' : p.color;
        c.lineWidth = isHighlighted ? 3.5 : (p.pt > 40 ? 2.5 : 1.5);
        if (isHighlighted) {
          c.shadowColor = p.color;
          c.shadowBlur = 10;
        }
        c.stroke();
        c.restore();

        // Draw Calorimeter Energy Towers / Hits
        for (const hit of p.detectorHits) {
          const hx = cx + hit.x * scale;
          const hy = cy + hit.y * scale;

          c.save();
          if (hit.subdetector === 'ECAL') {
            // Hexagonal / Square crystal flash
            const size = Math.min(16, 4 + Math.sqrt(hit.energyDeposit) * 1.8);
            c.fillStyle = isHighlighted ? '#fde047' : '#f59e0b';
            c.fillRect(hx - size * 0.5, hy - size * 0.5, size, size);
            c.strokeStyle = '#ffffff';
            c.lineWidth = 1;
            c.strokeRect(hx - size * 0.5, hy - size * 0.5, size, size);
          } else if (hit.subdetector === 'HCAL') {
            const size = Math.min(22, 6 + Math.sqrt(hit.energyDeposit) * 1.5);
            c.fillStyle = isHighlighted ? '#67e8f9' : '#0284c7';
            c.beginPath();
            c.arc(hx, hy, size * 0.5, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = 'rgba(255,255,255,0.7)';
            c.lineWidth = 1;
            c.stroke();
          } else if (hit.subdetector === 'MUON') {
            // Bright neon crosshair at drift chamber
            c.strokeStyle = isHighlighted ? '#4ade80' : '#10b981';
            c.lineWidth = 2;
            c.beginPath();
            c.arc(hx, hy, 5, 0, Math.PI * 2);
            c.stroke();
          }
          c.restore();
        }
      }

      // Interaction point marker
      c.beginPath();
      c.arc(cx, cy, 3, 0, Math.PI * 2);
      c.fillStyle = '#facc15';
      c.fill();
    };

    const renderLongitudinalView = (
      c: CanvasRenderingContext2D,
      w: number,
      h: number,
      cx: number,
      cy: number
    ) => {
      // Scale in Z (up to 7.5m) and R (up to 6.2m)
      const scaleZ = (w * 0.44) / DETECTOR_SPECS.lengthHalfZ;
      const scaleR = (h * 0.42) / DETECTOR_SPECS.muonOuterRadius;

      // Draw R-Z Detector Cross-Section
      drawLongitudinalDetectorGeometry(c, cx, cy, scaleZ, scaleR);

      if (!event) return;

      // Draw Particle Tracks in R-Z
      for (const p of event.visibleParticles) {
        if (p.pt < config.ptCutGeV) continue;
        const isHovered = hoveredParticleRef.current?.id === p.id;
        const isSelected = selectedParticle?.id === p.id;
        const isHighlighted = isHovered || isSelected;

        const points = trackPointsMap.get(p.id) || [];
        if (points.length < 2) continue;

        c.save();
        c.beginPath();
        // Sign of R depends on y
        const signR = p.py >= 0 ? 1 : -1;
        c.moveTo(cx + points[0].z * scaleZ, cy - signR * points[0].r * scaleR);

        for (let i = 1; i < points.length; i++) {
          c.lineTo(cx + points[i].z * scaleZ, cy - signR * points[i].r * scaleR);
        }

        if (p.charge === 0) c.setLineDash([4, 4]);
        c.strokeStyle = isHighlighted ? '#ffffff' : p.color;
        c.lineWidth = isHighlighted ? 3 : 1.5;
        if (isHighlighted) {
          c.shadowColor = p.color;
          c.shadowBlur = 8;
        }
        c.stroke();
        c.restore();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [event, config, mode, selectedParticle]);

  // Detector Geometry Drawings
  const drawTransverseDetectorGeometry = (
    c: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scale: number
  ) => {
    // Helper for concentric circles
    const drawRing = (rInner: number, rOuter: number, fill: string, stroke: string) => {
      c.beginPath();
      c.arc(cx, cy, rOuter * scale, 0, Math.PI * 2);
      c.arc(cx, cy, rInner * scale, 0, Math.PI * 2, true);
      c.fillStyle = fill;
      c.fill();
      c.strokeStyle = stroke;
      c.lineWidth = 1;
      c.stroke();
    };

    // 1. Muon Chambers (Outer Sector Segments)
    const rMuonIn = DETECTOR_SPECS.muonInnerRadius;
    const rMuonOut = DETECTOR_SPECS.muonOuterRadius;
    drawRing(rMuonIn, rMuonOut, 'rgba(15, 23, 42, 0.45)', 'rgba(51, 65, 85, 0.6)');

    // Muon 16-fold symmetry drift chamber wedges
    c.save();
    c.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    c.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      c.beginPath();
      c.moveTo(cx + rMuonIn * scale * Math.cos(angle), cy + rMuonIn * scale * Math.sin(angle));
      c.lineTo(cx + rMuonOut * scale * Math.cos(angle), cy + rMuonOut * scale * Math.sin(angle));
      c.stroke();
    }
    c.restore();

    // 2. Solenoid Magnet Ring
    drawRing(DETECTOR_SPECS.solenoidRadius - 0.1, DETECTOR_SPECS.solenoidRadius + 0.1, 'rgba(76, 29, 149, 0.3)', '#7c3aed');

    // 3. Hadronic Calorimeter (HCAL)
    drawRing(DETECTOR_SPECS.hcalInnerRadius, DETECTOR_SPECS.hcalOuterRadius, 'rgba(12, 74, 110, 0.35)', 'rgba(14, 116, 144, 0.7)');

    // 4. Electromagnetic Calorimeter (ECAL)
    drawRing(DETECTOR_SPECS.ecalInnerRadius, DETECTOR_SPECS.ecalOuterRadius, 'rgba(120, 53, 15, 0.35)', 'rgba(217, 119, 6, 0.8)');

    // 5. Silicon Inner Tracker
    drawRing(DETECTOR_SPECS.trackerInnerRadius, DETECTOR_SPECS.trackerOuterRadius, 'rgba(6, 78, 59, 0.25)', 'rgba(16, 185, 129, 0.5)');

    // Concentric silicon barrel layers
    const barrelRadii = [0.15, 0.35, 0.60, 0.85, 1.10];
    c.save();
    c.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    c.lineWidth = 0.8;
    c.setLineDash([3, 5]);
    for (const r of barrelRadii) {
      c.beginPath();
      c.arc(cx, cy, r * scale, 0, Math.PI * 2);
      c.stroke();
    }
    c.restore();

    // 6. Central Beam Pipe
    c.beginPath();
    c.arc(cx, cy, DETECTOR_SPECS.beamPipeRadius * scale, 0, Math.PI * 2);
    c.fillStyle = '#1e293b';
    c.strokeStyle = '#94a3b8';
    c.lineWidth = 1.2;
    c.fill();
    c.stroke();

    // Layer Labels
    c.save();
    c.font = '9px monospace';
    c.fillStyle = 'rgba(148, 163, 184, 0.6)';
    c.textAlign = 'left';
    c.fillText('TRACKER', cx + 10, cy - DETECTOR_SPECS.trackerInnerRadius * scale - 12);
    c.fillText('ECAL', cx + 10, cy - DETECTOR_SPECS.ecalInnerRadius * scale - 10);
    c.fillText('HCAL', cx + 10, cy - DETECTOR_SPECS.hcalInnerRadius * scale - 10);
    c.fillText('SOLENOID 4T', cx + 10, cy - DETECTOR_SPECS.solenoidRadius * scale - 5);
    c.fillText('MUON SPECTROMETER', cx + 10, cy - DETECTOR_SPECS.muonInnerRadius * scale - 10);
    c.restore();
  };

  const drawLongitudinalDetectorGeometry = (
    c: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scaleZ: number,
    scaleR: number
  ) => {
    const halfZ = DETECTOR_SPECS.lengthHalfZ;

    // Beam Line (Z-axis)
    c.save();
    c.strokeStyle = '#475569';
    c.lineWidth = 1.5;
    c.setLineDash([6, 6]);
    c.beginPath();
    c.moveTo(cx - halfZ * scaleZ, cy);
    c.lineTo(cx + halfZ * scaleZ, cy);
    c.stroke();
    c.restore();

    // Helper for symmetrical rectangles
    const drawSymmBox = (zMin: number, zMax: number, rMin: number, rMax: number, fill: string, stroke: string) => {
      // Top half (+R)
      c.fillStyle = fill;
      c.strokeStyle = stroke;
      c.lineWidth = 1;

      c.fillRect(cx + zMin * scaleZ, cy - rMax * scaleR, (zMax - zMin) * scaleZ, (rMax - rMin) * scaleR);
      c.strokeRect(cx + zMin * scaleZ, cy - rMax * scaleR, (zMax - zMin) * scaleZ, (rMax - rMin) * scaleR);

      // Bottom half (-R)
      c.fillRect(cx + zMin * scaleZ, cy + rMin * scaleR, (zMax - zMin) * scaleZ, (rMax - rMin) * scaleR);
      c.strokeRect(cx + zMin * scaleZ, cy + rMin * scaleR, (zMax - zMin) * scaleZ, (rMax - rMin) * scaleR);
    };

    // Muon Barrel & Endcap
    drawSymmBox(-halfZ, halfZ, DETECTOR_SPECS.muonInnerRadius, DETECTOR_SPECS.muonOuterRadius, 'rgba(15, 23, 42, 0.45)', 'rgba(51, 65, 85, 0.6)');

    // Solenoid
    drawSymmBox(-3.5, 3.5, DETECTOR_SPECS.solenoidRadius - 0.1, DETECTOR_SPECS.solenoidRadius + 0.1, 'rgba(76, 29, 149, 0.3)', '#7c3aed');

    // HCAL Barrel & Endcaps
    drawSymmBox(-4.0, 4.0, DETECTOR_SPECS.hcalInnerRadius, DETECTOR_SPECS.hcalOuterRadius, 'rgba(12, 74, 110, 0.35)', 'rgba(14, 116, 144, 0.7)');

    // ECAL Barrel & Endcaps
    drawSymmBox(-3.0, 3.0, DETECTOR_SPECS.ecalInnerRadius, DETECTOR_SPECS.ecalOuterRadius, 'rgba(120, 53, 15, 0.35)', 'rgba(217, 119, 6, 0.8)');

    // Silicon Tracker
    drawSymmBox(-2.5, 2.5, DETECTOR_SPECS.trackerInnerRadius, DETECTOR_SPECS.trackerOuterRadius, 'rgba(6, 78, 59, 0.25)', 'rgba(16, 185, 129, 0.5)');

    // Pseudorapidity guidelines (eta = 1, 2, 3)
    c.save();
    c.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    c.lineWidth = 1;
    c.setLineDash([3, 5]);
    c.font = '9px monospace';
    c.fillStyle = 'rgba(148, 163, 184, 0.5)';

    const etas = [1.0, 2.0, 3.0];
    for (const eta of etas) {
      const theta = 2 * Math.atan(Math.exp(-eta));
      const zRay = halfZ;
      const rRay = zRay * Math.tan(theta);

      // +Z
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + zRay * scaleZ, cy - rRay * scaleR);
      c.stroke();
      c.fillText(`η=${eta}`, cx + zRay * scaleZ - 25, cy - rRay * scaleR - 4);

      // -Z
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx - zRay * scaleZ, cy - rRay * scaleR);
      c.stroke();
      c.fillText(`η=-${eta}`, cx - zRay * scaleZ + 6, cy - rRay * scaleR - 4);
    }
    c.restore();
  };

  // Pointer hover and click interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !event) return;
    const rect = canvas.getBoundingClientRect();

    // Normalize CSS client coordinates to Canvas internal device pixel space
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width * 0.5;
    const cy = height * 0.5;

    let closestParticle: Particle | null = null;
    let closestDist = 20 * scaleX; // hit test tolerance scaled to device pixels

    if (mode === 'TRANSVERSE_DETECTOR') {
      const maxRadius = DETECTOR_SPECS.muonOuterRadius * 1.15;
      const scale = (Math.min(width, height) * 0.45) / maxRadius;

      for (const p of event.visibleParticles) {
        if (p.pt < config.ptCutGeV) continue;
        const pts = trackPointsMap.get(p.id) || [];
        for (const pt of pts) {
          const px = cx + pt.x * scale;
          const py = cy + pt.y * scale;
          const d = Math.hypot(mx - px, my - py);
          if (d < closestDist) {
            closestDist = d;
            closestParticle = p;
          }
        }
      }
    } else if (mode === 'LONGITUDINAL_RZ') {
      const scaleZ = (width * 0.44) / DETECTOR_SPECS.lengthHalfZ;
      const scaleR = (height * 0.42) / DETECTOR_SPECS.muonOuterRadius;

      for (const p of event.visibleParticles) {
        if (p.pt < config.ptCutGeV) continue;
        const pts = trackPointsMap.get(p.id) || [];
        const signR = p.py >= 0 ? 1 : -1;
        for (const pt of pts) {
          const px = cx + pt.z * scaleZ;
          const py = cy - signR * pt.r * scaleR;
          const d = Math.hypot(mx - px, my - py);
          if (d < closestDist) {
            closestDist = d;
            closestParticle = p;
          }
        }
      }
    }

    hoveredParticleRef.current = closestParticle;
    if (closestParticle) {
      setHoveredInfo({
        particle: closestParticle,
        screenX: e.clientX,
        screenY: e.clientY,
      });
    } else {
      setHoveredInfo(null);
    }
  };

  const handlePointerDown = () => {
    if (hoveredParticleRef.current) {
      onSelectParticle(hoveredParticleRef.current);
    } else {
      onSelectParticle(null);
    }
  };

  const handlePointerLeave = () => {
    hoveredParticleRef.current = null;
    setHoveredInfo(null);
  };

  // Handle Resize
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#030712]">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {/* Floating HUD Tooltip on Hover */}
      {hoveredInfo && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-2 bg-slate-900/95 border border-cyan-500/50 rounded-lg shadow-xl backdrop-blur-md text-xs text-slate-100 flex flex-col gap-1"
          style={{
            left: `${hoveredInfo.screenX + 16}px`,
            top: `${hoveredInfo.screenY + 16}px`,
          }}
        >
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: hoveredInfo.particle.color }}
            />
            <span className="font-bold text-cyan-400">{hoveredInfo.particle.name}</span>
            <span className="text-[10px] text-slate-400">
              q = {hoveredInfo.particle.charge > 0 ? `+${hoveredInfo.particle.charge}` : hoveredInfo.particle.charge}e
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300">
            <div>pT: <span className="text-white font-semibold">{hoveredInfo.particle.pt.toFixed(2)}</span> GeV</div>
            <div>Energy: <span className="text-white">{hoveredInfo.particle.E.toFixed(2)}</span> GeV</div>
            <div>η (pseudo): <span className="text-white">{hoveredInfo.particle.eta.toFixed(2)}</span></div>
            <div>φ (azimuth): <span className="text-white">{(hoveredInfo.particle.phi * (180 / Math.PI)).toFixed(1)}°</span></div>
          </div>
          <div className="text-[10px] text-slate-400 italic mt-0.5">
            Process: {hoveredInfo.particle.parentProcess}
          </div>
        </div>
      )}
    </div>
  );
};
