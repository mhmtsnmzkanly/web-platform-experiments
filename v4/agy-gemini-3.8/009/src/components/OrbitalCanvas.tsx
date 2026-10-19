import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CelestialBody, ManeuverNode, CameraTrackingMode, Vector2D } from '../types';
import { TrajectoryPoint } from '../physics/NBodyPhysicsEngine';
import { Vec2, calculateLagrangePoints } from '../physics/OrbitalMath';

interface OrbitalCanvasProps {
  bodies: CelestialBody[];
  trackedBodyId?: string;
  referenceBodyId?: string;
  onSelectBody: (body: CelestialBody) => void;
  cameraMode: CameraTrackingMode;
  onSetCameraMode: (mode: CameraTrackingMode) => void;
  predictedTrajectory: TrajectoryPoint[];
  maneuverNodes: ManeuverNode[];
  onUpdateManeuverNode?: (node: ManeuverNode) => void;
  onAddManeuverNodeAtPosition?: (pos: Vector2D) => void;
  showLagrangePoints: boolean;
  showSoiCircles: boolean;
  isEngineBurning: boolean;
}

export const OrbitalCanvas: React.FC<OrbitalCanvasProps> = ({
  bodies,
  trackedBodyId,
  referenceBodyId,
  onSelectBody,
  cameraMode,
  onSetCameraMode,
  predictedTrajectory,
  maneuverNodes,
  onUpdateManeuverNode,
  showLagrangePoints,
  showSoiCircles,
  isEngineBurning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera Pan and Zoom state
  const [cameraPan, setCameraPan] = useState<Vector2D>({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState<number>(0.001); // 1 pixel = 1 / zoomScale km
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Vector2D>({ x: 0, y: 0 });
  const [hoveredBody, setHoveredBody] = useState<CelestialBody | null>(null);

  // Gizmo dragging for maneuver node
  const [activeGizmoNodeId, setActiveGizmoNodeId] = useState<string | null>(null);
  const [isDraggingGizmo, setIsDraggingGizmo] = useState<boolean>(false);
  const [gizmoDragMode, setGizmoDragMode] = useState<'PROGRADE' | 'RADIAL' | null>(null);

  // Auto-fit camera zoom on initial scenario load
  useEffect(() => {
    if (bodies.length === 0) return;

    let maxDist = 0;
    bodies.forEach((b) => {
      const d = Vec2.mag(b.pos);
      if (d > maxDist) maxDist = d;
    });

    if (maxDist > 0) {
      const targetZoom = Math.max(1e-7, Math.min(0.05, 350 / (maxDist * 1.4)));
      setZoomScale(targetZoom);
      setCameraPan({ x: 0, y: 0 });
    }
  }, [bodies.length]);

  // Coordinate conversion: Simulation World (km) -> Screen Canvas (pixels)
  const worldToScreen = useCallback(
    (
      worldPos: Vector2D,
      width: number,
      height: number,
      centerOffset: Vector2D,
      rotationRad: number = 0
    ): Vector2D => {
      // Relative to camera center
      const relX = worldPos.x - centerOffset.x;
      const relY = worldPos.y - centerOffset.y;

      // Apply rotation if in co-rotating frame
      let rx = relX;
      let ry = relY;
      if (rotationRad !== 0) {
        const cos = Math.cos(rotationRad);
        const sin = Math.sin(rotationRad);
        rx = relX * cos - relY * sin;
        ry = relX * sin + relY * cos;
      }

      return {
        x: width * 0.5 + rx * zoomScale,
        y: height * 0.5 - ry * zoomScale, // Invert Y for canvas
      };
    },
    [zoomScale]
  );

  // Screen Canvas (pixels) -> Simulation World (km)
  const screenToWorld = useCallback(
    (
      screenPos: Vector2D,
      width: number,
      height: number,
      centerOffset: Vector2D,
      rotationRad: number = 0
    ): Vector2D => {
      const rx = (screenPos.x - width * 0.5) / zoomScale;
      const ry = -(screenPos.y - height * 0.5) / zoomScale;

      if (rotationRad !== 0) {
        const cos = Math.cos(-rotationRad);
        const sin = Math.sin(-rotationRad);
        return {
          x: centerOffset.x + (rx * cos - ry * sin),
          y: centerOffset.y + (rx * sin + ry * cos),
        };
      }

      return {
        x: centerOffset.x + rx,
        y: centerOffset.y + ry,
      };
    },
    [zoomScale]
  );

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space background with subtle grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Determine Camera Center Offset & Rotation
      const trackedBody = bodies.find((b) => b.id === trackedBodyId);
      const referenceBody = bodies.find((b) => b.id === referenceBodyId);

      let centerOffset: Vector2D = cameraPan;
      let frameRotation = 0;

      if (cameraMode === 'BODY_CENTERED' || cameraMode === 'FOLLOW') {
        if (trackedBody) {
          centerOffset = { x: trackedBody.pos.x + cameraPan.x, y: trackedBody.pos.y + cameraPan.y };
        }
      } else if (cameraMode === 'COROTATING' && trackedBody && referenceBody) {
        centerOffset = { x: referenceBody.pos.x + cameraPan.x, y: referenceBody.pos.y + cameraPan.y };
        const d = Vec2.sub(trackedBody.pos, referenceBody.pos);
        frameRotation = -Math.atan2(d.y, d.x);
      }

      // 1. Draw Background Distance Grid
      drawGrid(ctx, width, height, centerOffset, zoomScale);

      // 2. Draw Sun / Star Rays Background
      const star = bodies.find((b) => b.type === 'STAR');
      if (star) {
        const starScreen = worldToScreen(star.pos, width, height, centerOffset, frameRotation);
        drawStarGlow(ctx, starScreen, star.radius * zoomScale, star.color);
      }

      // 3. Draw Lagrange Points if toggled
      const primaryForLagrange =
        bodies.find((b) => b.type === 'STAR') ||
        (referenceBody && referenceBody.mass > 0 ? referenceBody : bodies.find((b) => b.type === 'PLANET'));
      const secondaryForLagrange =
        referenceBody && referenceBody.id !== primaryForLagrange?.id
          ? referenceBody
          : bodies.find((b) => (b.type === 'PLANET' || b.type === 'MOON') && b.id !== primaryForLagrange?.id);

      if (
        showLagrangePoints &&
        primaryForLagrange &&
        secondaryForLagrange &&
        primaryForLagrange.id !== secondaryForLagrange.id
      ) {
        drawLagrangeMarkers(
          ctx,
          primaryForLagrange,
          secondaryForLagrange,
          width,
          height,
          centerOffset,
          frameRotation
        );
      }

      // 4. Draw Orbit Historical Trails
      bodies.forEach((body) => {
        if (body.trail.length > 1) {
          ctx.beginPath();
          for (let i = 0; i < body.trail.length; i++) {
            const pt = worldToScreen(body.trail[i], width, height, centerOffset, frameRotation);
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = body.color;
          ctx.lineWidth = body.type === 'SPACECRAFT' ? 1.5 : 1;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      // 5. Draw Forward Predicted Trajectory Cone
      if (predictedTrajectory.length > 1) {
        drawPredictedTrajectory(ctx, predictedTrajectory, width, height, centerOffset, frameRotation);
      }

      // 6. Draw SOI Circles & Atmospheric Rings
      bodies.forEach((body) => {
        const screenPos = worldToScreen(body.pos, width, height, centerOffset, frameRotation);

        // SOI boundary
        if (showSoiCircles && body.soiRadiusKm && body.soiRadiusKm * zoomScale > 10) {
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, body.soiRadiusKm * zoomScale, 0, Math.PI * 2);
          ctx.strokeStyle = body.color;
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.25;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }

        // Atmosphere halo
        if (body.hasAtmosphere && body.atmosphereHeightKm) {
          const atmRadius = (body.radius + body.atmosphereHeightKm) * zoomScale;
          if (atmRadius > 3) {
            const atmGrad = ctx.createRadialGradient(
              screenPos.x,
              screenPos.y,
              body.radius * zoomScale,
              screenPos.x,
              screenPos.y,
              atmRadius
            );
            atmGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            atmGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, atmRadius, 0, Math.PI * 2);
            ctx.fillStyle = atmGrad;
            ctx.fill();
          }
        }
      });

      // 7. Draw Celestial Bodies
      bodies.forEach((body) => {
        const screenPos = worldToScreen(body.pos, width, height, centerOffset, frameRotation);
        const radiusPx = Math.max(
          body.type === 'SPACECRAFT' ? 4 : 2,
          body.radius * zoomScale
        );

        ctx.save();
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = body.color;

        if (body.glowColor) {
          ctx.shadowColor = body.glowColor;
          ctx.shadowBlur = radiusPx * 1.5;
        }
        ctx.fill();
        ctx.restore();

        // Rocket exhaust plume if engine burning and this is active craft
        if (body.type === 'SPACECRAFT' && isEngineBurning && body.id === trackedBodyId) {
          drawRocketFlame(ctx, screenPos, body.vel, frameRotation);
        }

        // Name tag & speed label
        if (radiusPx > 3 || body.type === 'SPACECRAFT' || body.id === trackedBodyId) {
          ctx.font = '10px monospace';
          ctx.fillStyle = body.id === trackedBodyId ? '#38bdf8' : '#94a3b8';
          ctx.fillText(body.name, screenPos.x + radiusPx + 6, screenPos.y + 3);
        }

        // Selection ring around tracked body
        if (body.id === trackedBodyId) {
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, radiusPx + 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 8. Draw Maneuver Node Interactive Gizmo if active
      if (maneuverNodes.length > 0 && trackedBody) {
        drawManeuverGizmo(
          ctx,
          maneuverNodes[0],
          trackedBody,
          width,
          height,
          centerOffset,
          frameRotation
        );
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    bodies,
    trackedBodyId,
    referenceBodyId,
    cameraMode,
    cameraPan,
    zoomScale,
    predictedTrajectory,
    maneuverNodes,
    showLagrangePoints,
    showSoiCircles,
    isEngineBurning,
    worldToScreen,
  ]);

  // Helper Drawing Functions
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    center: Vector2D,
    scale: number
  ) => {
    const exponent = Math.floor(Math.log10(100 / scale));
    const stepKm = Math.pow(10, exponent);
    const stepPx = stepKm * scale;

    if (stepPx < 20 || stepPx > 500) return;

    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 0.5;

    const startX = (width * 0.5 - (center.x % stepKm) * scale) % stepPx;
    for (let x = startX; x < width; x += stepPx) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const startY = (height * 0.5 + (center.y % stepKm) * scale) % stepPx;
    for (let y = startY; y < height; y += stepPx) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scale Bar Indicator at bottom left
    const scaleBarKm = stepKm;
    const scaleBarPx = scaleBarKm * scale;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillRect(20, height - 25, scaleBarPx, 2);
    ctx.fillText(`${scaleBarKm.toLocaleString()} km`, 20, height - 30);
  };

  const drawStarGlow = (
    ctx: CanvasRenderingContext2D,
    pos: Vector2D,
    radiusPx: number,
    color: string
  ) => {
    const glowRadius = Math.max(30, radiusPx * 4);
    const grad = ctx.createRadialGradient(pos.x, pos.y, radiusPx, pos.x, pos.y, glowRadius);
    grad.addColorStop(0, color);
    grad.addColorStop(0.3, 'rgba(250, 204, 21, 0.25)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  };

  const drawLagrangeMarkers = (
    ctx: CanvasRenderingContext2D,
    primary: CelestialBody,
    secondary: CelestialBody,
    width: number,
    height: number,
    center: Vector2D,
    rot: number
  ) => {
    const lp = calculateLagrangePoints(primary, secondary);
    const points = [
      { name: 'L1', pos: lp.L1 },
      { name: 'L2', pos: lp.L2 },
      { name: 'L3', pos: lp.L3 },
      { name: 'L4', pos: lp.L4 },
      { name: 'L5', pos: lp.L5 },
    ];

    ctx.font = '9px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';

    points.forEach((p) => {
      const scr = worldToScreen(p.pos, width, height, center, rot);
      ctx.beginPath();
      ctx.arc(scr.x, scr.y, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText(p.name, scr.x + 6, scr.y - 4);
    });
  };

  const drawPredictedTrajectory = (
    ctx: CanvasRenderingContext2D,
    trajectory: TrajectoryPoint[],
    width: number,
    height: number,
    center: Vector2D,
    rot: number
  ) => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < trajectory.length; i++) {
      const pt = worldToScreen(trajectory[i], width, height, center, rot);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 3]);
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    // Mark Apoapsis (Ap) and Periapsis (Pe)
    ctx.font = '10px monospace';
    trajectory.forEach((pt) => {
      if (pt.isPeriapsis) {
        const scr = worldToScreen(pt, width, height, center, rot);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(scr.x - 4, scr.y - 4, 8, 8);
        ctx.fillText(`Pe: ${Math.round(pt.primaryDistance || 0).toLocaleString()} km`, scr.x + 8, scr.y + 3);
      }
      if (pt.isApoapsis) {
        const scr = worldToScreen(pt, width, height, center, rot);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(scr.x - 4, scr.y - 4, 8, 8);
        ctx.fillText(`Ap: ${Math.round(pt.primaryDistance || 0).toLocaleString()} km`, scr.x + 8, scr.y + 3);
      }
      if (pt.isNodeBurn) {
        const scr = worldToScreen(pt, width, height, center, rot);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('BURN NODE', scr.x + 8, scr.y + 3);
      }
    });
  };

  const drawRocketFlame = (
    ctx: CanvasRenderingContext2D,
    pos: Vector2D,
    vel: Vector2D,
    rot: number
  ) => {
    const spd = Vec2.mag(vel);
    if (spd < 1e-4) return;
    const vUnit = { x: -vel.x / spd, y: vel.y / spd }; // Opposite direction

    ctx.save();
    ctx.translate(pos.x, pos.y);
    const angle = Math.atan2(vUnit.y, vUnit.x) + rot;
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, -4);
    ctx.lineTo(-24 - Math.random() * 8, 0);
    ctx.lineTo(-14, 4);
    ctx.closePath();

    const flameGrad = ctx.createLinearGradient(0, 0, -28, 0);
    flameGrad.addColorStop(0, '#f97316');
    flameGrad.addColorStop(0.5, '#facc15');
    flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = flameGrad;
    ctx.fill();
    ctx.restore();
  };

  const drawManeuverGizmo = (
    ctx: CanvasRenderingContext2D,
    node: ManeuverNode,
    craft: CelestialBody,
    width: number,
    height: number,
    center: Vector2D,
    rot: number
  ) => {
    const scr = worldToScreen(craft.pos, width, height, center, rot);
    const speed = Vec2.mag(craft.vel);
    if (speed < 1e-6) return;

    const progradeUnit = { x: craft.vel.x / speed, y: -craft.vel.y / speed };
    const radialUnit = { x: -progradeUnit.y, y: progradeUnit.x };

    const handleLength = 45;

    // Prograde Handle (Yellow)
    const proPos = {
      x: scr.x + progradeUnit.x * handleLength,
      y: scr.y + progradeUnit.y * handleLength,
    };
    ctx.beginPath();
    ctx.moveTo(scr.x, scr.y);
    ctx.lineTo(proPos.x, proPos.y);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(proPos.x, proPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();

    // Radial Handle (Cyan)
    const radPos = {
      x: scr.x + radialUnit.x * handleLength,
      y: scr.y + radialUnit.y * handleLength,
    };
    ctx.beginPath();
    ctx.moveTo(scr.x, scr.y);
    ctx.lineTo(radPos.x, radPos.y);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(radPos.x, radPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();

    ctx.font = '9px monospace';
    ctx.fillStyle = '#eab308';
    ctx.fillText(`+Pro (${node.deltaVPrograde.toFixed(2)} km/s)`, proPos.x + 8, proPos.y + 3);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`+Rad (${node.deltaVRadial.toFixed(2)} km/s)`, radPos.x + 8, radPos.y + 3);
  };

  // Pointer (Mouse & Touch) Pan, Zoom & Gizmo Dragging Handlers
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoomScale((prev) => Math.max(1e-8, Math.min(1.0, prev * zoomFactor)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = canvas.getBoundingClientRect();
    const pointerPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // Check if clicking on Maneuver Node Gizmo handles
    const trackedBody = bodies.find((b) => b.id === trackedBodyId);
    const referenceBody = bodies.find((b) => b.id === referenceBodyId);
    let centerOffset: Vector2D = cameraPan;
    let frameRotation = 0;

    if (cameraMode === 'BODY_CENTERED' || cameraMode === 'FOLLOW') {
      if (trackedBody) {
        centerOffset = { x: trackedBody.pos.x + cameraPan.x, y: trackedBody.pos.y + cameraPan.y };
      }
    } else if (cameraMode === 'COROTATING' && trackedBody && referenceBody) {
      centerOffset = { x: referenceBody.pos.x + cameraPan.x, y: referenceBody.pos.y + cameraPan.y };
      const d = Vec2.sub(trackedBody.pos, referenceBody.pos);
      frameRotation = -Math.atan2(d.y, d.x);
    }

    if (maneuverNodes.length > 0 && trackedBody) {
      const activeNode = maneuverNodes[0];
      const scr = worldToScreen(trackedBody.pos, canvas.clientWidth, canvas.clientHeight, centerOffset, frameRotation);
      const speed = Vec2.mag(trackedBody.vel);

      if (speed > 1e-6) {
        const progradeUnit = { x: trackedBody.vel.x / speed, y: -trackedBody.vel.y / speed };
        const radialUnit = { x: -progradeUnit.y, y: progradeUnit.x };
        const handleLength = 45;

        const proPos = { x: scr.x + progradeUnit.x * handleLength, y: scr.y + progradeUnit.y * handleLength };
        const radPos = { x: scr.x + radialUnit.x * handleLength, y: scr.y + radialUnit.y * handleLength };

        if (Vec2.dist(pointerPos, proPos) < 14) {
          setIsDraggingGizmo(true);
          setGizmoDragMode('PROGRADE');
          setActiveGizmoNodeId(activeNode.id);
          setDragStart({ x: e.clientX, y: e.clientY });
          return;
        }

        if (Vec2.dist(pointerPos, radPos) < 14) {
          setIsDraggingGizmo(true);
          setGizmoDragMode('RADIAL');
          setActiveGizmoNodeId(activeNode.id);
          setDragStart({ x: e.clientX, y: e.clientY });
          return;
        }
      }
    }

    // Default to camera pan
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingGizmo && activeGizmoNodeId && onUpdateManeuverNode) {
      const activeNode = maneuverNodes.find((n) => n.id === activeGizmoNodeId);
      if (activeNode) {
        const deltaX = (e.clientX - dragStart.x) * 0.02;
        const deltaY = -(e.clientY - dragStart.y) * 0.02;

        if (gizmoDragMode === 'PROGRADE') {
          onUpdateManeuverNode({
            ...activeNode,
            deltaVPrograde: parseFloat((activeNode.deltaVPrograde + deltaX).toFixed(3)),
          });
        } else if (gizmoDragMode === 'RADIAL') {
          onUpdateManeuverNode({
            ...activeNode,
            deltaVRadial: parseFloat((activeNode.deltaVRadial + deltaY).toFixed(3)),
          });
        }
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / zoomScale;
      const dy = -(e.clientY - dragStart.y) / zoomScale;

      setCameraPan((prev) => ({ x: prev.x - dx, y: prev.y - dy }));
      setDragStart({ x: e.clientX, y: e.clientY });

      // If user manually pans significantly, decouple strict tracking
      if (cameraMode === 'BODY_CENTERED' && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        onSetCameraMode('GLOBAL');
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    setIsDraggingGizmo(false);
    setGizmoDragMode(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // If was dragging gizmo, ignore click
    if (isDraggingGizmo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // Calculate Camera Center Offset & Rotation accurately
    const trackedBody = bodies.find((b) => b.id === trackedBodyId);
    const referenceBody = bodies.find((b) => b.id === referenceBodyId);
    let centerOffset: Vector2D = cameraPan;
    let frameRotation = 0;

    if (cameraMode === 'BODY_CENTERED' || cameraMode === 'FOLLOW') {
      if (trackedBody) {
        centerOffset = { x: trackedBody.pos.x + cameraPan.x, y: trackedBody.pos.y + cameraPan.y };
      }
    } else if (cameraMode === 'COROTATING' && trackedBody && referenceBody) {
      centerOffset = { x: referenceBody.pos.x + cameraPan.x, y: referenceBody.pos.y + cameraPan.y };
      const d = Vec2.sub(trackedBody.pos, referenceBody.pos);
      frameRotation = -Math.atan2(d.y, d.x);
    }

    // Check click hit testing on bodies
    for (const body of bodies) {
      const screenPos = worldToScreen(
        body.pos,
        canvas.clientWidth,
        canvas.clientHeight,
        centerOffset,
        frameRotation
      );
      const dist = Vec2.dist(clickPos, screenPos);
      if (dist < Math.max(14, body.radius * zoomScale + 8)) {
        onSelectBody(body);
        return;
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {/* Camera Mode Overlay Bar */}
      <div className="absolute top-3 left-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300">
        <span className="text-[10px] uppercase font-bold text-slate-500 px-1">Tracking:</span>
        <button
          onClick={() => onSetCameraMode('GLOBAL')}
          className={`px-2 py-0.5 rounded font-mono transition-colors ${
            cameraMode === 'GLOBAL'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          GLOBAL
        </button>
        <button
          onClick={() => onSetCameraMode('BODY_CENTERED')}
          className={`px-2 py-0.5 rounded font-mono transition-colors ${
            cameraMode === 'BODY_CENTERED'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          BODY-CENTER
        </button>
        <button
          onClick={() => onSetCameraMode('COROTATING')}
          className={`px-2 py-0.5 rounded font-mono transition-colors ${
            cameraMode === 'COROTATING'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          COROTATING
        </button>
      </div>
    </div>
  );
};
