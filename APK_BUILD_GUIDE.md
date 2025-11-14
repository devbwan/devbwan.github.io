# 📱 APK 빌드 가이드

이 가이드는 Android APK 파일을 생성하여 기기에서 직접 설치하고 실행하는 방법을 설명합니다.

## 🎯 방법 선택

### 방법 1: EAS Build (권장) ⭐
- **장점**: 간단하고 빠름, 클라우드에서 빌드
- **단점**: Expo 계정 필요, 무료 플랜에는 빌드 횟수 제한
- **시간**: 약 10-20분

### 방법 2: 로컬 빌드
- **장점**: 무료, 제한 없음
- **단점**: Android Studio 및 SDK 설치 필요, 복잡함
- **시간**: 초기 설정 후 약 5-10분

---

## 방법 1: EAS Build로 APK 생성 (권장)

### 1단계: EAS CLI 설치 및 로그인

```powershell
# EAS CLI 전역 설치
npm install -g eas-cli

# Expo 계정으로 로그인 (없으면 자동으로 계정 생성)
eas login
```

### 2단계: 프로젝트 설정

```powershell
cd ai-running-app

# EAS 프로젝트 초기화 (이미 eas.json이 있으면 생략 가능)
eas build:configure
```

### 3단계: Firebase 설정 확인

`google-services.json` 파일이 프로젝트 루트에 있는지 확인하세요. 이 파일은 EAS Build가 자동으로 `android/app/` 폴더로 복사합니다.

```powershell
# google-services.json 파일 확인
cat google-services.json
```

파일의 `package_name`이 `app.json`의 `android.package`와 일치하는지 확인하세요:
- `google-services.json`: `"package_name": "com.runwave.app"`
- `app.json`: `"android.package": "com.runwave.app"`

### 4단계: 환경 변수 설정

`.env.android` 파일이 있는지 확인하고, 필요한 환경 변수가 모두 설정되어 있는지 확인하세요.

```powershell
# .env.android 파일 확인
cat .env.android
```

필수 환경 변수:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### 5단계: APK 빌드

#### 미리보기 빌드 (테스트용)
```powershell
npm run build:apk:preview
```

#### 프로덕션 빌드 (배포용)
```powershell
npm run build:apk:production
```

또는 직접 명령어 실행:
```powershell
# 미리보기 빌드
eas build --platform android --profile preview

# 프로덕션 빌드
eas build --platform android --profile production
```

### 6단계: 빌드 완료 및 다운로드

