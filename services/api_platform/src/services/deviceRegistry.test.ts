import { describe, expect, it, vi } from 'vitest'
import type { RegistryStore } from './deviceRegistry.js'
import { cacheDevice, invalidateDevice, registryKey } from './deviceRegistry.js'

function createFakeStore() {
  return {
    hSet: vi.fn(async () => {}),
    expire: vi.fn(async () => {}),
    del: vi.fn(async () => {}),
  }
}

const activeDevice = { id: 'dev-1', serial_number: 'SN-001', active: true }
const inactiveDevice = { id: 'dev-2', serial_number: 'SN-002', active: false }

describe('registryKey', () => {
  it('builds the shared registry key', () => {
    expect(registryKey('dev-1')).toBe('registry:device:dev-1')
  })
})

describe('cacheDevice', () => {
  it('writes id serial_number and active fields with a 300s ttl', async () => {
    const store = createFakeStore() as unknown as RegistryStore
    await cacheDevice(store, activeDevice)
    expect(store.hSet).toHaveBeenCalledWith('registry:device:dev-1', 'id', 'dev-1')
    expect(store.hSet).toHaveBeenCalledWith('registry:device:dev-1', 'serial_number', 'SN-001')
    expect(store.hSet).toHaveBeenCalledWith('registry:device:dev-1', 'active', '1')
    expect(store.expire).toHaveBeenCalledWith('registry:device:dev-1', 300)
  })

  it('writes active as 0 for an inactive device', async () => {
    const store = createFakeStore() as unknown as RegistryStore
    await cacheDevice(store, inactiveDevice)
    expect(store.hSet).toHaveBeenCalledWith('registry:device:dev-2', 'active', '0')
  })
})

describe('invalidateDevice', () => {
  it('deletes the registry key', async () => {
    const store = createFakeStore() as unknown as RegistryStore
    await invalidateDevice(store, 'dev-1')
    expect(store.del).toHaveBeenCalledWith('registry:device:dev-1')
  })
})
