import { describe, expect, it } from 'vitest'
import { jsonSafe } from './serialize.js'

describe('jsonSafe', () => {
  it('serializes nested BigInt as string', () => {
    const value = jsonSafe({ id: 42n, nested: { value: 7n } })
    expect(JSON.stringify(value)).toBe('{"id":"42","nested":{"value":"7"}}')
  })

  it('keeps plain values unchanged', () => {
    const value = jsonSafe({ p50: 15, p80: 16.5, p90: null })
    expect(JSON.stringify(value)).toBe('{"p50":15,"p80":16.5,"p90":null}')
  })
})
