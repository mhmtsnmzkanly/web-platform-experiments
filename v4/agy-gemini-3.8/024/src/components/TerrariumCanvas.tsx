/**
 * POCKET-TERRARIUM (EXP-024) — High-Performance 60 FPS HTML5 Canvas Visualizer
 * Renders:
 * - Diurnal atmospheric lighting (Dawn, Noon, Dusk, Moonlight) & underwater caustics
 * - Dynamic water turbidity (green water algae haze) & glass biofilm
 * - Animated aquatic plants with leaf whorls and oxygen pearling micro-bubbles
 * - Articulated Guppy fish with swimming tail oscillation and hypoxic surface gasping
 * - Zooplankton (Daphnia) hopping locomotion & grazing
 * - Freshwater snails crawling on substrate and glass
 * - Aerator bubbler air column & food flakes
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { TerrariumSimulationController } from '../core/TerrariumSimulationController';

interface TerrariumCanvasProps {
  controller: TerrariumSimulationController;
}

export const TerrariumCanvas: React.FC<TerrariumCanvasProps> = ({ controller }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef<boolean>(false);

  // Render Subroutine
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const { engine } = controller;
    const { env, water, algae } = engine;

    // 1. Diurnal Sky / Water Ambient Gradient
    // Colors transition from morning cyan to noon turquoise, evening amber, night sapphire
    const hour = env.dayTimeHours;
    let topWaterCol = '#0c4a6e';    // midday deep sky blue
    let bottomWaterCol = '#082f49'; // deep cyan

    if (hour < 6.0 || hour >= 20.0) {
      // Midnight / Sapphire Night
      topWaterCol = '#020617';
      bottomWaterCol = '#090d1f';
    } else if (hour >= 6.0 && hour < 9.0) {
      // Dawn / Golden Sunrise
      topWaterCol = '#1e3a5f';
      bottomWaterCol = '#132e35';
    } else if (hour >= 17.0 && hour < 20.0) {
      // Dusk / Warm Sunset
      topWaterCol = '#281c3b';
      bottomWaterCol = '#0f2b3b';
    }

    const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
    waterGrad.addColorStop(0, topWaterCol);
    waterGrad.addColorStop(1, bottomWaterCol);
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Algae Green Water Turbidity Overlay
    if (algae.planktonicDensity > 10.0) {
      const alpha = Math.min(0.65, (algae.planktonicDensity - 10.0) / 120.0);
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Volumetric Light Caustics from Aquarium LED Lamp / Sun
    const lightPower = env.effectiveLight;
    if (lightPower > 0.05) {
      ctx.save();
      ctx.globalAlpha = 0.12 * lightPower;
      const t = env.simTime * 0.8;
      const rayGrad = ctx.createLinearGradient(0, 0, 0, height);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const x1 = (0.2 + i * 0.16 + Math.sin(t + i) * 0.05) * width;
        const x2 = (0.15 + i * 0.18 + Math.cos(t * 0.7 + i) * 0.08) * width;
        ctx.moveTo(x1 - 15, 0);
        ctx.lineTo(x1 + 15, 0);
        ctx.lineTo(x2 + 45, height);
        ctx.lineTo(x2 - 45, height);
        ctx.closePath();
      }
      ctx.fill();
      ctx.restore();
    }

    // 4. Substrate Layer (Aquarium Gravel & Soil)
    const substrateY = height * 0.91;
    const substrateGrad = ctx.createLinearGradient(0, substrateY, 0, height);
    substrateGrad.addColorStop(0, '#3f2d1d'); // Rich dark aqua soil
    substrateGrad.addColorStop(0.3, '#261b11');
    substrateGrad.addColorStop(1, '#17110b');
    ctx.fillStyle = substrateGrad;
    ctx.fillRect(0, substrateY, width, height - substrateY);

    // Decorative Rocks & Pebbles along substrate
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.arc(width * 0.28, substrateY + 6, 22, Math.PI, 0);
    ctx.arc(width * 0.33, substrateY + 8, 16, Math.PI, 0);
    ctx.arc(width * 0.72, substrateY + 5, 28, Math.PI, 0);
    ctx.fill();

    // 5. Render Aquatic Plants (Elodea / Anacharis)
    for (const p of engine.plants) {
      const px = p.x * width;
      const baseY = p.y * height;
      const plantH = p.height * height;
      const segments = 10;
      const segH = plantH / segments;

      // Draw stem
      ctx.strokeStyle = p.health > 0.5 ? '#15803d' : '#854d0e';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, baseY);

      const leaves: { x: number; y: number }[] = [];
      for (let s = 1; s <= segments; s++) {
        const sway = Math.sin(p.swayPhase + s * 0.5) * (s * 2.2);
        const nextX = px + sway;
        const nextY = baseY - s * segH;
        ctx.lineTo(nextX, nextY);
        leaves.push({ x: nextX, y: nextY });
      }
      ctx.stroke();

      // Render leaf whorls on each stem segment in a single pass without context churn
      ctx.fillStyle = p.health > 0.5 ? '#22c55e' : '#a16207';
      ctx.beginPath();
      for (const lf of leaves) {
        ctx.ellipse(lf.x - 8, lf.y, 7, 3, -0.4, 0, Math.PI * 2);
        ctx.ellipse(lf.x + 8, lf.y, 7, 3, 0.4, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    // 6. Aerator Air Stone at Bottom Left
    const stoneX = width * 0.15;
    const stoneY = substrateY - 2;
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(stoneX - 12, stoneY, 24, 8);
    ctx.strokeRect(stoneX - 12, stoneY, 24, 8);

    // 7. Air Bubbles & Plant Pearling Bubbles
    for (const b of engine.bubbles) {
      const bx = b.x * width;
      const by = b.y * height;
      const br = Math.max(2, b.radius * width);

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx - br * 0.35, by - br * 0.35, br * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. Sinking Food Particles
    for (const f of engine.food) {
      const fx = f.x * width;
      const fy = f.y * height;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 9. Zooplankton (Daphnia)
    for (const d of engine.daphnia) {
      const dx = d.x * width;
      const dy = d.y * height;
      ctx.save();
      ctx.fillStyle = 'rgba(254, 215, 170, 0.85)';
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.9)';
      ctx.lineWidth = 1;

      // Pear-shaped carapace
      ctx.beginPath();
      ctx.ellipse(dx, dy, 3, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(dx + 1.2, dy - 2, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 10. Freshwater Snails
    for (const s of engine.snails) {
      const sx = s.x * width;
      const sy = s.y * height;
      const sr = s.size * width;

      ctx.save();
      ctx.translate(sx, sy);

      // Spiral Shell
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, 0, sr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(-sr * 0.15, -sr * 0.15, sr * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Spiral swirl lines
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, sr * 0.65, 0.5, Math.PI * 1.5);
      ctx.stroke();

      // Muscular foot
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(sr * 0.4, sr * 0.6, sr * 0.5, sr * 0.25, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 11. Guppy Fish (Articulated Bodies, Fins & Hypoxic Surface Gasping)
    const isHypoxic = water.dissolvedOxygen < 2.2;

    for (const f of engine.fish) {
      const fx = f.x * width;
      const fy = f.y * height;
      const fishLen = f.size * width;
      const fishHalfW = fishLen * 0.32;
      const facingRight = f.vx >= 0;

      ctx.save();
      ctx.translate(fx, fy);
      if (!facingRight) {
        ctx.scale(-1, 1);
      }

      // Caudal Fin (Tail) with swimming oscillation
      const tailWiggle = Math.sin(f.tailPhase) * 6;
      ctx.fillStyle = f.finColor;
      ctx.beginPath();
      ctx.moveTo(-fishLen * 0.45, 0);
      ctx.quadraticCurveTo(
        -fishLen * 0.85,
        -fishHalfW * 1.3 + tailWiggle,
        -fishLen * 1.0,
        -fishHalfW * 1.6 + tailWiggle
      );
      ctx.quadraticCurveTo(
        -fishLen * 0.75,
        tailWiggle,
        -fishLen * 1.0,
        fishHalfW * 1.6 + tailWiggle
      );
      ctx.quadraticCurveTo(
        -fishLen * 0.85,
        fishHalfW * 1.3 + tailWiggle,
        -fishLen * 0.45,
        0
      );
      ctx.closePath();
      ctx.fill();

      // Fish Torpedo Body with layered highlight (Zero GC churn)
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, fishLen * 0.5, fishHalfW, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ventral / dorsal light reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(fishLen * 0.08, fishHalfW * 0.25, fishLen * 0.35, fishHalfW * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal Fin
      ctx.fillStyle = f.finColor;
      ctx.beginPath();
      ctx.moveTo(-fishLen * 0.1, -fishHalfW);
      ctx.quadraticCurveTo(0, -fishHalfW * 1.8, -fishLen * 0.25, -fishHalfW * 1.6);
      ctx.lineTo(-fishLen * 0.3, -fishHalfW);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fishLen * 0.28, -fishHalfW * 0.2, fishHalfW * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(fishLen * 0.32, -fishHalfW * 0.2, fishHalfW * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Gasping Mouth Animation (if Hypoxic at surface)
      if (isHypoxic && f.y <= 0.12) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        const mouthOpen = (Math.sin(env.simTime * 12) + 1) * 2;
        ctx.strokeRect(fishLen * 0.48, -mouthOpen / 2, 2, mouthOpen);
      }

      ctx.restore();
    }

    // 12. Glass Biofilm Vignette
    if (algae.glassBiofilm > 0.05) {
      ctx.fillStyle = `rgba(101, 163, 13, ${Math.min(0.4, algae.glassBiofilm * 0.45)})`;
      ctx.fillRect(0, 0, 22, height);
      ctx.fillRect(width - 22, 0, 22, height);
      ctx.fillRect(0, substrateY - 14, width, 14);
    }

    // 13. Water Surface Meniscus & Ripple
    const surfaceY = height * 0.08;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, surfaceY);
    for (let x = 0; x <= width; x += 20) {
      const rip = Math.sin(x * 0.03 + env.simTime * 3) * 1.8;
      ctx.lineTo(x, surfaceY + rip);
    }
    ctx.stroke();

    // 14. Glass Tank Reflections & Border Rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    ctx.restore();
  }, [controller]);

  const renderRef = useRef(render);
  renderRef.current = render;

  // ResizeObserver with High-DPI devicePixelRatio Support
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const rect = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor(rect.height)}px`;
      renderRef.current();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main 60 FPS Decoupled Animation Loop
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

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    controller.handleCanvasAction(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    if (controller.activeTool === 'SCRUB_GLASS' || controller.activeTool === 'FEED') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      controller.handleCanvasAction(x, y);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair touch-none select-none"
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};
