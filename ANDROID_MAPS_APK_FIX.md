# Android APK 빌드 후 지도가 표시되지 않는 문제 해결

APK 빌드 후 지도가 표시되지 않는 문제를 해결하기 위한 가이드입니다.

## 🔍 문제 원인

1. **ProGuard/R8 최적화**: 릴리즈 빌드에서 코드 최적화 시 react-native-maps 관련 클래스가 제거될 수 있음
2. **Google Maps API 키**: 빌드된 APK에서 API 키가 제대로 읽히지 않을 수 있음
3. **네이티브 라이브러리**: react-native-maps의 네이티브 모듈이 제대로 링크되지 않을 수 있음

## ✅ 해결 방법

### 1. ProGuard 규칙 추가

`android/app/proguard-rules.pro` 파일에 다음 규칙이 추가되었습니다:

```proguard
# react-native-maps
-keep class com.airbnb.android.react.maps.** { *; }
-keep class com.google.android.gms.maps.** { *; }
-keep class com.google.android.gms.location.** { *; }
-dontwarn com.google.android.gms.**
```

### 2. AndroidManifest.xml 확인

`android/app/src/main/AndroidManifest.xml`에 Google Maps API 키가 설정되어 있는지 확인:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY_HERE"/>
```

### 3. MapView에 provider 명시

`src/components/MapView.js`에서 MapView에 `provider="google"`을 명시적으로 설정했습니다.

### 4. Google Maps API 키 확인

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **APIs & Services** > **Credentials** 메뉴로 이동
3. 사용 중인 API 키 확인
4. **API restrictions**에서 다음 API가 활성화되어 있는지 확인:
   - Maps SDK for Android
   - Places API (사용하는 경우)
5. **Application restrictions**에서 다음이 설정되어 있는지 확인:
   - **Android apps**: 패키지 이름과 SHA-1 인증서 지문 등록

### 5. SHA-1 인증서 지문 확인 및 등록

#### 디버그 키스토어 SHA-1 확인

```powershell
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### 릴리즈 키스토어 SHA-1 확인

```powershell
keytool -list -v -keystore my-release-key.keystore -alias my-key-alias
```

#### Google Cloud Console에 등록

1. Google Cloud Console > APIs & Services > Credentials
2. API 키 선택
3. **Application restrictions** > **Android apps**
4. **+ Add an item** 클릭
5. 패키지 이름: `com.runwave.app`
6. SHA-1 인증서 지문 입력
7. 저장

### 6. 빌드 및 테스트

```powershell
# 환경 변수 로드
npm run env:android

# 클린 빌드
npm run gradle:clean

# 디버그 APK 빌드
npm run build:apk:local:debug

# 또는 릴리즈 APK 빌드
npm run build:apk:local
```

## 🔧 추가 확인 사항

### 1. 로그 확인

Android Studio의 Logcat을 사용하여 다음 오류를 확인:

```bash
adb logcat | grep -i "maps\|google\|api"
```

주요 오류 메시지:
- `Google Maps Android API`: API 키 관련 오류
- `Authentication failed`: 인증 실패
- `API key not valid`: API 키가 유효하지 않음

### 2. 네트워크 권한 확인

`AndroidManifest.xml`에 인터넷 권한이 있는지 확인:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### 3. Google Play Services 확인

기기에서 Google Play Services가 설치되어 있고 최신 버전인지 확인합니다.

### 4. 빌드 타입 확인

디버그 빌드에서는 작동하지만 릴리즈 빌드에서 작동하지 않는 경우:

1. `android/app/build.gradle`에서 `minifyEnabled` 확인
2. ProGuard 규칙이 제대로 적용되는지 확인
3. 릴리즈 빌드에서도 테스트

## 📝 체크리스트

- [ ] ProGuard 규칙에 react-native-maps 관련 규칙 추가됨
- [ ] AndroidManifest.xml에 Google Maps API 키 설정됨
- [ ] MapView에 `provider="google"` 명시됨
- [ ] Google Cloud Console에서 API 키 확인
- [ ] Maps SDK for Android API 활성화됨
- [ ] SHA-1 인증서 지문이 Google Cloud Console에 등록됨
- [ ] 패키지 이름이 Google Cloud Console에 등록됨
- [ ] 클린 빌드 후 테스트 완료
- [ ] Logcat에서 오류 메시지 확인 완료

## ❓ 여전히 문제가 있는 경우

1. **Logcat 확인**: 정확한 오류 메시지 확인
2. **API 키 재생성**: 새로운 API 키 생성 후 테스트
3. **Google Play Services 업데이트**: 기기에서 Google Play Services 업데이트
4. **빌드 캐시 삭제**: `npm run gradle:clean` 후 재빌드
5. **네이티브 프로젝트 재생성**: `npx expo prebuild --clean --platform android`

## 📚 참고 자료

- [react-native-maps 문서](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Android API 설정](https://developers.google.com/maps/documentation/android-sdk/start)
- [ProGuard 규칙](https://developer.android.com/studio/build/shrink-code)


