import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { SAMPARA_COLORS } from '@/shared/theme/colors';

export function BootstrapScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center gap-5 px-6">
        <View className="bg-primary size-16 items-center justify-center rounded-2xl">
          <View className="flex-row items-end gap-1">
            <View className="bg-data h-4 w-2 rounded-full" />
            <View className="h-7 w-2 rounded-full bg-white" />
            <View className="bg-data h-10 w-2 rounded-full" />
          </View>
        </View>
        <View className="items-center gap-1">
          <Text className="text-navy text-xl font-bold tracking-tight">SAMPARA Drive</Text>
          <Text className="text-muted-foreground text-sm">Menyiapkan ruang kerja lapangan</Text>
        </View>
        <ActivityIndicator color={SAMPARA_COLORS.primary} />
      </View>
    </SafeAreaView>
  );
}
