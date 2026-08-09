import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Eye, EyeOff, LockKeyhole, Mail, Route as RouteIcon, ShieldCheck, Truck } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Screen } from '@/shared/components/Screen';
import { SAMPARA_COLORS } from '@/shared/theme/colors';
import { useLoginMutation } from '../hooks';
import { loginSchema, type LoginInput } from '../schema';

const LOGIN_ENTRANCE = FadeInDown.duration(500).reduceMotion(ReduceMotion.System);

export default function LoginScreen() {
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(input: LoginInput) {
    await loginMutation.mutateAsync(input);
    router.replace('/');
  }

  return (
    <Screen className="items-center justify-center py-8">
      <Animated.View entering={LOGIN_ENTRANCE} className="w-full max-w-md gap-6">
        <View className="items-center gap-3">
          <View className="bg-primary size-14 items-center justify-center rounded-2xl shadow-sm shadow-black/10">
            <Truck color={SAMPARA_COLORS.data} size={28} strokeWidth={2.2} />
          </View>
          <View className="items-center gap-1">
            <Text className="text-navy text-2xl font-bold tracking-tight">SAMPARA Drive</Text>
            <Text className="text-muted-foreground text-center text-sm">Akses tugas dan rute untuk tim lapangan</Text>
          </View>
        </View>

        <View className="border-border bg-surface-info flex-row items-center gap-3 rounded-xl border p-4">
          <View className="bg-card border-border size-10 items-center justify-center rounded-lg border">
            <RouteIcon color={SAMPARA_COLORS.primary} size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-navy font-semibold">Tugas dari operator</Text>
            <Text className="text-muted-foreground mt-0.5 text-xs leading-4">Prioritas, urutan kunjungan, dan progres lapangan dalam satu alur.</Text>
          </View>
        </View>

        <Card className="gap-0 rounded-2xl py-0 shadow-md shadow-black/5">
          <CardHeader className="gap-2 px-5 pb-5 pt-6">
            <Text variant="h1" className="text-navy text-left text-2xl">Masuk ke Drive</Text>
            <Text className="text-muted-foreground text-sm leading-5">Gunakan akun pengemudi yang disiapkan oleh operator kawasan.</Text>
          </CardHeader>
          <CardContent className="gap-5 px-5 pb-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <View className="relative justify-center">
                    <Mail color={SAMPARA_COLORS.muted} size={18} style={{ left: 14, position: 'absolute', zIndex: 1 }} />
                    <Input
                      id="login-email"
                      className="h-12 pl-11"
                      placeholder="pengemudi@kawasan.id"
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      aria-invalid={Boolean(error)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                  {error ? <Text className="text-destructive text-sm" accessibilityLiveRegion="polite">{error.message}</Text> : null}
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="gap-2">
                  <Label htmlFor="login-password">Kata sandi</Label>
                  <View className="relative justify-center">
                    <LockKeyhole color={SAMPARA_COLORS.muted} size={18} style={{ left: 14, position: 'absolute', zIndex: 1 }} />
                    <Input
                      id="login-password"
                      className="h-12 px-11"
                      placeholder="Minimal 8 karakter"
                      autoCapitalize="none"
                      autoComplete="password"
                      secureTextEntry={!showPassword}
                      aria-invalid={Boolean(error)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-1 min-h-11 min-w-11 items-center justify-center rounded-lg"
                      onPress={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOff color={SAMPARA_COLORS.muted} size={19} /> : <Eye color={SAMPARA_COLORS.muted} size={19} />}
                    </Pressable>
                  </View>
                  {error ? <Text className="text-destructive text-sm" accessibilityLiveRegion="polite">{error.message}</Text> : null}
                </View>
              )}
            />

            <Button
              className="mt-1 h-12 rounded-xl"
              size="lg"
              disabled={formState.isSubmitting || loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            >
              {loginMutation.isPending ? <ActivityIndicator color={SAMPARA_COLORS.surface} /> : <ShieldCheck color={SAMPARA_COLORS.surface} size={18} />}
              <Text>{loginMutation.isPending ? 'Menyiapkan rute...' : 'Masuk ke SAMPARA Drive'}</Text>
            </Button>

            {loginMutation.isError ? <Text className="text-destructive text-center text-sm" accessibilityLiveRegion="polite">Session lokal belum dapat disimpan. Coba kembali.</Text> : null}

            <Text className="text-muted-foreground text-center text-xs leading-5">Mode demo memproses login dan menyimpan session hanya di perangkat ini.</Text>
          </CardContent>
        </Card>

        <Pressable
          accessibilityRole="button"
          className="min-h-11 items-center justify-center rounded-lg"
          onPress={() => router.push('/(onboarding)/onboarding')}
        >
          <Text className="text-primary text-sm font-semibold">Lihat kembali cara kerja Drive</Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
