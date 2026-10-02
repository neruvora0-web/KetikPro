export type Level = 'pemula' | 'menengah' | 'mahir';
export type CorrectionMode = 'free' | 'strict';

export interface KeystrokeError {
  expected: string;
  typed: string;
  position: number;
  corrected?: boolean;
}

export interface SessionHistoryItem {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  raw_accuracy?: number;
  level: Level;
  duration_seconds: number;
  weak_keys?: string[];
  missed_keys_counts?: Record<string, number>;
  corrected_count?: number;
  uncorrected_count?: number;
}

export interface CoachAnalysisPayload {
  level: Level;
  target_text: string;
  typed_text: string;
  duration_seconds: number;
  wpm: number;
  accuracy: number;
  raw_accuracy?: number;
  corrected_errors_count?: number;
  uncorrected_errors_count?: number;
  errors: KeystrokeError[];
  key_latency_ms: Record<string, number>;
  history: Array<{ date: string; wpm: number; accuracy: number }>;
}

export interface WeaknessItem {
  masalah: string;
  jari: string;
  tuts: string[];
}

export interface AILesson {
  judul: string;
  panduan_fokus: string;
  jari_fokus: string[];
  teks_lesson: string;
  alasan_rekomendasi: string;
}

export interface CoachResponse {
  ringkasan: string;
  pujian: string;
  kelemahan_utama: WeaknessItem[];
  saran_latihan: string[];
  teks_latihan_berikutnya: string;
  target_sesi_berikutnya: {
    wpm: number;
    accuracy: number;
  };
  saran_naik_level: boolean;
  motivasi: string;
  ai_lesson?: AILesson;
}

export type SoundType = 'linear' | 'tactile' | 'clicky' | 'thock' | 'muted';
