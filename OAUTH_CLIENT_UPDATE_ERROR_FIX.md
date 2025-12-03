# OAuth 클라이언트 업데이트 오류 해결 가이드

## 🔴 문제 상황

Google Cloud Audit Log에서 다음 오류가 발생했습니다:

```
methodName: "UpdateClientWithMask"
resourceName: "clients/184251732263-i2ohgl8f9vat3joj2gvled47e1br3cd7.apps.googleusercontent.com"
severity: "ERROR"
```

이 오류는 Firebase가 존재하지 않거나 잘못된 OAuth 클라이언트를 업데이트하려고 시도할 때 발생합니다.

## 📋 현재 상태 확인

### google-services.json에 있는 클라이언트 ID

- **Android용**: `184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com`
- **웹용**: `184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com`

### 오류가 발생한 클라이언트 ID

- `184251732263-i2ohgl8f9vat3joj2gvled47e1br3cd7.apps.googleusercontent.com` (google-services.json에 없음)

## 🔧 해결 방법

### 방법 1: Google Cloud Console에서 OAuth 클라이언트 확인 및 정리

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff`
3. **API 및 서비스** > **사용자 인증 정보** 메뉴 클릭
4. **OAuth 2.0 클라이언트 ID** 섹션 확인
5. 다음 클라이언트 ID들이 있는지 확인:
   - `184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com` (Android용 - 있어야 함)
   - `184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com` (웹용 - 있어야 함)
   - `184251732263-i2ohgl8f9vat3joj2gvled47e1br3cd7.apps.googleusercontent.com` (오류 클라이언트 - 삭제 필요)
6. 오류 클라이언트가 있다면 **삭제** 클릭

### 방법 2: Firebase Console에서 Google 인증 재설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff`
3. **Authentication** > **Sign-in method** 메뉴 클릭
4. **Google** 제공업체 클릭
5. **사용 설정** 토글이 켜져 있는지 확인
6. 만약 꺼져 있다면:
   - 토글을 **켜기**
   - 프로젝트 공개 이름 입력 (선택 사항)
   - 프로젝트 지원 이메일 선택
   - **저장** 클릭
7. 저장 후 몇 분 기다린 후 다시 시도

### 방법 3: google-services.json 파일 재다운로드

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff`
3. **프로젝트 설정** (톱니바퀴 아이콘) 클릭
4. **내 앱** 섹션에서 Android 앱 선택
5. **google-services.json 다운로드** 클릭
6. 다운로드한 파일을 프로젝트 루트에 덮어쓰기
7. 파일 내용 확인:
   - `oauth_client` 배열에 올바른 클라이언트 ID가 있는지 확인
   - 오류 클라이언트 ID가 없는지 확인

### 방법 4: Firebase 프로젝트 재연결 (최후의 수단)

위 방법들이 작동하지 않으면:

1. Firebase Console > 프로젝트 설정
2. Android 앱 삭제 (주의: 데이터 손실 가능)
3. Android 앱 다시 추가
4. `google-services.json` 파일 재다운로드
5. 앱 재빌드

## ✅ 확인 사항

다음 항목들을 확인하세요:

- [ ] Google Cloud Console에서 오류 클라이언트 ID가 삭제되었는지 확인
- [ ] Firebase Console에서 Google 인증이 "사용" 상태인지 확인
- [ ] `google-services.json` 파일에 올바른 클라이언트 ID만 있는지 확인
- [ ] SHA-1 인증서 지문이 등록되어 있는지 확인 (`5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`)
- [ ] OAuth 동의 화면이 "테스트" 상태인지 확인
- [ ] 테스트 사용자 목록에 로그인할 계정이 추가되어 있는지 확인

## 🔍 추가 디버깅

### Google Cloud Audit Log 확인

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff`
3. **로그 탐색기** 메뉴 클릭
4. 다음 쿼리로 오류 로그 확인:
   ```
   resource.type="clientauthconfig.googleapis.com/Client"
   severity="ERROR"
   ```

### Firebase Console 로그 확인

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff`
3. **Authentication** > **Users** 메뉴에서 로그인 시도 확인
4. 오류 메시지가 있는지 확인

## 📝 참고 사항

- Firebase는 OAuth 클라이언트를 자동으로 생성하고 관리합니다
- `google-services.json` 파일에 있는 클라이언트 ID만 사용해야 합니다
- 존재하지 않는 클라이언트를 업데이트하려고 시도하면 오류가 발생합니다
- 오류가 발생하면 Firebase Console과 Google Cloud Console 설정을 모두 확인하세요

## 🚀 다음 단계

1. 위의 해결 방법 중 하나를 시도
2. 앱 재빌드: `npm run build:android:debug`
3. APK 설치: `npm run adb:install`
4. Google 로그인 다시 시도
5. 오류가 계속 발생하면 Google Cloud Audit Log를 다시 확인

