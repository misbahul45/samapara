-- ============================================================
-- SAMPARA — init PostgreSQL + TimescaleDB
-- Dijalankan sekali saat volume postgres pertama kali dibuat
-- (docker-entrypoint-initdb.d). Idempotent: IF NOT EXISTS.
--
-- Layering data (bukan 3 database terpisah — satu service):
--   bronze -> telemetry_raw  (mentah dari MQTT, idempotent via stream_id)
--   silver -> telemetry_clean (tersanitasi + anomaly score)
--   gold   -> forecasts, shipments, route_results (siap konsumsi)
--
-- Catatan ownership:
--   - public + gold      : Prisma (CLI pakai role sampara_owner;
--                          runtime pakai sampara_app)
--   - bronze + silver    : SQL init + worker Python (sampara_ai)
--   - devices            : ditulis Hono (sampara_app), dibaca Go
--                          (sampara_ingestor_ro) & Python (sampara_ai)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE SCHEMA IF NOT EXISTS bronze;
CREATE SCHEMA IF NOT EXISTS silver;
CREATE SCHEMA IF NOT EXISTS gold;

-- ------------------------------------------------------------------
-- public: master data device
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY,
    serial_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location_name TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_active
ON public.devices (active);

-- ------------------------------------------------------------------
-- public: user (auth fase lanjutan; dibuat agar schema Prisma
-- public+gold selalu sinkron dengan database)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'OPERATOR',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role
ON public.users (role);

-- ------------------------------------------------------------------
-- bronze: telemetry mentah apa adanya.
-- stream_id = ID entry Redis Streams (mis. "1754600000123-0") —
-- membuat persistence idempotent saat worker crash setelah commit
-- tapi sebelum XACK (redelivery di-dedupe oleh UNIQUE (time, stream_id)).
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bronze.telemetry_raw (
    time TIMESTAMPTZ NOT NULL,
    stream_id TEXT NOT NULL,
    device_id UUID NOT NULL,
    sequence BIGINT,
    weight_kg DOUBLE PRECISION,
    distance_cm DOUBLE PRECISION,
    battery_percent DOUBLE PRECISION,
    signal_strength INTEGER,
    raw_payload JSONB,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable(
    'bronze.telemetry_raw',
    'time',
    if_not_exists => TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_telemetry_raw_stream
ON bronze.telemetry_raw (
    time,
    stream_id
);

CREATE INDEX IF NOT EXISTS idx_telemetry_raw_device_time
ON bronze.telemetry_raw (
    device_id,
    time DESC
);

-- ------------------------------------------------------------------
-- silver: telemetry bersih hasil normalisasi + anomaly score
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS silver.telemetry_clean (
    time TIMESTAMPTZ NOT NULL,
    stream_id TEXT NOT NULL,
    device_id UUID NOT NULL,
    sequence BIGINT,

    weight_kg DOUBLE PRECISION,
    fill_percent DOUBLE PRECISION,

    anomaly_score DOUBLE PRECISION,

    quality_status TEXT NOT NULL DEFAULT 'VALID',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable(
    'silver.telemetry_clean',
    'time',
    if_not_exists => TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_telemetry_clean_stream
ON silver.telemetry_clean (
    time,
    stream_id
);

CREATE INDEX IF NOT EXISTS idx_telemetry_clean_device_time
ON silver.telemetry_clean (
    device_id,
    time DESC
);

-- ------------------------------------------------------------------
-- gold: hasil forecasting (P50/P80/P90)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gold.forecasts (
    id BIGSERIAL PRIMARY KEY,

    device_id UUID NOT NULL,

    forecast_for TIMESTAMPTZ NOT NULL,

    p50 DOUBLE PRECISION,
    p80 DOUBLE PRECISION,
    p90 DOUBLE PRECISION,

    predicted_weight_kg DOUBLE PRECISION,

    risk_level TEXT,

    model_name TEXT,
    model_version TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecast_device_time
ON gold.forecasts (
    device_id,
    forecast_for DESC
);

-- ------------------------------------------------------------------
-- gold: shipment (pengangkutan terencana)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gold.shipments (
    id UUID PRIMARY KEY,

    status TEXT NOT NULL,

    estimated_weight_kg DOUBLE PRECISION,

    planned_start TIMESTAMPTZ,

    route_distance_meters BIGINT,
    route_duration_seconds BIGINT,

    route JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------
-- public: audit log aksi AI/agent (human-in-the-loop)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
    id BIGSERIAL PRIMARY KEY,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    actor_type TEXT NOT NULL,

    agent_name TEXT,

    action TEXT NOT NULL,

    input JSONB,
    output JSONB,

    approved BOOLEAN,
    approved_by TEXT
);
