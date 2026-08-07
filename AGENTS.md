# AGENTS.md — SAMAPARA

Smart waste management: ESP32 (load cell + ultrasonic) → MQTT → Go ingestion →
Redis Streams → Python AI (forecasting N-BEATSx + RAG) → routing (OR-Tools +
Google Routes) → web (Nuxt) & mobile (Expo), dengan human-in-the-loop.

Dokumentasi lengkap: `docs/ARCHITECTURE.md` · plan: `docs/superpowers/plans/`

## Menjalankan (dari root repo)

```bash
infra/dev.sh up      # up -d seluruh stack (app + infra)
infra/dev.sh down    # stop
infra/dev.sh logs    # follow logs
```

URL dev:
- Web Nuxt: `http://localhost:8090/` (gateway nginx, satu-satunya entry point)
- Grafana `127.0.0.1:3001` · Prometheus `127.0.0.1:9090` · Qdrant `127.0.0.1:6333/dashboard`
- MinIO `127.0.0.1:9001` · PostgreSQL `127.0.0.1:5432` · Redis `127.0.0.1:6379`

Kredensial dev ada di `.env` (jangan di-commit; `.env.example` adalah template).

## Struktur

```text
apps/
├── samapara_controll   Nuxt 4 web (admin/ops)
└── samapara_drive      Expo React Native (jalan di host, TIDAK di docker)
services/
├── api_platform        Hono/TS REST API (route /api/)
├── decision_engine     Python FastAPI + uv (route /decision/)
└── telemetry_worker    Go/Gin + air (route /telemetry/) — calon Go ingestor
infra/
├── docker-compose.dev.yml   seluruh stack (16 service)
├── nginx/ postgres/ redis(di compose) qdrant/ mosquitto/ minio(di compose)
├── prometheus/ loki/ alloy/ grafana/ dev.sh
docs/                    arsitektur + plan
```

## Invariants (jangan dilanggar)

1. **Web = Nuxt** (`apps/samapara_controll`). Jangan pindah ke SvelteKit.
2. Penamaan konsisten **`samapara`** (bukan `sampara`): DB/user `samapara`,
   collection `samapara_knowledge`, container `samapara_*_dev`, network `samapara_net`.
3. **TimescaleDB = extension PostgreSQL** dalam SATU service postgres — tidak
   pernah jadi database/container terpisah. Layering via schema bronze/silver/gold.
4. Queue = **Redis Streams** (satu Redis). Jangan tambah BullMQ/Kafka/RabbitMQ/NATS.
5. Vector DB = **Qdrant 1.18+** dengan TurboQuant `bits4` + `on_disk` vectors.
   Jangan pindah ke Milvus/Chroma/FAISS untuk core production.
6. Log collector = **Grafana Alloy** (Promtail EOL 2026-03-02). Promtail dilarang.
7. `.env` tidak pernah di-commit; secret tidak ditulis hardcode di konfigurasi
   yang di-commit (prometheus.dev.yml dev-key dibiarkan karena dev-only — tandai).
8. Semua service app & infra hanya bind `127.0.0.1` di host; hanya nginx yang
   jadi entry point publik untuk app. Mosquitto `allow_anonymous` HANYA dev.
9. MinIO = dev only; production = S3 eksternal. Jangan expand MinIO untuk prod.
10. Build container: `Dockerfile.dev` tiap service + named volume dependency
    (node_modules/.venv/go mod cache) — hot reload via bind mount source.
11. Nginx upstream variable berisi `host:port` TANPA scheme; strip prefix pakai
    `rewrite ^/x/(.*)$ /$1 break;` (proxy_pass variable tidak strip otomatis).

## Service health endpoints

`GET :8090/healthz` (nginx) · `/api/` · `/decision/health` · `/telemetry/health`.

## Perintah berguna

```bash
docker compose --env-file .env -f infra/docker-compose.dev.yml ps
docker compose --env-file .env -f infra/docker-compose.dev.yml logs -f <service>
docker exec -it samapara_postgres_dev psql -U samapara -d samapara
curl 127.0.0.1:6333/healthz -H "api-key: $QDRANT_API_KEY"
```
