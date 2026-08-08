import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet, apiPost } from '@/api/client';

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: () => [...deviceKeys.lists()] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
  forecasts: (id: string) => [...deviceKeys.detail(id), 'forecasts'] as const
};

export interface Device {
  id: string;
  serial_number: string;
  name: string;
  location_name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeviceListResponse {
  devices: Device[];
  count: number;
}

export interface ForecastResult {
  status: string;
  data: {
    device_id: string;
    p50: number;
    p80: number;
    p90: number;
  };
}

interface DeviceDetailResponse {
  device: Device;
  latest_forecast: ForecastResult['data'] | null;
}

export function useDevicesQuery() {
  return useQuery({
    queryKey: deviceKeys.list(),
    queryFn: () => apiGet<DeviceListResponse>('/devices')
  });
}

export function useDeviceDetailQuery(deviceId: string) {
  return useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: () => apiGet<DeviceDetailResponse>(`/devices/${deviceId}`),
    enabled: deviceId.length > 0
  });
}

export function useRunForecastMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) =>
      apiPost<{ forecast: ForecastResult }>(`/devices/${deviceId}/forecast/run`),
    onSuccess: (_data, deviceId) => {
      void queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId) });
    }
  });
}
