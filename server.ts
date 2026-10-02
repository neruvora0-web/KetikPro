import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '1mb' }));

// Finger mapping standard QWERTY
const FINGER_MAP: Record<string, string> = {
  // Kiri
  q: 'Kelingking Kiri', a: 'Kelingking Kiri', z: 'Kelingking Kiri', '1': 'Kelingking Kiri', '`': 'Kelingking Kiri',
  w: 'Jari Manis Kiri', s: 'Jari Manis Kiri', x: 'Jari Manis Kiri', '2': 'Jari Manis Kiri',
  e: 'Jari Tengah Kiri', d: 'Jari Tengah Kiri', c: 'Jari Tengah Kiri', '3': 'Jari Tengah Kiri',
  r: 'Telunjuk Kiri', f: 'Telunjuk Kiri', v: 'Telunjuk Kiri', '4': 'Telunjuk Kiri',
  t: 'Telunjuk Kiri', g: 'Telunjuk Kiri', b: 'Telunjuk Kiri', '5': 'Telunjuk Kiri',
  // Kanan
  y: 'Telunjuk Kanan', h: 'Telunjuk Kanan', n: 'Telunjuk Kanan', '6': 'Telunjuk Kanan',
  u: 'Telunjuk Kanan', j: 'Telunjuk Kanan', m: 'Telunjuk Kanan', '7': 'Telunjuk Kanan',
  i: 'Jari Tengah Kanan', k: 'Jari Tengah Kanan', ',': 'Jari Tengah Kanan', '<': 'Jari Tengah Kanan', '8': 'Jari Tengah Kanan',
  o: 'Jari Manis Kanan', l: 'Jari Manis Kanan', '.': 'Jari Manis Kanan', '>': 'Jari Manis Kanan', '9': 'Jari Manis Kanan',
  p: 'Kelingking Kanan', ';': 'Kelingking Kanan', ':': 'Kelingking Kanan', '/': 'Kelingking Kanan', '?': 'Kelingking Kanan',
  '[': 'Kelingking Kanan', ']': 'Kelingking Kanan', '-': 'Kelingking Kanan', '=': 'Kelingking Kanan', '0': 'Kelingking Kanan',
  ' ': 'Ibu Jari (Spasi)',
};

