import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, StatCard, CommunityRow, FabButton, SectionTitle, Icon, CircleIcon } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';
import { useAuthStore } from '@/features/auth';
import { getCloudSessions } from '@/services/sessionSyncService';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const SESSIONS_COLLECTION = 'running_sessions';
const USERS_COLLECTION = 'users';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [todayStats, setTodayStats] = useState({
    distance: '0.00',
    time: '0:00',
    pace: '0:00',
  });
  const [weeklyGoal, setWeeklyGoal] = useState({
    current: 0,
    target: 25,
    percentage: 0,
  });
  const [communityFeed, setCommunityFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // 오늘의 기록 계산
  useEffect(() => {
    const loadTodayStats = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const sessions = await getCloudSessions(user.id, 100);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 오늘의 세션 필터링
        const todaySessions = sessions.filter(session => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          return startTime >= startOfDay;
        });

        // 통계 계산
        const totalDistance = todaySessions.reduce((sum, s) => sum + (s.distance || 0), 0) / 1000; // m to km
        const totalTime = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0); // seconds
        const avgPaceMinutes = totalDistance > 0 && totalTime > 0 
          ? (totalTime / totalDistance) / 60 // 초/km을 분/km으로 변환
          : 0;

        // 시간 포맷팅
        const formatTime = (seconds) => {
          const hrs = Math.floor(seconds / 3600);
          const mins = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;
          if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        // 페이스 포맷팅
        const formatPace = (paceMinutes: number) => {
          if (paceMinutes === 0) return '0:00';
          const mins = Math.floor(paceMinutes);
          const secs = Math.round((paceMinutes - mins) * 60);
          return `${mins}'${secs.toString().padStart(2, '0')}"`;
        };

        setTodayStats({
          distance: totalDistance.toFixed(2),
          time: formatTime(totalTime),
          pace: formatPace(avgPaceMinutes),
        });
      } catch (error) {
        console.error('[HomeScreen] 오늘의 기록 로드 실패:', error);
      }
    };

    loadTodayStats();
  }, [user?.id]);

  // 주간 목표 계산
  useEffect(() => {
    const loadWeeklyGoal = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const sessions = await getCloudSessions(user.id, 100);
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);

        // 주간 세션 필터링
        const weeklySessions = sessions.filter(session => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          return startTime >= startOfWeek;
        });

        const weeklyDistance = weeklySessions.reduce((sum, s) => sum + (s.distance || 0), 0) / 1000; // m to km
        const target = 25; // 기본 목표 25km
        const percentage = Math.min(Math.round((weeklyDistance / target) * 100), 100);

        setWeeklyGoal({
          current: Math.round(weeklyDistance * 10) / 10,
          target,
          percentage,
        });
      } catch (error) {
        console.error('[HomeScreen] 주간 목표 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyGoal();
  }, [user?.id]);

  // 커뮤니티 피드 로드
  useEffect(() => {
    const loadCommunityFeed = async () => {
      try {
        if (!db) {
          setCommunityFeed([]);
          return;
        }

        // 최근 러닝 세션 가져오기 (모든 사용자)
        // 권한 오류가 발생할 수 있으므로 try-catch로 처리
        let sessions: any[] = [];
        try {
          const sessionsQuery = query(
            collection(db, SESSIONS_COLLECTION),
            orderBy('startTime', 'desc'),
            limit(10)
          );

          const sessionsSnapshot = await getDocs(sessionsQuery);
          sessions = sessionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate?.() || new Date(doc.data().startTime),
          }));
        } catch (sessionError: any) {
          // 권한 오류인 경우 빈 배열 반환
          if (sessionError?.code === 'permission-denied' || sessionError?.message?.includes('permission')) {
            console.warn('[HomeScreen] 세션 읽기 권한이 없습니다. 커뮤니티 피드를 표시할 수 없습니다.');
            setCommunityFeed([]);
            return;
          }
          throw sessionError;
        }

        if (sessions.length === 0) {
          setCommunityFeed([]);
          return;
        }

        // 사용자 정보 가져오기
        const userIds = [...new Set(sessions.map((s: any) => s.userId).filter(Boolean))];
        const usersMap = new Map();

        for (const userId of userIds) {
          try {
            const userDocRef = doc(db, USERS_COLLECTION, userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              usersMap.set(userId, {
                name: userData.name || userData.displayName || '익명',
                photoURL: userData.photoURL || null,
              });
            }
          } catch (error) {
            console.warn(`[HomeScreen] 사용자 정보 로드 실패 (${userId}):`, error);
          }
        }

        // 시간 차이 계산 함수
        const getTimeAgo = (date: Date) => {
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 1) return '방금 전';
          if (diffMins < 60) return `${diffMins}분 전`;
          if (diffHours < 24) return `${diffHours}시간 전`;
          return `${diffDays}일 전`;
        };

        // 커뮤니티 피드 생성
        const feed = sessions.slice(0, 3).map((session: any, index: number) => {
          const userId = session.userId || '';
          const userInfo = usersMap.get(userId) || { name: '익명', photoURL: null };
          const avatarColors = [
            [colors.danger.light, colors.danger.dark],
            [colors.success.light, colors.success.dark],
            [colors.purple.light, colors.purple.dark],
          ];

          return {
            id: session.id,
            name: userInfo.name,
            distance: ((session.distance || 0) / 1000).toFixed(1),
            time: getTimeAgo(session.startTime),
            avatarColor: avatarColors[index % avatarColors.length] as [string, string],
            photoURL: userInfo.photoURL,
          };
        });

        setCommunityFeed(feed);
      } catch (error: any) {
        // 권한 오류인 경우 빈 배열로 설정하고 에러를 로그만 남김
        if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
          console.warn('[HomeScreen] 커뮤니티 피드 로드 권한이 없습니다.');
          setCommunityFeed([]);
        } else {
          console.error('[HomeScreen] 커뮤니티 피드 로드 실패:', error);
          setCommunityFeed([]);
        }
      }
    };

    loadCommunityFeed();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[colors.primary.light, colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="zap" size={20} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.logoText}>RunWave</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[colors.danger.light, colors.danger.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              >
                <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : '게'}
                  </Text>
                </View>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        {/* Start Running Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.startButton}
          onPress={() => router.push('/run-start')}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <View style={styles.startButtonIconContainer}>
              <Icon name="zap" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.startButtonTextContainer}>
              <Text style={styles.startButtonTitle}>러닝 시작</Text>
              <Text style={styles.startButtonSubtitle}>지금 바로 달려보세요</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Hero Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.heroCard}
          onPress={() => router.push('/run-start')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1717406362477-8555b1190a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwdHJhY2slMjBzdW5zZXR8ZW58MXx8fHwxNzY1MTc4MzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Icon name="map-pin" size={16} color="#FFFFFF" />
              <Text style={styles.heroLabel}>오늘의 러닝</Text>
            </View>
            <View style={styles.heroStats}>
              <Text style={styles.heroDistance}>{todayStats.distance} km</Text>
              <Text style={styles.heroStatus}>
                {parseFloat(todayStats.distance) > 0 ? '완료' : '시작하기'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Stats Section */}
        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>오늘의 기록</SectionTitle>
          <View style={styles.statsGrid}>
            <StatCard
              iconName="clock"
              iconColor={[colors.danger.light, colors.danger.dark]}
              label="시간"
              value={todayStats.time}
            />
            <StatCard
              iconName="activity"
              iconColor={[colors.primary.light, colors.primary.dark]}
              label="평균 페이스"
              value={todayStats.pace}
            />
          </View>

          {/* Weekly Goal */}
          <View style={styles.goalCard}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.goalHeader}>
              <View style={styles.goalHeaderLeft}>
                <Icon name="award" size={20} color="#FFFFFF" />
                <Text style={styles.goalTitle}>주간 목표</Text>
              </View>
              <Text style={styles.goalPercentage}>{weeklyGoal.percentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${weeklyGoal.percentage}%` },
                ]}
              />
            </View>
            <View style={styles.goalFooter}>
              <Text style={styles.goalText}>
                {weeklyGoal.current}km / {weeklyGoal.target}km
              </Text>
              <Text style={styles.goalText}>
                {weeklyGoal.target - weeklyGoal.current}km 남음
              </Text>
            </View>
          </View>
        </View>

        {/* Community Section */}
        <View style={styles.section}>
          <View style={[styles.communityHeader, { marginBottom: spacing.md }]}>
            <SectionTitle>커뮤니티 활동</SectionTitle>
            <Icon name="trending-up" size={20} color={colors.primary.light} />
          </View>
          <View style={styles.communityCard}>
            {loading ? (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary.light} />
              </View>
            ) : communityFeed.length > 0 ? (
              communityFeed.map((item) => (
                <CommunityRow
                  key={item.id}
                  name={item.name}
                  distance={item.distance}
                  time={item.time}
                  avatarColor={item.avatarColor}
                  photoURL={item.photoURL}
                />
              ))
            ) : (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.textLight, fontSize: 14 }}>
                  아직 커뮤니티 활동이 없습니다
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
    padding: spacing.xl, // p-6 = 24px (gap-8과 함께)
    gap: spacing.xl, // gap-8 = 32px
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoText: {
    ...typography.h1,
    color: colors.textStrong,
  },
  startButton: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.goal,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  startButtonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  startButtonTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01,
    marginBottom: spacing.xs / 2,
  },
  startButtonSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroCard: {
    width: '100%',
    height: 180, // h-[180px]
    borderRadius: radius.xl, // rounded-[24px]
    overflow: 'hidden',
    ...shadows.hero,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg, // bottom-5 = 20px
    left: spacing.lg, // left-5 = 20px
    right: spacing.lg, // right-5 = 20px
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
    marginBottom: spacing.xs, // mb-2 = 8px
  },
  heroLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs, // gap-2 = 8px
  },
  heroDistance: {
    ...typography.statLarge,
    color: '#FFFFFF',
  },
  heroStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 12, // mb-3 = 12px
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12, // gap-3 = 12px
  },
  goalCard: {
    borderRadius: radius.lg, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    marginTop: 12, // mt-3 = 12px
    overflow: 'hidden',
    ...shadows.goal,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  goalTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalPercentage: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: 8, // h-2 = 8px
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    borderRadius: 4, // rounded-full
    overflow: 'hidden',
    marginBottom: spacing.sm, // mb-2 = 8px
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // mb-3 = 12px
  },
  communityCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    gap: spacing.md,
  },
});

