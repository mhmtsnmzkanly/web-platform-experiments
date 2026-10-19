import React, { useRef, useEffect } from 'react';
import { CosmosEngine, CHUNK_SIZE } from '../engine/CosmosEngine';
import { RESOURCE_CONFIG } from '../engine/CosmosEngine';

interface SpaceCanvasProps {
  engine: CosmosEngine;
}

// Generate static background stars for parallax layers
const STARS_LAYER_1 = Array.from({ length: 80 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 2000,
  size: 1.0,
  brightness: 0.3 + Math.random() * 0.4,
}));

const STARS_LAYER_2 = Array.from({ length: 50 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 2000,
  size: 1.8,
  brightness: 0.5 + Math.random() * 0.5,
}));

const STARS_LAYER_3 = Array.from({ length: 25 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 2000,
  size: 2.6,
  brightness: 0.7 + Math.random() * 0.3,
}));

const SpaceCanvasComponent: React.FC<SpaceCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const player = engine.player;

      // 1. Clear background void
      ctx.fillStyle = '#030611';
      ctx.fillRect(0, 0, width, height);

      // Camera coordinates (centered on player)
      const camX = player.x;
      const camY = player.y;
      const halfW = width / 2;
      const halfH = height / 2;

      // 2. PARALLAX STARFIELDS
      const wrapX = Math.max(2400, width);
      const wrapY = Math.max(2400, height);
      const drawStarLayer = (
        stars: typeof STARS_LAYER_1,
        parallaxFactor: number,
        colorPrefix: string
      ) => {
        stars.forEach((star) => {
          let sx = ((star.x - camX * parallaxFactor) % wrapX + wrapX) % wrapX;
          let sy = ((star.y - camY * parallaxFactor) % wrapY + wrapY) % wrapY;
          if (sx > width) sx -= wrapX;
          if (sy > height) sy -= wrapY;

          ctx.fillStyle = `${colorPrefix}${star.brightness})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      drawStarLayer(STARS_LAYER_1, 0.15, 'rgba(148, 163, 184, ');
      drawStarLayer(STARS_LAYER_2, 0.35, 'rgba(56, 189, 248, ');
      drawStarLayer(STARS_LAYER_3, 0.65, 'rgba(251, 191, 36, ');

      // World Coordinate Transform
      ctx.save();
      ctx.translate(halfW - camX, halfH - camY);

      // 3. DRAW SPACE STATIONS
      engine.stations.forEach((st) => {
        ctx.save();
        ctx.translate(st.x, st.y);

        // Outer docking shield ring
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, st.radius + 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Station Body
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Solar Panels cross
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-st.radius * 1.5, -6, st.radius * 3, 12);
        ctx.fillRect(-6, -st.radius * 1.5, 12, st.radius * 3);

        // Core Beacon
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Station Name Tag
        ctx.font = 'bold 11px Orbitron, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(st.name, 0, st.radius + 38);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`[${st.faction}]`, 0, st.radius + 50);

        ctx.restore();
      });

      // 4. DRAW ASTEROIDS
      engine.asteroids.forEach((ast) => {
        ast.rotation += ast.rotSpeed;
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rotation);

        // Jagged Rock Polygon
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ast.vertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Resource Vein Glowing Core
        const resCol = RESOURCE_CONFIG[ast.resourceType].color;
        ctx.fillStyle = resCol;
        ctx.shadowColor = resCol;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, ast.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // 5. DRAW RESOURCE DROPS
      engine.resourceDrops.forEach((drop) => {
        ctx.save();
        ctx.translate(drop.x, drop.y);
        ctx.fillStyle = drop.color;
        ctx.shadowColor = drop.color;
        ctx.shadowBlur = 12;

        // Pulsing diamond
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 6);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // 6. DRAW ENEMIES
      engine.enemies.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.angle);

        // Enemy Hull
        ctx.fillStyle = enemy.type === 'BATTLECRUISER' ? '#450a0a' : '#7f1d1d';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;

        const size = enemy.type === 'BATTLECRUISER' ? 32 : 16;
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.8, size * 0.7);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.8, -size * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shield dome if active
        if (enemy.shield > 0) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();

        // Enemy Health Bar
        const barW = 32;
        const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(enemy.x - barW / 2, enemy.y - size - 14, barW, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(enemy.x - barW / 2, enemy.y - size - 14, barW * hpPercent, 4);
      });

      // 7. DRAW PROJECTILES
      engine.projectiles.forEach((p) => {
        ctx.strokeStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.lineWidth = p.isEnemy ? 3 : 2.5;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 8. DRAW PARTICLES
      engine.particles.forEach((part) => {
        const alpha = Math.max(0, 1 - part.life / part.maxLife);
        ctx.fillStyle = part.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 9. DRAW PLAYER SHIP
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Ship Wings & Fuselage
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(22, 0); // Nose
      ctx.lineTo(-14, 15); // Right wing
      ctx.lineTo(-8, 6);
      ctx.lineTo(-14, -6);
      ctx.lineTo(-14, -15); // Left wing
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Canopy
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(4, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Shield Bubble (glowing cyan dome)
      if (player.shield > 5) {
        const shieldOpacity = Math.min(0.5, (player.shield / player.maxShield) * 0.4);
        ctx.strokeStyle = `rgba(56, 189, 248, ${shieldOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      ctx.restore(); // Restore World Transform

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [engine]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          if (e.button === 0) engine.inputs.fire = true;
        }}
        onPointerUp={(e) => {
          if (e.button === 0) engine.inputs.fire = false;
        }}
        onPointerLeave={() => {
          engine.inputs.fire = false;
        }}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};

export const SpaceCanvas = React.memo(SpaceCanvasComponent);
