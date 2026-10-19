/**
 * PONTIFEX (EXP-021) — Main Application Component
 * 2D Truss Physics, Structural Mechanics & Bridge Builder Game
 */

import React, { useRef, useEffect, useState } from 'react';
import { BridgeSimulationController } from './core/BridgeSimulationController';
import { Header } from './components/Header';
import { BridgeControlDeck } from './components/BridgeControlDeck';
import { BridgeCanvas } from './components/BridgeCanvas';
import { DataExportModal } from './components/DataExportModal';
import { BRIDGE_LEVELS } from './physics/LevelDefinitions';

export const App: React.FC = () => {
  const controllerRef = useRef<BridgeSimulationController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new BridgeSimulationController();
  }
  const controller = controllerRef.current;

  // Sync state from single-owner controller
  const [, setTick] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = controller.subscribe(() => {
      setTick((t) => (t + 1) % 1000000);
    });
    return () => {
      unsubscribe();
      controller.dispose();
    };
  }, [controller]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when export modal is open
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

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (controller.mode === 'BUILD') {
            controller.startSimulation();
          } else {
            controller.stopSimulation();
          }
          break;
        case 'g':
        case 'G':
          controller.toggleGridSnapping();
          break;
        case '1':
          controller.setTool('ROAD');
          break;
        case '2':
          controller.setTool('WOOD');
          break;
        case '3':
          controller.setTool('STEEL');
          break;
        case '4':
          controller.setTool('CABLE');
          break;
        case '5':
          controller.setTool('HYDRAULIC');
          break;
        case 'd':
        case 'D':
        case 'Backspace':
          controller.setTool('DELETE');
          break;
        case 'Escape':
          controller.setTool('SELECT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controller, isExportOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navigation & Level Header */}
      <Header
        currentLevel={controller.currentLevel}
        levelIndex={controller.currentLevelIndex}
        totalLevels={BRIDGE_LEVELS.length}
        metrics={controller.metrics}
        isMuted={isMuted}
        fps={controller.measuredFps}
        onSelectLevel={(idx) => controller.loadLevel(idx)}
        onResetLevel={() => controller.loadLevel(controller.currentLevelIndex)}
        onToggleMute={() => {
          const muted = controller.audio.toggleMute();
          setIsMuted(muted);
        }}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Bridge Physics & CAD Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        <BridgeCanvas controller={controller} />
      </div>

      {/* Bottom Material Palette & Control Deck */}
      <BridgeControlDeck
        mode={controller.mode}
        activeTool={controller.activeTool}
        isGridSnapping={controller.isGridSnapping}
        simSpeed={controller.simSpeed}
        allowedMaterials={controller.currentLevel.allowedMaterials}
        metrics={controller.metrics}
        onStartSimulation={() => controller.startSimulation()}
        onStopSimulation={() => controller.stopSimulation()}
        onSetTool={(tool) => controller.setTool(tool)}
        onToggleGrid={() => controller.toggleGridSnapping()}
        onSetSpeed={(speed) => controller.setSimSpeed(speed)}
        onUndo={() => controller.undo()}
        onRedo={() => controller.redo()}
        onClearBridge={() => controller.clearBridge()}
      />

      {/* Bridge Telemetry Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        controller={controller}
      />
    </div>
  );
};
