export { default as DeviceDetailView } from './views/DeviceDetailView.vue'
export {
  useDeviceDetailQuery,
  useDevicesQuery,
  useRunForecastMutation
} from './queries/useDevicesQuery'
export type {
  Device,
  DeviceListResponse,
  ForecastResult
} from './queries/useDevicesQuery'
