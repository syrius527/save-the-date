# Figma Component Registry Guide

[figma-component-registry]|Figma 노드와 코드 컴포넌트 매핑 규약|doc:.ep-docs/figma-component-registry.md
|[IMPORTANT!] Prefer retrieval-led reasoning over pre-training-led reasoning for any Figma registry operations.
|USE: Figma 기반 UI 구현, @see URL 검증, 노드 drift 방지|NOT: Figma 미사용 컴포넌트, API/백엔드 작업
|FLOW: @see 확인 → .figma-registry.json 조회 → node/variant 교차검증 → 스크린샷 비교 → 변경 사유 기록

## 목적

\`.figma-registry.json\`은 **Figma node-id와 실제 코드 컴포넌트의 정합성**을 보장하기 위한 프로젝트 단위 레지스트리입니다.

- 잘못된 Figma 노드 참조(다른 컴포넌트/다른 variant) 방지
- @see 주석과 실제 구현 간 drift 조기 탐지
- 리뷰 단계에서 변경 사유를 빠르게 검증

## 파일 위치

- 루트 권장: \`<projectRoot>/.figma-registry.json\`
- 모노레포 예시: \`earning-club-web/.figma-registry.json\`

## 스키마

\`\`\`json
{
  "$schema": "https://example.com/schemas/figma-component-registry.schema.json",
  "version": 1,
  "updatedAt": "2026-02-12T10:00:00.000Z",
  "entries": [
    {
      "componentName": "ProductCard",
      "componentPath": "app/(home)/components/product-card.tsx",
      "figma": {
        "fileKey": "AbCdEf123456",
        "nodeId": "210:3393",
        "url": "https://www.figma.com/design/AbCdEf123456/...?...&node-id=210-3393"
      },
      "variant": {
        "state": "default",
        "size": "md",
        "theme": "light"
      },
      "owner": "frontend",
      "lastVerifiedAt": "2026-02-12T10:00:00.000Z",
      "notes": "hover/soldout variant와 혼동 금지"
    }
  ]
}
\`\`\`

### 필드 설명

- \`version\`: 레지스트리 버전(현재 \`1\`)
- \`entries[]\`: 컴포넌트별 매핑 목록
- \`componentName\`: 코드 컴포넌트 식별자
- \`componentPath\`: 실제 파일 경로(리네임 시 반드시 동기화)
- \`figma.nodeId\`: 기준 노드 ID (\`123:456\` 형식)
- \`figma.url\`: @see 주석과 동일해야 하는 canonical URL
- \`variant\`: 같은 컴포넌트의 상태/크기/테마 구분 메타데이터
- \`lastVerifiedAt\`: 마지막 수동 검증 시각

## 컴포넌트 주석 규약

컴포넌트 파일에 @see를 남기고, 레지스트리와 1:1 일치시킵니다.

\`\`\`tsx
/**
 * @see https://www.figma.com/design/AbCdEf123456/...?...&node-id=210-3393
 */
export function ProductCard() {
  // ...
}
\`\`\`

## 운영 규칙

1. @see URL 변경 시, 반드시 \`entries[].figma.url\`과 \`nodeId\`를 함께 업데이트
2. 동일 컴포넌트라도 variant가 다르면 별도 entry 추가
3. \`componentPath\` 이동/리네임 시 레지스트리 동기화
4. 변경 전/후 스크린샷 비교 후 \`lastVerifiedAt\` 갱신
5. 사용자 요청 없는 대규모 스타일 변경(10줄+)은 확인 후 진행

## 자동 검증 규칙 연동

rules-engine에서 다음 규칙으로 레지스트리 기반 검증을 유도합니다.

- \`figma-registry-check\`: @see + figma URL 탐지 시 레지스트리 교차 검증 리마인드
- \`figma-node-change-warning\`: @see 변경 시 사유 확인 + 레지스트리 동기화 + before/after 비교
- \`ui-component-design-drift-check\`: 사전 스크린샷/노드 오참조/사유 기록 강제 리마인드

## 리뷰 체크리스트

- [ ] @see URL의 \`node-id\`와 레지스트리 \`nodeId\`가 일치하는가?
- [ ] 다른 컴포넌트 entry를 잘못 참조하지 않았는가?
- [ ] 동일 컴포넌트 내 variant(default/hover/soldout)를 혼동하지 않았는가?
- [ ] before/after 스크린샷이 첨부되어 있는가?
- [ ] @see 변경 사유가 커밋/PR에 기록되어 있는가?
