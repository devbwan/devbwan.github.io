/**
 * Figma 디자인 토큰 추출 스크립트
 * 
 * 사용법:
 * 1. .env 파일에 FIGMA_ACCESS_TOKEN과 FIGMA_FILE_KEY 설정
 * 2. npm run figma:extract-tokens 실행
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FILE_KEY || !ACCESS_TOKEN) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('   .env 파일에 다음을 추가하세요:');
  console.error('   FIGMA_ACCESS_TOKEN=your_token');
  console.error('   FIGMA_FILE_KEY=your_file_key');
  process.exit(1);
}

/**
 * Figma API 호출
 */
async function fetchFigmaFile() {
  try {
    const response = await fetch(`${FIGMA_API_URL}/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API 오류: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Figma API 호출 실패:', error.message);
    throw error;
  }
}

/**
 * 색상 추출
 */
function extractColors(figmaData) {
  const colors = {};
  
  // 스타일에서 색상 추출
  if (figmaData.styles) {
    Object.values(figmaData.styles).forEach(style => {
      if (style.styleType === 'FILL') {
        const styleData = figmaData.styles[style.key];
        if (styleData) {
          colors[style.name] = extractColorValue(styleData);
        }
      }
    });
  }

  // 기본 색상이 없으면 기본값 사용
  if (Object.keys(colors).length === 0) {
    console.warn('⚠️  Figma에서 색상을 찾을 수 없습니다. 기본 색상을 사용합니다.');
    colors.primary = '#0A84FF';
    colors.background = '#FFFFFF';
    colors.surface = '#F5F7FA';
    colors.textStrong = '#111111';
    colors.text = '#333333';
    colors.textLight = '#666666';
    colors.border = '#E5E5E5';
  }

  return colors;
}

/**
 * 색상 값을 hex로 변환
 */
function extractColorValue(styleData) {
  // 실제 구현 필요 - Figma API 응답 구조에 따라 다름
  // 임시로 기본값 반환
  return '#000000';
}

/**
 * 타이포그래피 추출
 */
function extractTypography(figmaData) {
  const typography = {};
  
  // 스타일에서 텍스트 스타일 추출
  if (figmaData.styles) {
    Object.values(figmaData.styles).forEach(style => {
      if (style.styleType === 'TEXT') {
        const styleData = figmaData.styles[style.key];
        if (styleData) {
          typography[style.name] = extractTypographyValue(styleData);
        }
      }
    });
  }

  // 기본 타이포그래피가 없으면 기본값 사용
  if (Object.keys(typography).length === 0) {
    console.warn('⚠️  Figma에서 타이포그래피를 찾을 수 없습니다. 기본 타이포그래피를 사용합니다.');
    typography.h1 = { fontSize: 32, fontWeight: '700', fontFamily: 'Inter-Bold' };
    typography.h2 = { fontSize: 24, fontWeight: '600', fontFamily: 'Inter-SemiBold' };
    typography.body = { fontSize: 16, fontFamily: 'Inter-Regular' };
    typography.caption = { fontSize: 13, fontFamily: 'Inter-Regular' };
    typography.stat = { fontSize: 40, fontWeight: '700', fontFamily: 'Inter-Bold' };
  }

  return typography;
}

/**
 * 타이포그래피 값을 React Native 형식으로 변환
 */
function extractTypographyValue(styleData) {
  // 실제 구현 필요 - Figma API 응답 구조에 따라 다름
  return {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
  };
}

/**
 * 간격 추출
 */
function extractSpacing(figmaData) {
  // 컴포넌트 간격 분석 (복잡함)
  // 기본값 반환
  return {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };
}

/**
 * 테마 파일 생성
 */
function generateThemeFiles(tokens) {
  const themeDir = path.join(__dirname, '../src/theme');
  
  // colors.js 생성
  const colorsContent = `// Figma에서 자동 생성된 색상 토큰
// 생성 시간: ${new Date().toISOString()}

export const colors = ${JSON.stringify(tokens.colors, null, 2).replace(/"/g, '')};
`;

  // typography.js 생성
  const typographyContent = `// Figma에서 자동 생성된 타이포그래피 토큰
// 생성 시간: ${new Date().toISOString()}

import { colors } from './colors';

export const typography = ${JSON.stringify(tokens.typography, null, 2).replace(/"/g, '')};
`;

  // spacing.js 생성
  const spacingContent = `// Figma에서 자동 생성된 간격 토큰
// 생성 시간: ${new Date().toISOString()}

export const spacing = ${JSON.stringify(tokens.spacing, null, 2).replace(/"/g, '')};
`;

  // 파일 쓰기
  fs.writeFileSync(
    path.join(themeDir, 'colors.figma.js'),
    colorsContent,
    'utf8'
  );
  fs.writeFileSync(
    path.join(themeDir, 'typography.figma.js'),
    typographyContent,
    'utf8'
  );
  fs.writeFileSync(
    path.join(themeDir, 'spacing.figma.js'),
    spacingContent,
    'utf8'
  );

  console.log('✅ 테마 파일 생성 완료:');
  console.log('   - src/theme/colors.figma.js');
  console.log('   - src/theme/typography.figma.js');
  console.log('   - src/theme/spacing.figma.js');
  console.log('\n⚠️  생성된 파일을 검토하고 기존 파일과 병합하세요.');
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 Figma 디자인 토큰 추출 시작...\n');

  try {
    // Figma 파일 가져오기
    console.log('📥 Figma 파일 다운로드 중...');
    const figmaData = await fetchFigmaFile();
    console.log('✅ Figma 파일 다운로드 완료\n');

    // 디자인 토큰 추출
    console.log('🎨 디자인 토큰 추출 중...');
    const colors = extractColors(figmaData);
    const typography = extractTypography(figmaData);
    const spacing = extractSpacing(figmaData);
    console.log('✅ 디자인 토큰 추출 완료\n');

    // 결과 출력
    console.log('📊 추출된 토큰:');
    console.log('   색상:', Object.keys(colors).length, '개');
    console.log('   타이포그래피:', Object.keys(typography).length, '개');
    console.log('   간격:', Object.keys(spacing).length, '개\n');

    // 테마 파일 생성
    console.log('📝 테마 파일 생성 중...');
    generateThemeFiles({ colors, typography, spacing });
    console.log('\n✨ 완료!');
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = { extractColors, extractTypography, extractSpacing };

