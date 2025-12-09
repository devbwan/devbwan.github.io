import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { useAuthStore } from '../src/features/auth';
import AuthGuard from '../src/components/AuthGuard';
import { useAppFonts } from '../src/utils/fontLoader';
import { spacing, colors } from '../src/theme';

// ⭐ RunSessionProvider 추가
import { RunSessionProvider } from '../src/contexts/RunSessionContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00D9FF',
    secondary: '#FF7A00',
  },
  roundness: 16,
  fonts: {
    ...DefaultTheme.fonts,
    default: Platform.select({
      android: { fontFamily: 'sans-serif-medium' },
      ios: { fontFamily: 'Apple SD Gothic Neo' },
      web: { fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif' },
    }) || DefaultTheme.fonts.default,
    labelLarge: {
      ...DefaultTheme.fonts.labelLarge,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.labelLarge.fontFamily,
    },
    labelMedium: {
      ...DefaultTheme.fonts.labelMedium,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.labelMedium.fontFamily,
    },
    labelSmall: {
      ...DefaultTheme.fonts.labelSmall,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.labelSmall.fontFamily,
    },
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.bodyLarge.fontFamily,
    },
    bodyMedium: {
      ...DefaultTheme.fonts.bodyMedium,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.bodyMedium.fontFamily,
    },
    bodySmall: {
      ...DefaultTheme.fonts.bodySmall,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.bodySmall.fontFamily,
    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.titleLarge.fontFamily,
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.titleMedium.fontFamily,
    },
    titleSmall: {
      ...DefaultTheme.fonts.titleSmall,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'Apple SD Gothic Neo',
        web: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }) || DefaultTheme.fonts.titleSmall.fontFamily,
    },
  },
};

// 웹 경고 억제
if (Platform.OS === 'web' && typeof __DEV__ !== 'undefined' && __DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('props.pointerEvents is deprecated') ||
       (message.includes('shadow') && message.includes('boxShadow')) ||
       message.includes('Cross-Origin-Opener-Policy') ||
       message.includes('window.closed'))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [initError, setInitError] = useState(null);
  const { fontsLoaded } = useAppFonts();

  useEffect(() => {
    console.log('[RootLayout] 초기화 시작');
    const init = async () => {
      try {
        await initialize();
        console.log('[RootLayout] 초기화 완료');
      } catch (error) {
        console.error('[RootLayout] 초기화 오류:', error);
        setInitError(error.message || '앱 초기화 중 오류가 발생했습니다.');
      }
    };
    init();
  }, [initialize]);

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: spacing.md, color: colors.text }}>폰트를 로딩하는 중...</Text>
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: spacing.md, color: colors.text }}>앱을 시작하는 중...</Text>
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (initError) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, color: colors.error }}>오류 발생</Text>
              <Text style={{ color: colors.text, textAlign: 'center' }}>{initError}</Text>
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  console.log('[RootLayout] 정상 렌더링');

  // ⭐ 여기에서만 Provider를 추가해주면 됨
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>

          {/* ⭐ 전체 앱을 RunSessionProvider로 감싸기 */}
          <RunSessionProvider>
            <AuthGuard requireAuth={false}>
              <Slot />
            </AuthGuard>
          </RunSessionProvider>

        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
