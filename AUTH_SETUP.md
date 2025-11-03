# 인증 시스템 설정 가이드

## ✅ 완료된 작업

### 1. 인증 서비스
- ✅ `src/services/authService.js` - 인증 서비스 기본 구조
- ✅ `src/stores/authStore.js` - 인증 상태 관리 (Zustand)
- ✅ `app/login.js` - 로그인 화면
- ✅ 프로필 화면에 로그아웃 기능 추가

### 2. 현재 상태
- ✅ 게스트 모드: 기본적으로 게스트로 사용 가능
- ✅ 로그인 화면: Google/네이버 로그인 UI 준비 완료
- ✅ 로그아웃: 프로필 화면에서 로그아웃 가능

## 🔧 Firebase Auth 설정 방법

### 1. Firebase Console에서 Google 인증 활성화

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. **Authentication** 메뉴 클릭
4. **Sign-in method** 탭 클릭
5. **Google** 제공업체 클릭
6. **사용 설정** 토글 켜기
7. 프로젝트 공개 이름 입력 (선택 사항)
8. 프로젝트 지원 이메일 선택
9. **저장** 클릭

### 2. Google Client ID 설정

Google 로그인을 사용하려면 Google Cloud Console에서 OAuth 2.0 클라이언트 ID가 필요합니다.

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Firebase 프로젝트와 연결된 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보** 메뉴
4. **OAuth 2.0 클라이언트 ID** 생성 또는 기존 ID 확인
5. 웹 애플리케이션용 클라이언트 ID 복사
6. `.env` 파일에 추가:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here
   ```

### 3. 코드 수정 필요

현재 `src/services/authService.js`의 `signInWithGoogle` 함수는 기본 구조만 있습니다.
실제 구현을 위해서는 다음 중 하나를 선택해야 합니다:

#### 옵션 1: Firebase UI 사용 (권장)
```bash
npm install firebaseui-web-react
```

#### 옵션 2: expo-auth-session 사용
```bash
npx expo install expo-auth-session expo-crypto
```

그리고 `authService.js`를 수정하여 실제 Google 로그인 플로우 구현

## 네이버 로그인 설정

네이버 로그인은 네이버 개발자 센터에서 OAuth 애플리케이션 등록이 필요합니다.

1. [네이버 개발자 센터](https://developers.naver.com/) 접속
2. **애플리케이션** > **애플리케이션 등록**
3. 필요한 정보 입력
4. Client ID, Client Secret 발급
5. `.env` 파일에 추가:
   ```
   EXPO_PUBLIC_NAVER_CLIENT_ID=your-client-id
   EXPO_PUBLIC_NAVER_CLIENT_SECRET=your-client-secret
   ```

## 현재 동작 방식

### 게스트 모드 (기본)
- 로그인 없이 앱 사용 가능
- 모든 데이터는 로컬 SQLite에 저장
- 클라우드 동기화 불가

### 로그인 상태
- 사용자 정보가 AsyncStorage에 저장
- Firebase Auth 상태와 연동
- 러닝 종료 시 클라우드 동기화

### 로그아웃
- 프로필 화면에서 로그아웃 가능
- AsyncStorage에서 사용자 정보 제거
- 게스트 모드로 전환

## 다음 단계

1. **Firebase Console에서 Google 인증 활성화**
2. **Google Client ID 설정**
3. **authService.js의 signInWithGoogle 함수 구현**
4. **네이버 로그인 구현 (선택 사항)**

## 참고 사항

- 현재는 게스트 모드로도 모든 기능 사용 가능
- 로그인은 클라우드 동기화를 위한 선택 사항
- Firebase 설정 없이도 앱은 정상 작동

