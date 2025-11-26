# Android APK 디버깅 가이드

APK 빌드 후 앱을 디버깅하는 방법을 안내합니다.

## 🔧 방법 1: Logcat을 사용한 로그 확인 (가장 기본)

### adb logcat 사용 (터미널)

```powershell
# 모든 로그 확인
adb logcat

# React Native 관련 로그만 필터링
adb logcat | Select-String -Pattern "ReactNativeJS|ReactNative|JS"

# 특정 태그로 필터링
adb logcat -s ReactNativeJS:* ReactNative:* JS:*

# 앱 패키지 이름으로 필터링
adb logcat | Select-String -Pattern "com.runwave.app"

# 로그를 파일로 저장
adb logcat > logcat.txt

# 이전 로그 지우고 새로 시작
adb logcat -c && adb logcat
```

### Android Studio Logcat 사용

1. Android Studio 실행
2. **View** > **Tool Windows** > **Logcat** 선택
3. 기기/에뮬레이터 선택
4. 필터 설정:
   - **Package Name**: `com.runwave.app`
   - **Log Level**: `Verbose` 또는 `Debug`
   - **Search**: 특정 키워드 검색

## 🔧 방법 2: React Native Debugger 사용

### 개발 모드로 APK 빌드

디버그 APK를 빌드하면 개발자 메뉴에 접근할 수 있습니다:

```powershell
# 디버그 APK 빌드
npm run build:apk:local:debug

# APK 설치
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 개발자 메뉴 열기

1. 앱 실행
2. 기기를 흔들거나 (Shake gesture)
3. 또는 다음 명령어로 메뉴 열기:
   ```powershell
   adb shell input keyevent 82
   ```

### 개발자 메뉴 옵션

- **Debug**: Chrome DevTools에서 디버깅
- **Reload**: 앱 새로고침
- **Show Perf Monitor**: 성능 모니터 표시
- **Start/Stop Profiling**: 프로파일링 시작/중지

## 🔧 방법 3: Chrome DevTools 사용

### 1. 디버그 APK 설치

```powershell
npm run build:apk:local:debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. 개발자 메뉴에서 Debug 선택

앱에서 개발자 메뉴를 열고 **Debug** 선택

### 3. Chrome에서 디버깅

1. Chrome 브라우저 열기
2. 주소창에 입력: `chrome://inspect`
3. **Remote Target**에서 앱 선택
4. **inspect** 클릭

### 4. 디버깅 기능

- **Console**: JavaScript 로그 확인
- **Sources**: 소스 코드 확인 및 브레이크포인트 설정
- **Network**: 네트워크 요청 확인
- **React DevTools**: React 컴포넌트 구조 확인

## 🔧 방법 4: React Native Debugger 앱 사용

### 설치

```powershell
# Windows에서 Chocolatey 사용
choco install react-native-debugger

# 또는 직접 다운로드
# https://github.com/jhen0409/react-native-debugger/releases
```

### 사용 방법

1. React Native Debugger 실행
2. 앱에서 개발자 메뉴 열기
3. **Debug** 선택
4. React Native Debugger에서 자동으로 연결됨

### 기능

- Redux DevTools 통합
- React DevTools 통합
- Network Inspector
- Console 로그

## 🔧 방법 5: Flipper 사용

### Flipper 설치

1. [Flipper 다운로드](https://fbflipper.com/)
2. 설치 및 실행

### React Native Flipper 플러그인 설정

`package.json`에 추가:

```json
{
  "devDependencies": {
    "react-native-flipper": "^0.182.0"
  }
}
```

### 사용 방법

1. Flipper 실행
2. 기기 연결
3. 앱 실행
4. Flipper에서 자동으로 앱 감지

## 🔧 방법 6: 원격 디버깅 설정

### Metro Bundler 연결

APK가 Metro Bundler에 연결되도록 설정:

```javascript
// index.js 또는 App.js
import { NativeModules } from 'react-native';

// 개발 모드에서만 Metro 연결
if (__DEV__) {
  // Metro 서버 주소 설정
  // 기본값: localhost:8081
}
```

### 네트워크 디버깅

1. 기기와 PC가 같은 Wi-Fi에 연결
2. PC의 IP 주소 확인:
   ```powershell
   ipconfig
   # IPv4 주소 확인 (예: 192.168.0.100)
   ```
3. 앱에서 개발자 메뉴 열기
4. **Settings** > **Debug server host & port for device**
5. `192.168.0.100:8081` 입력

## 🔧 방법 7: 커스텀 로그 추가

### console.log 사용

```javascript
// 개발 모드에서만 로그 출력
if (__DEV__) {
  console.log('[MyComponent] 데이터:', data);
  console.warn('[MyComponent] 경고:', warning);
  console.error('[MyComponent] 오류:', error);
}
```

### React Native의 LogBox 사용

```javascript
import { LogBox } from 'react-native';

// 특정 경고 숨기기
LogBox.ignoreLogs(['Warning: ...']);

// 모든 경고 표시
LogBox.ignoreAllLogs(false);
```

## 🔧 방법 8: 네이티브 로그 확인

### Android Logcat 태그

```javascript
import { NativeModules } from 'react-native';

// 네이티브 모듈에서 로그 확인
// Logcat에서 태그로 필터링 가능
```

### Logcat 필터 예시

```powershell
# 특정 태그만 확인
adb logcat -s MyTag:D ReactNativeJS:V

# 여러 태그 동시 확인
adb logcat -s MyTag:D ReactNativeJS:V AndroidRuntime:E
```

## 🔧 방법 9: 성능 프로파일링

### React Native Profiler

```javascript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Chrome Performance 탭

1. Chrome DevTools 열기
2. **Performance** 탭 선택
3. **Record** 클릭
4. 앱에서 작업 수행
5. **Stop** 클릭
6. 성능 분석

## 🔧 방법 10: 네트워크 디버깅

### React Native의 Network Inspector

1. 개발자 메뉴 열기
2. **Network Inspector** 활성화
3. 네트워크 요청 확인

### Flipper Network Plugin

1. Flipper 실행
2. **Network** 플러그인 선택
3. 모든 네트워크 요청 확인

## 📝 디버깅 팁

### 1. 로그 레벨 설정

```javascript
// 개발 모드에서만 상세 로그
if (__DEV__) {
  console.log('상세 정보:', data);
}
```

### 2. 에러 바운더리 사용

```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('에러 발생:', error, errorInfo);
    // 에러 리포팅 서비스로 전송
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorView />;
    }
    return this.props.children;
  }
}
```

### 3. 조건부 로깅

```javascript
const DEBUG = __DEV__;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}
```

## 🚀 빠른 시작

### 가장 빠른 방법 (권장)

```powershell
# 1. 디버그 APK 빌드
npm run build:apk:local:debug

# 2. APK 설치
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 3. 로그 확인 (별도 터미널)
adb logcat | Select-String -Pattern "ReactNativeJS"

# 4. 앱 실행 후 개발자 메뉴 열기
adb shell input keyevent 82

# 5. Chrome DevTools에서 디버깅
# chrome://inspect 접속
```

## 📚 참고 자료

- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Android Logcat](https://developer.android.com/studio/command-line/logcat)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)

