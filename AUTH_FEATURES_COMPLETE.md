# 인증 기능 완성 가이드

## ✅ 구현 완료된 기능

### 1. 🔐 Firestore 사용자 동기화 자동 프롬프트

**파일**: `src/services/userSyncService.js`

**기능**:
- 로그인 시 사용자 정보를 Firestore에 자동으로 동기화
- 사용자 문서가 없으면 생성, 있으면 업데이트
- `signInWithGoogleToken` 함수에서 자동 호출
- `authStore.signIn` 함수에서도 자동 호출

**사용 방법**:
```javascript
import { syncUserToFirestore } from '../services/userSyncService';

// 사용자 정보 동기화
const result = await syncUserToFirestore({
  id: 'user-uid',
  email: 'user@example.com',
  name: 'User Name',
  photoURL: 'https://...',
});
```

**동작**:
1. 로그인 성공 시 자동으로 Firestore `users` 컬렉션에 사용자 문서 생성/업데이트
2. `createdAt`, `updatedAt` 타임스탬프 자동 관리
3. 동기화 실패해도 로그인은 성공한 것으로 처리 (비동기)

### 2. 📱 앱 최초 진입 보호 라우팅 (AuthGuard)

**파일**: `src/components/AuthGuard.js`

**기능**:
- 인증이 필요한 라우트를 보호
- 인증되지 않은 사용자는 자동으로 로그인 화면으로 리디렉션
- 로딩 상태 표시
- `app/_layout.js`와 `app/(tabs)/_layout.js`에 통합

**사용 방법**:
```javascript
import AuthGuard from '../components/AuthGuard';

// 인증 필수
<AuthGuard requireAuth={true} redirectTo="/login">
  <YourComponent />
</AuthGuard>

// 인증 불필요 (기본값)
<AuthGuard requireAuth={false}>
  <YourComponent />
</AuthGuard>
```

**통합 위치**:
- `app/_layout.js`: 루트 레이아웃에 통합 (requireAuth={false})
- `app/(tabs)/_layout.js`: 탭 레이아웃에 통합 (requireAuth={false})
- `app/index.js`: 초기 라우팅에서 인증 상태 확인 후 리디렉션

**동작**:
1. 앱 시작 시 인증 상태 확인
2. 인증되지 않은 사용자는 `/login`으로 리디렉션
3. 인증된 사용자는 메인 화면(`/(tabs)/`)으로 리디렉션
4. 로딩 중에는 로딩 화면 표시

### 3. 🔄 Refresh 토큰 관리 프롬프트

**파일**: `src/services/tokenRefreshService.js`

**기능**:
- Firebase Auth ID 토큰 자동 갱신
- 토큰 만료 전 자동 갱신 (50분마다)
- 로그인 시 자동 시작, 로그아웃 시 자동 중지
- 토큰 갱신 상태 추적

**주요 함수**:
- `refreshIdToken()`: ID 토큰 수동 갱신
- `startAutoTokenRefresh()`: 자동 토큰 갱신 시작
- `stopAutoTokenRefresh()`: 자동 토큰 갱신 중지
- `shouldRefreshToken()`: 토큰 갱신 필요 여부 확인

**사용 방법**:
```javascript
import { 
  startAutoTokenRefresh, 
  stopAutoTokenRefresh,
  refreshIdToken 
} from '../services/tokenRefreshService';

// 자동 갱신 시작 (로그인 시)
await startAutoTokenRefresh();

// 자동 갱신 중지 (로그아웃 시)
stopAutoTokenRefresh();

// 수동 갱신
const token = await refreshIdToken();
```

**동작**:
1. 로그인 성공 시 자동으로 토큰 갱신 시작
2. 50분마다 자동으로 토큰 갱신 (토큰은 1시간 유효)
3. 로그아웃 시 자동 갱신 중지
4. 토큰 갱신 실패해도 로그인은 유지

## 📋 통합 위치

### 1. `src/services/authService.js`

**변경 사항**:
- `signInWithGoogleToken`: 로그인 성공 시 Firestore 동기화 및 토큰 갱신 시작
- `signOut`: 로그아웃 시 토큰 갱신 중지

