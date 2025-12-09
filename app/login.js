import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Card, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, signInWithGoogleToken, useGoogleLogin } from '../src/features/auth';
import { Platform } from 'react-native';
import { spacing, typography, colors } from '../src/theme';

const USER_STORAGE_KEY = '@runwave_user';
const AUTH_PROVIDER_KEY = '@runwave_auth_provider';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Google Login 훅 (모바일 환경에서 사용)
  const { request, response, promptAsync } = useGoogleLogin();

  // Google OAuth 응답 처리 (모든 플랫폼)
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        setError(null);
        try {
          if (__DEV__) {
            console.log('[Login] ========== Google 로그인 처리 시작 ==========');
            console.log('[Login] Response Type:', response.type);
            console.log('[Login] ID Token Present:', !!response.params?.id_token);
          }

          // Google OAuth 응답에서 ID 토큰을 받아 Firebase에 로그인
          // response.params.id_token에서 ID 토큰을 가져옴 (responseType: "id_token" 사용)
          const user = await signInWithGoogleToken(response);
          const mergeResult = await signIn(user, 'google');
          
          // 데이터 병합 결과 알림 (선택적)
          if (mergeResult && (mergeResult.sessionsMerged > 0 || mergeResult.rewardsMerged > 0)) {
            const message = `게스트 모드에서 생성한 데이터가 병합되었습니다.\n세션: ${mergeResult.sessionsMerged}개, 메달: ${mergeResult.rewardsMerged}개`;
            if (__DEV__) {
              console.log('[Login]', message);
            }
          }
          
          if (__DEV__) {
            console.log('[Login] ✅ 로그인 성공, 프로필 화면으로 이동');
            console.log('[Login] ======================================');
          }
          
          router.replace('/(tabs)/profile');
        } catch (err) {
          console.error('[Login] ❌ Google 로그인 실패:', err);
          console.error('[Login] Error Code:', err.code);
          console.error('[Login] Error Message:', err.message);
          
          // 구체적인 오류 메시지 제공
          if (err.message?.includes('Firebase 설정') || err.message?.includes('초기화')) {
            setError('Firebase 설정이 필요합니다.\n\n1. Firebase Console에서 프로젝트 생성\n2. Authentication > Sign-in method에서 Google 활성화\n3. src/config/firebase.js에 설정 정보 입력\n\n현재는 게스트 모드로 진행하세요.');
          } else if (err.message?.includes('operation-not-allowed')) {
            setError('Firebase Console에서 Google 인증을 활성화해주세요.');
          } else if (err.message?.includes('ID 토큰')) {
            setError('Google 로그인 토큰을 받지 못했습니다.\n\n가능한 원인:\n1. Google Cloud Console에서 OAuth 동의 화면 설정 확인\n2. 테스트 사용자로 등록되지 않은 계정 사용\n3. 네트워크 연결 확인');
          } else {
            setError(err.message || 'Google 로그인에 실패했습니다. 다시 시도해주세요.');
          }
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('[Login] Google OAuth 오류:', response);
        const errorMessage = response.error?.message || response.error?.code || '알 수 없는 오류';
        const errorCode = response.error?.code;
        
        // 구체적인 오류 메시지 제공
        let userMessage = 'Google 로그인에 실패했습니다.';
        if (errorCode === 'access_denied' || errorMessage?.includes('access_denied') || errorMessage?.includes('승인')) {
          userMessage = 'Google 로그인이 거부되었습니다.\n\n가능한 원인:\n1. Google Cloud Console에서 OAuth 동의 화면 설정 확인\n2. Authorized redirect URIs에 Firebase Hosting URL 추가 필요\n3. 테스트 사용자로 등록되지 않은 계정 사용';
        } else if (errorCode === 'invalid_client') {
          userMessage = 'OAuth Client ID가 올바르지 않습니다.\n\n환경 변수 EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID를 확인하세요.';
        } else if (errorCode === 'redirect_uri_mismatch') {
          userMessage = 'Redirect URI가 일치하지 않습니다.\n\nGoogle Cloud Console > OAuth 2.0 클라이언트 ID > Authorized redirect URIs에 다음을 추가하세요:\nhttps://runningapp-a0bff.firebaseapp.com/__/auth/handler';
        }
        
        setError(`${userMessage}\n\n오류 코드: ${errorCode || 'N/A'}\n오류 메시지: ${errorMessage}`);
        setLoading(false);
      } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
        setError(null);
        setLoading(false);
      }
    };

    if (response) {
      handleGoogleResponse();
    }
  }, [response, signIn, router]);


  const handleGoogleLogin = async () => {
    // 모든 플랫폼에서 useGoogleLogin 훅 사용 (credential 기반)
    if (!request) {
      setError('Google 로그인 요청을 준비할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await promptAsync();
    } catch (err) {
      console.error('Google 로그인 프롬프트 오류:', err);
      setError('Google 로그인을 시작할 수 없습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.header}>
          <Text style={styles.title}>RunWave</Text>
          <Text style={styles.subtitle}>러닝 트래커에 오신 것을 환영합니다</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Google 로그인 처리 중...</Text>
            <Text style={styles.loadingSubtext}>팝업 창에서 계정을 선택해주세요</Text>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.googleButtonText}>Google로 로그인</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="text"
            onPress={handleGuestMode}
            style={styles.guestButton}
            disabled={loading}
          >
            게스트로 계속하기
          </Button>

          <Text style={styles.infoText}>
            게스트 모드에서는 로컬에만 저장되며, 로그인하면 클라우드에 동기화됩니다.
          </Text>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
    marginBottom: spacing.sm,
    fontFamily: typography.h1.fontFamily,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: '#666',
    textAlign: 'center',
    fontFamily: typography.body.fontFamily,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
    fontFamily: typography.caption.fontFamily,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  googleButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4285F4',
    justifyContent: 'center', // 세로 정렬 중앙
    alignItems: 'center',     // 가로 정렬 중앙
    elevation: 0, // Android 그림자 제거
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    includeFontPadding: false, // Android 폰트 패딩 제거
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  guestButton: {
    height: 48,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.caption.fontSize,
    color: '#666',
    fontFamily: typography.caption.fontFamily,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
    fontFamily: typography.caption.fontFamily,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderRadius: 24,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: '#000',
    fontFamily: typography.body.fontFamily,
  },
  loadingSubtext: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: '#666',
    textAlign: 'center',
    fontFamily: typography.caption.fontFamily,
  },
});

