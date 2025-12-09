import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, SectionTitle, Card, Icon, CircleIcon } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';
import { useAuthStore } from '@/features/auth';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const SESSIONS_COLLECTION = 'running_sessions';
const USERS_COLLECTION = 'users';

interface LeaderboardUser {
  rank: number;
  name: string;
  distance: number;
  distanceFormatted: string;
  avatarColor: [string, string];
  photoURL?: string | null;
}

interface Activity {
  name: string;
  action: string;
  detail: string;
  time: string;
  photoURL?: string | null;
  avatarColor: [string, string];
}

export default function CommunityScreen() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState({
    current: 0,
    target: 25,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  // 리더보드 및 활동 피드 로드
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        if (!db) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);

        // 모든 사용자의 이번 달 세션 가져오기
        let allSessions: any[] = [];
        try {
          const sessionsQuery = query(
            collection(db, SESSIONS_COLLECTION),
            where('startTime', '>=', startOfMonth),
            orderBy('startTime', 'desc')
          );

          const sessionsSnapshot = await getDocs(sessionsQuery);
          allSessions = sessionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate?.() || new Date(doc.data().startTime),
          }));
        } catch (sessionError: any) {
          if (sessionError?.code === 'permission-denied') {
            console.warn('[CommunityScreen] 세션 읽기 권한이 없습니다.');
            setLoading(false);
            return;
          }
          throw sessionError;
        }

        // 사용자별 거리 집계
        const userDistances = new Map<string, number>();
        for (const session of allSessions) {
          const userId = session.userId;
          if (userId) {
            const distance = (session.distance || 0) / 1000; // m to km
            userDistances.set(userId, (userDistances.get(userId) || 0) + distance);
          }
        }

        // 사용자 정보 가져오기
        const userIds = Array.from(userDistances.keys());
        const usersMap = new Map<string, { name: string; photoURL: string | null }>();

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
            console.warn(`[CommunityScreen] 사용자 정보 로드 실패 (${userId}):`, error);
          }
        }

        // 리더보드 생성 (상위 5명)
        const leaderboardData: LeaderboardUser[] = Array.from(userDistances.entries())
          .map(([userId, distance]) => ({
            userId,
            distance,
            userInfo: usersMap.get(userId) || { name: '익명', photoURL: null },
          }))
          .sort((a, b) => b.distance - a.distance)
          .slice(0, 5)
          .map((item, index) => {
            const avatarColors = [
              ['#FFD700', '#FFA500'], // 1위: 금색
              ['#C0C0C0', '#A8A8A8'], // 2위: 은색
              ['#CD7F32', '#B8860B'], // 3위: 동색
              [colors.purple.light, colors.purple.dark], // 4위
              ['#2196F3', '#64B5F6'], // 5위
            ];

            return {
              rank: index + 1,
              name: item.userInfo.name,
              distance: item.distance,
              distanceFormatted: `${item.distance.toFixed(1)} km`,
              avatarColor: avatarColors[index] as [string, string],
              photoURL: item.userInfo.photoURL,
            };
          });

        setLeaderboard(leaderboardData);

        // 최근 활동 피드 생성
        const recentSessions = allSessions.slice(0, 10);
        const activityUserIds = [...new Set(recentSessions.map((s: any) => s.userId).filter(Boolean))];
        const activityUsersMap = new Map<string, { name: string; photoURL: string | null }>();

        for (const userId of activityUserIds) {
          if (!usersMap.has(userId)) {
            try {
              const userDocRef = doc(db, USERS_COLLECTION, userId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                const userData = userDoc.data();
                activityUsersMap.set(userId, {
                  name: userData.name || userData.displayName || '익명',
                  photoURL: userData.photoURL || null,
                });
              }
            } catch (error) {
              console.warn(`[CommunityScreen] 활동 사용자 정보 로드 실패 (${userId}):`, error);
            }
          } else {
            activityUsersMap.set(userId, usersMap.get(userId)!);
          }
        }

        // 시간 차이 계산 함수
        const getTimeAgo = (date: Date) => {
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 1) return '방금 전';
          if (diffMins < 60) return `${diffMins}분 전`;
          if (diffHours < 24) return `${diffHours}시간 전`;
          return `${diffDays}일 전`;
        };

        const activityColors = [
          [colors.primary.light, colors.primary.dark],
          [colors.danger.light, colors.danger.dark],
          [colors.success.light, colors.success.dark],
        ];

        const activitiesData: Activity[] = recentSessions.slice(0, 5).map((session: any, index: number) => {
          const userId = session.userId || '';
          const userInfo = activityUsersMap.get(userId) || { name: '익명', photoURL: null };
          const distance = (session.distance || 0) / 1000; // m to km
          const duration = session.duration || 0; // seconds
          const pace = distance > 0 && duration > 0 ? (duration / distance) / 60 : 0; // 분/km

          // 활동 타입 결정
          let action = '러닝 완료';
          let detail = `${distance.toFixed(1)}km`;

          if (distance >= 10) {
            action = '새로운 기록 달성!';
            detail = `${distance.toFixed(1)}km 최고 기록`;
          } else if (pace > 0 && pace < 6) {
            action = '빠른 페이스 달성!';
            detail = `${Math.floor(pace)}'${Math.round((pace % 1) * 60).toString().padStart(2, '0')}" 페이스`;
          } else {
            action = '러닝 완료';
            detail = `${distance.toFixed(1)}km 러닝`;
          }

          return {
            name: userInfo.name,
            action,
            detail,
            time: getTimeAgo(session.startTime),
            photoURL: userInfo.photoURL,
            avatarColor: activityColors[index % activityColors.length] as [string, string],
          };
        });

        setActivities(activitiesData);

        // 주간 챌린지 계산 (현재 사용자)
        if (user?.id) {
          const weeklySessions = allSessions.filter((session: any) => {
            return session.userId === user.id && session.startTime >= startOfWeek;
          });

          const weeklyDistance = weeklySessions.reduce((sum: number, s: any) => sum + (s.distance || 0), 0) / 1000; // m to km
          const target = 25;
          const percentage = Math.min(Math.round((weeklyDistance / target) * 100), 100);

          setWeeklyChallenge({
            current: Math.round(weeklyDistance * 10) / 10,
            target,
            percentage,
          });
        }
      } catch (error: any) {
        if (error?.code === 'permission-denied') {
          console.warn('[CommunityScreen] 커뮤니티 데이터 로드 권한이 없습니다.');
        } else {
          console.error('[CommunityScreen] 커뮤니티 데이터 로드 실패:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <CircleIcon from={colors.primary.light} to={colors.primary.dark} size={40}>
          <Icon name="users" size={20} color="#FFFFFF" />
        </CircleIcon>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Challenge */}
        <View style={styles.challengeCard}>
          <LinearGradient
            colors={[colors.danger.light, colors.danger.dark]}
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
              <View style={styles.challengeHeader}>
                <Icon name="award" size={24} color="#FFFFFF" />
                <Text style={styles.challengeTitle}>이번 주 챌린지</Text>
              </View>
              <Text style={styles.challengeDistance}>{weeklyChallenge.target}km 달리기</Text>
              <View style={styles.challengeProgress}>
                <View style={[styles.challengeProgressFill, { width: `${weeklyChallenge.percentage}%` }]} />
              </View>
              <View style={styles.challengeFooter}>
                <Text style={styles.challengeText}>{weeklyChallenge.current}km 완료</Text>
                <Text style={styles.challengeText}>{Math.max(0, weeklyChallenge.target - weeklyChallenge.current).toFixed(1)}km 남음</Text>
              </View>
            </>
          )}
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionTitle>이번 달 리더보드</SectionTitle>
            <Icon name="trending-up" size={20} color={colors.primary.light} />
          </View>
          <Card variant="elevated" style={styles.leaderboardCard}>
            {loading ? (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary.light} />
              </View>
            ) : leaderboard.length > 0 ? (
              leaderboard.map((user) => (
                <View key={user.rank} style={styles.leaderboardRow}>
                  <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{user.rank}</Text>
                  </View>
                  {user.photoURL ? (
                    <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}>
                      <Image
                        source={{ uri: user.photoURL }}
                        style={{ width: 40, height: 40 }}
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    <CircleIcon from={user.avatarColor[0]} to={user.avatarColor[1]} size={40}>
                      <Text style={styles.avatarText}>{user.name[0]}</Text>
                    </CircleIcon>
                  )}
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userDistance}>{user.distanceFormatted}</Text>
                  </View>
                  {user.rank <= 3 && (
                    <View style={styles.topBadge}>
                      <Text style={styles.topBadgeText}>TOP {user.rank}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.textLight, fontSize: 14 }}>
                  아직 리더보드 데이터가 없습니다
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <SectionTitle>최근 활동</SectionTitle>
          <View style={styles.activitiesList}>
            {loading ? (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary.light} />
              </View>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <View key={index} style={styles.activityCard}>
                  <View style={styles.activityContent}>
                    {activity.photoURL ? (
                      <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}>
                        <Image
                          source={{ uri: activity.photoURL }}
                          style={{ width: 40, height: 40 }}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <CircleIcon from={activity.avatarColor[0]} to={activity.avatarColor[1]} size={40}>
                        <Text style={styles.activityAvatarText}>{activity.name[0]}</Text>
                      </CircleIcon>
                    )}
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityName}>
                        {activity.name}
                        <Text style={styles.activityAction}> {activity.action}</Text>
                      </Text>
                      <Text style={styles.activityDetail}>{activity.detail}</Text>
                      <View style={styles.activityActions}>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.textLight, fontSize: 14 }}>
                  아직 활동이 없습니다
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
    padding: spacing.xl, // p-6 = 24px
    gap: spacing.xl, // gap-8 = 32px
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
  challengeCard: {
    borderRadius: radius.xl, // rounded-[24px]
    padding: spacing.lg, // p-5 = 20px
    overflow: 'hidden',
    ...shadows.challenge,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  challengeTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  challengeDistance: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  challengeProgress: {
    width: '100%',
    height: 8, // h-2 = 8px
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    borderRadius: 4, // rounded-full
    overflow: 'hidden',
    marginBottom: spacing.sm, // mb-2 = 8px
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  leaderboardCard: {
    gap: spacing.md,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rankContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    color: colors.textStrong,
    fontWeight: '600',
  },
  userDistance: {
    fontSize: 13,
    color: colors.textLight,
  },
  activitiesList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  activityAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
    color: colors.textStrong,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  activityAction: {
    color: colors.textLight,
    fontWeight: '400',
  },
  activityDetail: {
    fontSize: 14,
    color: colors.primary.light,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activityActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  activityActionText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 11,
    color: colors.gray[300],
    marginLeft: 'auto',
  },
  topBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    borderRadius: radius.full,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFA500',
  },
});

