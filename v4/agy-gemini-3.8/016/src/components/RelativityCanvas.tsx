import React, { useRef, useEffect, useCallback } from 'react';
import {
  SuiteMode,
  PresetId,
  GeodesicParams,
  LensingParams,
  GravitationalWaveParams,
  ColormapMode,
  TelemetryMetrics,
} from '../types';
import { GeodesicIntegrator } from '../relativity/GeodesicIntegrator';
import { RelativisticRayTracer } from '../relativity/RelativisticRayTracer';
import { GravitationalWaveEngine } from '../relativity/GravitationalWaveEngine';

interface RelativityCanvasProps {
  suiteMode: SuiteMode;
  presetId?: PresetId | '';
  colormapMode: ColormapMode;
  geodesicParams: GeodesicParams;
  lensingParams: LensingParams;
  gwParams: GravitationalWaveParams;
  spawnTrigger?: number;
  clearTrigger?: number;
  onUpdateLensing: (params: Partial<LensingParams>) => void;
  onUpdateGeodesic: (params: Partial<GeodesicParams>) => void;
  onTelemetry: (metrics: TelemetryMetrics) => void;
  onAudioUpdate: (
    suiteMode: SuiteMode,
    gwFreqHz: number,
    gwStrainPeak: number,
    isMerged: boolean,
    closestGeodesicR: number,
    spinA: number,
    maxDoppler: number
  ) => void;
  isPaused: boolean;
}

