import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.js'

export interface UpsertDeviceInput {
  serial_number: string
  name: string
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
}

export function findBySerial(serialNumber: string) {
  return prisma.devices.findUnique({
    where: { serial_number: serialNumber }
  })
}

export function findById(id: string) {
  return prisma.devices.findUnique({
    where: { id }
  })
}

export function listActive() {
  return prisma.devices.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })
}

export async function upsertBySerial(input: UpsertDeviceInput) {
  const data = {
    name: input.name,
    location_name: input.location_name ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null
  }
  return prisma.devices.upsert({
    where: { serial_number: input.serial_number },
    update: data,
    create: {
      id: randomUUID(),
      serial_number: input.serial_number,
      ...data
    }
  })
}
