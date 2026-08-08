import { bearerAuth } from 'hono/bearer-auth'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { getEnv } from './config/env.js'
import { createApiRouter } from './routes/index.js'
import { createInternalRouter } from './routes/internal.js'

export function buildApp() {
  const env = getEnv()
  const app = new Hono()
  app.use('*', logger())
  app.use('*', secureHeaders())
  app.use('/api/*', cors({ origin: env.publicOrigins }))
  app.use('/internal/*', bearerAuth({ token: env.internalServiceToken }))
  app.get('/healthz', (c) => c.json({ status: 'ok' }))
  app.route('/api', createApiRouter())
  app.route('/internal', createInternalRouter())
  return app
}
