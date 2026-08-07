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
| Backend/Ingestion | Go + Gin, JWT + RBAC |
| Queue | **Redis Streams** (bukan BullMQ/Kafka) |
| Main DB | **PostgreSQL 17 + TimescaleDB** (SATU service) |
| Vector DB | **Qdrant 1.18+ TurboQuant bits4** (bukan Milvus/Chroma) |
| Object storage | MinIO (dev only; production = S3 eksternal) |
| AI | Python + FastAPI + Polars + PyTorch + NeuralForecast + N-BEATSx |
| Agent/RAG | LangGraph (orchestrasi), Haystack (pipeline RAG), CrewAI (opsional) |
| Routing | OR-Tools (lokal) + Google Routes/Optimization API |
| Web | **Nuxt 4** (`apps/samapara_controll`) — BUKAN SvelteKit |
| Mobile | React Native + Expo (`apps/samapara_drive`, jalan di host) |
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
| `^~ /api/` | `api_platform` (Hono, strip prefix) |
| `^~ /decision/` | `decision_engine` (FastAPI, strip prefix) |
| `^~ /telemetry/` | `telemetry_worker` (Gin, strip prefix) |
| `/` | `controll` (Nuxt + WebSocket HMR) |

Catatan nginx: upstream disimpan dalam **variable `host:port` tanpa scheme**
(pola ISAC) + `rewrite ... break` untuk strip prefix (proxy_pass variable tidak
mengganti path otomatis).

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

## Roadmap

- **Fase A (selesai)**: infra stack — lihat file plan.
- **Fase B**: Go ingestor (MQTT→Redis Streams) di `services/telemetry_worker`;
  Python workers (forecast consumer, RAG ingest Haystack→Qdrant) di
  `services/decision_engine`.
- **Fase C**: firmware ESP32, mobile wiring, OR-Tools routing, Google Routes,
  prod compose (internal network, MQTT TLS 8883, S3 eksternal, secrets).
