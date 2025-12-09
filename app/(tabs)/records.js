import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getRunningSessions } from '../../src/features/records';
import { PageContainer, Card, Spacer, GradientView } from '../../src/components/ui';
import { spacing, typography, colors } from '../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RecordsScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState([
    { id: 1, date: '2024.12.08', distance: 5410, duration: 1935, pace: 357 },
    { id: 2, date: '2024.12.06', distance: 7200, duration: 2550, pace: 354 },
    { id: 3, date: '2024.12.05', distance: 4100, duration: 1518, pace: 370 },
    { id: 4, date: '2024.12.03', distance: 8500, duration: 2925, pace: 344 },
  ]);
  const [stats, setStats] = useState({
    thisMonth: 42,
    total: 152,
    goalProgress: 68,
  });
  const [weeklyStats, setWeeklyStats] = useState({
    totalDistance: 17100,
    totalDuration: 6008,
    avgPace: 352,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadSessions();
    }, [])
  );

  const loadSessions = async () => {
    try {
      const data = await getRunningSessions(null, 50);
      if (data && data.length > 0) {
        setSessions(data.slice(0, 4).map(s => ({
          id: s.id,
          date: formatDateShort(s.start_time),
          distance: s.distance,
          duration: s.duration,
          pace: s.avg_pace,
        })));
      }
    } catch (error) {
      console.error('기록 로드 실패:', error);
    }
  };

  const formatDistance = (meters) => {
    if (!meters) return '0km';
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secPerKm) => {
    if (!secPerKm || secPerKm === 0) return "--'--\"";
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.round(secPerKm % 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  const formatDateShort = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  return (
    <PageContainer scrollable style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>러닝 기록</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>필터</Text>
        </TouchableOpacity>
      </View>

      <Spacer height={spacing.lg} />

      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <GradientView 
            colors={colors.gradientOrange}
            style={styles.statIcon}
          >
            <MaterialCommunityIcons name="fire" size={20} color="#FFFFFF" />
          </GradientView>
          <Text style={styles.statValue}>{stats.thisMonth}</Text>
          <Text style={styles.statLabel}>이번 달</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <GradientView 
            colors={colors.gradientPrimary}
            style={styles.statIcon}
          >
            <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
          </GradientView>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>전체</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <GradientView 
            colors={colors.gradientGreen}
            style={styles.statIcon}
          >
            <MaterialCommunityIcons name="target" size={20} color="#FFFFFF" />
          </GradientView>
          <Text style={styles.statValue}>{stats.goalProgress}%</Text>
          <Text style={styles.statLabel}>목표</Text>
        </Card>
      </View>

      <Spacer height={spacing.lg} />

      {/* This Week */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>이번 주</Text>
          <MaterialCommunityIcons name="trending-up" size={20} color={colors.green} />
        </View>
        <Spacer height={spacing.sm} />
        
        <GradientView 
          colors={colors.gradientPrimary}
          style={styles.weeklyCard}
        >
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={styles.weeklyLabel}>총 거리</Text>
              <Text style={styles.weeklyDistance}>{formatDistance(weeklyStats.totalDistance)}</Text>
            </View>
            <View style={styles.weeklyRight}>
              <Text style={styles.weeklyLabel}>총 시간</Text>
              <Text style={styles.weeklyTime}>{formatDuration(weeklyStats.totalDuration)}</Text>
            </View>
          </View>
          <View style={styles.weeklyFooter}>
            <MaterialCommunityIcons name="speedometer" size={16} color="#FFFFFF" />
            <Text style={styles.weeklyPace}>평균 페이스: {formatPace(weeklyStats.avgPace)}/km</Text>
          </View>
        </GradientView>
      </View>

      <Spacer height={spacing.lg} />

      {/* Recent Activities */}
      <View>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar" size={20} color={colors.textStrong} />
          <Text style={styles.sectionTitle}>최근 활동</Text>
        </View>
        <Spacer height={spacing.sm} />

        <View style={styles.activitiesList}>
          {sessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.activityCard}
              onPress={() => router.push(`/session/${session.id}`)}
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityDate}>{session.date}</Text>
                <View style={styles.activityBadge}>
                  <Text style={styles.activityBadgeText}>러닝</Text>
                </View>
              </View>
              <View style={styles.activityStats}>
                <View style={styles.activityStatItem}>
                  <Text style={styles.activityStatLabel}>거리</Text>
                  <Text style={styles.activityStatValue}>{formatDistance(session.distance)}</Text>
                </View>
                <View style={styles.activityStatItem}>
                  <Text style={styles.activityStatLabel}>시간</Text>
                  <Text style={styles.activityStatValue}>{formatDuration(session.duration)}</Text>
                </View>
                <View style={styles.activityStatItem}>
                  <Text style={styles.activityStatLabel}>페이스</Text>
                  <Text style={styles.activityStatValue}>{formatPace(session.pace)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Spacer height={spacing.xl} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textStrong,
    fontWeight: '800',
    letterSpacing: -0.02,
    fontFamily: typography.h1.fontFamily,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: typography.body.fontFamily,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 20,
    color: colors.textStrong,
    fontWeight: '800',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.h1.fontFamily,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textStrong,
    fontWeight: '600',
    letterSpacing: -0.01,
    fontFamily: typography.h2.fontFamily,
  },
  weeklyCard: {
    borderRadius: 20,
    padding: spacing.lg,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  weeklyLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.body.fontFamily,
  },
  weeklyDistance: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.01,
    fontFamily: typography.h1.fontFamily,
  },
  weeklyRight: {
    alignItems: 'flex-end',
  },
  weeklyTime: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: typography.h1.fontFamily,
  },
  weeklyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  weeklyPace: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: typography.body.fontFamily,
  },
  activitiesList: {
    gap: spacing.sm,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityDate: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  activityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    backgroundColor: `${colors.primary}33`,
    borderRadius: 12,
  },
  activityBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: typography.caption.fontFamily,
  },
  activityStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  activityStatItem: {
    flex: 1,
  },
  activityStatLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: spacing.xs / 2,
    fontFamily: typography.caption.fontFamily,
  },
  activityStatValue: {
    fontSize: 18,
    color: colors.textStrong,
    fontWeight: '700',
    fontFamily: typography.body.fontFamily,
  },
});
