export const DRIVE_ROUTE = {
  label: 'Rute Kawasan Barat',
  progress: 38,
  completedStops: 3,
  totalStops: 8,
  distance: '24,6 km',
  nextTask: {
    location: 'BIN C · Blok Selatan',
    status: 'Prioritas pertama',
    fillLevel: '92%',
    eta: '09.20',
    distance: '1,8 km',
  },
  queue: [
    { number: '02', location: 'BIN B · Gerbang Utama', eta: '09.45' },
    { number: '03', location: 'BIN A · Gedung Administrasi', eta: '10.10' },
  ],
} as const;
