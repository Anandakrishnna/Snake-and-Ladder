import React, { useMemo } from 'react';
import { Player, Snake, Ladder } from '../types/game';
import { LADDERS, SNAKES, PLAYER_COLORS } from '../constants/board';
import {
  getSquareCoordinate,
  getPlayerOffset,
  generateLadderGeometry,
  generateSnakeGeometry,
} from '../utils/boardCoordinates';
import { Crown, Sparkles, Footprints, AlertTriangle } from 'lucide-react';

interface GameBoardProps {
  players: Player[];
  activePlayerId: string;
  isMoving: boolean;
  highlightSquare?: number | null;
  lastMovedPlayerId?: string | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  activePlayerId,
  isMoving,
  highlightSquare,
}) => {
  // Pre-generate SVG geometries for ladders and snakes
  const ladderGeometries = useMemo(() => {
    return LADDERS.map((ladder) => ({
      ladder,
      geom: generateLadderGeometry(ladder.bottom, ladder.top),
    }));
  }, []);

  const snakeGeometries = useMemo(() => {
    return SNAKES.map((snake) => ({
      snake,
      geom: generateSnakeGeometry(snake.head, snake.tail),
    }));
  }, []);

  // Generate 100 cells in visual order (Row 0 to 9 from top to bottom, Col 0 to 9 from left to right)
  const cells = useMemo(() => {
    const list: {
      square: number;
      screenRow: number;
      col: number;
      isLadderBottom?: Ladder;
      isLadderTop?: Ladder;
      isSnakeHead?: Snake;
      isSnakeTail?: Snake;
    }[] = [];

    for (let screenRow = 0; screenRow < 10; screenRow++) {
      const rowFromBottom = 9 - screenRow;
      const isEvenRow = rowFromBottom % 2 === 0;

      for (let col = 0; col < 10; col++) {
        const remainder = isEvenRow ? col : 9 - col;
        const square = rowFromBottom * 10 + remainder + 1;

        const isLadderBottom = LADDERS.find((l) => l.bottom === square);
        const isLadderTop = LADDERS.find((l) => l.top === square);
        const isSnakeHead = SNAKES.find((s) => s.head === square);
        const isSnakeTail = SNAKES.find((s) => s.tail === square);

        list.push({
          square,
          screenRow,
          col,
          isLadderBottom,
          isLadderTop,
          isSnakeHead,
          isSnakeTail,
        });
      }
    }
    return list;
  }, []);

  // Group players by current position to compute multi-player offsets
  const playersBySquare = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach((p) => {
      const list = map.get(p.position) || [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [players]);

  return (
    <div className="relative w-full max-w-[660px] mx-auto aspect-square rounded-3xl p-3 sm:p-4 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 shadow-2xl border border-slate-700/60 select-none">
      {/* Outer frame border embellishment */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-slate-900">
        
        {/* 10x10 Grid Tiles */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {cells.map((cell) => {
            const isHighlighted = highlightSquare === cell.square;
            const isGoal = cell.square === 100;
            const isStart = cell.square === 1;

            // Checkerboard coloring with soft warm contrasts
            const isEvenSquare = (cell.screenRow + cell.col) % 2 === 0;
            let bgClass = isEvenSquare ? 'bg-slate-800/90' : 'bg-slate-850/95';

            if (isGoal) {
              bgClass = 'bg-gradient-to-br from-amber-500/25 via-amber-600/30 to-amber-700/35 ring-2 ring-inset ring-amber-400/80';
            } else if (isStart) {
              bgClass = 'bg-gradient-to-br from-emerald-500/25 via-emerald-600/30 to-teal-800/30 ring-2 ring-inset ring-emerald-400/80';
            } else if (cell.isSnakeHead) {
              bgClass = 'bg-rose-950/40 hover:bg-rose-900/40';
            } else if (cell.isLadderBottom) {
              bgClass = 'bg-emerald-950/40 hover:bg-emerald-900/40';
            }

            return (
              <div
                key={cell.square}
                className={`relative flex flex-col justify-between p-1 border border-slate-700/30 transition-colors duration-150 ${bgClass} ${
                  isHighlighted ? 'ring-2 ring-amber-300 ring-inset bg-amber-400/30 animate-pulse' : ''
                }`}
              >
                {/* Square Number */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] sm:text-xs font-bold tabular-nums leading-none tracking-tight ${
                      isGoal
                        ? 'text-amber-300 font-extrabold'
                        : isStart
                        ? 'text-emerald-300 font-extrabold'
                        : cell.isSnakeHead
                        ? 'text-rose-400'
                        : cell.isLadderBottom
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.square}
                  </span>

                  {/* Corner indicator */}
                  {isGoal && (
                    <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-bounce" />
                  )}
                  {isStart && (
                    <Footprints className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  )}
                </div>

                {/* Snake head / Ladder bottom hints for players */}
                <div className="flex justify-end items-end h-full">
                  {cell.isSnakeHead && (
                    <span
                      title={`Snake head: slides down to ${cell.isSnakeHead.tail}`}
                      className="text-[8px] sm:text-[9px] font-semibold text-rose-400 flex items-center gap-0.5 px-0.5 bg-rose-950/70 rounded"
                    >
                      <span className="text-[10px] leading-none">🐍</span>
                      <span>{cell.isSnakeHead.tail}</span>
                    </span>
                  )}
                  {cell.isLadderBottom && (
                    <span
                      title={`Ladder bottom: climbs up to ${cell.isLadderBottom.top}`}
                      className="text-[8px] sm:text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5 px-0.5 bg-emerald-950/70 rounded"
                    >
                      <span className="text-[10px] leading-none">🪜</span>
                      <span>{cell.isLadderBottom.top}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG Overlay for Ladders and Snakes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Ladder Gradients */}
            <linearGradient id="ladder-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="ladder-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id="ladder-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>

            {/* Snake Body Gradients */}
            <linearGradient id="snake-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="snake-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="45%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <linearGradient id="snake-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="snake-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            {/* Drop shadows */}
            <filter id="svg-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.6" />
            </filter>
            <filter id="snake-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Render Ladders */}
          {ladderGeometries.map(({ ladder, geom }) => {
            const gradId = `url(#ladder-${ladder.colorTheme})`;
            return (
              <g key={ladder.id} filter="url(#svg-shadow)" className="opacity-95 hover:opacity-100 transition-opacity">
                {/* Left and Right Side Rails */}
                <path
                  d={geom.leftRail}
                  stroke={gradId}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <path
                  d={geom.rightRail}
                  stroke={gradId}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />

                {/* Ladder Rungs */}
                {geom.rungs.map((rung, i) => (
                  <line
                    key={i}
                    x1={rung.p1.x}
                    y1={rung.p1.y}
                    x2={rung.p2.x}
                    y2={rung.p2.y}
                    stroke={gradId}
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                ))}

                {/* Subtle base & top anchor pegs */}
                <circle cx={geom.pBottom.x} cy={geom.pBottom.y} r="1.4" fill="#10b981" opacity="0.8" />
                <circle cx={geom.pTop.x} cy={geom.pTop.y} r="1.4" fill="#38bdf8" opacity="0.8" />
              </g>
            );
          })}

          {/* Render Snakes */}
          {snakeGeometries.map(({ snake, geom }) => {
            const gradId = `url(#snake-${snake.colorTheme})`;
            return (
              <g key={snake.id} filter="url(#snake-glow)">
                {/* Snake Outer Shadow / Outline */}
                <path
                  d={geom.pathString}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Snake Main Body */}
                <path
                  d={geom.pathString}
                  fill="none"
                  stroke={gradId}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                {/* Snake Body Pattern Stripes (Dashed Overlay) */}
                <path
                  d={geom.pathString}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="0.8 2.2"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Snake Head at Start */}
                <g transform={`translate(${geom.head.x}, ${geom.head.y}) rotate(${geom.headAngle})`}>
                  {/* Head Oval */}
                  <ellipse cx="0" cy="0" rx="2.4" ry="1.9" fill={gradId} stroke="#0f172a" strokeWidth="0.4" />
                  {/* Eyes */}
                  <circle cx="0.8" cy="-0.9" r="0.65" fill="#fef08a" />
                  <circle cx="0.9" cy="-0.9" r="0.35" fill="#0f172a" />
                  <circle cx="0.8" cy="0.9" r="0.65" fill="#fef08a" />
                  <circle cx="0.9" cy="0.9" r="0.35" fill="#0f172a" />
                  {/* Forked Tongue */}
                  <path
                    d="M 2.2 0 L 3.5 -0.6 M 2.2 0 L 3.5 0.6 M 1.9 0 L 2.6 0"
                    stroke="#ef4444"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                  />
                </g>

                {/* Snake Tail Tip */}
                <circle cx={geom.tail.x} cy={geom.tail.y} r="0.8" fill="#f43f5e" />
              </g>
            );
          })}
        </svg>

        {/* Animated Player Pawns Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {players.map((player) => {
            const cellCoord = getSquareCoordinate(player.position);
            const playersOnThisCell = playersBySquare.get(player.position) || [player];
            const playerIndexInCell = playersOnThisCell.findIndex((p) => p.id === player.id);
            const offset = getPlayerOffset(playerIndexInCell, playersOnThisCell.length);

            const isCurrent = player.id === activePlayerId;
            const x = cellCoord.centerPercent.x + offset.x;
            const y = cellCoord.centerPercent.y + offset.y;

            return (
              <div
                key={player.id}
                className="absolute pointer-events-auto transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: isCurrent ? 35 : 25,
                }}
              >
                {/* Active Turn Radiant Pulse */}
                {isCurrent && (
                  <div
                    className="absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: player.color }}
                  />
                )}

                {/* Pawn Body */}
                <div
                  title={`${player.name} (Square ${player.position})`}
                  className={`relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow-lg border-2 transition-transform duration-200 cursor-pointer ${
                    isCurrent ? 'scale-115 ring-2 ring-white shadow-xl' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: player.color,
                    borderColor: '#ffffff',
                    boxShadow: `0 4px 12px ${player.color}80, 0 1px 3px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Pawn Crown / Initial */}
                  <span className="text-[11px] sm:text-xs font-black text-white drop-shadow-md select-none">
                    {player.name.charAt(0).toUpperCase()}
                  </span>

                  {/* Active turn badge */}
                  {isCurrent && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950 shadow">
                      ★
                    </span>
                  )}
                </div>

                {/* Player Token shadow */}
                <div className="w-5 h-1.5 bg-black/40 rounded-full mx-auto -mt-1 blur-[1px]" />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
