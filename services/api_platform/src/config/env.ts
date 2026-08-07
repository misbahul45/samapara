import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  DECISION_ENGINE_URL: z.string().url(),
  TELEMETRY_WORKER_URL: z.string().url(),
  INTERNAL_SERVICE_TOKEN: z.string().min(1),
  PUBLIC_ORIGIN: z.string().url(),
})

export interface Env {
  port: number
  databaseUrl: string
  redisUrl: string
  decisionEngineUrl: string
  telemetryWorkerUrl: string
  internalServiceToken: string
  publicOrigin: string
}

let cached: Env | null = null

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    const invalid = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`invalid environment: ${invalid}`)
  }
  return {
    port: parsed.data.PORT,
    databaseUrl: parsed.data.DATABASE_URL,
    redisUrl: parsed.data.REDIS_URL,
    decisionEngineUrl: parsed.data.DECISION_ENGINE_URL,
    telemetryWorkerUrl: parsed.data.TELEMETRY_WORKER_URL,
    internalServiceToken: parsed.data.INTERNAL_SERVICE_TOKEN,
    publicOrigin: parsed.data.PUBLIC_ORIGIN,
  }
}

export function getEnv(): Env {
  cached ??= loadEnv()
  return cached
}
