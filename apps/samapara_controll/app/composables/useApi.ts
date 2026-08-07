interface ApiErrorBody {
  error?: string
}

export function useApi() {
  const config = useRuntimeConfig()

  const get = async <T>(path: string): Promise<T> => {
    const res = await $fetch<T>(`${config.public.apiBase}${path}`, {
      headers: { accept: 'application/json' }
    })
    return res
  }

  const post = async <T>(path: string, body?: Record<string, unknown>): Promise<T> => {
    const res = await $fetch<T>(`${config.public.apiBase}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    })
    return res
  }

  const errorMessage = (err: unknown): string => {
    const apiError = err as { data?: ApiErrorBody, statusCode?: number }
    if (apiError.data?.error) {
      return apiError.data.error
    }
    if (apiError.statusCode === 502) {
      return 'AI service unavailable'
    }
    return 'request failed'
  }

  return { get, post, errorMessage }
}
