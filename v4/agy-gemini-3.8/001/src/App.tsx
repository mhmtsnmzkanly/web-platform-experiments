import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CosmosEngine, RESOURCE_CONFIG } from './engine/CosmosEngine';
import { spaceAudio } from './audio/SpaceAudioEngine';
import { PlayerShip, SpaceStation, ResourceType } from './types';
import { SpaceCanvas } from './components/SpaceCanvas';
import { RadarHUD } from './components/RadarHUD';
import { ShipStatusHUD } from './components/ShipStatusHUD';
import { StarportModal } from './components/StarportModal';
import { MobileFlightStick } from './components/MobileFlightStick';

const SAVE_KEY = 'void_infinity_savegame';

function saveGameToStorage(player: PlayerShip) {
  try {
    const data = {
      credits: player.credits,
      upgrades: player.upgrades,
      stats: player.stats,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {}
}

export function App() {
  const engine = useMemo(() => new CosmosEngine(), []);

  // UI state
  const [playerState, setPlayerState] = useState<PlayerShip>(engine.player);
  const [nearbyStation, setNearbyStation] = useState<SpaceStation | null>(null);
  const [isDocked, setIsDocked] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isDead, setIsDead] = useState<boolean>(false);

  // Restore saved player upgrades & credits on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (typeof data.credits === 'number') engine.player.credits = data.credits;
        if (data.upgrades) {
          engine.player.upgrades = data.upgrades;
          engine.player.cargoCapacity = 50 + (data.upgrades.cargoLevel - 1) * 35;
          engine.player.maxShield = 100 + (data.upgrades.shieldLevel - 1) * 25;
          engine.player.shield = engine.player.maxShield;
        }
        if (data.stats) engine.player.stats = { ...engine.player.stats, ...data.stats };
      }
    } catch {}
  }, [engine]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      spaceAudio.dispose();
    };
  }, []);

  // Window blur listener to prevent stuck inputs
  useEffect(() => {
    const onBlur = () => {
      engine.inputs.forward = false;
      engine.inputs.backward = false;
      engine.inputs.left = false;
      engine.inputs.right = false;
      engine.inputs.fire = false;
      engine.inputs.boost = false;
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [engine]);

  // Main simulation tick loop (with delta-time scaling and throttled React HUD updates)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let lastHudSync = 0;

    const tick = (now: number) => {
      const dtSec = (now - lastTime) / 1000;
      lastTime = now;

      if (!isDocked && !engine.player.isDead) {
        const events = engine.update(dtSec);

        // Audio Triggers
        if (events.playerFired) spaceAudio.playLaser();
        if (events.asteroidDestroyed) spaceAudio.playAsteroidExplode();
        if (events.enemyDestroyed) spaceAudio.playShipExplode();
        if (events.resourceCollected) spaceAudio.playResourcePickup();
        if (events.playerDied) {
          spaceAudio.playShipExplode();
          setIsDead(true);
        }

        // Engine sound modulation with speed
        const speedNorm = Math.min(1.0, Math.hypot(engine.player.vx, engine.player.vy) / 8.0);
        spaceAudio.updateEngineRumble(speedNorm);

        // Check station proximity
        const station = engine.getNearbyStation();
        setNearbyStation(station);
      } else {
        spaceAudio.updateEngineRumble(0);
      }

      // Throttled HUD state synchronization (~20Hz / 50ms) to prevent virtual DOM thrashing
      if (now - lastHudSync > 50) {
        lastHudSync = now;
        setPlayerState({ ...engine.player });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [engine, isDocked]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          engine.inputs.forward = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          engine.inputs.backward = true;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          engine.inputs.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          engine.inputs.right = true;
          break;
        case ' ':
          engine.inputs.fire = true;
          break;
        case 'Shift':
          engine.inputs.boost = true;
          break;
        case 'e':
        case 'E':
          if (nearbyStation && !engine.player.isDead) {
            spaceAudio.playDocking();
            setIsDocked((prev) => !prev);
          }
          break;
        case 'm':
        case 'M':
          setIsAudioMuted(spaceAudio.toggleMute());
          break;
        case 'Escape':
          setIsDocked(false);
          setIsHelpOpen(false);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          engine.inputs.forward = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          engine.inputs.backward = false;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          engine.inputs.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          engine.inputs.right = false;
          break;
        case ' ':
          engine.inputs.fire = false;
          break;
        case 'Shift':
          engine.inputs.boost = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engine, nearbyStation]);

  // Respawn Handler
  const handleRespawn = useCallback(() => {
    engine.respawn();
    setIsDead(false);
    setPlayerState({ ...engine.player });
    saveGameToStorage(engine.player);
  }, [engine]);

  // Starport Actions
  const handleSellAllCargo = useCallback(() => {
    let earned = 0;
    (Object.keys(engine.player.cargo) as ResourceType[]).forEach((res) => {
      earned += engine.player.cargo[res] * RESOURCE_CONFIG[res].value;
      engine.player.cargo[res] = 0;
    });
    engine.player.credits += earned;
    engine.player.stats.creditsEarned += earned;
    spaceAudio.playResourcePickup();
    setPlayerState({ ...engine.player });
    saveGameToStorage(engine.player);
  }, [engine]);

  const handleRepairHull = useCallback(() => {
    const missing = engine.player.maxHp - engine.player.hp;
    const cost = Math.round(missing * 1.5);
    if (engine.player.credits >= cost && missing > 0) {
      engine.player.credits -= cost;
      engine.player.hp = engine.player.maxHp;
      spaceAudio.playDocking();
      setPlayerState({ ...engine.player });
      saveGameToStorage(engine.player);
    }
  }, [engine]);

  const handleBuyUpgrade = useCallback(
    (type: 'engineLevel' | 'shieldLevel' | 'weaponLevel' | 'cargoLevel') => {
      const costs = {
        engineLevel: [0, 150, 400, 900, 2000],
        shieldLevel: [0, 180, 450, 1000, 2200],
        weaponLevel: [0, 220, 550, 1200, 2500],
        cargoLevel:  [0, 120, 300, 750, 1600],
      };
      const curLvl = engine.player.upgrades[type];
      const cost = costs[type][curLvl];
      if (engine.player.credits >= cost && curLvl < 5) {
        engine.player.credits -= cost;
        engine.player.upgrades[type]++;

        if (type === 'cargoLevel') {
          engine.player.cargoCapacity = 50 + (engine.player.upgrades.cargoLevel - 1) * 35;
        } else if (type === 'shieldLevel') {
          engine.player.maxShield = 100 + (engine.player.upgrades.shieldLevel - 1) * 25;
          engine.player.shield = engine.player.maxShield;
        }

        spaceAudio.playDocking();
        setPlayerState({ ...engine.player });
        saveGameToStorage(engine.player);
      }
    },
    [engine]
  );

  return (
    <main className="w-screen h-screen relative bg-[#030611] text-slate-100 overflow-hidden font-sans select-none">
      {/* 60fps Infinite Cosmos Canvas Viewport */}
      <SpaceCanvas engine={engine} />

      {/* Top Header Bar */}
      <header className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h1 className="font-black text-sm tracking-widest text-cyan-400 font-mono">
            NOVA-STRUM: VOID INFINITY
          </h1>
          <span className="text-[10px] text-slate-400 font-mono ml-2">V4 INFINITE RPG</span>
        </div>

        {/* Global Controls: Audio & Help */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsHelpOpen((prev) => !prev)}
            className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
          >
            [HELP]
          </button>
          <button
            onClick={() => setIsAudioMuted(spaceAudio.toggleMute())}
            className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
          >
            {isAudioMuted ? '🔇 MUTE' : '🔊 AUDIO'}
          </button>
        </div>
      </header>

      {/* Top-Right Holographic Radar HUD */}
      <aside className="absolute top-14 right-3 z-20 pointer-events-none">
        <RadarHUD engine={engine} />
      </aside>

      {/* Bottom-Left Status HUD */}
      <section className="absolute bottom-3 left-3 z-20">
        <ShipStatusHUD
          player={playerState}
          nearbyStation={nearbyStation}
          onOpenDock={() => {
            spaceAudio.playDocking();
            setIsDocked(true);
          }}
        />
      </section>

      {/* Mobile Flight Controls */}
      <MobileFlightStick
        onForward={(active) => (engine.inputs.forward = active)}
        onBackward={(active) => (engine.inputs.backward = active)}
        onLeft={(active) => (engine.inputs.left = active)}
        onRight={(active) => (engine.inputs.right = active)}
        onFire={(active) => (engine.inputs.fire = active)}
        onBoost={(active) => (engine.inputs.boost = active)}
        canDock={!!nearbyStation}
        onDock={() => {
          spaceAudio.playDocking();
          setIsDocked(true);
        }}
      />

      {/* Starport Docking Modal */}
      <StarportModal
        isOpen={isDocked}
        onClose={() => setIsDocked(false)}
        player={playerState}
        station={nearbyStation}
        onSellAllCargo={handleSellAllCargo}
        onRepairHull={handleRepairHull}
        onBuyUpgrade={handleBuyUpgrade}
      />

      {/* Player Death & Respawn Modal */}
      {isDead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono select-none animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border-2 border-rose-600 rounded-xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
            <span className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center text-3xl animate-pulse">
              💥
            </span>
            <div>
              <h2 className="text-xl font-black text-rose-500 tracking-wider">
                VESSEL DESTROYED
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hull integrity collapsed under fatal kinetic impact.
              </p>
            </div>
            <div className="w-full bg-slate-900 p-3 rounded text-xs text-slate-300 space-y-1 text-left">
              <div>CRITICAL RECOVERY PROTOCOL:</div>
              <div className="text-amber-400">• 50% cargo hold salvaged</div>
              <div className="text-cyan-400">• All ship upgrades & credits preserved</div>
              <div className="text-slate-400">• Vessel cloning at Sector [0, 0]</div>
            </div>
            <button
              onClick={handleRespawn}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow-lg shadow-rose-950 transition-colors cursor-pointer"
            >
              RESPAWN AT ORIGIN SECTOR [0, 0]
            </button>
          </div>
        </div>
      )}

      {/* Help / Controls Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-mono">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="font-bold text-cyan-400 text-sm">FLIGHT MANUAL & CONTROLS</h2>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                [ESC]
              </button>
            </div>
            <div className="text-xs space-y-1.5 text-slate-300">
              <div><strong className="text-cyan-400">[W / UP ARROW]</strong> Main Impulse Thrusters</div>
              <div><strong className="text-cyan-400">[A / D / LEFT / RIGHT]</strong> Angular Steering</div>
              <div><strong className="text-cyan-400">[S / DOWN ARROW]</strong> Reverse Retro-Thrusters</div>
              <div><strong className="text-cyan-400">[SHIFT]</strong> Afterburner Boost</div>
              <div><strong className="text-cyan-400">[SPACE / MOUSE CLICK]</strong> Fire Twin Plasma Blasters</div>
              <div><strong className="text-cyan-400">[E]</strong> Dock at Nearby Starports</div>
              <div><strong className="text-cyan-400">[M]</strong> Toggle Sound Effects</div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Destroy asteroids to harvest minerals. Defeat pirate cruisers for bounties. Dock at space stations to repair and upgrade your ship!
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
