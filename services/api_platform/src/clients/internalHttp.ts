import { getEnv } from '../config/env.js'

export class UpstreamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function upstreamJson<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const env = getEnv()
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.internalServiceToken}`,
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new UpstreamError(res.status, `upstream ${path} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
