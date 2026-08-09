import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore, useLogout } from '@/features/auth';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View className="bg-background flex-1 items-center justify-center px-5">
      <Text className="text-foreground text-2xl font-semibold">Selamat Datang</Text>
      <Text className="text-muted-foreground mt-1">{user.name}</Text>
      <Text className="text-muted-foreground">{user.email}</Text>
      <Button variant="outline" className="mt-8" onPress={() => void logout()}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
