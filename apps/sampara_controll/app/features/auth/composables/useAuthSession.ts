import { computed } from 'vue'
import { usePersistentState } from '~/shared/storage/usePersistentState'
import { authenticateDemo } from '../services/demoAuth'
import type { AuthUser, LoginInput } from '../types'

const SESSION_KEY = 'samapara-demo-session'

export function useAuthSession() {
  const user = usePersistentState<AuthUser | null>(SESSION_KEY, () => null)
  const isAuthenticated = computed(() => user.value !== null)

  async function login(input: LoginInput) {
    const authenticatedUser = await authenticateDemo(input)
    user.value = authenticatedUser
    return authenticatedUser
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}
