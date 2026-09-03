# coding-discipline (AI 코딩 가이드라인 상세)

AGENTS.md의 [coding-discipline] 규칙을 상세 설명한 문서. 상시 규칙의 이유, 안티패턴, 자문 질문, 검증 기준을 필요할 때 참고한다.

## Think Before Coding

애매하면 추측하지 말고 범위/의도/해석 후보를 먼저 드러내고 확인.

질문이 필요한 신호:
- 숨은 가정 존재
- 해석이 2개 이상 가능
- 더 단순한 대안 존재
- 요구사항/범위/부작용 불명확

## Simplicity First

지금 필요한 만큼만 구현한다.

- 단일 용도의 추상화 금지
- 설정/확장성/미래 대비 코드 금지
- 사용자가 요청하지 않은 옵션/유연성 추가 금지

## Surgical Changes

요청과 직접 관련된 줄만 수정한다.

- 인접 코드 개선 금지
- drive-by refactor 금지
- 불필요한 포맷 변경 금지
- 내가 만든 변경으로 생긴 orphan만 정리

## Goal-Driven Execution

구현 전에 성공 조건과 검증 방법을 먼저 정한다.

- 버그 수정 = 재현 → 수정 → 회귀 확인
- 기능 추가 = 수용 기준 → 구현 → 검증
- 완료 선언 전에 테스트/빌드/타입체크/수동 검증 중 적절한 경로로 증명

## 금지 안티패턴

- silent assumption
- overengineering
- adjacent cleanup
- 검증 없는 완료 선언

## 자문 규칙

- "이 변경의 모든 줄이 사용자 요청에 직접 연결되는가?"
- "시니어가 과한 설계라고 하겠는가?"
- "완료를 무엇으로 증명할 것인가?"

## Plan Mode

3단계 이상 또는 멀티파일이면 계획 먼저.

FLOW: 목표 재확인 → 기존 패턴 파악 → 최소 설계 → 구현 → 테스트 → 검증 → 교훈 기록

[IMPORTANT!] 검증 단계는 계획 안에 포함 — 나중에 추가하지 않는다.

## Self-Improvement

실수/수정 발생 시 → tasks/lessons.md에 기록

FORMAT: 실패 유형 | 감지 신호 | 예방 규칙

[IMPORTANT!] 세션 시작 시 + 대형 리팩토링 전 tasks/lessons.md 반드시 읽기

## Stop-the-Line

예상치 못한 실패 발생 시 → 즉시 기능 추가 중단

FLOW: 증거 보존 → 재현 → 범위 격리 → 최소 케이스 축소 → 근본 원인 수정 → 회귀 방지 → 검증

[IMPORTANT!] 증상이 아닌 근본 원인 수정. 수정 명목의 광범위 리팩토링 금지

## Definition of Done

- 동작이 인수 기준과 일치
- 테스트/lint/typecheck/빌드 통과 또는 미실행 사유 문서화
- 검증 스토리 존재: 무엇이 바뀌었고 어떻게 작동을 확인했는지
- "시니어 엔지니어가 이 diff + 검증 스토리를 승인하겠는가?" 자문

## Model Specialization (P2)

| 역할 | 모델 | 토큰 예산 |
|------|------|----------|
| Orchestrator/Planner | vibeproxy-anthropic/claude-opus-4-6-thinking-32000 | 32k thinking |
| Worker/Explorer | vibeproxy-anthropic/claude-opus-4-6-thinking-32000 | 기본 |
| Validator/Reviewer | vibeproxy-anthropic/claude-opus-4-6-thinking-32000 | 16k thinking |

[IMPORTANT!] milestone 검증, 아키텍처 결정에는 thinking 모델 사용 권장
