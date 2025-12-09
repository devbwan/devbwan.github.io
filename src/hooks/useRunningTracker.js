import { useEffect, useRef, useMemo, useCallback } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '../stores/runStore';
import { isValidLocation, calculateDistance, calculatePace, convertSpeedToKmh } from '../core/gpsUtils';
import { LocationBuffer } from '../core/locationFilter';

export function useRunningTracker() {
  const { isRunning, start, pause, resume, stop, addPoint, addDistance, setDuration, setPace, setMaxSpeed, distance, duration } = useRunStore();
  const watchSubscriptionRef = useRef(null);
  const timerRef = useRef(null);
  const lastLocationRef = useRef(null);
  const startTimeRef = useRef(null);
  const locationBufferRef = useRef(new LocationBuffer(2000)); // 2초 간격

  useEffect(() => {
    if (isRunning) {
      // 타이머 시작
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setDuration(elapsed);
          
          // 페이스 계산 (메모이제이션된 함수 사용)
          const currentDistance = useRunStore.getState().distance;
          if (currentDistance > 0) {
            const pace = calculatePace(elapsed, currentDistance);
            setPace(pace);
          }
        }
      }, 1000);

      // 위치 추적 시작
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('위치 권한이 허용되지 않았습니다.');
          return;
        }

        watchSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // 1초마다 업데이트 (고정 간격 기록을 위해)
            distanceInterval: 0, // 거리 기반 업데이트 비활성화 (시간 기반만 사용)
          },
          (location) => {
            // 위치 데이터 품질 필터링
            if (!isValidLocation(location)) {
              if (__DEV__) {
                console.warn('[RunTracker] 유효하지 않은 위치 데이터 무시');
              }
              return;
            }

            const { latitude, longitude, speed, accuracy } = location.coords;

            // 고정 간격 기록 (2초)
            const formattedLocation = locationBufferRef.current.addLocation(location);
            if (!formattedLocation) {
              // 아직 기록할 시간이 안 됨
              return;
            }

            // 위치 포인트 추가
            const point = {
              lat: formattedLocation.lat,
              lng: formattedLocation.lng,
              timestamp: formattedLocation.timestamp,
              accuracy: formattedLocation.accuracy,
            };
            addPoint(point);

            // 속도 업데이트 (m/s를 km/h로 변환, 메모이제이션된 함수 사용)
            if (speed && speed > 0) {
              const speedKmh = convertSpeedToKmh(speed);
              setMaxSpeed(speedKmh);
            }

            // 거리 계산 (이전 위치가 있을 때, 메모이제이션된 함수 사용)
            if (lastLocationRef.current) {
              const distanceDelta = calculateDistance(
                lastLocationRef.current.lat,
                lastLocationRef.current.lng,
                formattedLocation.lat,
                formattedLocation.lng
              );
              
              // 거리 델타가 합리적인 범위인지 확인 (예: 100m 이하)
              // GPS 오류로 인한 급격한 위치 변화 방지
              if (distanceDelta < 100) {
                addDistance(distanceDelta);
              } else if (__DEV__) {
                console.warn('[RunTracker] 비정상적인 거리 변화 감지, 무시:', distanceDelta, 'm');
              }
            }

            lastLocationRef.current = { 
              lat: formattedLocation.lat, 
              lng: formattedLocation.lng 
            };
          }
        );
      })();
    } else {
      // 정지 시 정리
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (!isRunning) {
        // 완전히 종료된 경우만 시간 초기화
        lastLocationRef.current = null;
        startTimeRef.current = null;
        locationBufferRef.current.reset();
      }
    }

    return () => {
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  return {
    start: () => {
      startTimeRef.current = null;
      locationBufferRef.current.reset();
      start();
    },
    pause: () => {
      pause();
    },
    resume: () => {
      resume();
    },
    stop: () => {
      stop();
      startTimeRef.current = null;
      locationBufferRef.current.reset();
    },
  };
}
