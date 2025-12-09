import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { 
  useLocationPermission, 
  useRunningTracker, 
  useRunStore,
  saveRunningSession,
  syncRunningSession,
  saveRunningSessionToHealth,
  checkRewards
} from '../../src/features/run';
import { useAuthStore } from '../../src/features/auth';
import { getUserStats } from '../../src/features/stats';
import { getUserRewards, saveReward } from '../../src/features/profile';
import { getTodayStats } from '../../src/features/stats';
import { RunMapView } from '../../src/components/MapView';
import { PageContainer, Button, Card, Spacer, StatNumber, MapPreview } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';

export default function RunScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { granted, status, loading: permissionLoading } = useLocationPermission();
  const { start, pause, resume, stop } = useRunningTracker();
  const { isRunning, isPaused, distance, duration, pace, maxSpeed, route, startTime, cadence } = useRunStore();
  const [avgPace, setAvgPace] = useState(0);
  const [calories, setCalories] = useState(0);
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [lastRunStats, setLastRunStats] = useState(null);
  const [initialLocation, setInitialLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const lastAnnouncedKm = useRef(0);

  useFocusEffect(
    React.useCallback(() => {
      loadLastRun();
      if (granted && permissionLoading === false) {
        getCurrentLocation();
      }
    }, [granted, permissionLoading])
  );

  const loadLastRun = async () => {
    try {
      const stats = await getTodayStats(user?.id || null);
      if (stats.runs > 0) {
        setLastRunStats(stats);
      }
    } catch (error) {
      console.error('마지막 러닝 로드 실패:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000,
      });
      setInitialLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error('[Run] 현재 위치 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    if (isRunning && duration > 0 && distance > 0) {
      const avgPaceValue = Math.round((duration / distance) * 1000);
      setAvgPace(avgPaceValue);
      const weight = 70;
      const speed = duration > 0 ? (distance / 1000) / (duration / 3600) : 0;
      let met = 6;
      if (speed < 6) met = 8;
      else if (speed < 8) met = 9.5;
      else if (speed < 10) met = 11.5;
      else met = 14.5;
      setCalories(Math.round((weight * met * duration) / 3600));
    }
  }, [isRunning, distance, duration]);

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}`;
    return `${(meters / 1000).toFixed(2)}`;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (secPerKm) => {
    if (!secPerKm || secPerKm === 0) return '--:--';
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.round(secPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleStop = async () => {
    if (saving) return;
    
    if (distance < 50) {
      const result = await new Promise((resolve) => {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
          resolve(window.confirm('거리가 50m 미만입니다. 종료하시겠습니까?'));
        } else {
          Alert.alert('러닝 종료', '거리가 50m 미만입니다.', [
            { text: '취소', onPress: () => resolve(false) },
            { text: '확인', onPress: () => resolve(true) },
          ]);
        }
      });
      if (result) {
        stop();
        useRunStore.getState().reset();
      }
      return;
    }

    const saveResult = await new Promise((resolve) => {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
        resolve(window.confirm('러닝을 종료하고 저장하시겠습니까?') ? 'save' : 'discard');
      } else {
        Alert.alert('러닝 종료', '저장하시겠습니까?', [
          { text: '저장 안 함', onPress: () => resolve('discard') },
          { text: '저장', onPress: () => resolve('save') },
          { text: '취소', style: 'cancel', onPress: () => resolve('cancel') },
        ]);
      }
    });

    if (saveResult === 'cancel') return;
    if (saveResult === 'discard') {
      stop();
      useRunStore.getState().reset();
      return;
    }

    setSaving(true);
    try {
      const endTime = Date.now();
      const caloriesValue = calories;
      const finalAvgPace = avgPace > 0 ? avgPace : (pace > 0 ? pace : null);

      await saveRunningSession(
        {
          userId: user?.id || null,
          type: 'solo',
          distance,
          duration,
          avgPace: finalAvgPace,
          maxSpeed: maxSpeed > 0 ? maxSpeed : null,
          calories: caloriesValue,
          cadence: cadence > 0 ? cadence : null,
          startTime: Math.floor(startTime / 1000),
          endTime: Math.floor(endTime / 1000),
        },
        route
      );

      if (user?.id) {
        try {
          await syncRunningSession(
            {
              userId: user.id,
              type: 'solo',
              distance,
              duration,
              avgPace: finalAvgPace,
              maxSpeed: maxSpeed > 0 ? maxSpeed : null,
              calories: caloriesValue,
              cadence: cadence > 0 ? cadence : null,
              startTime: Math.floor(startTime / 1000),
              endTime: Math.floor(endTime / 1000),
            },
            route
          );
        } catch (syncError) {
          console.warn('클라우드 동기화 실패:', syncError);
        }
      }

      stop();
      useRunStore.getState().reset();
      router.push('/(tabs)/records');
    } catch (error) {
      console.error('저장 실패:', error);
      Alert.alert('저장 실패', error.message || '알 수 없는 오류');
    } finally {
      setSaving(false);
    }
  };

  if (permissionLoading) {
    return (
      <PageContainer>
        <Text style={styles.loadingText}>위치 권한을 확인하는 중...</Text>
      </PageContainer>
    );
  }

  if (granted === false) {
    return (
      <PageContainer>
        <Text style={styles.errorText}>
          GPS 권한이 필요합니다.{'\n'}
          설정에서 위치 권한을 허용해주세요.
        </Text>
      </PageContainer>
    );
  }

  // RunStartScreen Layout
  if (!isRunning && !isPaused) {
    return (
      <PageContainer>
        {lastRunStats && (
          <>
            <Card>
              <View style={styles.lastRunStats}>
                <StatNumber value={formatDistance(lastRunStats.distance)} label="거리" />
                <StatNumber value={formatTime(lastRunStats.duration)} label="시간" />
              </View>
            </Card>
            <Spacer height={spacing.lg} />
          </>
        )}
        <Button fullWidth onPress={handleStart} disabled={saving}>
          Start Running
        </Button>
      </PageContainer>
    );
  }

  // RunActiveScreen Layout
  return (
    <View style={styles.activeContainer}>
      {/* Map Preview - full screen background */}
      <View style={styles.mapContainer}>
        <RunMapView 
          route={isRunning ? route : []} 
          currentLocation={isRunning && route.length > 0 ? route[route.length - 1] : null}
          initialLocation={initialLocation}
        />
      </View>

      {/* Stats and Controls - bottom overlay */}
      <View style={styles.statsOverlay}>
        <StatNumber value={formatTime(duration)} label="Time" />
        <Spacer height={spacing.md} />
        <StatNumber value={formatDistance(distance)} label="Distance" />
        <Spacer height={spacing.md} />
        <StatNumber value={formatPace(pace)} label="Pace" />

        <Spacer height={spacing.xl} />

        {isPaused ? (
          <Button onPress={handleResume} disabled={saving}>
            Resume
          </Button>
        ) : (
          <Button onPress={handlePause} disabled={saving}>
            Pause
          </Button>
        )}

        <Spacer height={spacing.md} />

        <Button onPress={handleStop} disabled={saving} loading={saving}>
          End
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.md,
    paddingTop: spacing.lg,
    maxHeight: '60%',
    zIndex: 1,
  },
  lastRunStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loadingText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: typography.body.fontFamily,
  },
  errorText: {
    ...typography.body,
    color: colors.textStrong,
    textAlign: 'center',
    fontFamily: typography.body.fontFamily,
  },
});
