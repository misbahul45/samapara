# Code Organization — SAMAPARA

Dokumen ini menetapkan tata kelola kode aplikasi web dan mobile. Dokumen ini
tidak mewajibkan migrasi besar sekaligus; struktur fisik dibuat hanya ketika
fitur membutuhkannya.

## Keputusan arsitektur

Samapara memakai Feature-First Modular Architecture dengan arah dependensi:

```text
routes/pages
    ↓
feature public API
    ↓
feature internals
    ↓
shared
```

Route hanya menghubungkan URL atau navigasi ke view/screen. Business logic,
akses data, query, mutation, schema, dan state spesifik domain dimiliki feature.
`shared` hanya berisi kemampuan generik dan tidak boleh mengimpor feature.

## Boundary wajib

1. Route Nuxt dan Expo Router harus tipis.
2. Business logic harus berada di feature pemilik domain.
3. API call, query, mutation, schema, dan state spesifik fitur harus colocated.
4. Feature hanya diekspos melalui `index.ts` sebagai public API.
5. Import dari luar feature tidak boleh menembus folder internal feature.
6. `shared` tidak boleh mengimpor `features`.
7. Feature boleh mengimpor `shared`.
8. Route boleh mengimpor public API feature.
9. Feature-to-feature import harus melalui public API feature tujuan.
10. Orkestrasi lintas domain dimiliki feature komposisi atau workflow khusus.
11. Server state dikelola TanStack Query atau data-fetching layer.
12. Server state tidak boleh diduplikasi ke Pinia, Zustand, atau store lokal.
13. Component presentational tidak boleh melakukan raw HTTP request.
14. Shared UI harus domain-agnostic.
15. Shared package hanya boleh berisi kode TypeScript platform-independent.
16. Folder opsional dibuat saat dibutuhkan, bukan untuk melengkapi template.

## Nuxt web

Target bertahap untuk `apps/samapara_controll/app`:

```text
app/
├── pages/                   routing
├── features/                domain dan business feature
│   ├── auth/
│   ├── dashboard/
│   ├── devices/
│   ├── telemetry/
│   ├── map/
│   ├── routes/
│   ├── notifications/
│   └── profile/
├── shared/
│   ├── api/
│   ├── constants/
│   ├── lib/
│   ├── types/
│   └── utils/
├── components/shared/      generic UI
├── composables/shared/     generic composables
├── layouts/
├── middleware/
└── plugins/
```

Feature Nuxt boleh memiliki folder berikut sesuai kebutuhan:

```text
features/devices/
├── api/
├── components/
├── composables/
├── queries/
├── mutations/
├── schemas/
├── types/
├── utils/
├── views/
└── index.ts
```

`pages` memilih parameter route dan merender view. View mengorkestrasi query dan
component. Component menerima data dan event melalui props/emits.

## Expo mobile

Target bertahap untuk `apps/samapara_drive/src`:

```text
src/
├── app/                     Expo Router
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── devices/
│   ├── telemetry/
│   ├── map/
│   ├── routes/
│   ├── notifications/
│   └── profile/
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── storage/
│   ├── theme/
│   ├── types/
│   └── utils/
├── providers/
└── config/
```

Feature mobile boleh memiliki folder berikut sesuai kebutuhan:

```text
features/auth/
├── api/
├── components/
├── hooks/
├── queries/
├── mutations/
├── schemas/
├── screens/
├── store/
├── types/
└── index.ts
```

Provider aplikasi ditempatkan di `src/providers`. Token sensitif diakses melalui
abstraksi `shared/storage` yang memakai secure storage, bukan dari banyak screen.

## State dan data flow

```text
route
  ↓
view/screen
  ↓
query atau mutation
  ↓
feature API
  ↓
shared API client
  ↓
API Platform
```

Server state mencakup device, telemetry, prediction, route, collection,
notification, dan profile yang berasal dari API. Client state mencakup state UI
sementara seperti sidebar, modal, draft filter, selected map layer, dan wizard.

Setiap feature yang memakai TanStack Query memiliki query-key factory sendiri.
Mutation menginvalidasi query lewat factory tersebut, bukan string tersebar.

Alur query Nuxt dari SSR ke CSR:

```text
SSR request
  ↓
QueryClient per request
  ↓
server prefetch
  ↓
dehydrate ke payload Nuxt
  ↓
hydrate di browser
  ↓
cache, refetch, dan invalidation CSR
```

