import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, CircleIcon } from '@/components/ui';
import { colors, spacing, shadows, radius, typography, gradients } from '@/theme/tokens';
import { useRunSession } from '@/contexts/RunSessionContext'; // ✅ 추가 :contentReference[oaicite:2]{index=2}

export default function RunStartScreen() {
  const router = useRouter();
  const { resetRun, startRun } = useRunSession();

  const goals = [
    { id: 'distance', label: '거리 목표', value: '5.0 km', iconName: 'target', iconColor: [colors.primary.light, colors.primary.dark] as [string, string] },
    { id: 'time', label: '시간 목표', value: '30분', iconName: 'clock', iconColor: [colors.danger.light, colors.danger.dark] as [string, string] },
    { id: 'free', label: '자유 러닝', value: '목표 없이', iconName: 'infinity', iconColor: [colors.success.light, colors.success.dark] as [string, string] },
  ];

  const settings = [
    { label: '음악', value: 'Spotify 재생목록', iconName: 'headphones' },
    { label: '음성 코칭', value: '1km마다', iconName: 'message-circle' },
  ];

  const handleStartRunning = () => {
    resetRun(); // 상태 초기화
    router.push('/(tabs)/run?autoStart=true');
    // RunActiveScreen에서 사용자가 "러닝 시작" 버튼을 눌러야 startRun()이 호출됨
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹ 취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>러닝 준비</Text>
        <Text style={styles.headerSubtitle}>목표를 설정하고 러닝을 시작하세요</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 목표</Text>
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                activeOpacity={0.8}
              >
                <CircleIcon from={goal.iconColor[0]} to={goal.iconColor[1]} size={48}>
                  <Icon name={goal.iconName} size={24} color="#FFFFFF" />
                </CircleIcon>
                <View style={styles.goalContent}>
                  <Text style={styles.goalLabel}>{goal.label}</Text>
                  <Text style={styles.goalValue}>{goal.value}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.gray[300]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>러닝 설정</Text>
          <View style={styles.settingsCard}>
            {settings.map((setting, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  index < settings.length - 1 && styles.settingItemBorder,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.settingIconContainer}>
                  <Icon name={setting.iconName} size={20} color={colors.textLight} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingValue}>{setting.value}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.gray[300]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats Preview */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>지난 러닝 평균</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5.2km</Text>
              <Text style={styles.statUnit}>거리</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>31:24</Text>
              <Text style={styles.statUnit}>시간</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6'02"</Text>
              <Text style={styles.statUnit}>페이스</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomButtonContainer}>
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartRunning}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <View style={styles.startButtonIconContainer}>
              <Icon name="play" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.startButtonText}>러닝 시작하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.light,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textStrong,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 200, // Bottom button space
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textStrong,
    letterSpacing: -0.01,
    marginBottom: spacing.md,
  },
  goalsList: {
    gap: 12, // gap-3 = 12px
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: spacing.md, // gap-4 = 16px
    ...shadows.card,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textStrong,
    marginBottom: spacing.xs / 2,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg, // rounded-[20px]
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    ...shadows.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg, // p-5 = 20px
    gap: spacing.md, // gap-4 = 16px
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textStrong,
    marginBottom: spacing.xs / 2,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg, // rounded-[20px]
    padding: spacing.lg, // p-5 = 20px
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  statsLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 12, // mb-3 = 12px
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md, // gap-4 = 16px
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textStrong,
    marginBottom: spacing.xs / 2,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray[300],
  },
  bottomButtonContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  startButton: {
    borderRadius: radius.lg, // rounded-[20px]
    overflow: 'hidden',
    ...shadows.fab,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg, // py-5 = 20px
    gap: spacing.sm, // gap-3 = 12px
  },
  startButtonIconContainer: {
    width: 56, // w-14 = 56px
    height: 56, // h-14 = 56px
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01,
  },
});
