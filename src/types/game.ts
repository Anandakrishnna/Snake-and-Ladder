export interface Player {
  id: string;
  name: string;
  color: string; // e.g., hex or tailwind identifier
  accentColor: string;
  avatarIcon: 'pawn' | 'star' | 'shield' | 'crown' | 'gem';
  position: number; // 1 to 100
  previousPosition: number;
  snakesBitten: number;
  laddersClimbed: number;
  rollsCount: number;
  isCurrentTurn: boolean;
}

export interface Snake {
  id: string;
  head: number; // Start of snake (e.g. 99)
  tail: number; // End of snake (e.g. 78)
  colorTheme: 'emerald' | 'crimson' | 'amber' | 'purple';
}

export interface Ladder {
  id: string;
  bottom: number; // Start of ladder (e.g. 28)
  top: number; // End of ladder (e.g. 84)
  colorTheme: 'gold' | 'wood' | 'cyan';
}

export type GamePhase = 'SETUP' | 'PLAYING' | 'WINNER';

export type LogType = 'ROLL' | 'STEP' | 'LADDER' | 'SNAKE' | 'EXACT_REQUIRED' | 'WIN' | 'SYSTEM';

export interface GameLogEntry {
  id: string;
  turn: number;
  timestamp: Date;
  playerId: string;
  playerName: string;
  playerColor: string;
  type: LogType;
  message: string;
  diceValue?: number;
  from?: number;
  to?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  animationSpeed: 'normal' | 'fast';
}
