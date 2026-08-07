import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpstreamError } from './clients/internalHttp.js'

vi.mock('./clients/decisionEngine.js', () => ({
  runForecast: vi.fn(),
}))
vi.mock('./services/deviceService.js', () => ({
  findById: vi.fn(),
}))
vi.mock('./services/aiAuditService.js', () => ({
  log: vi.fn(async () => {}),
}))

import { buildApp } from './app.js'
import { runForecast } from './clients/decisionEngine.js'
import * as deviceService from './services/deviceService.js'
import * as aiAuditService from './services/aiAuditService.js'

const app = buildApp()
const findById = vi.mocked(deviceService.findById)
const runForecastMock = vi.mocked(runForecast)
const auditLog = vi.mocked(aiAuditService.log)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('public health', () => {
  it('answers healthz without auth', async () => {
    const res = await app.request('/healthz')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })
})

describe('internal routes', () => {
  it('rejects requests without the service token', async () => {
    const res = await app.request('/internal/v1/health')
    expect(res.status).toBe(401)
  })

  it('rejects requests with a wrong token', async () => {
    const res = await app.request('/internal/v1/health', {
      headers: { authorization: 'Bearer wrong-token' },
    })
    expect(res.status).toBe(401)
  })

  it('accepts requests with the service token', async () => {
    const res = await app.request('/internal/v1/health', {
      headers: { authorization: 'Bearer test-token' },
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ service: 'api_platform', status: true })
  })
})

describe('cors', () => {
  it('adds allow-origin for the configured public origin', async () => {
    const res = await app.request('/api/devices/unknown', {
      headers: { origin: 'http://localhost:8090' },
    })
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:8090')
  })
})

describe('forecast run', () => {
  it('returns 404 when the device does not exist', async () => {
    findById.mockResolvedValue(null)
    const res = await app.request('/api/devices/11111111-1111-4111-8111-111111111111/forecast/run', {
      method: 'POST',
    })
    expect(res.status).toBe(404)
    expect(runForecastMock).not.toHaveBeenCalled()
  })

  it('returns 404 for a malformed device id without querying the database', async () => {
    const res = await app.request('/api/devices/not-a-uuid/forecast/run', {
      method: 'POST',
    })
    expect(res.status).toBe(404)
    expect(findById).not.toHaveBeenCalled()
  })

  it('runs the forecast and returns the result', async () => {
    findById.mockResolvedValue({ id: '11111111-1111-4111-8111-111111111111', serial_number: 'SN-001' } as never)
    runForecastMock.mockResolvedValue({ deviceId: '11111111-1111-4111-8111-111111111111', p50: 10, p80: 11, p90: 12 })
    const res = await app.request('/api/devices/11111111-1111-4111-8111-111111111111/forecast/run', {
      method: 'POST',
    })
    expect(res.status).toBe(200)
    expect(runForecastMock).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111')
    expect(await res.json()).toEqual({ forecast: { deviceId: '11111111-1111-4111-8111-111111111111', p50: 10, p80: 11, p90: 12 } })
    expect(auditLog).toHaveBeenCalledWith({
      actor_type: 'api',
      action: 'forecast.run',
      input: { device_id: '11111111-1111-4111-8111-111111111111' },
      output: { deviceId: '11111111-1111-4111-8111-111111111111', p50: 10, p80: 11, p90: 12 },
    })
  })

  it('returns 502 when the decision engine is unreachable', async () => {
    findById.mockResolvedValue({ id: '11111111-1111-4111-8111-111111111111', serial_number: 'SN-001' } as never)
    runForecastMock.mockRejectedValue(new UpstreamError(503, 'upstream down'))
    const res = await app.request('/api/devices/11111111-1111-4111-8111-111111111111/forecast/run', {
      method: 'POST',
    })
    expect(res.status).toBe(502)
  })
})
