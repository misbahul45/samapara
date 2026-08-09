import { Redirect } from 'expo-router';
import { Clock3, LogOut, MapPin, Navigation2, Route as RouteIcon, Truck } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { useAuthStore, useLogout } from '@/features/auth';
import { Screen } from '@/shared/components/Screen';
import { SAMPARA_COLORS } from '@/shared/theme/colors';
import { DRIVE_ROUTE } from '../constants';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [routeStarted, setRouteStarted] = useState(false);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Screen className="gap-6 pb-10">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-muted-foreground text-sm">Selamat bertugas,</Text>
          <Text className="text-navy text-2xl font-bold tracking-tight">{user.name}</Text>
          <Text className="text-muted-foreground text-xs">SAMPARA Drive · Tim Lapangan</Text>
        </View>
        <View className="bg-primary size-12 items-center justify-center rounded-xl">
          <Truck color={SAMPARA_COLORS.data} size={24} />
        </View>
      </View>

      <Card className="gap-0 overflow-hidden rounded-2xl py-0">
        <View className="bg-navy gap-5 p-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <Text className="text-data text-xs font-semibold uppercase tracking-widest">Rute hari ini</Text>
              <Text className="text-xl font-bold text-white">{DRIVE_ROUTE.label}</Text>
            </View>
            <View className="bg-data/15 size-11 items-center justify-center rounded-xl">
              <RouteIcon color={SAMPARA_COLORS.data} size={22} />
            </View>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-white">{DRIVE_ROUTE.completedStops} dari {DRIVE_ROUTE.totalStops} titik selesai</Text>
              <Text className="text-data text-sm font-bold">{DRIVE_ROUTE.progress}%</Text>
            </View>
            <Progress value={DRIVE_ROUTE.progress} indicatorClassName="bg-data" className="bg-white/15 h-2.5" />
          </View>
          <View className="flex-row gap-3">
            <View className="bg-primary-active flex-1 rounded-xl p-3">
              <Text className="text-data text-xs">Jarak rute</Text>
              <Text className="mt-1 font-bold text-white">{DRIVE_ROUTE.distance}</Text>
            </View>
            <View className="bg-primary-active flex-1 rounded-xl p-3">
              <Text className="text-data text-xs">Status</Text>
              <Text className="mt-1 font-bold text-white">{routeStarted ? 'Berjalan' : 'Siap mulai'}</Text>
            </View>
          </View>
        </View>
      </Card>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-navy text-lg font-bold">Tugas berikutnya</Text>
          <View className="bg-destructive-soft rounded-full px-3 py-1.5">
            <Text className="text-destructive text-xs font-bold">PRIORITAS 01</Text>
          </View>
        </View>

        <Card className="border-primary/25 gap-0 rounded-2xl py-0">
          <CardHeader className="gap-4 px-5 pb-4 pt-5">
            <View className="flex-row items-center gap-4">
              <View className="bg-surface-info size-12 items-center justify-center rounded-xl">
                <MapPin color={SAMPARA_COLORS.primary} size={24} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-navy text-lg font-bold">{DRIVE_ROUTE.nextTask.location}</Text>
                <Text className="text-destructive text-sm font-semibold">{DRIVE_ROUTE.nextTask.status}</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent className="gap-4 px-5 pb-5">
            <View className="border-border flex-row divide-x divide-border rounded-xl border">
              <View className="flex-1 items-center gap-1 p-3">
                <Text className="text-muted-foreground text-xs">Kondisi</Text>
                <Text className="text-destructive font-bold">{DRIVE_ROUTE.nextTask.fillLevel}</Text>
              </View>
              <View className="flex-1 items-center gap-1 p-3">
                <Text className="text-muted-foreground text-xs">ETA</Text>
                <Text className="text-navy font-bold">{DRIVE_ROUTE.nextTask.eta}</Text>
              </View>
              <View className="flex-1 items-center gap-1 p-3">
                <Text className="text-muted-foreground text-xs">Jarak</Text>
                <Text className="text-navy font-bold">{DRIVE_ROUTE.nextTask.distance}</Text>
              </View>
            </View>

            <Button className="h-12 rounded-xl" size="lg" variant={routeStarted ? 'secondary' : 'default'} onPress={() => setRouteStarted((started) => !started)}>
              <Navigation2 color={SAMPARA_COLORS.surface} size={18} fill={routeStarted ? SAMPARA_COLORS.surface : 'transparent'} />
              <Text>{routeStarted ? 'Navigasi sedang aktif' : 'Mulai navigasi'}</Text>
            </Button>
          </CardContent>
        </Card>
      </View>

      <View className="gap-3">
        <Text className="text-navy text-lg font-bold">Antrean berikutnya</Text>
        <View className="border-border bg-card overflow-hidden rounded-2xl border">
          {DRIVE_ROUTE.queue.map((stop, index) => (
            <View key={stop.number} className={index > 0 ? 'border-border flex-row items-center gap-4 border-t p-4' : 'flex-row items-center gap-4 p-4'}>
              <View className="bg-surface-info size-10 items-center justify-center rounded-full">
                <Text className="text-primary text-sm font-bold">{stop.number}</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-navy font-semibold">{stop.location}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Clock3 color={SAMPARA_COLORS.muted} size={13} />
                  <Text className="text-muted-foreground text-xs">Estimasi {stop.eta}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Button variant="ghost" className="mt-2 h-11" onPress={() => void logout()}>
        <LogOut color={SAMPARA_COLORS.muted} size={17} />
        <Text className="text-muted-foreground">Keluar dari session demo</Text>
      </Button>
    </Screen>
  );
}
