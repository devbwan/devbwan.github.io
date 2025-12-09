# 프로젝트 정리 계획 (Project Cleanup Plan)

## 📋 분석 결과 요약

### PART 1: 사용하지 않는 파일 및 코드

#### 삭제 대상 파일
1. **`app/auth/naver/`** - 빈 폴더, 사용되지 않음
2. **`src/config/env.js`** - `envLoader.js`만 사용됨, 중복
3. **`docs/user-page-redirect.html`** - 사용되지 않는 리다이렉트 파일
4. **`index.js` (루트)** - `expo-router/entry`만 있음, 불필요

#### 검토 필요 파일
1. **`src/platform/index.js`** - 직접 import되지 않음, `platform` 폴더 자체가 사용되지 않을 수 있음
2. **`src/api/index.js`** - 사용됨 (app/(tabs)/courses.js, app/course/[id].js)

### PART 2: 문서 정리

#### 삭제 대상 문서 (중복/오래됨)
1. **`FINAL_SUMMARY.md`** - REFACTORING_COMPLETE.md와 중복
2. **`REFACTORING_PLAN.md`** - 완료된 계획, 불필요
3. **`MIGRATION_GUIDE.md`** - REFACTORING_COMPLETE.md에 포함됨
4. **`GOOGLE_LOGIN_DIFF_SUMMARY.md`** - GOOGLE_LOGIN_COMPLETE_REFACTOR.md에 포함됨
5. **`REDIRECT_URI_FIX_COMPLETE.md`** - CREDENTIAL_BASED_AUTH_COMPLETE.md에 포함됨
6. **`REDIRECT_URI_FIREBASE_HOSTING_UPDATE.md`** - CREDENTIAL_BASED_AUTH_COMPLETE.md에 포함됨
7. **`OAUTH_CLIENT_ID_CONFIRMED.md`** - OAUTH_CLIENT_ID_VERIFICATION_GUIDE.md에 포함됨
8. **`AUTH_FEATURES_IMPLEMENTATION_SUMMARY.md`** - AUTH_FEATURES_COMPLETE.md에 포함됨
9. **`GOOGLE_LOGIN_REFACTOR.md`** - GOOGLE_LOGIN_COMPLETE_REFACTOR.md와 중복
10. **`GOOGLE_OAUTH_ACCESS_DENIED_FIX.md`** - GOOGLE_LOGIN_COMPLETE_REFACTOR.md에 포함됨
11. **`OAUTH_CLIENT_UPDATE_ERROR_FIX.md`** - GOOGLE_LOGIN_COMPLETE_REFACTOR.md에 포함됨
12. **`CSP_ERROR_GUIDE.md`** - GITHUB_PAGES_TROUBLESHOOTING.md에 포함됨
13. **`DEPLOYMENT_UPDATE.md`** - GITHUB_PAGES_DEPLOY.md에 포함됨
14. **`GRADLE_BUILD_FIX.md`** - ANDROID_BUILD_CHECKLIST.md에 포함됨
15. **`ANDROID_MAPS_APK_FIX.md`** - ANDROID_BUILD_CHECKLIST.md에 포함됨
16. **`ANDROID_APK_DEBUGGING.md`** - ANDROID_TEST_GUIDE.md에 포함됨
17. **`QUICK_START_ANDROID.md`** - ANDROID_BUILD_CHECKLIST.md에 포함됨
18. **`GITHUB_PAGES_ROOT_ACCESS.md`** - GITHUB_PAGES_SETUP.md에 포함됨
19. **`GITHUB_PAGES_CONFIG.md`** - GITHUB_PAGES_SETUP.md에 포함됨
20. **`FIRESTORE_ERROR_FIX.md`** - FIRESTORE_SETUP.md에 포함됨
21. **`PROJECT_STATUS.md`** - README.md에 포함됨
22. **`TEST_REPORT.md`** - ANDROID_TEST_GUIDE.md에 포함됨
23. **`test-setup.md`** - ANDROID_TEST_GUIDE.md에 포함됨
24. **`README_SETUP_GUIDES.md`** - README.md에 포함됨
25. **`README_GOOGLE_AUTH.md`** - GOOGLE_AUTH_COMPLETE_SETUP.md에 포함됨
26. **`NPM_SCRIPTS_GUIDE.md`** - README.md에 포함됨

#### 아카이브 대상 문서 (참고용)
1. **`REFACTORING_COMPLETE.md`** - 완료된 리팩토링 기록
2. **`CREDENTIAL_BASED_AUTH_COMPLETE.md`** - 인증 리팩토링 기록
3. **`GOOGLE_LOGIN_COMPLETE_REFACTOR.md`** - Google 로그인 리팩토링 기록

