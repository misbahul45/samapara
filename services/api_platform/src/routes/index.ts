import { Hono } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { UpstreamError } from '../clients/internalHttp.js'
import { HttpError } from '../lib/httpError.js'
import { deviceRoutes } from './devices.js'
import { shipmentRoutes } from './shipments.js'

export function createApiRouter() {
  const api = new Hono()

  api.onError((err, c) => {
    if (err instanceof HttpError) {
      return c.json({ error: err.message }, err.status as ContentfulStatusCode)
    }
    if (err instanceof UpstreamError) {
      return c.json({ error: 'upstream service unavailable' }, 502)
    }
    console.error('unhandled error:', err)
    return c.json({ error: 'internal server error' }, 500)
  })

  api.get('/', (c) => {
    return c.json({
      service: 'api_platform',
      status: 'ok',
      time: new Date().toISOString()
    })
  })

  api.route('/devices', deviceRoutes())
  api.route('/shipments', shipmentRoutes())

  return api
}
