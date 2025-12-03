# NPM 스크립트 가이드

프로젝트에서 사용할 수 있는 모든 npm 명령어를 정리한 가이드입니다.

## 📋 스크립트 목록

### 🚀 개발 서버

#### 기본 개발 서버
```bash
npm start          # Expo 개발 서버 시작 (플랫폼 선택 가능)
npm run dev        # start와 동일
```

#### 플랫폼별 개발 서버
```bash
npm run dev:web      # 웹 개발 서버 시작 (.env.web 자동 로드)
npm run dev:android  # Android 개발 서버 시작 (.env.android 자동 로드)
npm run dev:ios      # iOS 개발 서버 시작
```

---

### 🌍 환경 변수 관리

```bash
npm run env:web      # .env.web 파일을 .env로 복사
npm run env:android # .env.android 파일을 .env로 복사
```

**사용 예시:**
- 개발 서버 실행 시 자동으로 환경 변수를 로드합니다
- 수동으로 환경 변수를 변경하려면 위 명령어를 실행한 후 개발 서버를 시작하세요

---

### 📦 빌드

#### 웹 빌드
```bash
npm run build:web   # 웹 프로덕션 빌드 (GitHub Pages 배포용)
```

#### Android 빌드
```bash
# 로컬 빌드
npm run build:android:debug    # 디버그 APK 빌드
npm run build:android:release # 릴리즈 APK 빌드

# EAS 빌드 (클라우드)
npm run build:android:eas:preview     # EAS Preview 빌드
npm run build:android:eas:production  # EAS Production 빌드
```

**빌드 파일 위치:**
- 디버그 APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- 릴리즈 APK: `android/app/build/outputs/apk/release/app-release.apk`

---

### 🚢 배포

```bash
npm run deploy  # GitHub Pages에 배포
```

**배포 프로세스:**
1. 웹 빌드 생성 (`build:web`)
2. GitHub Pages HTML 수정 (`fix:gh-pages`)
3. GitHub Pages에 배포

---

### 🧹 정리

```bash
npm run android:clean  # Android Gradle 캐시 정리
```

---

### 🐛 디버깅

#### 로그 확인
```bash
npm run logcat         # 앱 로그만 필터링하여 표시
npm run logcat:all     # 모든 로그 표시
npm run logcat:react   # React Native 로그만 표시
npm run logcat:clear   # 로그 캐시 지우기
npm run logcat:save    # 로그를 logcat.txt 파일로 저장
```

#### ADB 명령어
```bash
npm run adb:install    # 디버그 APK 설치
npm run adb:uninstall  # 앱 제거
npm run adb:devmenu    # 개발자 메뉴 열기
npm run adb:reload     # 앱 리로드
```

---

## 📝 사용 시나리오

### 시나리오 1: 웹 개발 시작

```bash
# 1. 환경 변수 설정 (처음 한 번만)
# .env.web 파일 생성 및 설정

# 2. 개발 서버 시작
npm run dev:web
```

### 시나리오 2: Android 개발 시작

```bash
# 1. 환경 변수 설정 (처음 한 번만)
# .env.android 파일 생성 및 설정

# 2. 개발 서버 시작
npm run dev:android
```

### 시나리오 3: Android APK 빌드 및 설치

```bash
# 1. 디버그 APK 빌드
npm run build:android:debug

# 2. APK 설치
npm run adb:install

# 3. 로그 확인
npm run logcat
```

### 시나리오 4: 웹 배포

```bash
# GitHub Pages에 배포
npm run deploy
```

### 시나리오 5: 문제 해결

```bash
# 1. 로그 확인
npm run logcat

# 2. 앱 재설치
npm run adb:uninstall
npm run build:android:debug
npm run adb:install

# 3. Gradle 캐시 정리
npm run android:clean
```

---

## 🔄 스크립트 변경 이력

### 정리된 스크립트

**이전:**
- `web:setup` → `dev:web`
- `android:setup` → `dev:android`
- `build:apk:local:debug` → `build:android:debug`
- `build:apk:local` → `build:android:release`
- `debug:logcat` → `logcat`
- `debug:install` → `adb:install`
- `gradle:clean` → `android:clean`

**제거된 스크립트:**
- `web:local` (사용 빈도 낮음)
- `env:local` (사용 빈도 낮음)
- `debug:full` (직접 조합 가능)
- `fix:gh-pages` (deploy에 통합)
- `predeploy` (deploy에 통합)

---

## ⚠️ 주의사항

1. **환경 변수 설정 필수**
   - 웹 개발: `.env.web` 파일 필요
   - Android 개발: `.env.android` 파일 필요
   - 자세한 내용은 `ENV_COMPLETE_SETUP.md` 참고

2. **플랫폼별 빌드**
   - 웹 빌드는 `.env.web` 사용
   - Android 빌드는 `.env.android` 사용

3. **ADB 명령어**
   - Android 기기가 연결되어 있어야 합니다
   - USB 디버깅이 활성화되어 있어야 합니다

---

## 📚 관련 문서

- [환경 변수 설정 가이드](./ENV_COMPLETE_SETUP.md)
- [Firebase 설정 가이드](./FIREBASE_COMPLETE_SETUP.md)
- [Android 빌드 가이드](./APK_BUILD_GUIDE.md)

---

**자주 사용하는 명령어:**
- 개발: `npm run dev:web` 또는 `npm run dev:android`
- 빌드: `npm run build:android:debug`
- 배포: `npm run deploy`
- 로그: `npm run logcat`


