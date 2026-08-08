# SAMAPARA — Architecture

Smart waste management: IoT telemetry (ESP32 + load cell/ultrasonic) → MQTT → Go
ingestion → Redis Streams → Python AI (forecasting N-BEATSx, RAG) → routing
(OR-Tools + Google Routes) → web/mobile apps, dengan human-in-the-loop approval.

> Referensi blueprint lengkap: `docs/superpowers/plans/2026-08-08-samapara-infra-stack.md`

## Stack

| Layer | Stack |
|---|---|
| Edge | ESP32, Load Cell, HX711, Ultrasonic, LittleFS/SPIFFS |
| Connectivity | Wi-Fi, 4G, LoRaWAN → **MQTT** (Mosquitto) |
| Backend/Ingestion | Go + Gin (`services/telemetry_worker`), internal auth Bearer `INTERNAL_SERVICE_TOKEN` |
| Public API boundary | Hono + Prisma 7 (`services/api_platform`) — satu-satunya route publik `/api/` via nginx |
| Queue | **Redis Streams** (bukan BullMQ/Kafka) |
| Main DB | **PostgreSQL 17 + TimescaleDB** (SATU service) |
| Vector DB | **Qdrant 1.18+ TurboQuant bits4** (bukan Milvus/Chroma) |
| Object storage | MinIO (dev only; production = S3 eksternal) |
| AI | Python + FastAPI + uv (`services/decision_engine`) + consumer worker Redis Streams; forecasting saat ini baseline P50/P80/P90 (N-BEATsx di roadmap) |
| Agent/RAG | LangGraph (orchestrasi), Haystack (pipeline RAG), CrewAI (opsional) |
| Routing | OR-Tools (lokal) + Google Routes/Optimization API |
| Web | **Nuxt 4** + TanStack Vue Query (`apps/samapara_controll`) — BUKAN SvelteKit |
| Mobile | React Native + Expo + TanStack React Query (`apps/samapara_drive`, jalan di host) |
| Monitoring | Prometheus + postgres-exporter + cAdvisor + Grafana |
| Logs | Loki + **Grafana Alloy** (Promtail sudah EOL 2026-03) |
| Error tracking | Sentry (SaaS, fase lanjutan) |
| Infra | Docker Compose + Nginx (gateway-only) + GitHub Actions |

## Run

```bash
# dari root repo
infra/dev.sh up          # = docker compose --env-file .env -f infra/docker-compose.dev.yml up -d
infra/dev.sh down        # stop
infra/dev.sh logs        # follow logs
```

## Gateway (nginx) — gateway-only

Semua service app hanya di internal network `samapara_net`; hanya nginx yang
di-publish ke host. Infra service (DB, Redis, Qdrant, dst) juga hanya bind
`127.0.0.1` di host.

| Route | Tujuan |
|---|---|
| `= /healthz` | 200 `ok` (nginx sendiri) |
| `^~ /api/` | `api_platform` (Hono) — **tanpa strip prefix** |
| `/` | `controll` (Nuxt + WebSocket HMR) |

`/decision/` dan `/telemetry/` sengaja TIDAK di-expose publik (fase B); kedua
service hanya bisa diakses di internal network `samapara_net`.

Catatan nginx: upstream disimpan dalam **variable `host:port` tanpa scheme**
(pola ISAC). `proxy_pass` dengan variable tidak mengganti path otomatis,
karena itu route `/api/` diteruskan utuh (tanpa strip).

## Database (PostgreSQL + TimescaleDB — satu service)

Schema (bukan 3 database):

```text
postgres (samapara)
├── public   : devices, ai_audit_logs
├── bronze   : telemetry_raw          (hypertable, mentah dari MQTT)
├── silver   : telemetry_clean        (hypertable, normalisasi + anomaly_score)
└── gold     : forecasts (P50/P80/P90), shipments
```

Init SQL: `infra/postgres/init/001-init.sql` (dijalankan sekali saat volume baru).

## Redis Streams

Satu Redis, banyak stream per domain + consumer group:

```text
MQTT → Go ingestion → XADD stream:telemetry → normalizer → Timescale
                                                  → XADD stream:forecast → Python worker
```

Stream: `telemetry`, `forecast`, `risk`, `routing`, `embedding`, `agent`.
Consumer groups: `telemetry-normalizer`, `forecast-workers`, dst.

## Qdrant (vector + RAG)

Collection `samapara_knowledge` — dibuat dengan config:

```json
{
  "vectors": { "size": 384, "distance": "Cosine", "on_disk": true },
  "hnsw_config": { "on_disk": true },
  "quantization_config": { "turbo": { "bits": "bits4", "always_ram": true } }
}
```

