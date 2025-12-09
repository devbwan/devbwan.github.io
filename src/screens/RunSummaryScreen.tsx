import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';

export default function RunSummaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="러닝 완료" />
      
      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryDistance}>5.41 km</Text>
          <Text style={styles.summaryText}>완료했습니다!</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)/')}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  summaryDistance: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textStrong,
    marginBottom: spacing.md,
  },
  summaryText: {
    fontSize: 16,
    color: colors.textLight,
  },
  homeButton: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.goal,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

