# Google Maps 지도 표시 문제 해결 체크리스트

## 📌 중요: Maps API Key 통일

**Google Maps API Key는 Firebase API Key와 동일한 값을 사용합니다.**
- Maps API Key는 `EXPO_PUBLIC_FIREBASE_API_KEY` 환경 변수에서 자동으로 가져옵니다
- 별도의 Maps API Key 설정이 필요 없습니다
- `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY`가 설정되어 있으면 자동으로 적용됩니다

## 🔍 현재 상태 확인

### 1. SHA-1 인증서 지문
디버그 키스토어 SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### 2. AndroidManifest.xml 확인
✅ Google Maps API 키가 설정되어 있음:
```xml
<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero"/>
```

**참고:** API Key는 `plugins/withGoogleMapsApiKey.js` 플러그인을 통해 `EXPO_PUBLIC_FIREBASE_API_KEY` 환경 변수에서 자동으로 설정됩니다.

### 3. 환경 변수 확인
✅ `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY`가 설정되어 있어야 합니다:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
```

### 4. ProGuard 규칙
✅ `android/app/proguard-rules.pro`에 react-native-maps 규칙 추가됨

## ✅ Google Cloud Console 설정 확인

### 1. API 키 확인
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: `runningapp-a0bff` (또는 해당 프로젝트)
3. **APIs & Services** > **Credentials** 메뉴로 이동
4. API 키 `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero` 확인

### 2. Maps SDK for Android 활성화
1. **APIs & Services** > **Library** 메뉴로 이동
2. "Maps SDK for Android" 검색
3. **Maps SDK for Android** 클릭
4. **사용 설정** 버튼 클릭 (활성화되어 있는지 확인)

### 3. API 키 제한 설정 확인
1. **APIs & Services** > **Credentials** 메뉴
2. API 키 `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero` 클릭
3. **API restrictions** 섹션 확인:
   - **Restrict key** 선택되어 있는 경우:
     - ✅ **Maps SDK for Android**가 포함되어 있는지 확인
   - **Don't restrict key** 선택되어 있는 경우:
     - ⚠️ 보안상 권장하지 않지만, 테스트 목적으로는 작동해야 함

### 4. Application restrictions 확인
1. **Application restrictions** 섹션 확인:
   - **Android apps** 선택되어 있는 경우:
     - ✅ 패키지 이름: `com.runwave.app`
     - ✅ SHA-1 인증서 지문: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
     - 둘 다 등록되어 있어야 함!
   - **None** 선택되어 있는 경우:
     - ⚠️ 보안상 권장하지 않지만, 테스트 목적으로는 작동해야 함

## 🔧 문제 해결 단계

### 단계 1: Google Cloud Console 설정 확인
위의 체크리스트를 따라 Google Cloud Console 설정을 확인하세요.

### 단계 2: 환경 변수 확인
`.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY`가 올바르게 설정되어 있는지 확인하세요:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
```

### 단계 3: APK 재빌드
AndroidManifest.xml이나 ProGuard 규칙을 수정했다면 반드시 재빌드해야 합니다:

```powershell
# 환경 변수 로드
npm run env:android

# 클린 빌드
npm run android:clean

# 디버그 APK 빌드
npm run build:android:debug

# APK 설치
npm run adb:install
```

### 단계 4: logcat으로 오류 확인
```powershell
npm run debug:logcat
```

다음 오류 메시지를 확인하세요:
- `API key not found` → AndroidManifest.xml 확인
- `API key not valid` → Google Cloud Console에서 API 키 확인
- `Authentication failed` → SHA-1 인증서 지문 등록 확인
- `This IP, site or mobile application is not authorized` → Application restrictions 확인

### 단계 5: Google Play Services 확인
기기에서 Google Play Services가 설치되어 있고 최신 버전인지 확인:
1. 기기 설정 > 앱 > Google Play Services
2. 업데이트가 필요한 경우 업데이트

## 📝 체크리스트

- [ ] `.env.android` 파일에 `EXPO_PUBLIC_FIREBASE_API_KEY` 설정됨
- [ ] Google Cloud Console에서 Maps SDK for Android API 활성화됨
- [ ] API 키에 Maps SDK for Android가 포함되어 있음 (API restrictions)
- [ ] Application restrictions에 패키지 이름과 SHA-1 등록됨
- [ ] AndroidManifest.xml에 API 키 설정됨 (자동으로 설정됨)
- [ ] ProGuard 규칙에 react-native-maps 규칙 추가됨
- [ ] APK 재빌드 완료
- [ ] Google Play Services 최신 버전

## 🚨 자주 발생하는 문제

### 문제 1: "API key not found"
**원인:** AndroidManifest.xml에 API 키가 없거나 APK가 재빌드되지 않음
**해결:** 
1. AndroidManifest.xml 확인
2. APK 재빌드

### 문제 2: "API key not valid"
**원인:** Google Cloud Console에서 API 키 제한 설정 문제
**해결:**
1. API restrictions에서 Maps SDK for Android 확인
2. Application restrictions에서 SHA-1 확인

### 문제 3: 지도가 회색으로 표시됨
**원인:** API 키는 인식되지만 Maps SDK for Android API가 활성화되지 않음
**해결:**
1. Google Cloud Console에서 Maps SDK for Android API 활성화 확인

### 문제 4: 빌드 시에는 작동하지만 APK에서는 작동하지 않음
**원인:** ProGuard/R8 최적화로 인한 코드 제거
**해결:**
1. ProGuard 규칙 확인
2. `debuggableVariants = []` 설정 확인

