import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SectionTitle, StatCard, Card, Icon, CircleIcon } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';
import { useAuthStore } from '@/features/auth';
import { getCloudSessions } from '@/services/sessionSyncService';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import { signInWithGoogleToken } from '@/services/authService';

interface Stat {
  label: string;
  value: string;
  iconColor: [string, string];
}

interface Achievement {
  name: string;
  date: string;
  icon: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, authProvider, signOut, signIn } = useAuthStore();
  const { request, response, promptAsync } = useGoogleLogin();
  const [stats, setStats] = useState<Stat[]>([
    { label: '총 거리', value: '0.0 km', iconColor: [colors.primary.light, colors.primary.dark] },
    { label: '총 시간', value: '0h 0m', iconColor: [colors.danger.light, colors.danger.dark] },
    { label: '달성률', value: '0%', iconColor: [colors.success.light, colors.success.dark] },
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [daysActive, setDaysActive] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 사용자 통계 로드
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const sessions = await getCloudSessions(user.id, 1000);

        // 총 거리 계산
        const totalDistance = sessions.reduce((sum: number, s: any) => sum + (s.distance || 0), 0) / 1000; // m to km

        // 총 시간 계산
        const totalTime = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0); // seconds
        const totalHours = Math.floor(totalTime / 3600);
        const totalMinutes = Math.floor((totalTime % 3600) / 60);

        // 달성률 계산 (주간 목표 25km 기준)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        const weeklySessions = sessions.filter((session: any) => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          return startTime >= startOfWeek;
        });
        const weeklyDistance = weeklySessions.reduce((sum: number, s: any) => sum + (s.distance || 0), 0) / 1000;
        const goalPercentage = Math.min(Math.round((weeklyDistance / 25) * 100), 100);

        // 활성 일수 계산
        const uniqueDates = new Set(
          sessions.map((session: any) => {
            const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
            return startTime.toDateString();
          })
        );
        setDaysActive(uniqueDates.size);

        // 레벨 계산 (총 거리 기반, 50km당 1레벨)
        setLevel(Math.max(1, Math.floor(totalDistance / 50) + 1));

        setStats([
          { label: '총 거리', value: `${totalDistance.toFixed(1)} km`, iconColor: [colors.primary.light, colors.primary.dark] },
          { label: '총 시간', value: `${totalHours}h ${totalMinutes}m`, iconColor: [colors.danger.light, colors.danger.dark] },
          { label: '달성률', value: `${goalPercentage}%`, iconColor: [colors.success.light, colors.success.dark] },
        ]);

        // 달성 배지 생성
        const newAchievements: Achievement[] = [];
        
        if (sessions.length > 0) {
          const firstRun = sessions[sessions.length - 1];
          const firstRunDate = firstRun.startTime?.toDate?.() || new Date(firstRun.startTime);
          newAchievements.push({
            name: '첫 러닝',
            date: `${firstRunDate.getFullYear()}.${String(firstRunDate.getMonth() + 1).padStart(2, '0')}.${String(firstRunDate.getDate()).padStart(2, '0')}`,
            icon: '🏃',
          });
        }

        if (totalDistance >= 100) {
          const hundredKmSession = sessions.find((s: any) => {
            let cumulative = 0;
            for (const session of sessions) {
              cumulative += (session.distance || 0) / 1000;
              if (cumulative >= 100) {
                return session;
              }
            }
            return null;
          });
          if (hundredKmSession) {
            const date = hundredKmSession.startTime?.toDate?.() || new Date(hundredKmSession.startTime);
            newAchievements.push({
              name: '100km 달성',
              date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
              icon: '💯',
            });
          }
        }

        // 한 달 챌린지 (한 달에 20회 이상)
        const monthlySessions = sessions.filter((session: any) => {
          const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
          const sessionMonth = startTime.getMonth();
          const sessionYear = startTime.getFullYear();
          return sessionMonth === now.getMonth() && sessionYear === now.getFullYear();
        });
        if (monthlySessions.length >= 20) {
          newAchievements.push({
            name: '한 달 챌린지',
            date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.01`,
            icon: '🔥',
          });
        }

        // 최고 기록 찾기
        const maxDistanceSession = sessions.reduce((max: any, session: any) => {
          return (session.distance || 0) > (max.distance || 0) ? session : max;
        }, sessions[0]);
        if (maxDistanceSession && (maxDistanceSession.distance || 0) >= 10000) {
          const date = maxDistanceSession.startTime?.toDate?.() || new Date(maxDistanceSession.startTime);
          newAchievements.push({
            name: '10km 최고 기록',
            date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
            icon: '⚡',
          });
        }

        setAchievements(newAchievements);
      } catch (error) {
        console.error('[ProfileScreen] 통계 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user?.id]);

  // Google OAuth 응답 처리
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        setGoogleLoading(true);
        try {
          const googleUser = await signInWithGoogleToken(response);
          await signIn(googleUser, 'google');
          // 로그인 성공 후 프로필 화면이 자동으로 업데이트됨
        } catch (error) {
          console.error('[ProfileScreen] Google 로그인 실패:', error);
          Alert.alert('로그인 실패', error.message || 'Google 로그인에 실패했습니다.');
        } finally {
          setGoogleLoading(false);
        }
      } else if (response?.type === 'error') {
        setGoogleLoading(false);
        console.error('[ProfileScreen] Google OAuth 오류:', response);
        Alert.alert('로그인 실패', 'Google 로그인에 실패했습니다.');
      } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
        setGoogleLoading(false);
      }
    };

    if (response) {
      handleGoogleResponse();
    }
  }, [response, signIn]);

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('오류', 'Google 로그인 요청을 준비할 수 없습니다.');
      return;
    }

    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('[ProfileScreen] Google 로그인 프롬프트 오류:', error);
      Alert.alert('오류', 'Google 로그인을 시작할 수 없습니다.');
      setGoogleLoading(false);
    }
  };

  const settings = [
    { label: '알림 설정', iconName: 'bell' },
    { label: '개인정보 보호', iconName: 'lock' },
    { label: '앱 설정', iconName: 'settings' },
    { label: '도움말', iconName: 'help-circle' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 정보</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.settingsButtonInner}>
              <Icon name="settings" size={20} color={colors.textLight} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
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
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatarContainer}>
                  {user?.photoURL ? (
                    <View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden' }}>
                      <Image
                        source={{ uri: user.photoURL }}
                        style={{ width: 64, height: 64 }}
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    <CircleIcon from={colors.danger.light} to={colors.danger.dark} size={64}>
                      <Text style={styles.profileAvatarText}>
                        {authProvider === 'guest' ? '게' : user?.name?.[0] || 'U'}
                      </Text>
                    </CircleIcon>
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {authProvider === 'guest' ? '게스트' : user?.name || '사용자'}
                  </Text>
                  <Text style={styles.profileSubtext}>
                    러닝 {daysActive}일째 {daysActive > 0 ? '🔥' : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.profileFooter}>
                <Icon name="award" size={16} color="#FFFFFF" />
                <Text style={styles.profileFooterText}>레벨 {level}</Text>
              </View>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>내 기록</SectionTitle>
          {loading ? (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary.light} />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <CircleIcon from={stat.iconColor[0]} to={stat.iconColor[1]} size={40}>
                    <Icon name="trending-up" size={20} color="#FFFFFF" />
                  </CircleIcon>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Icon name="award" size={20} color={colors.textStrong} />
            <SectionTitle>달성 배지</SectionTitle>
          </View>
          {loading ? (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary.light} />
            </View>
          ) : achievements.length > 0 ? (
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
              <Text style={{ color: colors.textLight, fontSize: 14 }}>
                아직 달성한 배지가 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>설정</SectionTitle>
          <View style={styles.settingsCard}>
            {settings.map((setting, index) => (
              <TouchableOpacity key={index} style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Icon name={setting.iconName} size={20} color={colors.textLight} />
                </View>
                <Text style={styles.settingLabel}>{setting.label}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        {authProvider !== 'guest' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                Alert.alert(
                  '로그아웃',
                  '정말 로그아웃하시겠습니까?',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '로그아웃',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await signOut();
                          router.replace('/login');
                        } catch (error) {
                          console.error('[ProfileScreen] 로그아웃 실패:', error);
                          Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Icon name="logout" size={20} color={colors.error} />
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Google Login Button (Guest) */}
        {authProvider === 'guest' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.googleLoginButton}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleLoginButtonText}>Google로 로그인</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.guestButtonText}>다른 방법으로 로그인</Text>
            </TouchableOpacity>
          </View>
        )}
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingsButtonInner: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: radius.xl, // rounded-[24px]
    padding: spacing.lg, // p-6 = 24px
    overflow: 'hidden',
    ...shadows.heroBlue,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md, // gap-4 = 16px
    marginBottom: spacing.md, // mb-4 = 16px
  },
  profileAvatarContainer: {
    ...shadows.card,
  },
  profileAvatarText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.xs / 2, // mb-1 = 4px
  },
  profileSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
  },
  profileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
  },
  profileFooterText: {
    fontSize: 13,
    color: '#FFFFFF',
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
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md, // rounded-[16px]
    padding: spacing.md, // p-4 = 16px
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: colors.textStrong,
    fontWeight: '800',
    marginTop: spacing.xs, // mb-2 = 8px
    marginBottom: spacing.xs / 2, // mb-1 = 4px
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
    marginBottom: 12, // mb-3 = 12px
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // gap-3 = 12px
  },
  achievementCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radius.md, // rounded-[16px]
    padding: spacing.md, // p-4 = 16px
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: spacing.xs, // mb-2 = 8px
  },
  achievementName: {
    fontSize: 14,
    color: colors.textStrong,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs / 2, // mb-1 = 4px
  },
  achievementDate: {
    fontSize: 11,
    color: colors.textLight,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg, // rounded-[20px]
    padding: spacing.sm, // p-2 = 8px
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md, // gap-3 = 12px
    padding: spacing.md, // p-3 = 12px
    borderRadius: radius.sm, // rounded-[12px]
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBorder, // bg-[#2C2C2E]
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textStrong,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: colors.gray[300], // text-[#6A6F80]
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs, // gap-2 = 8px
    padding: spacing.lg, // py-4 = 16px
    backgroundColor: colors.card,
    borderRadius: radius.md, // rounded-[16px]
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logoutButtonText: {
    fontSize: 15,
    color: colors.error, // text-[#FF3B30]
    fontWeight: '600',
  },
  googleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: '#4285F4',
    borderRadius: radius.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleLoginButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  guestButtonText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
});
