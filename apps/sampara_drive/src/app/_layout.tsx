import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthBootstrapProvider } from '@/providers/AuthBootstrapProvider';
import { OnboardingBootstrapProvider } from '@/providers/OnboardingBootstrapProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SAMPARA_COLORS } from '@/shared/theme/colors';
import { NAV_THEME } from '@/shared/theme/navigation';

export default function RootLayout() {
  return (
    <QueryProvider>
      <OnboardingBootstrapProvider>
      <AuthBootstrapProvider>
        <ThemeProvider value={NAV_THEME.light}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: SAMPARA_COLORS.background },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </AuthBootstrapProvider>
      </OnboardingBootstrapProvider>
    </QueryProvider>
  );
}
