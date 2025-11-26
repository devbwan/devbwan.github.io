# Android 구글 로그인 설정 가이드

Android 환경에서 구글 로그인이 정상 작동하도록 설정하는 방법입니다.

## 📋 사전 준비사항

1. ✅ Firebase 프로젝트 생성 완료
2. ✅ Firebase Console에서 Google 인증 활성화 완료
3. ✅ `google-services.json` 파일이 프로젝트 루트에 있음
4. ✅ `.env.android` 파일에 Firebase 환경 변수 설정 완료

## 🔑 1단계: SHA-1 인증서 지문 확인

Android에서 구글 로그인을 사용하려면 **SHA-1 인증서 지문**을 Firebase Console에 등록해야 합니다.

### 디버그 키스토어 SHA-1 확인

**Windows (PowerShell):**
```powershell
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**macOS/Linux:**
```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**출력 예시:**
```
Certificate fingerprints:
     SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
     SHA256: ...
```

**중요:** `SHA1:` 뒤의 값을 복사하세요 (콜론 포함).

### 릴리즈 키스토어 SHA-1 확인 (프로덕션용)

릴리즈 빌드를 사용하는 경우, 릴리즈 키스토어의 SHA-1도 등록해야 합니다:

```powershell
keytool -list -v -keystore my-release-key.keystore -alias my-key-alias
```

## 🔧 2단계: Firebase Console에 SHA-1 등록

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: **runningapp-a0bff**
3. 왼쪽 메뉴에서 **프로젝트 설정** (톱니바퀴 아이콘) 클릭
4. **내 앱** 섹션에서 Android 앱 선택 (또는 추가)
5. **SHA 인증서 지문** 섹션에서 **지문 추가** 클릭
6. 위에서 복사한 SHA-1 값 붙여넣기
7. **저장** 클릭

**참고:** 
- 디버그와 릴리즈 키스토어의 SHA-1을 모두 등록하는 것을 권장합니다
- SHA-1을 등록한 후 몇 분 정도 기다려야 적용됩니다

## 📱 3단계: AndroidManifest.xml 확인

`android/app/src/main/AndroidManifest.xml` 파일에 다음 intent-filter가 있는지 확인:

```xml
<activity android:name=".MainActivity" ...>
  ...
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="runwave"/>
  </intent-filter>
</activity>
```

이 설정은 OAuth redirect를 처리하기 위해 필요합니다.

## 🔐 4단계: 환경 변수 확인

`.env.android` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
# Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:android:your-android-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2VG59SE6H7
```

**중요:** `EXPO_PUBLIC_FIREBASE_API_KEY`와 `EXPO_PUBLIC_FIREBASE_APP_ID`가 올바른지 확인하세요.

## 🚀 5단계: 앱 재빌드 및 테스트

SHA-1을 등록한 후에는 앱을 재빌드해야 합니다:

```powershell
# 환경 변수 로드
npm run env:android

# 네이티브 프로젝트 재생성 (필요한 경우)
npx expo prebuild --clean --platform android

# 디버그 APK 빌드
cd android
.\gradlew assembleDebug
cd ..

# 또는 개발 서버 실행
npm run android
```

## ❓ 문제 해결

### 문제 1: "CONFIGURATION_NOT_FOUND" 오류

**원인:** Firebase Console에서 Google 인증이 활성화되지 않았거나, SHA-1이 등록되지 않았습니다.

**해결:**
1. Firebase Console > Authentication > Sign-in method에서 Google이 "사용" 상태인지 확인
2. Firebase Console > 프로젝트 설정 > SHA 인증서 지문에 SHA-1이 등록되어 있는지 확인
3. SHA-1 등록 후 몇 분 기다린 후 다시 시도

### 문제 2: "로그인이 취소되었습니다" 오류

**원인:** 사용자가 로그인을 취소했거나, 브라우저에서 인증이 완료되지 않았습니다.

**해결:**
1. 다시 로그인 시도
2. 브라우저에서 팝업이 차단되지 않았는지 확인
3. Android 기기의 기본 브라우저가 설정되어 있는지 확인

### 문제 3: "인증 토큰을 받지 못했습니다" 오류

**원인:** OAuth redirect URI가 올바르게 설정되지 않았습니다.

**해결:**
1. `AndroidManifest.xml`의 intent-filter가 올바른지 확인
2. `app.json`의 `scheme`이 `runwave`로 설정되어 있는지 확인
3. Firebase Console > Authentication > Settings > Authorized domains에 redirect URI가 포함되어 있는지 확인

### 문제 4: SHA-1을 찾을 수 없음

**원인:** 키스토어 파일이 없거나 경로가 잘못되었습니다.

**해결:**
1. `android/app/debug.keystore` 파일이 있는지 확인
2. 파일이 없다면, Android Studio를 실행하면 자동으로 생성됩니다
3. 또는 다음 명령으로 생성:
   ```powershell
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android
   ```

## ✅ 확인 체크리스트

- [ ] SHA-1 인증서 지문 확인 완료
- [ ] Firebase Console에 SHA-1 등록 완료
- [ ] `.env.android` 파일에 Firebase 환경 변수 설정 완료
- [ ] `AndroidManifest.xml`에 intent-filter 설정 확인
- [ ] Firebase Console에서 Google 인증 활성화 확인
- [ ] 앱 재빌드 완료
- [ ] 구글 로그인 테스트 성공

## 📚 참고 자료

- [Firebase Android 인증 설정](https://firebase.google.com/docs/auth/android/start)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)
- [Expo AuthSession 문서](https://docs.expo.dev/guides/authentication/#google)

