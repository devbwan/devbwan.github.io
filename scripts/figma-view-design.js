/**
 * Figma 디자인 파일 확인 스크립트
 * 
 * 사용법:
 * npm run figma:view-design
 * 
 * 또는 파일 키 직접 지정:
 * FIGMA_FILE_KEY=lW3umIxEA6l6GMuUTHz6LT node scripts/figma-view-design.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'lW3umIxEA6l6GMuUTHz6LT'; // 기본값: 사용자가 제공한 파일 키
const ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ FIGMA_ACCESS_TOKEN이 설정되지 않았습니다.');
  console.error('\n설정 방법:');
  console.error('1. Figma → Settings → Personal Access Tokens');
  console.error('2. 새 토큰 생성');
  console.error('3. .env 파일에 추가: FIGMA_ACCESS_TOKEN=your_token');
  console.error('\n또는 명령줄에서:');
  console.error('FIGMA_ACCESS_TOKEN=your_token npm run figma:view-design');
  process.exit(1);
}

/**
 * Figma 파일 정보 가져오기
 */
async function fetchFigmaFile() {
  try {
    console.log(`📥 Figma 파일 다운로드 중... (파일 키: ${FILE_KEY})`);
    
    const response = await fetch(`${FIGMA_API_URL}/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Figma API 오류: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Figma API 호출 실패:', error.message);
    throw error;
  }
}

/**
 * 노드 정보 가져오기
 */
async function fetchNodeInfo(nodeId) {
  try {
    const response = await fetch(
      `${FIGMA_API_URL}/files/${FILE_KEY}/nodes?ids=${nodeId}`,
      {
        headers: {
          'X-Figma-Token': ACCESS_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`노드 정보 가져오기 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('노드 정보 가져오기 실패:', error.message);
    return null;
  }
}

/**
 * 디자인 정보 분석 및 출력
 */
function analyzeDesign(figmaData) {
  console.log('\n📊 디자인 파일 분석 결과\n');
  console.log('='.repeat(60));
  
  // 기본 정보
  console.log('\n📋 파일 정보:');
  console.log(`   이름: ${figmaData.name || 'N/A'}`);
  console.log(`   마지막 수정: ${figmaData.lastModified || 'N/A'}`);
  console.log(`   버전: ${figmaData.version || 'N/A'}`);
  
  // 페이지 정보
  if (figmaData.document && figmaData.document.children) {
    console.log('\n📄 페이지 목록:');
    figmaData.document.children.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.name} (${page.type})`);
      if (page.children && page.children.length > 0) {
        console.log(`      └─ 컴포넌트/프레임: ${page.children.length}개`);
      }
    });
  }
  
  // 스타일 정보
  if (figmaData.styles) {
    console.log('\n🎨 스타일 정보:');
    const fillStyles = Object.values(figmaData.styles).filter(s => s.styleType === 'FILL');
    const textStyles = Object.values(figmaData.styles).filter(s => s.styleType === 'TEXT');
    
    console.log(`   색상 스타일: ${fillStyles.length}개`);
    fillStyles.forEach(style => {
      console.log(`      - ${style.name} (${style.key})`);
    });
    
    console.log(`   텍스트 스타일: ${textStyles.length}개`);
    textStyles.forEach(style => {
      console.log(`      - ${style.name} (${style.key})`);
    });
  }
  
  // 컴포넌트 정보
  if (figmaData.components) {
    console.log('\n🧩 컴포넌트 정보:');
    const componentKeys = Object.keys(figmaData.components);
    console.log(`   총 컴포넌트: ${componentKeys.length}개`);
    componentKeys.slice(0, 10).forEach(key => {
      const comp = figmaData.components[key];
      console.log(`      - ${comp.name || 'Unnamed'} (${key})`);
    });
    if (componentKeys.length > 10) {
      console.log(`      ... 외 ${componentKeys.length - 10}개`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

/**
 * 특정 노드 상세 정보 출력
 */
async function analyzeNode(nodeId) {
  console.log(`\n🔍 노드 상세 분석: ${nodeId}\n`);
  
  const nodeData = await fetchNodeInfo(nodeId);
  if (!nodeData || !nodeData.nodes || !nodeData.nodes[nodeId]) {
    console.log('⚠️  노드 정보를 가져올 수 없습니다.');
    return;
  }
  
  const node = nodeData.nodes[nodeId];
  console.log('노드 정보:');
  console.log(JSON.stringify(node, null, 2));
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
        colors[style.name] = {
          key: style.key,
          description: style.description || '',
        };
      }
    });
  }
  
  return colors;
}

/**
 * 타이포그래피 추출
 */
function extractTypography(figmaData) {
  const typography = {};
  
  if (figmaData.styles) {
    Object.values(figmaData.styles).forEach(style => {
      if (style.styleType === 'TEXT') {
        typography[style.name] = {
          key: style.key,
          description: style.description || '',
        };
      }
    });
  }
  
  return typography;
}

/**
 * 디자인 토큰 요약 파일 생성
 */
function generateDesignSummary(figmaData, colors, typography) {
  const summary = {
    fileInfo: {
      name: figmaData.name,
      lastModified: figmaData.lastModified,
      version: figmaData.version,
    },
    colors: colors,
    typography: typography,
    pages: figmaData.document?.children?.map(page => ({
      name: page.name,
      type: page.type,
      childrenCount: page.children?.length || 0,
    })) || [],
    components: Object.keys(figmaData.components || {}).length,
  };
  
  const outputPath = path.join(__dirname, '../figma-design-summary.json');
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf8');
  
  console.log(`\n💾 디자인 요약 저장: ${outputPath}`);
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 Figma 디자인 파일 확인 시작...\n');
  console.log(`파일 키: ${FILE_KEY}`);
  console.log(`API URL: ${FIGMA_API_URL}/files/${FILE_KEY}\n`);

  try {
    // Figma 파일 가져오기
    const figmaData = await fetchFigmaFile();
    console.log('✅ Figma 파일 다운로드 완료\n');

    // 디자인 분석
    analyzeDesign(figmaData);

    // 디자인 토큰 추출
    console.log('\n🎨 디자인 토큰 추출 중...');
    const colors = extractColors(figmaData);
    const typography = extractTypography(figmaData);
    
    console.log(`   색상: ${Object.keys(colors).length}개`);
    console.log(`   타이포그래피: ${Object.keys(typography).length}개`);

    // 요약 파일 생성
    generateDesignSummary(figmaData, colors, typography);

    // 특정 노드 분석 (URL에 node-id가 있는 경우)
    const nodeIdMatch = process.argv.find(arg => arg.includes('node-id'));
    if (nodeIdMatch) {
      const nodeId = nodeIdMatch.split('=')[1];
      await analyzeNode(nodeId);
    }

    console.log('\n✨ 완료!');
    console.log('\n다음 단계:');
    console.log('1. figma-design-summary.json 파일 확인');
    console.log('2. npm run figma:extract-tokens 실행하여 테마 파일 생성');
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    if (error.message.includes('403')) {
      console.error('\n💡 해결 방법:');
      console.error('1. Figma 파일 접근 권한 확인');
      console.error('2. Personal Access Token 권한 확인');
      console.error('3. 파일이 공유되어 있는지 확인');
    }
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = { fetchFigmaFile, extractColors, extractTypography };

