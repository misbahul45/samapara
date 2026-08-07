import { describe, expect, it } from 'vitest'
import { loadEnv } from './env.js'

const fullEnv = {
  PORT: '4000',
  DATABASE_URL: 'postgresql://samapara_app:secret@localhost:5432/samapara',
  REDIS_URL: 'redis://:secret@localhost:6379/0',
  DECISION_ENGINE_URL: 'http://decision_engine:8000',
  TELEMETRY_WORKER_URL: 'http://telemetry_worker:8080',
  INTERNAL_SERVICE_TOKEN: 'token-abc',
  PUBLIC_ORIGIN: 'http://localhost:8090',
}

describe('loadEnv', () => {
  it('throws when a required variable is missing', () => {
    expect(() => loadEnv({})).toThrow(/DATABASE_URL|INTERNAL_SERVICE_TOKEN|PUBLIC_ORIGIN/)
  })

  it('throws when an url variable is not a valid url', () => {
    expect(() =>
      loadEnv({ ...fullEnv, DECISION_ENGINE_URL: 'not-a-url' })
    ).toThrow(/DECISION_ENGINE_URL/)
  })

  it('parses valid variables into typed values', () => {
    const env = loadEnv(fullEnv)
    expect(env.port).toBe(4000)
    expect(env.databaseUrl).toBe(fullEnv.DATABASE_URL)
    expect(env.decisionEngineUrl).toBe('http://decision_engine:8000')
    expect(env.telemetryWorkerUrl).toBe('http://telemetry_worker:8080')
    expect(env.internalServiceToken).toBe('token-abc')
    expect(env.publicOrigin).toBe('http://localhost:8090')
  })
})
