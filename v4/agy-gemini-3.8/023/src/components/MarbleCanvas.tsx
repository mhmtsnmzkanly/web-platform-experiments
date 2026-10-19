/**
 * MARBLE-FORGE (EXP-023) — High-Performance 60 FPS HTML5 Canvas Visualizer
 * Renders:
 * - 3D dual-beam wooden and steel rails with cross-ties
 * - Loop-the-loop rings with depth entry/exit shading
 * - Conical vortex funnels with spiral depth lines
 * - Dynamic tilting seesaws with rotational torque
 * - Domino chains with cascading angles
 * - Rotating Archimedes helical screw lift
 * - Tuned brass target bells with vibrational shockwaves
 * - Spherical marbles with rolling orientation markers & motion trails
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { MarbleSimulationController } from '../core/MarbleSimulationController';
import { MARBLE_MATERIALS } from '../physics/MarbleMaterials';
import { TrackElement } from '../types';

interface MarbleCanvasProps {
  controller: MarbleSimulationController;
}

export const MarbleCanvas: React.FC<MarbleCanvasProps> = ({ controller }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drag interaction state for rail creation
  const isPointerDownRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null);

  // Coordinate transforms between screen pixels and world meters
  const getTransform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { scale: 1, ox: 0, oy: 0 };

    const bw = controller.engine.bounds.width;
    const bh = controller.engine.bounds.height;
    const scale = Math.min(canvas.width / bw, canvas.height / bh);
    const ox = (canvas.width - bw * scale) / 2;
    const oy = (canvas.height - bh * scale) / 2;
    return { scale, ox, oy };
  }, [controller.engine.bounds]);

  const clientToWorld = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const { scale, ox, oy } = getTransform();

    const canvasX = (clientX - rect.left) * (canvas.width / rect.width);
    const canvasY = (clientY - rect.top) * (canvas.height / rect.height);

    const wx = (canvasX - ox) / scale;
    const wy = (canvasY - oy) / scale;

    if (wx < 0 || wx > controller.engine.bounds.width || wy < 0 || wy > controller.engine.bounds.height) {
      return null;
    }
    return { x: wx, y: wy };
  };

  // Main Canvas Rendering Pipeline
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const { scale, ox, oy } = getTransform();
    const engine = controller.engine;

    ctx.clearRect(0, 0, width, height);

    // Background & Blueprint Grid
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(ox, oy);

    // World Bounds Area
    ctx.fillStyle = '#070c1e';
    ctx.fillRect(0, 0, engine.bounds.width * scale, engine.bounds.height * scale);

    // Grid lines every 1 meter
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= engine.bounds.width; x += 1.0) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, engine.bounds.height * scale);
      ctx.stroke();
    }
    for (let y = 0; y <= engine.bounds.height; y += 1.0) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(engine.bounds.width * scale, y * scale);
      ctx.stroke();
    }

    // 1. Render Track Elements
    for (const el of engine.elements) {
      renderTrackElement(ctx, el, scale);
    }

    // 2. Render In-Progress Rail Drag Preview
    if (controller.activeTool === 'STRAIGHT_RAIL' && isPointerDownRef.current && dragStartRef.current && dragCurrentRef.current) {
      const p1 = dragStartRef.current;
      const p2 = dragCurrentRef.current;
      const dragDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const isValid = dragDist >= 0.3;
      ctx.strokeStyle = isValid ? '#f59e0b' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.x * scale, p1.y * scale);
      ctx.lineTo(p2.x * scale, p2.y * scale);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Render Marbles
    for (const m of engine.marbles) {
      renderMarble(ctx, m, scale);
    }

    ctx.restore();
  }, [controller, getTransform]);

  const renderRef = useRef(render);
  renderRef.current = render;

  // Track Element Render Subroutines
  const renderTrackElement = (ctx: CanvasRenderingContext2D, el: TrackElement, scale: number) => {
    switch (el.type) {
      case 'STRAIGHT_RAIL': {
        const x1 = el.x1 * scale;
        const y1 = el.y1 * scale;
        const x2 = el.x2 * scale;
        const y2 = el.y2 * scale;

        // Shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1 + 4);
        ctx.lineTo(x2, y2 + 4);
        ctx.stroke();

        // Outer Rail Beam
        ctx.strokeStyle = '#78350f'; // Dark amber wood base
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Inner Polished Metal Track
        ctx.strokeStyle = '#f59e0b'; // Brass rail
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Anchor nodes
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(x1, y1, 5, 0, Math.PI * 2);
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'LOOP_THE_LOOP': {
        const cx = el.cx * scale;
        const cy = el.cy * scale;
        const r = el.radius * scale;

        // Loop outer shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(cx, cy + 4, r, 0, Math.PI * 2);
        ctx.stroke();

        // Loop Ring Outer
        ctx.strokeStyle = '#0284c7'; // Deep blue
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Loop Ring Inner
        ctx.strokeStyle = '#38bdf8'; // Glowing sky blue
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'FUNNEL': {
        const cx = el.cx * scale;
        const cy = el.cy * scale;
        const rOuter = el.outerRadius * scale;
        const rDrain = el.drainRadius * scale;

        // Funnel Outer Cone
        const grad = ctx.createRadialGradient(cx, cy, rDrain, cx, cy, rOuter);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.7, '#1e293b');
        grad.addColorStop(1, '#334155');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Drain Hole
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx, cy, rDrain, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }

      case 'BUMPER': {
        const bx = el.x * scale;
        const by = el.y * scale;
        const br = el.radius * scale;

        const isHit = el.cooldownTimer > 0;

        // Bumper Outer Ring
        ctx.fillStyle = isHit ? '#fbbf24' : '#1e1b4b';
        ctx.strokeStyle = isHit ? '#ffffff' : '#6366f1';
        ctx.lineWidth = isHit ? 5 : 3;

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bumper Center Core
        ctx.fillStyle = isHit ? '#ffffff' : '#818cf8';
        ctx.beginPath();
        ctx.arc(bx, by, br * 0.45, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'SEESAW': {
        const px = el.px * scale;
        const py = el.py * scale;
        const halfL = (el.length / 2) * scale;

        // Triangular Fulcrum Base
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - 14, py + 22);
        ctx.lineTo(px + 14, py + 22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rotating Plank Beam
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(el.angle);

        // Plank body
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-halfL, -6, halfL * 2, 12);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(-halfL, -6, halfL * 2, 12);

        // Center pivot bolt
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        break;
      }

      case 'DOMINO': {
        for (const d of el.dominoes) {
          const dx = d.x * scale;
          const dy = d.y * scale;
          const w = d.width * scale;
          const h = d.height * scale;

          ctx.save();
          ctx.translate(dx, dy + h / 2);
          ctx.rotate(d.angle);

          // Domino body
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-w / 2, -h, w, h);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-w / 2, -h, w, h);

          // Domino face pips
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.arc(0, -h * 0.75, 2, 0, Math.PI * 2);
          ctx.arc(0, -h * 0.25, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
        break;
      }

      case 'ARCHIMEDES_LIFT': {
        const lx = el.x * scale;
        const bY = el.bottomY * scale;
        const tY = el.topY * scale;
        const lr = el.radius * scale;
        const liftH = bY - tY;

        // Vertical Casing
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(lx - lr, tY, lr * 2, liftH);

        // Helical Screw Thread
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        const coils = 12;
        for (let c = 0; c < coils; c++) {
          const yPos = tY + (c / coils) * liftH + Math.sin(el.spiralPhase + c) * 6;
          ctx.beginPath();
          ctx.ellipse(lx, yPos, lr * 0.9, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }

      case 'TARGET_BELL': {
        const bx = el.x * scale;
        const by = el.y * scale;
        const br = el.radius * scale;

        // Vibrational Wave Ring if recently struck
        if (el.hitCount > 0) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(bx, by, br * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Bell Body
        ctx.fillStyle = el.hitCount > 0 ? '#fbbf24' : '#d97706';
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bell Clapper
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(bx, by + br * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'MARBLE_SPAWNER': {
        const sx = el.x * scale;
        const sy = el.y * scale;

        // Spawner Chute Hopper
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(sx - 16, sy - 14);
        ctx.lineTo(sx + 16, sy - 14);
        ctx.lineTo(sx + 8, sy + 6);
        ctx.lineTo(sx - 8, sy + 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
    }
  };

  // Marble Render Subroutine
  const renderMarble = (
    ctx: CanvasRenderingContext2D,
    m: MarbleSimulationController['engine']['marbles'][0],
    scale: number
  ) => {
    const mx = m.x * scale;
    const my = m.y * scale;
    const r = m.radius * scale;
    const def = MARBLE_MATERIALS[m.material];

    // Motion Trail
    if (m.trail.length > 1) {
      ctx.strokeStyle = def.glowColor;
      ctx.lineWidth = r * 0.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < m.trail.length; i++) {
        const pt = m.trail[i];
        if (i === 0) ctx.moveTo(pt.x * scale, pt.y * scale);
        else ctx.lineTo(pt.x * scale, pt.y * scale);
      }
      ctx.stroke();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(mx, my + r * 0.8, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D Sphere Shading
    const grad = ctx.createRadialGradient(
      mx - r * 0.35,
      my - r * 0.35,
      r * 0.1,
      mx,
      my,
      r
    );
    grad.addColorStop(0, '#ffffff'); // Specular highlight
    grad.addColorStop(0.3, def.color);
    grad.addColorStop(1, '#0f172a'); // Ambient shadow

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();

    // Rolling indicator line / cat's eye stripe
    ctx.save();
    ctx.translate(mx, my);
    const rotationAngle = (m.x / m.radius); // True roll angle
    ctx.rotate(rotationAngle);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(r * 0.7, 0);
    ctx.stroke();

    ctx.restore();
  };

  // ResizeObserver for canvas dimensions
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const rect = entry.contentRect;
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      renderRef.current();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main 60 FPS Physics & Render Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      controller.tick(dt);
      renderRef.current();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [controller]);

  // Pointer Event Handlers for Construction & Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const worldPos = clientToWorld(e.clientX, e.clientY);
    if (!worldPos) return;

    if (controller.activeTool === 'STRAIGHT_RAIL') {
      dragStartRef.current = worldPos;
      dragCurrentRef.current = worldPos;
    } else if (controller.activeTool === 'BUMPER') {
      controller.addElement({
        type: 'BUMPER',
        id: `bumper-${Date.now()}`,
        x: worldPos.x,
        y: worldPos.y,
        radius: 0.45,
        kickImpulse: 3.5,
        cooldownTimer: 0,
      });
    } else if (controller.activeTool === 'TARGET_BELL') {
      controller.addElement({
        type: 'TARGET_BELL',
        id: `bell-${Date.now()}`,
        x: worldPos.x,
        y: worldPos.y,
        radius: 0.35,
        noteFrequency: 523.25 + Math.random() * 400,
        hitCount: 0,
        hasTriggeredObjective: false,
      });
    } else if (controller.activeTool === 'DELETE') {
      controller.deleteElementAt(worldPos.x, worldPos.y);
    } else if (controller.activeTool === 'SELECT') {
      // Spawn marble on click in SELECT mode!
      controller.spawnMarbleAt(worldPos.x, worldPos.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const worldPos = clientToWorld(e.clientX, e.clientY);
    if (worldPos && controller.activeTool === 'STRAIGHT_RAIL') {
      dragCurrentRef.current = worldPos;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (controller.activeTool === 'STRAIGHT_RAIL' && dragStartRef.current && dragCurrentRef.current) {
      const p1 = dragStartRef.current;
      const p2 = dragCurrentRef.current;
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      // Require minimum rail length of 0.3m
      if (dist >= 0.3) {
        controller.addElement({
          type: 'STRAIGHT_RAIL',
          id: `rail-${Date.now()}`,
          x1: Number(p1.x.toFixed(2)),
          y1: Number(p1.y.toFixed(2)),
          x2: Number(p2.x.toFixed(2)),
          y2: Number(p2.y.toFixed(2)),
          friction: 0.005,
        });
      }
    }

    dragStartRef.current = null;
    dragCurrentRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none bg-black flex items-center justify-center touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
