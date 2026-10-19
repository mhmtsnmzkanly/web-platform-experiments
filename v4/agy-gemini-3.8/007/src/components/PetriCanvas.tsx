import React, { useRef, useEffect } from 'react';
import { EcosystemEngine } from '../engine/EcosystemEngine';
import { EcosystemTelemetry, InterventionTool, MicroscopyMode, Organism } from '../types';
import { bioAudio } from '../audio/BioAudioEngine';

interface PetriCanvasProps {
  engine: EcosystemEngine;
  tool: InterventionTool;
  microscopy: MicroscopyMode;
  selectedOrganism: Organism | null;
  onSelectOrganism: (org: Organism | null) => void;
  onTelemetry: (telemetry: EcosystemTelemetry) => void;
}

export const PetriCanvas: React.FC<PetriCanvasProps> = ({
  engine,
  tool,
  microscopy,
  selectedOrganism,
  onSelectOrganism,
  onTelemetry,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef(false);

  // Decoupled refs to prevent re-instantiating the RAF loop on every state change
  const toolRef = useRef(tool);
  toolRef.current = tool;

  const microscopyRef = useRef(microscopy);
  microscopyRef.current = microscopy;

  const selectedOrgIdRef = useRef<string | null>(selectedOrganism?.id || null);
  selectedOrgIdRef.current = selectedOrganism?.id || null;

  const onSelectOrganismRef = useRef(onSelectOrganism);
  onSelectOrganismRef.current = onSelectOrganism;

  const onTelemetryRef = useRef(onTelemetry);
  onTelemetryRef.current = onTelemetry;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastBirthCount = engine.totalBirths;
    let lastDeathCount = engine.totalDeaths;
    let lastFeedCount = engine.totalFeeds;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 1000;
      const h = parent?.clientHeight || 700;
      canvas.width = w;
      canvas.height = h;
      engine.setDimensions(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // 1. UPDATE ECOSYSTEM SIMULATION
      const telemetry = engine.update(dt);

      // Sound triggers for biological events
      if (engine.totalBirths > lastBirthCount) {
        bioAudio.playMitosisPop(260 + Math.random() * 200);
        lastBirthCount = engine.totalBirths;
      }
      if (engine.totalDeaths > lastDeathCount) {
        bioAudio.playBiteCrunch();
        lastDeathCount = engine.totalDeaths;
      }
      if (engine.totalFeeds > lastFeedCount) {
        bioAudio.playFeedChime(880 + Math.random() * 200);
        lastFeedCount = engine.totalFeeds;
      }

      // Throttled 10Hz telemetry update
      frameCount++;
      if (frameCount % 6 === 0) {
        onTelemetryRef.current(telemetry);
        // Refresh selected organism reference if it was selected
        if (selectedOrgIdRef.current) {
          const fresh = engine.organisms.find((o) => o.id === selectedOrgIdRef.current);
          if (!fresh) {
            onSelectOrganismRef.current(null);
          }
        }
      }

      // 2. CLEAR BACKGROUND ACCORDING TO MICROSCOPY MODE
      const mode = microscopyRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (mode === 'DARK_FIELD') {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
      } else if (mode === 'PHASE_CONTRAST') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
      } else if (mode === 'FLUORESCENT_GFP') {
        ctx.fillStyle = '#020814';
        ctx.fillRect(0, 0, w, h);
      } else {
        // Bright-Field
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, w, h);
      }

      // 3. DRAW ENVIRONMENTAL ZONES
      for (const zone of engine.zones) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);

        if (zone.type === 'RADIATION_HOTSPOT') {
          const radGrad = ctx.createRadialGradient(zone.x, zone.y, 5, zone.x, zone.y, zone.radius);
          radGrad.addColorStop(0, 'rgba(234, 179, 8, 0.22)');
          radGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = radGrad;
          ctx.fill();
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (zone.type === 'NUTRIENT_VENT') {
          const ventGrad = ctx.createRadialGradient(zone.x, zone.y, 5, zone.x, zone.y, zone.radius);
          ventGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
          ventGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = ventGrad;
          ctx.fill();
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (zone.type === 'TOXIN_POLLUTION') {
          const toxGrad = ctx.createRadialGradient(zone.x, zone.y, 5, zone.x, zone.y, zone.radius);
          toxGrad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
          toxGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = toxGrad;
          ctx.fill();
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. DRAW NUTRIENTS (PLANT & MEAT)
      for (let n = 0; n < engine.nutrients.length; n++) {
        const nut = engine.nutrients[n];
        ctx.beginPath();
        ctx.arc(nut.x, nut.y, nut.radius, 0, Math.PI * 2);

        if (mode === 'BRIGHT_FIELD') {
          ctx.fillStyle = nut.type === 'PLANT' ? '#15803d' : '#b91c1c';
          ctx.fill();
        } else if (mode === 'FLUORESCENT_GFP') {
          ctx.fillStyle = nut.type === 'PLANT' ? 'rgba(74, 222, 128, 0.9)' : 'rgba(251, 113, 133, 0.9)';
          ctx.shadowColor = nut.type === 'PLANT' ? '#22c55e' : '#f43f5e';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = nut.type === 'PLANT' ? '#22c55e' : '#f43f5e';
          ctx.fill();
        }
      }

      // 5. DRAW ORGANISMS
      const isBright = mode === 'BRIGHT_FIELD';
      const isFluo = mode === 'FLUORESCENT_GFP';
      const isPhase = mode === 'PHASE_CONTRAST';

      for (let i = 0; i < engine.organisms.length; i++) {
        const org = engine.organisms[i];
        const sz = org.genome.size;
        const isSelected = org.id === selectedOrgIdRef.current;

        ctx.save();
        ctx.translate(org.x, org.y);
        ctx.rotate(org.angle);

        // A. Draw Sensory Cone Field-of-View
        if (isSelected || isFluo) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const fovHalf = org.genome.sensorFov / 2;
          ctx.arc(0, 0, org.genome.sensorRange, -fovHalf, fovHalf);
          ctx.closePath();
          ctx.fillStyle = isSelected
            ? 'rgba(56, 189, 248, 0.12)'
            : 'rgba(74, 222, 128, 0.04)';
          ctx.fill();
          if (isSelected) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }

        // B. Draw Locomotion Flagella (undulating sine waves trailing the tail)
        ctx.save();
        const fCount = org.genome.flagellaCount;
        ctx.lineWidth = 1.5;

        for (let f = 0; f < fCount; f++) {
          const lateralOffset = (f - (fCount - 1) / 2) * (sz * 0.45);
          const phase = org.flagellaPhases[f] || 0;

          ctx.beginPath();
          ctx.moveTo(-sz * 0.8, lateralOffset);

          const tailLength = sz * 2.2;
          for (let seg = 1; seg <= 7; seg++) {
            const frac = seg / 7;
            const segX = -sz * 0.8 - frac * tailLength;
            const amplitude = (frac * 6) * Math.sin(phase + frac * 4.5);
            ctx.lineTo(segX, lateralOffset + amplitude);
          }

          if (isBright) {
            ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
          } else if (isFluo) {
            ctx.strokeStyle = `hsla(${org.genome.hue}, 90%, 65%, 0.7)`;
          } else {
            ctx.strokeStyle = `hsla(${org.genome.hue}, 70%, 55%, 0.6)`;
          }
          ctx.stroke();
        }
        ctx.restore();

        // C. Draw Organism Body Cell Membrane
        ctx.beginPath();
        // Generate membrane vertices with subtle biological membrane wobble
        const wobble = org.membraneWobble;
        for (let a = 0; a <= Math.PI * 2; a += Math.PI / 8) {
          const rWobble = sz + Math.sin(a * 3 + wobble) * 1.2;
          const px = Math.cos(a) * rWobble;
          const py = Math.sin(a) * (rWobble * 0.75); // Slightly elongated ellipse
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Color shading based on microscopy mode
        if (isBright) {
          ctx.fillStyle = `hsla(${org.genome.hue}, 60%, 45%, 0.85)`;
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (isFluo) {
          // Bioluminescent neural firing brightness
          const firingIntensity = org.brainActivations.outputs[2] || 0.4;
          ctx.fillStyle = `hsla(${org.genome.hue}, 95%, ${40 + firingIntensity * 30}%, 0.8)`;
          ctx.shadowColor = `hsl(${org.genome.hue}, 100%, 60%)`;
          ctx.shadowBlur = 12 + firingIntensity * 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (isPhase) {
          // Phase contrast: silver/dark optical diffraction ring
          ctx.fillStyle = `hsla(${org.genome.hue}, 30%, 40%, 0.6)`;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2.2;
          ctx.stroke();
        } else {
          // Dark Field
          ctx.fillStyle = `hsla(${org.genome.hue}, 80%, 50%, 0.75)`;
          ctx.fill();
          ctx.strokeStyle = `hsla(${org.genome.hue}, 100%, 80%, 0.9)`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        // D. Internal Organelle: Cell Nucleus / Vacuole
        ctx.beginPath();
        ctx.arc(-sz * 0.1, 0, sz * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = isBright ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        // E. Photoreceptors / Eyes
        ctx.beginPath();
        ctx.arc(sz * 0.5, -sz * 0.3, 2.2, 0, Math.PI * 2);
        ctx.arc(sz * 0.5, sz * 0.3, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isBright ? '#ffffff' : '#020617';
        ctx.fill();

        // F. Energy Level Arc Ring
        const energyRatio = Math.max(0, Math.min(1, org.energy / org.maxEnergy));
        ctx.beginPath();
        ctx.arc(0, 0, sz + 4, -Math.PI / 2, -Math.PI / 2 + energyRatio * Math.PI * 2);
        ctx.strokeStyle = energyRatio > 0.4 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // G. Selection Reticle HUD
        if (isSelected) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(org.x, org.y, sz + 14, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // Species tag above specimen
          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${org.genome.speciesName} (G${org.generation})`, org.x, org.y - sz - 18);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [engine]);

  // Pointer event interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    bioAudio.init(); // Initialize audio on first genuine user gesture
    isPointerDownRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    executeToolAction(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (toolRef.current !== 'SELECT_INSPECT') {
      executeToolAction(x, y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const executeToolAction = (x: number, y: number) => {
    const currentTool = toolRef.current;
    if (currentTool === 'SELECT_INSPECT') {
      const found = engine.findOrganismAt(x, y);
      onSelectOrganism(found);
    } else if (currentTool === 'PIPETTE_NUTRIENT') {
      engine.addNutrientBloom(x, y, 6);
      bioAudio.playFeedChime(950 + Math.random() * 300);
    } else if (currentTool === 'MUTAGEN_BEAM') {
      engine.applyRadiationBeam(x, y, 65);
      bioAudio.playMutagenZap();
    } else if (currentTool === 'EXTERMINATE') {
      engine.exterminateAt(x, y, 50);
      bioAudio.playBiteCrunch();
    }
  };

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block"
      />
    </div>
  );
};
