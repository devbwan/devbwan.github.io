import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  OAuthProvider,
} from 'firebase/auth';
import { auth, isValidFirebaseConfig, firebaseConfig } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const USER_STORAGE_KEY = '@runwave_user';
const AUTH_PROVIDER_KEY = '@runwave_auth_provider';

/**
 * Google OAuth 응답에서 ID 토큰을 받아 Firebase에 로그인
 * expo-auth-session/providers/google의 응답을 처리합니다.
 * 
 * 중요: responseType: "id_token"을 사용하므로 response.params.id_token에서 ID 토큰을 가져옵니다.
 * 
 * @param {Object} authResponse - expo-auth-session의 Google 인증 응답
 *   - authResponse.type === 'success'인 경우
 *   - authResponse.params.id_token: Google ID 토큰
 * @returns {Promise<Object>} 사용자 정보
 */
export const signInWithGoogleToken = async (authResponse) => {
  if (!isValidFirebaseConfig()) {
    throw new Error('Firebase 설정이 완료되지 않았습니다.\n\n1. Firebase Console에서 프로젝트 생성\n2. src/config/firebase.js에 실제 설정 정보 입력\n3. Authentication > Sign-in method에서 Google 활성화');
  }

  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다. Firebase 설정을 확인하세요.');
  }

  // responseType: "id_token"을 사용하므로 response.params.id_token에서 가져옴
  const idToken = authResponse?.params?.id_token || authResponse?.authentication?.idToken;

  if (!idToken) {
    console.error('[Auth] ID Token이 없습니다. Response:', {
      type: authResponse?.type,
      params: authResponse?.params ? Object.keys(authResponse.params) : 'none',
      authentication: authResponse?.authentication ? 'present' : 'missing',
    });
    throw new Error('Google ID 토큰을 받지 못했습니다. 로그인을 다시 시도해주세요.');
  }

  try {
    if (__DEV__) {
      console.log('[Auth] ========== Firebase 로그인 시작 ==========');
      console.log('[Auth] ID Token:', idToken.substring(0, 50) + '...');
    }

    // Google ID 토큰을 Firebase credential로 변환
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    
    const user = {
      id: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
    };

    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');

    // Firestore에 사용자 정보 동기화
    try {
      const { syncUserToFirestore } = await import('./userSyncService');
      const syncResult = await syncUserToFirestore(user);
      if (syncResult.success) {
        if (__DEV__) {
          console.log('[Auth] ✅ Firestore 사용자 동기화 완료:', syncResult.action);
        }
      } else {
        if (__DEV__) {
          console.warn('[Auth] ⚠️ Firestore 사용자 동기화 실패:', syncResult.reason);
        }
      }
    } catch (syncError) {
      console.error('[Auth] Firestore 사용자 동기화 오류:', syncError);
      // 동기화 실패해도 로그인은 성공한 것으로 처리
    }

    // 자동 토큰 갱신 시작
    try {
      const { startAutoTokenRefresh } = await import('./tokenRefreshService');
      await startAutoTokenRefresh();
    } catch (tokenError) {
      console.error('[Auth] 자동 토큰 갱신 시작 오류:', tokenError);
      // 토큰 갱신 실패해도 로그인은 성공한 것으로 처리
    }

    if (__DEV__) {
      console.log('[Auth] ✅ Google 로그인 성공:', user);
      console.log('[Auth] ======================================');
    }

    return user;
  } catch (error) {
    console.error('[Auth] ❌ Firebase 로그인 오류:', error);
    console.error('[Auth] Error Code:', error.code);
    console.error('[Auth] Error Message:', error.message);
    
    // 더 구체적인 오류 메시지 제공
    if (error.code === 'auth/invalid-credential') {
      throw new Error('유효하지 않은 인증 정보입니다. 다시 로그인해주세요.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Firebase Console에서 Google 인증을 활성화해주세요.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
    
    throw error;
  }
};

// Google 로그인 (레거시 지원 - 더 이상 사용되지 않음)
// ⚠️ 이 함수는 더 이상 사용되지 않습니다.
// 모든 플랫폼에서 useGoogleLogin 훅과 signInWithGoogleToken 함수를 사용하세요.
// 
// 올바른 사용법:
// 1. useGoogleLogin 훅으로 Google OAuth 요청
// 2. response.params.id_token에서 ID 토큰 추출
// 3. signInWithGoogleToken(response)로 Firebase 로그인
export const signInWithGoogle = async () => {
  throw new Error(
    'signInWithGoogle 함수는 더 이상 사용되지 않습니다.\n\n' +
    '모든 플랫폼에서 useGoogleLogin 훅을 사용하세요:\n\n' +
    '1. const { request, response, promptAsync } = useGoogleLogin();\n' +
    '2. response.params.id_token에서 ID 토큰 확인\n' +
    '3. signInWithGoogleToken(response)로 Firebase 로그인'
  );
};

// 로그아웃
export const signOut = async () => {
  try {
    // AsyncStorage에서 사용자 정보 제거 (먼저 제거하여 새로고침 시 복원 방지)
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(AUTH_PROVIDER_KEY);
    
    // Firebase 로그아웃
    if (auth) {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await firebaseSignOut(auth);
        }
      } catch (error) {
        console.error('Firebase 로그아웃 오류:', error);
        // Firebase 오류가 있어도 로컬 로그아웃은 진행
      }
    }
    
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
    // 오류가 발생해도 AsyncStorage는 정리 시도
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_PROVIDER_KEY);
    } catch (storageError) {
      console.error('AsyncStorage 정리 오류:', storageError);
    }
    // Firebase 로그아웃은 오류가 있어도 시도
    try {
      if (auth?.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (firebaseError) {
      console.error('Firebase 로그아웃 오류 (재시도):', firebaseError);
    }
    throw error;
  }
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  try {
    console.log('[AuthService] getCurrentUser 시작');
    console.log('[AuthService] auth 객체:', { hasAuth: !!auth, hasCurrentUser: !!auth?.currentUser });
    
    // Firebase Auth 상태 확인
    const firebaseUser = auth?.currentUser;
    console.log('[AuthService] Firebase 사용자:', { hasUser: !!firebaseUser, uid: firebaseUser?.uid });
    
    // AsyncStorage에서 사용자 정보 확인
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const provider = await AsyncStorage.getItem(AUTH_PROVIDER_KEY);
    console.log('[AuthService] AsyncStorage:', { hasUserJson: !!userJson, provider });

    // Firebase Auth에 사용자가 있지만 AsyncStorage에 없는 경우 (로그아웃 후 새로고침 시나리오)
    if (firebaseUser && !userJson) {
      // Firebase Auth만 있고 AsyncStorage에는 없는 경우 - 로그아웃 처리
      // 이는 로그아웃 후 Firebase Auth 세션이 남아있는 경우를 처리
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.warn('Firebase Auth 세션 정리 오류:', error);
      }
      return { user: null, provider: 'guest' };
    }

    // AsyncStorage에 사용자 정보가 있는 경우
    if (userJson) {
      const parsedUser = JSON.parse(userJson);
      
      // Firebase Auth와 AsyncStorage가 모두 있는 경우 동기화
      if (firebaseUser && firebaseUser.uid === parsedUser.id) {
        return {
          user: parsedUser,
          provider: provider || 'guest',
        };
      }
      
      // AsyncStorage에만 있고 Firebase Auth에는 없는 경우 (비정상 상태)
      // Firebase Auth 세션이 만료된 경우로 간주하고 AsyncStorage 정리
      if (!firebaseUser) {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        await AsyncStorage.removeItem(AUTH_PROVIDER_KEY);
        return { user: null, provider: 'guest' };
      }
      
      return {
        user: parsedUser,
        provider: provider || 'guest',
      };
    }

    // 둘 다 없는 경우 - 게스트 모드
    return { user: null, provider: 'guest' };
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    // 오류 발생 시 AsyncStorage 정리 시도
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_PROVIDER_KEY);
    } catch (storageError) {
      console.error('AsyncStorage 정리 오류:', storageError);
    }
    return { user: null, provider: 'guest' };
  }
};

// 인증 상태 리스너 설정
export const onAuthStateChange = (callback) => {
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};
