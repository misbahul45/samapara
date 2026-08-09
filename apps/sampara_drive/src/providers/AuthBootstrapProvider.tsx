import { readAuthSession, useAuthStore } from '@/features/auth';
import { BootstrapScreen } from '@/shared/components/BootstrapScreen';
import { useEffect, type PropsWithChildren } from 'react';

export function AuthBootstrapProvider({ children }: PropsWithChildren) {
  const initialized = useAuthStore((state) => state.initialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const session = await readAuthSession();
        if (active) {
          setUser(session?.user ?? null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setInitialized(true);
        }
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, [setInitialized, setUser]);

  if (!initialized) {
    return <BootstrapScreen />;
  }

  return children;
}
