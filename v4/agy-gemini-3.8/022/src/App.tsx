/**
 * POWDER-BOX (EXP-022) — Main Application Component
 * Granular Materials, Multi-Phase Fluids, Thermodynamics & Cellular Automata
 */

import React, { useRef, useEffect, useState } from 'react';
import { PowderSimulationController } from './core/PowderSimulationController';
import { Header } from './components/Header';
import { SandboxCanvas } from './components/SandboxCanvas';
import { SandboxPalette } from './components/SandboxPalette';
import { DataExportModal } from './components/DataExportModal';
import { ElementType } from './types';

export const App: React.FC = () => {
  const controllerRef = useRef<PowderSimulationController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new PowderSimulationController();
  }
  const controller = controllerRef.current;

  // React state sync via controller observer
  const [, setTick] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = controller.subscribe(() => {
      setTick((t) => (t + 1) % 1000000);
    });
    return () => {
      unsubscribe();
      controller.dispose();
    };
  }, [controller]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExportOpen) return;

      // Ignore if typing inside input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          controller.togglePause();
          break;
        case 'c':
          controller.clear();
          break;
        case 't':
          controller.toggleThermalView();
          break;
        case 'm':
          controller.audio.toggleMute();
          break;
        case 'e':
          controller.setTool('ERASER');
          break;
        case 'h':
          controller.setTool('HEAT_BRUSH');
          break;
        case 'k':
          controller.setTool('COOL_BRUSH');
          break;
        case 's':
          controller.setTool('SPARK');
          break;
        case '[':
          controller.setBrushRadius(Math.max(1, controller.brushRadius - 1));
          break;
        case ']':
          controller.setBrushRadius(Math.min(15, controller.brushRadius + 1));
          break;
        // Numeric Quick Element Selection
        case '1':
          controller.setTool('SAND');
          break;
        case '2':
          controller.setTool('WATER');
          break;
        case '3':
          controller.setTool('FIRE');
          break;
        case '4':
          controller.setTool('WOOD');
          break;
        case '5':
          controller.setTool('STONE');
          break;
        case '6':
          controller.setTool('OIL');
          break;
        case '7':
          controller.setTool('ACID');
          break;
        case '8':
          controller.setTool('GUNPOWDER');
          break;
        case '9':
          controller.setTool('LAVA');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controller, isExportOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* Top Telemetry Header */}
      <Header
        controller={controller}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Central Cellular Automata Viewport */}
      <main className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center bg-black">
        <SandboxCanvas controller={controller} />
      </main>

      {/* Bottom Control and Element Palette Deck */}
      <SandboxPalette controller={controller} />

      {/* Bottom Keyboard Guide / Status Bar */}
      <footer className="h-7 border-t border-slate-900 bg-slate-950 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 z-10">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Space</kbd> Pause</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">T</kbd> Thermal</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">C</kbd> Clear</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">[ / ]</kbd> Brush Radius</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">1-9</kbd> Quick Elements</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <span>240×150 Grid</span>
          <span>•</span>
          <span>36,000 Cells</span>
          <span>•</span>
          <span className="text-amber-500/80">WBE EXP-022</span>
        </div>
      </footer>

      {/* State & Telemetry Export Modal */}
      <DataExportModal
        controller={controller}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
