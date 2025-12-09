# Expo EAS Build 자동화 가이드

## 📋 개요

Expo EAS Build를 사용하여 Android 앱을 자동으로 빌드하고 배포하는 방법을 안내합니다.

## 🔧 사전 준비

### 1. EAS CLI 설치

```bash
npm install -g eas-cli
```

### 2. Expo 계정 로그인

```bash
eas login
```

### 3. 프로젝트 설정

```bash
eas build:configure
```

이 명령어는 `eas.json` 파일을 생성하거나 업데이트합니다.

## 📝 EAS Build 프로필 설정

`eas.json` 파일에서 빌드 프로필을 확인하세요:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🚀 빌드 실행

### 로컬에서 빌드

```bash
# Preview 빌드
npm run build:android:eas:preview

# Production 빌드
npm run build:android:eas:production
```

### GitHub Actions를 통한 자동 빌드

`.github/workflows/build.yml` 파일이 자동으로 빌드를 실행합니다.

**필수 GitHub Secrets 설정:**

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `EXPO_TOKEN`: Expo 계정 토큰 (https://expo.dev/accounts/[username]/settings/access-tokens)
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `GOOGLE_WEB_CLIENT_ID`

## 📦 빌드 결과 확인

### EAS 웹 대시보드

1. https://expo.dev/ 접속
2. 프로젝트 선택
3. Builds 탭에서 빌드 상태 확인

### 빌드 다운로드

빌드가 완료되면:
- 이메일 알림 수신
- EAS 대시보드에서 APK 다운로드 링크 확인
- 또는 CLI로 다운로드:

```bash
eas build:list
eas build:download [build-id]
```

## 🔄 자동화 워크플로우

### 1. 코드 푸시 시 자동 빌드

```yaml
# .github/workflows/build.yml
on:
  push:
    branches:
      - master
```

### 2. 수동 빌드 트리거

GitHub Actions → Actions 탭 → "Build and Deploy" → "Run workflow"

## ⚙️ 환경 변수 설정

### 로컬 빌드

`.env.android` 파일에 환경 변수 설정:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
# ... 기타 변수
```

### CI/CD 빌드

GitHub Secrets에 환경 변수 설정 (위 참고)

## 🐛 문제 해결

### 빌드 실패 시

1. **로그 확인:**
   ```bash
   eas build:list
   eas build:view [build-id]
   ```

2. **환경 변수 확인:**
   ```bash
   npm run env:validate android
   ```

3. **로컬 테스트:**
   ```bash
   npm run env:android
   npm run build:android:debug
   ```

### 일반적인 오류

- **"Environment variables not set"**: GitHub Secrets 확인
- **"Build timeout"**: EAS 빌드 서버 문제, 잠시 후 재시도
- **"Invalid credentials"**: `EXPO_TOKEN` 확인

## 📚 관련 문서

- [EAS Build 문서](https://docs.expo.dev/build/introduction/)
- [GitHub Actions 설정](./.github/workflows/build.yml)
- [환경 변수 설정](./ENV_COMPLETE_SETUP.md)

## ✅ 체크리스트

- [ ] EAS CLI 설치 완료
- [ ] Expo 계정 로그인 완료
- [ ] `eas.json` 설정 완료
- [ ] GitHub Secrets 설정 완료
- [ ] 로컬 빌드 테스트 완료
- [ ] CI/CD 빌드 테스트 완료

