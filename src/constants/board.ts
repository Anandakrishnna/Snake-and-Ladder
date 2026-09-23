import { Ladder, Snake } from '../types/game';

export const BOARD_SIZE = 10;
export const TOTAL_SQUARES = 100;

export const LADDERS: Ladder[] = [
  { id: 'ladder-1', bottom: 4, top: 14, colorTheme: 'gold' },
  { id: 'ladder-2', bottom: 9, top: 31, colorTheme: 'wood' },
  { id: 'ladder-3', bottom: 20, top: 38, colorTheme: 'cyan' },
  { id: 'ladder-4', bottom: 28, top: 84, colorTheme: 'gold' },
  { id: 'ladder-5', bottom: 40, top: 59, colorTheme: 'wood' },
  { id: 'ladder-6', bottom: 51, top: 67, colorTheme: 'cyan' },
  { id: 'ladder-7', bottom: 63, top: 81, colorTheme: 'gold' },
  { id: 'ladder-8', bottom: 71, top: 91, colorTheme: 'wood' },
];

export const SNAKES: Snake[] = [
  { id: 'snake-1', head: 17, tail: 7, colorTheme: 'emerald' },
  { id: 'snake-2', head: 54, tail: 34, colorTheme: 'amber' },
  { id: 'snake-3', head: 62, tail: 19, colorTheme: 'crimson' },
  { id: 'snake-4', head: 64, tail: 60, colorTheme: 'purple' },
  { id: 'snake-5', head: 87, tail: 24, colorTheme: 'crimson' },
  { id: 'snake-6', head: 93, tail: 73, colorTheme: 'emerald' },
  { id: 'snake-7', head: 95, tail: 75, colorTheme: 'amber' },
  { id: 'snake-8', head: 99, tail: 78, colorTheme: 'crimson' },
];

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  accent: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
}

export const PLAYER_COLORS: ColorOption[] = [
  {
    id: 'red',
    name: 'Ruby Red',
    hex: '#ef4444',
    accent: '#b91c1c',
    badgeClass: 'bg-red-500 text-white',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
  },
  {
    id: 'blue',
    name: 'Sapphire Blue',
    hex: '#3b82f6',
    accent: '#1d4ed8',
    badgeClass: 'bg-blue-500 text-white',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    glowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  },
  {
    id: 'green',
    name: 'Emerald Green',
    hex: '#10b981',
    accent: '#047857',
    badgeClass: 'bg-emerald-500 text-white',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    hex: '#f59e0b',
    accent: '#b45309',
    badgeClass: 'bg-amber-500 text-white',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
  },
  {
    id: 'purple',
    name: 'Amethyst Purple',
    hex: '#a855f7',
    accent: '#7e22ce',
    badgeClass: 'bg-purple-500 text-white',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    hex: '#06b6d4',
    accent: '#0e7490',
    badgeClass: 'bg-cyan-500 text-white',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
  },
];

export const DEFAULT_PLAYERS_CONFIG = [
  { name: 'Player 1', colorIndex: 0, avatarIcon: 'crown' as const },
  { name: 'Player 2', colorIndex: 1, avatarIcon: 'star' as const },
  { name: 'Player 3', colorIndex: 2, avatarIcon: 'shield' as const },
  { name: 'Player 4', colorIndex: 3, avatarIcon: 'gem' as const },
];
