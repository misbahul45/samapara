import { getEnv } from '../config/env.js'
import { upstreamJson } from './internalHttp.js'

export interface DeviceCommand {
  command: string
  payload?: Record<string, unknown>
}

export async function sendDeviceCommand(
  deviceId: string,
  command: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  const body: DeviceCommand = { command, ...(payload ? { payload } : {}) }
  await upstreamJson(
    getEnv().telemetryWorkerUrl,
    `/internal/v1/devices/${encodeURIComponent(deviceId)}/commands`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}
