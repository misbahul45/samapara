import { useQuery } from '@tanstack/vue-query'
import { deviceKeys } from './deviceKeys'

export interface Device {
  id: string
  serial_number: string
  name: string
  location_name: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface DeviceListResponse {
  devices: Device[]
  count: number
}

export function useDevicesQuery() {
  const api = useApi()
  return useQuery({
    queryKey: deviceKeys.list(),
    queryFn: () => api.get<DeviceListResponse>('/devices')
  })
}

export function useDeviceDetailQuery(deviceId: string) {
  const api = useApi()
  return useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: () => api.get<{ device: Device, latest_forecast: unknown | null }>(`/devices/${deviceId}`),
    enabled: () => deviceId.length > 0
  })
}
