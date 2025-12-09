/**
 * 위치 데이터 필터링 및 고정 간격 기록
 */

/**
 * 위치 데이터 버퍼 관리
 * 고정 간격(1~2초)으로 위치를 기록하기 위한 버퍼
 */
export class LocationBuffer {
  constructor(intervalMs = 2000) {
    this.intervalMs = intervalMs; // 기록 간격 (밀리초)
    this.lastRecordedTime = null;
    this.buffer = [];
  }

  /**
   * 위치 데이터를 버퍼에 추가하고, 간격이 지났으면 반환
   * @param {Object} location - 위치 데이터
   * @returns {Object|null} 기록할 위치 데이터 또는 null
   */
  addLocation(location) {
    const now = Date.now();

    // 첫 번째 위치는 항상 기록
    if (this.lastRecordedTime === null) {
      this.lastRecordedTime = now;
      return this.formatLocation(location);
    }

    // 간격이 지나지 않았으면 버퍼에 저장
    if (now - this.lastRecordedTime < this.intervalMs) {
      this.buffer.push(location);
      return null;
    }

    // 간격이 지났으면 가장 최근 위치를 기록
    // 버퍼에 위치가 있으면 가장 최근 것 사용, 없으면 현재 위치 사용
    const locationToRecord = this.buffer.length > 0 
      ? this.buffer[this.buffer.length - 1] 
      : location;

    this.lastRecordedTime = now;
    this.buffer = []; // 버퍼 초기화

    return this.formatLocation(locationToRecord);
  }

  /**
   * 위치 데이터 포맷팅
   * @param {Object} location - expo-location의 Location 객체
   * @returns {Object} 포맷된 위치 데이터
   */
  formatLocation(location) {
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      timestamp: location.timestamp || Date.now(),
      accuracy: location.coords.accuracy,
      speed: location.coords.speed || 0,
      heading: location.coords.heading || 0,
    };
  }

  /**
   * 버퍼 초기화
   */
  reset() {
    this.lastRecordedTime = null;
    this.buffer = [];
  }
}

