# 🔧 Gradle 빌드 오류 해결 가이드

## 문제 상황

로컬 빌드 시 다음과 같은 오류가 발생할 수 있습니다:

```
Error resolving plugin [id: 'com.facebook.react.settings']
> Included build 'C:\?옪肄붿뼱\bwan\AI_RunnigApp_Cursor\ai-running-app\node_modules\@react-native\gradle-plugin' does not exist.
```

## 원인

1. **경로 인코딩 문제**: 프로젝트 경로에 한글이 포함되어 있어 Windows에서 경로 인코딩 문제가 발생할 수 있습니다.
2. **node_modules 누락**: `@react-native/gradle-plugin`이 제대로 설치되지 않았을 수 있습니다.
3. **Gradle 캐시 문제**: 이전 빌드의 캐시가 남아있을 수 있습니다.

## 해결 방법

### 방법 1: EAS Build 사용 (권장) ⭐

로컬 빌드보다 안정적이고 경로 문제가 없습니다:

```powershell
# 1. EAS CLI 설치 및 로그인
npm install -g eas-cli
eas login

# 2. 빌드 실행
npm run build:apk:preview
```

### 방법 2: 로컬 빌드 - Gradle 캐시 정리

```powershell
cd ai-running-app

# 1. Gradle 캐시 정리
cd android
.\gradlew clean
cd ..

# 2. node_modules 재설치
Remove-Item -Recurse -Force node_modules
npm install

# 3. Android 프로젝트 재생성
npx expo prebuild --clean --platform android

# 4. 빌드 재시도
cd android
.\gradlew assembleDebug
```

### 방법 3: 프로젝트 경로 변경 (한글 경로 문제 해결)

프로젝트를 영문 경로로 이동:

```powershell
# 예: C:\Projects\AI_RunningApp_Cursor
# 한글이 없는 경로로 프로젝트를 복사하거나 이동
```

### 방법 4: 환경 변수 설정

PowerShell에서 UTF-8 인코딩 설정:

```powershell
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:JAVA_TOOL_OPTIONS = "-Dfile.encoding=UTF-8"

# 그 후 빌드 실행
cd android
.\gradlew assembleDebug
```

## 단계별 해결 가이드

### 1단계: 의존성 재설치

```powershell
cd ai-running-app

# node_modules 삭제 및 재설치
Remove-Item -Recurse -Force node_modules
npm install
```

### 2단계: Android 프로젝트 재생성

```powershell
# Android 폴더 삭제 및 재생성
npx expo prebuild --clean --platform android
```

### 3단계: Gradle 캐시 정리

```powershell
cd android

# Gradle 캐시 정리
.\gradlew clean

# Gradle 래퍼 업데이트
.\gradlew wrapper --gradle-version 8.3
```

### 4단계: 빌드 재시도

```powershell
# 디버그 빌드
.\gradlew assembleDebug

# 또는 릴리즈 빌드 (서명 필요)
.\gradlew assembleRelease
```

## 추가 문제 해결

### 문제: "Cannot find path" 오류

**원인**: 경로에 한글이 포함되어 있음

**해결**:
1. 프로젝트를 영문 경로로 이동
2. 또는 EAS Build 사용

### 문제: "Gradle sync failed"

**해결**:
```powershell
cd android
.\gradlew --stop
.\gradlew clean
cd ..
npx expo prebuild --clean --platform android
```

### 문제: "SDK location not found"

**해결**:
`android/local.properties` 파일 생성:

```properties
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
```

## 권장 사항

1. **EAS Build 사용**: 로컬 빌드보다 안정적이고 문제가 적습니다
2. **영문 경로 사용**: 프로젝트 경로에 한글을 사용하지 않도록 합니다
3. **최신 Node.js 사용**: Node.js 20.19.4 이상 권장 (현재 v20.11.0 사용 중)

## 체크리스트

빌드 전 확인사항:

- [ ] `node_modules`가 제대로 설치되어 있음
- [ ] `@react-native/gradle-plugin`이 `node_modules`에 존재함
- [ ] `expo prebuild`가 성공적으로 완료됨
- [ ] `android` 폴더가 생성되어 있음
- [ ] `google-services.json`이 `android/app/` 폴더에 있음
- [ ] Gradle 캐시가 정리됨

## 빠른 해결 (권장)

가장 빠르고 안정적인 방법:

```powershell
# EAS Build 사용
npm install -g eas-cli
eas login
npm run build:apk:preview
```

이 방법은 클라우드에서 빌드하므로 로컬 환경 문제의 영향을 받지 않습니다.

