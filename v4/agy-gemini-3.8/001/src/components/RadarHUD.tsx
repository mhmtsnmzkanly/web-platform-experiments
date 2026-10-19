import React, { useRef, useEffect } from 'react';
import { CosmosEngine } from '../engine/CosmosEngine';
import { RESOURCE_CONFIG } from '../engine/CosmosEngine';

interface RadarHUDProps {
  engine: CosmosEngine;
}

const RADAR_RADIUS = 68;
const RADAR_RANGE = 1400; // World units displayed on radar

const RadarHUDComponent: React.FC<RadarHUDProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const size = canvas.width;
      const center = size / 2;
      const player = engine.player;

      // Clear radar screen
      ctx.fillStyle = '#060f1e';
      ctx.fillRect(0, 0, size, size);

      // Radar range rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center, center, RADAR_RADIUS, 0, Math.PI * 2);
      ctx.arc(center, center, RADAR_RADIUS * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(center - RADAR_RADIUS, center);
      ctx.lineTo(center + RADAR_RADIUS, center);
      ctx.moveTo(center, center - RADAR_RADIUS);
      ctx.lineTo(center, center + RADAR_RADIUS);
      ctx.stroke();

      // Sweep line
      const sweepAngle = (Date.now() / 600) % (Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + Math.cos(sweepAngle) * RADAR_RADIUS,
        center + Math.sin(sweepAngle) * RADAR_RADIUS
      );
      ctx.stroke();

      const scale = RADAR_RADIUS / RADAR_RANGE;

      // 1. Draw Space Stations (Cyan diamonds)
      engine.stations.forEach((st) => {
        const dx = (st.x - player.x) * scale;
        const dy = (st.y - player.y) * scale;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(center + dx, center + dy - 4);
          ctx.lineTo(center + dx + 4, center + dy);
          ctx.lineTo(center + dx, center + dy + 4);
          ctx.lineTo(center + dx - 4, center + dy);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 2. Draw Asteroids (Colored dots)
      engine.asteroids.forEach((ast) => {
        const dx = (ast.x - player.x) * scale;
        const dy = (ast.y - player.y) * scale;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
          ctx.fillStyle = RESOURCE_CONFIG[ast.resourceType].color;
          ctx.beginPath();
          ctx.arc(center + dx, center + dy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Draw Enemies (Pulsing Red dots)
      engine.enemies.forEach((enemy) => {
        const dx = (enemy.x - player.x) * scale;
        const dy = (enemy.y - player.y) * scale;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(center + dx, center + dy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Player Blip (Facing triangle)
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(player.angle);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-4, 3);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-4, -3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [engine]);

  return (
    <div className="bg-slate-950/80 border-2 border-cyan-500/40 rounded-full p-1 shadow-lg shadow-cyan-950/50 backdrop-blur-xs flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
        className="w-[140px] h-[140px] rounded-full block"
      />
    </div>
  );
};

export const RadarHUD = React.memo(RadarHUDComponent);
