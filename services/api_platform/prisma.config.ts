import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

// Prisma 7: konfigurasi CLI terpusat di sini.
// PRISMA_DATABASE_URL = role samapara_owner (migration/DDL only).
// Runtime memakai DATABASE_URL (role samapara_app) via driver adapter
// di src/lib/prisma.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations'
  },

  datasource: {
    url: env('PRISMA_DATABASE_URL')
  }
});
