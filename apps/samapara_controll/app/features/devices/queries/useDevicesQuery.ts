import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useApi } from '~/shared/api/client'
import { useServerPrefetchQuery } from '~/shared/query/useServerPrefetchQuery'
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

export interface ForecastResult {
  status: string
  data: {
    device_id: string
    p50: number
    p80: number
    p90: number
  }
}

export interface DeviceListResponse {
  devices: Device[]
  count: number
}

export function useDevicesQuery() {
  const api = useApi()
  const query = useQuery({
    queryKey: deviceKeys.list(),
    queryFn: () => api.get<DeviceListResponse>('/devices')
  })

  return useServerPrefetchQuery(query)
}

export function useDeviceDetailQuery(deviceId: string) {
  const api = useApi()
  const query = useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: () => api.get<{ device: Device, latest_forecast: unknown | null }>(`/devices/${deviceId}`),
    enabled: () => deviceId.length > 0
  })

  return useServerPrefetchQuery(query, deviceId.length > 0)
}

export function useRunForecastMutation() {
  const api = useApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (deviceId: string) => api.post<{ forecast: ForecastResult }>(`/devices/${deviceId}/forecast/run`),
    onSuccess: (_data, deviceId) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId) })
    }
  })
}
