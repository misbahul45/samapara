import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthBootstrapProvider } from '@/providers/AuthBootstrapProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { NAV_THEME } from '@/shared/theme/navigation';

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthBootstrapProvider>
        <ThemeProvider value={NAV_THEME.light}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F9F9FF' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </AuthBootstrapProvider>
    </QueryProvider>
  );
}
