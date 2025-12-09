import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '../../src/features/auth';
import { getUserStats } from '../../src/features/profile';
import { getUserRewards } from '../../src/features/profile';
import { checkRewards } from '../../src/utils/rewardSystem';
import { PageContainer, Card, Spacer, GradientView, Avatar } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authProvider = useAuthStore((state) => state.authProvider);
  const signOutStore = useAuthStore((state) => state.signOut);
  const [stats, setStats] = useState({
    totalDistance: 487300,
    totalTime: 174180,
    goalProgress: 84,
  });
  const [rewards, setRewards] = useState([
    { name: '첫 러닝', date: '2024.01.15', icon: '🏃' },
    { name: '100km 달성', date: '2024.03.22', icon: '💯' },
    { name: '한 달 챌린지', date: '2024.05.01', icon: '🔥' },
    { name: '10km 최고 기록', date: '2024.06.18', icon: '⚡' },
  ]);
  const [settings] = useState([
    { label: '알림 설정', icon: 'bell' },
    { label: '개인정보 보호', icon: 'lock' },
    { label: '앱 설정', icon: 'cog' },
    { label: '도움말', icon: 'help-circle' },
  ]);

  const loadData = React.useCallback(async () => {
    try {
      const currentUser = useAuthStore.getState().user;
      const [statsData, achievedRewards] = await Promise.all([
        getUserStats(currentUser?.id || null),
        getUserRewards(currentUser?.id || null),
      ]);
      setStats({
        totalDistance: statsData.totalDistance || 0,
        totalTime: statsData.totalTime || 0,
        goalProgress: Math.round((statsData.totalDistance || 0) / 580000 * 100),
      });
      const { allRewards } = checkRewards(statsData, achievedRewards);
      if (allRewards && allRewards.length > 0) {
        setRewards(allRewards.slice(0, 4).map(r => ({
          name: r.title,
          date: r.achievedAt || '2024.01.01',
          icon: '🏆',
        })));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [user, authProvider, loadData]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const formatDistance = (meters) => {
    if (!meters || meters < 1000) return `${Math.round(meters || 0)}m`;
    return `${((meters || 0) / 1000).toFixed(1)} km`;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const handleSignOut = async () => {
    const Platform = require('react-native').Platform;
    let confirmed = false;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      confirmed = window.confirm('정말 로그아웃하시겠습니까?');
      if (!confirmed) return;
    } else {
      const result = await new Promise((resolve) => {
        Alert.alert(
          '로그아웃',
          '정말 로그아웃하시겠습니까?',
          [
            { text: '취소', style: 'cancel', onPress: () => resolve(false) },
            { text: '로그아웃', style: 'destructive', onPress: () => resolve(true) },
          ],
          { cancelable: true, onDismiss: () => resolve(false) }
        );
      });
      if (!result) return;
      confirmed = true;
    }
    
    if (confirmed) {
      try {
        useAuthStore.setState({ user: null, authProvider: 'guest' });
        await signOutStore();
        await loadData();
      } catch (error) {
        console.error('[Profile] 로그아웃 오류:', error);
        useAuthStore.setState({ user: null, authProvider: 'guest' });
        await loadData();
      }
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const isGuest = !user || authProvider === 'guest';
  const userName = isGuest ? '게스트' : (user?.name || '게스트');
  const userInitial = userName[0] || '?';

  // Guest Mode UI
  if (isGuest) {
    return (
      <PageContainer scrollable style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 정보</Text>
        </View>

        <Spacer height={spacing.lg} />

        <Card variant="elevated" style={styles.guestCard}>
          <GradientView 
            colors={['#8E8E93', '#6A6F80']}
            style={styles.guestAvatar}
          >
            <MaterialCommunityIcons name="account" size={40} color="#FFFFFF" />
          </GradientView>
          <Text style={styles.guestTitle}>게스트 모드</Text>
          <Text style={styles.guestSubtitle}>
            로그인하고 더 많은 기능을 사용해보세요
          </Text>
          
          <Spacer height={spacing.lg} />

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleLogin}
          >
            <MaterialCommunityIcons name="google" size={20} color="#0A0A0A" />
            <Text style={styles.googleButtonText}>Google로 로그인</Text>
          </TouchableOpacity>

          <Text style={styles.guestFooter}>로그인 없이 계속 둘러보기</Text>
        </Card>

        <Spacer height={spacing.lg} />

        <Card variant="elevated" style={styles.guestFeaturesCard}>
          <Text style={styles.guestFeaturesTitle}>로그인하면 이용 가능해요</Text>
          <Spacer height={spacing.md} />
          
          <View style={styles.guestFeatureItem}>
            <GradientView 
              colors={colors.gradientPrimary}
              style={styles.guestFeatureIcon}
            >
              <MaterialCommunityIcons name="trophy" size={16} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.guestFeatureText}>기록 저장 및 통계</Text>
          </View>
          
          <View style={styles.guestFeatureItem}>
            <GradientView 
              colors={colors.gradientOrange}
              style={styles.guestFeatureIcon}
            >
              <MaterialCommunityIcons name="account-group" size={16} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.guestFeatureText}>커뮤니티 참여</Text>
          </View>
          
          <View style={styles.guestFeatureItem}>
            <GradientView 
              colors={colors.gradientGreen}
              style={styles.guestFeatureIcon}
            >
              <MaterialCommunityIcons name="trending-up" size={16} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.guestFeatureText}>리더보드 순위</Text>
          </View>
        </Card>

        <Spacer height={spacing.xl} />
      </PageContainer>
    );
  }

  // Logged In UI
  return (
    <PageContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 정보</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialCommunityIcons name="cog" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <Spacer height={spacing.lg} />

      {/* Profile Card */}
      <GradientView 
        colors={colors.gradientPrimary}
        style={styles.profileCard}
      >
        <View style={styles.profileHeader}>
          <GradientView 
            colors={colors.gradientOrange}
            style={styles.profileAvatar}
          >
            <Text style={styles.profileAvatarText}>{userInitial}</Text>
          </GradientView>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileSubtitle}>러닝 152일째 🔥</Text>
          </View>
        </View>
        <View style={styles.profileFooter}>
          <MaterialCommunityIcons name="trophy" size={16} color="#FFFFFF" />
          <Text style={styles.profileLevel}>레벨 12 · 상위 15%</Text>
        </View>
      </GradientView>

      <Spacer height={spacing.lg} />

      {/* Stats */}
      <View>
        <Text style={styles.sectionTitle}>내 기록</Text>
        <Spacer height={spacing.sm} />
        
        <View style={styles.statsGrid}>
          <Card variant="elevated" style={styles.statCard}>
            <GradientView 
              colors={colors.gradientPrimary}
              style={styles.statIcon}
            >
              <MaterialCommunityIcons name="trending-up" size={20} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.statValue}>{formatDistance(stats.totalDistance)}</Text>
            <Text style={styles.statLabel}>총 거리</Text>
          </Card>

          <Card variant="elevated" style={styles.statCard}>
            <GradientView 
              colors={colors.gradientOrange}
              style={styles.statIcon}
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.statValue}>{formatTime(stats.totalTime)}</Text>
            <Text style={styles.statLabel}>총 시간</Text>
          </Card>

          <Card variant="elevated" style={styles.statCard}>
            <GradientView 
              colors={colors.gradientGreen}
              style={styles.statIcon}
            >
              <MaterialCommunityIcons name="target" size={20} color="#FFFFFF" />
            </GradientView>
            <Text style={styles.statValue}>{stats.goalProgress}%</Text>
            <Text style={styles.statLabel}>달성률</Text>
          </Card>
        </View>
      </View>

      <Spacer height={spacing.lg} />

      {/* Achievements */}
      <View>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="trophy" size={20} color={colors.textStrong} />
          <Text style={styles.sectionTitle}>달성 배지</Text>
        </View>
        <Spacer height={spacing.sm} />
        
        <View style={styles.achievementsGrid}>
          {rewards.map((achievement, index) => (
            <Card key={index} variant="elevated" style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
            </Card>
          ))}
        </View>
      </View>

      <Spacer height={spacing.lg} />

      {/* Settings */}
      <View>
        <Text style={styles.sectionTitle}>설정</Text>
        <Spacer height={spacing.sm} />
        
        <Card variant="elevated" style={styles.settingsCard}>
          {settings.map((setting, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.settingItem, index < settings.length - 1 && styles.settingItemBorder]}
            >
              <View style={styles.settingIconContainer}>
                <MaterialCommunityIcons name={setting.icon} size={20} color={colors.textLight} />
              </View>
              <Text style={styles.settingLabel}>{setting.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      <Spacer height={spacing.lg} />

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
        <MaterialCommunityIcons name="logout" size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 24,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: typography.h1.fontFamily,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.h2.fontFamily,
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: typography.body.fontFamily,
  },
  profileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profileLevel: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: typography.body.fontFamily,
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
    marginBottom: spacing.sm,
    fontFamily: typography.h2.fontFamily,
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
    fontSize: 18,
    color: colors.textStrong,
    fontWeight: '800',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.h1.fontFamily,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  achievementName: {
    fontSize: 14,
    color: colors.textStrong,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.body.fontFamily,
  },
  achievementDate: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
  settingsCard: {
    padding: spacing.xs / 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
  },
  settingItemBorder: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textStrong,
    fontWeight: '500',
    fontFamily: typography.body.fontFamily,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logoutButtonText: {
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '600',
    fontFamily: typography.body.fontFamily,
  },
  guestCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guestTitle: {
    fontSize: 24,
    color: colors.textStrong,
    fontWeight: '700',
    marginBottom: spacing.sm,
    fontFamily: typography.h2.fontFamily,
  },
  guestSubtitle: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: typography.body.fontFamily,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  googleButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: '600',
    fontFamily: typography.body.fontFamily,
  },
  guestFooter: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: typography.caption.fontFamily,
  },
  guestFeaturesCard: {
    padding: spacing.lg,
  },
  guestFeaturesTitle: {
    fontSize: 18,
    color: colors.textStrong,
    fontWeight: '600',
    marginBottom: spacing.md,
    fontFamily: typography.h2.fontFamily,
  },
  guestFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  guestFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestFeatureText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.body.fontFamily,
  },
});
