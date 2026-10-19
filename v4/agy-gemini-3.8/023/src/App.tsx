/**
 * MARBLE-FORGE (EXP-023) — Main Application Component
 * 2D Kinetic Mechanics, Rolling Physics & Rube Goldberg Studio
 */

import React, { useRef, useEffect, useState } from 'react';
import { MarbleSimulationController } from './core/MarbleSimulationController';
import { Header } from './components/Header';
import { MarbleCanvas } from './components/MarbleCanvas';
import { ControlDeck } from './components/ControlDeck';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  const controllerRef = useRef<MarbleSimulationController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new MarbleSimulationController();
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
        case 'r':
          controller.resetContraption();
          break;
        case 'c':
          controller.clearContraption();
          break;
        case 'm':
          controller.audio.toggleMute();
          break;
        case 's':
          controller.setTool('SELECT');
          break;
        case 'w':
          controller.setTool('STRAIGHT_RAIL');
          break;
        case 'b':
          controller.setTool('BUMPER');
          break;
        case 't':
          controller.setTool('TARGET_BELL');
          break;
        case 'd':
          controller.setTool('DELETE');
          break;
        case '1':
          controller.setMaterial('GLASS');
          break;
        case '2':
          controller.setMaterial('STEEL');
          break;
        case '3':
          controller.setMaterial('WOOD');
          break;
        case '4':
          controller.setMaterial('RUBBER');
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

      {/* Main Interactive Viewport */}
      <main className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center bg-black">
        <MarbleCanvas controller={controller} />
      </main>

      {/* Bottom Tool Deck & Construction Controls */}
      <ControlDeck controller={controller} />

      {/* Bottom Keyboard Guide / Status Bar */}
      <footer className="h-7 border-t border-slate-900 bg-slate-950 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 z-10">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Space</kbd> Pause</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Click</kbd> Drop Marble</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">W</kbd> Rail</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">B</kbd> Bumper</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">T</kbd> Bell</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">1-4</kbd> Material</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">R</kbd> Reset</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <span>Symplectic Verlet</span>
          <span>•</span>
          <span>12m × 8m World</span>
          <span>•</span>
          <span className="text-amber-500/80">WBE EXP-023</span>
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