// Fallback intelligent Indonesian rule-based coach analyzer
function generateLocalCoachAnalysis(data: {
  level: 'pemula' | 'menengah' | 'mahir';
  target_text: string;
  typed_text: string;
  duration_seconds: number;
  wpm: number;
  accuracy: number;
  raw_accuracy?: number;
  corrected_errors_count?: number;
  uncorrected_errors_count?: number;
  errors: Array<{ expected: string; typed: string; position: number }>;
  key_latency_ms: Record<string, number>;
  history?: Array<{ date: string; wpm: number; accuracy: number }>;
}) {
  const { level, typed_text, wpm, accuracy, errors, key_latency_ms, history = [] } = data;

  if (!typed_text || typed_text.length < 10) {
    return {
      ringkasan: 'Data ketikan masih terlalu sedikit (kurang dari 10 karakter). Yuk selesaikan minimal satu paragraf latihan agar analisisku akurat.',
      pujian: 'Inisiatif awal untuk mulai latihan sudah bagus.',
      kelemahan_utama: [
        {
          masalah: 'Latihan belum selesai',
          jari: 'Semua Jari',
          tuts: ['f', 'j'],
        },
      ],
      saran_latihan: ['Ketik teks latihan sampai tuntas untuk evaluasi menyeluruh.'],
      teks_latihan_berikutnya: 'asdf jkl; asdf jkl; fff jjj ddd kkk sss lll aaa ;;;',
      target_sesi_berikutnya: { wpm: 20, accuracy: 95 },
      saran_naik_level: false,
      motivasi: 'Satu langkah kecil hari ini adalah fondasi kecepatan jarimu esok hari!',
    };
  }

  // Count error frequency by expected char
  const errCount: Record<string, number> = {};
  const swappedPairs: Record<string, number> = {};
  errors.forEach((e) => {
    const exp = (e.expected || '').toLowerCase();
    const typ = (e.typed || '').toLowerCase();
    errCount[exp] = (errCount[exp] || 0) + 1;
    if (exp && typ && exp !== typ) {
      const pair = [exp, typ].sort().join('↔');
      swappedPairs[pair] = (swappedPairs[pair] || 0) + 1;
    }
  });

  const sortedErrors = Object.entries(errCount).sort((a, b) => b[1] - a[1]);
  const sortedPairs = Object.entries(swappedPairs).sort((a, b) => b[1] - a[1]);

  // Identify high latency keys
  const sortedLatency = Object.entries(key_latency_ms || {})
    .filter(([k]) => k.trim().length > 0)
    .sort((a, b) => b[1] - a[1]);

  const topWeakKeys: string[] = [];
  if (sortedErrors.length > 0) {
    topWeakKeys.push(sortedErrors[0][0]);
    if (sortedErrors.length > 1) topWeakKeys.push(sortedErrors[1][0]);
  } else if (sortedLatency.length > 0) {
    topWeakKeys.push(sortedLatency[0][0]);
  } else {
    topWeakKeys.push('f', 'j');
  }

  const primaryKey = topWeakKeys[0] || 'a';
  const relatedFinger = FINGER_MAP[primaryKey] || 'Telunjuk';

  // Compare with history
  let trendComment = '';
  if (history.length > 0) {
    const prev = history[history.length - 1];
    if (accuracy > prev.accuracy) {
      trendComment = `Akurasi naik ${Math.round(accuracy - prev.accuracy)}% dibanding sesi sebelumnya.`;
    } else if (wpm > prev.wpm) {
      trendComment = `Kecepatan naik ${Math.round(wpm - prev.wpm)} WPM.`;
    }
  }

  const correctionComment = (data.corrected_errors_count && data.corrected_errors_count > 0)
    ? ` Refleks perbaikan tuts sangat baik (${data.corrected_errors_count} kesalahan berhasil kamu benahi).`
    : '';

  const pujian = accuracy >= 95
    ? `Akurasi sangat solid di angka ${Math.round(accuracy)}%!${correctionComment} ${trendComment}`.trim()
    : wpm >= 30
    ? `Irama mengetik stabil di ${Math.round(wpm)} WPM, pertahankan posisi santai.${correctionComment} ${trendComment}`.trim()
    : `Bagus telah menuntaskan sesi dengan durasi fokus ${Math.round(data.duration_seconds)} detik.${correctionComment}`.trim();

  const kelemahan_utama = [];
  if (sortedPairs.length > 0 && sortedPairs[0][1] >= 2) {
    const [p, c] = sortedPairs[0];
    const tuts = p.split('↔');
    kelemahan_utama.push({
      masalah: `Tuts sering tertukar ${p} (${c}x), sinyal koordinasi jari berdekatan belum refleks`,
      jari: FINGER_MAP[tuts[0]] || relatedFinger,
      tuts,
    });
  } else if (sortedErrors.length > 0) {
    kelemahan_utama.push({
      masalah: `Tuts '${primaryKey}' meleset ${sortedErrors[0][1]}x`,
      jari: relatedFinger,
      tuts: topWeakKeys.slice(0, 3),
    });
  } else if (sortedLatency.length > 0 && sortedLatency[0][1] > 350) {
    kelemahan_utama.push({
      masalah: `Jeda tuts '${sortedLatency[0][0]}' masih tinggi (${Math.round(sortedLatency[0][1])}ms)`,
      jari: FINGER_MAP[sortedLatency[0][0]] || 'Telunjuk',
      tuts: [sortedLatency[0][0]],
    });
  } else {
    kelemahan_utama.push({
      masalah: 'Transisi perpindahan baris home row ke atas/bawah',
      jari: relatedFinger,
      tuts: topWeakKeys,
    });
  }

  const saran_latihan = [];
  if (accuracy < 95) {
    saran_latihan.push(`Turunkan kecepatan 10% dan prioritaskan tanpa salah pada tuts ${topWeakKeys.join(', ')}.`);
    saran_latihan.push(`Kembalikan jari ke jangkar home row (F & J) setiap selesai menekan.`);
  } else {
    saran_latihan.push(`Pertahankan akurasi di atas 95% sambil mulai menaikkan tempo secara berirama.`);
    saran_latihan.push(`Latih tuts ${topWeakKeys.join(' & ')} tanpa melihat papan ketik sama sekali.`);
  }

  // Drill text focused on weak tuts
  const k1 = topWeakKeys[0] || 'a';
  const k2 = topWeakKeys[1] || 's';
  const teks_latihan_berikutnya = `f${k1}j ${k1}${k2} ${k2}${k1} d${k1}k ${k1}${k2}${k1} ${k2}${k1}${k2} f${k1}d ${k2}s ${k1}ada ${k2}aja ${k1}kata ${k2}saat`.slice(0, 180);

  const canPromote = accuracy >= 97 && (
    (level === 'pemula' && wpm >= 28) ||
    (level === 'menengah' && wpm >= 55)
  );

  const targetWpm = accuracy < 95 ? Math.max(15, Math.round(wpm * 0.95)) : Math.round(wpm + 4);
  const targetAcc = Math.min(100, Math.max(96, Math.round(accuracy + 1)));

  const targetFingers: string[] = [relatedFinger];
  if (k2 && FINGER_MAP[k2] && !targetFingers.includes(FINGER_MAP[k2])) {
    targetFingers.push(FINGER_MAP[k2]);
  }

  // Meaningful Indonesian lesson text designed specifically by AI around the user's weak keys
  let dynamicLessonText = '';
  if (['e', 'r', 't'].includes(primaryKey)) {
    dynamicLessonText = 'Kerja keras dan ketekunan melatih reflek jemari akan mempercepat langkahmu meraih keahlian mengetik sepuluh jari yang mantap dan akurat.';
  } else if (['u', 'i', 'o'].includes(primaryKey)) {
    dynamicLessonText = 'Untuk meraih posisi juara, kamu harus terus mengulang ritme tuts ini dengan konsistensi tinggi tanpa menatap papan ketik sama sekali.';
  } else if (['a', 's', 'd', 'f'].includes(primaryKey)) {
    dynamicLessonText = 'Saat fajar tiba, ada rasa damai di dada saat kita melangkah bersama dan menjaga asa agar cita-cita kita tetap ada di masa depan.';
  } else if (['j', 'k', 'l', ';'].includes(primaryKey)) {
    dynamicLessonText = 'Jalan kita selalu terbuka jika kita melangkah dengan jujur dan selalu menjaga kebaikan dalam setiap langkah kehidupan kita.';
  } else if (['q', 'w', 'z', 'x', 'c', 'v', 'b', 'n', 'm'].includes(primaryKey)) {
    dynamicLessonText = 'Variasi tuts bawah dan sudut memerlukan kelenturan jari yang tenang agar perpindahan posisi dari home row tetap mulus dan berirama.';
  } else {
    dynamicLessonText = `Latihan khusus tuts ${primaryKey.toUpperCase()} dan ${k2.toUpperCase()} ini dirancang untuk memperkuat memori otot jemarimu agar kecepatan mengetik meningkat stabil.`;
  }

  const ai_lesson = {
    judul: `Lesson AI: Penajaman Tuts '${primaryKey.toUpperCase()}' & '${k2.toUpperCase()}'`,
    panduan_fokus: `Pusatkan perhatian pada ${targetFingers.join(' dan ')}. Pastikan jari selalu kembali ke jangkar home row (F dan J) setelah menekan tuts target.`,
    jari_fokus: targetFingers,
    teks_lesson: dynamicLessonText,
    alasan_rekomendasi: `AI merancang teks kalimat bermakna ini khusus untuk melatih tuts '${primaryKey.toUpperCase()}' yang tadi meleset atau memiliki jeda waktu tertinggi.`,
  };

  return {
    ringkasan: accuracy >= 95
      ? `Sesi yang sangat rapi di level ${level}! Fokus utamamu tinggal memperhalus koordinasi tuts tertentu.`
      : `Hasil cukup baik, namun utamakan akurasi dulu sebelum mengejar kecepatan WPM.`,
    pujian,
    kelemahan_utama,
    saran_latihan,
    teks_latihan_berikutnya,
    target_sesi_berikutnya: {
      wpm: targetWpm,
      accuracy: targetAcc,
    },
    saran_naik_level: canPromote,
    motivasi: 'Irama yang tenang menghasilkan ketukan yang pasti dan jari yang lincah.',
    ai_lesson,
  };
}

