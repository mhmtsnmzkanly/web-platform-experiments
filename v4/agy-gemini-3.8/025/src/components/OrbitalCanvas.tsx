/**
 * ORBITAL-SLINGSHOT (EXP-025) — High-DPI Interactive Orbital Mechanics Canvas
 * Conic trajectories, gravitational potential wells, planetary atmospheres,
 * and interactive maneuver node gizmo with prograde & radial handles.
 * Optimized with ResizeObserver, decoupled RAF camera, and throttled ghost projection.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { OrbitalSimulationController } from '../core/OrbitalSimulationController';
import { ProjectedTrajectoryPoint } from '../types';

interface OrbitalCanvasProps {
  controller: OrbitalSimulationController;
}

export const OrbitalCanvas: React.FC<OrbitalCanvasProps> = ({ controller }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance camera state decoupled from RAF re-render loop
  const cameraRef = useRef<{ camX: number; camY: number; zoomScale: number }>({
    camX: 0,
    camY: 0,
    zoomScale: 140,
  });

  // Cached viewport dimensions via ResizeObserver
  const sizeRef = useRef<{ width: number; height: number }>({ width: 800, height: 600 });

  // Projected trajectory cache to prevent GC pressure
  const projectedPointsRef = useRef<ProjectedTrajectoryPoint[]>([]);
  const frameCountRef = useRef<number>(0);

  // User Interaction State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<'PAN' | 'PROGRADE' | 'RADIAL' | null>(null);
  const [followSpacecraft, setFollowSpacecraft] = useState<boolean>(false);
  const followRef = useRef<boolean>(false);
  followRef.current = followSpacecraft;

  // Maneuver Gizmo Vector directions in screen space (cached for mouse drag projection)
  const gizmoVectorsRef = useRef<{ tx: number; ty: number; radX: number; radY: number }>({
    tx: 0,
    ty: 1,
    radX: 0,
    radY: -1,
  });

  // Auto-fit camera when scenario changes
  useEffect(() => {
    const scen = controller.currentScenario;
    const cam = cameraRef.current;
    if (scen.id === 'lunar-insertion') {
      cam.zoomScale = 35000; // Zoom in on Earth-Moon system (~0.003 AU)
      cam.camX = 0.001;
      cam.camY = 0;
    } else if (scen.id === 'grand-tour') {
      cam.zoomScale = 38;    // Zoom out to Jupiter and Saturn (~12 AU)
      cam.camX = 3.5;
      cam.camY = 2.5;
    } else if (scen.id === 'trojan-parking') {
      cam.zoomScale = 55;    // Jupiter Trojan field (~6 AU)
      cam.camX = 2.6;
      cam.camY = 2.5;
    } else {
      cam.zoomScale = 180;   // Inner solar system (~2 AU)
      cam.camX = 0.3;
      cam.camY = 0;
    }
    // Invalidate projected trajectory cache
    projectedPointsRef.current = [];
  }, [controller.currentScenario.id]);

  // Dimension caching via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      sizeRef.current = {
        width: Math.max(100, Math.floor(rect.width)),
        height: Math.max(100, Math.floor(rect.height)),
      };
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  // World to Screen and Screen to World transformations
  const worldToScreen = useCallback((wx: number, wy: number, width: number, height: number) => {
    const cam = cameraRef.current;
    const sx = width * 0.5 + (wx - cam.camX) * cam.zoomScale;
    const sy = height * 0.5 - (wy - cam.camY) * cam.zoomScale; // Canvas Y is inverted
    return { sx, sy };
  }, []);

  // Mouse Interaction Handlers
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    cameraRef.current.zoomScale = Math.max(10, Math.min(200000, cameraRef.current.zoomScale * zoomFactor));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { width, height } = sizeRef.current;
    const sc = controller.engine.spacecraft;
    const node = controller.engine.maneuverNode;

    // Check if clicking maneuver node gizmo handles
    if (node && !node.isExecuted && !sc.isCrashed) {
      const { sx: nodeSx, sy: nodeSy } = worldToScreen(sc.x, sc.y, width, height);
      const { tx, ty, radX, radY } = gizmoVectorsRef.current;
      const handleDist = 38;

      // Handle positions
      const proSx = nodeSx + handleDist * tx;
      const proSy = nodeSy + handleDist * ty;
      const retSx = nodeSx - handleDist * tx;
      const retSy = nodeSy - handleDist * ty;

      const radOutSx = nodeSx + handleDist * radX;
      const radOutSy = nodeSy + handleDist * radY;
      const radInSx = nodeSx - handleDist * radX;
      const radInSy = nodeSy - handleDist * radY;

      const distPro = Math.hypot(mouseX - proSx, mouseY - proSy);
      const distRet = Math.hypot(mouseX - retSx, mouseY - retSy);
      const distRadOut = Math.hypot(mouseX - radOutSx, mouseY - radOutSy);
      const distRadIn = Math.hypot(mouseX - radInSx, mouseY - radInSy);
      const distCenter = Math.hypot(mouseX - nodeSx, mouseY - nodeSy);

      if (distPro < 20 || distRet < 20) {
        setDragTarget('PROGRADE');
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
        return;
      }

      if (distRadOut < 20 || distRadIn < 20) {
        setDragTarget('RADIAL');
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
        return;
      }

      if (distCenter < 35) {
        setDragTarget('PROGRADE');
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
        return;
      }
    }

    setDragTarget('PAN');
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const cam = cameraRef.current;

    if (dragTarget === 'PAN') {
      cam.camX -= deltaX / cam.zoomScale;
      cam.camY += deltaY / cam.zoomScale;
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragTarget === 'PROGRADE') {
      const { tx, ty } = gizmoVectorsRef.current;
      const dot = deltaX * tx + deltaY * ty;
      controller.adjustManeuverPrograde(dot * 0.04);
      projectedPointsRef.current = []; // Force update projection
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragTarget === 'RADIAL') {
      const { radX, radY } = gizmoVectorsRef.current;
      const dot = deltaX * radX + deltaY * radY;
      controller.adjustManeuverRadial(dot * 0.04);
      projectedPointsRef.current = []; // Force update projection
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const handleDoubleClick = () => {
    setFollowSpacecraft((f) => !f);
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const { width, height } = sizeRef.current;
      const dpr = window.devicePixelRatio || 1;
      const bufferWidth = Math.floor(width * dpr);
      const bufferHeight = Math.floor(height * dpr);

      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const cam = cameraRef.current;
      const sc = controller.engine.spacecraft;

      // Smoothly track spacecraft without triggering React re-render cycle
      if (followRef.current && !sc.isCrashed) {
        cam.camX = sc.x;
        cam.camY = sc.y;
      }

      // 1. Deep Space Cosmic Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Gravitational Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSpacingAu = cam.zoomScale > 1000 ? 0.001 : cam.zoomScale > 100 ? 0.5 : 2.0;
      const gridPixelSpacing = gridSpacingAu * cam.zoomScale;
      const startX = (width * 0.5 - cam.camX * cam.zoomScale) % gridPixelSpacing;
      const startY = (height * 0.5 + cam.camY * cam.zoomScale) % gridPixelSpacing;

      ctx.beginPath();
      for (let x = startX; x < width; x += gridPixelSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = startY; y < height; y += gridPixelSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Render Planetary Orbits (Reference Conics)
      for (const b of controller.engine.bodies) {
        if (b.isStar) continue;
        const orbitR = Math.hypot(b.x, b.y) * cam.zoomScale;
        const { sx: starSx, sy: starSy } = worldToScreen(0, 0, width, height);

        ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(starSx, starSy, orbitR, 0, Math.PI * 2);
        ctx.stroke();

        // Sphere of Influence (SOI) Perimeter
        const { sx: bSx, sy: bSy } = worldToScreen(b.x, b.y, width, height);
        const soiPix = b.soiRadius * cam.zoomScale;
        if (soiPix > 6) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(bSx, bSy, soiPix, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // SOI Tag
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.font = '9px monospace';
          ctx.fillText(`SOI: ${b.name}`, bSx + soiPix + 4, bSy);
        }
      }

      // 3. Spacecraft Projected Lookahead Trajectory Cone (Dashed Cyan)
      // Throttled to recompute every 4 frames or when invalidated
      frameCountRef.current++;
      if (
        frameCountRef.current % 4 === 1 ||
        projectedPointsRef.current.length === 0 ||
        controller.engine.maneuverNode
      ) {
        projectedPointsRef.current = controller.engine.computeProjectedTrajectory(240, 0.004);
      }

      const projectedPoints = projectedPointsRef.current;
      if (projectedPoints.length > 1) {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        const firstPt = worldToScreen(projectedPoints[0].x, projectedPoints[0].y, width, height);
        ctx.moveTo(firstPt.sx, firstPt.sy);

        for (let i = 1; i < projectedPoints.length; i++) {
          const pt = worldToScreen(projectedPoints[i].x, projectedPoints[i].y, width, height);
          ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 4. Spacecraft Historical Trajectory Trail (Solid Emerald)
      if (sc.trail.length > 1) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const startTrail = worldToScreen(sc.trail[0].x, sc.trail[0].y, width, height);
        ctx.moveTo(startTrail.sx, startTrail.sy);
        for (let i = 1; i < sc.trail.length; i++) {
          const pt = worldToScreen(sc.trail[i].x, sc.trail[i].y, width, height);
          ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }

      // 5. Render Celestial Bodies (Sun, Planets, Moons)
      for (const b of controller.engine.bodies) {
        const { sx, sy } = worldToScreen(b.x, b.y, width, height);
        const radius = Math.max(b.displayRadius, (b.radius * cam.zoomScale) || 6);

        // Corona / Atmosphere Glow
        ctx.fillStyle = b.glowColor;
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Rings (Saturn)
        if (b.id === 'saturn') {
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx, sy, radius * 2.2, radius * 0.7, -0.3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Body Label
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px sans-serif';
        ctx.fillText(b.name, sx + radius + 6, sy + 4);
      }

      // 6. Spacecraft Vessel & Interactive Maneuver Node
      if (!sc.isCrashed) {
        const { sx: scSx, sy: scSy } = worldToScreen(sc.x, sc.y, width, height);

        // Attitude angle pointing along velocity vector
        const angle = -Math.atan2(sc.vy, sc.vx);

        ctx.save();
        ctx.translate(scSx, scSy);
        ctx.rotate(angle);

        // Solar panels
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-3, -12, 6, 24);

        // Spacecraft body
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();

        // Thruster nozzle glow
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-7, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Spacecraft Label
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(sc.name, scSx + 12, scSy - 8);

        // 7. Interactive Maneuver Node Gizmo with Prograde & Radial Handles
        const node = controller.engine.maneuverNode;
        if (node && !node.isExecuted) {
          const primary = controller.engine.getCurrentSoiBody();

          // Tangential unit vector in screen coordinates (screen Y inverted)
          const relVx = sc.vx - primary.vx;
          const relVy = sc.vy - primary.vy;
          const spd = Math.hypot(relVx, relVy);
          const tx = spd > 1e-6 ? relVx / spd : 0;
          const ty = spd > 1e-6 ? -relVy / spd : 1;

          // Outward radial unit vector in screen coordinates
          const rx = sc.x - primary.x;
          const ry = sc.y - primary.y;
          const rdist = Math.hypot(rx, ry);
          const radX = rdist > 1e-8 ? rx / rdist : 0;
          const radY = rdist > 1e-8 ? -ry / rdist : -1;

          // Cache for mouse drag projection
          gizmoVectorsRef.current = { tx, ty, radX, radY };

          const hLen = 38;

          // Node center ring
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(scSx, scSy, 18, 0, Math.PI * 2);
          ctx.stroke();

          // Connecting crosshair lines
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(scSx - hLen * tx, scSy - hLen * ty);
          ctx.lineTo(scSx + hLen * tx, scSy + hLen * ty);
          ctx.moveTo(scSx - hLen * radX, scSy - hLen * radY);
          ctx.lineTo(scSx + hLen * radX, scSy + hLen * radY);
          ctx.stroke();
          ctx.setLineDash([]);

          // 1. Prograde Arrow (Yellow)
          const pTipX = scSx + hLen * tx;
          const pTipY = scSy + hLen * ty;
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(pTipX, pTipY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('+Pro', pTipX + 8, pTipY + 3);

          // 2. Retrograde Arrow (Cyan)
          const rTipX = scSx - hLen * tx;
          const rTipY = scSy - hLen * ty;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(rTipX, rTipY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.font = '9px monospace';
          ctx.fillText('-Ret', rTipX - 26, rTipY + 3);

          // 3. Radial Out Arrow (+Rad, Purple)
          const radOutX = scSx + hLen * radX;
          const radOutY = scSy + hLen * radY;
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(radOutX, radOutY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('+Rad', radOutX + 8, radOutY + 3);

          // 4. Radial In Arrow (-Rad, Violet)
          const radInX = scSx - hLen * radX;
          const radInY = scSy - hLen * radY;
          ctx.fillStyle = '#818cf8';
          ctx.beginPath();
          ctx.arc(radInX, radInY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#818cf8';
          ctx.font = '9px monospace';
          ctx.fillText('-Rad', radInX - 26, radInY + 3);

          // Node ΔV Readout Tag
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 10px monospace';
          const dvMag = Math.hypot(node.progradeDeltaV, node.radialDeltaV);
          ctx.fillText(`ΔV: ${dvMag.toFixed(2)} km/s`, scSx + 22, scSy - 24);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '9px monospace';
          ctx.fillText(
            `P:${node.progradeDeltaV >= 0 ? '+' : ''}${node.progradeDeltaV.toFixed(1)} R:${
              node.radialDeltaV >= 0 ? '+' : ''
            }${node.radialDeltaV.toFixed(1)}`,
            scSx + 22,
            scSy - 12
          );
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [controller, worldToScreen]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Floating Canvas Camera Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-1.5 shadow-xl">
        <button
          onClick={() => {
            cameraRef.current.zoomScale = Math.min(200000, cameraRef.current.zoomScale * 1.3);
          }}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors text-xs font-bold"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => {
            cameraRef.current.zoomScale = Math.max(10, cameraRef.current.zoomScale * 0.77);
          }}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors text-xs font-bold"
          title="Zoom Out"
        >
          -
        </button>
        <div className="h-4 w-px bg-slate-700" />
        <button
          onClick={() => setFollowSpacecraft(!followSpacecraft)}
          className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
            followSpacecraft
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Track Spacecraft with Camera (or double click)"
        >
          {followSpacecraft ? 'Tracking Probe' : 'Free Camera'}
        </button>
        <button
          onClick={() => {
            cameraRef.current.camX = 0;
            cameraRef.current.camY = 0;
            setFollowSpacecraft(false);
          }}
          className="px-2 py-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono transition-colors"
          title="Reset Camera to Central Star"
        >
          Origin
        </button>
      </div>

      {/* Trajectory Legend Overlay */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/85 border border-slate-800 backdrop-blur-md rounded-xl p-2.5 text-[10px] font-mono space-y-1.5 shadow-xl pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-emerald-500 rounded" />
          <span className="text-slate-300">Historical Orbit Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-b border-dashed border-cyan-400" />
          <span className="text-slate-300">Projected Trajectory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full border border-dashed border-sky-400/50" />
          <span className="text-slate-300">Sphere of Influence (SOI)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-slate-300">+Prograde Burn Handle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-slate-300">+Radial Out Burn Handle</span>
        </div>
      </div>
    </div>
  );
};