1. 빌드가 시작되면 Expo 대시보드 링크가 표시됩니다
2. 브라우저에서 빌드 진행 상황을 확인할 수 있습니다
3. 빌드가 완료되면:
   - 터미널에 다운로드 링크가 표시됩니다
   - 또는 [Expo 대시보드](https://expo.dev/accounts/[your-account]/projects/ai-running-app/builds)에서 다운로드할 수 있습니다

### 7단계: APK 설치

1. 다운로드한 APK 파일을 Android 기기로 전송 (USB, 이메일, 클라우드 등)
2. 기기에서 **설정** > **보안** > **알 수 없는 출처** 허용
3. APK 파일을 탭하여 설치
4. 설치 완료 후 앱 실행

---

## 방법 2: 로컬 빌드 (Android Studio 필요)

### 사전 요구사항

1. **Android Studio 설치**
   - [Android Studio 다운로드](https://developer.android.com/studio)
   - Android SDK, Android SDK Platform-Tools 설치

2. **Java JDK 설치**
   - JDK 17 이상 권장
   - 환경 변수 `JAVA_HOME` 설정

3. **환경 변수 설정**
   ```powershell
   # 예시 (실제 경로는 설치 위치에 따라 다름)
   $env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

### 1단계: 네이티브 프로젝트 생성

```powershell
cd ai-running-app

# .env.android 파일 로드
npm run env:android

# 네이티브 Android 폴더 생성
npx expo prebuild --clean
```

### 2단계: APK 빌드

#### 방법 A: Gradle 직접 사용 (권장)

```powershell
cd android

# 디버그 APK 빌드
.\gradlew assembleDebug

# 릴리즈 APK 빌드 (서명 필요)
.\gradlew assembleRelease

cd ..
```

빌드된 APK 위치:
- 디버그: `android/app/build/outputs/apk/debug/app-debug.apk`
- 릴리즈: `android/app/build/outputs/apk/release/app-release.apk`

#### 방법 B: npm 스크립트 사용

```powershell
npm run build:apk:local
```

### 3단계: 서명 키 생성 (릴리즈 빌드용)

릴리즈 APK는 서명이 필요합니다:

```powershell
cd android/app

# 키스토어 생성 (처음 한 번만)
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 키스토어 비밀번호 입력 (기억해두세요!)
```

`android/gradle.properties` 파일에 추가:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

### 4단계: APK 설치

로컬 빌드의 경우:
```powershell
# USB로 기기 연결 후
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 또는 APK 파일을 기기로 복사하여 수동 설치
```

---

## 🔧 빌드 프로필 설명

`eas.json` 파일에 정의된 빌드 프로필:

- **development**: 개발용 빌드 (개발 클라이언트 포함)
- **preview**: 테스트용 빌드 (APK 형식)
- **production**: 프로덕션 빌드 (APK 형식, 최적화됨)

---

## 📋 체크리스트

### EAS Build 사용 시
- [ ] `eas-cli` 설치 및 로그인
- [ ] `.env.android` 파일 설정 확인
- [ ] `google-services.json` 파일이 프로젝트 루트에 있는지 확인
- [ ] `app.json`의 `android.package`와 `google-services.json`의 `package_name` 일치 확인
- [ ] `eas.json` 파일 확인
- [ ] 빌드 명령어 실행
- [ ] 빌드 완료 후 APK 다운로드
- [ ] 기기에 APK 설치

### 로컬 빌드 사용 시
- [ ] Android Studio 설치
- [ ] Java JDK 설치 및 환경 변수 설정
- [ ] Android SDK 설치
- [ ] `.env.android` 파일 설정 확인
- [ ] `google-services.json` 파일이 프로젝트 루트에 있는지 확인
- [ ] `npx expo prebuild` 실행
- [ ] Gradle 빌드 실행
- [ ] APK 파일 확인 및 설치

---

## 🐛 문제 해결

### EAS Build 오류

**오류**: "No EAS project found"
```powershell
# 해결: 프로젝트 초기화
eas build:configure
```

**오류**: "Environment variables not found"
```powershell
# 해결: .env.android 파일 확인
npm run env:android
```

### 로컬 빌드 오류

**오류**: "ANDROID_HOME not set"
```powershell
# 해결: 환경 변수 설정
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
```

**오류**: "Gradle build failed"
```powershell
# 해결: 캐시 정리 후 재빌드
cd android
.\gradlew clean
.\gradlew assembleDebug
```

**오류**: "SDK location not found"
```powershell
# 해결: local.properties 파일 생성
cd android
echo "sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk" > local.properties
```

---

## 📱 APK 설치 후 확인사항

1. **앱이 정상적으로 실행되는지 확인**
2. **권한 요청이 정상적으로 작동하는지 확인** (위치, 저장소 등)
3. **Firebase 연결이 정상인지 확인**
4. **OAuth 로그인이 작동하는지 확인**

---

## 💡 팁

1. **첫 빌드는 시간이 오래 걸릴 수 있습니다** (의존성 다운로드)
2. **EAS Build는 무료 플랜에서 월 30회 빌드 제한이 있습니다**
3. **로컬 빌드는 더 빠르지만 초기 설정이 필요합니다**
4. **릴리즈 빌드는 Play Store 배포 전에 서명이 필요합니다**
5. **APK 파일 크기는 보통 20-50MB 정도입니다**

---

## 🔗 참고 링크

- [EAS Build 문서](https://docs.expo.dev/build/introduction/)
- [로컬 빌드 가이드](https://docs.expo.dev/build-reference/local-builds/)
- [Android Studio 다운로드](https://developer.android.com/studio)
- [Expo 대시보드](https://expo.dev)

