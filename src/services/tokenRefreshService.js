/**
 * Refresh 토큰 관리 서비스
 * 
 * Firebase Auth의 토큰 갱신을 자동으로 처리합니다.
 * - 토큰 만료 전 자동 갱신
 * - 토큰 갱신 실패 시 재시도
 * - 토큰 갱신 상태 추적
 */

import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50분마다 갱신 (토큰은 1시간 유효)
const TOKEN_REFRESH_KEY = '@runwave_token_refresh_time';

let refreshInterval = null;
let isRefreshing = false;

/**
 * 현재 사용자의 ID 토큰 갱신
 * 
 * @returns {Promise<string|null>} 갱신된 ID 토큰 또는 null
 */
export const refreshIdToken = async () => {
  if (!auth || !auth.currentUser) {
    return null;
  }

  if (isRefreshing) {
    if (__DEV__) {
      console.log('[TokenRefresh] 이미 토큰 갱신 중...');
    }
    return null;
  }

  try {
    isRefreshing = true;
    
    if (__DEV__) {
      console.log('[TokenRefresh] ID 토큰 갱신 시작...');
    }
    
    const token = await auth.currentUser.getIdToken(true); // forceRefresh: true
    
    // 갱신 시간 저장
    await AsyncStorage.setItem(TOKEN_REFRESH_KEY, Date.now().toString());
    
    if (__DEV__) {
      console.log('[TokenRefresh] ✅ ID 토큰 갱신 완료');
    }
    
    return token;
  } catch (error) {
    console.error('[TokenRefresh] ❌ ID 토큰 갱신 오류:', error);
    return null;
  } finally {
    isRefreshing = false;
  }
};

/**
 * 토큰 갱신이 필요한지 확인
 * 
 * @returns {Promise<boolean>} 갱신 필요 여부
 */
export const shouldRefreshToken = async () => {
  if (!auth || !auth.currentUser) {
    return false;
  }

  try {
    const lastRefreshTime = await AsyncStorage.getItem(TOKEN_REFRESH_KEY);
    
    if (!lastRefreshTime) {
      // 처음이면 갱신 필요
      return true;
    }
    
    const timeSinceLastRefresh = Date.now() - parseInt(lastRefreshTime, 10);
    
    // 50분이 지났으면 갱신 필요
    return timeSinceLastRefresh >= TOKEN_REFRESH_INTERVAL;
  } catch (error) {
    console.error('[TokenRefresh] 토큰 갱신 필요 여부 확인 오류:', error);
    return true; // 오류 발생 시 갱신 시도
  }
};

/**
 * 자동 토큰 갱신 시작
 * 
 * @returns {Promise<void>}
 */
export const startAutoTokenRefresh = async () => {
  if (refreshInterval) {
    // 이미 시작되어 있으면 중지 후 재시작
    stopAutoTokenRefresh();
  }

  if (!auth || !auth.currentUser) {
    if (__DEV__) {
      console.log('[TokenRefresh] 사용자가 없어서 자동 갱신을 시작할 수 없습니다.');
    }
    return;
  }

  // 즉시 한 번 갱신 시도
  await refreshIdToken();

  // 주기적으로 갱신
  refreshInterval = setInterval(async () => {
    if (auth && auth.currentUser) {
      const needsRefresh = await shouldRefreshToken();
      if (needsRefresh) {
        await refreshIdToken();
      }
    } else {
      // 사용자가 없으면 자동 갱신 중지
      stopAutoTokenRefresh();
    }
  }, TOKEN_REFRESH_INTERVAL);

  if (__DEV__) {
    console.log('[TokenRefresh] ✅ 자동 토큰 갱신 시작');
  }
};

/**
 * 자동 토큰 갱신 중지
 */
export const stopAutoTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    
    if (__DEV__) {
      console.log('[TokenRefresh] 자동 토큰 갱신 중지');
    }
  }
};

/**
 * 토큰 갱신 상태 초기화
 */
export const resetTokenRefresh = async () => {
  stopAutoTokenRefresh();
  await AsyncStorage.removeItem(TOKEN_REFRESH_KEY);
  
  if (__DEV__) {
    console.log('[TokenRefresh] 토큰 갱신 상태 초기화');
  }
};

