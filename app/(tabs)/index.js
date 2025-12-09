import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/features/auth';
import { getTodayStats } from '../../src/features/stats';
import { PageContainer, Card, Spacer, GradientView, Avatar } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [todayStats, setTodayStats] = useState({
    runs: 1,
    distance: 5410,
    duration: 1935,
    avgPace: 357,
  });
  const [weeklyGoal, setWeeklyGoal] = useState({
    current: 17,
    target: 25,
    percentage: 68,
  });
  const [communityFeed, setCommunityFeed] = useState([
    { id: 1, name: '민지', distance: 3.1, time: '1시간 전', avatarColor: colors.gradientOrange },
    { id: 2, name: '현우', distance: 4.9, time: '2시간 전', avatarColor: colors.gradientGreen },
    { id: 3, name: 'John', distance: 2.0, time: '3시간 전', avatarColor: colors.gradientPurple },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const today = await getTodayStats(user?.id || null);
      setTodayStats(today);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const formatDistance = (meters) => {
    if (!meters || meters < 1000) return `${Math.round(meters || 0)}m`;
    return `${((meters || 0) / 1000).toFixed(2)}km`;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secPerKm) => {
    if (!secPerKm || secPerKm === 0) return "--'--\"";
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.round(secPerKm % 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  return (
    <PageContainer scrollable style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <GradientView 
            colors={colors.gradientPrimary}
            style={styles.logoContainer}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FFFFFF" />
          </GradientView>
          <Text style={styles.logoText}>RunWave</Text>
        </View>
        <GradientView 
          colors={colors.gradientOrange}
          style={styles.profileAvatar}
        />
      </View>

      <Spacer height={spacing.xl} />

      {/* Hero Card with Today's Run */}
      <TouchableOpacity 
        activeOpacity={0.9}
        style={styles.heroCard}
        onPress={() => router.push('/(tabs)/run')}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1717406362477-8555b1190a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwdHJhY2slMjBzdW5zZXR8ZW58MXx8fHwxNzY1MTc4MzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          locations={[0, 0.5, 1]}
          style={styles.heroOverlay}
        />
        <View style={styles.heroContent}>
          <View style={styles.heroHeader}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#FFFFFF" />
            <Text style={styles.heroLabel}>오늘의 러닝</Text>
          </View>
          <View style={styles.heroStats}>
            <Text style={styles.heroDistance}>{formatDistance(todayStats.distance)}</Text>
            <Text style={styles.heroStatus}>완료</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Spacer height={spacing.xl} />

      {/* Today's Stats Section */}
      <View>
        <Text style={styles.sectionTitle}>오늘의 기록</Text>
        <Spacer height={spacing.md} />
        
        <View style={styles.statsGrid}>
          {/* Time Card */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <GradientView 
                colors={colors.gradientOrange}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons name="clock-outline" size={16} color="#FFFFFF" />
              </GradientView>
              <Text style={styles.statLabel}>시간</Text>
            </View>
            <Text style={styles.statValue}>{formatTime(todayStats.duration)}</Text>
          </View>

          {/* Pace Card */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <GradientView 
                colors={colors.gradientPrimary}
                style={styles.statIcon}
              >
                <MaterialCommunityIcons name="speedometer" size={16} color="#FFFFFF" />
              </GradientView>
              <Text style={styles.statLabel}>평균 페이스</Text>
            </View>
            <Text style={styles.statValue}>{formatPace(todayStats.avgPace)}</Text>
          </View>
        </View>

        {/* Weekly Goal Progress */}
        <Spacer height={spacing.md} />
        <GradientView 
          colors={colors.gradientPrimary}
          style={styles.goalCard}
        >
          <View style={styles.goalHeader}>
            <View style={styles.goalHeaderLeft}>
              <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
              <Text style={styles.goalTitle}>주간 목표</Text>
            </View>
            <Text style={styles.goalPercentage}>{weeklyGoal.percentage}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${weeklyGoal.percentage}%` }]} />
          </View>
          
          <View style={styles.goalFooter}>
            <Text style={styles.goalText}>{weeklyGoal.current}km / {weeklyGoal.target}km</Text>
            <Text style={styles.goalText}>{weeklyGoal.target - weeklyGoal.current}km 남음</Text>
          </View>
        </GradientView>
      </View>

      <Spacer height={spacing.xl} />

      {/* Community Activity Section */}
      <View>
        <View style={styles.communityHeader}>
          <Text style={styles.sectionTitle}>커뮤니티 활동</Text>
          <MaterialCommunityIcons name="trending-up" size={20} color={colors.primary} />
        </View>
        <Spacer height={spacing.md} />
        
        <View style={styles.communityCard}>
          {communityFeed.map((item, index) => (
            <View key={item.id} style={[styles.feedItem, index < communityFeed.length - 1 && styles.feedItemBorder]}>
              <GradientView 
                colors={item.avatarColor}
                style={styles.feedAvatar}
              >
                <Text style={styles.feedAvatarText}>{item.name[0]}</Text>
              </GradientView>
              <View style={styles.feedContent}>
                <Text style={styles.feedName}>{item.name}</Text>
                <Text style={styles.feedDetail}>{item.distance}km 러닝 완료</Text>
              </View>
              <Text style={styles.feedTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      <Spacer height={spacing.xl} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background, // #0A0A0A
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2 = 8px
  },
  logoContainer: {
    width: 32, // w-8 = 32px
    height: 32, // h-8 = 32px
    borderRadius: 8, // rounded-lg = 8px
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    color: colors.textStrong, // #FFFFFF
    fontFamily: typography.h1.fontFamily,
    fontWeight: '800',
    letterSpacing: -0.02,
  },
  profileAvatar: {
    width: 40, // w-10 = 40px
    height: 40, // h-10 = 40px
    borderRadius: 20, // rounded-full
  },
  heroCard: {
    width: '100%',
    height: 180, // h-[180px]
    borderRadius: 24, // rounded-[24px]
    overflow: 'hidden',
    backgroundColor: colors.primary,
    // Shadow: 0 12px 32px rgba(10, 132, 255, 0.3)
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.md, // bottom-5 = 20px
    left: spacing.md, // left-5 = 20px
    right: spacing.md, // right-5 = 20px
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
    marginBottom: spacing.xs, // mb-2 = 8px
  },
  heroLabel: {
    fontSize: 14, // text-[14px]
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: typography.body.fontFamily,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs, // gap-2 = 8px
  },
  heroDistance: {
    fontSize: 28, // text-[28px]
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.01,
    fontFamily: typography.h1.fontFamily,
  },
  heroStatus: {
    fontSize: 14, // text-[14px]
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    fontFamily: typography.body.fontFamily,
  },
  sectionTitle: {
    fontSize: 20, // text-[20px]
    color: colors.textStrong, // #FFFFFF
    fontWeight: '600',
    letterSpacing: -0.01,
    fontFamily: typography.h2.fontFamily,
    marginBottom: spacing.sm, // mb-3 = 12px
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm, // gap-3 = 12px
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card, // #1C1C1E
    borderRadius: 20, // rounded-[20px]
    padding: spacing.md, // p-4 = 16px
    borderWidth: 1,
    borderColor: colors.cardBorder, // #2C2C2E
    // Shadow: 0 4px 16px rgba(0, 0, 0, 0.3)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
    marginBottom: spacing.xs, // mb-2 = 8px
  },
  statIcon: {
    width: 32, // w-8 = 32px
    height: 32, // h-8 = 32px
    borderRadius: 16, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13, // text-[13px]
    color: colors.textLight, // #8E8E93
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  statValue: {
    fontSize: 26, // text-[26px]
    color: colors.textStrong, // #FFFFFF
    fontWeight: '800',
    letterSpacing: -0.01,
    fontFamily: typography.h1.fontFamily,
  },
  goalCard: {
    borderRadius: 20, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    // Shadow: 0 8px 24px rgba(10, 132, 255, 0.4)
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md, // mb-3 = 12px
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs, // gap-2 = 8px
  },
  goalTitle: {
    fontSize: 15, // text-[15px]
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: typography.body.fontFamily,
  },
  goalPercentage: {
    fontSize: 15, // text-[15px]
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: typography.body.fontFamily,
  },
  progressBar: {
    width: '100%',
    height: 8, // h-2 = 8px
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    borderRadius: 4, // rounded-full
    overflow: 'hidden',
    marginBottom: spacing.sm, // mt-2 = 8px
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs, // mt-2 = 8px
  },
  goalText: {
    fontSize: 12, // text-[12px]
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    fontFamily: typography.caption.fontFamily,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md, // mb-3 = 12px
  },
  communityCard: {
    backgroundColor: colors.card, // #1C1C1E
    borderRadius: 20, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    borderWidth: 1,
    borderColor: colors.cardBorder, // #2C2C2E
    // Shadow: 0 4px 16px rgba(0, 0, 0, 0.3)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md, // gap-3 = 12px
    paddingVertical: spacing.md, // py-4 = 16px (간격 조정)
  },
  feedItemBorder: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  feedAvatar: {
    width: 40, // w-10 = 40px
    height: 40, // h-10 = 40px
    borderRadius: 20, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: typography.body.fontFamily,
  },
  feedContent: {
    flex: 1,
  },
  feedName: {
    fontSize: 15, // text-[15px]
    color: colors.textStrong, // #FFFFFF
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
    fontFamily: typography.body.fontFamily,
  },
  feedDetail: {
    fontSize: 13, // text-[13px]
    color: colors.textLight, // #8E8E93
    fontFamily: typography.caption.fontFamily,
  },
  feedTime: {
    fontSize: 12, // text-[12px]
    color: colors.primary, // #0A84FF
    fontWeight: '600',
    fontFamily: typography.caption.fontFamily,
  },
});
