# AGENTS.md — SAMPARA

Sampara adalah platform smart waste management dengan alur utama:

```text
ESP32 → MQTT → telemetry_worker → Redis Streams → decision_worker
      → PostgreSQL/TimescaleDB → decision_engine → api_platform
      → Nuxt web dan Expo mobile
```

Target lanjutan mencakup N-BEATSx, RAG, OR-Tools, Google Routes, dan
human-in-the-loop. Jangan mendeskripsikan target roadmap sebagai fitur produksi
yang sudah selesai.

Sumber kebenaran:

- Arsitektur sistem: `docs/ARCHITECTURE.md`
- Tata kelola kode web/mobile: `docs/CODE_ORGANIZATION.md`
- Rencana implementasi: `docs/superpowers/plans/`
- Full integration stack: `infra/docker-compose.dev.yml`
- Environment template: `.env.example`

## Aturan kerja agent

1. Baca instruksi terdekat sebelum mengubah file; `AGENTS.md` yang lebih dalam
   berlaku untuk subtree tersebut.
2. Periksa `git status --short` dan pertahankan perubahan milik user.
3. Jangan commit, push, reset, checkout, atau menghapus perubahan tanpa perintah
   eksplisit user.
4. Gunakan perubahan sekecil mungkin yang menyelesaikan task.
5. Jangan melakukan refactor lintas domain saat task hanya menyentuh satu fitur.
6. Verifikasi perubahan secara proporsional terhadap risiko sebelum selesai.
7. Jangan menulis atau menampilkan secret dari `.env`.

## Discovery codebase

Project memakai `codebase-memory-mcp`. Untuk code discovery, gunakan urutan:

1. `search_graph`
2. `trace_path`
3. `get_code_snippet`
4. `query_graph`
5. `get_architecture`

Gunakan `search_code` untuk pencarian teks yang perlu konteks graph. Gunakan
`rg` hanya untuk literal, error message, config, shell, Dockerfile, dokumentasi,
atau ketika graph tidak cukup. Project graph saat ini bernama
`home-misbahul45-code-sampara`; index repository bila graph belum tersedia.

Jika Xninetzy MCP terhubung, baca
`/home/misbahul45/.xninetzy/CLI_SHARED_INSTRUCTIONS.md`. Ambil memory hanya dengan
query sempit yang menyebut Sampara dan task aktif. Repository tetap menjadi
sumber kebenaran; memory adalah konteks, bukan pengganti validasi file aktual.

## Struktur repository

```text
apps/
├── sampara_controll    Nuxt 4 web admin/ops
└── sampara_drive       Expo/React Native, berjalan di host
services/
├── api_platform         Hono/TypeScript REST API + Prisma
├── decision_engine      FastAPI/Python 3.14 + uv
└── telemetry_worker     Gin/Go 1.25 + Air
infra/
├── docker-compose.dev.yml
├── nginx/
├── postgres/
├── redis/
├── qdrant/
├── mosquitto/
├── prometheus/
├── loki/
├── alloy/
└── grafana/
docs/
└── arsitektur, governance, dan implementation plan
```

`packages/contracts`, `packages/api-client`, dan `packages/design-tokens` adalah
target arsitektur, bukan struktur yang boleh dibuat kosong. Buat package hanya
saat ada kontrak nyata, consumer, build configuration, dan test yang ikut
dimigrasikan.

## Invariant sistem

1. Web tetap Nuxt di `apps/sampara_controll`; jangan pindah ke SvelteKit.
2. Penamaan wajib `sampara`, bukan `samapara`: database/user `sampara`, Qdrant
   collection `sampara_knowledge`, container `sampara_*_dev`, network
   `sampara_net`.
3. TimescaleDB adalah extension di satu PostgreSQL, bukan service database lain.
4. Data PostgreSQL berlapis melalui schema `bronze`, `silver`, dan `gold`.
5. Queue/event backbone adalah satu Redis Streams; jangan menambah BullMQ,
   Kafka, RabbitMQ, atau NATS.
6. Vector database production core adalah Qdrant 1.18+ dengan TurboQuant
   `bits4` dan vector `on_disk`.
7. Log collector adalah Grafana Alloy; Promtail dilarang.
8. MinIO hanya untuk development; production memakai S3 eksternal.
9. Mosquitto `allow_anonymous` hanya boleh di konfigurasi development.
10. Docker development memakai `Dockerfile.dev`, bind mount source, dan named
    volume dependency untuk hot reload.
