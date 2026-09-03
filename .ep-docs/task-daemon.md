# task-daemon MCP (빌드/테스트 실행)

빌드, E2E 테스트, 린트 등 장시간 작업을 백그라운드에서 실행.

## 특징
- 프로젝트당 1개씩만 실행
- 추가 요청은 큐에 대기
- 완료 시 세션에 자동 알림 (SYSTEM REMINDER)
- E2E/테스트 실행 시 리포트 자동 파싱 (Playwright, Jest 지원)

## When to use
- 빌드 실행 (npm run build, pnpm build 등)
- E2E 테스트 실행 (playwright test)
- 유닛 테스트 실행 (jest, vitest)
- 린트/타입체크 (eslint, tsc)
- 장시간 소요되는 모든 작업

## When NOT to use
- 빠른 명령 (직접 Bash 사용)
- 즉시 결과가 필요한 경우
- 인터랙티브 명령

## 도구 상세

### run_task
**필수 파라미터**: `command`, `projectPath`
**선택 파라미터**: `taskType`, `timeout`, `sessionId`

taskType 옵션:
- build: 빌드 작업
- e2e: E2E 테스트 (Playwright 리포트 파싱)
- test: 유닛 테스트 (Jest 리포트 파싱)
- lint: 린트 검사
- typecheck: 타입 체크
- custom: 기타 작업

**중요**: projectPath는 반드시 절대경로 사용!

### task_status
현재 실행 중인 작업 및 큐 상태 조회.

### cancel_task
**필수 파라미터**: `jobId`
실행 중이거나 대기 중인 작업 취소.

## Workflow

```
run_task(command, projectPath, taskType) → [완료 대기] → SYSTEM REMINDER 수신
```

## CRITICAL Rules
- projectPath는 절대경로 필수 (/Users/... 또는 /home/...)
- 동일 프로젝트에서 여러 작업 요청 시 순차 실행됨
- 타임아웃 기본값: 5분 (300000ms)
