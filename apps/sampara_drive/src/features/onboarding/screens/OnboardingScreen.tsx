import { router } from 'expo-router';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MapPin,
  Navigation2,
  RadioTower,
  Route as RouteIcon,
  Truck,
} from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPARA_COLORS } from '@/shared/theme/colors';
import { ONBOARDING_SLIDES } from '../constants';
import { persistOnboardingCompletion } from '../storage/onboarding-storage';
import { useOnboardingStore } from '../store';
import type { OnboardingSlide, OnboardingVisual } from '../types';

type OnboardingPageProps = {
  active: boolean;
  reduceMotion: boolean;
  slide: OnboardingSlide;
  width: number;
};

function AssignmentVisual() {
  return (
    <View className="border-border bg-card w-full gap-5 rounded-2xl border p-5 shadow-sm shadow-black/5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-1">
          <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">Tugas berikutnya</Text>
          <Text className="text-navy text-xl font-bold">BIN C · Blok Selatan</Text>
        </View>
        <View className="bg-destructive-soft rounded-full px-3 py-1.5">
          <Text className="text-destructive text-xs font-bold">PRIORITAS 01</Text>
        </View>
      </View>

      <View className="bg-surface-info flex-row items-center gap-4 rounded-xl p-4">
        <View className="bg-primary size-11 items-center justify-center rounded-xl">
          <MapPin color={SAMPARA_COLORS.data} size={22} strokeWidth={2.2} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-navy font-semibold">Perlu dilayani berikutnya</Text>
          <Text className="text-muted-foreground text-sm">Kondisi terpantau 92%</Text>
        </View>
        <Truck color={SAMPARA_COLORS.primary} size={24} />
      </View>

      <View className="flex-row items-center gap-2">
        <View className="border-border flex-1 rounded-lg border p-3">
          <Text className="text-muted-foreground text-xs">Kondisi</Text>
          <Text className="text-destructive mt-1 font-bold">92%</Text>
        </View>
        <ArrowRight color={SAMPARA_COLORS.muted} size={17} />
        <View className="border-border flex-1 rounded-lg border p-3">
          <Text className="text-muted-foreground text-xs">Keputusan</Text>
          <Text className="text-primary mt-1 font-bold">Layani</Text>
        </View>
      </View>
    </View>
  );
}