export const RelativityCanvas: React.FC<RelativityCanvasProps> = ({
  suiteMode,
  presetId,
  colormapMode,
  geodesicParams,
  lensingParams,
  gwParams,
  spawnTrigger = 0,
  clearTrigger = 0,
  onUpdateLensing,
  onUpdateGeodesic,
  onTelemetry,
  onAudioUpdate,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Engines
  const geoEngineRef = useRef<GeodesicIntegrator>(new GeodesicIntegrator());
  const rayTracerRef = useRef<RelativisticRayTracer>(new RelativisticRayTracer());
  const gwEngineRef = useRef<GravitationalWaveEngine>(new GravitationalWaveEngine());

  // Offscreen canvas and pre-allocated typed array view for ray-tracer
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenImageDataRef = useRef<ImageData | null>(null);
  const offscreenUint32Ref = useRef<Uint32Array | null>(null);

  // Interactive Drag & Launch State in Ref (Decoupled from React render/effect churn)
  const dragStateRef = useRef<{
    isDragging: boolean;
    dragStart: { x: number; y: number } | null;
    dragCurrent: { x: number; y: number } | null;
  }>({
    isDragging: false,
    dragStart: null,
    dragCurrent: null,
  });

  // Embedding camera angles
  const camAngleRef = useRef<{ elevation: number; azimuth: number }>({ elevation: 32, azimuth: 45 });

  // Telemetry throttling and FPS tracking
  const lastTimeRef = useRef<number>(performance.now());
  const lastTelemetryTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const stepCountRef = useRef<number>(0);

  // Initialize offscreen buffer & cached 32-bit view for ray tracer
  useEffect(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = rayTracerRef.current.width;
    offscreen.height = rayTracerRef.current.height;
    offscreenCanvasRef.current = offscreen;
    const offCtx = offscreen.getContext('2d');
    if (offCtx) {
      const imgData = offCtx.createImageData(
        rayTracerRef.current.width,
        rayTracerRef.current.height
      );
      offscreenImageDataRef.current = imgData;
      offscreenUint32Ref.current = new Uint32Array(imgData.data.buffer);
    }
  }, []);

  // Sync GW engine parameters on change
  useEffect(() => {
    gwEngineRef.current.resetSimulation(gwParams);
  }, [gwParams.primaryMassMsun, gwParams.secondaryMassMsun, gwParams.dimensionlessSpin1]);

  // Handle Control Deck Spawn Button Trigger
  const prevSpawnTriggerRef = useRef<number>(0);
  useEffect(() => {
    if (spawnTrigger > prevSpawnTriggerRef.current) {
      prevSpawnTriggerRef.current = spawnTrigger;
      geoEngineRef.current.addParticle(geodesicParams);
    }
  }, [spawnTrigger, geodesicParams]);

  // Handle Control Deck Clear Button Trigger
  const prevClearTriggerRef = useRef<number>(0);
  useEffect(() => {
    if (clearTrigger > prevClearTriggerRef.current) {
      prevClearTriggerRef.current = clearTrigger;
      geoEngineRef.current.clearParticles();
    }
  }, [clearTrigger]);

  // Handle Preset Change: reset particles to preset's intended starting condition
  const prevPresetIdRef = useRef<PresetId | '' | undefined>(undefined);
  useEffect(() => {
    if (presetId && presetId !== prevPresetIdRef.current) {
      prevPresetIdRef.current = presetId;
      geoEngineRef.current.clearParticles();
      geoEngineRef.current.addParticle(geodesicParams);
    }
  }, [presetId, geodesicParams]);

  /**
   * Helper to map client mouse coordinates accurately considering letterbox/pillarbox
   */
  const getNormalizedCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const canvasAspect = canvas.width / canvas.height;
    const rectAspect = rect.width / rect.height;

    let renderW = rect.width;
    let renderH = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (rectAspect > canvasAspect) {
      // Pillarboxed (extra width on sides)
      renderW = rect.height * canvasAspect;
      offsetX = (rect.width - renderW) * 0.5;
    } else {
      // Letterboxed (extra height on top/bottom)
      renderH = rect.width / canvasAspect;
      offsetY = (rect.height - renderH) * 0.5;
    }

    const clientX = e.clientX - rect.left - offsetX;
    const clientY = e.clientY - rect.top - offsetY;

    const normX = Math.max(0, Math.min(canvas.width, (clientX / renderW) * canvas.width));
    const normY = Math.max(0, Math.min(canvas.height, (clientY / renderH) * canvas.height));

    return { x: normX, y: normY };
  }, []);

  // Pointer event handlers using ref for smooth interaction without effect re-triggers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getNormalizedCoords(e);
    dragStateRef.current = {
      isDragging: true,
      dragStart: pos,
      dragCurrent: pos,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const state = dragStateRef.current;
    if (!state.isDragging || !state.dragStart) return;
    const pos = getNormalizedCoords(e);
    state.dragCurrent = pos;

    if (suiteMode === 'KERR_SHADOW_LENS') {
      // Dragging adjusts inclination & distance
      const dy = pos.y - state.dragStart.y;
      const dx = pos.x - state.dragStart.x;
      const newInc = Math.max(5, Math.min(88, lensingParams.inclinationDeg - dy * 0.15));
      const newDist = Math.max(12, Math.min(50, lensingParams.observerDistance + dx * 0.05));
      onUpdateLensing({ inclinationDeg: newInc, observerDistance: newDist });
    } else if (suiteMode === 'SPACETIME_EMBEDDING') {
      // Dragging adjusts embedding view angles
      const dy = pos.y - state.dragStart.y;
      const dx = pos.x - state.dragStart.x;
      camAngleRef.current.elevation = Math.max(10, Math.min(75, camAngleRef.current.elevation - dy * 0.2));
      camAngleRef.current.azimuth = (camAngleRef.current.azimuth + dx * 0.3) % 360;
    }
  };

  const handleMouseUp = () => {
    const state = dragStateRef.current;
    if (!state.isDragging || !state.dragStart || !state.dragCurrent) {
      dragStateRef.current = { isDragging: false, dragStart: null, dragCurrent: null };
      return;
    }

    const canvas = canvasRef.current;
    if (canvas && suiteMode === 'GEODESIC_ORBITS') {
      // Launch new particle from drag vector
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;
      const scale = 20.0; // pixels per M

      const rX = (state.dragStart.x - cx) / scale;
      const rY = (state.dragStart.y - cy) / scale;
      const rLaunch = Math.sqrt(rX * rX + rY * rY);

      if (rLaunch > 2.2) {
        const vVecX = (state.dragCurrent.x - state.dragStart.x) * 0.008;
        const vVecY = (state.dragCurrent.y - state.dragStart.y) * 0.008;
        const speed = Math.min(0.95, Math.sqrt(vVecX * vVecX + vVecY * vVecY));
        const angleDeg = (Math.atan2(vVecY, vVecX) * 180.0) / Math.PI;

        const effectiveSpeed = Math.max(0.08, speed);
        onUpdateGeodesic({
          launchRadius: Math.max(3.0, Math.min(26.0, rLaunch)),
          launchSpeed: effectiveSpeed,
          launchAngleDeg: (angleDeg + 360) % 360,
        });

        // Spawn custom particle directly at dragStart
        geoEngineRef.current.particles.push({
          id: `drag-${Date.now()}`,
          x: rX,
          y: rY,
          z: 0.0,
          vx: effectiveSpeed * Math.cos((angleDeg * Math.PI) / 180.0),
          vy: effectiveSpeed * Math.sin((angleDeg * Math.PI) / 180.0),
          vz: 0.0,
          isPhoton: geodesicParams.isPhoton,
          energy: 1.0,
          angularMomentum: rX * vVecY - rY * vVecX,
          trail: [{ x: rX, y: rY }],
          isCaptured: false,
          color: geodesicParams.isPhoton ? '#38bdf8' : '#34d399',
        });
      }
    }

    dragStateRef.current = { isDragging: false, dragStart: null, dragCurrent: null };
  };

  // Main 60 FPS Animation & Simulation Loop
  useEffect(() => {
    let animId: number;

    const renderLoop = (timestamp: number) => {
      animId = requestAnimationFrame(renderLoop);

      // FPS tracking
      frameCountRef.current++;
      stepCountRef.current++;
      if (timestamp - lastTimeRef.current >= 500) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (timestamp - lastTimeRef.current));
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W * 0.5;
      const cy = H * 0.5;

      const geo = geoEngineRef.current;
      const rayTracer = rayTracerRef.current;
      const gw = gwEngineRef.current;

      // Physics Stepping (Gated by active mode to optimize CPU)
      if (!isPaused) {
        if (suiteMode === 'GEODESIC_ORBITS' || suiteMode === 'SPACETIME_EMBEDDING') {
          // Step geodesic particles
          geo.step(geodesicParams, 0.035);
        } else if (suiteMode === 'GRAVITATIONAL_WAVES') {
          // Step post-Newtonian gravitational wave inspiral
          gw.step(gwParams, 0.0018);
        }
      }

      // 1. CLEAR CANVAS
      ctx.fillStyle = '#030712'; // Tailwind Gray 950 deep void
      ctx.fillRect(0, 0, W, H);

      // Closest particle distance for sonification
      let closestR = 30.0;
      for (const p of geo.particles) {
        const r = Math.sqrt(p.x * p.x + p.y * p.y);
        if (r < closestR) closestR = r;
      }

      // ==========================================
      // MODE 1: GEODESIC ORBITS
      // ==========================================
      if (suiteMode === 'GEODESIC_ORBITS') {
        const scale = 20.0; // 1 M = 20 pixels

        // Background subtle grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < W; x += 40) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
        }
        for (let y = 0; y < H; y += 40) {
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
        }
        ctx.stroke();

        // 1. Innermost Stable Circular Orbit (ISCO)
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, geo.rIsco * scale, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Photon Sphere (r_ph)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(cx, cy, geo.rPhotonSphere * scale, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Ergosphere outer boundary: r_ergo(theta = pi/2) = 2M
        if (geodesicParams.metricType === 'KERR' && Math.abs(geodesicParams.spinA) > 0.05) {
          ctx.strokeStyle = '#ec4899';
          ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 3]);
          ctx.beginPath();
          ctx.ellipse(cx, cy, 2.0 * scale, (2.0 - 0.25 * Math.abs(geodesicParams.spinA)) * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // 4. Outer Event Horizon (r_+)
        ctx.setLineDash([]);
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, geo.rPlus * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Central Singularity Ring / Point
        if (geodesicParams.metricType === 'KERR' && Math.abs(geodesicParams.spinA) > 0.1) {
          // Kerr ring singularity of radius a
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.abs(geodesicParams.spinA) * scale * 0.4, 3, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Geodesic Particles & Trails
        for (const p of geo.particles) {
          // Trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(cx + p.trail[0].x * scale, cy + p.trail[0].y * scale);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(cx + p.trail[i].x * scale, cy + p.trail[i].y * scale);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.isPhoton ? 1.5 : 2.0;
            ctx.stroke();
          }

          // Particle Head
          if (!p.isCaptured) {
            const px = cx + p.x * scale;
            const py = cy + p.y * scale;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, p.isPhoton ? 3.5 : 5.0, 0, Math.PI * 2);
            ctx.fill();

            // Glow
            ctx.fillStyle = p.isPhoton ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)';
            ctx.beginPath();
            ctx.arc(px, py, p.isPhoton ? 7.0 : 9.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Drag vector launch indicator read directly from ref (Zero GC)
        const drag = dragStateRef.current;
        if (drag.isDragging && drag.dragStart && drag.dragCurrent) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 2]);
          ctx.beginPath();
          ctx.moveTo(drag.dragStart.x, drag.dragStart.y);
          ctx.lineTo(drag.dragCurrent.x, drag.dragCurrent.y);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(drag.dragStart.x, drag.dragStart.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Diagnostic Legend
        ctx.font = '11px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`r+ (Horizon) = ${geo.rPlus.toFixed(2)} M`, 16, 26);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`r_ph (Photon Sphere) = ${geo.rPhotonSphere.toFixed(2)} M`, 16, 42);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`r_ISCO = ${geo.rIsco.toFixed(2)} M`, 16, 58);
      }

      // ==========================================
      // MODE 2: KERR SHADOW & LENSING
      // ==========================================
      else if (suiteMode === 'KERR_SHADOW_LENS') {
        const offscreen = offscreenCanvasRef.current;
        const offData = offscreenImageDataRef.current;
        const imgBuf = offscreenUint32Ref.current;

        if (offscreen && offData && imgBuf) {
          // Render ray-traced pixels
          rayTracer.render(lensingParams, geodesicParams.spinA, colormapMode, timestamp * 0.001);

          // Copy pixel buffer into cached ImageData view (Zero GC)
          imgBuf.set(rayTracer.pixelBuffer);

          const offCtx = offscreen.getContext('2d');
          if (offCtx) {
            offCtx.putImageData(offData, 0, 0);
            // Draw stretched offscreen canvas smoothly onto main canvas
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(offscreen, 0, 0, W, H);
          }
        }

        // Overlay Doppler Beaming & Ergosphere Markers
        ctx.font = '12px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.fillText('◀ Blueshifted Approach (δ⁴ Boost)', 24, H - 24);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fillText('Redshifted Receding Flow ▶', W - 220, H - 24);

        // Circular Scale Reticle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, 90, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ==========================================
      // MODE 3: GRAVITATIONAL WAVES (IMR)
      // ==========================================
      else if (suiteMode === 'GRAVITATIONAL_WAVES') {
        const topH = H * 0.52;
        const bottomH = H - topH;
        const orbitScale = 14.0;

        // Top Section: Binary Orbit & Spacetime Metric Curvature Ripples
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, topH);
        ctx.clip();

        // Metric quadrupole curvature ripples propagating outward
        const ripplePhase = gw.currentFreqHz * timestamp * 0.004;
        ctx.lineWidth = 1.2;
        for (let rad = 30; rad < 240; rad += 18) {
          const alpha = Math.max(0.04, 0.45 * (1.0 - rad / 240));
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.beginPath();
          // Quadrupolar spiral perturbation
          for (let th = 0; th < Math.PI * 2; th += 0.1) {
            const rPerturb = rad + 6.0 * Math.cos(2 * th - ripplePhase);
            const rx = cx + rPerturb * Math.cos(th);
            const ry = (topH * 0.5) + rPerturb * Math.sin(th) * 0.6;
            if (th === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();
        }

        const orbCy = topH * 0.5;
        // Primary Black Hole
        const m1 = gwParams.primaryMassMsun;
        const m2 = gwParams.secondaryMassMsun;
        const rad1 = Math.max(6, Math.min(18, Math.sqrt(m1) * 2.2));
        const rad2 = Math.max(5, Math.min(16, Math.sqrt(m2) * 2.2));

        const p1x = cx + gw.pos1.x * orbitScale;
        const p1y = orbCy + gw.pos1.y * orbitScale * 0.6;
        const p2x = cx + gw.pos2.x * orbitScale;
        const p2y = orbCy + gw.pos2.y * orbitScale * 0.6;

        // Orbit paths
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.ellipse(cx, orbCy, Math.abs(gw.pos1.x * orbitScale), Math.abs(gw.pos1.y * orbitScale * 0.6), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Black Hole 1
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p1x, p1y, rad1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Black Hole 2
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p2x, p2y, rad2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`m1 = ${m1.toFixed(1)} M☉`, p1x + rad1 + 4, p1y - 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`m2 = ${m2.toFixed(1)} M☉`, p2x + rad2 + 4, p2y - 4);

        ctx.restore();

        // Divider
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, topH);
        ctx.lineTo(W, topH);
        ctx.stroke();

        // Bottom Section: Dual Polarization Strain Oscilloscope h+(t), hx(t)
        const scopeCy = topH + bottomH * 0.5;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scopeCy);
        ctx.lineTo(W, scopeCy);
        ctx.stroke();

        const hist = gw.history;
        if (hist.length > 2) {
          const dx = W / (gw.maxHistoryLength - 1);
          const strainYScale = (bottomH * 0.42) / (gw.peakStrain || 1e-21);

          // 1. h+ polarization (Cyan)
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          for (let i = 0; i < hist.length; i++) {
            const x = i * dx;
            const y = scopeCy - hist[i].hPlus * strainYScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // 2. hx polarization (Amber)
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < hist.length; i++) {
            const x = i * dx;
            const y = scopeCy - hist[i].hCross * strainYScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Oscilloscope HUD
        ctx.font = '11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('― h+(t) plus polarization', 16, topH + 20);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('― h×(t) cross polarization', 180, topH + 20);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`f_gw = ${gw.currentFreqHz.toFixed(1)} Hz`, W - 180, topH + 20);
        ctx.fillText(`Separation R = ${gw.currentSeparationM.toFixed(1)} M`, W - 180, topH + 36);
        ctx.fillText(gw.isMerged ? 'STATUS: QNM RINGDOWN' : 'STATUS: POST-NEWTONIAN', W - 180, topH + 52);
      }

      // ==========================================
      // MODE 4: SPACETIME CURVATURE EMBEDDING
      // ==========================================
      else if (suiteMode === 'SPACETIME_EMBEDDING') {
        const { elevation, azimuth } = camAngleRef.current;
        const elRad = (elevation * Math.PI) / 180.0;
        const azRad = (azimuth * Math.PI) / 180.0;
        const cosEl = Math.cos(elRad);
        const sinEl = Math.sin(elRad);
        const cosAz = Math.cos(azRad);
        const sinAz = Math.sin(azRad);

        // Flamm's Paraboloid Embedding:
        // z(r) = -2 * sqrt(2*M*(r - 2M))
        const M = 1.0;
        const rs = 2.0 * M;
        const scale = 16.0;

        // Project 3D point (X, Y, Z) to 2D isometric camera
        const project = (x3: number, y3: number, z3: number) => {
          const xRot = x3 * cosAz - y3 * sinAz;
          const yRot = x3 * sinAz + y3 * cosAz;
          const x2d = cx + xRot * scale;
          const y2d = cy + (yRot * cosEl - z3 * sinEl) * scale;
          return { x: x2d, y: y2d };
        };

        // 1. Concentric circles of Flamm's Paraboloid
        ctx.lineWidth = 1.0;
        for (let r = rs + 0.15; r <= 22.0; r += 1.6) {
          const zFunnel = -2.0 * Math.sqrt(2.0 * M * (r - rs));
          const tColor = (r - rs) / 20.0;
          ctx.strokeStyle = `rgba(99, 102, 241, ${Math.max(0.15, 0.8 - tColor * 0.6)})`;

          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.15) {
            const x3 = r * Math.cos(th);
            const y3 = r * Math.sin(th);
            const p = project(x3, y3, zFunnel);
            if (th === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }

        // 2. Radial meridians
        for (let th = 0; th < Math.PI * 2; th += Math.PI / 8) {
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.35)';
          ctx.beginPath();
          for (let r = rs + 0.15; r <= 22.0; r += 0.8) {
            const zFunnel = -2.0 * Math.sqrt(2.0 * M * (r - rs));
            const x3 = r * Math.cos(th);
            const y3 = r * Math.sin(th);
            const p = project(x3, y3, zFunnel);
            if (r === rs + 0.15) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }

        // 3. Throat boundary at horizon r = 2M
        const pThroat0 = project(rs * Math.cos(0), rs * Math.sin(0), 0);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pThroat0.x, pThroat0.y);
        for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.1) {
          const p = project(rs * Math.cos(th), rs * Math.sin(th), 0);
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();

        // 4. Geodesic particles descending down the curved funnel
        for (const p of geo.particles) {
          const r = Math.sqrt(p.x * p.x + p.y * p.y);
          const zFunnel = r >= rs ? -2.0 * Math.sqrt(2.0 * M * (r - rs)) : -6.0;
          const p2d = project(p.x, p.y, zFunnel);

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p2d.x, p2d.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.font = '11px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Flamm’s Paraboloid: z(r) = 2√(2M(r - 2M))', 16, 26);
        ctx.fillText(`Camera Elevation: ${elevation.toFixed(0)}° | Azimuth: ${azimuth.toFixed(0)}° (Drag to rotate)`, 16, 42);
      }

      // 6. Sonification Telemetry Push
      onAudioUpdate(
        suiteMode,
        gw.currentFreqHz,
        gw.peakStrain,
        gw.isMerged,
        closestR,
        geodesicParams.spinA,
        rayTracer.maxDopplerBoost
      );

      // 7. General Telemetry Throttled to ~12 Hz to protect React main thread
      if (timestamp - lastTelemetryTimeRef.current >= 80) {
        lastTelemetryTimeRef.current = timestamp;
        const a = geodesicParams.spinA;
        const M = 1.0;
        const rPlus = M + Math.sqrt(Math.max(0.001, M * M - a * a));
        const redshiftZ = 1.0 / Math.max(0.01, Math.sqrt(Math.max(0.01, 1.0 - (2.0 * M) / Math.max(2.1, closestR)))) - 1.0;

        onTelemetry({
          schwarzschildRadiusRs: 2.0,
          eventHorizonRadiusRplus: rPlus,
          photonSphereRadiusRph: geo.rPhotonSphere,
          iscoRadius: geo.rIsco,
          ergosphereOuterRadius: 2.0,
          frameDraggingOmegaMax: (2.0 * M * Math.abs(a)) / Math.pow(rPlus, 3.0),
          gravitationalRedshiftZ: redshiftZ,
          gwChirpMassMsun: gw.chirpMassMsun,
          gwStrainPeak: gw.peakStrain,
          gwFrequencyHz: gw.currentFreqHz,
          simFps: fpsRef.current,
          simStepCount: stepCountRef.current,
        });
      }
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    suiteMode,
    colormapMode,
    geodesicParams,
    lensingParams,
    gwParams,
    isPaused,
    onTelemetry,
    onAudioUpdate,
    onUpdateGeodesic,
    onUpdateLensing,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        width={720}
        height={540}
        className="w-full h-full object-contain cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
