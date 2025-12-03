# Google 인증 완전 설정 가이드

Android 앱에서 Google 로그인을 처음부터 끝까지 설정하는 완전한 가이드입니다.

## 📋 목차

1. [사전 준비사항](#사전-준비사항)
2. [1단계: Firebase 프로젝트 설정](#1단계-firebase-프로젝트-설정)
3. [2단계: Android 앱 등록](#2단계-android-앱-등록)
4. [3단계: SHA-1 인증서 지문 등록](#3단계-sha-1-인증서-지문-등록)
5. [4단계: Firebase에서 Google 인증 활성화](#4단계-firebase에서-google-인증-활성화)
6. [5단계: OAuth 동의 화면 설정](#5단계-oauth-동의-화면-설정)
7. [6단계: 프로젝트 설정 확인](#6단계-프로젝트-설정-확인)
8. [7단계: 앱 빌드 및 테스트](#7단계-앱-빌드-및-테스트)
9. [문제 해결](#문제-해결)

---

## 사전 준비사항

- ✅ Firebase 프로젝트 생성 완료
- ✅ Google 계정 (Firebase 및 Google Cloud Console 접근)
- ✅ Android 개발 환경 설정 완료
- ✅ `google-services.json` 파일 다운로드 완료

**현재 프로젝트 정보:**
- **Firebase 프로젝트 ID**: `runningapp-a0bff`
- **프로젝트 번호**: `184251732263`
- **Package Name**: `com.runwave.app`

---

## 1단계: Firebase 프로젝트 설정

### 1.1 Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: **RunningApp** (`runningapp-a0bff`)

### 1.2 google-services.json 파일 확인

프로젝트 루트에 `google-services.json` 파일이 있는지 확인:

```json
{
  "project_info": {
    "project_number": "184251732263",
    "project_id": "runningapp-a0bff",
    "storage_bucket": "runningapp-a0bff.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:184251732263:android:ef7e2f972a0e29da965902",
        "android_client_info": {
          "package_name": "com.runwave.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com",
          "client_type": 1,
          "android_info": {
            "package_name": "com.runwave.app",
            "certificate_hash": "5e8f16062ea3cd2c4a0d547876baa6f38cabf625"
          }
        }
      ],
      "api_key": [
        {
          "current_key": "AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero"
        }
      ]
    }
  ]
}
```

**중요 값:**
- **API Key**: `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero`
- **Android App ID**: `1:184251732263:android:ef7e2f972a0e29da965902`
- **OAuth Client ID**: `184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com`

---

## 2단계: Android 앱 등록

### 2.1 Firebase Console에서 Android 앱 추가

1. Firebase Console > **프로젝트 설정** (톱니바퀴 아이콘) 클릭
2. **내 앱** 섹션에서 **Android 앱 추가** 클릭 (이미 추가되어 있다면 스킵)
3. **Android 패키지 이름** 입력: `com.runwave.app`
4. **앱 닉네임** 입력: `RunWave` (선택 사항)
5. **앱 등록** 클릭
6. `google-services.json` 파일 다운로드 (이미 있다면 스킵)

### 2.2 google-services.json 파일 배치

다운로드한 `google-services.json` 파일을 다음 위치에 배치:
- ✅ 프로젝트 루트: `google-services.json`
- ✅ Android 앱 디렉토리: `android/app/google-services.json`

두 파일이 동일한지 확인하세요.

---

## 3단계: SHA-1 인증서 지문 등록

### 3.1 디버그 키스토어 SHA-1 확인

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
     SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
     SHA256: ...
```

**중요:** `SHA1:` 뒤의 값을 복사하세요 (콜론 포함 또는 제거 모두 가능).

**현재 등록된 SHA-1:**
- `5e8f16062ea3cd2c4a0d547876baa6f38cabf625`

### 3.2 Firebase Console에 SHA-1 등록

1. Firebase Console > **프로젝트 설정** (톱니바퀴 아이콘) 클릭
2. **내 앱** 섹션에서 Android 앱 선택
3. **SHA 인증서 지문** 섹션에서 **지문 추가** 클릭
4. 위에서 복사한 SHA-1 값 붙여넣기
5. **저장** 클릭

**참고:**
- SHA-1 등록 후 몇 분 정도 기다려야 적용됩니다
- 디버그와 릴리즈 키스토어의 SHA-1을 모두 등록하는 것을 권장합니다

---

## 4단계: Firebase에서 Google 인증 활성화

### 4.1 Authentication 활성화

1. Firebase Console > **Authentication** 클릭
2. **시작하기** 버튼이 있다면 클릭 (첫 사용 시)

### 4.2 Google Sign-in 활성화

1. **Sign-in method** 탭 클릭
2. 제공업체 목록에서 **Google** 찾기
3. **Google** 행 클릭
4. **사용 설정** 토글을 **ON**으로 변경
5. **프로젝트 지원 이메일** 선택 (필수)
   - 드롭다운에서 개발자 이메일 선택
6. **프로젝트 공개 이름** 입력 (선택 사항): `RunWave`
7. **저장** 버튼 클릭

**확인:**
- Google 행에 **"사용"** 상태 표시 확인

**중요:** Google 인증이 활성화되어 있지 않으면 "The requested action is invalid" 오류가 발생합니다.

---

## 5단계: OAuth 동의 화면 설정

### 5.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 드롭다운에서 **runningapp-a0bff** 선택
   - 프로젝트 번호로 검색: `184251732263`

### 5.2 OAuth 동의 화면 메뉴 접근

1. 왼쪽 메뉴에서 **API 및 서비스** 클릭
2. 하위 메뉴에서 **OAuth 동의 화면** 클릭

### 5.3 사용자 유형 선택 (처음 설정하는 경우)

1. **"외부"** 선택 (일반적으로 개인 개발자나 외부 사용자용)
2. **"만들기"** 버튼 클릭

### 5.4 앱 정보 입력 (1단계: 앱 정보)

다음 필드들을 입력/선택:

- **앱 이름** (필수)
  - 예: `RunWave` 또는 `RunningApp`
  - 사용자에게 표시될 앱 이름

- **사용자 지원 이메일** (필수)
  - 드롭다운에서 개발자 이메일 선택
  - 또는 직접 이메일 주소 입력

- **앱 로고** (선택)
  - 업로드하지 않아도 됨

- **앱 도메인** (선택)
  - 비워두어도 됨

- **승인된 도메인** (자동 추가됨)
  - Firebase 도메인이 자동으로 추가됨: `runningapp-a0bff.firebaseapp.com`
  - 수동으로 추가할 필요 없음

- **개발자 연락처 정보** (필수)
  - 개발자 이메일 주소 입력
  - 예: `your-email@gmail.com`

- **저장 후 계속** 버튼 클릭

### 5.5 범위 설정 (2단계: 범위)

1. **범위 추가 또는 제거** 버튼 클릭
2. 다음 범위들이 추가되어 있는지 확인:
   - ✅ `openid` (OpenID Connect)
   - ✅ `email` (이메일 주소)
   - ✅ `profile` (기본 프로필 정보)

3. 이미 추가되어 있다면 그대로 두기
4. 추가되어 있지 않다면 각 범위를 검색하여 추가
5. **저장 후 계속** 버튼 클릭

### 5.6 테스트 사용자 추가 (3단계: 테스트 사용자)

⚠️ **중요**: 앱이 "테스트" 상태인 경우에만 필요합니다.

1. **+ 사용자 추가** 버튼 클릭
2. 로그인할 Google 계정 이메일 주소 입력
   - 예: `test@gmail.com`
3. **추가** 버튼 클릭
4. 여러 계정을 추가하려면 반복
5. **저장 후 계속** 버튼 클릭

### 5.7 앱 게시 상태 확인

⚠️ **"브랜드가 인증되지 않았습니다" 오류 방지:**

1. 상단에 **"앱 게시 상태"** 또는 **"Publishing status"** 섹션 확인
2. **"테스트"** 또는 **"Testing"** 상태로 유지 (개발 중 권장)
3. **"프로덕션"** 상태라면:
   - **"앱을 테스트로 되돌리기"** 또는 **"BACK TO TESTING"** 버튼 클릭
   - 확인 메시지가 나타나면 **"확인"** 또는 **"Confirm"** 클릭

**테스트 상태의 장점:**
- ✅ 브랜드 인증 불필요
- ✅ 빠르게 테스트 가능
- ✅ 테스트 사용자만 로그인 가능

### 5.8 요약 확인 (4단계: 요약)

1. 설정한 내용을 확인
2. **대시보드로 돌아가기** 버튼 클릭

---

## 6단계: 프로젝트 설정 확인

### 6.1 Firebase 설정 확인

**Firebase Console > 프로젝트 설정**에서 확인:

- ✅ **프로젝트 ID**: `runningapp-a0bff`
- ✅ **프로젝트 번호**: `184251732263`
- ✅ **Android 앱 등록**: `com.runwave.app`
- ✅ **SHA-1 인증서 지문**: 등록됨
- ✅ **API Key**: `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero`

### 6.2 코드 설정 확인

`src/config/firebase.js` 파일에서 다음 값들이 올바른지 확인:

```javascript
{
  apiKey: "AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero",
  authDomain: "runningapp-a0bff.firebaseapp.com",
  projectId: "runningapp-a0bff",
  storageBucket: "runningapp-a0bff.firebasestorage.app",
  messagingSenderId: "184251732263",
  appId: "1:184251732263:android:ef7e2f972a0e29da965902"
}
```

### 6.3 AndroidManifest.xml 확인

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

### 6.4 OAuth Client 확인 (선택 사항)

⚠️ **참고**: OAuth Client가 Google Cloud Console에 표시되지 않을 수 있습니다. 이것은 정상입니다!

- Firebase가 내부적으로 OAuth Client를 관리하므로 Google Cloud Console에 표시되지 않을 수 있습니다
- `google-services.json` 파일에 OAuth Client ID가 있으면 정상입니다
- OAuth 동의 화면만 설정하면 Google 로그인이 작동합니다

---

## 7단계: 앱 빌드 및 테스트

### 7.1 앱 재빌드

SHA-1을 등록하거나 설정을 변경한 후에는 앱을 재빌드해야 합니다:

```powershell
# 환경 변수 로드 (필요한 경우)
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

### 7.2 Google 로그인 테스트

1. 앱을 재설치한 후 Google 로그인 버튼 클릭
2. 브라우저에서 Google 로그인 페이지가 표시되는지 확인
3. "이 앱은 Google에서 확인되지 않았습니다" 경고가 표시되면:
   - **"고급"** 또는 **"Advanced"** 클릭
   - **"계속"** 또는 **"Continue"** 클릭하여 진행
4. Google 계정 선택 및 로그인
5. 정상적으로 앱으로 돌아오는지 확인

---

## 문제 해결

### 문제 1: "The requested action is invalid" 오류

**원인:**
- Firebase Console에서 Google 인증이 활성화되지 않음
- OAuth 동의 화면이 설정되지 않음

**해결:**
1. Firebase Console > Authentication > Sign-in method에서 Google이 "사용" 상태인지 확인
2. Google Cloud Console > API 및 서비스 > OAuth 동의 화면 설정 확인
3. 앱을 "테스트" 상태로 유지
4. 테스트 사용자 목록에 로그인할 계정 추가

### 문제 2: "브랜드가 인증되지 않았습니다" 오류

**원인:**
- OAuth 동의 화면에서 앱이 "프로덕션" 상태

**해결:**
1. Google Cloud Console > API 및 서비스 > OAuth 동의 화면
2. **"앱을 테스트로 되돌리기"** 버튼 클릭
3. 테스트 사용자 목록에 로그인할 계정 추가
4. 경고 메시지에서 "고급" > "계속" 클릭하여 진행

### 문제 3: "dismiss" 타입 브라우저 결과

**원인:**
- 브라우저가 닫혔거나 인증이 완료되지 않음
- Firebase OAuth 설정 문제

**해결:**
1. Firebase Console에서 Google 인증 활성화 확인
2. OAuth 동의 화면 설정 확인
3. SHA-1 인증서 지문 등록 확인
4. 브라우저를 닫지 말고 자동으로 앱으로 돌아오는지 확인

### 문제 4: OAuth Client ID가 보이지 않음

**원인:**
- Google Cloud Console에서 OAuth Client가 표시되지 않음

**해결:**
- 이것은 정상입니다! Firebase가 내부적으로 OAuth Client를 관리합니다
- `google-services.json` 파일에 OAuth Client ID가 있으면 정상입니다
- OAuth 동의 화면만 설정하면 Google 로그인이 작동합니다

### 문제 5: "CONFIGURATION_NOT_FOUND" 오류

**원인:**
- Firebase Console에서 Google 인증이 활성화되지 않음
- SHA-1이 등록되지 않음

**해결:**
1. Firebase Console > Authentication > Sign-in method에서 Google 활성화
2. Firebase Console > 프로젝트 설정 > SHA 인증서 지문에 SHA-1 등록
3. SHA-1 등록 후 몇 분 기다린 후 다시 시도

### 문제 6: SHA-1을 찾을 수 없음

**원인:**
- 키스토어 파일이 없거나 경로가 잘못됨

**해결:**
1. `android/app/debug.keystore` 파일이 있는지 확인
2. 파일이 없다면, Android Studio를 실행하면 자동으로 생성됩니다
3. 또는 다음 명령으로 생성:
   ```powershell
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android
   ```

---

## ✅ 최종 체크리스트

설정이 완료되었는지 확인하세요:

### Firebase Console
- [ ] 프로젝트 설정에서 Android 앱 등록 완료
- [ ] SHA-1 인증서 지문 등록 완료
- [ ] Authentication > Sign-in method에서 Google이 "사용" 상태

### Google Cloud Console
- [ ] OAuth 동의 화면 설정 완료
- [ ] 앱 정보, 범위, 테스트 사용자 모두 설정 완료
- [ ] 앱 게시 상태가 "테스트" 상태

### 프로젝트 파일
- [ ] `google-services.json` 파일이 루트와 `android/app`에 있음
- [ ] `src/config/firebase.js`의 설정이 `google-services.json`과 일치
- [ ] `AndroidManifest.xml`에 intent-filter 설정 확인

### 테스트
- [ ] 앱 재빌드 완료
- [ ] Google 로그인 테스트 성공
- [ ] 브라우저에서 Google 로그인 페이지 정상 표시
- [ ] 로그인 후 앱으로 정상 리디렉션

---

## 📚 참고 자료

- [Firebase Authentication 설정](https://firebase.google.com/docs/auth/android/start)
- [Google OAuth 설정](https://developers.google.com/identity/protocols/oauth2)
- [Firebase API 키 제한](https://firebase.google.com/docs/projects/api-keys)
- [OAuth 동의 화면 설정](https://support.google.com/cloud/answer/10311615)

---

## ⚠️ 중요 사항

1. **Firebase Console에서 Google 인증 활성화**: 가장 중요합니다. 활성화되어 있지 않으면 OAuth가 작동하지 않습니다.

2. **OAuth 동의 화면 설정**: Google Cloud Console에서 OAuth 동의 화면이 설정되어 있어야 합니다.

3. **테스트 상태 유지**: 개발 중에는 앱을 "테스트" 상태로 유지하면 브랜드 인증 없이도 테스트할 수 있습니다.

4. **SHA-1 인증서 지문**: Firebase Console에 디버그 키스토어의 SHA-1이 등록되어 있어야 합니다.

5. **앱 재빌드**: 설정을 변경한 후에는 앱을 재빌드해야 합니다.

---

**설정 완료 후 문제가 발생하면 위의 "문제 해결" 섹션을 참고하세요.**

