import { prisma } from '../lib/prisma.js'

export interface CreateForecastInput {
  device_id: string
  forecast_for: Date
  p50?: number | null
  p80?: number | null
  p90?: number | null
  predicted_weight_kg?: number | null
  risk_level?: string | null
  model_name?: string | null
  model_version?: string | null
}

export function getLatest(deviceId: string) {
  return prisma.forecasts.findFirst({
    where: { device_id: deviceId },
    orderBy: { forecast_for: 'desc' }
  })
}

export function getSeries(deviceId: string, limit = 48) {
  return prisma.forecasts.findMany({
    where: { device_id: deviceId },
    orderBy: { forecast_for: 'asc' },
    take: limit
  })
}

export function create(input: CreateForecastInput) {
  return prisma.forecasts.create({
    data: input
  })
}
