/**
 * ORBITAL-SLINGSHOT (EXP-025) — Main Application Component
 * Astrodynamical Trajectory & Gravity Assist Puzzle Studio
 */

import React, { useRef, useEffect, useState } from 'react';
import { OrbitalSimulationController } from './core/OrbitalSimulationController';
import { Header } from './components/Header';
import { OrbitalCanvas } from './components/OrbitalCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MissionBriefingModal } from './components/MissionBriefingModal';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  const controllerRef = useRef<OrbitalSimulationController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new OrbitalSimulationController();
  }
  const controller = controllerRef.current;

  // React state sync via controller observer
  const [, setTick] = useState(0);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    controller.attachEventListeners();
    controller.startLoop();
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
      if (isBriefingOpen || isExportOpen) return;

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
        case '1':
          controller.setTimeWarp(1);
          break;
        case '2':
          controller.setTimeWarp(5);
          break;
        case '3':
          controller.setTimeWarp(25);
          break;
        case '4':
          controller.setTimeWarp(100);
          break;
        case '5':
          controller.setTimeWarp(500);
          break;
        case 'm':
          controller.audio.toggleMute();
          break;
        case 'r':
          controller.resetCurrentScenario();
          break;
        case 'b':
          setIsBriefingOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controller, isBriefingOpen, isExportOpen]);

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        controller={controller}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
      />

      {/* Main Interactive Celestial Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <OrbitalCanvas controller={controller} />
      </main>

      {/* Bottom Flight Deck & Maneuver Planner */}
      <ControlDeck controller={controller} />

      {/* Footer System Status Bar */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-1 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Symplectic Velocity Verlet (Order 2)
          </span>
          <span>•</span>
          <span>N-Body Newtonian Gravity & Conic Invariants</span>
          <span>•</span>
          <span>Laplace SOI Boundary Patching</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Shortcuts: Space=Pause | 1-5=Warp | B=Briefing | Ctrl+Z=Undo</span>
          <span>•</span>
          <span className="text-slate-400 font-bold">WBE EXP-025</span>
        </div>
      </footer>

      {/* Modals */}
      <MissionBriefingModal
        controller={controller}
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />
      <DataExportModal
        controller={controller}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
