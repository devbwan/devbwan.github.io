import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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
} from './index';
import { useAuthStore } from '../auth';
import { getUserStats } from '../stats';
import { getUserRewards, saveReward } from '../profile';
import { RunMapView } from '../../components/MapView';
import { Button, StatNumber, MapPreview } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function RunActiveScreen({ route: courseRoute = null }) {
  const router = useRouter();
  const { granted, status, loading: permissionLoading } = useLocationPermission();
  const { start, pause, resume, stop } = useRunningTracker();
  const { isRunning, isPaused, distance, duration, pace, maxSpeed, route, startTime, cadence } = useRunStore();
  const [avgPace, setAvgPace] = useState(0);
  const [calories, setCalories] = useState(0);
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [initialLocation, setInitialLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const lastAnnouncedKm = useRef(0);

  useEffect(() => {
    if (isRunning && duration > 0 && distance > 0) {
      const avgPaceValue = Math.round((duration / distance) * 1000);
      setAvgPace(avgPaceValue);
      const cal = calculateCalories(distance, duration);
      setCalories(cal);
    } else if (!isRunning) {
      setAvgPace(0);
      setCalories(0);
      lastAnnouncedKm.current = 0;
    }
  }, [isRunning, distance, duration]);

  const calculateCalories = (distance, duration) => {
    const weight = 70;
    const speed = duration > 0 ? (distance / 1000) / (duration / 3600) : 0;
    let met = 6;
    if (speed < 6) met = 8;
    else if (speed < 8) met = 9.5;
    else if (speed < 10) met = 11.5;
    else met = 14.5;
    return Math.round((weight * met * duration) / 3600);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}`;
    return `${(meters / 1000).toFixed(2)}`;
  };

  const formatPace = (secPerKm) => {
    if (!secPerKm || secPerKm === 0) return '--:--';
    const mins = Math.floor(secPerKm / 60);
    const secs = Math.round(secPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      const caloriesValue = calculateCalories(distance, duration);
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>위치 권한을 확인하는 중...</Text>
      </View>
    );
  }

  if (granted === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          GPS 권한이 필요합니다.{'\n'}
          설정에서 위치 권한을 허용해주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Preview */}
      <View style={styles.mapContainer}>
        <RunMapView 
          route={isRunning ? route : (courseRoute || [])} 
          currentLocation={isRunning ? route[route.length - 1] : null}
          initialLocation={initialLocation}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatNumber
            value={formatDistance(distance)}
            label="거리"
            unit={distance >= 1000 ? 'km' : 'm'}
          />
          <StatNumber
            value={formatTime(duration)}
            label="시간"
          />
          <StatNumber
            value={formatPace(pace)}
            label="페이스"
          />
        </View>
        {isRunning && (
          <View style={styles.statsRow}>
            <StatNumber
              value={formatPace(avgPace)}
              label="평균 페이스"
            />
            <StatNumber
              value={calories}
              label="칼로리"
              unit="kcal"
            />
            <StatNumber
              value={cadence || '--'}
              label="케이던스"
              unit="spm"
            />
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {!isRunning && !isPaused ? (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={start}
            disabled={saving}
          >
            시작
          </Button>
        ) : (
          <View style={styles.runningControls}>
            {isPaused ? (
              <Button
                variant="secondary"
                size="large"
                style={styles.controlButton}
                onPress={resume}
              >
                재개
              </Button>
            ) : (
              <Button
                variant="outline"
                size="large"
                style={styles.controlButton}
                onPress={pause}
              >
                일시정지
              </Button>
            )}
            <Button
              variant="primary"
              size="large"
              style={styles.controlButton}
              onPress={handleStop}
              disabled={saving}
              loading={saving}
            >
              {saving ? '저장 중...' : '종료'}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  statsContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  controlsContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  runningControls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  controlButton: {
    flex: 1,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
});

