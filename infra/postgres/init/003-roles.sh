#!/bin/sh
# ============================================================
# SAMAPARA — buat role PostgreSQL dengan least privilege.
# Dijalankan docker-entrypoint-initdb.d SETELAH 001-init.sql
# (urutan alfabetis), sebagai POSTGRES_USER (superuser dev).
#
# Role:
#   samapara_owner      migration / DDL only (Prisma CLI)
#   samapara_app        Hono / Prisma runtime
#   samapara_ingestor_ro  Go read-only (device registry fallback)
#   samapara_ai         Python telemetry + forecast + RAG
#
# Table-level grants dijalankan TERPISAH (infra/postgres/grants.sql)
# setelah Prisma migrations — karena tabel public/gold dibuat
# oleh Prisma/init, bukan di sini.
# ============================================================
set -eu

psql --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL

DO \$\$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = '${POSTGRES_OWNER_USER}'
    ) THEN
        CREATE ROLE ${POSTGRES_OWNER_USER} LOGIN PASSWORD '${POSTGRES_OWNER_PASSWORD}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = '${POSTGRES_APP_USER}'
    ) THEN
        CREATE ROLE ${POSTGRES_APP_USER} LOGIN PASSWORD '${POSTGRES_APP_PASSWORD}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = '${POSTGRES_INGESTOR_USER}'
    ) THEN
        CREATE ROLE ${POSTGRES_INGESTOR_USER} LOGIN PASSWORD '${POSTGRES_INGESTOR_PASSWORD}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = '${POSTGRES_AI_USER}'
    ) THEN
        CREATE ROLE ${POSTGRES_AI_USER} LOGIN PASSWORD '${POSTGRES_AI_PASSWORD}';
    END IF;

END
\$\$;


GRANT CONNECT ON DATABASE ${POSTGRES_DB}
TO ${POSTGRES_OWNER_USER}, ${POSTGRES_APP_USER}, ${POSTGRES_INGESTOR_USER}, ${POSTGRES_AI_USER};


-- owner: DDL penuh di schema yang dikelola Prisma (public, gold)
GRANT ALL ON SCHEMA public, gold TO ${POSTGRES_OWNER_USER};


-- Hono runtime
GRANT USAGE ON SCHEMA public, gold TO ${POSTGRES_APP_USER};


-- Go ingestor: read-only (hanya public.devices via grants.sql)
GRANT USAGE ON SCHEMA public TO ${POSTGRES_INGESTOR_USER};


-- Python AI worker
GRANT USAGE ON SCHEMA public, bronze, silver, gold TO ${POSTGRES_AI_USER};

EOSQL
