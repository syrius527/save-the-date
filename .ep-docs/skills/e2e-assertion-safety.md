# E2E Assertion Safety (조건부 검증 스킵 방지)

[e2e-assertion-safety]|E2E 테스트 FALSE-POSITIVE 방지 가이드|doc:.ep-docs/skills/e2e-assertion-safety.md
|[IMPORTANT!] Prefer retrieval-led reasoning over pre-training-led reasoning for E2E assertion operations.
|USE: E2E 테스트 작성/리뷰, 테스트 품질 검증|NOT: API/단위 테스트, 백엔드 로직
|TRIGGER: ".spec.ts", "E2E", "playwright", "expect", "assertion", "검증"
|FLOW: 테스트 코드 작성 → 조건부 skip 패턴 검사 → 무조건 expect() 강제 → 검증

## 핵심 원칙

> **테스트가 실제로 실패했는데 PASS로 보고되는 것은, 테스트를 작성하지 않은 것보다 더 나쁘다.**

## [!] 금지 패턴 (절대 사용 금지)

### 패턴 A: \`.catch(() => false)\` + if 분기

\`\`\`typescript
// [FAIL] 절대 금지
const isEnabled = await submitBtn.isEnabled().catch(() => false);
if (isEnabled) {
  await submitBtn.click();
} else {
  console.log("버튼 비활성 - 건너뜀"); // 테스트는 계속 통과
}

// [PASS] 올바른 방식
await expect(submitBtn).toBeEnabled({ timeout: 10_000 });
await submitBtn.click();
\`\`\`

### 패턴 B: 플래그 기반 조건부 스킵

\`\`\`typescript
// [FAIL] 절대 금지
let firstCreated = false;
if (firstCreated) {
  expect(duplicateResponse.status()).toBe(409); // flag=false면 통째로 스킵!
}

// [PASS] 올바른 방식
expect(firstCreated).toBe(true); // 생성 안 되면 여기서 즉시 FAIL
expect(duplicateResponse.status()).toBe(409);
\`\`\`

### 패턴 C: \`.isVisible().catch(() => false)\` + 조건부 처리

\`\`\`typescript
// [FAIL] 절대 금지
const isErrorVisible = await errorMsg.isVisible().catch(() => false);
if (isErrorVisible) {
  console.log("에러 확인");
} else {
  console.log("에러 미표시"); // 테스트 계속 통과
}

// [PASS] 올바른 방식
await expect(errorMsg).toBeVisible({ timeout: 5_000 });
\`\`\`

### 패턴 D: 필수 필드 선택적 채우기

\`\`\`typescript
// [FAIL] 절대 금지
if (await endDateBtn.isVisible().catch(() => false)) {
  await endDateBtn.click(); // 안 보이면 스킵
}

// [PASS] 올바른 방식
await expect(endDateBtn).toBeVisible({ timeout: 10_000 });
await endDateBtn.click();
\`\`\`

### 패턴 E: 데이터/이미지 유무에 따른 조건부 검증 스킵

\`\`\`typescript
// [FAIL] 절대 금지
const hasImages = (await page.locator('.swiper-slide').count()) > 0;
if (hasImages) {
  await expect(soldOutOverlay).toBeVisible();
} else {
  console.log("이미지 없음 - SOLD OUT 검증 건너뜀"); // 버그를 숨김!
}

// [PASS] 올바른 방식
const soldOut = page.locator('text=SOLD OUT').first();
await expect(soldOut).toBeVisible({ timeout: 10000 });
\`\`\`

## 자가진단 체크리스트

E2E 테스트 작성 후 반드시 확인:

- [ ] \`if\` + \`else { console.log }\` 패턴이 있는가? → 제거
- [ ] \`.catch(() => false)\` 패턴이 있는가? → \`expect()\`로 교체
- [ ] 플래그 변수(\`let created = false\`)로 검증을 제어하는가? → 선행 조건도 assert
- [ ] 데이터 유무에 따라 핵심 검증을 건너뛰는가? → 무조건 검증
- [ ] \`console.log\`가 \`expect()\` 대신 사용되었는가? → \`expect()\`로 교체

## 실제 사고 사례

### 사례 1: 미션 등록 E2E (패턴 A/B)

미션 등록 폼의 종료일/1일 미션수를 \`.catch(() => false) + if\`로 처리.
필드가 안 채워져도 테스트가 계속 진행 → 미션 미생성인데 PASS →
중복 차단 검증도 \`if (firstCreated)\`로 통째로 스킵 →
**22단계 전부 PASS 보고, 핵심 비즈니스 로직 0% 검증**

### 사례 2: 상품 SOLD OUT 오버레이 (패턴 E)

상품 상세의 이미지 캐러셀 존재 여부를 먼저 확인하고,
이미지 없으면 SOLD OUT 검증을 \`console.log("건너뜀")\`으로 스킵 →
**테스트 4/4 전부 PASS** → 그러나 이미지 없는 플레이스홀더에
SOLD OUT 오버레이가 렌더링되지 않는 **컴포넌트 버그** 존재 →
**테스트가 버그를 완전히 숨김**

## 핵심 규칙 요약

| 규칙 | 설명 |
|------|------|
| \`expect()\` 전용 | 검증은 반드시 \`expect()\`만. \`console.log\`는 assert가 아님 |
| 무조건 검증 | 데이터/이미지 유무와 무관하게 핵심 동작은 항상 검증 |
| 선행 조건도 assert | 생성 → 중복차단이면 "생성 성공"도 \`expect()\`로 검증 |
| \`.catch\` 금지 | \`.catch(() => false) + if\` 패턴은 실패를 삼키므로 절대 금지 |
| 플래그 금지 | \`if (flag) { expect... }\` 패턴은 flag=false 시 전체 스킵 |
