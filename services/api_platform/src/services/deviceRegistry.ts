export interface RegistryStore {
  hSet(key: string, field: string, value: string): Promise<unknown>
  expire(key: string, seconds: number): Promise<unknown>
  del(key: string): Promise<unknown>
}

export const REGISTRY_TTL_SECONDS = 300

export function registryKey(deviceId: string): string {
  return `registry:device:${deviceId}`
}

export interface RegistryDevice {
  id: string
  serial_number: string | null
  active: boolean
}

export async function cacheDevice(
  store: RegistryStore,
  device: RegistryDevice,
  ttlSeconds: number = REGISTRY_TTL_SECONDS,
): Promise<void> {
  const key = registryKey(device.id)
  await store.hSet(key, 'id', device.id)
  await store.hSet(key, 'serial_number', device.serial_number ?? '')
  await store.hSet(key, 'active', device.active ? '1' : '0')
  await store.expire(key, ttlSeconds)
}

export async function invalidateDevice(store: RegistryStore, deviceId: string): Promise<void> {
  await store.del(registryKey(deviceId))
}
