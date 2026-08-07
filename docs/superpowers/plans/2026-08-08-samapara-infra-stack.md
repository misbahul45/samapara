# SAMAPARA Infra Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the full data/infra stack (PostgreSQL+TimescaleDB, Redis, Qdrant+TurboQuant, Mosquitto, MinIO, Prometheus, Loki, Alloy, Grafana) to the existing SAMAPARA dev compose, verified end-to-end.

**Architecture:** One docker compose (`infra/docker-compose.dev.yml`) runs the existing 5 app services (controll, api_platform, decision_engine, telemetry_worker, nginx) plus 11 new infra services. TimescaleDB is an extension of a single PostgreSQL service with bronze/silver/gold schemas. Qdrant 1.18 runs TurboQuant 4-bit quantization (original FP32 vectors on disk, quantized in RAM). All infra services bind 127.0.0.1 only; app services stay internal (nginx gateway-only).

**Tech Stack:** timescale/timescaledb:latest-pg17, redis:8.8.0-alpine, qdrant/qdrant:v1.18.1, eclipse-mosquitto:2, minio/minio, prom/prometheus:v3.10.0, quay.io/prometheuscommunity/postgres-exporter:v0.19.1, gcr.io/cadvisor/cadvisor:v0.60.5, grafana/loki:3.7.0, grafana/alloy:v1.18.0, grafana/grafana:13.1.0, nginx (existing).

## Global Constraints

- Web stays **Nuxt 4** (`apps/samapara_controll`) — NOT SvelteKit. Never touch SvelteKit in this repo.
- Naming is `samapara` (repo convention), NOT `sampara` from the blueprint draft.
- TimescaleDB is an extension inside ONE postgres service — never a second database service.
- One database `samapara` with schemas `bronze`, `silver`, `gold` — no separate DBs per layer.
- Redis used for **Redis Streams** — no BullMQ, no Kafka/RabbitMQ/NATS.
- Qdrant 1.18+: original vectors `on_disk`, HNSW `on_disk`, quantization `turbo bits4 always_ram`.
- **Grafana Alloy** for log collection — Promtail is EOL (2026-03-02), must NOT be used.
- Every infra service: `restart: unless-stopped`, healthcheck where supported, named volume for persistence.
- All host port bindings are `127.0.0.1:<port>` only (never 0.0.0.0).
- `.env` never committed; `.env.example` tracks all variables with dev defaults.
- MinIO is dev-only; production uses external S3-compatible storage (future phase).
- Secrets in dev files may be plain dev values; prod phase will use real secrets (future).
- App services (controll/api/decision/telemetry) and their existing configs must keep working — no removal.

---

### Task 1: Extend root `.env` + `.env.example` with infra variables

**Files:**
- Modify: `.env`
- Modify: `.env.example`

