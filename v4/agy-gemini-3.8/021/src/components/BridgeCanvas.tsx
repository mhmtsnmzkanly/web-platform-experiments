/**
 * PONTIFEX (EXP-021) — Bridge Canvas Visualizer & Interactive CAD Deck
 * High-performance 60 FPS HTML5 canvas rendering:
 * - Dynamic stress color gradients (Green -> Yellow -> Red)
 * - Vehicle chassis, rotating wheels, headlight cones, and dust
 * - Textured canyon cliffs, rock pillars, water waves, and splash particles
 * - Interactive rubber-band beam drawing, joint repositioning, and grid snapping
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { BridgeSimulationController } from '../core/BridgeSimulationController';
import { MATERIAL_PROPERTIES } from '../physics/MaterialConstants';
import { TrussPhysicsEngine } from '../physics/TrussPhysicsEngine';
import { TrussNode, TrussMember, MaterialType } from '../types';

interface BridgeCanvasProps {
  controller: BridgeSimulationController;
}

export const BridgeCanvas: React.FC<BridgeCanvasProps> = ({ controller }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction State stored in refs to avoid tearing down RAF / ResizeObserver loops
  const dragStartNodeRef = useRef<TrussNode | null>(null);
  const isDraggingJointRef = useRef<boolean>(false);
  const hoverNodeRef = useRef<TrussNode | null>(null);
  const pointerWorldRef = useRef<{ x: number; y: number } | null>(null);

  // Splash and dust particle pool
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[]>([]);

  // Coordinate Conversion: World Meters <-> Canvas Pixels
  const worldToCanvas = useCallback(
    (wx: number, wy: number, width: number, height: number) => {
      const lvl = controller.currentLevel;
      const minX = -4.0;
      const maxX = lvl.targetFlagX + 8.0;
      const minY = lvl.terrain.waterLevelY - 2.5;
      const maxY = lvl.terrain.leftY + 10.0;

      const spanX = maxX - minX;
      const spanY = maxY - minY;

      const scaleX = width / spanX;
      const scaleY = height / spanY;
      const scale = Math.min(scaleX, scaleY) * 0.92;

      const originX = (width - spanX * scale) * 0.5 - minX * scale;
      const originY = height - (height - spanY * scale) * 0.5 + minY * scale;

      const cx = originX + wx * scale;
      const cy = originY - wy * scale;

      return { cx, cy, scale };
    },
    [controller.currentLevel]
  );

  const canvasToWorld = useCallback(
    (cx: number, cy: number, width: number, height: number) => {
      const lvl = controller.currentLevel;
      const minX = -4.0;
      const maxX = lvl.targetFlagX + 8.0;
      const minY = lvl.terrain.waterLevelY - 2.5;
      const maxY = lvl.terrain.leftY + 10.0;

      const spanX = maxX - minX;
      const spanY = maxY - minY;

      const scaleX = width / spanX;
      const scaleY = height / spanY;
      const scale = Math.min(scaleX, scaleY) * 0.92;

      const originX = (width - spanX * scale) * 0.5 - minX * scale;
      const originY = height - (height - spanY * scale) * 0.5 + minY * scale;

      const wx = (cx - originX) / scale;
      const wy = (originY - cy) / scale;

      return { wx, wy };
    },
    [controller.currentLevel]
  );

  // Find node near pointer
  const findNodeNearWorld = useCallback(
    (wx: number, wy: number, maxDist: number = 0.6) => {
      let closest: TrussNode | null = null;
      let minDist = maxDist;

      for (const n of controller.nodes) {
        const d = Math.hypot(n.x - wx, n.y - wy);
        if (d < minDist) {
          minDist = d;
          closest = n;
        }
      }
      return closest;
    },
    [controller.nodes]
  );

  // Find member near pointer (for DELETE tool beam clicking)
  const findMemberNearWorld = useCallback(
    (wx: number, wy: number, maxDist: number = 0.5) => {
      let closest: TrussMember | null = null;
      let minDist = maxDist;

      for (const m of controller.members) {
        const nA = controller.nodes.find((n) => n.id === m.nodeAId);
        const nB = controller.nodes.find((n) => n.id === m.nodeBId);
        if (!nA || !nB) continue;

        const dx = nB.x - nA.x;
        const dy = nB.y - nA.y;
        const lenSq = dx * dx + dy * dy;
        if (lenSq < 1e-6) continue;

        const t = Math.max(0, Math.min(1, ((wx - nA.x) * dx + (wy - nA.y) * dy) / lenSq));
        const projX = nA.x + t * dx;
        const projY = nA.y + t * dy;
        const dist = Math.hypot(wx - projX, wy - projY);

        if (dist < minDist) {
          minDist = dist;
          closest = m;
        }
      }
      return closest;
    },
    [controller.members, controller.nodes]
  );

  // Main Render Pipeline
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const lvl = controller.currentLevel;

    // Interaction states from refs
    const dragStartNode = dragStartNodeRef.current;
    const isDraggingJoint = isDraggingJointRef.current;
    const hoverNode = hoverNodeRef.current;
    const currentPointerWorld = pointerWorldRef.current;

    // 1. Sky and Canyon Gradient Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#090d16');
    skyGrad.addColorStop(0.55, '#0f172a');
    skyGrad.addColorStop(1, '#020617');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant mountain silhouette
    ctx.fillStyle = '#0a101d';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width * 0.25, height * 0.52);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width * 0.75, height * 0.48);
    ctx.lineTo(width, height * 0.65);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // 2. Canyon Cliffs (Textured Rock)
    const { cx: leftEdgeX, cy: cliffY, scale } = worldToCanvas(lvl.terrain.leftWidth, lvl.terrain.leftY, width, height);
    const { cx: rightEdgeX, cy: rightCliffY } = worldToCanvas(lvl.terrain.rightX, lvl.terrain.rightY, width, height);
    const { cy: waterY } = worldToCanvas(0, lvl.terrain.waterLevelY, width, height);

    // Left Cliff Polygon
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, cliffY);
    ctx.lineTo(leftEdgeX, cliffY);
    ctx.lineTo(leftEdgeX - scale * 1.5, waterY + scale * 3);
    ctx.lineTo(0, waterY + scale * 3);
    ctx.closePath();
    ctx.fill();

    // Left Cliff Grass / Road Top Lip
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, cliffY - 3, leftEdgeX, 5); // Approach asphalt

    // Right Cliff Polygon
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(rightEdgeX, rightCliffY);
    ctx.lineTo(width, rightCliffY);
    ctx.lineTo(width, waterY + scale * 3);
    ctx.lineTo(rightEdgeX + scale * 1.5, waterY + scale * 3);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(rightEdgeX, rightCliffY - 3, width - rightEdgeX, 5); // Right approach road

    // Rock Pillars / Island supports (e.g. Twin Pillars Island Level 3)
    if (lvl.terrain.rockPillars) {
      for (const pillar of lvl.terrain.rockPillars) {
        const p1 = worldToCanvas(pillar.x, pillar.topY, width, height);
        const halfW = pillar.width * 0.5 * scale;
        const bottomY = worldToCanvas(pillar.x, lvl.terrain.waterLevelY - 2.0, width, height).cy;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(p1.cx - halfW, p1.cy);
        ctx.lineTo(p1.cx + halfW, p1.cy);
        ctx.lineTo(p1.cx + halfW + scale * 0.8, bottomY);
        ctx.lineTo(p1.cx - halfW - scale * 0.8, bottomY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Pillar top cap
        ctx.fillStyle = '#475569';
        ctx.fillRect(p1.cx - halfW, p1.cy - 2, halfW * 2, 4);
      }
    }

    // Target Finish Flag on Right Cliff
    const { cx: flagX, cy: flagY } = worldToCanvas(lvl.targetFlagX, lvl.terrain.rightY, width, height);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(flagX - 2, flagY - scale * 2.2, 4, scale * 2.2); // Pole
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(flagX + 2, flagY - scale * 2.2);
    ctx.lineTo(flagX + scale * 1.2, flagY - scale * 1.7);
    ctx.lineTo(flagX + 2, flagY - scale * 1.2);
    ctx.closePath();
    ctx.fill();

    // 3. Flowing Canyon River Water
    const time = performance.now() * 0.002;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, waterY);
    for (let x = 0; x <= width; x += 20) {
      const wave = Math.sin(x * 0.03 + time) * 4 + Math.sin(x * 0.07 - time * 0.7) * 2;
      ctx.lineTo(x, waterY + wave);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Water Surface Foam Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= width; x += 20) {
      const wave = Math.sin(x * 0.03 + time) * 4 + Math.sin(x * 0.07 - time * 0.7) * 2;
      if (x === 0) ctx.moveTo(x, waterY + wave);
      else ctx.lineTo(x, waterY + wave);
    }
    ctx.stroke();

    // 4. Subtle Grid Dots (in BUILD mode)
    if (controller.mode === 'BUILD' && controller.isGridSnapping) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
      const minWorld = canvasToWorld(0, height, width, height);
      const maxWorld = canvasToWorld(width, 0, width, height);

      const startX = Math.floor(minWorld.wx);
      const endX = Math.ceil(maxWorld.wx);
      const startY = Math.floor(minWorld.wy);
      const endY = Math.ceil(maxWorld.wy);

      for (let gx = startX; gx <= endX; gx += 0.5) {
        for (let gy = startY; gy <= endY; gy += 0.5) {
          const pt = worldToCanvas(gx, gy, width, height);
          ctx.beginPath();
          ctx.arc(pt.cx, pt.cy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 5. Render Bridge Members (Beams, Struts, Cables, Decks)
    const nodeMap = new Map<string, TrussNode>();
    controller.nodes.forEach((n) => nodeMap.set(n.id, n));

    controller.members.forEach((m) => {
      const nA = nodeMap.get(m.nodeAId);
      const nB = nodeMap.get(m.nodeBId);
      if (!nA || !nB) return;

      const pA = worldToCanvas(nA.x, nA.y, width, height);
      const pB = worldToCanvas(nB.x, nB.y, width, height);
      const props = MATERIAL_PROPERTIES[m.material];

      ctx.beginPath();
      ctx.moveTo(pA.cx, pA.cy);
      ctx.lineTo(pB.cx, pB.cy);

      if (m.isBroken) {
        // Broken fracture debris (dashed crimson)
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([4, 6]);
      } else if (controller.mode === 'TEST') {
        // Dynamic Stress Color Gradient: Green (0%) -> Yellow (60%) -> Crimson (100%)
        const s = Math.min(1.0, m.stress);
        let r = 16;
        let g = 185;
        let b = 129;

        if (s < 0.6) {
          const tNorm = s / 0.6;
          r = Math.round(16 + tNorm * (234 - 16));
          g = Math.round(185 + tNorm * (179 - 185));
          b = Math.round(129 + tNorm * (8 - 129));
        } else {
          const tNorm = (s - 0.6) / 0.4;
          r = Math.round(234 + tNorm * (239 - 234));
          g = Math.round(179 + tNorm * (68 - 179));
          b = Math.round(8 + tNorm * (68 - 8));
        }
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.setLineDash([]);
      } else {
        // Build mode neutral material color
        ctx.strokeStyle = props.color;
        ctx.setLineDash([]);
      }

      ctx.lineWidth = props.lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Road deck asphalt top stripe
      if (props.isDeck) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = props.lineWidth * 0.4;
        ctx.stroke();
      }
    });

    // 6. Active Rubber-band Beam Preview Line (Only in BUILD mode when drawing a member)
    if (dragStartNode && currentPointerWorld && controller.mode === 'BUILD' && !isDraggingJoint) {
      const pA = worldToCanvas(dragStartNode.x, dragStartNode.y, width, height);
      const pB = worldToCanvas(currentPointerWorld.x, currentPointerWorld.y, width, height);
      const props = MATERIAL_PROPERTIES[controller.activeTool as keyof typeof MATERIAL_PROPERTIES] || MATERIAL_PROPERTIES.ROAD;

      ctx.strokeStyle = props.color;
      ctx.lineWidth = props.lineWidth;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(pA.cx, pA.cy);
      ctx.lineTo(pB.cx, pB.cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip length & cost
      const len = Math.hypot(currentPointerWorld.x - dragStartNode.x, currentPointerWorld.y - dragStartNode.y);
      const cost = Math.round(len * props.costPerMeter);
      const midX = (pA.cx + pB.cx) * 0.5;
      const midY = (pA.cy + pB.cy) * 0.5 - 15;

      ctx.font = '11px monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(midX - 35, midY - 12, 70, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`${len.toFixed(1)}m · $${cost}`, midX, midY + 1);
    }

    // 7. Render Bridge Nodes / Joints
    controller.nodes.forEach((n) => {
      const pt = worldToCanvas(n.x, n.y, width, height);
      const isHovered = hoverNode?.id === n.id || dragStartNode?.id === n.id;

      if (n.isAnchor) {
        // Fixed Cliff Anchor Rivet
        ctx.fillStyle = '#475569';
        ctx.fillRect(pt.cx - 7, pt.cy - 7, 14, 14);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(pt.cx - 7, pt.cy - 7, 14, 14);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(pt.cx, pt.cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Free Joint Pin
        ctx.fillStyle = isHovered ? '#38bdf8' : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(pt.cx, pt.cy, isHovered ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (isHovered) {
        ctx.strokeStyle = isDraggingJoint ? '#a855f7' : '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.cx, pt.cy, 9, 0, Math.PI * 2);
        ctx.stroke();

        // If dragging joint in SELECT mode, show live coordinates tooltip
        if (isDraggingJoint && dragStartNode?.id === n.id) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(pt.cx - 30, pt.cy - 24, 60, 16);
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText(`(${n.x.toFixed(1)}, ${n.y.toFixed(1)})`, pt.cx, pt.cy - 12);
        }
      }
    });

    // 8. Render Vehicle (Chassis, Wheels, Headlight cone)
    const veh = controller.vehicle;
    const chassisPt = worldToCanvas(veh.x, veh.y, width, height);
    const frontWheelPt = worldToCanvas(veh.frontWheel.worldX, veh.frontWheel.worldY, width, height);
    const rearWheelPt = worldToCanvas(veh.rearWheel.worldX, veh.rearWheel.worldY, width, height);

    ctx.save();
    ctx.translate(chassisPt.cx, chassisPt.cy);
    ctx.rotate(-veh.angle); // Invert rotation for canvas coordinates

    const vehW = veh.length * scale;
    const vehH = veh.height * scale;

    // Headlight Light Cone (Soft yellow beam illuminating road ahead)
    if (controller.mode === 'TEST') {
      const lightGrad = ctx.createRadialGradient(vehW * 0.5, 0, 5, vehW * 0.5 + scale * 8, 0, scale * 10);
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(vehW * 0.5, -vehH * 0.2);
      ctx.lineTo(vehW * 0.5 + scale * 9, -vehH * 1.2);
      ctx.lineTo(vehW * 0.5 + scale * 9, vehH * 1.5);
      ctx.closePath();
      ctx.fill();
    }

    // Chassis Body
    ctx.fillStyle = veh.type === 'TRAIN' ? '#b91c1c' : veh.type === 'TRUCK' ? '#d97706' : '#2563eb';
    ctx.beginPath();
    ctx.roundRect(-vehW * 0.5, -vehH * 0.5, vehW, vehH * 0.75, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Windshield & Windows
    ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
    ctx.fillRect(vehW * 0.1, -vehH * 0.45, vehW * 0.3, vehH * 0.4);

    ctx.restore();

    // Vehicle Wheels
    const drawWheel = (pt: { cx: number; cy: number }, radius: number) => {
      const rPix = radius * scale;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(pt.cx, pt.cy, rPix, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rim Hubcap
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(pt.cx, pt.cy, rPix * 0.4, 0, Math.PI * 2);
      ctx.fill();
    };

    drawWheel(rearWheelPt, veh.rearWheel.radius);
    drawWheel(frontWheelPt, veh.frontWheel.radius);

    // 9. Particle System Update & Draw (Splashes & Dust)
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity on particles
      p.life -= 0.02;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }, [canvasToWorld, controller, worldToCanvas]);

  // Keep render function in ref so RAF loop and ResizeObserver never detach
  const renderRef = useRef(renderCanvas);
  renderRef.current = renderCanvas;

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || controller.mode === 'TEST') return;

    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const { wx, wy } = canvasToWorld(cx, cy, width, height);
    const existingNode = findNodeNearWorld(wx, wy);

    if (controller.activeTool === 'DELETE') {
      if (existingNode && !existingNode.isAnchor) {
        controller.deleteNode(existingNode.id);
        return;
      }
      // If no node was clicked, hit-test members for beam deletion
      const member = findMemberNearWorld(wx, wy, 0.5);
      if (member) {
        controller.deleteMember(member.id);
      }
      return;
    }

    if (controller.activeTool === 'SELECT') {
      if (existingNode && !existingNode.isAnchor) {
        dragStartNodeRef.current = existingNode;
        isDraggingJointRef.current = true;
      }
      return;
    }

    // Material Drawing Tools (ROAD, WOOD, STEEL, CABLE, HYDRAULIC)
    if (existingNode) {
      dragStartNodeRef.current = existingNode;
      isDraggingJointRef.current = false;
    } else {
      const newNode = controller.getOrCreateNode(wx, wy);
      dragStartNodeRef.current = newNode;
      isDraggingJointRef.current = false;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const { wx, wy } = canvasToWorld(cx, cy, width, height);
    const snappedX = controller.snapCoord(wx);
    const snappedY = controller.snapCoord(wy);

    pointerWorldRef.current = { x: snappedX, y: snappedY };
    hoverNodeRef.current = findNodeNearWorld(wx, wy);

    // In SELECT mode: reposition the dragged non-anchor joint in real time
    if (isDraggingJointRef.current && dragStartNodeRef.current && !dragStartNodeRef.current.isAnchor) {
      dragStartNodeRef.current.x = snappedX;
      dragStartNodeRef.current.y = snappedY;

      // Update rest lengths of connected members
      for (const m of controller.members) {
        if (m.nodeAId === dragStartNodeRef.current.id || m.nodeBId === dragStartNodeRef.current.id) {
          const nA = controller.nodes.find((n) => n.id === m.nodeAId);
          const nB = controller.nodes.find((n) => n.id === m.nodeBId);
          if (nA && nB) {
            const newLen = Math.hypot(nB.x - nA.x, nB.y - nA.y);
            m.restLength = newLen;
            m.currentLength = newLen;
          }
        }
      }
      TrussPhysicsEngine.updateNodeMasses(controller.nodes, controller.members);
    }
  };

  const handlePointerUp = () => {
    const dragNode = dragStartNodeRef.current;
    const isDragJoint = isDraggingJointRef.current;

    dragStartNodeRef.current = null;
    isDraggingJointRef.current = false;

    if (!dragNode || controller.mode === 'TEST') return;

    if (isDragJoint) {
      // Finished moving a joint in SELECT mode: commit to undo stack
      controller.saveSnapshot();
      return;
    }

    // Finished drawing a member between two nodes
    const pWorld = pointerWorldRef.current;
    if (!pWorld) return;

    const targetNode =
      findNodeNearWorld(pWorld.x, pWorld.y) ||
      controller.getOrCreateNode(pWorld.x, pWorld.y);

    if (targetNode && targetNode.id !== dragNode.id) {
      const activeMat = controller.activeTool as MaterialType;
      if (MATERIAL_PROPERTIES[activeMat]) {
        controller.addMember(dragNode.id, targetNode.id, activeMat);
      }
    }
  };

  // High-DPI ResizeObserver (stable, does not detach on pointer moves)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = entry.contentRect;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      renderRef.current();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main 60 FPS Physics & Render Loop (stable, continuous)
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

  return (
    <div
      ref={containerRef}
      className="flex-1 relative w-full h-full min-h-[400px] cursor-crosshair overflow-hidden select-none bg-slate-950"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        dragStartNodeRef.current = null;
        isDraggingJointRef.current = false;
        hoverNodeRef.current = null;
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
};
