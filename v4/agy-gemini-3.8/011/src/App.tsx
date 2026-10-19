import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { WindTunnelCanvas } from './components/WindTunnelCanvas';
import { AerodynamicsDeck } from './components/AerodynamicsDeck';
import { FlightSimulatorHUD } from './components/FlightSimulatorHUD';
import { DataExportModal } from './components/DataExportModal';
import { LatticeBoltzmannSolver } from './lbm/LatticeBoltzmannSolver';
import { AeroSonificationEngine } from './audio/AeroSonificationEngine';
import {
  AIRFOIL_PRESETS,
  rasterizeObstacleToGrid,
} from './airfoils/AirfoilGenerator';
import {
  AirfoilProfile,
  AeroMetrics,
  VisualizationMode,
  ChordPressurePoint,
  PolarPoint,
  GliderState,
} from './types';

export const App: React.FC = () => {
  // LBM Solver & Audio Engine Refs
  const solverRef = useRef<LatticeBoltzmannSolver>(new LatticeBoltzmannSolver(220, 90));
  const audioEngineRef = useRef<AeroSonificationEngine>(new AeroSonificationEngine());

  // Airfoil & Flow State
  const [presets, setPresets] = useState<AirfoilProfile[]>(AIRFOIL_PRESETS);
  const [currentProfile, setCurrentProfile] = useState<AirfoilProfile>(AIRFOIL_PRESETS[0]);
  const [angleDeg, setAngleDeg] = useState<number>(4);
  const [obstacleOrigin, setObstacleOrigin] = useState<{ x: number; y: number }>({ x: 65, y: 45 });

  const [inletVelocity, setInletVelocity] = useState<number>(0.08);
  const [viscosity, setViscosity] = useState<number>(0.02);

  // Visualization & Tool Modes
  const [visMode, setVisMode] = useState<VisualizationMode>('VELOCITY');
  const [brushMode, setBrushMode] = useState<'NONE' | 'DRAW' | 'ERASE'>('NONE');
  const [brushRadius, setBrushRadius] = useState<number>(4);

  // Flight Simulation Mode (Glider)
  const [isFlightMode, setIsFlightMode] = useState<boolean>(false);
  const [gliderState, setGliderState] = useState<GliderState>({
    x: 65,
    y: 45,
    vx: 0.08,
    vy: 0.0,
    pitchDeg: 4,
    altitude: 1200,
    airspeed: 45,
    cl: 0.45,
    cd: 0.04,
    energy: 100,
    stalled: false,
    score: 0,
  });

  // Telemetry & Plots
  const [metrics, setMetrics] = useState<AeroMetrics>(solverRef.current.metrics);
  const [chordPressure, setChordPressure] = useState<ChordPressurePoint[]>([]);
  const [polarHistory, setPolarHistory] = useState<PolarPoint[]>([]);

  // Modals & Controls
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [smokeTrigger, setSmokeTrigger] = useState<number>(0);

  // Audio engine unmount cleanup
  useEffect(() => {
    return () => {
      audioEngineRef.current.destroy();
    };
  }, []);

  // Rasterize obstacle whenever profile, angle, or position changes
  const updateObstacleGeometry = useCallback(
    (profile: AirfoilProfile, angle: number, origin: { x: number; y: number }) => {
      const solver = solverRef.current;
      const mask = rasterizeObstacleToGrid(
        profile,
        angle,
        solver.nx,
        solver.ny,
        origin.x,
        origin.y
      );
      solver.setSolidMask(mask);
    },
    []
  );

  // Initial obstacle setup
  useEffect(() => {
    updateObstacleGeometry(currentProfile, angleDeg, obstacleOrigin);
  }, [currentProfile, angleDeg, obstacleOrigin, updateObstacleGeometry]);

  // Audio gesture initialization
  const handleUserGesture = useCallback(() => {
    audioEngineRef.current.init();
  }, []);

  // Preset Selection
  const handleSelectProfile = (profile: AirfoilProfile) => {
    handleUserGesture();
    setCurrentProfile(profile);
    audioEngineRef.current.playPresetTransitionChime();
    updateObstacleGeometry(profile, angleDeg, obstacleOrigin);
  };

  // Angle of attack change
  const handleSetAngleDeg = (newAngle: number) => {
    handleUserGesture();
    setAngleDeg(newAngle);
    updateObstacleGeometry(currentProfile, newAngle, obstacleOrigin);
  };

  // Inlet Velocity change
  const handleSetInletVelocity = (v: number) => {
    setInletVelocity(v);
    solverRef.current.setInletVelocity(v);
  };

  // Viscosity change
  const handleSetViscosity = (nu: number) => {
    setViscosity(nu);
    solverRef.current.setViscosity(nu);
  };

  // NACA Airfoil Parametric Tuning
  const handleUpdateProfileParams = (camber: number, pos: number, thick: number) => {
    const updated: AirfoilProfile = {
      ...currentProfile,
      camber,
      camberPos: pos,
      thickness: thick,
      name: `Custom NACA (${(camber * 100).toFixed(0)}${(pos * 10).toFixed(0)}${(thick * 100).toFixed(0)})`,
    };
    setCurrentProfile(updated);
    updateObstacleGeometry(updated, angleDeg, obstacleOrigin);
  };

  // Reset fluid field
  const handleResetField = () => {
    handleUserGesture();
    solverRef.current.resetField(inletVelocity, viscosity);
    updateObstacleGeometry(currentProfile, angleDeg, obstacleOrigin);
  };

  // Emit Smoke Burst
  const handleEmitSmokePuff = () => {
    handleUserGesture();
    setSmokeTrigger((prev) => prev + 1);
    audioEngineRef.current.playSmokeBurst();
  };

  // Paint obstacle brush
  const handlePaintObstacle = (x: number, y: number, r: number, isSolid: boolean) => {
    solverRef.current.paintObstacle(x, y, r, isSolid);
  };

  // Clear custom obstacles
  const handleClearObstacles = () => {
    updateObstacleGeometry(currentProfile, angleDeg, obstacleOrigin);
  };

  // Telemetry Polling & Audio Modulation Loop (every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const solver = solverRef.current;
      const m = { ...solver.metrics, angleDeg, angleRad: (angleDeg * Math.PI) / 180 };
      setMetrics(m);

      // Audio engine update
      audioEngineRef.current.updateTelemetry(
        m.maxVelocity,
        m.strouhalFreq,
        m.dragCoeff,
        m.isStalled
      );

      // Sample Chord Pressure along rotated chord axis
      const pSamples = solver.sampleChordPressure(
        obstacleOrigin.x,
        obstacleOrigin.y,
        currentProfile.chordLength,
        angleDeg
      );
      setChordPressure(pSamples);

      // Record polar point
      setPolarHistory((prev) => {
        const existingIdx = prev.findIndex((p) => p.alphaDeg === angleDeg);
        const newPt: PolarPoint = {
          alphaDeg: angleDeg,
          cl: m.liftCoeff,
          cd: m.dragCoeff,
          ld: m.liftToDragRatio,
        };
        if (existingIdx >= 0) {
          const copy = [...prev];
          copy[existingIdx] = newPt;
          return copy;
        }
        return [...prev, newPt].slice(-40);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [angleDeg, obstacleOrigin, currentProfile]);

  // Flight Test Simulator Dynamics Loop with Active LBM Coupling
  useEffect(() => {
    if (!isFlightMode) return;

    const flightInterval = setInterval(() => {
      setGliderState((prev) => {
        const m = solverRef.current.metrics;
        const isStall = Math.abs(prev.pitchDeg) > 16.0;

        // Aerodynamic Lift & Drag forces
        const dynQ = 0.5 * 1.0 * prev.vx * prev.vx;
        const currentCl = isStall ? 0.2 : Math.max(0.05, m.liftCoeff);
        const currentCd = isStall ? 0.9 : Math.max(0.02, m.dragCoeff);
        const lift = currentCl * dynQ * 28.0;
        const drag = currentCd * dynQ * 28.0;
        const gravity = 0.085;

        // Accelerations
        const ax = -drag * 0.015;
        const ay = (lift - gravity) * 0.015;

        const newVx = Math.max(0.03, Math.min(0.22, prev.vx + ax));
        const newVy = prev.vy + ay;

        // Translational positions
        const newX = Math.max(30, Math.min(180, prev.x + (newVx - 0.08) * 15));
        const newY = Math.max(12, Math.min(78, prev.y - newVy * 12));
        const newAlt = Math.max(0, prev.altitude + newVy * 30);
        const newScore = prev.score + (isStall ? 0 : 1);

        // Keep CFD obstacle mask synchronized with glider position and pitch
        updateObstacleGeometry(currentProfile, prev.pitchDeg, {
          x: Math.round(newX),
          y: Math.round(newY),
        });

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          pitchDeg: prev.pitchDeg,
          airspeed: newVx * 600,
          altitude: newAlt,
          cl: currentCl,
          cd: currentCd,
          stalled: isStall,
          score: newScore,
        };
      });
    }, 50);

    return () => clearInterval(flightInterval);
  }, [isFlightMode, currentProfile, updateObstacleGeometry]);

  // Keyboard navigation for flight controls and angle adjustments
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFlightMode) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          // Pitch down (dive)
          setGliderState((prev) => ({ ...prev, pitchDeg: Math.max(-20, prev.pitchDeg - 2) }));
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          // Pitch up (climb)
          setGliderState((prev) => ({ ...prev, pitchDeg: Math.min(25, prev.pitchDeg + 2) }));
        }
      } else {
        if (e.key === 'ArrowUp') {
          setAngleDeg((prev) => Math.min(25, prev + 1));
        } else if (e.key === 'ArrowDown') {
          setAngleDeg((prev) => Math.max(-25, prev - 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlightMode]);

  return (
    <div
      onClick={handleUserGesture}
      className="flex flex-col w-screen h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Navigation Header */}
      <Header
        presets={presets}
        currentProfile={currentProfile}
        onSelectProfile={handleSelectProfile}
        metrics={metrics}
        visMode={visMode}
        onSelectVisMode={setVisMode}
        isFlightMode={isFlightMode}
        onToggleFlightMode={() => {
          handleUserGesture();
          setIsFlightMode(!isFlightMode);
        }}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onResetField={handleResetField}
        onEmitSmokePuff={handleEmitSmokePuff}
        isMuted={isMuted}
        onToggleMute={() => {
          handleUserGesture();
          const muted = audioEngineRef.current.toggleMute();
          setIsMuted(muted);
        }}
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* Main Wind Tunnel Visualizer Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <WindTunnelCanvas
          solver={solverRef.current}
          isPaused={isPaused}
          visMode={visMode}
          smokeTrigger={smokeTrigger}
          currentProfile={currentProfile}
          angleDeg={isFlightMode ? gliderState.pitchDeg : angleDeg}
          onSetAngleDeg={handleSetAngleDeg}
          obstacleOrigin={isFlightMode ? { x: Math.round(gliderState.x), y: Math.round(gliderState.y) } : obstacleOrigin}
          onSetObstacleOrigin={setObstacleOrigin}
          isFlightMode={isFlightMode}
          brushMode={brushMode}
          brushRadius={brushRadius}
          onPaintObstacle={handlePaintObstacle}
          gliderState={gliderState}
          onUpdateGlider={setGliderState}
        />

        {/* Flight Simulator HUD Overlay */}
        {isFlightMode && (
          <FlightSimulatorHUD
            gliderState={gliderState}
            onPitchUp={() => setGliderState((prev) => ({ ...prev, pitchDeg: Math.min(25, prev.pitchDeg + 2) }))}
            onPitchDown={() => setGliderState((prev) => ({ ...prev, pitchDeg: Math.max(-20, prev.pitchDeg - 2) }))}
            onExitFlightMode={() => setIsFlightMode(false)}
          />
        )}
      </div>

      {/* Bottom Aerodynamics Controls Deck */}
      <AerodynamicsDeck
        currentProfile={currentProfile}
        metrics={metrics}
        angleDeg={angleDeg}
        onSetAngleDeg={handleSetAngleDeg}
        inletVelocity={inletVelocity}
        onSetInletVelocity={handleSetInletVelocity}
        viscosity={viscosity}
        onSetViscosity={handleSetViscosity}
        onUpdateProfileParams={handleUpdateProfileParams}
        chordPressure={chordPressure}
        polarHistory={polarHistory}
        brushMode={brushMode}
        onSetBrushMode={setBrushMode}
        brushRadius={brushRadius}
        onSetBrushRadius={setBrushRadius}
        onClearObstacles={handleClearObstacles}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={currentProfile}
        metrics={metrics}
        chordPressure={chordPressure}
        polarHistory={polarHistory}
      />
    </div>
  );
};
