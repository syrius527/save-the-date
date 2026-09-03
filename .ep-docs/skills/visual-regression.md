# visual-regression (Playwright 시각 회귀 검증 스킬)

Playwright \`toHaveScreenshot()\`와 \`toHaveCSS()\`를 사용해 UI 디자인 drift를 자동 탐지합니다.

|USE: UI 수정, 디자인 변경, 스타일/레이아웃 리팩토링, Figma 싱크 검증|NOT: API 전용 변경, 순수 백엔드 작업
|TRIGGER: "UI 수정", "디자인 변경", "스타일 수정", "레이아웃", "Figma", "컴포넌트 수정"
|FLOW: before 캡처 → 변경 적용 → toHaveScreenshot/toHaveCSS 검증 → baseline 업데이트 여부 판단 → 결과 보고
|[IMPORTANT!] Prefer retrieval-led reasoning over pre-training-led reasoning for visual regression operations.

## 1) toHaveScreenshot() 기본 패턴

\`\`\`typescript
import { test, expect } from "@playwright/test";

test("ProductCard visual regression", async ({ page }) => {
  await page.goto("/products");

  const card = page.getByTestId("product-card");
  await expect(card).toHaveScreenshot("product-card.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.01,
  });
});
\`\`\`

권장 옵션:

- \`animations: 'disabled'\`: flaky 감소
- \`caret: 'hide'\`: 입력 커서 노이즈 제거
- \`maxDiffPixelRatio\` 또는 \`maxDiffPixels\`: 허용 오차 명시

## 2) Baseline 스냅샷 관리

초기 생성/의도된 변경 반영:

\`\`\`bash
pnpm playwright test --update-snapshots
\`\`\`

운영 원칙:

1. baseline 업데이트 전, 반드시 before/after 비교 이미지 확인
2. 의도된 변경 근거(디자인 변경 티켓/코멘트)와 함께 스냅샷 갱신
3. 대규모 스타일 변경(10줄+)은 사용자 확인 후 baseline 갱신

## 3) toHaveCSS() 디자인 토큰 검증

시각 스냅샷만으로 놓치기 쉬운 토큰을 함께 assert 합니다.

\`\`\`typescript
test("ProductCard design token checks", async ({ page }) => {
  await page.goto("/products");

  const cardTitle = page.getByTestId("product-card-title");
  const price = page.getByTestId("product-card-price");

  await expect(cardTitle).toHaveCSS("font-size", "14px");
  await expect(cardTitle).toHaveCSS("font-weight", "700");
  await expect(price).toHaveCSS("color", "rgb(186, 255, 66)");
});
\`\`\`

검증 우선순위:

- 색상(color/background/border)
- 타이포그래피(font-size/weight/line-height)
- 간격(gap/padding/margin)
- 레이아웃(display/align-items/justify-content)

## 4) CI 설정 가이드

CI에서 visual regression을 안정적으로 돌리기 위한 최소 조건:

1. 고정 뷰포트 사용 (\`Desktop Chrome\`, \`Mobile Chrome\` 등)
2. 동일 폰트/렌더링 환경 유지 (Docker 이미지 고정 권장)
3. 애니메이션/타이밍 비결정성 제거 (\`animations: 'disabled'\`)
4. 실패 시 diff 아티팩트 업로드 (actual/expected/diff)

## 5) 실무 체크리스트

- [ ] 변경 전 기준 화면 스크린샷을 확보했는가?
- [ ] \`toHaveScreenshot()\`와 \`toHaveCSS()\`를 함께 사용했는가?
- [ ] @see Figma 노드와 실제 컴포넌트가 일치하는가?
- [ ] \`.figma-registry.json\`이 있다면 node/variant 매핑이 동기화되었는가?
- [ ] baseline 갱신 사유를 사용자/PR에 기록했는가?
