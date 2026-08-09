import { defineNuxtPlugin, useState } from '#app'
import {
  dehydrate,
  hydrate,
  QueryClient,
  VueQueryPlugin,
  type DehydratedState
} from '@tanstack/vue-query'

const QUERY_STATE_KEY = 'tanstack-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: import.meta.server ? 0 : 1,
        refetchOnWindowFocus: false
      }
    }
  })
  const dehydratedState = useState<DehydratedState | null>(QUERY_STATE_KEY, () => null)

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      dehydratedState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client && dehydratedState.value) {
    hydrate(queryClient, dehydratedState.value)
  }

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
