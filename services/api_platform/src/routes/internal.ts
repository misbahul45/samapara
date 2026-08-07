import { Hono } from 'hono'

export function createInternalRouter() {
  const internal = new Hono()
  internal.get('/v1/health', (c) => c.json({ service: 'api_platform', status: true }))
  return internal
}
