/**
 * Web + Android 공통 환경 변수 로더
 * 플랫폼별 환경 변수를 통합 관리
 */

import { Platform } from 'react-native';

/**
 * 환경 변수 로드 및 검증
 */
export class EnvLoader {
  constructor() {
    this.platform = Platform.OS;
    this.env = {};
    this.loadEnv();
  }

  /**
   * 환경 변수 로드
   */
  loadEnv() {
    // Expo는 자동으로 EXPO_PUBLIC_ 접두사가 있는 변수를 로드
    this.env = {
      // Firebase 설정
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
      // OAuth 설정
      oauth: {
        google: {
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
          webClientIdAlt: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB, // 호환성
        },
        naver: {
          webClientId: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID_WEB,
          androidClientId: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID_ANDROID,
        },
      },
      // 환경 설정
      app: {
        env: process.env.EXPO_PUBLIC_ENV || 'development',
        platform: this.platform,
      },
    };
  }

  /**
   * 환경 변수 검증
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Firebase 필수 변수 검증
    const requiredFirebaseVars = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    for (const key of requiredFirebaseVars) {
      if (!this.env.firebase[key]) {
        errors.push(`EXPO_PUBLIC_FIREBASE_${key.toUpperCase()}가 설정되지 않았습니다.`);
      } else if (this.isPlaceholder(this.env.firebase[key])) {
        warnings.push(`EXPO_PUBLIC_FIREBASE_${key.toUpperCase()}가 예시 값입니다.`);
      }
    }

    // Google OAuth 필수 변수 검증
    if (!this.env.oauth.google.webClientId) {
      errors.push('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID가 설정되지 않았습니다.');
    } else if (this.isPlaceholder(this.env.oauth.google.webClientId)) {
      warnings.push('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID가 예시 값입니다.');
    }

    // Android 전용 변수 검증
    if (this.platform === 'android') {
      if (!this.env.oauth.google.androidClientId) {
        warnings.push('EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID가 설정되지 않았습니다. (선택 사항)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 예시 값인지 확인
   */
  isPlaceholder(value) {
    if (!value) return false;
    return (
      value.includes('your-') ||
      value.includes('YOUR_') ||
      value === 'your-value-here' ||
      value === 'your-firebase-value' ||
      value === 'your-oauth-client-id'
    );
  }

  /**
   * 환경 변수 가져오기
   */
  get(key) {
    const keys = key.split('.');
    let value = this.env;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * 모든 환경 변수 가져오기
   */
  getAll() {
    return this.env;
  }

  /**
   * 플랫폼별 Google OAuth Client ID 가져오기
   */
  getGoogleClientId() {
    if (this.platform === 'web') {
      return this.env.oauth.google.webClientId || this.env.oauth.google.webClientIdAlt;
    } else if (this.platform === 'android') {
      return this.env.oauth.google.androidClientId;
    }
    return null;
  }

  /**
   * 개발 환경인지 확인
   */
  isDevelopment() {
    return this.env.app.env === 'development';
  }

  /**
   * 프로덕션 환경인지 확인
   */
  isProduction() {
    return this.env.app.env === 'production';
  }
}

// 싱글톤 인스턴스
let envLoaderInstance = null;

export const getEnvLoader = () => {
  if (!envLoaderInstance) {
    envLoaderInstance = new EnvLoader();
  }
  return envLoaderInstance;
};

// 기본 export
export default getEnvLoader();

