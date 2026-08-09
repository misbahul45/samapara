export const footerProductLinks = [
  { label: 'Control', to: '/#platform' },
  { label: 'Drive', to: '/#platform' }
] as const

export const footerPlatformLinks = [
  { label: 'Cara Kerja', to: '/#cara-kerja' },
  { label: 'Daftarkan Area', to: '/register-area' }
] as const

export const finalCtaFlow = [
  { number: '01', label: 'Kondisi', x: 92, y: 358 },
  { number: '02', label: 'Prediksi', x: 270, y: 300 },
  { number: '03', label: 'Prioritas', x: 452, y: 202 },
  { number: '04', label: 'Rute', x: 642, y: 112 }
] as const

export const currentOperationBins = [
  { name: 'BIN A', value: 34, color: 'bg-green-500' },
  { name: 'BIN B', value: 61, color: 'bg-yellow-500' },
  { name: 'BIN C', value: 92, color: 'bg-red-500' }
] as const

export const prioritizedOperationBins = [
  { name: 'BIN C', value: '92%', state: 'Prioritas pertama', tone: 'text-red-600', line: 'bg-red-500' },
  { name: 'BIN B', value: '61%', state: 'Dipantau', tone: 'text-yellow-700', line: 'bg-yellow-500' },
  { name: 'BIN A', value: '34%', state: 'Belum perlu dilayani', tone: 'text-green-700', line: 'bg-green-500' }
] as const

export const workflowSteps = [
  {
    number: '01',
    label: 'Condition',
    title: 'Pahami kondisi setiap titik.',
    description: 'Berat dan tingkat kepenuhan dipantau secara berkala dari perangkat lapangan.',
    color: 'text-data'
  },
  {
    number: '02',
    label: 'Prediction',
    title: 'Lihat apa yang akan terjadi berikutnya.',
    description: 'Sistem memperkirakan bagaimana kondisi bin berkembang, termasuk estimasi ketika kendaraan tiba.',
    color: 'text-blue-200'
  },
  {
    number: '03',
    label: 'Priority',
    title: 'Tentukan titik yang benar-benar perlu dilayani.',
    description: 'Prediksi diterjemahkan menjadi kebutuhan pelayanan, estimasi muatan, prioritas, dan tenggat.',
    color: 'text-yellow-300'
  },
  {
    number: '04',
    label: 'Route',
    title: 'Susun perjalanan berdasarkan kondisi operasional.',
    description: 'Armada dan urutan kunjungan disusun dengan mempertimbangkan kapasitas dan kondisi lalu lintas.',
    color: 'text-green-300'
  }
] as const

export const controlMetrics = [
  { label: 'Bin aktif', value: '21', tone: 'text-blue-950' },
  { label: 'Perlu perhatian', value: '3', tone: 'text-red-600' },
  { label: 'Rute aktif', value: '2', tone: 'text-green-700' }
] as const

export const driveStops = [
  { number: '02', place: 'Warehouse B', time: '09:45' },
  { number: '03', place: 'Gate C', time: '10:20' }
] as const

export const areaOnboardingSteps = [
  {
    number: '01',
    title: 'Identitas Area',
    description: 'Tetapkan nama kawasan dan konteks operasionalnya.'
  },
  {
    number: '02',
    title: 'Tentukan Wilayah',
    description: 'Gambarkan batas layanan sebagai ruang kerja utama.'
  },
  {
    number: '03',
    title: 'Tambahkan Titik Bin',
    description: 'Petakan titik pengumpulan dan karakteristiknya.'
  },
  {
    number: '04',
    title: 'Siapkan Operasional',
    description: 'Hubungkan kebutuhan area dengan tim dan armada.'
  }
] as const

export const areaTypes = [
  {
    title: 'Kampus',
    description: 'Kelola gedung, fasilitas, dan titik pengumpulan kampus.'
  },
  {
    title: 'Rumah Sakit',
    description: 'Atur titik dengan kebutuhan pelayanan yang berbeda.'
  },
  {
    title: 'Kawasan Industri',
    description: 'Koordinasikan banyak titik dan armada dalam satu wilayah.'
  }
] as const
