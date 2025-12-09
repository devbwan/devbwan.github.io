# RunWave React Native 리팩토링 완료

## 📋 작업 완료 내역

### 1. 디자인 시스템 생성 ✅
- `src/theme/tokens.ts` 생성
  - colors (primary, danger, success, purple, gray)
  - gradients (expo-linear-gradient용 배열)
  - radius (px 단위)
  - spacing (px 단위)
  - typography (fontSize, fontWeight, letterSpacing, lineHeight)
  - shadows (React Native shadowColor + shadowOffset + shadowOpacity + elevation)

### 2. UI 컴포넌트 생성 ✅
`src/components/ui/` 폴더에 다음 컴포넌트 생성:
- `Icon.tsx` - lucide-react-native 래퍼 (현재 MaterialCommunityIcons로 대체)
- `CircleIcon.tsx` - 그라데이션 원형 아이콘
- `Card.tsx` - 카드 컴포넌트 (elevated variant 지원)
- `SectionTitle.tsx` - 섹션 제목
- `Header.tsx` - 헤더 컴포넌트
- `FabButton.tsx` - Floating Action Button
- `StatCard.tsx` - 통계 카드
- `CommunityRow.tsx` - 커뮤니티 피드 행
- `GradientBackground.tsx` - 그라데이션 배경

### 3. 화면 컴포넌트 생성 ✅
`src/screens/` 폴더에 다음 화면 생성:
- `HomeScreen.tsx` - 홈 화면 (Hero, Stats, Weekly Goal, Community Feed, FAB)
- `RunStartScreen.tsx` - 러닝 시작 화면
- `RunActiveScreen.tsx` - 러닝 중 화면
- `RunSummaryScreen.tsx` - 러닝 완료 화면
- `CommunityScreen.tsx` - 커뮤니티 화면
- `ProfileScreen.tsx` - 프로필 화면

### 4. 네비게이션 구조 ✅
- Expo Router 기반 구조 유지
- `app/(tabs)/index.js`를 새 `HomeScreen`으로 연결
- 기존 네비게이션 구조와 호환

### 5. 빌드 설정 ✅
- `babel-plugin-module-resolver` 설치 및 설정
- `@/` 경로 별칭 설정 (`babel.config.js`)
- TypeScript 경로 설정 (`tsconfig.json`)

## 🎨 디자인 시스템 특징

### Colors
```typescript
colors.primary.light // #0A84FF
colors.primary.dark  // #0066CC
colors.danger.light  // #FF6B6B
colors.danger.dark   // #FF8E53
// ... 등
```

### Typography
- `h1`: fontSize 32, fontWeight 800, letterSpacing -0.02
- `h2`: fontSize 20, fontWeight 600, letterSpacing -0.01
- `stat`: fontSize 26, fontWeight 800
- `statXLarge`: fontSize 48, fontWeight 800

### Shadows
React Native용 shadow 스타일:
- `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` (iOS)
- `elevation` (Android)

## 📱 화면 구조

### HomeScreen
- Header (로고 + 아바타)
- Hero Card (오늘의 러닝)
- Stats Grid (시간, 페이스)
- Weekly Goal Card (그라데이션)
- Community Feed
- FAB (러닝 시작)

### RunStartScreen
- 간단한 시작 버튼

### RunActiveScreen
- 통계 표시 (시간, 거리, 페이스)
- 일시정지/종료 버튼

### RunSummaryScreen
- 완료 메시지
- 홈으로 돌아가기 버튼

## 🔧 사용 방법

### 컴포넌트 사용 예시
```tsx
import { Card, StatCard, SectionTitle } from '@/components/ui';
import { colors, spacing, shadows } from '@/theme/tokens';

<Card variant="elevated">
  <SectionTitle>제목</SectionTitle>
</Card>
```

### 화면 사용 예시
```tsx
import HomeScreen from '@/screens/HomeScreen';

export default function Home() {
  return <HomeScreen />;
}
```

## 📝 다음 단계

1. **lucide-react-native 설치**
   ```bash
   npm install lucide-react-native
   ```
   설치 후 `Icon.tsx`에서 lucide 아이콘 사용 가능

2. **기존 화면 마이그레이션**
   - `app/(tabs)/run.js` → 새 RunStartScreen/RunActiveScreen 연결
   - `app/(tabs)/profile.js` → 새 ProfileScreen 연결
   - `app/(tabs)/records.js` → 새 화면 생성 필요

3. **기능 통합**
   - 기존 러닝 추적 로직을 새 화면에 통합
   - 상태 관리 (Zustand) 연결
   - API 호출 로직 연결

## ⚠️ 주의사항

1. **Icon 컴포넌트**: 현재 MaterialCommunityIcons 사용 중. lucide-react-native 설치 후 교체 필요
2. **경로 별칭**: `@/` 경로는 babel-plugin-module-resolver로 처리됨
3. **그라데이션**: expo-linear-gradient 사용
4. **Shadow**: Android/iOS 모두 지원하도록 elevation + shadowColor 조합 사용

## 🎯 Figma 디자인 준수

- 모든 색상, 간격, 폰트 크기는 Figma 디자인과 1:1 매칭
- Android/iOS 모두 동일하게 보이도록 설계
- letterSpacing, lineHeight 등 세부 스타일 적용

