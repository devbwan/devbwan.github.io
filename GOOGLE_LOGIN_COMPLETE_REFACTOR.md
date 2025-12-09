# Google Login 완전 리팩토링 가이드

## 📌 개요

Google Login 플로우를 `expo-auth-session/providers/google` 기반으로 완전히 재구성했습니다.

## ✅ 주요 변경 사항

### 1. `useGoogleLogin.ts` 완전 재작성

**파일:** `src/hooks/useGoogleLogin.ts`

#### 주요 개선 사항:
- ✅ `responseType: "id_token"` 명시적 설정
- ✅ `preferLocalhost: true` 추가 (개발 환경 최적화)
- ✅ 올바른 redirectUri 생성 (`runwave://auth`)
- ✅ 상세한 디버깅 로그 추가

```typescript
const redirectUri = makeRedirectUri({
  scheme: "runwave",
  path: "auth",
  preferLocalhost: true, // 개발 환경에서 localhost 우선 사용
});

const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: GOOGLE_WEB_CLIENT_ID,
  redirectUri: redirectUri,
  responseType: "id_token", // ID 토큰만 받아옴 (Firebase Auth에 필요)
  scopes: ['openid', 'profile', 'email'],
});
```

### 2. `signInWithGoogleToken` 함수 수정

**파일:** `src/services/authService.js`

#### 주요 변경:
- ✅ `response.params.id_token`에서 ID 토큰 추출
- ✅ `response.authentication.idToken` 폴백 지원 (하위 호환성)
- ✅ 상세한 오류 처리 및 로깅

```javascript
// responseType: "id_token"을 사용하므로 response.params.id_token에서 가져옴
const idToken = authResponse?.params?.id_token || authResponse?.authentication?.idToken;

if (!idToken) {
  throw new Error('Google ID 토큰을 받지 못했습니다. 로그인을 다시 시도해주세요.');
}

const credential = GoogleAuthProvider.credential(idToken);
const result = await signInWithCredential(auth, credential);
```

### 3. `app/login.js` 응답 처리 개선

**파일:** `app/login.js`

#### 주요 개선:
- ✅ 상세한 디버깅 로그 추가
- ✅ 구체적인 오류 메시지 제공
- ✅ ID 토큰 확인 로그 추가

## 🔧 환경 변수 설정

### 필수 환경 변수

`.env.web` 또는 `.env.android` 파일에 다음을 추가:

```env
# Google Web OAuth Client ID
# Firebase Console > Authentication > Web Client ID 값 사용
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com
```

**중요:**
- 이 값은 **Firebase Console > Authentication**에서 가져온 Web Client ID입니다
- `google-services.json`의 `client_type: 3` 값과 일치해야 합니다

## 📱 인증 구조

### Redirect URI 생성

#### Android/iOS (모바일)
- **Custom Scheme**: `runwave://auth`
- **설정**: `app.json`의 `scheme: "runwave"` 사용
- **자동 생성**: `expo-auth-session`이 AndroidManifest intent-filter 자동 생성

#### Web
- **Firebase Hosting Redirect**: 자동으로 Firebase Hosting redirect URL 사용
- **설정**: `makeRedirectUri()`가 자동으로 처리

### OAuth Client 설정 (Google Cloud Console)

**⚠️ 중요: Web OAuth Redirect URI(`runwave://auth`)는 Google Cloud Console에 등록하지 않습니다!**

**등록해야 하는 URI:**
- ✅ `https://[PROJECT_ID].firebaseapp.com/__/auth/handler`
- ✅ `https://[PROJECT_ID].web.app/__/auth/handler`

**등록하지 않아야 하는 URI:**
- ❌ `runwave://auth` (Expo가 자체적으로 처리)

### AndroidManifest 설정

`expo-auth-session`이 자동으로 다음 intent-filter를 생성합니다:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="runwave" android:host="auth" />
</intent-filter>
```

**확인 방법:**
```bash
npx expo prebuild --clean
```

### app.json 설정

```json
{
  "expo": {
    "scheme": "runwave"
  }
}
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

## 🔍 문제 해결

### 1. "invalid_request" 또는 "redirect_uri_mismatch" 오류

**원인**: Redirect URI가 올바르게 생성되지 않음

**해결**:
1. `app.json`에 `"scheme": "runwave"` 확인
2. `npx expo prebuild --clean` 실행
3. 앱 재시작

### 2. "ID 토큰을 받지 못했습니다" 오류

**원인**: `responseType: "id_token"`이 설정되지 않았거나, 응답에서 ID 토큰을 찾을 수 없음

**해결**:
1. `useGoogleLogin.ts`에서 `responseType: "id_token"` 확인
2. 콘솔 로그에서 `response.params.id_token` 확인
3. Google Cloud Console에서 OAuth 동의 화면 설정 확인

### 3. "access_denied" 오류

**원인**: 테스트 사용자로 등록되지 않았거나, OAuth 동의 화면 설정 문제

**해결**:
1. Google Cloud Console > OAuth 동의 화면 > 테스트 사용자에 계정 추가
2. OAuth 동의 화면 발행 상태 확인 (테스트 중/프로덕션)

### 4. Redirect URI가 "runwave://authflowName=GeneralOAuthFlow"로 생성됨

**원인**: `makeRedirectUri()` 설정이 올바르지 않음

**해결**:
1. `useGoogleLogin.ts`에서 `preferLocalhost: true` 추가 확인
2. `scheme: "runwave"`, `path: "auth"` 확인
3. `npx expo start --clear` 실행

## 📊 로그인 플로우

```
1. 사용자가 "Google로 로그인" 버튼 클릭
   ↓
2. promptAsync() 호출
   ↓
3. Google OAuth 인증 화면 표시
   ↓
4. 사용자가 계정 선택 및 승인
   ↓
5. Redirect URI로 리디렉션 (runwave://auth)
   ↓
6. response.params.id_token 추출
   ↓
7. Firebase Auth에 ID 토큰 전달
   ↓
8. signInWithCredential()로 로그인 완료
   ↓
9. 사용자 정보 저장 및 프로필 화면으로 이동
```

## ✅ 체크리스트

- [x] `useGoogleLogin.ts` 완전 재작성
- [x] `responseType: "id_token"` 설정
- [x] `preferLocalhost: true` 추가
- [x] `signInWithGoogleToken` 함수 수정
- [x] `response.params.id_token`에서 ID 토큰 추출
- [x] `app/login.js` 응답 처리 개선
- [x] 상세한 디버깅 로그 추가
- [x] `app.json` scheme 설정 확인
- [x] AndroidManifest intent-filter 자동 생성 확인

## 📚 관련 문서

- [환경 변수 설정 가이드](./ENV_COMPLETE_SETUP.md)
- [Google 인증 설정 가이드](./GOOGLE_AUTH_COMPLETE_SETUP.md)
- [OAuth Access Denied 해결 가이드](./GOOGLE_OAUTH_ACCESS_DENIED_FIX.md)

---

**리팩토링 완료일**: 2024년
**상태**: ✅ 완전 재구성 완료

