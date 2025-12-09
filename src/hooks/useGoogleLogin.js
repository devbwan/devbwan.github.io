import { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";

/**
 * Google Login을 위한 커스텀 훅
 *
 * expo-auth-session/providers/google을 사용하여 Google OAuth 인증을 처리합니다.
 *
 * 중요 사항:
 * - Web OAuth Client ID는 Firebase Console > Authentication에서 가져온 값 사용
 * - redirectUri는 Firebase Hosting URL 사용 (https://runningapp-a0bff.firebaseapp.com/__/auth/handler)
 * - responseType: "id_token"을 사용하여 ID 토큰만 받아옴
 * - Custom scheme (runwave://auth)는 더 이상 사용하지 않음
 *
 * @returns {Object} { request, response, promptAsync }
 *   - request: AuthRequest 객체
 *   - response: AuthSessionResult 객체 (response.params.id_token 포함)
 *   - promptAsync: 로그인 프롬프트를 시작하는 함수
 */
export function useGoogleLogin() {
  // Web OAuth Client ID (Firebase Console > Authentication > Web Client ID)
  // 환경 변수에서 가져오거나, 없으면 기본값 사용
  const GOOGLE_WEB_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    '184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com';

  // Redirect URI - Firebase Hosting URL 사용
  // Custom scheme (runwave://auth) 대신 Firebase Hosting URL 사용
  const redirectUri = "https://runningapp-a0bff.firebaseapp.com/__/auth/handler";

  if (__DEV__) {
    console.log('[useGoogleLogin] ========== Google OAuth 설정 ==========');
    console.log('[useGoogleLogin] Web Client ID:', GOOGLE_WEB_CLIENT_ID.substring(0, 30) + '...');
    console.log('[useGoogleLogin] Redirect URI:', redirectUri);
    console.log('[useGoogleLogin] Platform:', Platform.OS);
    console.log('[useGoogleLogin] ======================================');
  }

  // Google OAuth 요청 설정
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri: redirectUri,
    responseType: "id_token",
  });

  // 응답 디버깅
  useEffect(() => {
    if (response) {
      if (__DEV__) {
        console.log('[useGoogleLogin] ========== OAuth 응답 ==========');
        console.log('[useGoogleLogin] Response Type:', response.type);

        if (response.type === 'success') {
          console.log('[useGoogleLogin] ✅ 로그인 성공');
          console.log('[useGoogleLogin] Response Params:', {
            id_token: response.params?.id_token ? 'present' : 'missing',
            access_token: response.params?.access_token ? 'present' : 'missing',
            state: response.params?.state ? 'present' : 'missing',
          });
        } else if (response.type === 'error') {
          console.error('[useGoogleLogin] ❌ 로그인 실패');
          console.error('[useGoogleLogin] Error Code:', response.error?.code);
          console.error('[useGoogleLogin] Error Message:', response.error?.message);
          console.error('[useGoogleLogin] Full Error:', response.error);
        } else if (response.type === 'cancel' || response.type === 'dismiss') {
          console.log('[useGoogleLogin] ⚠️ 사용자 취소');
        }
        console.log('[useGoogleLogin] ======================================');
      }
    }
  }, [response]);

  return { request, response, promptAsync };
}

