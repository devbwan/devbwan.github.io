import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/features/auth';
import { useEffect } from 'react';

export default function Index() {
  const { user, authProvider, isLoading } = useAuthStore();
  const isAuthenticated = user && authProvider !== 'guest';

  useEffect(() => {
    if (!isLoading) {
      console.log('[Index] 초기 라우팅:', { isAuthenticated, authProvider });
    }
  }, [isLoading, isAuthenticated, authProvider]);

  // 로딩 중이면 대기
  if (isLoading) {
    return null; // RootLayout에서 로딩 화면 표시
  }

  // 인증되지 않은 사용자는 로그인 화면으로 리디렉션
  if (!isAuthenticated) {
    console.log('[Index] 인증되지 않은 사용자, 로그인 화면으로 리디렉션');
    return <Redirect href="/login" />;
  }

  // 인증된 사용자는 메인 화면으로 리디렉션
  console.log('[Index] 인증된 사용자, 메인 화면으로 리디렉션');
  return <Redirect href="/(tabs)/" />;
}

