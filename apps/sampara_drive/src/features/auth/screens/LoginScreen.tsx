import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Screen } from '@/shared/components/Screen';
import { useLoginMutation } from '../hooks';
import { loginSchema, type LoginInput } from '../schema';

export default function LoginScreen() {
  const loginMutation = useLoginMutation();

  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'driver@sampara.local', password: 'sampara-demo' },
  });

  async function onSubmit(input: LoginInput) {
    await loginMutation.mutateAsync(input);
    router.replace('/');
  }

  return (
    <Screen className="justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Masuk ke Sampara</CardTitle>
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
            disabled={formState.isSubmitting || loginMutation.isPending}
            onPress={handleSubmit(onSubmit)}
          >
            <Text>{loginMutation.isPending ? 'Memproses...' : 'Masuk'}</Text>
          </Button>
          {loginMutation.isError ? <Text className="text-destructive text-center text-sm">Session gagal disimpan.</Text> : null}
          <Text className="text-muted-foreground text-center text-xs">
            Mode demo lokal menyimpan session melalui shared SecureStore.
          </Text>
        </CardContent>
      </Card>
    </Screen>
  );
}
