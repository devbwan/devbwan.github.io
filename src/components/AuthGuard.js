/**
 * AuthGuard 컴포넌트
 * 
 * 인증이 필요한 라우트를 보호합니다.
 * - 인증되지 않은 사용자는 로그인 화면으로 리디렉션
 * - 인증된 사용자는 자식 컴포넌트 렌더링
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { spacing, colors } from '../theme';

/**
 * AuthGuard 컴포넌트
 * 
 * @param {Object} props
 *   - children: 보호할 컴포넌트
 *   - requireAuth: 인증 필수 여부 (기본값: true)
 *   - redirectTo: 인증되지 않은 경우 리디렉션할 경로 (기본값: '/login')
 */
export default function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = '/login' 
}) {
  const router = useRouter();
  const segments = useSegments();
  const { user, authProvider, isLoading } = useAuthStore();
  
  const isAuthenticated = user && authProvider !== 'guest';

  useEffect(() => {
    // 로딩 중이면 대기
    if (isLoading) {
      return;
    }

    // 인증이 필요한 경우
    if (requireAuth && !isAuthenticated) {
      // 현재 경로가 로그인 화면이 아니면 리디렉션
      if (segments[0] !== 'login' && segments[0] !== 'auth') {
        if (__DEV__) {
          console.log('[AuthGuard] 인증되지 않은 사용자, 로그인 화면으로 리디렉션');
        }
        router.replace(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, segments, router, redirectTo]);

  // 로딩 중
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff' 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.md, color: '#666' }}>
          인증 상태 확인 중...
        </Text>
      </View>
    );
  }

  // 인증이 필요한데 인증되지 않은 경우
  if (requireAuth && !isAuthenticated) {
    // 리디렉션 중이므로 로딩 화면 표시
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff' 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.md, color: '#666' }}>
          로그인 화면으로 이동 중...
        </Text>
      </View>
    );
  }

  // 인증 완료 또는 인증 불필요한 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}

