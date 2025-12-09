// src/contexts/RunSessionContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    ReactNode,
  } from 'react';
  import * as Location from 'expo-location';
  
  // 러닝 상태 타입 정의
  type RunStatus = 'idle' | 'running' | 'paused' | 'finished';
  
  interface Location {
    lat: number;
    lng: number;
  }
  
  interface RunSessionState {
    status: RunStatus;
    elapsedTime: number; // 초 단위
    distance: number;    // km
    pace: number;        // 초/km
    calories: number;
    route: Location[];
    currentLocation: Location | null;
    initialLocation: Location | null;
  }
  
  interface RunSessionContextValue extends RunSessionState {
    startRun: () => void;
    pauseRun: () => void;
    resumeRun: () => void;
    stopRun: () => void;
    resetRun: () => void;
    // 위치 업데이트용 (나중에 실제 GPS 연동 시 사용)
    addLocationPoint: (loc: Location) => void;
  }
  
  const RunSessionContext = createContext<RunSessionContextValue | undefined>(
    undefined,
  );
  
  export function RunSessionProvider({ children }: { children: ReactNode }) {
    // -----------------------------
    // 공통 상태 (단일 소스)
    // -----------------------------
    const [status, setStatus] = useState<RunStatus>('idle');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [distance, setDistance] = useState(0);
    const [pace, setPace] = useState(0);
    const [calories, setCalories] = useState(0);
    const [route, setRoute] = useState<Location[]>([]);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [initialLocation, setInitialLocation] = useState<Location | null>(null);
  
    // 타이머 interval id 저장
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
    const locationLoadedRef = useRef(false);
  
    // -----------------------------
    // 타이머 useEffect
    // status === 'running' 일 때만 초 증가
    // -----------------------------
    useEffect(() => {
      // running이 아닐 땐 타이머 정지
      if (status !== 'running') {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
  
      // running 상태 → 1초마다 시간/거리 증가 (mock)
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // 10km/h 기준 mock 거리 증가 (1초에 약 0.00278 km)
        setDistance(prev => prev + 0.00278);
      }, 1000);
  
      // cleanup
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [status]);
  
    // -----------------------------
    // 페이스/칼로리 계산
    // -----------------------------
    useEffect(() => {
      if (distance > 0 && elapsedTime > 0) {
        const paceSeconds = (elapsedTime / distance); // 초/km
        setPace(paceSeconds);
      } else {
        setPace(0);
      }
    }, [distance, elapsedTime]);
  
    useEffect(() => {
      // 대충 1km당 62kcal 가정 (RunActiveScreen mock과 동일) :contentReference[oaicite:1]{index=1}
      setCalories(Math.floor(distance * 62));
    }, [distance]);

    // -----------------------------
    // 위치 권한 및 현재 위치 가져오기
    // -----------------------------
    useEffect(() => {
      const getCurrentLocation = async () => {
        // 이미 로드했으면 다시 로드하지 않음
        if (locationLoadedRef.current) {
          return;
        }

        try {
          // 위치 권한 요청
          const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
          
          if (permissionStatus !== 'granted') {
            console.warn('[RunSessionContext] 위치 권한이 거부되었습니다.');
            // 기본 위치(서울) 설정
            const defaultLocation: Location = { lat: 37.5665, lng: 126.978 };
            setCurrentLocation(defaultLocation);
            setInitialLocation(defaultLocation);
            locationLoadedRef.current = true;
            return;
          }

          // 현재 위치 가져오기
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 5000,
          });

          const newLocation: Location = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };

          setCurrentLocation(newLocation);
          if (!initialLocation) {
            setInitialLocation(newLocation);
          }
          locationLoadedRef.current = true;

          console.log('[RunSessionContext] 현재 위치 가져오기 성공:', newLocation);
        } catch (error) {
          console.error('[RunSessionContext] 위치 가져오기 실패:', error);
          // 기본 위치(서울) 설정
          const defaultLocation: Location = { lat: 37.5665, lng: 126.978 };
          setCurrentLocation(defaultLocation);
          if (!initialLocation) {
            setInitialLocation(defaultLocation);
          }
          locationLoadedRef.current = true;
        }
      };

      getCurrentLocation();
    }, []);

    // -----------------------------
    // 러닝 중일 때 위치 추적
    // -----------------------------
    useEffect(() => {
      if (status !== 'running') {
        // 러닝 중이 아니면 위치 추적 중지
        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove();
          locationSubscriptionRef.current = null;
        }
        return;
      }

      // 러닝 중일 때만 위치 추적 시작
      const startLocationTracking = async () => {
        try {
          const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
          
          if (permissionStatus !== 'granted') {
            console.warn('[RunSessionContext] 위치 권한이 없어 위치 추적을 시작할 수 없습니다.');
            return;
          }

          // 위치 업데이트 구독
          locationSubscriptionRef.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 1000, // 1초마다 업데이트
              distanceInterval: 5, // 5m 이동 시 업데이트
            },
            (location) => {
              const newLocation: Location = {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              };
              
              setCurrentLocation(newLocation);
              addLocationPoint(newLocation);
            }
          );

          console.log('[RunSessionContext] 위치 추적 시작');
        } catch (error) {
          console.error('[RunSessionContext] 위치 추적 시작 실패:', error);
        }
      };

      startLocationTracking();

      // cleanup
      return () => {
        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove();
          locationSubscriptionRef.current = null;
        }
      };
    }, [status, addLocationPoint]);
  
    // -----------------------------
    // 액션들
    // -----------------------------
    const startRun = () => {
      // 처음 시작일 때만 초기화
      setStatus('running');
      // 필요하면 start 시에 elapsedTime/distance를 0으로 리셋할지 여부 선택
      // 여기서는 "RunStartScreen → RunActiveScreen"에서 시작 버튼 누르기 전까지
      // 이미 idle 이었으므로, 새 러닝으로 간주하고 리셋
      setElapsedTime(0);
      setDistance(0);
      setRoute([]);
      // 초기 위치는 currentLocation을 기준으로 한번만 세팅 (실제 GPS 연동이면 조정)
      if (currentLocation && !initialLocation) {
        setInitialLocation(currentLocation);
      }
    };
  
    const pauseRun = () => {
      if (status === 'running') {
        setStatus('paused');
      }
    };
  
    const resumeRun = () => {
      if (status === 'paused') {
        setStatus('running');
      }
    };
  
    const stopRun = () => {
      if (status === 'running' || status === 'paused') {
        setStatus('finished');
      }
    };
  
    const resetRun = () => {
      setStatus('idle');
      setElapsedTime(0);
      setDistance(0);
      setPace(0);
      setCalories(0);
      setRoute([]);
      // 위치는 유지 (다음 러닝을 위해)
      // setCurrentLocation(null);
      // setInitialLocation(null);
      locationLoadedRef.current = false; // 위치 다시 가져올 수 있도록 리셋
    };
  
    const addLocationPoint = (loc: Location) => {
      setRoute(prev => [...prev, loc]);
      setCurrentLocation(loc);
      if (!initialLocation) {
        setInitialLocation(loc);
      }
    };
  
    const value: RunSessionContextValue = {
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
      resetRun,
      addLocationPoint,
    };
  
    return (
      <RunSessionContext.Provider value={value}>
        {children}
      </RunSessionContext.Provider>
    );
  }
  
  export function useRunSession() {
    const ctx = useContext(RunSessionContext);
    if (!ctx) {
      throw new Error('useRunSession은 RunSessionProvider 안에서만 사용해야 합니다.');
    }
    return ctx;
  }
  