- Original FP32 vectors → **disk**; TurboQuant 4-bit (~8×) → **RAM**.
- Embedding awal: `intfloat/multilingual-e5-small` (384 dim, CPU-friendly).
- API key: `QDRANT_API_KEY` (admin) / `QDRANT_READ_ONLY_API_KEY` (read + Prometheus).
- Payload menyimpan metadata (type, region, effective_date, version, source_uri)
  agar retrieval bisa semantic + filter.

## Monitoring & logs

- **Prometheus** (`127.0.0.1:9090`): scrape prometheus, postgres-exporter:9187,
  qdrant:6333/metrics?per_collection=true (Bearer read-only key), cadvisor:8080.
- Alert dasar: PostgreSQLDown, QdrantDown, ContainerMetricsDown
  (`infra/prometheus/rules.yml`).
- **Loki** (`127.0.0.1:3100`): retensi 168h, filesystem storage.
- **Alloy**: discovery.docker + `loki.source.docker` → push log container ke Loki.
- **Grafana** (`127.0.0.1:3001`, admin/admin dev): datasource Prometheus + Loki
  ter-provisioning (`infra/grafana/provisioning`).

## Memory budget (dev, 8 GB host)

Postgres 2 GB · Qdrant 1.5 GB · Redis 256 MB · Go 256 MB · Python AI 1–2 GB ·
Prometheus 512 MB · Grafana 256 MB · Loki 512 MB · Mosquitto 128 MB.
Model LLM besar tidak di-self-host di mesin yang sama.

## Fase B — status implementasi (per 2026-08-08)

Boundary final: nginx :8090 satu-satunya entry publik; internal service hanya
di network `samapara_net`; DB role least-privilege
(`samapara_owner`/`samapara_app`/`samapara_ingestor_ro`/`samapara_ai`).

| Service | Stack | Endpoint | Status |
|---|---|---|---|
| Nginx gateway | nginx | `GET :8090/healthz` → 200 | running |
| api_platform | Hono + Prisma 7 + zod 4 + vitest 19 | `/api/devices`, `/api/devices/:id`, `/api/devices/:id/forecasts`, `POST /api/devices/:id/forecast/run`, `/internal/v1/health` (Bearer) | running |
| telemetry_worker | Go + Gin (container build) | `:8080/health` (internal, Bearer) | running |
| decision_engine | Python FastAPI + uv | `:8000/health`, `/forecast/run` (internal) | running |
| decision_worker | Python consumer (service terpisah) | XREADGROUP `stream:telemetry` → bronze/silver → `stream:forecast` | running |
| controll | Nuxt 4 + @nuxt/ui 4 + TanStack Vue Query | `:8090/` (via nginx): list device, detail, Jalankan Forecast | running |
| samapara_drive | Expo 57 + expo-router + TanStack React Query | host-only (Expo web dev :8081): list device → detail → forecast run | running |

Alur terverifikasi E2E (via nginx :8090):

```text
mosquitto_pub (container) → telemetry_worker (MQTT → dedup Lua → XADD stream:telemetry)
→ decision_worker (bronze.telemetry_raw → silver.telemetry_clean)
→ POST /api/devices/:id/forecast/run → decision_engine (gold.forecasts P50/P80/P90)
→ UI web/Expo (TanStack Query, invalidate on mutation)
```

Catatan implementasi fase B:

- CORS: `PUBLIC_ORIGINS` (comma-separated) di `services/api_platform/src/config/env.ts`
  → `hono/cors` origin array; dev: `http://localhost:8090,http://localhost:8081`.
- Serialisasi JSON: `src/lib/serialize.ts jsonSafe` (BigInt → string) dipakai di
  route devices (Prisma BigInt id pada forecasts).
- Registry device: Redis `registry:device:{id}` (HSet, TTL 300) ditulis Hono,
  dibaca Go (ingestor_ro).
- Queue tetap Redis Streams satu instance; dedup sequence via script Lua.
- Expo routing: root `Stack` + group `(tabs)` (NativeTabs) + `devices/[id]` di
  luar tab (NativeTabs root tidak me-render route non-tab di web).

## Roadmap

- **Fase A (selesai)**: infra stack — lihat file plan.
- **Fase B (selesai M1–M7, M8 dokumentasi)**: nginx boundary final; Go ingestor
  (MQTT→Redis Streams) di `services/telemetry_worker`; Python workers
  (forecast consumer) di `services/decision_engine`; public API Hono/Prisma;
  web Nuxt + TanStack Vue Query; mobile Expo + TanStack React Query.
- **Fase C**: firmware ESP32, OR-Tools routing, Google Routes, N-BEATsx + RAG
  Haystack→Qdrant, prod compose (internal network, MQTT TLS 8883, S3 eksternal,
  secrets).
