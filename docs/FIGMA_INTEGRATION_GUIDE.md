# Figma 연동 가이드

## 📋 개요

Figma 디자인을 React Native/Expo 앱에 통합하는 방법을 안내합니다.

## 🛠️ 방법 1: Figma API를 통한 디자인 토큰 추출

### 1.1 Figma API 설정

1. Figma 계정에서 Personal Access Token 생성
   - Figma → Settings → Personal Access Tokens
   - 새 토큰 생성 및 복사

2. 환경 변수 설정
   ```bash
   # .env 파일에 추가
   FIGMA_ACCESS_TOKEN=your_token_here
   FIGMA_FILE_KEY=your_file_key_here
   ```

### 1.2 디자인 토큰 추출 스크립트

```javascript
// scripts/extract-figma-tokens.js
const fetch = require('node-fetch');
require('dotenv').config();

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

async function extractDesignTokens() {
  try {
    // Figma 파일 정보 가져오기
    const response = await fetch(`${FIGMA_API_URL}/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': ACCESS_TOKEN,
      },
    });

    const data = await response.json();
    
    // 스타일 추출
    const styles = data.styles || {};
    const colors = {};
    const typography = {};
    const spacing = {};

    // 색상 추출
    Object.values(styles).forEach(style => {
      if (style.styleType === 'FILL') {
        colors[style.name] = extractColor(style);
      }
    });

    // 타이포그래피 추출
    Object.values(styles).forEach(style => {
      if (style.styleType === 'TEXT') {
        typography[style.name] = extractTypography(style);
      }
    });

    // 간격 추출 (컴포넌트 간격 분석)
    // ...

    return { colors, typography, spacing };
  } catch (error) {
    console.error('Figma API 오류:', error);
    throw error;
  }
}

function extractColor(style) {
  // Figma 색상 값을 hex로 변환
  // 실제 구현 필요
  return '#000000';
}

function extractTypography(style) {
  // Figma 텍스트 스타일을 React Native 형식으로 변환
  // 실제 구현 필요
  return {
    fontSize: 16,
    fontWeight: '400',
  };
}

// 사용 예시
extractDesignTokens().then(tokens => {
  console.log('추출된 디자인 토큰:', JSON.stringify(tokens, null, 2));
  
  // src/theme/colors.js 자동 생성
  generateThemeFiles(tokens);
});
```

## 🛠️ 방법 2: Figma 플러그인 사용

### 2.1 Locofy.ai

1. **설치 및 설정**
   - Figma에서 Locofy 플러그인 설치
   - 디자인 파일 열기
   - Locofy 플러그인 실행

2. **코드 생성**
   - React Native 선택
   - 컴포넌트 태깅
   - 코드 내보내기

3. **프로젝트 통합**
   ```bash
   # 생성된 코드를 프로젝트에 통합
   cp -r locofy-output/src/components/* src/components/ui/
   cp locofy-output/src/theme/* src/theme/
   ```

### 2.2 Anima

1. **설치**
   - Figma에서 Anima 플러그인 설치
   - 디자인 파일 준비

2. **코드 생성**
   - React Native 선택
   - 컴포넌트 변환
   - 코드 다운로드

## 🛠️ 방법 3: 수동 구현 (권장)

### 3.1 디자인 토큰 수동 추출

1. **Figma에서 디자인 토큰 확인**
   - 색상: Design → Colors
   - 타이포그래피: Design → Text Styles
   - 간격: 컴포넌트 간격 측정

2. **프로젝트 테마 파일 업데이트**

   ```javascript
   // src/theme/colors.js
   export const colors = {
     // Figma에서 추출한 색상
     primary: "#0A84FF",      // Figma Primary 색상
     background: "#FFFFFF",   // Figma Background 색상
     surface: "#F5F7FA",     // Figma Surface 색상
     // ...
   };
   ```

   ```javascript
   // src/theme/typography.js
   export const typography = {
     // Figma에서 추출한 텍스트 스타일
     h1: {
       fontSize: 32,          // Figma H1 font size
       fontWeight: "700",    // Figma H1 font weight
       fontFamily: "Inter-Bold",
     },
     // ...
   };
   ```

### 3.2 컴포넌트 구현

1. **Figma 컴포넌트 분석**
   - 컴포넌트 구조 확인
   - Props/변형 확인
   - 스타일 속성 확인

2. **React Native 컴포넌트 작성**

   ```javascript
   // src/components/ui/Button/Button.js
   import React from 'react';
   import { TouchableOpacity, Text, StyleSheet } from 'react-native';
   import { colors, spacing, typography } from '../../../theme';

   export function Button({ children, onPress, ...props }) {
     return (
       <TouchableOpacity
         style={styles.button}
         onPress={onPress}
         {...props}
       >
         <Text style={styles.text}>{children}</Text>
       </TouchableOpacity>
     );
   }

   const styles = StyleSheet.create({
     button: {
       // Figma 디자인에서 측정한 값
       borderRadius: 12,
       paddingVertical: spacing.md,
       paddingHorizontal: spacing.lg,
       backgroundColor: colors.primary,
     },
     text: {
       ...typography.body,
       color: '#FFFFFF',
     },
   });
   ```

## 🛠️ 방법 4: Figma Dev Mode 활용

### 4.1 Figma Dev Mode 사용

1. **Figma Dev Mode 활성화**
   - Figma 파일에서 Dev Mode 전환
   - 컴포넌트 선택
   - 코드 스니펫 확인

2. **디자인 스펙 확인**
   - 색상 값 복사
   - 간격 값 확인
   - 폰트 스타일 확인

3. **수동으로 코드 작성**
   - Dev Mode에서 확인한 값들을
   - React Native 코드로 변환

## 📦 추천 워크플로우

### 단계별 프로세스

1. **디자인 토큰 추출**
   ```bash
   npm run figma:extract-tokens
   ```

2. **테마 파일 자동 생성**
   ```bash
   npm run figma:generate-theme
   ```

3. **컴포넌트 구현**
   - Figma 디자인 참고
   - 수동으로 컴포넌트 작성
   - 또는 Locofy/Anima 사용

4. **스타일 검증**
   ```bash
   npm run figma:compare
   ```

## 🔧 구현 예시 스크립트

### Figma 토큰 추출 스크립트 생성

```bash
# scripts/figma-extract.js 생성 필요
```

## 📚 참고 자료

- [Figma API 문서](https://www.figma.com/developers/api)
- [Locofy.ai 문서](https://docs.locofy.ai/)
- [Anima 문서](https://www.animaapp.com/docs)
- [Figma Dev Mode 가이드](https://help.figma.com/hc/en-us/articles/360055204333)

## ⚠️ 주의사항

1. **완전 자동화는 어렵습니다**
   - Figma → React Native 완전 자동 변환은 제한적
   - 대부분 수동 작업 필요

2. **디자인 토큰 우선**
   - 색상, 타이포그래피, 간격은 자동 추출 가능
   - 컴포넌트는 수동 구현 권장

3. **반응형 고려**
   - Figma는 고정 크기
   - React Native는 다양한 화면 크기 대응 필요

4. **인터랙션 구현**
   - Figma는 정적 디자인
   - 인터랙션은 별도 구현 필요

## 🎯 다음 단계

1. Figma API 토큰 설정
2. 디자인 토큰 추출 스크립트 작성
3. 테마 파일 자동 생성
4. 컴포넌트 수동 구현

