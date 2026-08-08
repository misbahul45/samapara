import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { apiErrorMessage } from '@/api/client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useDeviceDetailQuery, useRunForecastMutation } from '@/queries/devices';

function formatWeight(value: number) {
  return `${value.toFixed(2)} kg`;
}

export default function DeviceDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const deviceId = params.id ?? '';
  const insets = useSafeAreaInsets();

  const { data, isPending, isError, error } = useDeviceDetailQuery(deviceId);
  const runForecast = useRunForecastMutation();

  const device = data?.device;
  const latest = data?.latest_forecast;

  return (
    <ScrollView
      style={styles.scrollView}
      contentInset={{ ...insets, bottom: insets.bottom + BottomTabInset + Spacing.three }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="smallBold">‹ Kembali</ThemedText>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            {device?.name ?? 'Detail Device'}
          </ThemedText>
          {device && (
            <ThemedText type="code">
              {device.serial_number} · {device.active ? 'Aktif' : 'Nonaktif'}
            </ThemedText>
          )}
          <ThemedText type="small" themeColor="textSecondary">
            {device?.location_name ?? '-'}
          </ThemedText>
        </ThemedView>

        {isPending && (
          <ThemedView style={styles.centered}>
            <ActivityIndicator />
          </ThemedView>
        )}

        {isError && (
          <ThemedText type="small" themeColor="textError">
            {apiErrorMessage(error)}
          </ThemedText>
        )}

        {!isPending && !isError && !device && (
          <ThemedText type="small" themeColor="textSecondary">
            Device tidak ditemukan
          </ThemedText>
        )}

        {device && (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Forecast</ThemedText>
            {latest ? (
              <ThemedView style={styles.forecastRow}>
                <ThemedView style={styles.forecastCell}>
                  <ThemedText type="small" themeColor="textSecondary">
                    P50
                  </ThemedText>
                  <ThemedText type="default">{formatWeight(latest.p50)}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.forecastCell}>
                  <ThemedText type="small" themeColor="textSecondary">
                    P80
                  </ThemedText>
                  <ThemedText type="default">{formatWeight(latest.p80)}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.forecastCell}>
                  <ThemedText type="small" themeColor="textSecondary">
                    P90
                  </ThemedText>
                  <ThemedText type="default">{formatWeight(latest.p90)}</ThemedText>
                </ThemedView>
              </ThemedView>
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                Belum ada forecast
              </ThemedText>
            )}

            {runForecast.isPending && (
              <ThemedView style={styles.runRow}>
                <ActivityIndicator />
                <ThemedText type="small">Menjalankan forecast…</ThemedText>
              </ThemedView>
            )}

            {!runForecast.isPending && (
              <Pressable
                onPress={() => runForecast.mutate(deviceId)}
                style={({ pressed }) => [
                  styles.runButton,
                  pressed && styles.pressed,
                  runForecast.isPending && styles.runButtonDisabled,
                ]}>
                <ThemedText type="smallBold">Jalankan Forecast</ThemedText>
              </Pressable>
            )}

            {runForecast.isSuccess && (
              <ThemedText type="small">Forecast selesai — nilai diperbarui di atas</ThemedText>
            )}

            {runForecast.isError && (
              <ThemedText type="small" themeColor="textError">
                {apiErrorMessage(runForecast.error)}
              </ThemedText>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    fontSize: 32,
  },
  centered: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  forecastRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  forecastCell: {
    flex: 1,
    gap: Spacing.half,
  },
  runRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  runButton: {
    backgroundColor: '#3c87f7',
    borderRadius: 10,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  runButtonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
