import { Level } from '../types';

export interface Lesson {
  id: string;
  level: Level;
  title: string;
  subtitle: string;
  focusKeys: string[];
  text: string;
}

export const LESSONS: Record<Level, Lesson[]> = {
  pemula: [
    {
      id: 'pemula-1',
      level: 'pemula',
      title: 'Home Row Dasar',
      subtitle: 'Kuasai jangkar jari F dan J serta tuts ASDF JKL;',
      focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
      text: 'asdf jkl; asdf jkl; fff jjj ddd kkk sss lll aaa ;;; fj fj dk sl a; fasd jkls fasa dala jaja salak',
    },
    {
      id: 'pemula-2',
      level: 'pemula',
      title: 'Kata Dasar Home Row',
      subtitle: 'Membentuk kata sederhana tanpa menggeser jari keluar baris tengah',
      focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
      text: 'fajar kalah salah lafal salad ada kas kasur jasa fasa lada kaca saja kala jala lada asa falsafah',
    },
    {
      id: 'pemula-3',
      level: 'pemula',
      title: 'Jangkauan Atas: E dan I',
      subtitle: 'Latih jari tengah kiri (E) dan jari tengah kanan (I)',
      focusKeys: ['e', 'i', 'd', 'k'],
      text: 'desa kaki sate kado lagi didik fajar lidah jika jadi kedai selai sejuk elok lele kali sedap enak',
    },
    {
      id: 'pemula-4',
      level: 'pemula',
      title: 'Jangkauan Bawah: V, M, C, N',
      subtitle: 'Latih telunjuk dan jari tengah menjangkau baris bawah',
      focusKeys: ['v', 'm', 'c', 'n', 'b'],
      text: 'makan kaca mama cara nama mana nina vanila manis cuma bila ban kabar cinta dan masa depan cerah',
    },
    {
      id: 'pemula-5',
      level: 'pemula',
      title: 'Kalimat Pemula Berirama',
      subtitle: 'Mulai merangkai kalimat utuh dengan ritme tenang dan konsisten',
      focusKeys: ['spasi', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
      text: 'pagi ini kita belajar mengetik sepuluh jari dengan tenang tanpa perlu melihat papan ketik sama sekali.',
    },
  ],
  menengah: [
    {
      id: 'menengah-1',
      level: 'menengah',
      title: 'Kelancaran Kosakata Bahasa Indonesia',
      subtitle: 'Kata-kata umum dengan variasi huruf kapital dan titik koma',
      focusKeys: ['Shift', 'koma', 'titik'],
      text: 'Mengetik sepuluh jari bukan tentang siapa yang paling cepat menekan tuts, melainkan siapa yang mampu menjaga ketenangan dan akurasi tinggi.',
    },
    {
      id: 'menengah-2',
      level: 'menengah',
      title: 'Kombinasi Huruf Kelingking & Manis',
      subtitle: 'Menghilangkan keraguan pada tuts P, Q, Z, X, O, W',
      focusKeys: ['p', 'q', 'z', 'w', 'o', 'x'],
      text: 'Setiap pejuang produktivitas paham bahwa waktu yang dihemat dari mengetik cepat dapat dialihkan untuk berpikir kreatif dan menyusun karya.',
    },
    {
      id: 'menengah-3',
      level: 'menengah',
      title: 'Pola Tanda Baca & Angka Dasar',
      subtitle: 'Mengetik angka dan simbol tanpa kehilangan posisi home row',
      focusKeys: ['angka', 'simbol', 'kutip'],
      text: 'Pada tahun 2026, lebih dari 85% pekerjaan menuntut kemampuan komunikasi digital yang cepat, tepat, dan bebas dari salah ketik.',
    },
    {
      id: 'menengah-4',
      level: 'menengah',
      title: 'Paragraf Cerita Pendek',
      subtitle: 'Menguji daya tahan fokus selama 60 detik penuh',
      focusKeys: ['ritme', 'fokus', 'spasi'],
      text: 'Hujan rintik membasahi kaca jendela ketika Danu menyalakan laptop tuanya. Jari-jemarinya mulai menari lincah di atas tuts hitam yang sudah mulai pudar warnanya.',
    },
  ],
  mahir: [
    {
      id: 'mahir-1',
      level: 'mahir',
      title: 'Teks Kecepatan Tinggi (70+ WPM)',
      subtitle: 'Tantangan tempo cepat dengan struktur kalimat kompleks',
      focusKeys: ['semua', 'kecepatan', 'refleks'],
      text: 'Keberhasilan seseorang dalam menguasai keahlian motorik halus seperti mengetik buta terletak pada konsistensi repetisi harian, bukan durasi maraton yang melelahkan dalam satu malam.',
    },
    {
      id: 'mahir-2',
      level: 'mahir',
      title: 'Simbol Koding & Karakter Khusus',
      subtitle: 'Latihan tuts kurung, tanda seru, petik, dan angka kombinasi',
      focusKeys: ['(', ')', '{', '}', ';', ':', '_', '-'],
      text: 'const hasil = data.filter((item) => item.skor >= 95 && item.status === "aktif"); console.log("Total pengguna mahir:", hasil.length);',
    },
    {
      id: 'mahir-3',
      level: 'mahir',
      title: 'Kutipan Inspirasi & Sastra Indonesia',
      subtitle: 'Kosa kata puitis dan kaya rima untuk menguji fleksibilitas jari',
      focusKeys: ['kelenturan', 'diksi', 'kepekaan'],
      text: 'Hidup yang tidak dipertaruhkan tidak akan pernah dimenangkan. Teruslah melangkah, asah ketajaman pikiran, dan biarkan jemarimu menuturkan bait-bait keberanian tanpa ragu sedikit pun.',
    },
  ],
};

export const QUICK_DRILLS = [
  {
    name: 'Home Row ASDF JKL;',
    text: 'asdf jkl; asdf jkl; ffff jjjj dddd kkkk ssss llll aaaa ;;;;',
  },
  {
    name: 'Kelingking & Huruf Vokal',
    text: 'apa polo quran ziarah wawasan ekstra awan awal asa paksa pasir pasrah',
  },
  {
    name: 'Transisi Cepat F↔J & G↔H',
    text: 'fjfj ghgh fgjh hgjf fghj jhg fajar gajah hutan hijau jauh hangat',
  },
  {
    name: 'Tuts Angka & Simbol',
    text: '123 456 789 0 (100% akurasi) [tingkat 1] {target: 95%+} #1234',
  },
];
