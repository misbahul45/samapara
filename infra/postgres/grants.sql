-- ============================================================
-- SAMPARA — grants table-level setelah Prisma migrations.
--
-- Jalankan sebagai SUPERUSER dev (POSTGRES_USER):
--   docker exec -i sampara_postgres_dev \
--     psql -U sampara -d sampara < infra/postgres/grants.sql
--
-- Aturan ownership:
--   public + gold  -> Hono/Prisma (sampara_app runtime)
--   bronze + silver-> worker Python (sampara_ai)
--   devices        -> SELECT untuk Go (ingestor) & Python (AI)
-- ============================================================

-- ------------------------------------------------------------------
-- sampara_owner (migration): DDL penuh + default privileges
-- untuk tabel yang akan dibuat migration ke depan
-- ------------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public, gold TO sampara_owner;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public, gold TO sampara_owner;

ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA public
GRANT ALL ON TABLES TO sampara_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA gold
GRANT ALL ON TABLES TO sampara_owner;

-- ------------------------------------------------------------------
-- Hono runtime (sampara_app): CRUD di public + gold
-- ------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public, gold
TO sampara_app;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public, gold
TO sampara_app;

ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sampara_app;
ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA gold
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sampara_app;

ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO sampara_app;
ALTER DEFAULT PRIVILEGES FOR ROLE sampara_owner IN SCHEMA gold
GRANT USAGE, SELECT ON SEQUENCES TO sampara_app;

-- ------------------------------------------------------------------
-- Go ingestor (sampara_ingestor_ro): read-only device registry
-- ------------------------------------------------------------------
GRANT SELECT
ON public.devices
TO sampara_ingestor_ro;

-- ------------------------------------------------------------------
-- Python telemetry (sampara_ai): insert bronze/silver
-- ------------------------------------------------------------------
GRANT SELECT, INSERT
ON ALL TABLES IN SCHEMA bronze, silver
TO sampara_ai;

-- ------------------------------------------------------------------
-- Python forecast (sampara_ai): tulis gold.forecasts
-- ------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE
ON gold.forecasts
TO sampara_ai;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA gold
TO sampara_ai;

-- AI butuh metadata device
GRANT SELECT
ON public.devices
TO sampara_ai;
