# 환경 변수 완전 설정 가이드

웹과 Android 환경에서 각각 다른 설정을 사용할 수 있도록 환경 변수를 설정하는 완전한 가이드입니다.

## 📋 목차

1. [환경 변수 파일 구조](#1-환경-변수-파일-구조)
2. [환경 변수 파일 생성](#2-환경-변수-파일-생성)
3. [필수 환경 변수 설정](#3-필수-환경-변수-설정)
4. [환경 변수 사용 방법](#4-환경-변수-사용-방법)
5. [플랫폼별 설정](#5-플랫폼별-설정)
6. [문제 해결](#6-문제-해결)

---

## 1. 환경 변수 파일 구조

프로젝트 루트에 다음 파일들을 생성하세요:

```
ai-running-app/
├── .env.example          # 환경 변수 예시 파일 (Git에 포함) ✅
├── .env.web              # 웹 환경 설정 (Git에 포함하지 않음) ⚠️
├── .env.android          # Android 환경 설정 (Git에 포함하지 않음) ⚠️
└── .env.local            # 로컬 개발 환경 (선택 사항) ⚠️
```

**중요:**
- `.env.example`은 Git에 포함됩니다 (템플릿)
- `.env.web`, `.env.android`, `.env.local`은 Git에 포함하지 않습니다 (`.gitignore`에 포함됨)

---

## 2. 환경 변수 파일 생성

### 2.1 .env.example 파일 확인

프로젝트 루트에 `.env.example` 파일이 있는지 확인하세요. 이 파일은 템플릿으로 사용됩니다.

### 2.2 .env.web 파일 생성

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.web
# 또는
New-Item .env.web -ItemType File
```

**macOS/Linux:**
```bash
cp .env.example .env.web
# 또는
touch .env.web
```

### 2.3 .env.android 파일 생성

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.android
# 또는
New-Item .env.android -ItemType File
```

**macOS/Linux:**
```bash
cp .env.example .env.android
# 또는
touch .env.android
```

---

## 3. 필수 환경 변수 설정

### 3.1 .env.web 파일 설정

`.env.web` 파일을 열고 다음 내용을 입력하세요:

```env
# 웹 환경 Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:web:65a0f2d5b48e3409965902
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2VG59SE6H7

# Google OAuth Client ID (웹용)
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=184251732263-83kt98h7ceiervojh7ial5e35d5oq290.apps.googleusercontent.com

# Naver OAuth Client ID (웹용, 선택 사항)
EXPO_PUBLIC_NAVER_CLIENT_ID_WEB=your-naver-client-id-web

# 환경 설정
EXPO_PUBLIC_ENV=development
```

### 3.2 .env.android 파일 설정

`.env.android` 파일을 열고 다음 내용을 입력하세요:

```env
# Android 환경 Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:android:ef7e2f972a0e29da965902

# Google OAuth Client ID (Android용)
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=184251732263-lfhppnmo7nhn7i2gakpdshs51pqfeqoo.apps.googleusercontent.com

# Naver OAuth Client ID (Android용, 선택 사항)
EXPO_PUBLIC_NAVER_CLIENT_ID_ANDROID=your-naver-client-id-android

# 환경 설정
EXPO_PUBLIC_ENV=development
```

**중요 값 확인:**
- Firebase 설정 값은 `google-services.json` 파일과 일치해야 합니다
- OAuth Client ID는 Firebase Console 또는 Google Cloud Console에서 확인하세요
- **Google Maps API Key**: `EXPO_PUBLIC_FIREBASE_API_KEY`와 동일한 값을 사용합니다 (자동으로 설정됨)

---

## 4. 환경 변수 사용 방법

### 4.1 자동 로드 (권장)

Expo는 자동으로 `.env`, `.env.local`, `.env.development`, `.env.production` 등의 파일을 로드합니다.

플랫폼별로 다른 파일을 사용하려면 스크립트를 사용하세요:

**package.json에 스크립트 추가:**
```json
{
  "scripts": {
    "env:web": "copy .env.web .env",
    "env:android": "copy .env.android .env",
    "web:setup": "npm run env:web && npm run web",
    "android:setup": "npm run env:android && npm run android"
  }
}
```

**macOS/Linux의 경우:**
```json
{
  "scripts": {
    "env:web": "cp .env.web .env",
    "env:android": "cp .env.android .env"
  }
}
```

### 4.2 수동 로드

**웹 환경 실행:**
```powershell
# Windows
Copy-Item .env.web .env
npm run web

# macOS/Linux
cp .env.web .env
npm run web
```

**Android 환경 실행:**
```powershell
# Windows
Copy-Item .env.android .env
npm run android

# macOS/Linux
cp .env.android .env
npm run android
```

### 4.3 코드에서 환경 변수 사용

`src/config/firebase.js`에서 환경 변수를 자동으로 로드합니다:

```javascript
import { firebaseConfig } from '../config/firebase';

// 플랫폼별로 다른 Firebase 설정이 자동으로 로드됩니다
console.log('API Key:', firebaseConfig.apiKey);
```

`src/config/env.js`에서 환경 변수를 직접 사용할 수 있습니다:

```javascript
import env from '../config/env';

// 플랫폼 확인
console.log('Platform:', env.platform); // 'web' 또는 'android'

// Firebase 설정 접근
console.log('Project ID:', env.firebase.projectId);

// 플랫폼별 Google OAuth Client ID
const googleClientId = env.getGoogleClientId();

// 환경 확인
if (env.isDevelopment) {
  console.log('개발 모드');
}
```

---

## 5. 플랫폼별 설정

### 5.1 웹 환경

**로컬 개발:**
```powershell
npm run env:web
npm run web
```

**프로덕션 빌드:**
```powershell
npm run env:web
npm run build:web
```

### 5.2 Android 환경

**로컬 개발:**
```powershell
npm run env:android
npm run android
```

**프로덕션 빌드:**
```powershell
npm run env:android
npm run build:apk:local:debug
```

---

## 6. 문제 해결

### 문제 1: 환경 변수가 로드되지 않음

**원인:**
- 파일 이름이 잘못됨
- 변수 이름에 `EXPO_PUBLIC_` 접두사가 없음
- 앱이 재시작되지 않음

**해결:**
1. 파일 이름 확인: `.env.web`, `.env.android` 또는 `.env`
2. 변수 이름 확인: `EXPO_PUBLIC_` 접두사 필수
3. 앱 재시작: 환경 변수 변경 후 Expo 서버 재시작 필요
4. 캐시 클리어: `npx expo start --clear`

### 문제 2: 플랫폼별 다른 값 사용하기

코드에서 플랫폼을 확인하여 다른 설정을 사용할 수 있습니다:

```javascript
import { Platform } from 'react-native';

const config = Platform.OS === 'web' 
  ? webConfig 
  : androidConfig;
```

### 문제 3: 환경 변수 값이 undefined

**원인:**
- 환경 변수가 설정되지 않음
- 파일이 올바른 위치에 없음

**해결:**
1. `.env.web` 또는 `.env.android` 파일이 프로젝트 루트에 있는지 확인
2. 변수 이름이 정확한지 확인 (`EXPO_PUBLIC_` 접두사 포함)
3. 파일 형식이 올바른지 확인 (공백, 따옴표 등)

---

## ✅ 체크리스트

- [ ] `.env.example` 파일 확인
- [ ] `.env.web` 파일 생성 및 설정 완료
- [ ] `.env.android` 파일 생성 및 설정 완료
- [ ] 모든 필수 환경 변수 입력 완료
- [ ] Firebase 설정 값이 `google-services.json`과 일치하는지 확인
- [ ] 환경 변수 로드 테스트 완료
- [ ] 웹 환경에서 환경 변수 사용 확인
- [ ] Android 환경에서 환경 변수 사용 확인

---

## 🔐 보안 주의사항

1. **`.env.web`와 `.env.android` 파일은 Git에 커밋하지 마세요**
   - 이미 `.gitignore`에 포함되어 있습니다.

2. **환경 변수 이름 규칙**
   - Expo에서 환경 변수를 사용하려면 `EXPO_PUBLIC_` 접두사가 필요합니다.
   - 예: `EXPO_PUBLIC_FIREBASE_API_KEY`

3. **프로덕션 환경**
   - 프로덕션 빌드에서는 환경 변수가 번들에 포함됩니다.
   - 민감한 정보는 환경 변수에 넣지 마세요.
   - Firebase 설정은 공개되어도 괜찮지만, 실제 비밀 키는 서버에서 관리하세요.

---

## 📚 관련 문서

- [Firebase 완전 설정 가이드](./FIREBASE_COMPLETE_SETUP.md)
- [Google 인증 설정 가이드](./GOOGLE_AUTH_COMPLETE_SETUP.md)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**설정 완료 후 문제가 발생하면 위의 "문제 해결" 섹션을 참고하세요.**

