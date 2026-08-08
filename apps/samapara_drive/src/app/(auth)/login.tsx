import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Screen } from '@/components/common/screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { loginSchema, type LoginInput } from '@/features/auth/schema';
import { useAuthStore } from '@/stores/auth-store';

async function simulateLogin(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { id: 'local-user', name: 'Pengguna Demo', email };
}

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);

  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(input: LoginInput) {
    const user = await simulateLogin(input.email);
    setUser(user);
    router.replace('/');
  }

  return (
    <Screen className="justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Masuk ke Samapara</CardTitle>
          <CardDescription>Masukkan email dan kata sandi untuk melanjutkan.</CardDescription>
        </CardHeader>
        <CardContent className="gap-5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  placeholder="nama@email.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  aria-invalid={Boolean(error)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error ? <Text className="text-destructive text-sm">{error.message}</Text> : null}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="gap-2">
                <Label htmlFor="login-password">Kata Sandi</Label>
                <Input
                  id="login-password"
                  placeholder="Minimal 8 karakter"
                  autoCapitalize="none"
                  autoComplete="password"
                  secureTextEntry
                  aria-invalid={Boolean(error)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error ? <Text className="text-destructive text-sm">{error.message}</Text> : null}
              </View>
            )}
          />
          <Button
            className="mt-2"
            size="lg"
            disabled={formState.isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            <Text>{formState.isSubmitting ? 'Memproses...' : 'Masuk'}</Text>
          </Button>
          <Text className="text-muted-foreground text-center text-xs">
            Akses API belum terhubung. Login akan disimulasikan.
          </Text>
        </CardContent>
      </Card>
    </Screen>
  );
}
