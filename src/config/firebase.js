import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 플랫폼별 환경 변수 로드
// 웹: .env.web 파일 사용
// Android: .env.android 파일 사용
// 환경 변수는 EXPO_PUBLIC_ 접두사가 있어야 번들에 포함됩니다

const getFirebaseConfig = () => {
  // 환경 변수에서만 Firebase 설정 가져오기
  // 모든 값은 .env 파일에서만 가져옵니다 (하드코딩된 값 없음)
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

  // 필수 환경 변수 확인
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    const missingVars = [];
    if (!apiKey) missingVars.push('EXPO_PUBLIC_FIREBASE_API_KEY');
    if (!authDomain) missingVars.push('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!projectId) missingVars.push('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
    if (!storageBucket) missingVars.push('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET');
    if (!messagingSenderId) missingVars.push('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    if (!appId) missingVars.push('EXPO_PUBLIC_FIREBASE_APP_ID');
    
    console.error('[Firebase Config] 필수 환경 변수가 설정되지 않았습니다:');
    console.error('[Firebase Config] 누락된 변수:', missingVars.join(', '));
    console.error('[Firebase Config] .env.web 또는 .env.android 파일에 환경 변수를 설정하세요.');
    console.error('[Firebase Config] 자세한 내용은 ENV_COMPLETE_SETUP.md 파일을 참고하세요.');
    
    return null;
  }

  return {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId || undefined // 선택 사항
  };
};

const firebaseConfig = getFirebaseConfig();

// 플랫폼 정보 로그
if (__DEV__) {
  console.log(`[Firebase Config] Platform: ${Platform.OS}`);
  if (firebaseConfig) {
    console.log(`[Firebase Config] Project ID: ${firebaseConfig.projectId}`);
    console.log(`[Firebase Config] Auth Domain: ${firebaseConfig.authDomain}`);
  } else {
    console.warn('[Firebase Config] Firebase 설정이 로드되지 않았습니다.');
  }
}

// Firebase 초기화
let app;
let db;
let auth;

// Firebase 설정이 유효한지 확인
const isValidFirebaseConfig = () => {
  return (
    firebaseConfig !== null &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "your-api-key" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "your-project-id" &&
    firebaseConfig.authDomain &&
    firebaseConfig.authDomain !== "your-project.firebaseapp.com"
  );
};

if (isValidFirebaseConfig()) {
  try {
    app = initializeApp(firebaseConfig);
    
    // app이 제대로 초기화되었는지 확인
    if (!app) {
      throw new Error('Firebase app 초기화 실패');
    }
    
    // Auth 초기화 - React Native에서는 AsyncStorage 지속성 사용
    if (Platform.OS === 'web') {
      // 웹 환경에서는 getAuth 사용
      auth = getAuth(app);
    } else {
      // React Native 환경에서는 initializeAuth를 사용하여 AsyncStorage 지속성 설정
      try {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
      } catch (error) {
        // 이미 초기화된 경우 getAuth 사용
        if (error.code === 'auth/already-initialized') {
          auth = getAuth(app);
        } else {
          throw error;
        }
      }
    }
    
    // auth가 제대로 초기화되었는지 확인
    if (!auth) {
      throw new Error('Firebase Auth 초기화 실패');
    }
    
    // Firestore 초기화 (오류가 있어도 앱은 계속 작동)
    try {
      db = getFirestore(app);
      
      // Firestore 설정: 오프라인 지속성 비활성화 (웹에서는 문제가 있을 수 있음)
      if (Platform.OS === 'web') {
        // 웹에서는 기본 설정 사용
        if (__DEV__) {
          console.log('[Firebase] Firestore 초기화 성공 (웹)');
        }
      } else {
        // 모바일에서는 오프라인 지속성 사용 가능
        if (__DEV__) {
          console.log('[Firebase] Firestore 초기화 성공 (모바일)');
        }
      }
    } catch (dbError) {
      if (__DEV__) {
        console.warn('[Firebase] Firestore 초기화 오류:', dbError);
        console.warn('[Firebase] Firestore가 설정되지 않았습니다. 코스 데이터는 사용할 수 없지만, 로그인은 가능합니다.');
        console.warn('[Firebase] Firebase Console > Firestore Database에서 데이터베이스를 생성하세요.');
      }
      db = null;
    }
    
    if (__DEV__) {
      console.log('[Firebase] Firebase 초기화 성공');
      console.log('[Firebase] Auth 지속성:', Platform.OS === 'web' ? '브라우저' : 'AsyncStorage');
    }
  } catch (error) {
    console.warn('[Firebase] Firebase 초기화 오류:', error);
    console.warn('[Firebase] Firebase 설정을 확인하세요.');
    app = null;
    db = null;
    auth = null;
  }
} else {
  console.warn('[Firebase] Firebase 설정이 완료되지 않았습니다.');
  console.warn('[Firebase] .env.web 또는 .env.android 파일에 EXPO_PUBLIC_FIREBASE_* 환경 변수를 설정하세요.');
  app = null;
  db = null;
  auth = null;
}

export { db, auth, app, isValidFirebaseConfig, firebaseConfig };
