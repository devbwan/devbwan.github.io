// GitHub Pages 배포를 위한 index.html 수정 스크립트
// 절대 경로를 상대 경로로 변경

const fs = require('fs');
const path = require('path');

const webBuildDir = path.join(__dirname, '..', 'web-build');
const indexHtmlPath = path.join(webBuildDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('index.html을 찾을 수 없습니다:', indexHtmlPath);
  process.exit(1);
}

let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// 절대 경로를 상대 경로로 변경
// /favicon.ico -> ./favicon.ico
htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="./$1"');
// /_expo/... -> ./_expo/... (src 속성)
htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="./$1"');

// 모든 절대 경로를 상대 경로로 변경 (예외: // 시작하는 외부 URL)
// href="/..." 또는 src="/..." -> href="./..." 또는 src="./..."
htmlContent = htmlContent.replace(/(href|src)="\/([^\/"])/g, '$1="./$2');

fs.writeFileSync(indexHtmlPath, htmlContent, 'utf8');
console.log('✅ index.html 경로 수정 완료');

