import type { Ref } from 'vue'

export function usePersistentState<T>(key: string, defaultValue: () => T): Ref<T> {
  const cookie = useCookie<T>(key, {
    default: defaultValue,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })
  const state = useState<T>(`persistent:${key}`, () => cookie.value)

  watch(state, (value) => {
    cookie.value = value
  }, { deep: true })

  return state
}