**Interfaces:**
- Produces: variables consumed by compose Task 8: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `QDRANT_API_KEY`, `QDRANT_READ_ONLY_API_KEY`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`, `MQTT_HOST`, `MQTT_PORT`, `DATABASE_URL`, `REDIS_URL`, `QDRANT_URL`, `QDRANT_COLLECTION`, `EMBEDDING_DIM`, plus existing `GATEWAY_PORT`.

- [ ] **Step 1:** Append all infra variables to `.env.example` (dev values, sectioned comments).
- [ ] **Step 2:** Mirror the same variables into `.env` (actual dev secrets).
- [ ] **Step 3: Verify:** `grep -c 'POSTGRES_DB=' .env .env.example` returns 2 matches each; `docker compose --env-file .env -f infra/docker-compose.dev.yml config --quiet` still valid.

### Task 2: PostgreSQL init script (schemas + hypertables)

**Files:**
- Create: `infra/postgres/init/001-init.sql`

**Interfaces:**
- Produces: `public.devices`, `bronze.telemetry_raw` (hypertable), `silver.telemetry_clean` (hypertable), `gold.forecasts`, `gold.shipments`, `public.ai_audit_logs`; consumed by Task 10 verification queries.

- [ ] **Step 1:** Create `001-init.sql` with extensions (timescaledb, pg_stat_statements), 3 schemas, tables with UUIDs, `create_hypertable` on time columns, indexes.
- [ ] **Step 2:** Verify later via Task 10 (`psql \dt` + hypertable query).

### Task 3: Mosquitto dev config

**Files:**
- Create: `infra/mosquitto/dev.conf`

**Interfaces:**
- Produces: dev broker config (anonymous allowed, persistence, stdout logs) consumed by compose Task 8.

- [ ] **Step 1:** Create dev.conf (listener 1883, allow_anonymous true, persistence on).
- [ ] **Step 2: Verify:** `docker compose ... config` resolves volume mount path.

### Task 4: Prometheus config + alert rules

**Files:**
- Create: `infra/prometheus/prometheus.dev.yml`
- Create: `infra/prometheus/rules.yml`

**Interfaces:**
- Produces: scrape jobs (prometheus, postgres-exporter:9187, qdrant:6333/metrics?per_collection=true with Bearer read-only key, cadvisor:8080) + 3 basic alerts (PostgreSQLDown, QdrantDown, ContainerMetricsDown).

- [ ] **Step 1:** Create prometheus.dev.yml (dev secrets inline, marked for production secret file later).
- [ ] **Step 2:** Create rules.yml.
- [ ] **Step 3:** Verify via Task 10: `http://127.0.0.1:9090/-/healthy` and targets page shows all 4 jobs up.

### Task 5: Loki config

**Files:**
- Create: `infra/loki/loki.yml`

- [ ] **Step 1:** Create loki.yml (filesystem storage, tsdb schema v13, 168h retention).
- [ ] **Step 2:** Verify via Task 10: `http://127.0.0.1:3100/ready` → `ready`.

### Task 6: Alloy config (docker log collection)

**Files:**
- Create: `infra/alloy/config.alloy`

- [ ] **Step 1:** Create config.alloy (discovery.docker + relabel container/stream + loki.source.docker → loki.write).
- [ ] **Step 2:** Verify via Task 10: container `samapara_alloy_dev` running, no restart loop; Loki receives logs.

### Task 7: Grafana provisioning (datasources)

**Files:**
- Create: `infra/grafana/provisioning/datasources/datasources.yml`

- [ ] **Step 1:** Create datasources.yml (Prometheus default + Loki).
- [ ] **Step 2:** Verify via Task 10: `http://127.0.0.1:3001/api/health` → ok, login admin/admin.

### Task 8: Extend `infra/docker-compose.dev.yml` with 11 infra services

**Files:**
- Modify: `infra/docker-compose.dev.yml`

**Interfaces:**
- Consumes: all Task 1 env vars; mounts Tasks 2–7 config files.
- Produces: containers `samapara_{postgres,redis,qdrant,mqtt/mosquitto,minio,postgres_exporter,prometheus,loki,alloy,cadvisor,grafana}_dev` on existing network `samapara_net`.

- [ ] **Step 1:** Add `postgres` (timescaledb pg17, shared_preload_libraries timescaledb,pg_stat_statements, max_connections=100, shared_buffers=512MB, effective_cache_size=2GB, work_mem=8MB, healthcheck pg_isready, port 127.0.0.1:5432, init SQL mount).
- [ ] **Step 2:** Add `redis` (requirepass, appendonly yes, maxmemory 512mb allkeys-lru, healthcheck redis-cli PING, port 127.0.0.1:6379).
- [ ] **Step 3:** Add `qdrant` (v1.18.1, API key + read-only key env, ports 6333+6334).
- [ ] **Step 4:** Add `mosquitto` (eclipse-mosquitto:2, dev.conf mount, port 1883).
- [ ] **Step 5:** Add `minio` (server /data --console-address :9001, ports 9000+9001).
- [ ] **Step 6:** Add `postgres-exporter` (DATA_SOURCE_NAME, depends_on postgres healthy).
- [ ] **Step 7:** Add `prometheus` (retention 7d, lifecycle reload, mounts prometheus.dev.yml+rules.yml, env QDRANT read-only key).
- [ ] **Step 8:** Add `loki` (config mount, storage volume).
- [ ] **Step 9:** Add `alloy` (config mount, docker.sock read-only, depends_on loki).
- [ ] **Step 10:** Add `cadvisor` (privileged, host mounts ro).
- [ ] **Step 11:** Add `grafana` (13.1.0, admin env, allow sign up false, port 127.0.0.1:3001:3000, provisioning mount, depends_on prometheus+loki).
- [ ] **Step 12:** Register all 11 volumes in `volumes:` section.
- [ ] **Step 13: Verify:** `docker compose --env-file .env -f infra/docker-compose.dev.yml config --quiet` exits 0.

