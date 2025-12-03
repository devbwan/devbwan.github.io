# Google Maps 지도 표시 문제 해결 가이드

## 📌 중요: Maps API Key 통일

**Google Maps API Key는 Firebase API Key와 동일한 값을 사용합니다.**
- Maps API Key는 `EXPO_PUBLIC_FIREBASE_API_KEY` 환경 변수에서 자동으로 가져옵니다
- 별도의 Maps API Key 설정이 필요 없습니다
- `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY`가 설정되어 있으면 자동으로 적용됩니다

## 🔍 현재 확인된 사항

### ✅ 완료된 설정
1. **AndroidManifest.xml**: Google Maps API 키 설정됨 (자동 설정)
   ```xml
   <meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero"/>
   ```
   **참고:** API Key는 `plugins/withGoogleMapsApiKey.js` 플러그인을 통해 `EXPO_PUBLIC_FIREBASE_API_KEY` 환경 변수에서 자동으로 설정됩니다.

2. **환경 변수**: `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY` 설정됨

3. **ProGuard 규칙**: react-native-maps 관련 규칙 추가됨

4. **MapView 컴포넌트**: `provider="google"` 명시됨

5. **SHA-1 인증서 지문**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

## ⚠️ Google Cloud Console에서 반드시 확인해야 할 사항

### 1. Maps SDK for Android API 활성화

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff` (또는 해당 프로젝트)
3. **APIs & Services** > **Library** 메뉴
4. "Maps SDK for Android" 검색
5. **Maps SDK for Android** 클릭
6. **사용 설정** 버튼 클릭 (활성화되어 있는지 확인)

### 2. API 키 제한 설정 확인

1. **APIs & Services** > **Credentials** 메뉴
2. API 키 `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero` 클릭

#### API restrictions (API 제한)
- **Restrict key** 선택된 경우:
  - ✅ **Maps SDK for Android**가 포함되어 있어야 함
  - ✅ **Places API** (사용하는 경우)
- **Don't restrict key** 선택된 경우:
  - ⚠️ 보안상 권장하지 않지만 작동해야 함

#### Application restrictions (애플리케이션 제한)
- **Android apps** 선택된 경우:
  - ✅ 패키지 이름: `com.runwave.app`
  - ✅ SHA-1 인증서 지문: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
  - **둘 다 등록되어 있어야 합니다!**
- **None** 선택된 경우:
  - ⚠️ 보안상 권장하지 않지만 작동해야 함

### 3. SHA-1 인증서 지문 등록 방법

1. Google Cloud Console > APIs & Services > Credentials
2. API 키 선택
3. **Application restrictions** > **Android apps**
4. **+ Add an item** 클릭
5. 패키지 이름 입력: `com.runwave.app`
6. SHA-1 인증서 지문 입력: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
7. **저장** 클릭

**중요:** SHA-1을 등록한 후 몇 분(최대 5-10분) 정도 기다려야 적용됩니다.

## 🔧 문제 해결 단계

### 단계 1: Google Cloud Console 설정 확인
위의 체크리스트를 따라 모든 설정을 확인하세요.

### 단계 2: 환경 변수 확인
`.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY`가 올바르게 설정되어 있는지 확인하세요:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
```

### 단계 3: APK 재빌드
설정을 변경했다면 반드시 APK를 재빌드해야 합니다:

```powershell
# 환경 변수 로드
npm run env:android

# 프로젝트 루트에서
npm run build:android:debug
npm run adb:install
```

### 단계 4: logcat으로 오류 확인
```powershell
npm run debug:logcat
```

다음 오류 메시지를 확인하세요:

#### 오류 1: "API key not found"
**원인:** AndroidManifest.xml에 API 키가 없거나 APK가 재빌드되지 않음
**해결:**
1. AndroidManifest.xml 확인
2. APK 재빌드

#### 오류 2: "API key not valid" 또는 "This IP, site or mobile application is not authorized"
**원인:** Google Cloud Console에서 API 키 제한 설정 문제
**해결:**
1. API restrictions에서 Maps SDK for Android 확인
2. Application restrictions에서 SHA-1 확인
3. SHA-1 등록 후 몇 분 대기

#### 오류 3: 지도가 회색으로 표시됨
**원인:** API 키는 인식되지만 Maps SDK for Android API가 활성화되지 않음
**해결:**
1. Google Cloud Console에서 Maps SDK for Android API 활성화 확인

#### 오류 4: "Authentication failed"
**원인:** SHA-1 인증서 지문이 등록되지 않았거나 잘못 등록됨
**해결:**
1. SHA-1 인증서 지문 재확인
2. Google Cloud Console에 정확히 등록
3. 등록 후 몇 분 대기

### 단계 5: Google Play Services 확인
기기에서 Google Play Services가 설치되어 있고 최신 버전인지 확인:
1. 기기 설정 > 앱 > Google Play Services
2. 업데이트가 필요한 경우 업데이트

## 📝 빠른 체크리스트

- [ ] `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY` 설정됨
- [ ] Google Cloud Console에서 Maps SDK for Android API 활성화됨
- [ ] API 키에 Maps SDK for Android가 포함되어 있음 (API restrictions)
- [ ] Application restrictions에 패키지 이름 등록됨: `com.runwave.app`
- [ ] Application restrictions에 SHA-1 등록됨: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- [ ] AndroidManifest.xml에 API 키 설정됨 (자동으로 설정됨)
- [ ] ProGuard 규칙에 react-native-maps 규칙 추가됨
- [ ] APK 재빌드 완료
- [ ] Google Play Services 최신 버전

## 🚨 가장 흔한 문제

**SHA-1 인증서 지문이 등록되지 않았거나 잘못 등록된 경우**

이것이 가장 흔한 원인입니다. Google Cloud Console에서:
1. API 키 > Application restrictions > Android apps
2. 패키지 이름과 SHA-1이 정확히 등록되어 있는지 확인
3. 등록 후 5-10분 대기

## 📞 추가 도움

문제가 계속되면 다음 정보를 확인하세요:
1. logcat 오류 메시지 전체
2. Google Cloud Console 스크린샷 (API 키 설정 페이지)
3. AndroidManifest.xml 내용

