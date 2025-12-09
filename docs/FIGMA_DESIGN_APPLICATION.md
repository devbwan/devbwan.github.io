# Figma 디자인 적용 가이드 - RunWave Home Screen

## 📋 Figma 파일 정보

- **파일 이름**: RunWave Home Screen Design
- **파일 키**: `lW3umIxEA6l6GMuUTHz6LT`
- **URL**: https://www.figma.com/make/lW3umIxEA6l6GMuUTHz6LT/RunWave-Home-Screen-Design

## 🎨 디자인 확인 방법

### 방법 1: Figma API를 통한 자동 확인

```bash
# 1. Figma API 토큰 설정
echo "FIGMA_ACCESS_TOKEN=your_token" >> .env
echo "FIGMA_FILE_KEY=lW3umIxEA6l6GMuUTHz6LT" >> .env

# 2. 디자인 확인
npm run figma:view-design

# 3. 디자인 토큰 추출
npm run figma:extract-tokens
```

### 방법 2: 수동 디자인 스펙 확인

Figma Dev Mode에서 다음 정보를 확인:

1. **색상 값**
   - Primary 색상
   - Background 색상
   - Text 색상들
   - Border 색상

2. **타이포그래피**
   - 제목 폰트 크기 및 굵기
   - 본문 폰트 크기
   - 통계 숫자 폰트 크기

3. **간격 (Spacing)**
   - 카드 간격
   - 섹션 간격
   - 내부 패딩

4. **컴포넌트 구조**
   - 헤더 레이아웃
   - 통계 카드 레이아웃
   - 커뮤니티 피드 레이아웃
   - Floating Button 위치 및 스타일

## 📐 예상 디자인 구조

RunWave Home Screen Design 파일의 예상 구조:

```
HomeScreen
├── Header (인사말 + 사용자 이름)
├── Today Section
│   ├── SectionTitle: "Today"
│   └── SummaryCard
│       ├── 러닝 횟수
│       ├── 거리
│       ├── 시간
│       └── 평균 페이스
├── Community Section
│   ├── SectionTitle: "Community"
│   └── FeedPreview
│       ├── 활동 항목 1
│       ├── 활동 항목 2
│       └── 활동 항목 3
└── FloatingButton (Start Run)
```

## 🔧 디자인 적용 단계

### Step 1: 디자인 토큰 확인 및 업데이트

Figma에서 확인한 색상, 타이포그래피, 간격 값을 `src/theme/` 파일에 반영:

```javascript
// src/theme/colors.js
export const colors = {
  // Figma 디자인에서 확인한 색상
  primary: "#0A84FF",      // Figma Primary
  background: "#FFFFFF",   // Figma Background
  // ...
};
```

### Step 2: 컴포넌트 구조 확인

Figma 디자인에서 확인한 컴포넌트 구조를 현재 코드와 비교:

- 레이아웃 순서
- 컴포넌트 크기
- 간격 및 패딩
- 텍스트 스타일

### Step 3: HomeScreen 업데이트

Figma 디자인에 맞게 `app/(tabs)/index.js` 업데이트:

1. 헤더 추가 (인사말)
2. 섹션 순서 확인
3. 카드 레이아웃 조정
4. Floating Button 스타일 확인

### Step 4: 컴포넌트 개선

필요시 다음 컴포넌트 업데이트:

- `TodaySummaryCard.js` - 통계 카드 레이아웃
- `ActivityFeedPreview.js` - 피드 미리보기 레이아웃

## 📝 체크리스트

- [ ] Figma 디자인 파일 확인
- [ ] 색상 토큰 추출 및 업데이트
- [ ] 타이포그래피 토큰 추출 및 업데이트
- [ ] 간격 토큰 추출 및 업데이트
- [ ] HomeScreen 레이아웃 확인
- [ ] 컴포넌트 구조 비교
- [ ] 디자인 적용 및 테스트

## 🚀 빠른 시작

Figma API 토큰이 설정되어 있다면:

```bash
# 디자인 확인
npm run figma:view-design

# 결과 확인
cat figma-design-summary.json

# 디자인 토큰 추출
npm run figma:extract-tokens

# 생성된 파일 확인
ls src/theme/*.figma.js
```

## 💡 팁

1. **Figma Dev Mode 활용**
   - Figma에서 Dev Mode 전환
   - 컴포넌트 선택 시 코드 스니펫 확인
   - 색상, 간격 값 복사

2. **디자인 토큰 우선**
   - 색상, 타이포그래피, 간격은 자동 추출 가능
   - 컴포넌트 구조는 수동 확인 필요

3. **점진적 적용**
   - 먼저 색상 및 타이포그래피 적용
   - 그 다음 레이아웃 조정
   - 마지막으로 세부 스타일 조정

