import { Platform, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { apiErrorMessage } from '@/api/client';
import { useDevicesQuery } from '@/queries/devices';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { data, isPending, isError, error, refetch } = useDevicesQuery();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Devices
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            daftar container dari telemetry SAMAPARA
          </ThemedText>
        </ThemedView>

        {isPending && <ThemedText type="small">memuat…</ThemedText>}

        {isError && (
          <Pressable onPress={() => void refetch()}>
            <ThemedText type="small" themeColor="textError">
              {apiErrorMessage(error)} — ketuk untuk muat ulang
            </ThemedText>
          </Pressable>
        )}

        {!isPending && !isError && (data?.devices.length ?? 0) === 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            Belum ada device
          </ThemedText>
        )}

        {(data?.devices ?? []).map((device) => (
          <Pressable
            key={device.id}
            onPress={() => router.push(`/devices/${device.id}`)}
            style={({ pressed }) => [styles.deviceCard, pressed && styles.pressed]}>
            <ThemedView type="backgroundElement" style={styles.deviceCardInner}>
              <ThemedText type="subtitle">{device.name}</ThemedText>
              <ThemedText type="code">{device.serial_number}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {device.location_name ?? '-'} · {device.active ? 'Aktif' : 'Nonaktif'}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  heroSection: {
    paddingTop: Spacing.six,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
  },
  deviceCard: {
    marginBottom: Spacing.three,
  },
  deviceCardInner: {
    borderRadius: 12,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
