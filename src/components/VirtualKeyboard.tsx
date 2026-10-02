import React from 'react';
import { getFingerForKey, FINGERS, FingerInfo } from '../utils/fingerMap';
import { Flame, Eye, EyeOff, Info } from 'lucide-react';

interface VirtualKeyboardProps {
  currentExpectedChar: string;
  activePressedKey: string | null;
  activeWrongKey?: string | null;
  activeCorrectedKey?: string | null;
  showFingerGuides?: boolean;
  missedKeyFrequencies?: Record<string, number>;
  showHeatmap?: boolean;
  onToggleHeatmap?: () => void;
  isCompact?: boolean;
}

interface KeyConfig {
  key: string;
  label?: string;
  shiftLabel?: string;
  width?: string;
  isSpecial?: boolean;
  hasBump?: boolean;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1
  [
    { key: '`', shiftLabel: '~' },
    { key: '1', shiftLabel: '!' },
    { key: '2', shiftLabel: '@' },
    { key: '3', shiftLabel: '#' },
    { key: '4', shiftLabel: '$' },
    { key: '5', shiftLabel: '%' },
    { key: '6', shiftLabel: '^' },
    { key: '7', shiftLabel: '&' },
    { key: '8', shiftLabel: '*' },
    { key: '9', shiftLabel: '(' },
    { key: '0', shiftLabel: ')' },
    { key: '-', shiftLabel: '_' },
    { key: '=', shiftLabel: '+' },
    { key: 'Backspace', label: 'Backspace', width: 'w-20', isSpecial: true },
  ],
  // Row 2
  [
    { key: 'Tab', label: 'Tab', width: 'w-16', isSpecial: true },
    { key: 'q' },
    { key: 'w' },
    { key: 'e' },
    { key: 'r' },
    { key: 't' },
    { key: 'y' },
    { key: 'u' },
    { key: 'i' },
    { key: 'o' },
    { key: 'p' },
    { key: '[', shiftLabel: '{' },
    { key: ']', shiftLabel: '}' },
    { key: '\\', shiftLabel: '|', width: 'w-14' },
  ],
  // Row 3 (Home Row)
  [
    { key: 'CapsLock', label: 'Caps', width: 'w-20', isSpecial: true },
    { key: 'a' },
    { key: 's' },
    { key: 'd' },
    { key: 'f', hasBump: true },
    { key: 'g' },
    { key: 'h' },
    { key: 'j', hasBump: true },
    { key: 'k' },
    { key: 'l' },
    { key: ';', shiftLabel: ':' },
    { key: "'", shiftLabel: '"' },
    { key: 'Enter', label: 'Enter', width: 'w-24', isSpecial: true },
  ],
  // Row 4
  [
    { key: 'ShiftLeft', label: 'Shift', width: 'w-24', isSpecial: true },
    { key: 'z' },
    { key: 'x' },
    { key: 'c' },
    { key: 'v' },
    { key: 'b' },
    { key: 'n' },
    { key: 'm' },
    { key: ',', shiftLabel: '<' },
    { key: '.', shiftLabel: '>' },
    { key: '/', shiftLabel: '?' },
    { key: 'ShiftRight', label: 'Shift', width: 'w-28', isSpecial: true },
  ],
  // Row 5
  [
    { key: 'ControlLeft', label: 'Ctrl', width: 'w-16', isSpecial: true },
    { key: 'AltLeft', label: 'Alt', width: 'w-16', isSpecial: true },
    { key: ' ', label: 'Spasi (Ibu Jari)', width: 'flex-1 max-w-md', isSpecial: true },
    { key: 'AltRight', label: 'Alt', width: 'w-16', isSpecial: true },
    { key: 'ControlRight', label: 'Ctrl', width: 'w-16', isSpecial: true },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentExpectedChar,
  activePressedKey,
  activeWrongKey = null,
  activeCorrectedKey = null,
  showFingerGuides = true,
  missedKeyFrequencies = {},
  showHeatmap = false,
  onToggleHeatmap,
  isCompact = false,
}) => {
  const currentFinger: FingerInfo = getFingerForKey(currentExpectedChar || '');
  const needsShift =
    currentExpectedChar &&
    currentExpectedChar.length === 1 &&
    /[A-Z!@#$%^&*()_+{}|:"<>?~]/.test(currentExpectedChar);

  // Compute maximum miss count for normalizing heatmap colors
  const maxMisses = Math.max(
    ...Object.values(missedKeyFrequencies),
    0
  );

  const totalMisses = Object.values(missedKeyFrequencies).reduce((a, b) => a + b, 0);

  const getHeatmapData = (char: string) => {
    const keyLower = char.toLowerCase();
    const count = missedKeyFrequencies[keyLower] || (char === ' ' ? missedKeyFrequencies[' '] || missedKeyFrequencies['space'] : 0) || 0;
    if (!showHeatmap || count === 0 || maxMisses === 0) {
      return { count, style: '', badgeColor: '', ratio: 0 };
    }

    const ratio = count / maxMisses;

    // Heat gradient levels
    let style = 'bg-orange-950/70 border-orange-500/40 text-orange-200';
    let badgeColor = 'bg-orange-500 text-slate-950';

    if (ratio >= 0.8) {
      // Hot: High errors (Red)
      style = 'bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse';
      badgeColor = 'bg-rose-500 text-white font-black';
    } else if (ratio >= 0.5) {
      // Medium Hot (Orange-Red)
      style = 'bg-red-950/80 border-red-500/60 text-red-100 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      badgeColor = 'bg-red-500 text-white font-bold';
    } else if (ratio >= 0.25) {
      // Warm (Amber / Yellow)
      style = 'bg-amber-950/70 border-amber-500/50 text-amber-200';
      badgeColor = 'bg-amber-500 text-slate-950 font-bold';
    } else {
      // Low (Soft Amber)
      style = 'bg-yellow-950/50 border-yellow-500/30 text-yellow-200';
      badgeColor = 'bg-yellow-600 text-white';
    }

    return { count, style, badgeColor, ratio };
  };

  const isCurrentKey = (k: KeyConfig) => {
    if (!currentExpectedChar) return false;
    if (k.key === ' ' && currentExpectedChar === ' ') return true;
    if (k.key.toLowerCase() === currentExpectedChar.toLowerCase()) return true;
    if (k.shiftLabel === currentExpectedChar) return true;
    if (needsShift && (k.key === 'ShiftLeft' || k.key === 'ShiftRight')) return true;
    return false;
  };

  const isKeyPressed = (k: KeyConfig) => {
    if (!activePressedKey) return false;
    if (activePressedKey.toLowerCase() === k.key.toLowerCase()) return true;
    if (k.key === ' ' && (activePressedKey === ' ' || activePressedKey === 'Space')) return true;
    return false;
  };

  const isWrongKeyPressed = (k: KeyConfig) => {
    if (!activeWrongKey) return false;
    if (activeWrongKey.toLowerCase() === k.key.toLowerCase()) return true;
    if (k.key === ' ' && (activeWrongKey === ' ' || activeWrongKey === 'Space')) return true;
    return false;
  };

  const isCorrectedKeyPressed = (k: KeyConfig) => {
    if (!activeCorrectedKey) return false;
    if (activeCorrectedKey.toLowerCase() === k.key.toLowerCase()) return true;
    if (k.key === ' ' && (activeCorrectedKey === ' ' || activeCorrectedKey === 'Space')) return true;
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Dynamic Finger Coach & Heatmap Bar */}
      <div className={`w-full flex flex-wrap items-center justify-between ${isCompact ? 'mb-1.5 px-2.5 py-1 text-[11px]' : 'mb-2 px-3 py-2 text-xs'} rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 gap-2`}>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Tuts target:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 ${isCompact ? 'text-xs' : 'text-sm'} shadow-sm`}>
            {currentExpectedChar === ' ' ? 'Spasi' : currentExpectedChar || '-'}
          </span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-400">Gunakan:</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${currentFinger.bgLightClass} border ${currentFinger.borderClass}`}>
            <span className={`w-2 h-2 rounded-full ${currentFinger.colorClass}`} />
            {currentFinger.name}
          </span>
        </div>

        {/* Heatmap Toggle & Stats */}
        <div className="flex items-center gap-2 ml-auto">
          {onToggleHeatmap && (
            <button
              onClick={onToggleHeatmap}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition border ${
                showHeatmap
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Aktifkan/nonaktifkan overlay tuts yang paling sering salah"
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
              <span>Overlay Heatmap Kesalahan</span>
              {totalMisses > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${showHeatmap ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {totalMisses}
                </span>
              )}
            </button>
          )}

          {/* Home row indicator guide */}
          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-xs pl-2 border-l border-slate-800">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Jangkar: <strong className="text-slate-200">F & J</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Legend Bar when active */}
      {showHeatmap && (
        <div className="w-full mb-1.5 px-3 py-1 rounded-lg bg-rose-950/20 border border-rose-500/20 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Heatmap Tuts Sering Salah (Berdasarkan Riwayat Sesi):</span>
          </div>
          {totalMisses === 0 ? (
            <span className="text-slate-400 italic">
              Belum ada riwayat kesalahan yang tercatat. Selesaikan latihan untuk memunculkan heatmap!
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-yellow-500/60 border border-yellow-400/40" /> Rendah
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-400" /> Sedang
              </span>
              <span className="flex items-center gap-1 text-rose-300 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 border border-rose-300 animate-pulse" /> Paling Sering Meleset ({maxMisses}x)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Grid */}
      <div className={`w-full ${isCompact ? 'p-1.5 sm:p-2' : 'p-2.5'} rounded-2xl bg-slate-900/95 border border-slate-800/80 shadow-2xl backdrop-blur select-none`}>
        <div className={isCompact ? 'space-y-1' : 'space-y-1.5'}>
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
              {row.map((k) => {
                const target = isCurrentKey(k);
                const pressed = isKeyPressed(k);
                const finger = getFingerForKey(k.key);
                const widthClass = k.width || 'w-8 sm:w-11';
                const heat = getHeatmapData(k.key);

                let keyClasses = 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-300 border-slate-800/80';

                if (isWrongKeyPressed(k)) {
                  keyClasses = 'bg-rose-600 text-white font-bold border-rose-400 scale-95 shadow-lg shadow-rose-600/50 animate-shake';
                } else if (isCorrectedKeyPressed(k)) {
                  keyClasses = 'bg-amber-500 text-slate-950 font-bold border-amber-300 scale-95 shadow-lg shadow-amber-500/50 animate-correction';
                } else if (pressed) {
                  keyClasses = 'bg-blue-600 text-white font-bold border-blue-400 scale-95 shadow-inner shadow-blue-900/60';
                } else if (target) {
                  keyClasses = `bg-slate-800 text-white font-bold ring-2 ${finger.ringClass} border-slate-600 animate-pulse shadow-lg shadow-${finger.colorClass}/20`;
                } else if (showHeatmap && heat.count > 0 && !k.isSpecial) {
                  keyClasses = heat.style;
                }

                return (
                  <div
                    key={k.key}
                    className={`relative ${isCompact ? 'h-7 sm:h-9' : 'h-10 sm:h-12'} ${widthClass} rounded-lg flex flex-col items-center justify-center font-mono text-xs transition-all duration-75 border ${keyClasses}`}
                  >
                    {/* Shift secondary label */}
                    {k.shiftLabel && (
                      <span className="text-[10px] text-slate-400 leading-none">
                        {k.shiftLabel}
                      </span>
                    )}

                    {/* Main Key Label */}
                    <span className={`leading-none ${k.isSpecial ? 'text-[11px] font-sans' : 'text-xs sm:text-sm font-semibold'}`}>
                      {k.label || k.key.toUpperCase()}
                    </span>

                    {/* Tactile bumps for F & J */}
                    {k.hasBump && (
                      <span className="absolute bottom-1 w-3 sm:w-4 h-0.5 rounded-full bg-slate-400" />
                    )}

                    {/* Heatmap Error Count Badge */}
                    {showHeatmap && heat.count > 0 && !k.isSpecial && (
                      <span
                        className={`absolute -top-1.5 -right-1 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] flex items-center justify-center shadow-md font-mono ${heat.badgeColor}`}
                        title={`${heat.count} kali salah ketik`}
                      >
                        {heat.count}
                      </span>
                    )}

                    {/* Finger color dot indicator on key base (hidden if heat badge overlaps) */}
                    {showFingerGuides && !k.isSpecial && (!showHeatmap || heat.count === 0) && (
                      <span
                        className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-60 ${finger.colorClass}`}
                        title={finger.name}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Finger Color Legend */}
        {showFingerGuides && (
          <div className={`${isCompact ? 'mt-2 pt-1.5' : 'mt-3 pt-2.5'} border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-slate-400`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-slate-300 font-semibold mr-1">Panduan Jari:</span>
              {Object.values(FINGERS).map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${f.colorClass}`} />
                  <span className={currentFinger.id === f.id ? 'text-amber-300 font-semibold' : ''}>
                    {f.name}
                  </span>
                </span>
              ))}
            </div>

            {/* Quick Tip */}
            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Gunakan heatmap untuk mengidentifikasi tuts yang perlu dilatih ulang</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
