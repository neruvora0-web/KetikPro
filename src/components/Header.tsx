import React from 'react';
import { Level, SoundType } from '../types';
import { StreakData } from '../utils/streak';
import { SoundSelector } from './SoundSelector';
import { DailyGoalSetting } from './DailyGoalSetting';
import {
  Keyboard,
  BarChart3,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Maximize2,
  Minimize2,
  Flame,
  Volume2,
  Volume1,
  VolumeX,
  Target,
} from 'lucide-react';

interface HeaderProps {
  currentLevel: Level;
  onSelectLevel: (lvl: Level) => void;
  isCustomDrill: boolean;
  soundType: SoundType;
  onChangeSoundType: (sound: SoundType) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  onOpenAnalytics: () => void;
  onOpenPrinciples: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  streak: StreakData;
  dailyGoal: number;
  onUpdateDailyGoal: (goal: number) => void;
  bestWpmToday: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onSelectLevel,
  isCustomDrill,
  soundType,
  onChangeSoundType,
  volume,
  onChangeVolume,
  showKeyboard,
  onToggleKeyboard,
  onOpenAnalytics,
  onOpenPrinciples,
  isZenMode,
  onToggleZenMode,
  streak,
  dailyGoal,
  onUpdateDailyGoal,
  bestWpmToday,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/25">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                Ketik<span className="text-blue-400">Pro</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Coach
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Pelatih Mengetik 10 Jari Cerdas
            </p>
          </div>
        </div>

        {/* Level Selector & Daily Streak Container */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Level Selector Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => onSelectLevel('pemula')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                !isCustomDrill && currentLevel === 'pemula'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pemula
            </button>

            <button
              onClick={() => onSelectLevel('menengah')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                !isCustomDrill && currentLevel === 'menengah'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Menengah
            </button>

            <button
              onClick={() => onSelectLevel('mahir')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                !isCustomDrill && currentLevel === 'mahir'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mahir
            </button>

            {isCustomDrill && (
              <span className="px-3 py-1.5 rounded-xl font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Drill Coach
              </span>
            )}
          </div>

          {/* Daily Streak Counter Badge next to Level Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition ${
              streak.completedToday
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/10'
                : streak.count > 0
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }`}
            title={
              streak.completedToday
                ? `Luar biasa! Target latihan hari ini tercapai. Streak: ${streak.count} hari berturut-turut.`
                : streak.count > 0
                ? `Streak aktif: ${streak.count} hari! Selesaikan 1 latihan hari ini untuk mempertahankan streak.`
                : 'Mulai latihan hari ini untuk mencetak Daily Streak pertamamu!'
            }
          >
            <Flame
              className={`w-4 h-4 transition ${
                streak.completedToday
                  ? 'text-amber-400 fill-amber-400 animate-pulse'
                  : streak.count > 0
                  ? 'text-amber-500'
                  : 'text-slate-500'
              }`}
            />
            <span className="font-mono font-bold text-xs sm:text-sm leading-none text-slate-100">
              {streak.count}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Hari
            </span>
            {streak.completedToday ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Target hari ini selesai" />
            ) : streak.count > 0 ? (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" title="Menunggu latihan hari ini" />
            ) : null}
          </div>
        </div>

        {/* Settings & Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Target WPM Harian (Daily Goal Setting) */}
          <DailyGoalSetting
            dailyGoal={dailyGoal}
            onUpdateDailyGoal={onUpdateDailyGoal}
            bestWpmToday={bestWpmToday}
          />

          {/* Mechanical Keyboard Switch Sound Selector */}
          <SoundSelector
            soundType={soundType}
            onChangeSoundType={onChangeSoundType}
          />

          {/* Independent Volume Slider Control */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm"
            title={`Volume Suara Switch: ${Math.round(volume * 100)}%`}
          >
            <button
              type="button"
              onClick={() => onChangeVolume(volume > 0 ? 0 : 0.5)}
              className="text-slate-400 hover:text-white transition focus:outline-none"
              title={volume === 0 ? 'Bunyikan Suara' : 'Bisukan Suara'}
            >
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : volume < 0.4 ? (
                <Volume1 className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              aria-label="Volume audio switch keyboard"
            />
            <span className="font-mono text-[10px] text-slate-400 min-w-[26px] text-right select-none">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Toggle Keyboard */}
          <button
            onClick={onToggleKeyboard}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              showKeyboard
                ? 'bg-slate-800 text-blue-300 border-slate-700'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={showKeyboard ? 'Sembunyikan Papan Ketik' : 'Tampilkan Papan Ketik'}
          >
            {showKeyboard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden md:inline">Papan Ketik</span>
          </button>

          {/* Zen Mode Toggle Button */}
          <button
            onClick={onToggleZenMode}
            className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition font-semibold ${
              isZenMode
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title={isZenMode ? 'Matikan Zen Mode' : 'Aktifkan Zen Mode (Sembunyikan header & footer saat mengetik)'}
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>Zen Mode</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title="Riwayat & Analitik Latihan"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Touch Typing Principles / Help */}
          <button
            onClick={onOpenPrinciples}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title="Prinsip 10 Jari & Posisi Duduk"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
