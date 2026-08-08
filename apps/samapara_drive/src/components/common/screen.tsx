import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

type ScreenProps = PropsWithChildren<{
  className?: string;
}>;

export function Screen({ children, className }: ScreenProps) {
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        contentContainerClassName="grow"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View className={cn('px-5 py-6', className)}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
