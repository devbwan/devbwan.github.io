import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, StatNumber } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function TodaySummaryCard({ stats }) {
  const formatDistance = (meters) => {
    if (!meters || meters < 1000) return `${Math.round(meters || 0)}`;
    return `${((meters || 0) / 1000).toFixed(2)}`;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0';
    return `${Math.floor(seconds / 60)}`;
  };

  const formatPace = (secPerKm) => {
    if (!secPerKm || secPerKm === 0) return '--:--';
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.round(secPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (stats.runs === 0) {
    return (
      <Card>
        <Text style={styles.emptyText}>오늘 아직 러닝 기록이 없습니다.</Text>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <Text style={styles.title}>오늘의 기록</Text>
      <View style={styles.statsGrid}>
        <StatNumber
          value={stats.runs}
          label="러닝"
          unit="회"
          style={styles.statItem}
        />
        <StatNumber
          value={formatDistance(stats.distance)}
          label="거리"
          unit="km"
          style={styles.statItem}
        />
        <StatNumber
          value={formatTime(stats.duration)}
          label="시간"
          unit="분"
          style={styles.statItem}
        />
        {stats.avgPace && (
          <StatNumber
            value={formatPace(stats.avgPace)}
            label="평균 페이스"
            style={styles.statItem}
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.textStrong,
    marginBottom: spacing.md,
    fontFamily: typography.h2.fontFamily,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statItem: {
    width: '48%',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.lg,
    fontFamily: typography.body.fontFamily,
  },
});
