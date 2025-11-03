# GitHub Pages 설정 변경 가이드

현재 GitHub Pages가 `master` 브랜치에서 배포되고 있어서 README만 표시됩니다.
`gh-pages` 브랜치로 변경해야 합니다.

## 🔧 GitHub Pages 설정 변경 방법

### 방법 1: GitHub 웹 인터페이스에서 설정 (권장)

1. **GitHub 저장소 접속**
   - https://github.com/devbwan/RunningApp 접속

2. **Settings 메뉴 클릭**
   - 저장소 페이지에서 오른쪽 상단의 **Settings** 탭 클릭

3. **Pages 메뉴 선택**
   - 왼쪽 사이드바에서 **Pages** 메뉴 클릭

4. **Source 설정 변경**
   - **Source** 섹션에서:
     - **Deploy from a branch** 선택
     - **Branch**: `gh-pages` 선택
     - **Folder**: `/ (root)` 선택
     - **Save** 버튼 클릭

5. **설정 확인**
   - 페이지 상단에 "Your site is published at https://devbwan.github.io/RunningApp/" 메시지 표시 확인

### 방법 2: GitHub CLI 사용 (선택사항)

```bash
# GitHub CLI 설치 필요
gh repo edit devbwan/RunningApp --enable-pages --pages-source=gh-pages --pages-path=/
```

## ✅ 설정 변경 후 확인

1. **브라우저 캐시 클리어**
   - `Ctrl + Shift + R` (또는 `Cmd + Shift + R` on Mac)
   - 또는 시크릿 모드로 접속

2. **URL 확인**
   - https://devbwan.github.io/RunningApp/
   - 1-2분 후 앱이 표시되어야 합니다

3. **배포 상태 확인**
   - GitHub 저장소 > **Settings** > **Pages** 에서 배포 상태 확인
   - 최근 배포 내역이 표시됩니다

## 🔍 문제 해결

### 여전히 README만 보이는 경우

1. **gh-pages 브랜치 확인**
```bash
# 로컬에서 확인
git fetch origin gh-pages
git checkout gh-pages
ls  # index.html이 있는지 확인
```

2. **다시 배포**
```bash
npm run deploy
```

3. **GitHub Pages Actions 확인**
   - 저장소 > **Actions** 탭에서 배포 상태 확인

### 빌드 파일이 없는 경우

`gh-pages` 브랜치에 `index.html`과 `_expo` 폴더가 있는지 확인:

```bash
git show origin/gh-pages:index.html
git ls-tree -r origin/gh-pages --name-only | findstr index.html
```

## 📝 현재 설정 확인 명령어

```bash
# gh-pages 브랜치 확인
git branch -r | findstr gh-pages

# gh-pages 브랜치의 파일 목록
git ls-tree -r origin/gh-pages --name-only | head -20

# index.html 확인
git show origin/gh-pages:index.html | head -20
```

## ⚙️ 자동 설정 스크립트 (선택사항)

GitHub API를 사용하여 자동으로 설정할 수도 있지만, 
웹 인터페이스에서 설정하는 것이 가장 간단하고 안전합니다.

## 📚 참고

- [GitHub Pages 설정 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- 현재 코드는 `gh-pages` 브랜치에 배포되도록 설정되어 있습니다
- `package.json`의 `deploy` 스크립트: `gh-pages -d web-build`

