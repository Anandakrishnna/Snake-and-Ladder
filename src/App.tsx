import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, GamePhase, GameLogEntry, GameSettings } from './types/game';
import { SNAKES, LADDERS, DEFAULT_PLAYERS_CONFIG, PLAYER_COLORS } from './constants/board';
import { soundManager } from './utils/soundEffects';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { TurnBanner } from './components/TurnBanner';
import { GameLogDrawer } from './components/GameLogDrawer';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { WinnerModal } from './components/WinnerModal';
import { RulesModal } from './components/RulesModal';

export default function App() {
  // Game Setup & Players
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'player-1',
      name: 'Player 1',
      color: PLAYER_COLORS[0].hex,
      accentColor: PLAYER_COLORS[0].accent,
      avatarIcon: 'crown',
      position: 1,
      previousPosition: 1,
      snakesBitten: 0,
      laddersClimbed: 0,
      rollsCount: 0,
      isCurrentTurn: true,
    },
    {
      id: 'player-2',
      name: 'Player 2',
      color: PLAYER_COLORS[1].hex,
      accentColor: PLAYER_COLORS[1].accent,
      avatarIcon: 'star',
      position: 1,
      previousPosition: 1,
      snakesBitten: 0,
      laddersClimbed: 0,
      rollsCount: 0,
      isCurrentTurn: false,
    },
  ]);

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [latestDice, setLatestDice] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [highlightSquare, setHighlightSquare] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Welcome to Snake & Ladder! Press Roll Dice to begin.');
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [totalTurns, setTotalTurns] = useState<number>(1);
  const [winner, setWinner] = useState<Player | null>(null);

  // Modals & Settings
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast'>('normal');

  // Ref to prevent race conditions during rapid triggers
  const actionLockRef = useRef<boolean>(false);

  // Active player safe reference
  const activePlayer = players[activePlayerIndex] || players[0];

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  // Speed toggle handler
  const handleToggleSpeed = () => {
    setAnimationSpeed((prev) => (prev === 'normal' ? 'fast' : 'normal'));
    soundManager.playClick();
  };

  // Add event log helper
  const addLog = useCallback(
    (entry: Omit<GameLogEntry, 'id' | 'timestamp' | 'turn'>) => {
      const newEntry: GameLogEntry = {
        ...entry,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        turn: totalTurns,
        timestamp: new Date(),
      };
      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 logs
    },
    [totalTurns]
  );

  // Start new game with configured players
  const handleStartGame = (configuredPlayers: Player[]) => {
    setPlayers(configuredPlayers);
    setActivePlayerIndex(0);
    setLatestDice(1);
    setIsRolling(false);
    setIsMoving(false);
    setHighlightSquare(null);
    setWinner(null);
    setTotalTurns(1);
    setLogs([]);
    setStatusMessage(`${configuredPlayers[0].name}'s turn: Roll the dice!`);
    setPhase('PLAYING');
    soundManager.playClick();
  };

  // Reset current game (same players, reset positions)
  const handleRestartCurrentGame = () => {
    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        position: 1,
        previousPosition: 1,
        snakesBitten: 0,
        laddersClimbed: 0,
        rollsCount: 0,
        isCurrentTurn: idx === 0,
      }))
    );
    setActivePlayerIndex(0);
    setLatestDice(1);
    setIsRolling(false);
    setIsMoving(false);
    setHighlightSquare(null);
    setWinner(null);
    setTotalTurns(1);
    setLogs([]);
    setStatusMessage(`${players[0].name}'s turn: Roll the dice!`);
    setPhase('PLAYING');
    soundManager.playClick();
  };

  // Main Dice Roll & Move Orchestration
  const handleRollDice = useCallback(async () => {
    if (actionLockRef.current || isRolling || isMoving || phase !== 'PLAYING') {
      return;
    }

    actionLockRef.current = true;
    setIsRolling(true);
    soundManager.playDiceRoll();

    const currentPlayer = players[activePlayerIndex];
    setStatusMessage(`${currentPlayer.name} is rolling the dice...`);

    // Fair random roll: 1 to 6
    const rollResult = Math.floor(Math.random() * 6) + 1;

    // Simulate dice roll tumble animation
    await new Promise((resolve) => setTimeout(resolve, 650));

    setLatestDice(rollResult);
    setIsRolling(false);

    // Update player roll count
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, rollsCount: p.rollsCount + 1 } : p
      )
    );

    const startPos = currentPlayer.position;
    const targetPos = startPos + rollResult;

    addLog({
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerColor: currentPlayer.color,
      type: 'ROLL',
      message: `rolled a ${rollResult}!`,
      diceValue: rollResult,
      from: startPos,
    });

    // Check Exact-100 Rule: Player must roll exact number to reach 100
    if (targetPos > 100) {
      soundManager.playInvalid();
      const needed = 100 - startPos;
      setStatusMessage(
        `${currentPlayer.name} rolled ${rollResult}, but needs exact ${needed} to finish! Turn passes.`
      );
      addLog({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        playerColor: currentPlayer.color,
        type: 'EXACT_REQUIRED',
        message: `needs exact ${needed} to win, but rolled ${rollResult}.`,
        diceValue: rollResult,
        from: startPos,
        to: startPos,
      });

      // Pause briefly then pass turn
      await new Promise((resolve) => setTimeout(resolve, 1100));
      passTurn();
      actionLockRef.current = false;
      return;
    }

    // Step-by-step token movement
    setIsMoving(true);
    setStatusMessage(`${currentPlayer.name} is advancing ${rollResult} steps...`);

    const stepDelay = animationSpeed === 'fast' ? 120 : 200;

    let currentStep = startPos;
    while (currentStep < targetPos) {
      currentStep++;
      const pos = currentStep;
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, position: pos } : p
        )
      );
      soundManager.playStep();
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
    }

    // Landed on target square: Check for Ladders or Snakes
    const ladder = LADDERS.find((l) => l.bottom === targetPos);
    const snake = SNAKES.find((s) => s.head === targetPos);

    if (ladder) {
      setHighlightSquare(ladder.bottom);
      setStatusMessage(
        `🎉 ${currentPlayer.name} landed on a ladder at ${ladder.bottom}!`
      );
      await new Promise((resolve) => setTimeout(resolve, 320));

      soundManager.playLadder();
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? {
                ...p,
                position: ladder.top,
                laddersClimbed: p.laddersClimbed + 1,
              }
            : p
        )
      );
      addLog({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        playerColor: currentPlayer.color,
        type: 'LADDER',
        message: `climbed a ladder from ${ladder.bottom} up to ${ladder.top}! 🪜`,
        from: ladder.bottom,
        to: ladder.top,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      setHighlightSquare(null);

      // Check win condition after ladder
      if (ladder.top === 100) {
        handleWin(currentPlayer);
        setIsMoving(false);
        actionLockRef.current = false;
        return;
      }
    } else if (snake) {
      setHighlightSquare(snake.head);
      setStatusMessage(
        `🐍 Oh no! ${currentPlayer.name} stepped on a snake at ${snake.head}!`
      );
      await new Promise((resolve) => setTimeout(resolve, 320));

      soundManager.playSnake();
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? {
                ...p,
                position: snake.tail,
                snakesBitten: p.snakesBitten + 1,
              }
            : p
        )
      );
      addLog({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        playerColor: currentPlayer.color,
        type: 'SNAKE',
        message: `bit by a snake! Slid down from ${snake.head} to ${snake.tail}! 🐍`,
        from: snake.head,
        to: snake.tail,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      setHighlightSquare(null);
    } else {
      // Standard move
      addLog({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        playerColor: currentPlayer.color,
        type: 'STEP',
        message: `moved to square ${targetPos}.`,
        diceValue: rollResult,
        from: startPos,
        to: targetPos,
      });
    }

    // Check Win Condition: Square 100
    if (targetPos === 100) {
      handleWin(currentPlayer);
      setIsMoving(false);
      actionLockRef.current = false;
      return;
    }

    setIsMoving(false);
    passTurn();
    actionLockRef.current = false;
  }, [
    activePlayerIndex,
    players,
    isRolling,
    isMoving,
    phase,
    animationSpeed,
    addLog,
  ]);

  // Turn switching helper
  const passTurn = useCallback(() => {
    const nextIndex = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIndex);
    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        isCurrentTurn: idx === nextIndex,
      }))
    );
    setTotalTurns((prev) => prev + 1);
    setStatusMessage(`${players[nextIndex].name}'s turn: Roll the dice!`);
  }, [activePlayerIndex, players]);

  // Win handler
  const handleWin = (champ: Player) => {
    const winnerPlayer = { ...champ, position: 100 };
    setWinner(winnerPlayer);
    setPhase('WINNER');
    soundManager.playWin();
    setStatusMessage(`🏆 ${champ.name} has won the game!`);
    addLog({
      playerId: champ.id,
      playerName: champ.name,
      playerColor: champ.color,
      type: 'WIN',
      message: `reached Square 100 and won the championship! 🏆`,
      from: champ.position,
      to: 100,
    });
  };

  // Keyboard shortcut: Space or Enter to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === 'Space' || e.code === 'Enter') &&
        phase === 'PLAYING' &&
        !isRulesOpen &&
        !isRolling &&
        !isMoving &&
        !actionLockRef.current
      ) {
        // Prevent page scroll on Space
        if (e.target === document.body || (e.target as HTMLElement).tagName !== 'INPUT') {
          e.preventDefault();
          handleRollDice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isRulesOpen, isRolling, isMoving, handleRollDice]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        animationSpeed={animationSpeed}
        onToggleSpeed={handleToggleSpeed}
        onOpenRules={() => setIsRulesOpen(true)}
        onRestartGame={() => setPhase('SETUP')}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
        
        {/* Left / Center Column: 10x10 Game Board */}
        <div className="w-full lg:flex-1 flex flex-col items-center">
          <GameBoard
            players={players}
            activePlayerId={activePlayer.id}
            isMoving={isMoving}
            highlightSquare={highlightSquare}
          />
        </div>

        {/* Right Column: Turn Banner HUD & Event History Log */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">
          <TurnBanner
            activePlayer={activePlayer}
            players={players}
            latestDice={latestDice}
            isRolling={isRolling}
            isMoving={isMoving}
            onRollDice={handleRollDice}
            statusMessage={statusMessage}
          />

          <GameLogDrawer logs={logs} />
        </div>

      </main>

      {/* Player Setup Screen */}
      <PlayerSetupModal
        isOpen={phase === 'SETUP'}
        onStartGame={handleStartGame}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Victory Celebration Modal */}
      <WinnerModal
        winner={winner}
        players={players}
        totalTurns={totalTurns}
        onPlayAgain={handleRestartCurrentGame}
        onNewGameSetup={() => {
          setWinner(null);
          setPhase('SETUP');
        }}
      />
    </div>
  );
}
