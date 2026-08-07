import { createClient } from 'redis'
import type { RedisClientType } from 'redis'
import { getEnv } from '../config/env.js'

let client: RedisClientType | null = null

export function getRedisClient(): RedisClientType | null {
  if (!getEnv().redisUrl) {
    return null
  }
  if (!client) {
    client = createClient({ url: getEnv().redisUrl })
    client.on('error', (err) => {
      console.error('redis error:', err.message)
    })
  }
  return client
}

export async function connectRedis(): Promise<void> {
  const redis = getRedisClient()
  if (redis && !redis.isOpen) {
    await redis.connect()
  }
}

export async function disconnectRedis(): Promise<void> {
  if (client && client.isOpen) {
    await client.disconnect()
  }
}

export async function publish(channel: string, message: unknown): Promise<void> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      return
    }
    await redis.publish(channel, JSON.stringify(message))
  } catch (err) {
    console.error('redis publish failed:', (err as Error).message)
  }
}

export async function xadd(stream: string, fields: Record<string, string>): Promise<void> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      return
    }
    await redis.xAdd(stream, '*', fields, {
      TRIM: { strategy: 'MAXLEN', strategyModifier: '~', threshold: 10_000 }
    })
  } catch (err) {
    console.error('redis xadd failed:', (err as Error).message)
  }
}
