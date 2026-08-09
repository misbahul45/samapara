import { Redirect } from 'expo-router';

import { HomeScreen } from '@/features/dashboard';
import { useOnboardingStore } from '@/features/onboarding';

export default function IndexRoute() {
  const completed = useOnboardingStore((state) => state.completed);

  if (!completed) {
    return <Redirect href="/(onboarding)/onboarding" />;
  }

  return <HomeScreen />;
}
