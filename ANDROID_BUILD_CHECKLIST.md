# ✅ Android APK 빌드 체크리스트

이 문서는 Android APK 빌드를 시작하기 전에 확인해야 할 사항들을 정리합니다.

## 📋 사전 준비사항

### 1. 필수 파일 확인

- [x] `app.json` - Android 설정 확인됨
- [x] `eas.json` - 빌드 프로필 설정됨
- [x] `google-services.json` - Firebase 설정 파일 확인됨
- [ ] `.env.android` - 환경 변수 파일 생성 필요

### 2. Firebase 설정 확인

`google-services.json` 파일이 프로젝트 루트에 있고, 다음 정보가 올바른지 확인:

- [x] `package_name`: `com.runwave.app` (app.json과 일치)
- [x] `project_id`: `runningapp-a0bff`
- [x] Firebase 프로젝트가 활성화되어 있음

### 3. 환경 변수 설정

`.env.android` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:android:ef7e2f972a0e29da965902
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2VG59SE6H7

# OAuth 설정 (선택사항)
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-google-client-id
EXPO_PUBLIC_NAVER_CLIENT_ID_ANDROID=your-naver-client-id

# 환경 설정
EXPO_PUBLIC_ENV=production
```

### 4. app.json 설정 확인

다음 설정이 올바른지 확인:

- [x] `android.package`: `com.runwave.app`
- [x] `android.versionCode`: `1` (업데이트 시 증가)
- [x] `android.googleServicesFile`: `./google-services.json`
- [x] `android.permissions`: 위치, 활동 인식 권한 포함

### 5. EAS Build 설정 확인

`eas.json` 파일의 빌드 프로필:

- [x] `development` - 개발용 빌드
- [x] `preview` - 테스트용 빌드 (APK)
- [x] `production` - 프로덕션 빌드 (APK)

## 🚀 빌드 시작 전 최종 확인

### EAS Build 사용 시

1. **EAS CLI 설치 및 로그인**
   ```powershell
   npm install -g eas-cli
   eas login
   ```

2. **프로젝트 초기화** (처음 한 번만)
   ```powershell
   eas build:configure
   ```

3. **환경 변수 확인**
   ```powershell
   # .env.android 파일이 있는지 확인
   cat .env.android
   ```

4. **빌드 실행**
   ```powershell
   npm run build:apk:preview
   ```

### 로컬 빌드 사용 시

1. **Android Studio 설치 확인**
   - Android Studio 설치됨
   - Android SDK 설치됨
   - 환경 변수 `ANDROID_HOME` 설정됨

2. **Java JDK 설치 확인**
   - JDK 17 이상 설치됨
   - 환경 변수 `JAVA_HOME` 설정됨

3. **네이티브 프로젝트 생성**
   ```powershell
   npm run env:android
   npx expo prebuild --clean
   ```

4. **빌드 실행**
   ```powershell
   npm run build:apk:local
   ```

## ⚠️ 주의사항

### 보안

- `google-services.json` 파일에는 Firebase API 키가 포함되어 있습니다
- 공개 저장소에 커밋하지 않도록 주의하세요
- 필요시 `.gitignore`에 추가하거나 EAS Secrets를 사용하세요

### 버전 관리

- `app.json`의 `version`과 `android.versionCode`를 업데이트할 때마다 증가시키세요
- `version`: 사용자에게 보이는 버전 (예: "1.0.0")
- `versionCode`: 내부 버전 번호 (정수, 증가만 가능)

### Firebase 설정

- `google-services.json`의 `package_name`이 `app.json`의 `android.package`와 일치해야 합니다
- Firebase Console에서 Android 앱이 등록되어 있어야 합니다

## 🔍 문제 해결

### 빌드 실패 시 확인사항

1. **환경 변수 누락**
   - `.env.android` 파일이 있는지 확인
   - 모든 필수 환경 변수가 설정되어 있는지 확인

2. **Firebase 설정 오류**
   - `google-services.json` 파일이 프로젝트 루트에 있는지 확인
   - `package_name`이 일치하는지 확인

3. **EAS Build 오류**
   - `eas login` 상태 확인
   - Expo 계정이 활성화되어 있는지 확인
   - 빌드 할당량 확인 (무료 플랜: 월 30회)

4. **로컬 빌드 오류**
   - Android Studio 및 SDK 설치 확인
   - 환경 변수 설정 확인
   - Gradle 버전 호환성 확인

## 📝 다음 단계

빌드가 성공하면:

1. APK 파일 다운로드
2. Android 기기에 설치
3. 앱 기능 테스트
4. Firebase 연결 확인
5. OAuth 로그인 테스트

## 🔗 관련 문서

- [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md) - 상세한 빌드 가이드
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase 설정 가이드
- [ENV_FILES_GUIDE.md](./ENV_FILES_GUIDE.md) - 환경 변수 가이드