11. Nginx adalah satu-satunya public application gateway pada full stack.
12. Nginx upstream variable berisi `host:port` tanpa scheme.
13. Prefix hanya di-strip ketika contract route memang mengharuskannya; public
    `/api/*` saat ini diteruskan utuh ke Hono.
14. `.env` tidak pernah di-commit dan secret tidak boleh di-hardcode pada file
    tracked. Exception dev-only yang sudah ada harus tetap ditandai jelas.
15. Dilarang menulis komentar di dalam kode baru atau kode yang dimodifikasi,
    termasuk TS, TSX, Vue script/style, Python, Go, SQL, YAML, Dockerfile, dan
    konfigurasi. Gunakan nama dan struktur yang menjelaskan intent. Dokumentasi
    ditulis di Markdown. Komentar lama tidak wajib dibersihkan di luar scope.

## Boundary jaringan dan API

Full stack mem-publish service ke `127.0.0.1` saja. Application entry point
publik hanya Nginx di `http://localhost:8090`:

- `GET /healthz` dijawab Nginx.
- `/api/*` diteruskan utuh ke `api_platform`.
- `/` diteruskan ke Nuxt dengan dukungan HMR WebSocket.
- `decision_engine` dan `telemetry_worker` hanya dipanggil melalui internal
  Docker network oleh API Platform.
- PostgreSQL, Redis, Qdrant, dan Mosquitto tidak pernah menjadi public API.

Isolated Dev Container adalah pengecualian development yang disengaja: hanya
service aktif yang di-publish langsung ke loopback host untuk debugging.

## Data ownership

- `public` dan `gold`: Prisma/API Platform; runtime memakai role
  `POSTGRES_APP_USER`, migration memakai `POSTGRES_OWNER_USER`.
- `bronze` dan `silver`: ingestion/normalization telemetry.
- `gold.forecasts`: output Decision Engine.
- Telemetry Worker memakai role read-only `POSTGRES_INGESTOR_USER` untuk device
  registry dan menulis event melalui Redis Streams.
- Decision Engine memakai `POSTGRES_AI_USER`.
- Grant tabel berada di `infra/postgres/grants.sql`; perubahan schema atau role
  harus menjaga least privilege.

Jangan membuat database atau Redis baru untuk memisahkan layer/domain. Gunakan
schema, key namespace, stream, consumer group, dan ownership yang sudah ada.

## Arsitektur kode web dan mobile

Web dan mobile memakai Feature-First Modular Architecture:

```text
routes/pages → feature public API → feature internals → shared
```

Aturan wajib:

1. Route file tetap tipis dan hanya mengurus routing/parameter.
2. Business logic, API, query, mutation, schema, dan state spesifik domain berada
   di feature pemiliknya.
3. Feature diekspos melalui `index.ts`; deep import lintas feature dilarang.
4. `shared` tidak boleh mengimpor feature.
5. Shared UI wajib domain-agnostic.
6. Component presentational tidak melakukan raw HTTP request.
7. TanStack Query/data-fetching layer memegang server state.
8. Pinia/Zustand/store lokal hanya untuk client state; jangan menduplikasi data
   API ke store.
9. Orkestrasi lintas feature mengimpor public API, bukan internal feature.
10. Nama domain web dan mobile dibuat konsisten, implementasi UI tetap terpisah.
11. Jangan membuat semua subfolder template; buat hanya yang digunakan.
12. Shared package hanya berisi schema, DTO, enum, constant, validation, type,
    dan pure TypeScript yang platform-independent.

Detail struktur, naming, migration order, dan review checklist ada di
`docs/CODE_ORGANIZATION.md`.

## Dev Container

Sediakan dua tingkat workflow:

| Scope | Folder dibuka | Service |
| --- | --- | --- |
| UI | `apps/sampara_controll` | Nuxt |
| API | `services/api_platform` | API + PostgreSQL + Redis |
| AI | `services/decision_engine` | Decision + PostgreSQL + Redis + Qdrant |
| IoT | `services/telemetry_worker` | Go + PostgreSQL + Redis + Mosquitto |
| Integrasi | root repository | seluruh stack + workspace |

Setiap Dev Container menggunakan `.env` root melalui symlink yang dibuat
`.devcontainer/initialize.sh`. Jangan commit symlink atau salinan secret.

Command pembuka:

