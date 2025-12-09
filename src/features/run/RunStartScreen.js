import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, StatNumber, Spacer } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import { useAuthStore } from '../auth';
import { getTodayStats } from '../stats';

export function RunStartScreen({ onStart }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [lastRunStats, setLastRunStats] = useState(null);

  useEffect(() => {
    loadLastRunStats();
  }, []);

  const loadLastRunStats = async () => {
    try {
      const stats = await getTodayStats(user?.id || null);
      if (stats.runs > 0) {
        setLastRunStats(stats);
      }
    } catch (error) {
      console.error('마지막 러닝 통계 로드 실패:', error);
    }
  };

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      // RunActiveScreen으로 전환
      router.push('/(tabs)/run');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>러닝 준비</Text>
        <Text style={styles.subtitle}>시작 버튼을 눌러 러닝을 시작하세요</Text>

        <Spacer height={spacing.xl} />

        {lastRunStats && (
          <Card style={styles.lastRunCard}>
            <Text style={styles.cardTitle}>마지막 러닝</Text>
            <View style={styles.statsRow}>
              <StatNumber
                value={lastRunStats.distance >= 1000 ? (lastRunStats.distance / 1000).toFixed(2) : lastRunStats.distance}
                label="거리"
                unit={lastRunStats.distance >= 1000 ? 'km' : 'm'}
              />
              <StatNumber
                value={Math.floor(lastRunStats.duration / 60)}
                label="시간"
                unit="분"
              />
            </View>
          </Card>
        )}

        <Spacer height={spacing.xl} />

        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleStart}
          style={styles.startButton}
        >
          시작
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lastRunCard: {
    marginVertical: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  startButton: {
    marginTop: spacing.xl,
  },
});

