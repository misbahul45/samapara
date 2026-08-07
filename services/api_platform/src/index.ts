import { serve } from '@hono/node-server'
import { buildApp } from './app.js'
import { getEnv } from './config/env.js'
import { connectRedis, disconnectRedis } from './lib/redis.js'
import { prisma } from './lib/prisma.js'

const env = getEnv()
const app = buildApp()

try {
  await prisma.$connect()
  await connectRedis()
} catch (err) {
  console.error('api_platform startup failed:', err)
  process.exit(1)
}

const server = serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`api_platform listening on http://localhost:${info.port}`)
})

async function shutdown() {
  console.log('api_platform shutting down')
  server.close(async () => {
    await disconnectRedis()
    await prisma.$disconnect()
  })
}

process.on('SIGTERM', () => void shutdown())
process.on('SIGINT', () => void shutdown())
