import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { UpstreamError } from '../clients/internalHttp.js'
import { runForecast } from '../clients/decisionEngine.js'
import { HttpError } from '../lib/httpError.js'
import { jsonSafe } from '../lib/serialize.js'
import * as deviceService from '../services/deviceService.js'
import * as forecastService from '../services/forecastService.js'
import * as aiAuditService from '../services/aiAuditService.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function requireDeviceId(c: Context): string {
  const id = c.req.param('id') ?? ''
  if (!UUID_PATTERN.test(id)) {
    throw new HttpError(404, 'device not found')
  }
  return id
}

const upsertDeviceSchema = z.object({
  serial_number: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  location_name: z.string().max(200).nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish()
})

const createForecastSchema = z.object({
  forecast_for: z.string().datetime({ offset: true }),
  p50: z.number().nullish(),
  p80: z.number().nullish(),
  p90: z.number().nullish(),
  predicted_weight_kg: z.number().nullish(),
  risk_level: z.string().max(50).nullish(),
  model_name: z.string().max(100).nullish(),
  model_version: z.string().max(50).nullish()
})

export function deviceRoutes() {
  const router = new Hono()

  router.get('/', async (c) => {
    const devices = await deviceService.listActive()
    return c.json({ devices, count: devices.length })
  })

  router.post('/', zValidator('json', upsertDeviceSchema), async (c) => {
    const body = c.req.valid('json')
    const device = await deviceService.upsertBySerial(body)
    return c.json({ device }, 201)
  })

  router.get('/:id', async (c) => {
    const device = await deviceService.findById(requireDeviceId(c))
    if (!device) {
      throw new HttpError(404, 'device not found')
    }
    const latest = await forecastService.getLatest(device.id)
    return c.json({ device, latest_forecast: jsonSafe(latest) })
  })

  router.get('/:id/forecasts', async (c) => {
    const device = await deviceService.findById(requireDeviceId(c))
    if (!device) {
      throw new HttpError(404, 'device not found')
    }
    const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 48), 1), 500)
    const series = await forecastService.getSeries(device.id, limit)
    return c.json({ device_id: device.id, series: jsonSafe(series) })
  })

  router.post('/:id/forecasts', zValidator('json', createForecastSchema), async (c) => {
    const device = await deviceService.findById(requireDeviceId(c))
    if (!device) {
      throw new HttpError(404, 'device not found')
    }
    const body = c.req.valid('json')
    const forecast = await forecastService.create({
      device_id: device.id,
      forecast_for: new Date(body.forecast_for),
      p50: body.p50 ?? null,
      p80: body.p80 ?? null,
      p90: body.p90 ?? null,
      predicted_weight_kg: body.predicted_weight_kg ?? null,
      risk_level: body.risk_level ?? null,
      model_name: body.model_name ?? null,
      model_version: body.model_version ?? null
    })
    await aiAuditService.log({
      actor_type: 'api',
      action: 'forecast.create',
      input: { device_id: device.id, forecast_for: body.forecast_for },
      output: { forecast_id: String(forecast.id) }
    })
    return c.json({ forecast: jsonSafe(forecast) }, 201)
  })

  router.post('/:id/forecast/run', async (c) => {
    const device = await deviceService.findById(requireDeviceId(c))
    if (!device) {
      throw new HttpError(404, 'device not found')
    }
    let result
    try {
      result = await runForecast(device.id)
    } catch (err) {
      if (err instanceof UpstreamError) {
        throw new HttpError(502, 'decision engine unavailable')
      }
      throw err
    }
    await aiAuditService.log({
      actor_type: 'api',
      action: 'forecast.run',
      input: { device_id: device.id },
      output: result,
    })
    return c.json({ forecast: result })
  })

  return router
}
