import { onServerPrefetch } from 'vue'

interface SuspenseQuery {
  suspense: () => Promise<unknown>
}

export function useServerPrefetchQuery<T extends SuspenseQuery>(query: T, enabled = true): T {
  if (import.meta.server && enabled) {
    onServerPrefetch(() => query.suspense().then(() => undefined, () => undefined))
  }

  return query
}
