import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RunMapView } from '@/components/MapView';
import { Icon } from '@/components/ui';
import { colors, spacing, radius, typography, shadows, gradients } from '@/theme/tokens';
import { useRunSession } from '@/contexts/RunSessionContext'; // ✅ 추가 :contentReference[oaicite:3]{index=3}

export default function RunActiveScreen() {
  const router = useRouter();
  const {
    status,
    elapsedTime,
    distance,
    pace,
    calories,
    route,
    currentLocation,
    initialLocation,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
  } = useRunSession();

  const runningState = status === 'running';
  const pausedState = status === 'paused';
  const shouldShowTopBar = runningState || pausedState;

  // 시간 포맷팅 함수 (기존 로직 재사용)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const formatPace = () => {
    if (pace === 0 || distance === 0) return '0:00';
    const paceMinutes = pace / 60; // pace는 초/km
    const mins = Math.floor(paceMinutes);
    const secs = Math.floor((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    stopRun();
    router.push('/run-summary'); // 요약 화면 라우트 경로에 맞게 수정
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      {shouldShowTopBar && (
        <SafeAreaView edges={['top']} style={styles.topBar}>
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.topBarContent}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => router.back()}
            >
              <Icon name="chevron-down" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.runningIndicator}>
              <View
                style={[
                  styles.runningDot,
                  pausedState && styles.runningDotPaused,
                ]}
              />
              <Text style={styles.runningText}>
                {status === 'running'
                  ? '러닝 중'
                  : status === 'paused'
                  ? '일시정지'
                  : '대기'}
              </Text>
            </View>
            <TouchableOpacity style={styles.topBarButton}>
              <Icon name="lock" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        <RunMapView
          route={route}
          currentLocation={currentLocation}
          initialLocation={
            initialLocation || { lat: 37.5665, lng: 126.978 } // 기본값
          }
        />
        {shouldShowTopBar && (
          <View style={styles.routeInfoOverlay}>
            <View style={styles.routeInfoContent}>
              <View style={styles.routeInfoLeft}>
                <Text style={styles.routeInfoLabel}>현재 위치</Text>
                <Text style={styles.routeInfoValue}>서울시 강남구</Text>
              </View>
              <TouchableOpacity style={styles.volumeButton}>
                <Icon name="volume-2" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Stats 영역 */}
      {status === 'idle' ? (
        // ⏸ 대기 상태
        <View style={styles.waitingContainer}>
          <View style={styles.waitingContent}>
            <View style={styles.waitingIconContainer}>
              <Icon name="zap" size={48} color={colors.primary.light} />
            </View>
            <Text style={styles.waitingTitle}>러닝을 시작하세요</Text>
            <Text style={styles.waitingSubtitle}>
              하단 버튼을 눌러 러닝을 시작할 수 있습니다
            </Text>
          </View>
        </View>
      ) : (
        // ▶ 진행/일시정지 상태
        <ScrollView
          style={styles.statsSection}
          contentContainerStyle={styles.statsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.primaryStat}>
            <Text style={styles.primaryStatLabel}>경과 시간</Text>
            <Text style={styles.primaryStatValue}>{formatTime(elapsedTime)}</Text>
          </View>

          <View style={styles.secondaryStatsGrid}>
            <View style={styles.secondaryStatCard}>
              <Text style={styles.secondaryStatLabel}>거리</Text>
              <Text style={styles.secondaryStatValue}>
                {distance.toFixed(2)}
              </Text>
              <Text style={styles.secondaryStatUnit}>km</Text>
            </View>

            <View style={styles.secondaryStatCard}>
              <Text style={styles.secondaryStatLabel}>평균 페이스</Text>
              <Text style={styles.secondaryStatValue}>{formatPace()}</Text>
              <Text style={styles.secondaryStatUnit}>/km</Text>
            </View>
          </View>

          <View style={styles.additionalStatsCard}>
            <View style={styles.additionalStatsGrid}>
              <View style={styles.additionalStatItem}>
                <Text style={styles.additionalStatLabel}>칼로리</Text>
                <Text style={styles.additionalStatValue}>{calories}</Text>
              </View>
              {/* BPM, 고도 등은 mock 값 유지 또는 Context로 이동 가능 */}
            </View>
          </View>
        </ScrollView>
      )}

      {/* 하단 버튼 */}
      <SafeAreaView edges={['bottom']} style={styles.controlButtons}>
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.controlButtonsContent}>
          {/* Start / Pause / Resume */}
          {status === 'idle' ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startRun}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startButtonGradient}
              >
                <Icon name="play" size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>러닝 시작</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={status === 'running' ? pauseRun : resumeRun}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={
                  status === 'paused'
                    ? ['#4CAF50', '#66BB6A']
                    : ['#FFD700', '#FFA500']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pauseButtonGradient}
              >
                <Icon
                  name={status === 'paused' ? 'play' : 'pause'}
                  size={24}
                  color="#0A0A0A"
                />
                <Text style={styles.pauseButtonText}>
                  {status === 'paused' ? '재개' : '일시정지'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Stop 버튼 */}
          {status !== 'idle' && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStop}
              activeOpacity={0.7}
            >
              <Icon name="square" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  runningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  runningDotPaused: {
    backgroundColor: colors.warning,
  },
  runningDotWaiting: {
    backgroundColor: colors.gray[300],
  },
  runningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mapContainer: {
    width: '100%',
    height: '45%',
    backgroundColor: colors.card,
  },
  routeInfoOverlay: {
    position: 'absolute',
    top: 80,
    left: spacing.md,
    right: spacing.md,
  },
  routeInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  routeInfoLeft: {
    flex: 1,
  },
  routeInfoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xs / 2,
  },
  routeInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  volumeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flex: 1,
  },
  statsContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  primaryStat: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  primaryStatLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  primaryStatValue: {
    fontSize: 64,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.02,
    lineHeight: 64,
  },
  secondaryStatsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  secondaryStatCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    ...shadows.card,
  },
  secondaryStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  secondaryStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01,
    marginBottom: spacing.xs / 2,
  },
  secondaryStatUnit: {
    fontSize: 13,
    color: colors.gray[300],
  },
  additionalStatsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  additionalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  additionalStatItem: {
    alignItems: 'center',
  },
  additionalStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xs / 2,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlButtons: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  controlButtonsContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pauseButton: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.fab,
  },
  pauseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  pauseButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: -0.01,
  },
  startButton: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.fab,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01,
  },
  stopButton: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  waitingContent: {
    alignItems: 'center',
  },
  waitingIconContainer: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: `${colors.primary.light}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textStrong,
    marginBottom: spacing.sm,
    letterSpacing: -0.01,
  },
  waitingSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