// POST /api/coach
app.post('/api/coach', async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Payload tidak valid' });
  }

  // If GEMINI_API_KEY is not configured or user is in fallback mode
  if (!process.env.GEMINI_API_KEY) {
    const analysis = generateLocalCoachAnalysis(payload);
    return res.json(analysis);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Kamu adalah "KetikPro Coach", pelatih mengetik 10 jari di dalam aplikasi latihan mengetik. Tugasmu: menganalisis hasil latihan pengguna dan memberi feedback yang singkat, spesifik, dan memotivasi, supaya pengguna makin cepat DAN makin akurat.

## Prinsip Melatih
1. Akurasi dulu, baru kecepatan. Jangan menyarankan ngebut jika akurasi < 95%.
2. Teknik yang benar (posisi home row, jari yang tepat, tidak menatap keyboard) lebih penting daripada angka WPM sesaat.
3. Fokus pada 1-2 kelemahan terbesar per sesi, jangan menyebutkan semuanya sekaligus.
4. Puji hal yang benar-benar membaik, dengan angka. Jangan memuji berlebihan atau kosong.
5. Nada ramah, santai, dan suportif. Gunakan bahasa Indonesia sehari-hari yang sopan. Jangan menghakimi.

## Cara Menganalisis
- Kelompokkan kesalahan: huruf yang sering salah, pasangan tuts yang tertukar (mis. a↔s), kesalahan di jari tertentu, angka/simbol/huruf kapital, atau spasi.
- Petakan huruf yang salah ke jari yang seharusnya memakainya (standar QWERTY, home row ASDF JKL;).
- Deteksi jeda panjang (key_latency tinggi) sebagai tanda tuts yang belum hafal.
- Bandingkan dengan history untuk melihat tren (naik, stagnan, turun).
- Kalau accuracy >= 97% dan WPM stabil, sarankan naik level atau tingkatkan tempo.

## Batas Target (acuan)
- Pemula: 20-30 WPM, akurasi >= 95%
- Menengah: 40-60 WPM, akurasi >= 96%
- Mahir: 70+ WPM, akurasi >= 98%

## Aturan Tambahan
- Maksimal total 150 kata di semua field teks.
- Rancang "ai_lesson": buat judul lesson yang menarik, panduan fokus jari/teknik, jari yang dilatih, serta teks tulisan latihan yang mengalir alami dalam bahasa Indonesia (100-220 karakter) yang memadukan kata-kata nyata berisi tuts yang sering salah/lambat. Jangan membuat tuts acak tanpa arti, melainkan kalimat bermakna dan memikat.
- Jangan mengarang data yang tidak ada di input.
- Jika data terlalu sedikit (mis. < 10 karakter), minta pengguna berlatih lebih lama lewat field "ringkasan".
- Tips ergonomi (postur, istirahat, posisi pergelangan) hanya diberikan sesekali, bukan di setiap sesi.
- Output WAJIB JSON murni sesuai responseSchema.`;

    const userPrompt = `Analisis data sesi latihan mengetik pengguna berikut ini dan berikan umpan balik pelatih KetikPro Coach beserta paket materi "ai_lesson" khusus:
${JSON.stringify(payload, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ringkasan: {
              type: Type.STRING,
              description: '1-2 kalimat penilaian sesi ini',
            },
            pujian: {
              type: Type.STRING,
              description: '1 hal spesifik yang sudah bagus, sertakan angka jika ada',
            },
            kelemahan_utama: {
              type: Type.ARRAY,
              description: '1-2 kelemahan terbesar',
              items: {
                type: Type.OBJECT,
                properties: {
                  masalah: { type: Type.STRING, description: 'Penjelasan singkat masalah' },
                  jari: { type: Type.STRING, description: 'Jari yang terkait (mis. Kelingking Kiri)' },
                  tuts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Tuts huruf yang bermasalah',
                  },
                },
                required: ['masalah', 'jari', 'tuts'],
              },
            },
            saran_latihan: {
              type: Type.ARRAY,
              description: '1-3 latihan konkret dan singkat yang bisa langsung dilakukan',
              items: { type: Type.STRING },
            },
            teks_latihan_berikutnya: {
              type: Type.STRING,
              description: 'Kalimat/kata latihan (maks 200 karakter) yang menekankan tuts yang sering salah',
            },
            target_sesi_berikutnya: {
              type: Type.OBJECT,
              properties: {
                wpm: { type: Type.NUMBER },
                accuracy: { type: Type.NUMBER },
              },
              required: ['wpm', 'accuracy'],
            },
            saran_naik_level: {
              type: Type.BOOLEAN,
              description: 'True jika akurasi >= 97% dan WPM stabil untuk naik level',
            },
            motivasi: {
              type: Type.STRING,
              description: '1 kalimat penyemangat yang singkat dan tidak klise',
            },
            ai_lesson: {
              type: Type.OBJECT,
              description: 'Materi lesson terstruktur lengkap yang dibuat oleh AI berdasarkan evaluasi sesi barusan',
              properties: {
                judul: {
                  type: Type.STRING,
                  description: 'Judul materi lesson yang menarik dan relevan dengan tuts yang dilatih (mis. Lesson AI: Penaklukan Tuts R dan E)',
                },
                panduan_fokus: {
                  type: Type.STRING,
                  description: 'Panduan instruksional singkat dari AI tentang cara meletakkan jari dan postur mengetik materi ini',
                },
                jari_fokus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Nama-nama jari yang menjadi fokus utama latihan ini',
                },
                teks_lesson: {
                  type: Type.STRING,
                  description: 'Teks materi tulisan yang dibuat langsung oleh AI berupa kalimat bahasa Indonesia yang mengalir alami, kaya akan tuts target yang sering salah/lambat (100-220 karakter). Harus berupa kalimat bermakna dan memotivasi, bukan sekadar tuts acak.',
                },
                alasan_rekomendasi: {
                  type: Type.STRING,
                  description: 'Alasan mengapa AI membuat materi kalimat ini untuk pengguna',
                },
              },
              required: ['judul', 'panduan_fokus', 'jari_fokus', 'teks_lesson', 'alasan_rekomendasi'],
            },
          },
          required: [
            'ringkasan',
            'pujian',
            'kelemahan_utama',
            'saran_latihan',
            'teks_latihan_berikutnya',
            'target_sesi_berikutnya',
            'saran_naik_level',
            'motivasi',
            'ai_lesson',
          ],
        },
      },
    });

    const textOutput = response.text || '';
    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini Coach error:', error);
    // Fall back to rule-based analysis so user experience is smooth
    const fallback = generateLocalCoachAnalysis(payload);
    return res.json(fallback);
  }
});

