import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/features/auth';
import { useOnboardingStore } from '@/features/onboarding';
import { SAMPARA_COLORS } from '@/shared/theme/colors';

export default function AuthLayout() {
  const completed = useOnboardingStore((state) => state.completed);
  const user = useAuthStore((state) => state.user);

  if (!completed) {
    return <Redirect href="/(onboarding)/onboarding" />;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: SAMPARA_COLORS.background },
      }}
    />
  );
}
