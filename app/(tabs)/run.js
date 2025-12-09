import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { getTodayStats } from '../../src/features/stats';
import { RunMapView } from '../../src/components/MapView';
import { PageContainer, Button, Card, Spacer, StatNumber } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

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
  const autoStartTriggered = useRef(false);
  const lastRunLoaded = useRef(false);
  const redirectTriggered = useRef(false);
  const locationLoaded = useRef(false);

  const loadLastRun = React.useCallback(async () => {
    // 이미 로드했거나 러닝 중이면 다시 로드하지 않음
    if (lastRunLoaded.current || isRunning) {
      return;
    }
    
    try {
      const stats = await getTodayStats(user?.id || null);
      if (stats.runs > 0) {
        setLastRunStats(stats);
      }
      lastRunLoaded.current = true;
    } catch (error) {
      console.error('마지막 러닝 로드 실패:', error);
    }
  }, [user?.id, isRunning]);

  // 모든 초기화 로직을 하나의 useFocusEffect로 통합
  useFocusEffect(
    React.useCallback(() => {
      // 리다이렉트 처리 (한 번만 실행)
      if (params.autoStart !== 'true' && !isRunning && !isPaused && !redirectTriggered.current) {
        redirectTriggered.current = true;
        router.replace('/run-start');
        return; // 리다이렉트 후에는 다른 로직 실행하지 않음
      }

      // 리다이렉트가 필요한 경우가 아니면 나머지 로직 실행
      if (params.autoStart === 'true' || isRunning || isPaused) {
        // 마지막 러닝 로드 (한 번만 실행)
        if (!isRunning && !isPaused && !lastRunLoaded.current) {
          loadLastRun();
        }

        // 위치 권한 처리 (한 번만 실행)
        if (granted && permissionLoading === false && !locationLoaded.current) {
          getCurrentLocation();
        }
        
        // autoStart 파라미터가 있고 아직 시작하지 않았으면 자동 시작
        if (params.autoStart === 'true' && !autoStartTriggered.current && granted && !isRunning && !isPaused) {
          autoStartTriggered.current = true;
          setTimeout(() => {
            if (granted && !isRunning && !isPaused) {
              start();
            }
          }, 500);
        }
      }
    }, [params.autoStart, isRunning, isPaused, granted, permissionLoading, loadLastRun, start, getCurrentLocation])
  );

  const getCurrentLocation = React.useCallback(async () => {
    // 이미 로드했으면 다시 로드하지 않음
    if (locationLoaded.current) {
      return;
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000,
      });
      setInitialLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      locationLoaded.current = true;
    } catch (error) {
      console.error('[Run] 현재 위치 가져오기 실패:', error);
    }
  }, []);

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
    const LoadingScreen = require('../../src/screens/LoadingScreen').default;
    return <LoadingScreen />;
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

  // RunStartScreen Layout - autoStart 파라미터가 없으면 러닝 준비 페이지로 리다이렉트 (useFocusEffect에서 처리)
  // 러닝 중이 아니고 일시정지도 아닐 때만 준비 화면 표시
  if (!isRunning && !isPaused) {
    // autoStart 파라미터가 있지만 아직 시작되지 않은 경우 (권한 대기 등)
    if (params.autoStart === 'true') {
      const LoadingScreen = require('../../src/screens/LoadingScreen').default;
      return <LoadingScreen />;
    }
    // autoStart 파라미터가 없으면 리다이렉트 중 (useFocusEffect에서 처리)
    return null;
  }

  // autoStart 파라미터가 있거나 러닝 중이거나 일시정지 상태일 때 RunActiveScreen 표시
  // RunActiveScreen은 이제 useRunSession을 사용하므로 props 전달 불필요
  if (params.autoStart === 'true' || isRunning || isPaused) {
    const RunActiveScreen = require('../../src/screens/RunActiveScreen').default;
    return <RunActiveScreen />;
  }
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
