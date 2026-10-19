import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { OrbitalCanvas } from './components/OrbitalCanvas';
import { FlightComputerDeck } from './components/FlightComputerDeck';
import { TelemetryHUD } from './components/TelemetryHUD';
import { CelestialBodyInspector } from './components/CelestialBodyInspector';
import { EphemerisExportModal } from './components/EphemerisExportModal';
import { CURATED_SCENARIOS } from './scenarios/curatedScenarios';
import { NBodyPhysicsEngine, TrajectoryPoint } from './physics/NBodyPhysicsEngine';
import { SpaceSonificationEngine } from './audio/SpaceSonificationEngine';
import { calculateOrbitalElements, Vec2 } from './physics/OrbitalMath';
import {
  CelestialBody,
  ManeuverNode,
  CameraTrackingMode,
  ScenarioPreset,
  EphemerisDataPoint,
  OrbitalElements,
} from './types';
import { Orbit, Compass, Eye, Layers } from 'lucide-react';

export const App: React.FC = () => {
  // Scenarios and Physics state
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>(CURATED_SCENARIOS[0]);
  const [bodies, setBodies] = useState<CelestialBody[]>(CURATED_SCENARIOS[0].initialBodies);
  const [maneuverNodes, setManeuverNodes] = useState<ManeuverNode[]>(
    CURATED_SCENARIOS[0].initialManeuverNodes || []
  );

  // Time and Simulation state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeScale, setTimeScale] = useState<number>(CURATED_SCENARIOS[0].initialTimeScale || 25);
  const [simulationTime, setSimulationTime] = useState<number>(0);
  const [energyDriftPercent, setEnergyDriftPercent] = useState<number>(0);

  // Physics Toggles
  const [enableRelativity, setEnableRelativity] = useState<boolean>(false);
  const [enableAtmosphericDrag, setEnableAtmosphericDrag] = useState<boolean>(true);

  // Camera & Tracking
  const [trackedBodyId, setTrackedBodyId] = useState<string | undefined>(
    CURATED_SCENARIOS[0].defaultTrackedId
  );
  const [referenceBodyId, setReferenceBodyId] = useState<string | undefined>(
    CURATED_SCENARIOS[0].defaultReferenceId
  );
  const [cameraMode, setCameraMode] = useState<CameraTrackingMode>('BODY_CENTERED');

  // Visualization overlays
  const [showLagrangePoints, setShowLagrangePoints] = useState<boolean>(true);
  const [showSoiCircles, setShowSoiCircles] = useState<boolean>(true);

  // Trajectory & Telemetry
  const [predictedTrajectory, setPredictedTrajectory] = useState<TrajectoryPoint[]>([]);
  const [orbitalElements, setOrbitalElements] = useState<OrbitalElements | null>(null);
  const [ephemerisLog, setEphemerisLog] = useState<EphemerisDataPoint[]>([]);
  const [isEngineBurning, setIsEngineBurning] = useState<boolean>(false);

  // Modals
  const [isAddBodyOpen, setIsAddBodyOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Audio Engine & Mute
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioEngineRef = useRef<SpaceSonificationEngine | null>(null);
  const physicsEngineRef = useRef<NBodyPhysicsEngine | null>(null);

  // Initialize Engines
  useEffect(() => {
    audioEngineRef.current = new SpaceSonificationEngine();

    const physics = new NBodyPhysicsEngine({
      G: currentScenario.gravitationalConstant,
      enableRelativity,
      enableAtmosphericDrag,
      enableTidalDisruption: true,
      softeningFactorKm: 15.0,
    });

    physics.onManeuverBurn = (_node, _deltaV) => {
      audioEngineRef.current?.playManeuverChime();
      setIsEngineBurning(true);
      setTimeout(() => setIsEngineBurning(false), 1200);
    };

    physics.onTidalDisruption = () => {
      audioEngineRef.current?.playTidalAlert();
    };

    physics.onAtmosphereEntry = () => {
      audioEngineRef.current?.playTidalAlert();
    };

    physics.setBodies(currentScenario.initialBodies);
    physics.setManeuverNodes(currentScenario.initialManeuverNodes || []);
    physicsEngineRef.current = physics;

    return () => {
      audioEngineRef.current?.destroy();
    };
  }, []);

  // Update physics config on toggle
  useEffect(() => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.config.enableRelativity = enableRelativity;
      physicsEngineRef.current.config.enableAtmosphericDrag = enableAtmosphericDrag;
      physicsEngineRef.current.config.G = currentScenario.gravitationalConstant;
    }
  }, [enableRelativity, enableAtmosphericDrag, currentScenario.gravitationalConstant]);

  // Load Scenario
  const handleSelectScenario = useCallback((scenario: ScenarioPreset) => {
    setCurrentScenario(scenario);
    setTimeScale(scenario.initialTimeScale || 25);
    setTrackedBodyId(scenario.defaultTrackedId);
    setReferenceBodyId(scenario.defaultReferenceId);
    setSimulationTime(0);
    setEphemerisLog([]);

    if (physicsEngineRef.current) {
      physicsEngineRef.current.config.G = scenario.gravitationalConstant;
      physicsEngineRef.current.simulationTime = 0;
      physicsEngineRef.current.setBodies(scenario.initialBodies);
      physicsEngineRef.current.setManeuverNodes(scenario.initialManeuverNodes || []);
      setBodies(physicsEngineRef.current.bodies);
      setManeuverNodes(physicsEngineRef.current.maneuverNodes);
    }
  }, []);

  const handleResetScenario = useCallback(() => {
    handleSelectScenario(currentScenario);
  }, [currentScenario, handleSelectScenario]);

  // Unlock Audio on First User Interaction
  const handleUserInteraction = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.init();
    }
  };

  const handleToggleMute = () => {
    if (audioEngineRef.current) {
      handleUserInteraction();
      const muted = audioEngineRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  // Find active primary body for tracked craft
  const activeCraft = bodies.find((b) => b.id === trackedBodyId) || null;
  const primaryBody =
    bodies.find((b) => b.id === referenceBodyId) ||
    bodies.find((b) => b.type === 'STAR' || b.type === 'PLANET') ||
    null;

  // Main Simulation Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCounter = 0;

    const loop = (now: number) => {
      const dtReal = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const engine = physicsEngineRef.current;
      if (engine && !isPaused) {
        // Step simulation using sub-stepping for stability under high warp
        const totalSimDt = dtReal * timeScale;
        const subSteps = Math.max(1, Math.min(25, Math.ceil(timeScale / 15)));
        const dtSub = totalSimDt / subSteps;

        for (let s = 0; s < subSteps; s++) {
          engine.step(dtSub);
        }

        frameCounter++;
        if (frameCounter % 2 === 0) {
          setSimulationTime(engine.simulationTime);
          setEnergyDriftPercent(engine.energyDriftPercent);
          setBodies([...engine.bodies]);
          setManeuverNodes([...engine.maneuverNodes]);
        }
        if (frameCounter % 6 === 0 && trackedBodyId) {
          const rollout = engine.predictTrajectory(trackedBodyId, Math.max(3600 * 2, timeScale * 120), 400);
          setPredictedTrajectory(rollout);

          // Calculate Keplerian Elements
          const craft = engine.bodies.find((b) => b.id === trackedBodyId);
          if (craft && primaryBody) {
            const elements = calculateOrbitalElements(craft, primaryBody, engine.config.G);
            setOrbitalElements(elements);

            // Modulate Audio Gravity Drone
            audioEngineRef.current?.updateGravityTone(
              elements.currentSpeedKmS,
              elements.altitudeKm,
              primaryBody.mass
            );

            // Log ephemeris
            if (frameCounter % 30 === 0) {
              setEphemerisLog((prev) => [
                ...prev.slice(-499),
                {
                  timestamp: engine.simulationTime,
                  bodyName: craft.name,
                  posX: craft.pos.x,
                  posY: craft.pos.y,
                  velX: craft.vel.x,
                  velY: craft.vel.y,
                  speedKmS: elements.currentSpeedKmS,
                  altitudeKm: elements.altitudeKm,
                  distanceToPrimaryKm: Vec2.dist(craft.pos, primaryBody.pos),
                },
              ]);
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, timeScale, trackedBodyId, referenceBodyId, primaryBody]);

  // Maneuver Node Handlers
  const handleAddManeuverNode = (node: ManeuverNode) => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.maneuverNodes.push(node);
      setManeuverNodes([...physicsEngineRef.current.maneuverNodes]);
    }
  };

  const handleUpdateManeuverNode = (updatedNode: ManeuverNode) => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.maneuverNodes = physicsEngineRef.current.maneuverNodes.map((n) =>
        n.id === updatedNode.id ? updatedNode : n
      );
      setManeuverNodes([...physicsEngineRef.current.maneuverNodes]);
    }
  };

  const handleDeleteManeuverNode = (nodeId: string) => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.maneuverNodes = physicsEngineRef.current.maneuverNodes.filter(
        (n) => n.id !== nodeId
      );
      setManeuverNodes([...physicsEngineRef.current.maneuverNodes]);
    }
  };

  const handleExecuteBurnManual = (nodeId: string) => {
    if (physicsEngineRef.current) {
      const node = physicsEngineRef.current.maneuverNodes.find((n) => n.id === nodeId);
      if (node) {
        node.timeSeconds = physicsEngineRef.current.simulationTime; // trigger immediately
      }
    }
  };

  const handleManualRcsPulse = (direction: 'PROGRADE' | 'RETROGRADE' | 'RADIAL_IN' | 'RADIAL_OUT') => {
    if (!activeCraft || !physicsEngineRef.current) return;
    const craft = physicsEngineRef.current.bodies.find((b) => b.id === activeCraft.id);
    if (!craft) return;

    audioEngineRef.current?.playRcsBurst();

    const speed = Vec2.mag(craft.vel);
    if (speed < 1e-6) return;

    const uPro = { x: craft.vel.x / speed, y: craft.vel.y / speed };
    const uRad = { x: -uPro.y, y: uPro.x };
    const dV = 0.02; // 20 m/s pulse

    if (direction === 'PROGRADE') {
      craft.vel.x += uPro.x * dV;
      craft.vel.y += uPro.y * dV;
    } else if (direction === 'RETROGRADE') {
      craft.vel.x -= uPro.x * dV;
      craft.vel.y -= uPro.y * dV;
    } else if (direction === 'RADIAL_IN') {
      craft.vel.x += uRad.x * dV;
      craft.vel.y += uRad.y * dV;
    } else if (direction === 'RADIAL_OUT') {
      craft.vel.x -= uRad.x * dV;
      craft.vel.y -= uRad.y * dV;
    }

    if (craft.fuelKg !== undefined) {
      craft.fuelKg = Math.max(0, craft.fuelKg - 1.5);
    }
    setBodies([...physicsEngineRef.current.bodies]);
  };

  const handleStepForward = () => {
    if (physicsEngineRef.current && isPaused) {
      physicsEngineRef.current.step(0.5 * timeScale);
      setSimulationTime(physicsEngineRef.current.simulationTime);
      setEnergyDriftPercent(physicsEngineRef.current.energyDriftPercent);
      setBodies([...physicsEngineRef.current.bodies]);
    }
  };

  const handleAddCustomBody = (newBody: CelestialBody) => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.bodies.push(newBody);
      setBodies([...physicsEngineRef.current.bodies]);
      setTrackedBodyId(newBody.id);
    }
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="flex flex-col w-screen h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Navigation & Mission Controls */}
      <Header
        scenarios={CURATED_SCENARIOS}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onStepForward={handleStepForward}
        timeScale={timeScale}
        onSetTimeScale={setTimeScale}
        onResetScenario={handleResetScenario}
        energyDriftPercent={energyDriftPercent}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        enableRelativity={enableRelativity}
        onToggleRelativity={() => setEnableRelativity(!enableRelativity)}
        enableAtmosphericDrag={enableAtmosphericDrag}
        onToggleAtmosphericDrag={() => setEnableAtmosphericDrag(!enableAtmosphericDrag)}
        onOpenAddBodyModal={() => setIsAddBodyOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* Main Workspace: Canvas + Sidebars */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* Central 2D Canvas */}
        <div className="flex-1 relative h-full">
          <OrbitalCanvas
            bodies={bodies}
            trackedBodyId={trackedBodyId}
            referenceBodyId={referenceBodyId}
            onSelectBody={(b) => setTrackedBodyId(b.id)}
            cameraMode={cameraMode}
            onSetCameraMode={setCameraMode}
            predictedTrajectory={predictedTrajectory}
            maneuverNodes={maneuverNodes}
            onUpdateManeuverNode={handleUpdateManeuverNode}
            showLagrangePoints={showLagrangePoints}
            showSoiCircles={showSoiCircles}
            isEngineBurning={isEngineBurning}
          />

          {/* Floating Telemetry HUD (Top Right) */}
          <div className="absolute top-3 right-4 w-72 max-w-[calc(100vw-2rem)] pointer-events-auto">
            <TelemetryHUD
              body={activeCraft}
              orbitalElements={orbitalElements}
              simulationTime={simulationTime}
            />
          </div>

          {/* Quick Layer Toggles (Bottom Left) */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setShowLagrangePoints(!showLagrangePoints)}
              className={`px-2 py-1 rounded font-mono text-[10px] transition-colors ${
                showLagrangePoints ? 'bg-purple-900/60 text-purple-300 border border-purple-500' : 'text-slate-400'
              }`}
            >
              L-POINTS
            </button>
            <button
              onClick={() => setShowSoiCircles(!showSoiCircles)}
              className={`px-2 py-1 rounded font-mono text-[10px] transition-colors ${
                showSoiCircles ? 'bg-sky-900/60 text-sky-300 border border-sky-500' : 'text-slate-400'
              }`}
            >
              SOI SPHERES
            </button>
          </div>
        </div>

        {/* Right Flight Computer Deck */}
        <div className="w-full md:w-80 h-64 md:h-full flex-shrink-0 z-10">
          <FlightComputerDeck
            activeCraft={activeCraft}
            bodies={bodies}
            primaryBody={primaryBody}
            maneuverNodes={maneuverNodes}
            onAddManeuverNode={handleAddManeuverNode}
            onUpdateManeuverNode={handleUpdateManeuverNode}
            onDeleteManeuverNode={handleDeleteManeuverNode}
            onExecuteBurnManual={handleExecuteBurnManual}
            onManualRcsPulse={handleManualRcsPulse}
            simulationTime={simulationTime}
            G={currentScenario.gravitationalConstant}
          />
        </div>
      </div>

      {/* Spawn Body Modal */}
      <CelestialBodyInspector
        isOpen={isAddBodyOpen}
        onClose={() => setIsAddBodyOpen(false)}
        onAddBody={handleAddCustomBody}
        primaryReferenceBody={primaryBody}
      />

      {/* Ephemeris Export Modal */}
      <EphemerisExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        bodies={bodies}
        ephemerisLog={ephemerisLog}
      />
    </div>
  );
};
