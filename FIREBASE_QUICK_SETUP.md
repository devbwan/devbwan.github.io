# Firebase 빠른 설정 가이드

## 🔴 현재 오류 해결하기

**오류**: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

이 오류는 Firebase API 키가 설정되지 않았거나 잘못되었다는 의미입니다.

## 📝 단계별 설정 방법

### 1단계: Firebase Console에서 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `runwave`)
4. Google Analytics 설정 (선택 사항, 추천: 사용)
5. **프로젝트 만들기** 클릭

### 2단계: 웹 앱 등록

1. Firebase Console에서 프로젝트 선택
2. 프로젝트 설정 아이콘(⚙️) 클릭
3. 아래로 스크롤하여 **내 앱** 섹션 확인
4. **웹 아이콘 (</>)** 클릭
5. 앱 닉네임 입력 (예: `RunWave Web`)
6. **앱 등록** 클릭
7. 표시된 설정 정보 복사:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // 👈 이 부분
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3단계: 코드에 설정 입력

**방법 1: 직접 파일 수정 (간단)**

`src/config/firebase.js` 파일 열기:

```javascript
const firebaseConfig = {
  apiKey: "여기에_복사한_API_키_붙여넣기",           // 👈 수정
  authDomain: "여기에_복사한_authDomain_붙여넣기",    // 👈 수정
  projectId: "여기에_복사한_projectId_붙여넣기",      // 👈 수정
  storageBucket: "여기에_복사한_storageBucket_붙여넣기", // 👈 수정
  messagingSenderId: "여기에_복사한_messagingSenderId_붙여넣기", // 👈 수정
  appId: "여기에_복사한_appId_붙여넣기",              // 👈 수정
};
```

**방법 2: 환경 변수 사용 (권장)**

프로젝트 루트에 `.env` 파일 생성:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4단계: Google 인증 활성화

1. Firebase Console에서 프로젝트 선택
2. **Authentication** 메뉴 클릭
3. **Sign-in method** 탭 클릭
4. **Google** 제공업체 클릭
5. **사용 설정** 토글 켜기
6. 프로젝트 공개 이름 입력 (선택)
7. 프로젝트 지원 이메일 선택
8. **저장** 클릭

### 5단계: Firestore 데이터베이스 생성 (선택)

코스 데이터를 사용하려면:

1. **Firestore Database** 메뉴 클릭
2. **데이터베이스 만들기** 클릭
3. **테스트 모드로 시작** 선택 (개발 중)
4. 위치 선택 (예: `asia-northeast3` - 서울)
5. **사용 설정** 클릭

## ✅ 확인 방법

설정 완료 후:

1. 앱 재시작 (웹: 새로고침)
2. 로그인 화면에서 **"Google로 로그인"** 버튼 클릭
3. Google 계정 선택 팝업이 나타나면 성공!

## 🔧 문제 해결

### 여전히 API 키 오류가 나타나는 경우

1. **파일 저장 확인**: `src/config/firebase.js` 파일이 저장되었는지 확인
2. **앱 재시작**: 변경 사항 적용을 위해 앱 재시작
3. **환경 변수 사용 시**: `.env` 파일을 생성하고 서버 재시작
4. **Firebase Console 확인**: API 키가 올바른지 다시 확인

### Google 로그인이 작동하지 않는 경우

1. **Authentication 활성화 확인**: Firebase Console > Authentication > Sign-in method
2. **도메인 설정 확인**: 웹 앱의 도메인이 Firebase에서 허용되었는지 확인

## 📱 게스트 모드 사용

Firebase 설정 없이도 게스트 모드로 앱을 사용할 수 있습니다:
- 모든 기능 사용 가능
- 데이터는 로컬에만 저장
- 클라우드 동기화는 불가

## 💡 팁

- 개발 중에는 테스트 모드로 Firestore를 시작해도 됩니다
- 프로덕션 배포 전에는 보안 규칙을 설정하세요
- API 키는 공개되어도 되지만, Firestore 보안 규칙으로 보호됩니다

