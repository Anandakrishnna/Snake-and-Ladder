import React, { useState } from 'react';
import { Player } from '../types/game';
import { PLAYER_COLORS, DEFAULT_PLAYERS_CONFIG } from '../constants/board';
import { Users, Play, Crown, Sparkles, Shield, Star, Gem, Check } from 'lucide-react';
import heroImage from '../assets/images/snakes_ladders_hero_1790139469578.jpg';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onStartGame: (players: Player[]) => void;
}

const AVATAR_OPTIONS: { id: Player['avatarIcon']; icon: typeof Crown; label: string }[] = [
  { id: 'crown', icon: Crown, label: 'Crown' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'shield', icon: Shield, label: 'Shield' },
  { id: 'gem', icon: Gem, label: 'Gem' },
];

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({ isOpen, onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerConfigs, setPlayerConfigs] = useState([
    { name: 'Player 1', colorHex: PLAYER_COLORS[0].hex, accent: PLAYER_COLORS[0].accent, avatar: 'crown' as Player['avatarIcon'] },
    { name: 'Player 2', colorHex: PLAYER_COLORS[1].hex, accent: PLAYER_COLORS[1].accent, avatar: 'star' as Player['avatarIcon'] },
    { name: 'Player 3', colorHex: PLAYER_COLORS[2].hex, accent: PLAYER_COLORS[2].accent, avatar: 'shield' as Player['avatarIcon'] },
    { name: 'Player 4', colorHex: PLAYER_COLORS[3].hex, accent: PLAYER_COLORS[3].accent, avatar: 'gem' as Player['avatarIcon'] },
  ]);

  if (!isOpen) return null;

  const handleNameChange = (index: number, name: string) => {
    const updated = [...playerConfigs];
    updated[index] = { ...updated[index], name };
    setPlayerConfigs(updated);
  };

  const handleColorSelect = (index: number, colorHex: string, accent: string) => {
    const updated = [...playerConfigs];
    updated[index] = { ...updated[index], colorHex, accent };
    setPlayerConfigs(updated);
  };

  const handleAvatarSelect = (index: number, avatar: Player['avatarIcon']) => {
    const updated = [...playerConfigs];
    updated[index] = { ...updated[index], avatar };
    setPlayerConfigs(updated);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPlayers: Player[] = playerConfigs.slice(0, playerCount).map((cfg, idx) => ({
      id: `player-${idx + 1}`,
      name: cfg.name.trim() || `Player ${idx + 1}`,
      color: cfg.colorHex,
      accentColor: cfg.accent,
      avatarIcon: cfg.avatar,
      position: 1, // Traditional start at square 1
      previousPosition: 1,
      snakesBitten: 0,
      laddersClimbed: 0,
      rollsCount: 0,
      isCurrentTurn: idx === 0,
    }));

    onStartGame(selectedPlayers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Banner with generated art & fallback */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-800">
          <img
            src={heroImage}
            alt="Snake and Ladder Game Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Classic Board Game
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
                Snake & Ladder
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100 Squares · Serpentine</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleStart} className="p-6 sm:p-7 space-y-6">
          {/* Player Count Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Select Number of Players
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[2, 3, 4].map((count) => {
                const isSelected = playerCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPlayerCount(count)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{count} Players</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Details Customization */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-300">
              Customize Players
            </label>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {playerConfigs.slice(0, playerCount).map((cfg, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Pawn Avatar Preview */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white/80 shrink-0 font-bold text-white text-sm"
                      style={{ backgroundColor: cfg.colorHex }}
                    >
                      {cfg.name ? cfg.name.charAt(0).toUpperCase() : `${index + 1}`}
                    </div>

                    {/* Name Input */}
                    <input
                      type="text"
                      maxLength={18}
                      value={cfg.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Player ${index + 1}`}
                      className="flex-1 px-3.5 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    />
                  </div>

                  {/* Color Palettes & Avatar Icon Selector */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-700/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 mr-1">Color:</span>
                      {PLAYER_COLORS.map((col) => {
                        const isColorActive = cfg.colorHex === col.hex;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => handleColorSelect(index, col.hex, col.accent)}
                            title={col.name}
                            className={`w-5 h-5 rounded-full border transition-transform ${
                              isColorActive ? 'scale-125 border-white shadow-sm ring-1 ring-white/50' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1">
                      {AVATAR_OPTIONS.map(({ id, icon: Icon, label }) => {
                        const isAvatarActive = cfg.avatar === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleAvatarSelect(index, id)}
                            title={label}
                            className={`p-1 rounded-lg transition ${
                              isAvatarActive
                                ? 'bg-slate-700 text-amber-300'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start Game</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
