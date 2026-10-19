/**
 * POWDER-BOX (EXP-022) — High-Performance 60 FPS HTML5 Canvas Visualizer
 * Directly renders cellular automata grid via typed array pixel buffers.
 * Features:
 * - Direct ImageData manipulation with packed ABGR 32-bit pixel writes
 * - Pixelated crisp scaling (240x150 discrete grid mapped to responsive viewport)
 * - Interactive pointer painting with circular brush radius indicator
 * - Stable continuous RAF physics and render loop with zero observer churn
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { PowderSimulationController } from '../core/PowderSimulationController';

interface SandboxCanvasProps {
  controller: PowderSimulationController;
}

export const SandboxCanvas: React.FC<SandboxCanvasProps> = ({ controller }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Offscreen buffer and ImageData
  const imageDataRef = useRef<ImageData | null>(null);

  // Interaction pointers stored in refs to avoid React re-render thrashing
  const isPointerDownRef = useRef<boolean>(false);
  const pointerGridPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize or re-allocate ImageData matching simulation grid
  const getImageData = useCallback(() => {
    const { width, height } = controller.engine;
    if (!imageDataRef.current || imageDataRef.current.width !== width || imageDataRef.current.height !== height) {
      imageDataRef.current = new ImageData(width, height);
    }
    return imageDataRef.current;
  }, [controller.engine]);

  // Main Render Pipeline
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = getImageData();
    controller.engine.renderToImageData(imgData, controller.showThermalView);

    // Draw pixel buffer to grid canvas
    ctx.putImageData(imgData, 0, 0);

    // Draw overlay brush ring on overlay canvas
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const oCtx = overlay.getContext('2d');
      if (oCtx) {
        oCtx.clearRect(0, 0, overlay.width, overlay.height);

        const p = pointerGridPosRef.current;
        if (p) {
          const scaleX = overlay.width / controller.engine.width;
          const scaleY = overlay.height / controller.engine.height;
          const cx = (p.x + 0.5) * scaleX;
          const cy = (p.y + 0.5) * scaleY;
          const rPix = controller.brushRadius * scaleX;

          oCtx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          oCtx.lineWidth = 1.5;
          oCtx.beginPath();
          oCtx.arc(cx, cy, rPix, 0, Math.PI * 2);
          oCtx.stroke();

          // Center crosshair dot
          oCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          oCtx.beginPath();
          oCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
          oCtx.fill();
        }
      }
    }
  }, [controller, getImageData]);

  const renderRef = useRef(renderCanvas);
  renderRef.current = renderCanvas;

  // Convert Client Screen (X, Y) to Discrete Grid (X, Y)
  const clientToGrid = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const rx = (clientX - rect.left) / rect.width;
    const ry = (clientY - rect.top) / rect.height;

    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return null;

    const gx = Math.floor(rx * controller.engine.width);
    const gy = Math.floor(ry * controller.engine.height);
    return {
      x: Math.max(0, Math.min(controller.engine.width - 1, gx)),
      y: Math.max(0, Math.min(controller.engine.height - 1, gy)),
    };
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    const pos = clientToGrid(e.clientX, e.clientY);
    if (pos) {
      pointerGridPosRef.current = pos;
      controller.applyBrush(pos.x, pos.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const pos = clientToGrid(e.clientX, e.clientY);
    pointerGridPosRef.current = pos;

    if (isPointerDownRef.current && pos) {
      controller.applyBrush(pos.x, pos.y);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handlePointerLeave = () => {
    isPointerDownRef.current = false;
    pointerGridPosRef.current = null;
  };

  // ResizeObserver for overlay canvas matching canvas element dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas || !overlay) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const rect = entry.contentRect;
      overlay.width = Math.floor(rect.width);
      overlay.height = Math.floor(rect.height);
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Main 60 FPS Physics & Render Loop (continuous and uninterrupted)
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
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none bg-black flex items-center justify-center p-2"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* Aspect-Ratio Stage matching discrete lattice 240:150 */}
      <div className="relative aspect-[240/150] w-full max-h-full flex items-center justify-center shadow-2xl border border-slate-800 rounded overflow-hidden">
        {/* Primary Simulation Canvas (Pixelated native grid resolution) */}
        <canvas
          ref={canvasRef}
          width={controller.engine.width}
          height={controller.engine.height}
          className="w-full h-full block"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* High-DPI Vector Overlay for Brush Ring and Inspection Crosshairs */}
        <canvas ref={overlayCanvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
      </div>
    </div>
  );
};