// POST /api/ai-lesson: Generate a standalone AI Lesson on demand
app.post('/api/ai-lesson', async (req, res) => {
  const { level = 'pemula', focus_keys = [], recent_wpm = 30 } = req.body || {};

  if (!process.env.GEMINI_API_KEY) {
    const fallback = generateLocalCoachAnalysis({
      level,
      target_text: '',
      typed_text: 'sample testing text',
      duration_seconds: 30,
      wpm: recent_wpm,
      accuracy: 95,
      errors: focus_keys.map((k: string) => ({ expected: k, typed: '', position: 0 })),
      key_latency_ms: {},
    });
    return res.json(fallback.ai_lesson);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Buatlah sebuah materi lesson latihan mengetik 10 jari khusus ("ai_lesson") untuk level "${level}".
Fokus tuts: ${focus_keys.length > 0 ? focus_keys.join(', ') : 'home row dan tuts transisi umum'}.
Teks harus berupa kalimat bahasa Indonesia yang mengalir alami, indah, dan berbobot (120-200 karakter) yang kaya akan tuts fokus tersebut, bukan deretan huruf acak.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judul: { type: Type.STRING },
            panduan_fokus: { type: Type.STRING },
            jari_fokus: { type: Type.ARRAY, items: { type: Type.STRING } },
            teks_lesson: { type: Type.STRING },
            alasan_rekomendasi: { type: Type.STRING },
          },
          required: ['judul', 'panduan_fokus', 'jari_fokus', 'teks_lesson', 'alasan_rekomendasi'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating AI lesson:', err);
    const fallback = generateLocalCoachAnalysis({
      level,
      target_text: '',
      typed_text: 'sample fallback text',
      duration_seconds: 30,
      wpm: recent_wpm,
      accuracy: 95,
      errors: focus_keys.map((k: string) => ({ expected: k, typed: '', position: 0 })),
      key_latency_ms: {},
    });
    return res.json(fallback.ai_lesson);
  }
});

// Full-stack Vite dev middleware or static dist serve
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KetikPro Coach Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
