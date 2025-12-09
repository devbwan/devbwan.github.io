# Credential 기반 인증 플로우로 전환 완료

## ✅ 완료된 작업

### 문제
React Native 환경에서 작동하지 않는 `signInWithRedirect()`와 `getRedirectResult()` API를 사용하던 redirect 기반 Firebase Auth 플로우를 제거했습니다.

### 해결
모든 플랫폼에서 credential 기반 플로우로 전환했습니다.

## 📝 변경된 파일

### 1. `src/services/authService.js`

**제거된 항목:**
- ✅ `signInWithRedirect` import 제거
- ✅ `getRedirectResult` import 제거
- ✅ 모든 `getRedirectResult()` 호출 제거
- ✅ 모든 `signInWithRedirect()` 호출 제거
- ✅ 웹 redirect 핸들러 로직 제거
- ✅ sessionStorage 기반 로직 제거

**변경 사항:**
- `signInWithGoogle` 함수를 단순화 (더 이상 사용되지 않음)
- `signInWithGoogleToken` 함수는 credential 기반으로 유지

### 2. `app/login.js`

**제거된 항목:**
- ✅ `getRedirectResult` import 제거
- ✅ `auth` import 제거 (더 이상 필요 없음)
- ✅ `AsyncStorage` import 제거 (더 이상 필요 없음)
- ✅ `checkRedirectResult` useEffect 제거
- ✅ 웹 환경 분기 제거 (모든 플랫폼에서 동일한 플로우 사용)

**변경 사항:**
- 모든 플랫폼에서 `useGoogleLogin` 훅 사용
- `handleGoogleLogin` 함수 단순화

## 🔧 올바른 인증 플로우

### 1. Google OAuth 요청
```typescript
const { request, response, promptAsync } = useGoogleLogin();

// 로그인 시작
await promptAsync();
```

### 2. ID 토큰 추출
```typescript
if (response?.type === 'success') {
  // response.params.id_token에서 ID 토큰 가져옴
  const idToken = response.params.id_token;
}
```

### 3. Firebase Credential 생성 및 로그인
```typescript
// Google ID 토큰을 Firebase credential로 변환
const credential = GoogleAuthProvider.credential(idToken);

// Firebase에 로그인
const result = await signInWithCredential(auth, credential);
```

### 4. 사용자 정보 저장
```typescript
const user = {
  id: result.user.uid,
  email: result.user.email,
  name: result.user.displayName,
  photoURL: result.user.photoURL,
};

await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
await AsyncStorage.setItem(AUTH_PROVIDER_KEY, 'google');
```

## ✅ 제거된 항목

### 1. Redirect 기반 API
- ❌ `signInWithRedirect(auth, provider)`
- ❌ `getRedirectResult(auth)`

### 2. 웹 Redirect 핸들러
- ❌ 페이지 로드 시 redirect 결과 확인
- ❌ `checkRedirectResult` useEffect

### 3. SessionStorage 기반 로직
- ❌ sessionStorage를 사용한 Firebase Auth 상태 관리

### 4. 플랫폼별 분기
- ❌ 웹 환경과 모바일 환경의 다른 인증 플로우
- ✅ 모든 플랫폼에서 동일한 credential 기반 플로우

## 📋 현재 인증 플로우

```
1. 사용자가 "Google로 로그인" 버튼 클릭
   ↓
2. promptAsync() 호출 (useGoogleLogin 훅)
   ↓
3. Google OAuth 인증 화면 표시
   ↓
4. 사용자가 계정 선택 및 승인
   ↓
5. response.params.id_token 받기
   ↓
6. GoogleAuthProvider.credential(idToken)로 credential 생성
   ↓
7. signInWithCredential(auth, credential)로 Firebase 로그인
   ↓
8. 사용자 정보 저장 및 프로필 화면으로 이동
```

## 🚀 사용 방법

### 컴포넌트에서 사용

```typescript
import { useGoogleLogin } from '../src/hooks/useGoogleLogin';
import { signInWithGoogleToken } from '../src/services/authService';

function LoginScreen() {
  const { request, response, promptAsync } = useGoogleLogin();

  useEffect(() => {
    if (response?.type === 'success') {
      // response.params.id_token에서 ID 토큰 가져옴
      signInWithGoogleToken(response).then(user => {
        // 로그인 성공 처리
      });
    }
  }, [response]);

  const handleLogin = () => {
    promptAsync();
  };

  return <Button onPress={handleLogin}>Google로 로그인</Button>;
}
```

## ⚠️ 중요 사항

### signInWithGoogle 함수
- ⚠️ `signInWithGoogle` 함수는 더 이상 사용되지 않습니다.
- ✅ 모든 플랫폼에서 `useGoogleLogin` 훅을 사용하세요.

### Redirect 기반 API
- ❌ React Native 환경에서 `signInWithRedirect()`와 `getRedirectResult()`는 작동하지 않습니다.
- ✅ 항상 credential 기반 플로우를 사용하세요.

### 플랫폼별 분기
- ❌ 웹과 모바일 환경의 다른 인증 플로우는 더 이상 필요하지 않습니다.
- ✅ 모든 플랫폼에서 동일한 credential 기반 플로우를 사용합니다.

## 📋 체크리스트

- [x] `signInWithRedirect` import 제거
- [x] `getRedirectResult` import 제거
- [x] 모든 `getRedirectResult()` 호출 제거
- [x] 모든 `signInWithRedirect()` 호출 제거
- [x] 웹 redirect 핸들러 제거
- [x] sessionStorage 기반 로직 제거
- [x] 플랫폼별 분기 제거
- [x] 모든 플랫폼에서 credential 기반 플로우 사용

---

**변경 완료일**: 2024년
**상태**: ✅ 모든 redirect 기반 코드 제거 및 credential 기반 플로우로 전환 완료

