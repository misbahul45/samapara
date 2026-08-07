import { randomUUID } from 'node:crypto'
import { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

export const SHIPMENT_STATUSES = ['draft', 'scheduled', 'assigned', 'in_progress', 'completed', 'cancelled'] as const

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number]

export interface CreateShipmentInput {
  device_ids?: string[]
  estimated_weight_kg?: number | null
  planned_start?: Date | null
  route?: Record<string, unknown> | null
}

export async function create(input: CreateShipmentInput) {
  const data: Prisma.shipmentsUncheckedCreateInput = {
    id: randomUUID(),
    status: 'draft',
    estimated_weight_kg: input.estimated_weight_kg ?? null,
    planned_start: input.planned_start ?? null
  }
  const hasDeviceIds = input.device_ids !== undefined && input.device_ids.length > 0
  if (hasDeviceIds || input.route) {
    const routePayload: Record<string, unknown> = input.route
      ? { ...input.route }
      : {}
    if (hasDeviceIds) {
      routePayload.device_ids = input.device_ids
    }
    data.route = routePayload as Prisma.InputJsonValue
  }
  return prisma.shipments.create({ data })
}

export function findById(id: string) {
  return prisma.shipments.findUnique({
    where: { id }
  })
}

export function list(status?: ShipmentStatus) {
  return prisma.shipments.findMany({
    where: status ? { status } : undefined,
    orderBy: { created_at: 'desc' }
  })
}

export async function updateStatus(id: string, status: ShipmentStatus) {
  return prisma.shipments.update({
    where: { id },
    data: { status, updated_at: new Date() }
  })
}