Server memakai `API_BASE_INTERNAL`, sedangkan browser memakai `apiBase`
publik. Jangan membuat `QueryClient` pada module scope plugin SSR karena cache

## Shared contracts

Target jangka menengah adalah `packages/contracts` untuk schema Zod, DTO, enum,
domain constant, dan type yang benar-benar sama di API Platform, Nuxt, dan Expo.
Folder ini belum perlu dibuat sampai kontrak pertama siap dimigrasikan dan build
workspace sudah disepakati.

Yang boleh dibagikan:

- schema dan DTO;
- enum dan domain constant;
- validation rule;
- pure TypeScript utility;
- type konfigurasi platform-independent.

Yang tidak boleh dibagikan:

- Vue atau React Native component;
- Nuxt composable atau React hook;
- navigation dan routing;
- storage platform-specific;
- state UI platform-specific.

## Naming

- Vue dan React component: `PascalCase.vue` atau `PascalCase.tsx`.
- Hook/composable: `useSomething.ts`.
- API operation: `verb-noun.ts`.
- Schema: `noun.schema.ts`.
- Types: `noun.types.ts`.
- Store: `noun.store.ts`.
- Query keys: `noun.query-keys.ts`.
- Nama domain web dan mobile harus sama, walaupun implementasinya berbeda.

## Strategi migrasi

Migrasi dilakukan per vertical slice dan tidak boleh berupa pemindahan massal
tanpa verifikasi.

1. Tentukan feature pemilik kode yang akan disentuh.
2. Buat public API `index.ts` hanya untuk simbol yang dibutuhkan dari luar.
3. Pindahkan API/query/store spesifik feature bersama test terkait.
4. Ubah route menjadi adapter tipis ke view atau screen.
5. Pindahkan hanya primitive generik ke `shared`.
6. Jalankan lint, typecheck, dan test aplikasi yang terdampak.
7. Hapus folder global lama hanya setelah tidak ada consumer tersisa.

## Checkpoint implementasi

Migrasi management code yang sudah diterapkan:

- Nuxt memakai `app/shared/api` untuk client HTTP generik.
- Query dan view detail device Nuxt berada di `app/features/devices` dan
  diekspos melalui public API feature.
- Route detail device Nuxt hanya membaca parameter dan merender feature view.
- Expo memusatkan environment di `src/config`, provider di `src/providers`, dan
  kemampuan generik di `src/shared`.
- Auth, dashboard, dan query device Expo berada di feature pemiliknya dan
  diekspos melalui `index.ts`.
- Route login dan home Expo hanya mengekspor screen dari public API feature.
- `src/components/ui` Expo tetap dipertahankan sebagai lokasi primitive UI
  domain-agnostic yang dikelola generator; utilitas generiknya berada di
  `src/shared/lib`.
- Folder global lama untuk API, query, dan store tidak dipertahankan setelah
  seluruh consumer aktif selesai dimigrasikan.

### Reference login slice

Vertical slice login menjadi contoh boundary aktif: Nuxt menyimpan demo user
melalui shared cookie-backed state, sedangkan Expo menyimpan session tervalidasi
melalui shared SecureStore dan menghidrasinya pada root provider.

Implementasi ini adalah demo frontend, bukan production authentication. API
Platform belum memiliki endpoint login, password verification, atau token issuer.

Prioritas berikutnya:

1. Terapkan pola yang sama ketika feature domain berikutnya benar-benar
   disentuh; jangan membuat skeleton folder lebih dahulu.
2. Standardisasi error model dan response validation per platform saat endpoint
   terkait dimigrasikan.
3. Ekstrak `packages/contracts` hanya setelah kontrak API stabil dan memiliki
   consumer, build configuration, serta test nyata.

## Review checklist

- Apakah route hanya menangani routing dan parameter?
- Apakah file ditempatkan pada feature pemilik domain?
- Apakah import eksternal memakai public API feature?
- Apakah `shared` tetap generik dan bebas import feature?
- Apakah server state hanya berada di query layer?
- Apakah component bebas raw HTTP request?
- Apakah loading, error, empty, dan success state ditangani?
- Apakah folder baru benar-benar dibutuhkan?
- Apakah perubahan diuji pada boundary yang terdampak?
