import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from '../../src/components/AuthGuard';
import { RunSessionProvider } from '../../src/contexts/RunSessionContext';
import { colors, spacing } from '../../src/theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <AuthGuard requireAuth={false}>
      <RunSessionProvider>
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.light, // #0A84FF
        tabBarInactiveTintColor: colors.textLight, // #8E8E93
        tabBarStyle: {
          backgroundColor: colors.card, // #1C1C1E
          borderTopColor: colors.cardBorder, // #2C2C2E
          borderTopWidth: 1,
          height: 60 + insets.bottom, // SafeArea 하단 여백 추가
          paddingBottom: Math.max(insets.bottom, 8), // 안드로이드 하단 여백 처리
          paddingTop: 8,
          paddingHorizontal: spacing.lg, // px-6 = 24px (Figma와 동일)
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          // Elevation for Android
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarActiveLabelStyle: {
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="home-variant" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '러닝 기록',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="pulse" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '커뮤니티',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="account-group" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: '코스',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="map-marker-path" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '정보',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="account" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          href: null, // 탭 바에서 숨김
        }}
      />
    </Tabs>
    </RunSessionProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24, // w-6 = 24px (Figma 디자인과 동일)
    height: 24, // h-6 = 24px
    justifyContent: 'center',
    alignItems: 'center',
  },
});