```bash
code apps/sampara_controll
code services/api_platform
code services/decision_engine
code services/telemetry_worker
code .
```

Gunakan `Dev Containers: Rebuild Container` setelah mengubah `devcontainer.json`,
Compose Dev Container, `Dockerfile.dev`, versi runtime, atau system dependency.
Perubahan source biasa memakai hot reload dan tidak membutuhkan rebuild.

Port isolated mode:

- Nuxt: `127.0.0.1:3000`
- API Platform: `127.0.0.1:3002`
- Decision Engine: `127.0.0.1:8000`
- Telemetry Worker: `127.0.0.1:8080`

Container app menjalankan command hot-reload bawaan `Dockerfile.dev`. Dependency
service tidak dipublish ke host. Worker Python tambahan dijalankan dari terminal
kedua Decision Engine dengan:

```bash
uv run python -m decision_engine.workers.telemetry
```

Root workspace memakai Docker-outside-of-Docker untuk inspeksi daemon host.
Jalankan perintah Compose yang melakukan recreate dan bind mount dari host bila
path workspace container tidak identik dengan path host.

## Full stack dan Makefile

Siapkan `.env` sekali:

```bash
cp .env.example .env
```

Full stack berisi 17 service aplikasi/infrastruktur. Jalankan dari host root:

```bash
make config
make up
make ps
make logs-controll
make rebuild-api_platform
make restart-decision_worker
make down
```

Alternatif helper lama tetap valid:

```bash
infra/dev.sh up
infra/dev.sh down
infra/dev.sh logs
```

`make rebuild-<service>` hanya build dan recreate service target dengan
`--no-deps`. Gunakan full stack hanya untuk integration/E2E atau observability;
gunakan isolated Dev Container untuk pekerjaan harian satu service.

## Health dan endpoint penting

Full stack:

```text
GET http://127.0.0.1:8090/healthz
GET http://127.0.0.1:8090/api/
```

Isolated mode:

```text
GET http://127.0.0.1:3002/healthz
GET http://127.0.0.1:8000/health
GET http://127.0.0.1:8080/internal/v1/health
```

Endpoint Telemetry internal memerlukan Bearer `INTERNAL_SERVICE_TOKEN`.

Infra development:

- Grafana: `127.0.0.1:3001`
- Prometheus: `127.0.0.1:9090`
- Qdrant dashboard: `127.0.0.1:6333/dashboard`
- MinIO console: `127.0.0.1:9001`
- PostgreSQL: `127.0.0.1:5432`
- Redis: `127.0.0.1:6379`

## Verifikasi per area

Jalankan pemeriksaan yang relevan dengan file yang berubah.

Nuxt:

```bash
cd apps/sampara_controll
pnpm lint
pnpm typecheck
```

API Platform:

```bash
cd services/api_platform
pnpm build
pnpm exec vitest run
```

Decision Engine:

```bash
cd services/decision_engine
uv sync --frozen
uv run python -m compileall src
```

Telemetry Worker:

```bash
cd services/telemetry_worker
go test ./...
```

Compose dan Dev Container:

```bash
make config
docker compose --env-file apps/sampara_controll/.devcontainer/.env -f apps/sampara_controll/.devcontainer/docker-compose.yml config --quiet
docker compose --env-file services/api_platform/.devcontainer/.env -f services/api_platform/.devcontainer/docker-compose.yml config --quiet
docker compose --env-file services/decision_engine/.devcontainer/.env -f services/decision_engine/.devcontainer/docker-compose.yml config --quiet
docker compose --env-file services/telemetry_worker/.devcontainer/.env -f services/telemetry_worker/.devcontainer/docker-compose.yml config --quiet
```

Jangan menjalankan seluruh test suite tanpa kebutuhan jika perubahan hanya
dokumentasi atau konfigurasi terisolasi. Untuk perubahan lintas service, tambah
integration check pada gateway dan alur Redis Streams yang terdampak.

## Definition of done

- Scope user selesai tanpa mengubah area yang tidak diminta.
- Invariant arsitektur, jaringan, secret, dan naming tetap terjaga.
- Route/component baru mengikuti feature boundary.
- Config tervalidasi dan test relevan lulus.
- Tidak ada secret, generated artifact, atau dependency directory yang ter-track.
- Perubahan user yang sudah ada tetap utuh.
- Dokumentasi diperbarui bila contract atau workflow berubah.
- Handoff menyebut file berubah, verifikasi yang dijalankan, dan batasan tersisa.
