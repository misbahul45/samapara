-- ============================================================
-- SAMAPARA — migration live fase B (2026-08-08)
-- Hanya untuk volume dev yang sudah ada dari fase A.
-- Volume BARU tidak butuh file ini (001-init.sql sudah lengkap).
-- Idempotent: aman dijalankan ulang.
--   docker exec -i samapara_postgres_dev \
--     psql -U samapara -d samapara < infra/postgres/migrations/2026-08-08-phase-b-alter.sql
-- ============================================================

-- public.devices: flag active untuk registry Go
ALTER TABLE public.devices
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_devices_active
ON public.devices (active);

-- public.users: tabel auth (schema Prisma public+gold sinkron)
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

-- bronze.telemetry_raw: stream_id + sequence untuk idempotency
-- (stream_id = ID entry Redis Streams)
ALTER TABLE bronze.telemetry_raw
ADD COLUMN IF NOT EXISTS stream_id TEXT NOT NULL DEFAULT '';

ALTER TABLE bronze.telemetry_raw
ADD COLUMN IF NOT EXISTS sequence BIGINT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_telemetry_raw_stream
ON bronze.telemetry_raw (time, stream_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_raw_device_time
ON bronze.telemetry_raw (device_id, time DESC);

-- silver.telemetry_clean: stream_id + sequence
ALTER TABLE silver.telemetry_clean
ADD COLUMN IF NOT EXISTS stream_id TEXT NOT NULL DEFAULT '';

ALTER TABLE silver.telemetry_clean
ADD COLUMN IF NOT EXISTS sequence BIGINT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_telemetry_clean_stream
ON silver.telemetry_clean (time, stream_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_clean_device_time
ON silver.telemetry_clean (device_id, time DESC);
