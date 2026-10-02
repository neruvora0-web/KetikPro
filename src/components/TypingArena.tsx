import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Level, KeystrokeError, CoachAnalysisPayload, SoundType, CorrectionMode } from '../types';
import {
  playKeySound,
  playErrorSound,
  playSuccessChime,
  playBackspaceSound,
  playCorrectionChime,
} from '../utils/sound';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Clock,
  Zap,
  Target,
  CheckCheck,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface TypingArenaProps {
  level: Level;
  targetText: string;
  soundType: SoundType;
  volume: number;
  onSessionComplete: (payload: CoachAnalysisPayload) => void;
  onReset: () => void;
  onRequestCoachAnalysis?: (payload: CoachAnalysisPayload) => void;
  onActiveCharChange: (char: string) => void;
  onKeyActivity: (key: string | null) => void;
  onWrongKeyActivity?: (key: string | null) => void;
  onCorrectedKeyActivity?: (key: string | null) => void;
  onSessionActiveChange?: (isActive: boolean) => void;
  history: Array<{ date: string; wpm: number; accuracy: number }>;
  isZenMode?: boolean;
}

const STORAGE_KEY_CORRECTION_MODE = 'ketikpro_correction_mode';

export const TypingArena: React.FC<TypingArenaProps> = ({
  level,
  targetText,
  soundType,
  volume,
  onSessionComplete,
  onReset,
  onRequestCoachAnalysis,
  onActiveCharChange,
  onKeyActivity,
  onWrongKeyActivity,
  onCorrectedKeyActivity,
  onSessionActiveChange,
  history,
  isZenMode = false,
}) => {
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState<KeystrokeError[]>([]);
  const [correctedPositions, setCorrectedPositions] = useState<Set<number>>(new Set());
  const [lastErrorAlert, setLastErrorAlert] = useState<{ expected: string; typed: string; position: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showCorrectionCelebration, setShowCorrectionCelebration] = useState(false);

  const [correctionMode, setCorrectionMode] = useState<CorrectionMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CORRECTION_MODE);
    return saved === 'strict' ? 'strict' : 'free';
  });

  const [keyLatencies, setKeyLatencies] = useState<Record<string, number[]>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(soundType === 'muted' || volume === 0);

  useEffect(() => {
    setIsSoundMuted(soundType === 'muted' || volume === 0);
  }, [soundType, volume]);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const currentIndex = typedText.length;
  const currentExpectedChar = targetText[currentIndex] || '';

  // Notify parent of active char for virtual keyboard highlight
  useEffect(() => {
    onActiveCharChange(currentExpectedChar);
  }, [currentExpectedChar, onActiveCharChange]);

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  // Reset internal state when targetText changes
  useEffect(() => {
    setTypedText('');
    setErrors([]);
    setCorrectedPositions(new Set());
    setLastErrorAlert(null);
    setIsShaking(false);
    setShowCorrectionCelebration(false);
    setKeyLatencies({});
    setStartTime(null);
    setElapsedTime(0);
    setIsFinished(false);
    onSessionActiveChange?.(false);
    lastKeyTimeRef.current = null;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [targetText, onSessionActiveChange]);

  // Timer runner
  useEffect(() => {
    if (startTime && !isFinished) {
      timerIntervalRef.current = window.setInterval(() => {
        const seconds = (Date.now() - startTime) / 1000;
        setElapsedTime(seconds);
      }, 100);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [startTime, isFinished]);

  // Compute live metrics
  const totalTyped = typedText.length;
  let uncorrectedErrorsCount = 0;
  for (let i = 0; i < totalTyped; i++) {
    if (typedText[i] !== targetText[i]) {
      uncorrectedErrorsCount++;
    }
  }
  const correctedErrorsCount = correctedPositions.size;
  const totalMistakesLogged = errors.length;

  // Clean Accuracy (accuracy after correcting mistakes)
  const cleanCorrectCount = Math.max(0, totalTyped - uncorrectedErrorsCount);
  const accuracy = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round((cleanCorrectCount / totalTyped) * 100))) : 100;

  // Raw Accuracy (penalizes every original typo)
  const rawCorrectCount = Math.max(0, totalTyped - totalMistakesLogged);
  const rawAccuracy = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round((rawCorrectCount / totalTyped) * 100))) : 100;

  const minutes = Math.max(0.01, elapsedTime / 60);
  const wpm = totalTyped > 0 ? Math.max(0, Math.round((cleanCorrectCount / 5) / minutes)) : 0;

  const handleToggleCorrectionMode = () => {
    const nextMode: CorrectionMode = correctionMode === 'free' ? 'strict' : 'free';
    setCorrectionMode(nextMode);
    localStorage.setItem(STORAGE_KEY_CORRECTION_MODE, nextMode);
  };

  // Compute average latency per key in ms
  const computeKeyLatencyAverages = useCallback((): Record<string, number> => {
    const res: Record<string, number> = {};
    Object.entries(keyLatencies).forEach(([k, latencies]) => {
      if (latencies.length > 0) {
        const sum = latencies.reduce((a, b) => a + b, 0);
        res[k] = Math.round(sum / latencies.length);
      }
    });
    return res;
  }, [keyLatencies]);

  // Finish session
  const finishSession = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    onSessionActiveChange?.(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    playSuccessChime(isSoundMuted ? 0 : volume);

    const finalPayload: CoachAnalysisPayload = {
      level,
      target_text: targetText,
      typed_text: typedText,
      duration_seconds: Math.max(1, Math.round(elapsedTime)),
      wpm,
      accuracy,
      raw_accuracy: rawAccuracy,
      corrected_errors_count: correctedErrorsCount,
      uncorrected_errors_count: uncorrectedErrorsCount,
      errors,
      key_latency_ms: computeKeyLatencyAverages(),
      history: history.slice(-5),
    };

    onSessionComplete(finalPayload);
  }, [
    isFinished,
    isSoundMuted,
    volume,
    level,
    targetText,
    typedText,
    elapsedTime,
    wpm,
    accuracy,
    rawAccuracy,
    correctedErrorsCount,
    uncorrectedErrorsCount,
    errors,
    computeKeyLatencyAverages,
    history,
    onSessionComplete,
    onSessionActiveChange,
  ]);

  // Keystroke handler with distinct treatment for errors vs corrections
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    onKeyActivity(e.key);
    setTimeout(() => onKeyActivity(null), 120);

    // Restart shortcut: Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      onReset();
      return;
    }

    // Treatment saat MEMPERBAIKI KETIKAN DENGAN BACKSPACE
    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        playBackspaceSound(isSoundMuted ? 0 : volume * 0.75);
        setLastErrorAlert(null);
      }
      return;
    }

    // Only process single printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();

      const now = Date.now();
      if (!startTime) {
        setStartTime(now);
        onSessionActiveChange?.(true);
      }

      // Measure latency from previous keystroke
      if (lastKeyTimeRef.current) {
        const delta = Math.min(2000, now - lastKeyTimeRef.current);
        const lowerChar = e.key.toLowerCase();
        setKeyLatencies((prev) => ({
          ...prev,
          [lowerChar]: [...(prev[lowerChar] || []), delta],
        }));
      }
      lastKeyTimeRef.current = now;

      const expected = targetText[currentIndex];
      const typed = e.key;
      const wasPositionMistypedBefore = errors.some((err) => err.position === currentIndex);

      if (typed === expected) {
        // === PERLAKUAN BENAR ATAU KOREKSI BERHASIL ===
        if (wasPositionMistypedBefore) {
          // Karakter ini sebelumnya salah ditekan dan SEKARANG BERHASIL DIPERBAIKI!
          playCorrectionChime(isSoundMuted ? 0 : volume);
          setCorrectedPositions((prev) => new Set(prev).add(currentIndex));
          setErrors((prev) =>
            prev.map((err) =>
              err.position === currentIndex ? { ...err, corrected: true } : err
            )
          );
          onCorrectedKeyActivity?.(typed);
          setTimeout(() => onCorrectedKeyActivity?.(null), 250);

          // Tampilkan perayaan mikro bahwa koreksi berhasil
          setShowCorrectionCelebration(true);
          setTimeout(() => setShowCorrectionCelebration(false), 900);
        } else {
          // Benar normal sejak awal
          playKeySound(soundType, isSoundMuted ? 0 : volume);
        }

        setLastErrorAlert(null);
        const nextTyped = typedText + typed;
        setTypedText(nextTyped);

        // Check if finished full text
        if (nextTyped.length >= targetText.length) {
          setTimeout(finishSession, 50);
        }
      } else {
        // === PERLAKUAN SAAT SALAH PENCET TOMBOL (MISTAKE FEEDBACK) ===
        playErrorSound(isSoundMuted ? 0 : volume);

        // Getar visual & sinyal flash merah ke virtual keyboard
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 240);

        onWrongKeyActivity?.(typed);
        setTimeout(() => onWrongKeyActivity?.(null), 250);

        setLastErrorAlert({
          expected: expected || '',
          typed,
          position: currentIndex,
        });

        // Catat ke daftar error
        setErrors((prev) => [
          ...prev,
          {
            expected: expected || '',
            typed,
            position: currentIndex,
            corrected: false,
          },
        ]);

        if (correctionMode === 'strict') {
          // MODE KOREKSI WAJIB (Stop on Error):
          // Kursor TIDAK MAJU! Pengguna harus membetulkan tuts sebelum diizinkan lanjut
        } else {
          // MODE KOREKSI BEBAS:
          // Karakter salah tetap dicatat dan kursor maju, pengguna bisa hapus dengan Backspace kapan pun
          const nextTyped = typedText + typed;
          setTypedText(nextTyped);

          if (nextTyped.length >= targetText.length) {
            setTimeout(finishSession, 50);
          }
        }
      }
    }
  };

  const handleManualAnalyze = () => {
    const finalPayload: CoachAnalysisPayload = {
      level,
      target_text: targetText,
      typed_text: typedText,
      duration_seconds: Math.max(1, Math.round(elapsedTime)),
      wpm,
      accuracy,
      raw_accuracy: rawAccuracy,
      corrected_errors_count: correctedErrorsCount,
      uncorrected_errors_count: uncorrectedErrorsCount,
      errors,
      key_latency_ms: computeKeyLatencyAverages(),
      history: history.slice(-5),
    };
    if (onRequestCoachAnalysis) {
      onRequestCoachAnalysis(finalPayload);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col ${isZenMode ? 'gap-2' : 'gap-3'}`}>
      {/* Real-time Status Bar with Error vs Correction treatment */}
      {isZenMode ? (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs backdrop-blur">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-100">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>{wpm}</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">WPM</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className={accuracy >= 95 ? 'text-emerald-300' : 'text-rose-300'}>{accuracy}%</span>
            </div>

            {/* Uncorrected vs Corrected indicators in Zen mode */}
            {uncorrectedErrorsCount > 0 && (
              <div className="flex items-center gap-1 font-mono text-xs text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-lg border border-rose-500/30">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>{uncorrectedErrorsCount} salah</span>
              </div>
            )}

            {correctedErrorsCount > 0 && (
              <div className="flex items-center gap-1 font-mono text-xs text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
                <CheckCheck className="w-3 h-3 text-amber-400" />
                <span>{correctedErrorsCount} dibenahi</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>{Math.floor(elapsedTime)}s</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Correction mode toggle in Zen */}
            <button
              onClick={handleToggleCorrectionMode}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition border ${
                correctionMode === 'strict'
                  ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={
                correctionMode === 'strict'
                  ? 'Mode Koreksi Wajib Aktif (Kursor tertahan saat salah sampai diperbaiki)'
                  : 'Mode Koreksi Bebas (Bisa lanjut ketik walau salah)'
              }
            >
              {correctionMode === 'strict' ? <ShieldCheck className="w-3 h-3 text-amber-400" /> : <ShieldAlert className="w-3 h-3 text-slate-400" />}
              <span>{correctionMode === 'strict' ? 'Wajib Benahi' : 'Bebas'}</span>
            </button>

            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title={isSoundMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition active:scale-95"
              title="Mulai Ulang Teks (Esc)"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ulangi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur shadow-lg">
          {/* Speed / WPM */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-100 font-mono leading-none">
                {wpm}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                WPM (Kecepatan)
              </div>
            </div>
          </div>

          {/* Accuracy (Clean vs Raw after corrections) */}
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${accuracy >= 95 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-black font-mono leading-none flex items-baseline gap-1.5 ${accuracy >= 95 ? 'text-emerald-300' : 'text-rose-300'}`}>
                <span>{accuracy}%</span>
                {correctedErrorsCount > 0 && (
                  <span className="text-[10px] text-slate-500 font-normal" title={`Akurasi murni sebelum koreksi: ${rawAccuracy}%`}>
                    (Murni: {rawAccuracy}%)
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Akurasi Tuts
              </div>
            </div>
          </div>

          {/* Uncorrected Errors Count */}
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${uncorrectedErrorsCount > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-800/60 text-slate-400 border-slate-700/60'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-black font-mono leading-none ${uncorrectedErrorsCount > 0 ? 'text-rose-300' : 'text-slate-300'}`}>
                {uncorrectedErrorsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Salah Aktif
              </div>
            </div>
          </div>

          {/* Corrected Errors Counter (Perlakuan Perbaikan) */}
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${correctedErrorsCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800/60 text-slate-400 border-slate-700/60'}`}>
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-black font-mono leading-none ${correctedErrorsCount > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                {correctedErrorsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Diperbaiki
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-100 font-mono leading-none">
                {Math.floor(elapsedTime)}s
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Durasi
              </div>
            </div>
          </div>

          {/* Actions & Correction Policy Setting */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mode Koreksi Switch */}
            <button
              onClick={handleToggleCorrectionMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                correctionMode === 'strict'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-950/40'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={
                correctionMode === 'strict'
                  ? 'Mode Koreksi: WAJIB BENAHI (Kursor tertahan saat salah hingga kamu menekan Backspace atau tuts yang benar)'
                  : 'Mode Koreksi: BEBAS (Kamu boleh lanjut mengetik walau salah, dan memperbaikinya kapan saja)'
              }
            >
              {correctionMode === 'strict' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden sm:inline">Koreksi:</span>
              <span>{correctionMode === 'strict' ? 'Wajib Benahi' : 'Bebas'}</span>
            </button>

            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title={isSoundMuted ? 'Nyalakan Suara Ketikan' : 'Bisukan Suara Ketikan'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 active:scale-95"
              title="Mulai Ulang (Esc)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ulangi</span>
            </button>

            {typedText.length >= 10 && (
              <button
                onClick={handleManualAnalyze}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisis Coach</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Helper Banner saat salah pencet tombol atau saat berhasil koreksi */}
      {lastErrorAlert && (
        <div className="w-full px-3.5 py-2 rounded-xl bg-rose-950/60 border border-rose-500/50 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-200 shadow-md shadow-rose-950/40 animate-shake">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Salah Pencet:</strong> Tuts{' '}
              <code className="px-1.5 py-0.5 rounded bg-rose-900/80 font-mono font-bold text-white border border-rose-500/60">
                {lastErrorAlert.typed === ' ' ? 'Spasi' : lastErrorAlert.typed}
              </code>{' '}
              meleset! Seharusnya tuts{' '}
              <code className="px-1.5 py-0.5 rounded bg-blue-900/80 font-mono font-bold text-blue-200 border border-blue-400/60">
                {lastErrorAlert.expected === ' ' ? 'Spasi' : lastErrorAlert.expected}
              </code>
              {correctionMode === 'strict' && ' — Kursor tertahan sampai kamu membetulkannya.'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
            <span>Tekan</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700 font-mono text-[10px]">
              Backspace
            </kbd>
            <span>atau tuts yang benar</span>
          </div>
        </div>
      )}

      {showCorrectionCelebration && !lastErrorAlert && (
        <div className="w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 flex items-center justify-between text-xs text-amber-200 shadow-md shadow-amber-950/30 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Koreksi Berhasil!</strong> Kesalahan pengetikan telah kamu benahi — akurasi sesi pulih kembali.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            +1 Dibenahi
          </span>
        </div>
      )}

      {/* Interactive Text Display Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`relative w-full ${
          isZenMode
            ? 'p-4 sm:p-6 min-h-[120px] max-h-[220px] overflow-y-auto'
            : 'p-6 sm:p-8 min-h-[170px]'
        } bg-slate-900/90 rounded-2xl border-2 ${
          isShaking
            ? 'border-rose-500 ring-2 ring-rose-500/40 animate-shake'
            : lastErrorAlert
            ? 'border-rose-500/70'
            : 'border-slate-800 hover:border-slate-700 focus-within:border-blue-500/60'
        } shadow-xl cursor-text transition select-none flex flex-col justify-center`}
      >
        {/* Hidden input to capture physical keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 opacity-0 cursor-default pointer-events-none"
          autoFocus
          aria-label="Ketik teks latihan di sini"
        />

        {/* Text Container with 3 Distinct Character States:
            1. Hijau (Benar Langsung)
            2. Amber/Kuning (Telah Diperbaiki / Dibenarkan setelah salah)
            3. Merah (Salah Pencet / Belum Dibenarkan)
        */}
        <div className="font-mono text-lg sm:text-2xl leading-relaxed sm:leading-loose tracking-wide break-words">
          {targetText.split('').map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const typedChar = typedText[index];

            const isCurrentlyWrong = isTyped && typedChar !== char;
            const isCorrected = isTyped && typedChar === char && correctedPositions.has(index);
            const isPureCorrect = isTyped && typedChar === char && !correctedPositions.has(index);

            let charStyle = 'text-slate-500'; // Default: upcoming

            if (isCurrentlyWrong) {
              // PERLAKUAN SALAH PENCET: Merah menyala, tebal, garis bawah bergelombang
              charStyle = 'text-rose-300 bg-rose-500/25 ring-2 ring-rose-500/80 font-bold underline decoration-rose-500 decoration-wavy rounded px-0.5';
            } else if (isCorrected) {
              // PERLAKUAN TELAH DIPERBAIKI: Amber keemasan, penanda perbaikan
              charStyle = 'text-amber-300 bg-amber-500/20 border-b-2 border-amber-400 font-semibold rounded-t px-0.5 animate-correction';
            } else if (isPureCorrect) {
              // BENAR MURNI: Hijau zamrud
              charStyle = 'text-emerald-400';
            }

            const isCurrentErrorCursor = isCurrent && lastErrorAlert && lastErrorAlert.position === currentIndex;

            return (
              <span
                key={index}
                className={`relative inline transition-colors ${charStyle} ${
                  isCurrentErrorCursor
                    ? 'bg-rose-500/30 text-rose-200 ring-2 ring-rose-500 rounded-sm animate-shake'
                    : isCurrent
                    ? 'bg-blue-500/20 text-blue-200 ring-2 ring-blue-400/80 rounded-sm'
                    : ''
                }`}
                title={
                  isCorrected
                    ? `Tuts '${char === ' ' ? 'Spasi' : char}' berhasil dibenahi`
                    : isCurrentlyWrong
                    ? `Salah: diketik '${typedChar === ' ' ? 'Spasi' : typedChar}', seharusnya '${char === ' ' ? 'Spasi' : char}'`
                    : undefined
                }
              >
                {/* Blinking cursor */}
                {isCurrent && (
                  <span
                    className={`absolute -left-[1px] top-0 bottom-0 w-0.5 ${
                      isCurrentErrorCursor ? 'bg-rose-400' : 'bg-blue-400'
                    } animate-pulse`}
                  />
                )}

                {/* Amber dot indicator above corrected letters */}
                {isCorrected && (
                  <span
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"
                    title="Telah Dibenahi"
                  />
                )}

                {/* Character display */}
                {isCurrentlyWrong && typedChar ? (
                  <span className="relative">
                    <span className="opacity-90">{typedChar === ' ' ? '␣' : typedChar}</span>
                    <span className="text-[10px] absolute -bottom-3 left-1/2 -translate-x-1/2 text-rose-400 font-sans font-normal opacity-80">
                      ↓{char === ' ' ? '␣' : char}
                    </span>
                  </span>
                ) : char === ' ' && isCurrent ? (
                  '␣'
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>

        {/* Bottom Helper Bar with Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          {/* Status Karakter & Legend Perlakuan */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              Karakter:{' '}
              <span className="font-mono text-slate-300 font-semibold">
                {currentIndex} / {targetText.length}
              </span>
            </div>

            {/* Visual Legend */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-800 text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Benar Langsung
              </span>
              <span className="inline-flex items-center gap-1 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Telah Diperbaiki (Backspace)
              </span>
              <span className="inline-flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Salah Pencet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span>
              Tekan{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">
                Esc
              </kbd>{' '}
              ulang sesi
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-blue-400/80">
              Perbaiki kesalahan untuk memulihkan akurasi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
