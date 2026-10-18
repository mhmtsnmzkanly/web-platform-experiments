import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { WinningLine, SessionStats, SpinHistoryItem, CabinetLightPattern, FreeSpinsState } from './types';
import { getRandomStopIndices, getVisibleMatrix, evaluateSpin } from './engine/slotMath';
import { soundFx } from './audio/SlotAudioEngine';
import { SlotMachineCabinet } from './components/SlotMachineCabinet';
import { ReelDisplay } from './components/ReelDisplay';
import { MechanicalLever } from './components/MechanicalLever';
import { ControlPanel, AutoSpinSettings } from './components/ControlPanel';
import { PaytableModal } from './components/PaytableModal';
import { StatsDashboard } from './components/StatsDashboard';
import { GambleModal } from './components/GambleModal';
import { FreeSpinsOverlay } from './components/FreeSpinsOverlay';

export const App: React.FC = () => {
  // Primary Bankroll & Wagering State
  const [balance, setBalance] = useState<number>(1000.0);
  const [betPerLine, setBetPerLine] = useState<number>(0.5);
  const [activeLines, setActiveLines] = useState<number>(20);
  const [lastWin, setLastWin] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Synchronous guard ref to prevent race conditions on rapid spacebar or click
  const isSpinningRef = useRef<boolean>(false);

  // Reel Targets & Evaluation
  const [reelStopIndices, setReelStopIndices] = useState<number[]>([4, 12, 19, 7, 25]);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [isAnticipatingReel4, setIsAnticipatingReel4] = useState<boolean>(false);
  const [isAnticipatingReel5, setIsAnticipatingReel5] = useState<boolean>(false);
  const [lightPattern, setLightPattern] = useState<CabinetLightPattern>('IDLE');

  // Modals & Overlays
  const [paytableOpen, setPaytableOpen] = useState<boolean>(false);
  const [statsOpen, setStatsOpen] = useState<boolean>(false);
  const [gambleOpen, setGambleOpen] = useState<boolean>(false);
  const [selectedPreviewLine, setSelectedPreviewLine] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Auto-Spin & Free Spins State
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const autoSpinSettingsRef = useRef<AutoSpinSettings | null>(null);
  const autoSpinTimerRef = useRef<number | null>(null);
  const autoSpinStartBalanceRef = useRef<number>(1000.0);

  const [freeSpinsState, setFreeSpinsState] = useState<FreeSpinsState>({
    active: false,
    remainingSpins: 0,
    totalWonSoFar: 0,
    currentMultiplier: 1,
  });

  // Telemetry & Records
  const [stats, setStats] = useState<SessionStats>({
    totalSpins: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    hitCount: 0,
    freeSpinsTriggeredCount: 0,
    currentRTP: 96.5,
  });
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);

  // Cached evaluation result ready to resolve when reels physically brake
  const pendingSpinResultRef = useRef<ReturnType<typeof evaluateSpin> | null>(null);
  const pendingWagerRef = useRef<number>(0);

  // Stop Auto Spin helper
  const handleStopAutoSpin = useCallback(() => {
    setAutoSpinCount(0);
    if (autoSpinTimerRef.current !== null) {
      window.clearTimeout(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }
  }, []);

  // Trigger Spin Action
  const handleSpin = useCallback(() => {
    // Check synchronous ref immediately to prevent race conditions
    if (isSpinningRef.current) return;

    const isFreeSpin = freeSpinsState.active;
    const currentTotalBet = activeLines * betPerLine;

    if (!isFreeSpin && balance < currentTotalBet) {
      handleStopAutoSpin();
      return;
    }

    // Set synchronous lock
    isSpinningRef.current = true;
    setIsSpinning(true);

    // Deduct wager if normal spin
    if (!isFreeSpin) {
      setBalance((prev) => prev - currentTotalBet);
      pendingWagerRef.current = currentTotalBet;
    } else {
      pendingWagerRef.current = 0;
    }

    setLastWin(0);
    setWinningLines([]);
    setLightPattern('SPINNING');

    // 1. Generate Stop Indices
    const nextStops = getRandomStopIndices();
    setReelStopIndices(nextStops);

    // 2. Pre-evaluate visible matrix to detect anticipation & payouts
    const matrix = getVisibleMatrix(nextStops);
    const multiplier = isFreeSpin ? freeSpinsState.currentMultiplier : 1;
    const evalResult = evaluateSpin(matrix, activeLines, betPerLine, multiplier);
    pendingSpinResultRef.current = evalResult;

    // 3. Anticipation Detection (check if 2 scatters appeared on reels 0, 1, 2)
    let scatterCountFirst3 = 0;
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        if (matrix[r][c] === 'SCATTER') scatterCountFirst3++;
      }
    }

    if (scatterCountFirst3 >= 2) {
      setIsAnticipatingReel4(true);
      setIsAnticipatingReel5(true);
      setLightPattern('ANTICIPATION');
      soundFx.playAnticipationPulse(1);
    } else {
      setIsAnticipatingReel4(false);
      setIsAnticipatingReel5(false);
    }
  }, [balance, activeLines, betPerLine, freeSpinsState, handleStopAutoSpin]);

  // Callback when all 5 reels have finished spring deceleration
  const handleAllReelsStopped = useCallback(() => {
    isSpinningRef.current = false;
    setIsSpinning(false);
    setIsAnticipatingReel4(false);
    setIsAnticipatingReel5(false);

    const result = pendingSpinResultRef.current;
    if (!result) return;

    const payout = result.totalPayout;
    const wager = pendingWagerRef.current;
    setWinningLines(result.winningLines);
    setLastWin(payout);

    // Update bankroll
    if (payout > 0) {
      setBalance((prev) => prev + payout);
    }

    // Free Spins Handling (with re-triggering support!)
    if (freeSpinsState.active) {
      const addedSpins = result.freeSpinsTriggered ? result.freeSpinsWon : 0;
      const remaining = freeSpinsState.remainingSpins - 1 + addedSpins;
      const accumulated = freeSpinsState.totalWonSoFar + payout;

      if (result.freeSpinsTriggered) {
        soundFx.playBigWinFanfare();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }

      if (remaining > 0) {
        setFreeSpinsState((prev) => ({
          ...prev,
          remainingSpins: remaining,
          totalWonSoFar: accumulated,
        }));
      } else {
        // Free spins finished
        setFreeSpinsState({
          active: false,
          remainingSpins: 0,
          totalWonSoFar: accumulated,
          currentMultiplier: 1,
        });
      }
    } else if (result.freeSpinsTriggered) {
      // Trigger new Free Spins
      setFreeSpinsState({
        active: true,
        remainingSpins: result.freeSpinsWon,
        totalWonSoFar: payout,
        currentMultiplier: 3, // 3x multiplier during Vault Heist!
      });
      setStats((prev) => ({ ...prev, freeSpinsTriggeredCount: prev.freeSpinsTriggeredCount + 1 }));
    }

    // Audio & Visual Presentation based on win magnitude
    const totalBet = activeLines * betPerLine;
    if (result.isJackpot) {
      setLightPattern('JACKPOT');
      soundFx.playBigWinFanfare();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } else if (payout >= totalBet * 10) {
      setLightPattern('BIG_WIN');
      soundFx.playBigWinFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else if (payout >= totalBet * 3) {
      setLightPattern('WIN');
      soundFx.playLineWin('medium');
    } else if (payout > 0) {
      setLightPattern('WIN');
      soundFx.playLineWin('small');
    } else {
      setLightPattern('IDLE');
    }

    // Update Session Telemetry
    setStats((prev) => {
      const totalSpins = prev.totalSpins + 1;
      const totalWagered = prev.totalWagered + wager;
      const totalWon = prev.totalWon + payout;
      const biggestWin = Math.max(prev.biggestWin, payout);
      const hitCount = payout > 0 ? prev.hitCount + 1 : prev.hitCount;
      const currentRTP = totalWagered > 0 ? (totalWon / totalWagered) * 100 : 96.5;

      return {
        totalSpins,
        totalWagered,
        totalWon,
        biggestWin,
        hitCount,
        freeSpinsTriggeredCount: prev.freeSpinsTriggeredCount,
        currentRTP,
      };
    });

    // Append to History Log
    setHistory((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        bet: wager,
        payout,
        winningLinesCount: result.winningLines.length,
        freeSpinsTriggered: result.freeSpinsTriggered,
      },
      ...prev.slice(0, 49),
    ]);

    // Handle Auto-Spin with Responsible Gaming Safety Limits Check
    if (autoSpinCount > 0) {
      const settings = autoSpinSettingsRef.current;
      let shouldStop = false;

      // 1. Stop on Bonus trigger if requested
      if (settings?.stopOnBonus && result.freeSpinsTriggered) {
        shouldStop = true;
      }

      // 2. Stop if single win exceeds limit
      if (settings?.stopOnWinLimit && payout >= settings.stopOnWinLimit) {
        shouldStop = true;
      }

      // 3. Stop if cumulative loss exceeds limit
      const currentLoss = autoSpinStartBalanceRef.current - (balance + payout);
      if (settings?.stopOnLossLimit && currentLoss >= settings.stopOnLossLimit) {
        shouldStop = true;
      }

      const nextCount = autoSpinCount - 1;
      if (shouldStop || nextCount <= 0 || (balance + payout) < totalBet) {
        handleStopAutoSpin();
      } else {
        setAutoSpinCount(nextCount);
        autoSpinTimerRef.current = window.setTimeout(() => {
          handleSpin();
        }, 850);
      }
    }
  }, [freeSpinsState, activeLines, betPerLine, autoSpinCount, balance, handleSpin, handleStopAutoSpin]);

  // Start Auto Spin with Safety Settings
  const handleStartAutoSpin = useCallback((settings: AutoSpinSettings) => {
    autoSpinSettingsRef.current = settings;
    autoSpinStartBalanceRef.current = balance;
    setAutoSpinCount(settings.count);
    handleSpin();
  }, [balance, handleSpin]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSpinTimerRef.current !== null) {
        window.clearTimeout(autoSpinTimerRef.current);
      }
    };
  }, []);

  // Keyboard Shortcuts (Space to Spin, M to mute) with key repeat guard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return; // Prevent duplicate repeat events
        handleSpin();
      } else if (e.key === 'm' || e.key === 'M') {
        if (e.repeat) return;
        setIsMuted((prev) => {
          const next = !prev;
          soundFx.setMuted(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSpin]);

  const handleMaxBet = () => {
    setActiveLines(20);
    setBetPerLine(10.0); // Full Max Bet corresponding to highest step in BET_STEPS
  };

  const handleCollectGamble = (finalWin: number) => {
    if (finalWin > lastWin) {
      const addedProfit = finalWin - lastWin;
      setBalance((prev) => prev + addedProfit);
      setLastWin(finalWin);
    } else if (finalWin === 0) {
      setBalance((prev) => prev - lastWin);
      setLastWin(0);
    }
  };

  const handleResetStats = () => {
    setStats({
      totalSpins: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      hitCount: 0,
      freeSpinsTriggeredCount: 0,
      currentRTP: 96.5,
    });
    setHistory([]);
  };

  const handleReloadCredits = () => {
    setBalance((prev) => prev + 1000.0);
  };

  return (
    <main className="min-h-screen bg-[#07090f] text-gray-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-x-hidden font-sans">
      {/* Background Ambience Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.06)_0%,_transparent_70%)] pointer-events-none" />

      {/* Free Spins Banner Overlay */}
      <FreeSpinsOverlay freeSpinsState={freeSpinsState} />

      {/* Main Arcade Slot Machine Cabinet */}
      <SlotMachineCabinet
        lightPattern={lightPattern}
        leverComponent={
          <MechanicalLever
            onPull={handleSpin}
            disabled={isSpinning || (!freeSpinsState.active && balance < activeLines * betPerLine)}
          />
        }
      >
        <ReelDisplay
          isSpinning={isSpinning}
          reelStopIndices={reelStopIndices}
          winningLines={winningLines}
          activePaylinesCount={activeLines}
          selectedPreviewLine={selectedPreviewLine}
          onAllReelsStopped={handleAllReelsStopped}
          isAnticipatingReel4={isAnticipatingReel4}
          isAnticipatingReel5={isAnticipatingReel5}
        />
      </SlotMachineCabinet>

      {/* Push-Button Arcade Control Panel */}
      <ControlPanel
        balance={balance}
        betPerLine={betPerLine}
        activeLines={activeLines}
        lastWin={lastWin}
        isSpinning={isSpinning}
        isFreeSpin={freeSpinsState.active}
        canGamble={lastWin > 0 && !freeSpinsState.active}
        onSpin={handleSpin}
        onChangeBet={setBetPerLine}
        onChangeLines={setActiveLines}
        onMaxBet={handleMaxBet}
        onOpenPaytable={() => setPaytableOpen(true)}
        onOpenStats={() => setStatsOpen(true)}
        onOpenGamble={() => setGambleOpen(true)}
        autoSpinCount={autoSpinCount}
        onStartAutoSpin={handleStartAutoSpin}
        onStopAutoSpin={handleStopAutoSpin}
        onReloadCredits={handleReloadCredits}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted((prev) => {
            const next = !prev;
            soundFx.setMuted(next);
            return next;
          });
        }}
      />

      {/* Paytable Modal */}
      <PaytableModal
        isOpen={paytableOpen}
        onClose={() => {
          setPaytableOpen(false);
          setSelectedPreviewLine(null);
        }}
        betPerLine={betPerLine}
        onSelectPreviewLine={setSelectedPreviewLine}
      />

      {/* Session Telemetry & Statistics Modal */}
      <StatsDashboard
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        history={history}
        onResetStats={handleResetStats}
      />

      {/* Card Gamble Modal - Keyed on lastWin & gambleOpen to ensure clean state initialization */}
      <GambleModal
        key={`gamble-${lastWin}-${String(gambleOpen)}`}
        isOpen={gambleOpen}
        initialWin={lastWin}
        onCollect={handleCollectGamble}
        onExit={() => setGambleOpen(false)}
      />

      {/* Bottom Legal / Simulation Footnote */}
      <footer className="mt-4 text-center text-[11px] font-mono text-neutral-500">
        AERO-VAULT 777 © V4 Simulation Lab • 100% Client-Side Web Audio & Canvas Reel Physics • Press [Space] to Spin
      </footer>
    </main>
  );
};
export default App;
