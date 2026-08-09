import { Stack } from 'expo-router';

import { SAMPARA_COLORS } from '@/shared/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: SAMPARA_COLORS.background },
      }}
    />
  );
}
