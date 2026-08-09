import type { OnboardingSlide } from './types';

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: 'assignment',
    eyebrow: 'Prioritas dari Control',
    title: 'Terima tugas yang sudah diprioritaskan.',
    description: 'Operator meninjau kondisi, prediksi, dan kebutuhan kawasan melalui SAMPARA Control sebelum tugas dikirim ke tim lapangan.',
    detail: 'Drive menampilkan titik yang perlu dilayani, bukan sekadar daftar bin.',
    visual: 'assignment',
  },
  {
    id: 'route',
    eyebrow: 'Urutan kunjungan',
    title: 'Ikuti rute dengan konteks yang jelas.',
    description: 'Lihat tugas berikutnya, jarak, dan estimasi waktu tiba agar perjalanan mengikuti keputusan operasional kawasan.',
    detail: 'Urutan dapat diperbarui oleh operator ketika kondisi lapangan berubah.',
    visual: 'route',
  },
  {
    id: 'execution',
    eyebrow: 'Eksekusi lapangan',
    title: 'Jaga operator tetap mengetahui progres.',
    description: 'Mulai tugas, konfirmasi kunjungan, dan teruskan status pekerjaan agar Control memiliki gambaran pelaksanaan di lapangan.',
    detail: 'Pengemudi menjalankan tugas, sementara operator tetap menjadi bagian dari keputusan.',
    visual: 'execution',
  },
] as const;
