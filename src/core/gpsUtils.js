/**
 * GPS 위치 데이터 유틸리티
 * 위치 품질 필터링 및 거리 계산 함수
 */

/**
 * 위치 데이터가 유효한지 확인
 * @param {Object} location - expo-location의 Location 객체
 * @returns {boolean} 유효한 위치 데이터인지 여부
 */
export function isValidLocation(location) {
  if (!location || !location.coords) {
    return false;
  }

  const { accuracy, latitude, longitude } = location.coords;

  // 정확도가 25m 이하인 경우만 유효
  if (accuracy && accuracy > 25) {
    if (__DEV__) {
      console.warn('[GPS] 위치 정확도가 낮습니다:', accuracy, 'm');
    }
    return false;
  }

  // 좌표 유효성 검사
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    if (__DEV__) {
      console.warn('[GPS] 유효하지 않은 좌표:', { latitude, longitude });
    }
    return false;
  }

  return true;
}

/**
 * 두 좌표 간 거리 계산 (Haversine 공식)
 * 메모이제이션을 위해 순수 함수로 유지
 * 
 * @param {number} lat1 - 첫 번째 위도
 * @param {number} lon1 - 첫 번째 경도
 * @param {number} lat2 - 두 번째 위도
 * @param {number} lon2 - 두 번째 경도
 * @returns {number} 거리 (미터)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 미터 단위
}

/**
 * 페이스 계산 (초/km)
 * @param {number} duration - 경과 시간 (초)
 * @param {number} distance - 거리 (미터)
 * @returns {number} 페이스 (초/km), 거리가 0이면 0 반환
 */
export function calculatePace(duration, distance) {
  if (!distance || distance <= 0) {
    return 0;
  }
  return Math.round((duration / distance) * 1000); // 초/km
}

/**
 * 속도 변환 (m/s → km/h)
 * @param {number} speedMs - 속도 (m/s)
 * @returns {number} 속도 (km/h)
 */
export function convertSpeedToKmh(speedMs) {
  if (!speedMs || speedMs <= 0) {
    return 0;
  }
  return speedMs * 3.6;
}