### Task 9: Start the stack

- [ ] **Step 1:** `docker compose --env-file .env -f infra/docker-compose.dev.yml up -d` (no rebuild needed for existing images).
- [ ] **Step 2:** `docker compose ... ps` — all 16 containers Up (nginx healthy etc.).

### Task 10: End-to-end verification

- [ ] **Step 1:** Postgres: `pg_isready` via exec; `psql -c '\dn'` shows bronze/silver/gold; `psql -c "SELECT hypertable_schema, hypertable_name FROM timescaledb_information.hypertables;"` shows telemetry_raw + telemetry_clean.
- [ ] **Step 2:** Redis: `redis-cli -a $REDIS_PASSWORD PING` → PONG.
- [ ] **Step 3:** Qdrant: `curl /healthz` with api-key → ok; create collection `samapara_knowledge` (384 dims, cosine, on_disk, HNSW on_disk, turbo bits4 always_ram) via `curl -X PUT`; `curl /collections/samapara_knowledge` shows quantization config turbo.
- [ ] **Step 4:** Mosquitto: port 1883 listening (ss).
- [ ] **Step 5:** MinIO: `curl http://127.0.0.1:9001/minio/health/live` → 200.
- [ ] **Step 6:** Prometheus: `/-/healthy` → ok; targets page shows 4 jobs (prometheus, postgres, qdrant, cadvisor) all UP.
- [ ] **Step 7:** Loki `/ready` → ready; Alloy container stable.
- [ ] **Step 8:** Grafana `/api/health` → ok.
- [ ] **Step 9:** Existing app routes still green: `curl localhost:8090/healthz|/api/|/decision/health|/telemetry/health|/` (same as before).

### Task 11: Architecture doc

**Files:**
- Create: `docs/ARCHITECTURE.md`

- [ ] **Step 1:** Write concise architecture doc (stack table, routes, schemas, streams design, memory budget) reflecting Nuxt web, Redis Streams, Qdrant TurboQuant bits4.
- [ ] **Step 2:** Verify file renders (read back).

### Task 12: Root `AGENTS.md` (project convention file)

**Files:**
- Create: `AGENTS.md` (repo root)

- [ ] **Step 1:** Write root AGENTS.md: project overview (smart waste management, IoT→AI→routing), stack table, how to run (infra/dev.sh, gateway port), structure map, invariants (web=Nuxt, naming samapara, Redis Streams, Qdrant TurboQuant bits4, Alloy not Promtail, .env not committed), links to docs/ARCHITECTURE.md.
- [ ] **Step 2:** Verify file reads back correctly.

### Task 13: Memory + checkpoint

- [ ] **Step 1:** Update Xninetzy memory: infra stack added, containers, ports, collection config, verification evidence, AGENTS.md created.
- [ ] **Step 2:** Write checkpoint to Xninetzy memory (goal/scope/completed/next actions: Phase B Go ingestor + Python workers, Phase C firmware).

---

## Future phases (not in this session's scope)

- **Phase B:** Go ingestor (MQTT subscribe → Redis Streams `stream:telemetry`) in `services/telemetry_worker`; Python forecast worker (Redis Streams consumer → Timescale silver/gold) + RAG ingest (Haystack + sentence-transformers → Qdrant) in `services/decision_engine`.
- **Phase C:** ESP32 firmware (`firmware/esp32`), mobile wiring, OR-Tools local routing, Google Routes integration, prod compose (internal network, TLS MQTT 8883, external S3, secrets management).
