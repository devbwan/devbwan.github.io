import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, SectionTitle, Card, Icon, CircleIcon } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';
import { useAuthStore } from '@/features/auth';
import { getCloudSessions } from '@/services/sessionSyncService';

interface RecentRun {
  date: string;
  distance: string;
  time: string;
  pace: string;
}

export default function RecordsScreen() {
  const { user } = useAuthStore();
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [goalPercentage, setGoalPercentage] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    distance: 0,
    time: 0,
    pace: 0,
  });
  const [loading, setLoading] = useState(true);

  // Firebase에서 러닝 기록 로드
  useEffect(() => {
    const loadRecords = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const sessions = await getCloudSessions(user.id, 100);
        
        // 날짜 포맷팅 함수
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}.${month}.${day}`;
        };

        // 시간 포맷팅 함수
        const formatTime = (seconds: number) => {
          const hrs = Math.floor(seconds / 3600);
          const mins = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;
          if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        // 페이스 포맷팅 함수
        const formatPace = (paceSeconds: number) => {
          if (!paceSeconds || paceSeconds === 0) return '0:00';
          const mins = Math.floor(paceSeconds / 60);
          const secs = Math.round(paceSeconds % 60);
          return `${mins}'${secs.toString().padStart(2, '0')}"`;
        };

        // 최근 활동 목록 생성
        const recent: RecentRun[] = sessions.slice(0, 10).map((session: any) => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          const distance = (session.distance || 0) / 1000; // m to km
          const duration = session.duration || 0; // seconds
          const pace = distance > 0 && duration > 0 ? (duration / distance) : 0; // 초/km

          return {
            date: formatDate(startTime),
            distance: `${distance.toFixed(2)} km`,
            time: formatTime(duration),
            pace: formatPace(pace),
          };
        });

        setRecentRuns(recent);

        // 이번 달 통계 계산
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlySessions = sessions.filter((session: any) => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          return startTime >= startOfMonth;
        });
        setMonthlyCount(monthlySessions.length);

        // 전체 통계 계산
        setTotalCount(sessions.length);

        // 이번 주 통계 계산
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        const weeklySessions = sessions.filter((session: any) => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          return startTime >= startOfWeek;
        });

        const weeklyDistance = weeklySessions.reduce((sum: number, s: any) => sum + (s.distance || 0), 0) / 1000; // m to km
        const weeklyTime = weeklySessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0); // seconds
        const weeklyPace = weeklyDistance > 0 && weeklyTime > 0 ? (weeklyTime / weeklyDistance) : 0; // 초/km

        setWeeklyStats({
          distance: weeklyDistance,
          time: weeklyTime,
          pace: weeklyPace,
        });

        // 목표 달성률 계산 (주간 목표 25km 기준)
        const target = 25;
        const percentage = Math.min(Math.round((weeklyDistance / target) * 100), 100);
        setGoalPercentage(percentage);
      } catch (error) {
        console.error('[RecordsScreen] 기록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>러닝 기록</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>필터</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <CircleIcon from={colors.danger.light} to={colors.danger.dark} size={40}>
              <Icon name="flame" size={20} color="#FFFFFF" />
            </CircleIcon>
            <Text style={styles.statValue}>{loading ? '...' : monthlyCount}</Text>
            <Text style={styles.statLabel}>이번 달</Text>
          </View>

          <View style={styles.statCard}>
            <CircleIcon from={colors.primary.light} to={colors.primary.dark} size={40}>
              <Icon name="trophy" size={20} color="#FFFFFF" />
            </CircleIcon>
            <Text style={styles.statValue}>{loading ? '...' : totalCount}</Text>
            <Text style={styles.statLabel}>전체</Text>
          </View>

          <View style={styles.statCard}>
            <CircleIcon from={colors.success.light} to={colors.success.dark} size={40}>
              <Icon name="target" size={20} color="#FFFFFF" />
            </CircleIcon>
            <Text style={styles.statValue}>{loading ? '...' : `${goalPercentage}%`}</Text>
            <Text style={styles.statLabel}>목표</Text>
          </View>
        </View>

        {/* This Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionTitle>이번 주</SectionTitle>
            <Icon name="trending-up" size={20} color={colors.success.light} />
          </View>

          <View style={styles.weekCard}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {loading ? (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : (
              <>
                <View style={styles.weekCardContent}>
                  <View style={styles.weekCardLeft}>
                    <Text style={styles.weekCardLabel}>총 거리</Text>
                    <Text style={styles.weekCardDistance}>{weeklyStats.distance.toFixed(1)} km</Text>
                  </View>
                  <View style={styles.weekCardRight}>
                    <Text style={styles.weekCardLabel}>총 시간</Text>
                    <Text style={styles.weekCardTime}>
                      {(() => {
                        const hrs = Math.floor(weeklyStats.time / 3600);
                        const mins = Math.floor((weeklyStats.time % 3600) / 60);
                        const secs = Math.floor(weeklyStats.time % 60);
                        if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                      })()}
                    </Text>
                  </View>
                </View>
                <View style={styles.weekCardFooter}>
                  <Icon name="activity" size={16} color="#FFFFFF" />
                  <Text style={styles.weekCardPace}>
                    평균 페이스: {(() => {
                      if (weeklyStats.pace === 0) return '0:00';
                      const mins = Math.floor(weeklyStats.pace / 60);
                      const secs = Math.round(weeklyStats.pace % 60);
                      return `${mins}'${secs.toString().padStart(2, '0')}"`;
                    })()}/km
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Icon name="calendar" size={20} color={colors.textStrong} />
            <SectionTitle>최근 활동</SectionTitle>
          </View>

          <View style={styles.activitiesList}>
            {loading ? (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary.light} />
              </View>
            ) : recentRuns.length > 0 ? (
              recentRuns.map((run, index) => (
                <View key={index} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityDate}>{run.date}</Text>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>러닝</Text>
                    </View>
                  </View>
                  <View style={styles.activityStats}>
                    <View style={styles.activityStatItem}>
                      <Text style={styles.activityStatLabel}>거리</Text>
                      <Text style={styles.activityStatValue}>{run.distance}</Text>
                    </View>
                    <View style={styles.activityStatItem}>
                      <Text style={styles.activityStatLabel}>시간</Text>
                      <Text style={styles.activityStatValue}>{run.time}</Text>
                    </View>
                    <View style={styles.activityStatItem}>
                      <Text style={styles.activityStatLabel}>페이스</Text>
                      <Text style={styles.activityStatValue}>{run.pace}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.textLight, fontSize: 14 }}>
                  아직 러닝 기록이 없습니다
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textStrong,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary.light,
    borderRadius: radius.full,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12, // gap-3 = 12px
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md, // rounded-[16px]
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    ...shadows.card,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textStrong,
    marginTop: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // mb-3 = 12px
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 12, // mb-3 = 12px
  },
  weekCard: {
    borderRadius: radius.lg, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    overflow: 'hidden',
    ...shadows.goal,
  },
  weekCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  weekCardLeft: {
    flex: 1,
  },
  weekCardRight: {
    alignItems: 'flex-end',
  },
  weekCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs / 2,
  },
  weekCardDistance: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01,
  },
  weekCardTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weekCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  weekCardPace: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  activitiesList: {
    gap: 12, // gap-3 = 12px
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md, // rounded-[16px]
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // mb-3 = 12px
  },
  activityDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  activityBadge: {
    paddingHorizontal: 12, // px-3 = 12px
    paddingVertical: 4, // py-1 = 4px
    backgroundColor: `${colors.primary.light}33`, // primary/20
    borderRadius: radius.full,
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.light,
  },
  activityStats: {
    flexDirection: 'row',
    gap: spacing.md, // gap-4 = 16px
  },
  activityStatItem: {
    flex: 1,
  },
  activityStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xs / 2,
  },
  activityStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textStrong,
  },
});
