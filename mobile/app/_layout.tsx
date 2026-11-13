import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';

export { ErrorBoundary } from 'expo-router';

const brandSplash = require('../assets/images/brand-splash-crop.png');

void SplashScreen.preventAutoHideAsync();

function FullWidthSplash({ onReady }: { onReady: () => void }) {
  return (
    <View style={styles.splash} onLayout={onReady}>
      <Image source={brandSplash} style={styles.brand} resizeMode="contain" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const [brandSplashVisible, setBrandSplashVisible] = useState(true);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const ready = (fontsLoaded || !!fontError) && hydrated;

  const hideNativeSplash = () => {
    if (nativeSplashHidden) return;
    setNativeSplashHidden(true);
    void SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (!ready || !nativeSplashHidden) return;
    const timer = setTimeout(() => setBrandSplashVisible(false), 500);
    return () => clearTimeout(timer);
  }, [ready, nativeSplashHidden]);

  if (brandSplashVisible) {
    return <FullWidthSplash onReady={hideNativeSplash} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.softWhite }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.softWhite },
              animation: 'fade_from_bottom',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#F9F5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    width: '100%',
    height: undefined,
    aspectRatio: 1106 / 751,
  },
});
