-- ============================================================
-- SAMAPARA — grants table-level setelah Prisma migrations.
--
-- Jalankan sebagai SUPERUSER dev (POSTGRES_USER):
--   docker exec -i samapara_postgres_dev \
--     psql -U samapara -d samapara < infra/postgres/grants.sql
--
-- Aturan ownership:
--   public + gold  -> Hono/Prisma (samapara_app runtime)
--   bronze + silver-> worker Python (samapara_ai)
--   devices        -> SELECT untuk Go (ingestor) & Python (AI)
-- ============================================================

-- ------------------------------------------------------------------
-- samapara_owner (migration): DDL penuh + default privileges
-- untuk tabel yang akan dibuat migration ke depan
-- ------------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public, gold TO samapara_owner;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public, gold TO samapara_owner;

ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA public
GRANT ALL ON TABLES TO samapara_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA gold
GRANT ALL ON TABLES TO samapara_owner;

-- ------------------------------------------------------------------
-- Hono runtime (samapara_app): CRUD di public + gold
-- ------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public, gold
TO samapara_app;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public, gold
TO samapara_app;

ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO samapara_app;
ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA gold
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO samapara_app;

ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO samapara_app;
ALTER DEFAULT PRIVILEGES FOR ROLE samapara_owner IN SCHEMA gold
GRANT USAGE, SELECT ON SEQUENCES TO samapara_app;

-- ------------------------------------------------------------------
-- Go ingestor (samapara_ingestor_ro): read-only device registry
-- ------------------------------------------------------------------
GRANT SELECT
ON public.devices
TO samapara_ingestor_ro;

-- ------------------------------------------------------------------
-- Python telemetry (samapara_ai): insert bronze/silver
-- ------------------------------------------------------------------
GRANT SELECT, INSERT
ON ALL TABLES IN SCHEMA bronze, silver
TO samapara_ai;

-- ------------------------------------------------------------------
-- Python forecast (samapara_ai): tulis gold.forecasts
-- ------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE
ON gold.forecasts
TO samapara_ai;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA gold
TO samapara_ai;

-- AI butuh metadata device
GRANT SELECT
ON public.devices
TO samapara_ai;
