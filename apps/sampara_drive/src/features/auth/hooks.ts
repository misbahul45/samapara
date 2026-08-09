import { useMutation } from '@tanstack/react-query';
import { login } from './api';
import { clearAuthSession, persistAuthSession } from './session/session-storage';
import { useAuthStore } from './store';

export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: async (session) => {
      await persistAuthSession(session);
      setUser(session.user);
    },
  });
}

export function useLogout() {
  const reset = useAuthStore((state) => state.reset);

  return async function logout() {
    await clearAuthSession();
    reset();
  };
}
