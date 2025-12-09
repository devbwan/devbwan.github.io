#!/usr/bin/env node

/**
 * 환경 변수 검증 스크립트
 * 필수 환경 변수가 설정되었는지 확인
 */

const fs = require('fs');
const path = require('path');

// 필수 환경 변수 목록
const REQUIRED_VARS = {
  web: [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  ],
  android: [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  ],
};

// 선택적 환경 변수 (경고만 표시)
const OPTIONAL_VARS = [
  'EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB',
  'EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID',
  'EXPO_PUBLIC_NAVER_CLIENT_ID_WEB',
  'EXPO_PUBLIC_NAVER_CLIENT_ID_ANDROID',
];

/**
 * .env 파일 파싱
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    
    // 주석이나 빈 줄 스킵
    if (trimmed.startsWith('#') || trimmed === '') {
      continue;
    }

    // 환경 변수 파싱
    const match = trimmed.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      env[key] = value.trim();
    }
  }

  return env;
}

/**
 * 환경 변수 검증
 */
function validateEnv(platform = 'web') {
  const projectRoot = process.cwd();
  const envFile = platform === 'web' ? '.env.web' : '.env.android';
  const envPath = path.join(projectRoot, envFile);

  console.log(`\n🔍 ${envFile} 파일 검증 중...\n`);

  if (!fs.existsSync(envPath)) {
    console.error(`❌ ${envFile} 파일을 찾을 수 없습니다.`);
    console.log(`💡 다음 명령어로 생성하세요:`);
    console.log(`   npm run env:generate-example`);
    console.log(`   # 그 다음 .env.example을 복사하여 ${envFile} 생성`);
    process.exit(1);
  }

  const env = parseEnvFile(envPath);
  if (!env) {
    console.error(`❌ ${envFile} 파일을 파싱할 수 없습니다.`);
    process.exit(1);
  }

  const requiredVars = REQUIRED_VARS[platform] || REQUIRED_VARS.web;
  const missing = [];
  const invalid = [];

  // 필수 변수 검증
  for (const varName of requiredVars) {
    const value = env[varName];
    
    if (!value) {
      missing.push(varName);
    } else if (value.includes('your-') || value.includes('YOUR_') || value === '') {
      invalid.push(varName);
    }
  }

  // 결과 출력
  if (missing.length > 0) {
    console.error('❌ 누락된 필수 환경 변수:');
    missing.forEach(v => console.error(`   - ${v}`));
  }

  if (invalid.length > 0) {
    console.warn('⚠️  예시 값으로 설정된 환경 변수 (실제 값으로 변경 필요):');
    invalid.forEach(v => console.warn(`   - ${v}`));
  }

  // 선택적 변수 확인
  const missingOptional = [];
  for (const varName of OPTIONAL_VARS) {
    if (!env[varName]) {
      missingOptional.push(varName);
    }
  }

  if (missingOptional.length > 0 && process.env.VERBOSE) {
    console.log('\n💡 선택적 환경 변수 (설정하지 않아도 됨):');
    missingOptional.forEach(v => console.log(`   - ${v}`));
  }

  // 검증 결과
  if (missing.length > 0 || invalid.length > 0) {
    console.log('\n❌ 환경 변수 검증 실패');
    console.log(`\n💡 해결 방법:`);
    console.log(`   1. ${envFile} 파일을 열어 누락된 변수를 추가하세요`);
    console.log(`   2. 예시 값(your-*)을 실제 값으로 변경하세요`);
    console.log(`   3. 자세한 내용은 ENV_COMPLETE_SETUP.md를 참고하세요`);
    process.exit(1);
  }

  console.log('✅ 모든 필수 환경 변수가 올바르게 설정되었습니다!');
  return true;
}

// 실행
if (require.main === module) {
  const platform = process.argv[2] || 'web';
  validateEnv(platform);
}

module.exports = { validateEnv, parseEnvFile };

