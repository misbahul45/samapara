import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HttpError } from '../lib/httpError.js'
import { publish } from '../lib/redis.js'
import * as shipmentService from '../services/shipmentService.js'
import * as aiAuditService from '../services/aiAuditService.js'

const createShipmentSchema = z.object({
  device_ids: z.array(z.string().uuid()).optional(),
  estimated_weight_kg: z.number().positive().nullish(),
  planned_start: z.string().datetime({ offset: true }).nullish(),
  route: z.record(z.string(), z.unknown()).nullish()
})

const updateStatusSchema = z.object({
  status: z.enum(shipmentService.SHIPMENT_STATUSES)
})

export function shipmentRoutes() {
  const router = new Hono()

  router.get('/', async (c) => {
    const status = c.req.query('status')
    const valid = shipmentService.SHIPMENT_STATUSES.includes(status as never)
    const shipments = await shipmentService.list(valid ? (status as shipmentService.ShipmentStatus) : undefined)
    return c.json({ shipments, count: shipments.length })
  })

  router.post('/', zValidator('json', createShipmentSchema), async (c) => {
    const body = c.req.valid('json')
    const shipment = await shipmentService.create({
      device_ids: body.device_ids,
      estimated_weight_kg: body.estimated_weight_kg ?? null,
      planned_start: body.planned_start ? new Date(body.planned_start) : null,
      route: body.route ?? null
    })
    await publish('shipment:events', { event: 'shipment.created', shipment_id: shipment.id })
    return c.json({ shipment }, 201)
  })

  router.get('/:id', async (c) => {
    const shipment = await shipmentService.findById(c.req.param('id'))
    if (!shipment) {
      throw new HttpError(404, 'shipment not found')
    }
    return c.json({ shipment })
  })

  router.patch('/:id', zValidator('json', updateStatusSchema), async (c) => {
    const shipment = await shipmentService.findById(c.req.param('id'))
    if (!shipment) {
      throw new HttpError(404, 'shipment not found')
    }
    const body = c.req.valid('json')
    const updated = await shipmentService.updateStatus(shipment.id, body.status)
    await publish('shipment:events', { event: 'shipment.status_changed', shipment_id: shipment.id, status: body.status })
    await aiAuditService.log({
      actor_type: 'api',
      action: 'shipment.status_changed',
      input: { shipment_id: shipment.id, from: shipment.status, to: body.status }
    })
    return c.json({ shipment: updated })
  })

  return router
}
