/**
 * POCKET-TERRARIUM (EXP-024) — Main Application Component
 * Aquatic Ecology, Vivarium & Micro-Ecology Studio
 */

import React, { useRef, useEffect, useState } from 'react';
import { TerrariumSimulationController } from './core/TerrariumSimulationController';
import { Header } from './components/Header';
import { TerrariumCanvas } from './components/TerrariumCanvas';
import { ControlDeck } from './components/ControlDeck';
import { WaterTestKitModal } from './components/WaterTestKitModal';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  const controllerRef = useRef<TerrariumSimulationController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new TerrariumSimulationController();
  }
  const controller = controllerRef.current;

  // React state sync via controller observer
  const [, setTick] = useState(0);
  const [isTestKitOpen, setIsTestKitOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    controller.attachEventListeners();
    const unsubscribe = controller.subscribe(() => {
      setTick((t) => (t + 1) % 1000000);
    });
    return () => {
      unsubscribe();
    };
  }, [controller]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTestKitOpen || isExportOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        controller.undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        controller.redo();
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          controller.togglePause();
          break;
        case 'b':
          controller.toggleBubbler();
          break;
        case 'l':
          controller.toggleLamp();
          break;
        case 'c':
          controller.performWaterChange(20);
          break;
        case '1':
          controller.setTool('OBSERVE');
          break;
        case '2':
          controller.setTool('FEED');
          break;
        case '3':
          controller.setTool('ADD_PLANT');
          break;
        case '4':
          controller.setTool('ADD_FISH');
          break;
        case '5':
          controller.setTool('ADD_SNAIL');
          break;
        case '6':
          controller.setTool('ADD_DAPHNIA');
          break;
        case '7':
          controller.setTool('ADD_BACTERIA');
          break;
        case '8':
          controller.setTool('SCRUB_GLASS');
          break;
        case '9':
          controller.setTool('NET_FISH');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controller, isTestKitOpen, isExportOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* Top Header & Water Telemetry */}
      <Header
        controller={controller}
        onOpenTestKit={() => setIsTestKitOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main 60 FPS HTML5 Aquatic Canvas Viewport */}
      <main className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center bg-black">
        <TerrariumCanvas controller={controller} />
      </main>

      {/* Bottom Tool Deck & Intervention Controls */}
      <ControlDeck controller={controller} />

      {/* Bottom Keyboard Guide / Status Bar */}
      <footer className="h-7 border-t border-slate-900 bg-slate-950 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 z-10">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Space</kbd> Pause</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Click</kbd> Apply Tool</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">B</kbd> Bubbler</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">L</kbd> Lamp</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">C</kbd> 20% Water</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">1-9</kbd> Tools</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <span>RK4 Chemistry</span>
          <span>•</span>
          <span>Diurnal Photosynthesis</span>
          <span>•</span>
          <span className="text-emerald-500/80">WBE EXP-024</span>
        </div>
      </footer>

      {/* Master Water Testing Kit Modal */}
      <WaterTestKitModal
        controller={controller}
        isOpen={isTestKitOpen}
        onClose={() => setIsTestKitOpen(false)}
      />

      {/* State & Telemetry Export Modal */}
      <DataExportModal
        controller={controller}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
