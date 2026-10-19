import React, { useRef, useEffect } from 'react';
import { SPHEngine } from '../engine/SPHEngine';
import { ReactionDiffusionEngine } from '../engine/ReactionDiffusionEngine';
import { ToolMode, FluidType, SimulationMode, FluidTelemetry } from '../types';
import { fluidAudio } from '../audio/FluidAudioEngine';

interface FluidCanvasProps {
  sphEngine: SPHEngine;
  rdEngine: ReactionDiffusionEngine;
  toolMode: ToolMode;
  fluidType: FluidType;
  simMode: SimulationMode;
  onPointerAction: () => void;
  onTelemetry?: (telemetry: FluidTelemetry) => void;
}

const FluidCanvasComponent: React.FC<FluidCanvasProps> = ({
  sphEngine,
  rdEngine,
  toolMode,
  fluidType,
  simMode,
  onPointerAction,
  onTelemetry,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);

  // Reaction-Diffusion canvas image data cache
  const rdCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs for current mode to decouple animation loop from tool state changes
  const toolModeRef = useRef<ToolMode>(toolMode);
  toolModeRef.current = toolMode;

  const fluidTypeRef = useRef<FluidType>(fluidType);
  fluidTypeRef.current = fluidType;

  const simModeRef = useRef<SimulationMode>(simMode);
  simModeRef.current = simMode;

  const onTelemetryRef = useRef(onTelemetry);
  onTelemetryRef.current = onTelemetry;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Off-screen canvas for Reaction-Diffusion rendering
    const rdCanvas = document.createElement('canvas');
    rdCanvas.width = rdEngine.width;
    rdCanvas.height = rdEngine.height;
    const rdCtx = rdCanvas.getContext('2d');
    rdCanvasRef.current = rdCanvas;

    const rdImageData = rdCtx ? rdCtx.createImageData(rdEngine.width, rdEngine.height) : null;

    let animId: number;
    let lastTime = performance.now();
    let frameCounter = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 800;
      const h = parent?.clientHeight || 600;
      canvas.width = w;
      canvas.height = h;
      sphEngine.setDimensions(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      const dtSec = (time - lastTime) / 1000;
      lastTime = time;

      // 1. UPDATE SPH PHYSICS
      const telemetry = sphEngine.update(dtSec);
      fluidAudio.updateFlow(telemetry.kineticEnergy, telemetry.particleCount);

      // Throttled telemetry dispatch every 6 frames
      frameCounter++;
      if (frameCounter % 6 === 0 && onTelemetryRef.current) {
        onTelemetryRef.current(telemetry);
      }

      // 2. UPDATE REACTION-DIFFUSION IF IN COUPLED OR RD MODE
      const currentSimMode = simModeRef.current;
      if (currentSimMode !== 'SPH_PARTICLES') {
        const cw = canvas.width;
        const ch = canvas.height;
        // Particles deposit chemical V into substrate scaled to current canvas dimensions
        for (let i = 0; i < sphEngine.particles.length; i += 2) {
          const p = sphEngine.particles[i];
          if (p.type === 'BIOLUMINESCENT' || currentSimMode === 'COUPLED_MORPHOGENESIS') {
            rdEngine.depositV(p.x, p.y, 0.15, 2, cw, ch);
          }
        }
        rdEngine.step();
      }

      // 3. CLEAR CANVAS
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. DRAW REACTION-DIFFUSION SUBSTRATE BACKGROUND
      if (currentSimMode !== 'SPH_PARTICLES' && rdCtx && rdImageData) {
        const u = rdEngine.u;
        const v = rdEngine.v;
        const data = rdImageData.data;
        const total = rdEngine.width * rdEngine.height;

        for (let i = 0; i < total; i++) {
          const vVal = v[i];
          const uVal = u[i];
          const idx = i * 4;

          // Bioluminescent colormap: Dark navy -> Cyan -> Emerald green
          data[idx] = Math.floor(vVal * 40); // R
          data[idx + 1] = Math.floor(vVal * 230 + uVal * 15); // G
          data[idx + 2] = Math.floor(vVal * 180 + (1 - uVal) * 90); // B
          data[idx + 3] = Math.min(255, Math.floor(vVal * 380)); // Alpha
        }

        rdCtx.putImageData(rdImageData, 0, 0);
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(rdCanvas, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // 5. DRAW VORTICES
      for (const vort of sphEngine.vortices) {
        ctx.save();
        ctx.translate(vort.x, vort.y);
        ctx.strokeStyle = vort.strength > 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 1.5;

        // Rotating spiral lines
        const rot = time * 0.003 * (vort.strength > 0 ? 1 : -1);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.arc(0, 0, vort.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, vort.radius * 0.5, 0, Math.PI * 1.5);
        ctx.stroke();

        ctx.fillStyle = vort.strength > 0 ? '#38bdf8' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 6. DRAW OBSTACLES
      for (const obs of sphEngine.obstacles) {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;

        if (obs.type === 'CIRCLE' && obs.radius) {
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (obs.type === 'RECT' && obs.width && obs.height) {
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        }
      }

      // 7. DRAW FLUID PARTICLES
      const pCount = sphEngine.particles.length;
      for (let i = 0; i < pCount; i++) {
        const p = sphEngine.particles[i];

        // Particle speed for motion blur / stretch
        const speed = Math.hypot(p.vx, p.vy);
        const radius = Math.max(3.2, Math.min(6.5, 3.2 + p.density * 1.2));

        // Color based on fluid type and pressure compression
        let pColor = p.color;
        if (p.pressure > 600) {
          pColor = '#ffffff'; // High pressure compression
        }

        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Velocity tail streak
        if (speed > 50) {
          ctx.strokeStyle = pColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - (p.vx / speed) * Math.min(15, speed * 0.05), p.y - (p.vy / speed) * Math.min(15, speed * 0.05));
          ctx.stroke();
        }
      }

      // 8. CONTINUOUS INTERACTIVE EMITTER WHILE POINTER DOWN
      if (isPointerDownRef.current && lastPointerPosRef.current) {
        const { x, y } = lastPointerPosRef.current;
        if (toolModeRef.current === 'EMIT_FLUID') {
          sphEngine.emitParticles(x, y, 3, fluidTypeRef.current, 160);
          fluidAudio.playDroplet(500 + Math.random() * 200);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [sphEngine, rdEngine]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPointerPosRef.current = { x, y };

    onPointerAction();

    const currentTool = toolModeRef.current;
    const currentFluid = fluidTypeRef.current;

    if (currentTool === 'EMIT_FLUID') {
      sphEngine.emitParticles(x, y, 12, currentFluid, 160);
      fluidAudio.playDroplet(600);
    } else if (currentTool === 'DRAW_OBSTACLE') {
      if (sphEngine.obstacles.length < 20) {
        sphEngine.obstacles.push({
          id: `obs-${Date.now()}`,
          x,
          y,
          radius: 28,
          type: 'CIRCLE',
        });
        fluidAudio.playDroplet(400);
      }
    } else if (currentTool === 'PLACE_VORTEX') {
      if (sphEngine.vortices.length < 8) {
        const isReverse = e.shiftKey;
        sphEngine.vortices.push({
          id: `vort-${Date.now()}`,
          x,
          y,
          strength: isReverse ? -24000 : 24000,
          radius: 110,
        });
        fluidAudio.playPressureBurst();
      }
    } else if (currentTool === 'ERASE') {
      // Erase particles, obstacles, and vortices
      sphEngine.eraseAt(x, y, 36);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPointerDownRef.current && lastPointerPosRef.current) {
      const dx = x - lastPointerPosRef.current.x;
      const dy = y - lastPointerPosRef.current.y;
      const currentTool = toolModeRef.current;

      if (currentTool === 'STIR_FORCE') {
        sphEngine.stirFluid(x, y, dx * 15, dy * 15, 90);
      } else if (currentTool === 'EMIT_FLUID') {
        sphEngine.emitParticles(x, y, 3, fluidTypeRef.current, 160);
      } else if (currentTool === 'ERASE') {
        sphEngine.eraseAt(x, y, 36);
      }
    }

    lastPointerPosRef.current = { x, y };
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    lastPointerPosRef.current = null;
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 select-none cursor-crosshair">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block"
      />
    </div>
  );
};

export const FluidCanvas = React.memo(FluidCanvasComponent);
