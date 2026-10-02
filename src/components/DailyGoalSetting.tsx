import React, { useState, useRef, useEffect } from 'react';
import { Target, Check, ChevronDown, Trophy, Sparkles } from 'lucide-react';

interface DailyGoalSettingProps {
  dailyGoal: number;
  onUpdateDailyGoal: (goal: number) => void;
  bestWpmToday: number;
}

const PRESET_GOALS = [
  { wpm: 25, label: 'Pemula', desc: 'Langkah awal yang stabil' },
  { wpm: 40, label: 'Menengah', desc: 'Standar mengetik lancar' },
  { wpm: 55, label: 'Cepat', desc: 'Kecepatan produktif kerja' },
  { wpm: 70, label: 'Mahir', desc: 'Refleks 10 jari terlatih' },
  { wpm: 85, label: 'Master', desc: 'Kecepatan tingkat tinggi' },
];

export const DailyGoalSetting: React.FC<DailyGoalSettingProps> = ({
  dailyGoal,
  onUpdateDailyGoal,
  bestWpmToday,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState(dailyGoal.toString());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAchieved = bestWpmToday >= dailyGoal && dailyGoal > 0;
  const progressPercent = Math.min(100, Math.round((bestWpmToday / dailyGoal) * 100));

  // Sync custom input with prop
  useEffect(() => {
    setCustomInput(dailyGoal.toString());
  }, [dailyGoal]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectGoal = (wpm: number) => {
    onUpdateDailyGoal(wpm);
    setCustomInput(wpm.toString());
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customInput, 10);
    if (!isNaN(parsed) && parsed >= 15 && parsed <= 200) {
      onUpdateDailyGoal(parsed);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Target WPM Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
          isAchieved
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
        }`}
        title="Atur Target WPM Harian"
        aria-expanded={isOpen}
      >
        <Target className={`w-3.5 h-3.5 ${isAchieved ? 'text-emerald-400 animate-pulse' : 'text-blue-400'}`} />
        <span className="hidden sm:inline">Target:</span>
        <span className="font-mono text-slate-100 font-bold">{dailyGoal} WPM</span>
        {isAchieved && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" title="Target hari ini tercapai!" />
        )}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Target WPM Harian</h4>
                <p className="text-[10px] text-slate-400">Tetapkan sasaran kecepatan hari ini</p>
              </div>
            </div>
            {isAchieved && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-400" />
                Tercapai!
              </span>
            )}
          </div>

          {/* Progress Today Preview */}
          <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-[11px] text-slate-400">Pencapaian Hari Ini:</span>
              <span className="font-mono font-bold text-slate-100">
                {bestWpmToday} <span className="text-slate-400 font-normal">/ {dailyGoal} WPM</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAchieved ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
              <span>{progressPercent}% terpenuhi</span>
              {isAchieved ? (
                <span className="text-emerald-400 font-semibold">Selamat! Target hari ini tuntas.</span>
              ) : (
                <span>Kurang {Math.max(0, dailyGoal - bestWpmToday)} WPM lagi</span>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-3 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Pilih Target Cepat:
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_GOALS.map((preset) => {
                const selected = dailyGoal === preset.wpm;
                return (
                  <button
                    key={preset.wpm}
                    type="button"
                    onClick={() => handleSelectGoal(preset.wpm)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition ${
                      selected
                        ? 'bg-blue-950/50 border-blue-500/50 text-blue-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span className="font-mono text-blue-400">{preset.wpm} WPM</span>
                        <span className="text-slate-400 font-normal text-[11px]">— {preset.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{preset.desc}</div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 mt-2 border-t border-slate-800/80">
              <label htmlFor="custom-wpm" className="block text-[10px] text-slate-400 mb-1 font-medium">
                Atur Nilai WPM Kustom (15 - 200 WPM):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="custom-wpm"
                  type="number"
                  min="15"
                  max="200"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: 50"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
