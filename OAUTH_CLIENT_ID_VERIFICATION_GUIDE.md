# OAuth Client ID 정확한 확인 방법 가이드

## 📌 개요

Google OAuth Client ID는 여러 곳에서 확인할 수 있으며, 각각의 용도가 다릅니다. 정확한 값을 확인하는 방법을 안내합니다.

## 🔍 OAuth Client ID 확인 방법

### 방법 1: Firebase Console (권장 ⭐)

**가장 정확하고 권장되는 방법입니다.**

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: **RunningApp** (`runningapp-a0bff`)
3. **Authentication** 메뉴 클릭
4. **Sign-in method** 탭 클릭
5. **Google** 제공업체 클릭
6. **Web SDK 설정** 섹션에서 **Web 클라이언트 ID** 확인

**위치:**
```
Firebase Console > Authentication > Sign-in method > Google > Web SDK 설정 > Web 클라이언트 ID
```

**이 값이 사용해야 하는 값입니다!**

---

### 방법 2: Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: **RunningApp** (`runningapp-a0bff`)
3. **API 및 서비스** > **사용자 인증 정보** 메뉴 클릭
4. **OAuth 2.0 클라이언트 ID** 목록에서 확인

**중요:** 여러 개의 OAuth Client ID가 있을 수 있습니다:
- **Android 앱용** (client_type: 1)
- **웹 애플리케이션용** (client_type: 3) ← **이것을 사용해야 함**

---

### 방법 3: google-services.json 파일

**⚠️ 주의: google-services.json만으로는 부족할 수 있습니다!**

`google-services.json` 파일에서 확인할 수 있는 값:

```json
{
  "client": [
    {
      "oauth_client": [
        {
          "client_id": "184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com",
          "client_type": 1,  // Android OAuth Client ID
          "android_info": {
            "package_name": "com.runwave.app",
            "certificate_hash": "5e8f16062ea3cd2c4a0d547876baa6f38cabf625"
          }
        },
        {
          "client_id": "184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com",
          "client_type": 3  // Web OAuth Client ID ← 이것을 사용해야 함
        }
      ]
    }
  ]
}
```

**문제점:**
- `google-services.json`에는 **Web OAuth Client ID (client_type: 3)**가 포함되어 있지만
- Firebase Console에서 최신 값을 확인하는 것이 더 정확합니다
- Firebase Console에서 값을 변경하면 `google-services.json`이 자동으로 업데이트되지 않을 수 있습니다

---

## ✅ 권장 확인 절차

### 1단계: Firebase Console에서 확인 (최우선)

1. Firebase Console > Authentication > Sign-in method > Google
2. **Web SDK 설정** > **Web 클라이언트 ID** 복사
3. 이 값이 **가장 정확한 값**입니다

### 2단계: google-services.json과 비교

1. `google-services.json` 파일 열기
2. `client_type: 3` (Web OAuth Client ID) 값 확인
3. Firebase Console에서 확인한 값과 일치하는지 확인

**일치하지 않으면:**
- Firebase Console의 값이 최신이므로 Firebase Console 값을 사용
- `google-services.json`을 다시 다운로드하여 업데이트

### 3단계: 환경 변수에 설정

`.env.android` 또는 `.env.web` 파일에 설정:

```env
# Firebase Console > Authentication > Sign-in method > Google > Web 클라이언트 ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com
```

---

## 🔍 현재 프로젝트의 OAuth Client ID

### Web OAuth Client ID (사용 중인 값)

**위치:** Firebase Console > Authentication > Sign-in method > Google

**현재 설정된 값:**
```
184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com
```

**확인 방법:**
1. Firebase Console 접속
2. Authentication > Sign-in method > Google 클릭
3. Web SDK 설정 섹션에서 확인

### Android OAuth Client ID (자동 인식)

**위치:** `google-services.json`의 `client_type: 1`

**값:**
```
184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com
```

**참고:** Android OAuth Client ID는 `expo-auth-session`이 `google-services.json`에서 자동으로 인식하므로 코드에서 직접 설정할 필요가 없습니다.

---

## ⚠️ 중요 사항

### 1. google-services.json만으로는 부족합니다

**이유:**
- Firebase Console에서 값을 변경하면 `google-services.json`이 자동으로 업데이트되지 않을 수 있음
- Firebase Console의 값이 항상 최신 값임
- `google-services.json`은 Android 앱 설정용 파일이며, Web OAuth Client ID는 별도로 관리됨

### 2. 항상 Firebase Console에서 확인하세요

**권장 순서:**
1. ✅ Firebase Console에서 확인 (최우선)
2. ✅ google-services.json과 비교
3. ✅ 환경 변수에 설정

### 3. 여러 OAuth Client ID가 있을 수 있습니다

**구분:**
- **Android OAuth Client ID** (client_type: 1): SHA-1 기반 앱 인증용
- **Web OAuth Client ID** (client_type: 3): Firebase Auth token exchange용 ← **이것을 사용**

---

## 🛠️ 확인 스크립트

프로젝트 루트에서 실행하여 현재 설정된 값 확인:

```bash
# 환경 변수 확인
node -e "console.log('Web Client ID:', process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'NOT SET')"

# google-services.json에서 확인
node -e "const fs = require('fs'); const json = JSON.parse(fs.readFileSync('google-services.json', 'utf8')); const webClient = json.client[0].oauth_client.find(c => c.client_type === 3); console.log('google-services.json Web Client ID:', webClient?.client_id || 'NOT FOUND');"
```

---

## 📋 체크리스트

- [ ] Firebase Console > Authentication > Sign-in method > Google에서 Web 클라이언트 ID 확인
- [ ] `google-services.json`의 `client_type: 3` 값과 비교
- [ ] 환경 변수 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`에 올바른 값 설정
- [ ] 앱 재시작 후 로그인 테스트

---

## 🔗 관련 문서

- [Google Login 완전 리팩토링 가이드](./GOOGLE_LOGIN_COMPLETE_REFACTOR.md)
- [환경 변수 설정 가이드](./ENV_COMPLETE_SETUP.md)
- [Google 인증 설정 가이드](./GOOGLE_AUTH_COMPLETE_SETUP.md)

---

**마지막 업데이트**: 2024년