#### 유지할 필수 문서
1. **`README.md`** - 프로젝트 메인 문서
2. **`ENV_COMPLETE_SETUP.md`** - 환경 변수 설정 가이드
3. **`FIREBASE_COMPLETE_SETUP.md`** - Firebase 설정 가이드
4. **`GOOGLE_AUTH_COMPLETE_SETUP.md`** - Google 인증 설정 가이드
5. **`AUTH_SETUP.md`** - 인증 설정 요약
6. **`AUTH_FEATURES_COMPLETE.md`** - 인증 기능 완성 가이드
7. **`OAUTH_CLIENT_ID_VERIFICATION_GUIDE.md`** - OAuth Client ID 확인 가이드
8. **`FIRESTORE_SETUP.md`** - Firestore 설정 가이드
9. **`EAS_BUILD_GUIDE.md`** - EAS 빌드 가이드
10. **`APK_BUILD_GUIDE.md`** - APK 빌드 가이드
11. **`ANDROID_BUILD_CHECKLIST.md`** - Android 빌드 체크리스트
12. **`ANDROID_TEST_GUIDE.md`** - Android 테스트 가이드
13. **`GOOGLE_MAPS_SETUP_CHECKLIST.md`** - Google Maps 설정 체크리스트
14. **`MAPS_TROUBLESHOOTING.md`** - Maps 문제 해결 가이드
15. **`GITHUB_PAGES_SETUP.md`** - GitHub Pages 설정 가이드
16. **`GITHUB_PAGES_DEPLOY.md`** - GitHub Pages 배포 가이드
17. **`GITHUB_PAGES_TROUBLESHOOTING.md`** - GitHub Pages 문제 해결 가이드
18. **`NAVER_AUTH_SETUP.md`** - Naver 인증 설정 가이드
19. **`HEALTH_KIT_SETUP.md`** - Health Kit 설정 가이드
20. **`GOOGLE_FIT_API_REFERENCE.md`** - Google Fit API 참조

### PART 3: 폴더 구조 정리

#### 제안하는 새 구조
```
docs/
  getting-started.md          # 빠른 시작 가이드 (README 요약)
  architecture.md             # 아키텍처 설명
  setup/
    environment.md            # ENV_COMPLETE_SETUP.md
    firebase.md               # FIREBASE_COMPLETE_SETUP.md
    google-auth.md            # GOOGLE_AUTH_COMPLETE_SETUP.md
    naver-auth.md             # NAVER_AUTH_SETUP.md
    firestore.md              # FIRESTORE_SETUP.md
    google-maps.md            # GOOGLE_MAPS_SETUP_CHECKLIST.md
    health-kit.md             # HEALTH_KIT_SETUP.md
  build/
    eas.md                    # EAS_BUILD_GUIDE.md
    apk.md                    # APK_BUILD_GUIDE.md
    android-checklist.md     # ANDROID_BUILD_CHECKLIST.md
  deploy/
    github-pages-setup.md     # GITHUB_PAGES_SETUP.md
    github-pages-deploy.md    # GITHUB_PAGES_DEPLOY.md
    github-pages-troubleshooting.md  # GITHUB_PAGES_TROUBLESHOOTING.md
  testing/
    android.md                # ANDROID_TEST_GUIDE.md
  troubleshooting/
    maps.md                   # MAPS_TROUBLESHOOTING.md
  reference/
    oauth-client-id.md        # OAUTH_CLIENT_ID_VERIFICATION_GUIDE.md
    google-fit-api.md         # GOOGLE_FIT_API_REFERENCE.md
  archive/
    refactoring-complete.md   # REFACTORING_COMPLETE.md
    credential-auth-complete.md  # CREDENTIAL_BASED_AUTH_COMPLETE.md
    google-login-refactor.md  # GOOGLE_LOGIN_COMPLETE_REFACTOR.md
```

### PART 4: 네이밍 컨벤션 통일

#### 수정 필요
1. **`src/hooks/useGoogleLogin.ts`** → `useGoogleLogin.js` (TypeScript가 아니므로)

### PART 5: 설정 파일 정리

#### 확인 필요
1. **`package.json`** - 모든 스크립트가 사용되는지 확인 필요
2. **`.env.*` 파일들** - 실제 사용되는 파일만 유지

---

## 🎯 실행 계획

### Phase 1: 파일 삭제
- [ ] `app/auth/naver/` 폴더 삭제
- [ ] `src/config/env.js` 삭제
- [ ] `docs/user-page-redirect.html` 삭제
- [ ] `index.js` (루트) 삭제 (expo-router/entry는 package.json에서 처리)

### Phase 2: 문서 정리
- [ ] 중복 문서 삭제 (26개)
- [ ] 문서를 `docs/` 폴더로 이동 및 재구성
- [ ] 아카이브 문서를 `docs/archive/`로 이동

### Phase 3: 네이밍 통일
- [ ] `useGoogleLogin.ts` → `useGoogleLogin.js`로 변경

### Phase 4: 폴더 구조 정리
- [ ] `src/platform/` 폴더 검토 (사용되지 않으면 삭제)
- [ ] `src/config/env.js` 삭제 후 import 경로 확인

---

## 📊 예상 결과

### 삭제될 파일 수
- 코드 파일: 3-4개
- 문서 파일: 26개
- 총: 약 30개 파일 삭제

### 새 문서 구조
- 필수 문서: 20개 (docs/ 하위로 재구성)
- 아카이브: 3개
- 총: 23개 문서 유지

### 개선 사항
- 프로젝트 루트가 깔끔해짐
- 문서 구조가 명확해짐
- 중복 제거로 유지보수 용이
- 네이밍 컨벤션 통일

