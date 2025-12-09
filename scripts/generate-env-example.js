#!/usr/bin/env node

/**
 * .env.example 파일 자동 생성 스크립트
 * .env.web 또는 .env.android 파일을 기반으로 .env.example 생성
 */

const fs = require('fs');
const path = require('path');

const ENV_FILES = {
  web: '.env.web',
  android: '.env.android',
};

const EXAMPLE_FILE = '.env.example';

/**
 * 환경 변수 파일에서 키만 추출하여 예시 값으로 변환
 */
function generateExampleFromEnv(envContent) {
  const lines = envContent.split('\n');
  const exampleLines = [];

  for (const line of lines) {
    // 주석은 그대로 유지
    if (line.trim().startsWith('#')) {
      exampleLines.push(line);
      continue;
    }

    // 빈 줄은 그대로 유지
    if (line.trim() === '') {
      exampleLines.push(line);
      continue;
    }

    // 환경 변수 파싱
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      
      // 값이 이미 예시 형식인 경우 그대로 유지
      if (value.includes('your-') || value.includes('YOUR_')) {
        exampleLines.push(line);
        continue;
      }

      // 실제 값이 있는 경우 예시 값으로 변환
      let exampleValue = 'your-value-here';
      
      // Firebase 관련은 예시 값 사용
      if (key.includes('FIREBASE')) {
        exampleValue = 'your-firebase-value';
      } else if (key.includes('GOOGLE') || key.includes('NAVER')) {
        exampleValue = 'your-oauth-client-id';
      } else if (key.includes('ENV')) {
        exampleValue = 'development';
      } else {
        // 숫자나 특정 형식인 경우 유형만 표시
        if (/^\d+$/.test(value)) {
          exampleValue = 'your-number';
        } else if (value.includes('@')) {
          exampleValue = 'your-email@example.com';
        } else if (value.includes('.com') || value.includes('.app')) {
          exampleValue = 'your-domain.com';
        } else {
          exampleValue = 'your-value-here';
        }
      }

      exampleLines.push(`${key}=${exampleValue}`);
    } else {
      // 파싱 실패한 줄은 그대로 유지
      exampleLines.push(line);
    }
  }

  return exampleLines.join('\n');
}

/**
 * .env.example 파일 생성
 */
function generateEnvExample() {
  const projectRoot = process.cwd();
  let sourceContent = '';

  // .env.web 또는 .env.android 파일 찾기
  for (const [platform, filename] of Object.entries(ENV_FILES)) {
    const filePath = path.join(projectRoot, filename);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${filename} 파일을 찾았습니다.`);
      sourceContent = fs.readFileSync(filePath, 'utf8');
      break;
    }
  }

  if (!sourceContent) {
    console.error('❌ .env.web 또는 .env.android 파일을 찾을 수 없습니다.');
    console.log('💡 먼저 .env.web 또는 .env.android 파일을 생성하세요.');
    process.exit(1);
  }

  // 예시 파일 생성
  const exampleContent = generateExampleFromEnv(sourceContent);
  const examplePath = path.join(projectRoot, EXAMPLE_FILE);

  // 헤더 추가
  const header = `# 환경 변수 예시 파일
# 이 파일은 Git에 포함됩니다.
# 실제 값은 .env.web 또는 .env.android 파일에 설정하세요.
# 
# 사용 방법:
# 1. 이 파일을 복사하여 .env.web 또는 .env.android 파일 생성
# 2. your-value-here를 실제 값으로 변경
# 3. .env.web, .env.android 파일은 Git에 커밋하지 마세요!

`;

  fs.writeFileSync(examplePath, header + exampleContent, 'utf8');
  console.log(`✅ ${EXAMPLE_FILE} 파일이 생성되었습니다.`);
  console.log(`📝 ${examplePath}`);
}

// 실행
if (require.main === module) {
  generateEnvExample();
}

module.exports = { generateEnvExample, generateExampleFromEnv };

