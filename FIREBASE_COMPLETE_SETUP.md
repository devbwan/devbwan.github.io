# Firebase 완전 설정 가이드

Firebase 프로젝트 설정부터 코드 연동까지 모든 단계를 포함한 완전한 가이드입니다.

## 📋 목차

1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [웹 앱 등록](#2-웹-앱-등록)
3. [Android 앱 등록](#3-android-앱-등록)
4. [Firebase 설정 파일 다운로드](#4-firebase-설정-파일-다운로드)
5. [코드에 Firebase 설정 적용](#5-코드에-firebase-설정-적용)
6. [Firestore 데이터베이스 생성](#6-firestore-데이터베이스-생성)
7. [보안 규칙 설정](#7-보안-규칙-설정)
8. [OAuth 도메인 설정](#8-oauth-도메인-설정)
9. [설정 검증](#9-설정-검증)
10. [문제 해결](#10-문제-해결)

---

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 프로젝트 생성

1. **프로젝트 추가** 클릭
2. 프로젝트 이름 입력 (예: `RunningApp`)
3. Google Analytics 설정 (선택 사항, 추천: 사용)
4. **프로젝트 만들기** 클릭

**현재 프로젝트 정보:**
- **프로젝트 이름**: `RunningApp`
- **프로젝트 ID**: `runningapp-a0bff`
- **프로젝트 번호**: `184251732263`

---

## 2. 웹 앱 등록

### 2.1 웹 앱 추가

1. Firebase Console에서 프로젝트 선택
2. 프로젝트 설정 아이콘(⚙️) 클릭
3. **내 앱** 섹션에서 **웹 아이콘 (</>)** 클릭
4. 앱 닉네임 입력 (예: `RunWave Web`)
5. **앱 등록** 클릭

### 2.2 Firebase 설정 정보 복사

표시된 설정 정보를 복사하세요:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "runningapp-a0bff.firebaseapp.com",
  projectId: "runningapp-a0bff",
  storageBucket: "runningapp-a0bff.firebasestorage.app",
  messagingSenderId: "184251732263",
  appId: "1:184251732263:web:65a0f2d5b48e3409965902",
  measurementId: "G-2VG59SE6H7" // Analytics 사용 시
};
```

---

## 3. Android 앱 등록

### 3.1 Android 앱 추가

1. Firebase Console > 프로젝트 설정
2. **내 앱** 섹션에서 **Android 아이콘** 클릭
3. **Android 패키지 이름** 입력: `com.runwave.app`
4. **앱 닉네임** 입력 (선택 사항): `RunWave`
5. **앱 등록** 클릭

### 3.2 google-services.json 다운로드

1. **google-services.json** 파일 다운로드 버튼 클릭
2. 다운로드한 파일을 다음 위치에 배치:
   - ✅ 프로젝트 루트: `google-services.json`
   - ✅ Android 앱 디렉토리: `android/app/google-services.json`

**중요:** 두 파일이 동일한지 확인하세요.

---

## 4. Firebase 설정 파일 다운로드

### 4.1 google-services.json 확인

다운로드한 `google-services.json` 파일의 주요 정보:

```json
{
  "project_info": {
    "project_number": "184251732263",
    "project_id": "runningapp-a0bff",
    "storage_bucket": "runningapp-a0bff.firebasestorage.app"
  },
  "client": [{
    "client_info": {
      "mobilesdk_app_id": "1:184251732263:android:ef7e2f972a0e29da965902",
      "android_client_info": {
        "package_name": "com.runwave.app"
      }
    },
    "api_key": [{
      "current_key": "AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero"
    }]
  }]
}
```

**중요 값:**
- **API Key**: `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero`
- **Android App ID**: `1:184251732263:android:ef7e2f972a0e29da965902`
- **Project ID**: `runningapp-a0bff`

---

## 5. 코드에 Firebase 설정 적용

### 5.1 방법 1: 환경 변수 사용 (권장)

프로젝트 루트에 `.env.web` 또는 `.env.android` 파일 생성:

**`.env.web` 파일:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:web:65a0f2d5b48e3409965902
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2VG59SE6H7
```

**`.env.android` 파일:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=runningapp-a0bff.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=runningapp-a0bff
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=runningapp-a0bff.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=184251732263
EXPO_PUBLIC_FIREBASE_APP_ID=1:184251732263:android:ef7e2f972a0e29da965902
```

### 5.2 방법 2: 직접 파일 수정

`src/config/firebase.js` 파일에서 직접 수정:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero",
  authDomain: "runningapp-a0bff.firebaseapp.com",
  projectId: "runningapp-a0bff",
  storageBucket: "runningapp-a0bff.firebasestorage.app",
  messagingSenderId: "184251732263",
  appId: Platform.OS === 'web' 
    ? "1:184251732263:web:65a0f2d5b48e3409965902"
    : "1:184251732263:android:ef7e2f972a0e29da965902",
  measurementId: "G-2VG59SE6H7"
};
```

**참고:** 현재 코드는 `google-services.json`의 값을 우선적으로 사용하도록 설정되어 있습니다.

---

## 6. Firestore 데이터베이스 생성

### 6.1 데이터베이스 생성

1. Firebase Console > **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **테스트 모드로 시작** 선택 (개발 중)
4. 위치 선택: **asia-northeast3** (서울) 권장
5. **사용 설정** 클릭

### 6.2 테스트 데이터 추가 (선택)

Firebase Console > Firestore Database에서 수동으로 테스트 코스 추가:

```javascript
{
  name: "한강 러닝 코스",
  description: "여의도에서 잠실까지 약 10km 코스",
  distance: 10000,
  difficulty: "easy",
  visibility: "public",
  runnerCount: 1250,
  rating: 4.5,
  reviewCount: 89,
  coordinates: [
    { lat: 37.5295, lng: 126.9344 },
    { lat: 37.5320, lng: 126.9400 }
  ],
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

## 7. 보안 규칙 설정

### 7.1 Firestore 보안 규칙

Firebase Console > Firestore Database > **규칙** 탭:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 코스 컬렉션 - 모든 사용자가 공개 코스 읽기 가능
    match /courses/{courseId} {
      allow read: if resource.data.visibility == 'public';
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // 러닝 세션 컬렉션 - 본인만 읽기/쓰기
    match /running_sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // 경로 포인트 컬렉션 - 본인만 읽기/쓰기
    match /route_points/{pointId} {
      allow read, write: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/running_sessions/$(resource.data.sessionId)).data.userId;
    }
  }
}
```

**게시** 버튼 클릭하여 저장

---

## 8. OAuth 도메인 설정

### 8.1 승인된 도메인 추가

GitHub Pages 배포 후 OAuth 로그인을 사용하려면:

1. Firebase Console > **Authentication** > **Settings** (⚙️)
2. **Authorized domains** 섹션으로 스크롤
3. **Add domain** 버튼 클릭
4. 도메인 입력 (예: `devbwan.github.io`)
5. **Add** 버튼 클릭

**기본 도메인 (자동 추가됨):**
- `localhost`
- `runningapp-a0bff.firebaseapp.com`
- `runningapp-a0bff.web.app`

**추가해야 할 도메인:**
- `devbwan.github.io` (GitHub Pages)

**중요:** 프로토콜(`https://`)을 제외하고 도메인만 입력하세요.

---

## 9. 설정 검증

### 9.1 google-services.json과 코드 설정 일치 확인

| 설정 항목 | google-services.json | firebase.js | 상태 |
|---------|---------------------|-------------|------|
| **API Key** | `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero` | `AIzaSyCO5DB-x_bkLxyabKiEGm3bnW-3d8hTero` | ✅ 일치 |
| **Project ID** | `runningapp-a0bff` | `runningapp-a0bff` | ✅ 일치 |
| **Auth Domain** | `runningapp-a0bff.firebaseapp.com` | `runningapp-a0bff.firebaseapp.com` | ✅ 일치 |
| **Storage Bucket** | `runningapp-a0bff.firebasestorage.app` | `runningapp-a0bff.firebasestorage.app` | ✅ 일치 |
| **Messaging Sender ID** | `184251732263` | `184251732263` | ✅ 일치 |
| **Android App ID** | `1:184251732263:android:ef7e2f972a0e29da965902` | `1:184251732263:android:ef7e2f972a0e29da965902` | ✅ 일치 |

### 9.2 파일 위치 확인

- ✅ `google-services.json` (루트)
- ✅ `android/app/google-services.json`
- ✅ `src/config/firebase.js`

### 9.3 Firebase Console 확인

- ✅ Firebase 프로젝트 생성 완료
- ✅ 웹 앱 등록 완료
- ✅ Android 앱 등록 완료
- ✅ Firestore 데이터베이스 생성 완료
- ✅ 보안 규칙 설정 완료
- ✅ OAuth 도메인 추가 완료

---

## 10. 문제 해결

### 문제 1: "API key not valid" 오류

**원인:**
- Firebase API 키가 설정되지 않았거나 잘못됨

**해결:**
1. Firebase Console에서 올바른 API 키 확인
2. `src/config/firebase.js` 또는 `.env` 파일에 올바른 값 입력
3. 앱 재시작

### 문제 2: "The current domain is not authorized" 오류

**원인:**
- OAuth 도메인이 승인되지 않음

**해결:**
1. Firebase Console > Authentication > Settings > Authorized domains
2. 사용 중인 도메인 추가 (예: `devbwan.github.io`)
3. 브라우저 캐시 클리어 후 재시도

### 문제 3: Firestore 접근 오류

**원인:**
- 보안 규칙이 너무 엄격하거나 데이터베이스가 생성되지 않음

**해결:**
1. Firebase Console > Firestore Database에서 데이터베이스 생성 확인
2. 보안 규칙이 올바르게 설정되었는지 확인
3. 테스트 모드로 시작했는지 확인

### 문제 4: google-services.json 파일 불일치

**원인:**
- 루트와 `android/app/`의 파일이 다름

**해결:**
1. Firebase Console에서 최신 `google-services.json` 다운로드
2. 두 위치에 동일한 파일 복사
3. 앱 재빌드

---

## ✅ 최종 체크리스트

- [ ] Firebase 프로젝트 생성 완료
- [ ] 웹 앱 등록 완료
- [ ] Android 앱 등록 완료
- [ ] `google-services.json` 파일 다운로드 및 배치 완료
- [ ] 코드에 Firebase 설정 적용 완료
- [ ] Firestore 데이터베이스 생성 완료
- [ ] 보안 규칙 설정 완료
- [ ] OAuth 도메인 추가 완료
- [ ] 설정 검증 완료
- [ ] 앱 테스트 성공

---

## 📚 관련 문서

- [Google 인증 설정 가이드](./GOOGLE_AUTH_COMPLETE_SETUP.md)
- [환경 변수 설정 가이드](./ENV_COMPLETE_SETUP.md)
- [Firestore 설정 가이드](./FIRESTORE_SETUP.md)

---

## ⚠️ 중요 사항

1. **API 키 보안**: API 키는 공개되어도 되지만, Firestore 보안 규칙으로 보호됩니다.
2. **환경 변수**: `.env.web`와 `.env.android` 파일은 Git에 커밋하지 마세요.
3. **프로덕션 배포**: 프로덕션 배포 전에는 보안 규칙을 더 엄격하게 설정하세요.
4. **google-services.json**: 이 파일은 Git에 포함되어도 되지만, 실제 API 키가 포함되어 있으므로 주의하세요.

---

**설정 완료 후 문제가 발생하면 위의 "문제 해결" 섹션을 참고하세요.**

