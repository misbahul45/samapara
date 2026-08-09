import { useEffect, type PropsWithChildren } from 'react';

import { readOnboardingCompletion, useOnboardingStore } from '@/features/onboarding';
import { BootstrapScreen } from '@/shared/components/BootstrapScreen';

export function OnboardingBootstrapProvider({ children }: PropsWithChildren) {
  const initialized = useOnboardingStore((state) => state.initialized);
  const setCompleted = useOnboardingStore((state) => state.setCompleted);
  const setInitialized = useOnboardingStore((state) => state.setInitialized);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const completed = await readOnboardingCompletion();
        if (active) {
          setCompleted(completed);
        }
      } catch {
        if (active) {
          setCompleted(false);
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
  }, [setCompleted, setInitialized]);

  if (!initialized) {
    return <BootstrapScreen />;
  }

  return children;
}
