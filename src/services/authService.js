import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

// Google 로그인 (웹 환경)
export const signInWithGoogle = async () => {
  // Firebase 설정 확인
  if (!isValidFirebaseConfig()) {
    throw new Error('Firebase 설정이 완료되지 않았습니다.\n\n1. Firebase Console에서 프로젝트 생성\n2. src/config/firebase.js에 실제 설정 정보 입력\n3. Authentication > Sign-in method에서 Google 활성화');
  }

  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다. Firebase 설정을 확인하세요.');
  }

  // auth.app이 존재하는지 확인 (Firebase 함수들이 내부적으로 사용)
  if (auth && !auth.app) {
    console.error('[Auth] auth.app이 없습니다. Firebase 초기화를 확인하세요.');
    throw new Error('Firebase Auth가 제대로 초기화되지 않았습니다. 앱을 재시작해주세요.');
  }

  try {
    if (Platform.OS === 'web') {
      // 웹에서는 Firebase Auth의 직접적인 Google 로그인 사용
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // 먼저 redirect 결과 확인 (이전에 redirect로 시작한 경우)
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult) {
          const user = {
            id: redirectResult.user.uid,
            email: redirectResult.user.email,
            name: redirectResult.user.displayName,
            photoURL: redirectResult.user.photoURL,
          };
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
          return user;
        }
      } catch (redirectError) {
        // redirect 결과가 없거나 오류가 발생한 경우 무시하고 popup 사용
        if (__DEV__) {
          console.log('[Auth] Redirect 결과 없음, popup 사용:', redirectError);
        }
      }
      
      // popup 방식 사용 (COOP 경고는 무시 - 실제 로그인은 정상 작동)
      try {
        const result = await signInWithPopup(auth, provider);
        const user = {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
        
        return user;
      } catch (popupError) {
        // popup이 차단되거나 COOP 오류가 발생한 경우 redirect 사용
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          if (__DEV__) {
            console.log('[Auth] Popup 차단됨, redirect 사용');
          }
          // redirect 방식으로 전환
          await signInWithRedirect(auth, provider);
          // redirect는 페이지를 이동하므로 여기서는 null 반환
          // 실제 로그인은 redirect 후 getRedirectResult에서 처리됨
          throw new Error('로그인을 위해 리디렉션 중입니다. 잠시 후 다시 시도해주세요.');
        }
        throw popupError;
      }
    } else {
      // 모바일 환경 (Android/iOS)에서는 Web Browser를 통해 Firebase OAuth 사용
      console.log('[Auth] ========== 모바일 Google 로그인 시작 ==========');
      
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'runwave',
        path: 'auth',
      });

      console.log('[Auth] Redirect URI:', redirectUri);
      console.log('[Auth] Platform.OS:', Platform.OS);

      // firebase.js의 설정 사용 (google-services.json과 일치)
      const authDomain = firebaseConfig.authDomain;
      const apiKey = firebaseConfig.apiKey;
      
      // webClientId 가져오기 (웹용 OAuth Client ID)
      // google-services.json의 client_type: 3 (웹용) 클라이언트 ID 사용
      // ⚠️ React Native/Expo에서는 런타임에 파일을 읽을 수 없으므로 하드코딩된 올바른 값 사용
      // google-services.json의 client_type: 3 값: 184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com
      // ⚠️ 환경 변수는 무시 (잘못된 값이 있을 수 있음)
      
      // 올바른 webClientId (google-services.json의 client_type: 3 값)
      // 이 값은 google-services.json과 일치해야 합니다
      const correctWebClientId = '184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com';
      
      // 환경 변수 확인 (디버깅용)
      const envWebClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
      if (envWebClientId && envWebClientId !== correctWebClientId) {
        console.warn('[Auth] ⚠️ 환경 변수에 잘못된 webClientId가 설정되어 있습니다.');
        console.warn('[Auth] 환경 변수 값:', envWebClientId.substring(0, 30) + '...');
        console.warn('[Auth] 올바른 값:', correctWebClientId.substring(0, 30) + '...');
        console.warn('[Auth] 환경 변수는 무시하고 올바른 값을 사용합니다.');
      }
      
      // 올바른 값 사용 (google-services.json의 client_type: 3)
      // ⚠️ 항상 올바른 값 사용 (환경 변수 무시)
      const webClientId = correctWebClientId;
      console.log('[Auth] ✅ 올바른 webClientId 사용:', webClientId.substring(0, 30) + '...');
      console.log('[Auth] webClientId 전체:', webClientId);
      
      console.log('[Auth] firebaseConfig 확인:', {
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : '없음',
        authDomain: authDomain,
        projectId: firebaseConfig.projectId,
        webClientId: webClientId ? `${webClientId.substring(0, 20)}...` : '없음',
      });
      
      if (!apiKey) {
        throw new Error('Firebase API 키가 설정되지 않았습니다.\n\nfirebase.js의 설정을 확인하세요.');
      }
      
      // webClientId는 항상 올바른 값으로 설정되므로 체크 불필요
      // 하지만 명확성을 위해 로그만 남김
      if (webClientId !== correctWebClientId) {
        console.error('[Auth] ❌ webClientId가 올바르지 않습니다!');
        console.error('[Auth] 예상:', correctWebClientId);
        console.error('[Auth] 실제:', webClientId);
        throw new Error('webClientId가 올바르지 않습니다. 코드를 확인하세요.');
      }
      
      // google-services.json과 일치하는지 확인
      const expectedApiKey = 'AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero';
      if (apiKey !== expectedApiKey) {
        console.warn('[Auth] ⚠️ API 키가 google-services.json과 일치하지 않습니다!');
        console.warn('[Auth] 예상:', expectedApiKey);
        console.warn('[Auth] 실제:', apiKey);
      }

      // Firebase OAuth URL 생성 (redirect 방식)
      // webClientId는 필수입니다! 없으면 "The requested action is invalid" 오류 발생
      // 참고: custom URL scheme (runwave://)은 Authorized domains에 추가할 필요 없음
      const firebaseAuthUrl = `https://${authDomain}/__/auth/handler?` +
        `apiKey=${encodeURIComponent(apiKey)}&` +
        `authType=signInWithRedirect&` +
        `provider=google.com&` +
        `redirectUrl=${encodeURIComponent(redirectUri)}&` +
        `webClientId=${encodeURIComponent(webClientId)}&` +
        `v=9`;

      console.log('[Auth] Firebase OAuth URL:', firebaseAuthUrl);
      console.log('[Auth] Redirect URI:', redirectUri);
      console.log('[Auth] API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '없음');
      console.log('[Auth] Auth Domain:', authDomain);

      // Web Browser로 Firebase OAuth 실행
      console.log('[Auth] WebBrowser.openAuthSessionAsync 호출 전');
      console.log('[Auth] URL:', firebaseAuthUrl.substring(0, 200) + '...');
      console.log('[Auth] Redirect URI:', redirectUri);
      
      let browserResult;
      try {
        // 타임아웃과 함께 브라우저 열기 (5분 타임아웃)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            console.error('[Auth] 타임아웃 발생: 브라우저가 5분 동안 결과를 반환하지 않았습니다.');
            reject(new Error('로그인 타임아웃: 브라우저가 너무 오래 열려있습니다.'));
          }, 5 * 60 * 1000); // 5분
        });

        console.log('[Auth] 브라우저 열기 시작...');
        console.log('[Auth] Promise.race 시작...');
        
        const browserPromise = WebBrowser.openAuthSessionAsync(
          firebaseAuthUrl,
          redirectUri
        );
        
        console.log('[Auth] WebBrowser.openAuthSessionAsync Promise 생성 완료');
        console.log('[Auth] Promise.race 대기 중...');
        
        browserResult = await Promise.race([
          browserPromise,
          timeoutPromise
        ]);
        
        console.log('[Auth] Promise.race 완료!');
        console.log('[Auth] ========== Browser 결과 ==========');
        console.log('[Auth] Browser 결과 타입:', browserResult?.type);
        console.log('[Auth] Browser 결과 URL:', browserResult?.url ? browserResult.url.substring(0, 200) + '...' : '없음');
        console.log('[Auth] Browser 결과 오류:', browserResult?.error);
        console.log('[Auth] Browser 결과 전체:', JSON.stringify(browserResult, null, 2));
        
        // 결과가 없거나 undefined인 경우
        if (!browserResult) {
          console.error('[Auth] 브라우저 결과가 없습니다 (undefined 또는 null)');
          throw new Error('브라우저에서 결과를 받지 못했습니다. 다시 시도해주세요.');
        }
      } catch (browserError) {
        console.error('[Auth] ========== WebBrowser 오류 발생 ==========');
        console.error('[Auth] WebBrowser.openAuthSessionAsync 오류:', browserError);
        console.error('[Auth] 오류 상세:', {
          message: browserError?.message,
          code: browserError?.code,
          name: browserError?.name,
          stack: browserError?.stack,
        });
        
        // 브라우저가 열리지 않는 경우 더 친절한 에러 메시지
        if (browserError?.message?.includes('timeout') || browserError?.message?.includes('타임아웃')) {
          throw new Error('로그인 타임아웃: 브라우저가 너무 오래 열려있습니다. 다시 시도해주세요.');
        } else if (browserError?.code === 'ERR_INVALID_URL' || browserError?.message?.includes('URL')) {
          console.error('[Auth] URL 형식 오류:', firebaseAuthUrl);
          throw new Error('로그인 URL이 올바르지 않습니다. Firebase 설정을 확인하세요.');
        } else {
          throw new Error(`브라우저 오류: ${browserError?.message || '알 수 없는 오류'}\n\nFirebase Console 설정을 확인하세요.`);
        }
      }

      if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
        console.error('[Auth] 브라우저가 닫혔습니다:', {
          type: browserResult.type,
          url: browserResult.url,
          error: browserResult.error,
        });
        throw new Error('로그인이 취소되었습니다.\n\n브라우저에서 로그인을 완료한 후 브라우저를 닫지 마세요. 자동으로 앱으로 돌아갑니다.');
      }

      if (browserResult.type === 'error') {
        console.error('[Auth] OAuth 오류:', browserResult.error);
        throw new Error(`로그인 오류: ${browserResult.error?.message || '알 수 없는 오류'}`);
      }

      if (browserResult.type === 'success' && browserResult.url) {
        // URL에서 인증 결과 파싱
        try {
          if (__DEV__) {
            console.log('[Auth] Success URL 파싱 시작:', browserResult.url);
          }
          
          // "The requested action is invalid" 오류 확인
          if (browserResult.url.includes('error') || 
              browserResult.url.includes('invalid') ||
              browserResult.url.includes('__/auth/error')) {
            console.error('[Auth] Firebase OAuth 오류 URL 감지:', browserResult.url);
            throw new Error(
              'Firebase OAuth 오류가 발생했습니다.\n\n' +
              '가능한 원인:\n' +
              '1. Firebase Console > Authentication > Sign-in method에서 Google이 "사용" 상태인지 확인\n' +
              '2. Google Cloud Console > API 및 서비스 > 인증 정보에서 API 키 제한 확인\n' +
              '3. Firebase Console > 프로젝트 설정에서 SHA-1 인증서 지문이 등록되어 있는지 확인\n\n' +
              '자세한 내용은 FIREBASE_INVALID_ACTION_FIX.md 파일을 참고하세요.'
            );
          }
          
          const url = new URL(browserResult.url);
          
          // URL의 모든 파라미터 로깅
          if (__DEV__) {
            console.log('[Auth] URL 파라미터:', {
              search: url.search,
              hash: url.hash,
              pathname: url.pathname,
              allParams: Object.fromEntries(url.searchParams),
            });
          }
          
          // 여러 가능한 토큰 파라미터 확인
          const authToken = url.searchParams.get('authToken') || 
                          url.searchParams.get('id_token') ||
                          url.searchParams.get('access_token') ||
                          url.hash?.split('id_token=')[1]?.split('&')[0] ||
                          url.hash?.split('access_token=')[1]?.split('&')[0];
          
          const error = url.searchParams.get('error') || 
                       url.searchParams.get('error_description') ||
                       url.hash?.split('error=')[1]?.split('&')[0];

          if (error) {
            if (__DEV__) {
              console.error('[Auth] OAuth 오류:', error);
            }
            throw new Error(`로그인 오류: ${error}`);
          }

          if (authToken) {
            if (__DEV__) {
              console.log('[Auth] 인증 토큰 발견, Firebase에 로그인 시도');
            }
            
            // Firebase Auth에 ID 토큰으로 로그인
            // Google ID 토큰을 Firebase credential로 변환
            try {
              const credential = GoogleAuthProvider.credential(authToken);
              const result = await signInWithCredential(auth, credential);
              
              const user = {
                id: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                photoURL: result.user.photoURL,
              };

              await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
              await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');

              if (__DEV__) {
                console.log('[Auth] Google 로그인 성공:', user);
              }

              return user;
            } catch (credentialError) {
              if (__DEV__) {
                console.error('[Auth] Credential 로그인 오류:', credentialError);
              }
              throw credentialError;
            }
          }

          // URL에 토큰이 없는 경우, redirect 결과 확인
          // Firebase는 redirect 후 getRedirectResult로 결과를 가져올 수 있음
          if (__DEV__) {
            console.log('[Auth] URL에 토큰이 없음, getRedirectResult 시도');
          }
          
          try {
            const redirectResult = await getRedirectResult(auth);
            if (redirectResult) {
              if (__DEV__) {
                console.log('[Auth] getRedirectResult 성공:', redirectResult.user.uid);
              }
              
              const user = {
                id: redirectResult.user.uid,
                email: redirectResult.user.email,
                name: redirectResult.user.displayName,
                photoURL: redirectResult.user.photoURL,
              };
              await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
              await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
              return user;
            } else {
              if (__DEV__) {
                console.log('[Auth] getRedirectResult 결과 없음');
              }
            }
          } catch (redirectError) {
            if (__DEV__) {
              console.error('[Auth] getRedirectResult 오류:', redirectError);
            }
          }

          // 상세한 오류 메시지
          if (__DEV__) {
            console.error('[Auth] 인증 토큰을 받지 못했습니다.');
            console.error('[Auth] URL:', browserResult.url);
          }
          throw new Error('인증 토큰을 받지 못했습니다. Firebase Console 설정을 확인하세요.');
        } catch (parseError) {
          console.error('[Auth] URL 파싱 오류:', parseError);
          console.error('[Auth] URL:', browserResult.url);
          throw new Error('인증 결과를 처리하는 중 오류가 발생했습니다.');
        }
      }

      // browserResult.type이 'success'이지만 url이 없는 경우
      if (browserResult.type === 'success' && !browserResult.url) {
        if (__DEV__) {
          console.log('[Auth] Success 타입이지만 URL이 없음, getRedirectResult 시도');
        }
        // Firebase redirect 결과 확인
        try {
          const redirectResult = await getRedirectResult(auth);
          if (redirectResult) {
            const user = {
              id: redirectResult.user.uid,
              email: redirectResult.user.email,
              name: redirectResult.user.displayName,
              photoURL: redirectResult.user.photoURL,
            };
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
            return user;
          }
        } catch (redirectError) {
          if (__DEV__) {
            console.log('[Auth] getRedirectResult 실패:', redirectError);
          }
        }
      }

      // 알 수 없는 결과인 경우 상세 정보 로깅
      if (__DEV__) {
        console.error('[Auth] 알 수 없는 인증 결과:', {
          type: browserResult.type,
          url: browserResult.url,
          error: browserResult.error,
        });
      }
      throw new Error(`알 수 없는 인증 결과입니다. (타입: ${browserResult.type})`);
    }
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    
    // Firebase API 키 오류
    if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key')) {
      throw new Error('Firebase API 키가 유효하지 않습니다.\n\nsrc/config/firebase.js 파일에 Firebase Console에서 복사한 실제 API 키를 입력하세요.');
    }
    
    // CONFIGURATION_NOT_FOUND 오류 처리
    if (error.code === 400 || error.message?.includes('CONFIGURATION_NOT_FOUND')) {
      throw new Error('Firebase Console에서 Google 인증을 활성화해주세요.\n\n1. Firebase Console 접속\n2. Authentication 메뉴 클릭\n3. Sign-in method 탭 클릭\n4. Google 제공업체 클릭\n5. "사용 설정" 토글 켜기\n6. 저장 클릭');
    }
    
    // Firebase 설정이 안 된 경우 더 친절한 메시지
    if (error.message?.includes('Firebase') || error.code === 'auth/operation-not-allowed') {
      throw new Error('Firebase Console에서 Google 인증을 활성화해주세요.');
    }
    
    throw error;
  }
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