### 2. `src/stores/authStore.js`

**변경 사항**:
- `signIn`: 로그인 시 Firestore 동기화 및 토큰 갱신 시작
- `signOut`: 로그아웃 시 토큰 갱신 중지
- `initialize`: Firebase Auth 상태 변경 시 Firestore 동기화 및 토큰 갱신 관리

### 3. `app/_layout.js`

**변경 사항**:
- `AuthGuard` 컴포넌트 통합 (requireAuth={false})

### 4. `app/(tabs)/_layout.js`

**변경 사항**:
- `AuthGuard` 컴포넌트 통합 (requireAuth={false})

### 5. `app/index.js`

**변경 사항**:
- 인증 상태 확인 후 적절한 화면으로 리디렉션
- 인증되지 않은 사용자는 `/login`으로
- 인증된 사용자는 `/(tabs)/`로

## 🔧 Firestore 보안 규칙

Firestore에 `users` 컬렉션을 사용하므로 보안 규칙에 추가해야 합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 컬렉션 - 본인만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 기존 규칙들...
    match /courses/{courseId} {
      allow read: if resource.data.visibility == 'public';
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /running_sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /route_points/{pointId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 사용 흐름

### 로그인 흐름

```
1. 사용자가 Google 로그인 버튼 클릭
   ↓
2. useGoogleLogin 훅으로 OAuth 요청
   ↓
3. response.params.id_token 받기
   ↓
4. signInWithGoogleToken(response) 호출
   ↓
5. Firebase Auth 로그인 성공
   ↓
6. Firestore에 사용자 정보 동기화 (자동)
   ↓
7. 자동 토큰 갱신 시작 (자동)
   ↓
8. authStore.signIn() 호출
   ↓
9. 게스트 데이터 병합 (있는 경우)
   ↓
10. 메인 화면으로 이동
```

### 로그아웃 흐름

```
1. 사용자가 로그아웃 버튼 클릭
   ↓
2. authStore.signOut() 호출
   ↓
3. 자동 토큰 갱신 중지 (자동)
   ↓
4. Firebase 로그아웃
   ↓
5. AsyncStorage 정리
   ↓
6. 로그인 화면으로 이동
```

### 앱 시작 흐름

```
1. 앱 시작
   ↓
2. RootLayout에서 authStore.initialize() 호출
   ↓
3. 인증 상태 확인
   ↓
4. app/index.js에서 인증 상태 확인
   ↓
5. 인증되지 않은 경우: /login으로 리디렉션
   인증된 경우: /(tabs)/로 리디렉션
```

## 📋 체크리스트

- [x] Firestore 사용자 동기화 서비스 구현
- [x] AuthGuard 라우팅 보호 컴포넌트 구현
- [x] Refresh 토큰 관리 서비스 구현
- [x] authService.js에 Firestore 동기화 통합
- [x] authService.js에 토큰 갱신 통합
- [x] authStore.js에 Firestore 동기화 통합
- [x] authStore.js에 토큰 갱신 통합
- [x] app/_layout.js에 AuthGuard 통합
- [x] app/(tabs)/_layout.js에 AuthGuard 통합
- [x] app/index.js에 인증 상태 확인 로직 추가
- [ ] Firestore 보안 규칙에 users 컬렉션 규칙 추가 (수동)

## ⚠️ 중요 사항

### Firestore 보안 규칙

Firestore Console에서 `users` 컬렉션에 대한 보안 규칙을 추가해야 합니다:

1. Firebase Console > Firestore Database > 규칙 탭
2. 위의 보안 규칙 코드 추가
3. 게시 버튼 클릭

### 토큰 갱신 주기

- 기본 갱신 주기: 50분 (토큰은 1시간 유효)
- `TOKEN_REFRESH_INTERVAL` 상수로 조정 가능

### 동기화 실패 처리

- Firestore 동기화 실패해도 로그인은 성공한 것으로 처리
- 토큰 갱신 실패해도 로그인은 유지
- 모든 비동기 작업은 에러를 로그만 남기고 계속 진행

---

**구현 완료일**: 2024년
**상태**: ✅ 모든 인증 기능 구현 완료

