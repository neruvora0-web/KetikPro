import React from 'react';
import { X, CheckCircle, ShieldAlert, Award, Compass, HeartHandshake } from 'lucide-react';
import { FINGERS } from '../utils/fingerMap';

interface PrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinciplesModal: React.FC<PrinciplesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Prinsip Mengetik 10 Jari & KetikPro Coach
              </h3>
              <p className="text-xs text-slate-400">
                Fondasi teknik mengetik buta (touch typing) yang benar dan ergonomis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-slate-300">
          {/* 5 Core Principles */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              5 Prinsip Melatih KetikPro Coach
            </h4>

            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">1. Akurasi dulu, baru kecepatan:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Jangan pernah terburu-buru mengejar WPM tinggi jika akurasi di bawah 95%. Kecepatan adalah efek samping dari gerakan yang presisi tanpa ragu.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">2. Posisi jangkar Home Row (ASDF JKL;):</strong>
                  <p className="text-slate-400 mt-0.5">
                    Gunakan tonjolan taktil pada huruf <strong>F</strong> (telunjuk kiri) dan <strong>J</strong> (telunjuk kanan) sebagai acuan tanpa perlu menatap papan ketik.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">3. Satu tuts untuk satu jari:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Hindari menggunakan jari yang sama secara sembarangan untuk menekan tuts yang bukan porsinya. Setiap jari memiliki zona tanggung jawabnya sendiri.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">4. Fokus pada 1-2 kelemahan per sesi:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Perbaikan kecil yang terarah jauh lebih efektif daripada mencoba memperbaiki semua kesalahan sekaligus dalam waktu bersamaan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3">
                <HeartHandshake className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">5. Ketenangan & Ritme:</strong>
                  <p className="text-slate-400 mt-0.5">
                    Irama mengetik yang stabil dan rileks akan membuat otot tangan tidak mudah lelah serta meminimalkan salah ketik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ergonomics guide */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              Tips Postur & Ergonomi
            </h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Duduk tegak dengan punggung ditopang kursi secara nyaman.</li>
              <li>Pergelangan tangan menggantung ringan dan lurus, jangan menekan ujung meja.</li>
              <li>Siku membentuk sudut sekitar 90 derajat dengan posisi bahu rileks.</li>
              <li>Ambil jeda istirahat 1-2 menit setelah 20-30 menit latihan mengetik.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-500/25"
          >
            Mengerti, Siap Latihan!
          </button>
        </div>
      </div>
    </div>
  );
};