function RouteVisual() {
  const stops = [
    { label: 'BIN C · Blok Selatan', meta: 'Berikutnya · 1,8 km', active: true },
    { label: 'BIN B · Gerbang Utama', meta: 'Estimasi 09.45', active: false },
    { label: 'Depo Kawasan', meta: 'Estimasi 10.20', active: false },
  ];

  return (
    <View className="border-border bg-card w-full rounded-2xl border p-5 shadow-sm shadow-black/5">
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">Rute hari ini</Text>
          <Text className="text-navy mt-1 text-xl font-bold">8 titik · 24,6 km</Text>
        </View>
        <View className="bg-surface-info size-11 items-center justify-center rounded-xl">
          <RouteIcon color={SAMPARA_COLORS.primary} size={23} />
        </View>
      </View>

      <View className="gap-0">
        {stops.map((stop, index) => (
          <View key={stop.label} className="flex-row gap-4">
            <View className="items-center">
              <View className={stop.active ? 'bg-primary size-5 items-center justify-center rounded-full' : 'border-primary size-5 items-center justify-center rounded-full border-2 bg-white'}>
                {stop.active ? <Navigation2 color={SAMPARA_COLORS.surface} size={11} fill={SAMPARA_COLORS.surface} /> : null}
              </View>
              {index < stops.length - 1 ? <View className="bg-border h-14 w-0.5" /> : null}
            </View>
            <View className="flex-1 pb-6">
              <Text className={stop.active ? 'text-navy font-bold' : 'text-foreground font-semibold'}>{stop.label}</Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <Clock3 color={SAMPARA_COLORS.muted} size={13} />
                <Text className="text-muted-foreground text-xs">{stop.meta}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ExecutionVisual() {
  return (
    <View className="w-full gap-4">
      <View className="border-border bg-card flex-row items-center gap-4 rounded-2xl border p-4 shadow-sm shadow-black/5">
        <View className="bg-navy size-12 items-center justify-center rounded-xl">
          <RadioTower color={SAMPARA_COLORS.data} size={23} />
        </View>
        <View className="flex-1">
          <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">SAMPARA Control</Text>
          <Text className="text-navy mt-1 font-bold">Tugas dan prioritas</Text>
        </View>
        <CheckCircle2 color={SAMPARA_COLORS.success} size={23} />
      </View>

      <View className="items-center">
        <View className="bg-data h-7 w-0.5" />
        <View className="bg-surface-info border-data rounded-full border px-4 py-1.5">
          <Text className="text-primary text-xs font-semibold">Status lapangan</Text>
        </View>
        <View className="bg-data h-7 w-0.5" />
      </View>

      <View className="border-primary bg-primary w-full gap-4 rounded-2xl border p-5 shadow-sm shadow-black/10">
        <View className="flex-row items-center gap-4">
          <View className="bg-data/20 size-12 items-center justify-center rounded-xl">
            <ClipboardCheck color={SAMPARA_COLORS.surface} size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-data text-xs font-semibold uppercase tracking-widest">SAMPARA Drive</Text>
            <Text className="mt-1 text-lg font-bold text-white">BIN C selesai dilayani</Text>
          </View>
        </View>
        <View className="bg-primary-active rounded-xl p-3">
          <Text className="text-sm leading-5 text-white">Progres tugas kembali menjadi konteks bagi operator.</Text>
        </View>
      </View>
    </View>
  );
}

function SlideVisual({ visual }: { visual: OnboardingVisual }) {
  if (visual === 'assignment') {
    return <AssignmentVisual />;
  }

  if (visual === 'route') {
    return <RouteVisual />;
  }

  return <ExecutionVisual />;
}

function OnboardingPage({ active, reduceMotion, slide, width }: OnboardingPageProps) {
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!active || reduceMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    opacity.setValue(0.35);
    translateY.setValue(14);
    Animated.parallel([
      Animated.timing(opacity, { duration: 420, toValue: 1, useNativeDriver: true }),
      Animated.timing(translateY, { duration: 500, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [active, opacity, reduceMotion, translateY]);

  return (
    <View style={{ width }} className="flex-1 px-5">
      <Animated.View style={{ opacity, transform: [{ translateY }] }} className="flex-1 justify-center gap-8 py-5">
        <View className="items-center">
          <SlideVisual visual={slide.visual} />
        </View>
        <View className="gap-3">
          <Text className="text-primary text-xs font-bold uppercase tracking-widest">{slide.eyebrow}</Text>
          <Text variant="h1" className="text-navy text-left text-3xl leading-9">{slide.title}</Text>
          <Text className="text-text-secondary text-base leading-7">{slide.description}</Text>
          <View className="border-data bg-surface-info mt-1 rounded-xl border-l-4 px-4 py-3">
            <Text className="text-primary text-sm leading-5">{slide.detail}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);
  const setCompleted = useOnboardingStore((state) => state.setCompleted);
  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) {
        setReduceMotion(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (isCompleting) {
      return;
    }

    setErrorMessage('');
    setIsCompleting(true);

    try {
      await persistOnboardingCompletion();
      setCompleted(true);
      router.replace('/(auth)/login');
    } catch {
      setErrorMessage('Pengantar belum dapat disimpan. Coba kembali.');
    } finally {
      setIsCompleting(false);
    }
  }, [isCompleting, setCompleted]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToIndex({ animated: !reduceMotion, index });
  }, [reduceMotion]);

  const handlePrimaryAction = useCallback(() => {
    if (isLastSlide) {
      void completeOnboarding();
      return;
    }

    goToSlide(activeIndex + 1);
  }, [activeIndex, completeOnboarding, goToSlide, isLastSlide]);

  const handleMomentumEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }, [width]);

  const renderSlide = useCallback(({ item, index }: ListRenderItemInfo<OnboardingSlide>) => (
    <OnboardingPage active={activeIndex === index} reduceMotion={reduceMotion} slide={item} width={width} />
  ), [activeIndex, reduceMotion, width]);

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <View>
          <Text className="text-navy text-xl font-bold tracking-tight">SAMPARA Drive</Text>
          <Text className="text-muted-foreground text-xs">Ruang kerja tim lapangan</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lewati pengantar"
          className="min-h-11 min-w-16 items-center justify-center rounded-lg px-3 active:bg-surface-info"
          disabled={isCompleting}
          onPress={() => void completeOnboarding()}
        >
          <Text className="text-primary text-sm font-semibold">Lewati</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ index, length: width, offset: width * index })}
        onMomentumScrollEnd={handleMomentumEnd}
      />

      <View className="gap-4 px-5 pb-5 pt-2">
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={`Langkah ${activeIndex + 1} dari ${ONBOARDING_SLIDES.length}`}
          accessibilityValue={{ min: 1, max: ONBOARDING_SLIDES.length, now: activeIndex + 1 }}
          className="flex-row items-center justify-center gap-2"
        >
          {ONBOARDING_SLIDES.map((slide, index) => (
            <Pressable
              key={slide.id}
              accessibilityRole="button"
              accessibilityLabel={`Buka langkah ${index + 1}`}
              className="min-h-11 min-w-11 items-center justify-center"
              onPress={() => goToSlide(index)}
            >
              <View className={activeIndex === index ? 'bg-primary h-2.5 w-8 rounded-full' : 'bg-disabled size-2.5 rounded-full'} />
            </Pressable>
          ))}
        </View>

        {errorMessage ? <Text className="text-destructive text-center text-sm" accessibilityLiveRegion="polite">{errorMessage}</Text> : null}

        <Button size="lg" className="h-12 rounded-xl" disabled={isCompleting} onPress={handlePrimaryAction}>
          {isCompleting ? <ActivityIndicator color={SAMPARA_COLORS.surface} /> : null}
          <Text>{isLastSlide ? 'Masuk ke SAMPARA Drive' : 'Lanjutkan'}</Text>
          {!isCompleting ? <ArrowRight color={SAMPARA_COLORS.surface} size={18} /> : null}
        </Button>
      </View>
    </SafeAreaView>
  );
}
