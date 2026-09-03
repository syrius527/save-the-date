# task-graph MCP (프로젝트 태스크 관리)

Epic → Story → Task 계층적 구조로 프로젝트를 관리합니다.

## 코드 규칙
`PREFIX-NUM` 형식 (예: FR-01, BE-02-DB, API-03)

## When to use
- 작업 분해가 필요할 때
- 진행 추적이 필요할 때
- 의존성 관리가 필요할 때
- 다단계 작업을 체계적으로 관리할 때

## When NOT to use
- 단순 일회성 작업
- 빠른 수정 (quick fix)
- 추적이 필요 없는 작업

## 도구 상세

### task_get_project
현재 세션의 프로젝트 경로 조회.

### task_list_projects
DB에 등록된 모든 프로젝트 목록 조회. 태스크 수, 완료 수, 마지막 업데이트 시간 포함.

### task_get_ready
지금 바로 시작 가능한 태스크 목록 조회 (선행 태스크가 모두 완료된 것들)

### task_start
**필수 파라미터**: `code`
태스크 시작. 상태를 in_progress로 변경하고 시작 시간 기록.

### task_complete
**필수 파라미터**: `code`
태스크 완료. 상태를 completed로 변경하고 완료 시간 기록.

### task_create
**필수 파라미터**: `code`, `name`
**선택 파라미터**: `description`, `parentCode`, `type`, `priority`, `estimatedHours`, `layer`, `docPath`, `subagents`

새 태스크 생성. type은 epic|story|task 중 선택.
subagents는 해당 태스크에서 사용할 서브에이전트 목록 (예: ["oracle", "librarian"]).

### task_get
**필수 파라미터**: `code`
**선택 파라미터**: `projectPath`
단일 태스크 상세 조회. projectPath 미지정 시 현재 프로젝트.

### task_list
**선택 파라미터**: `status`, `type`, `parentCode`, `projectPath`
태스크 목록 조회. 필터링 가능. projectPath 미지정 시 현재 프로젝트.

### task_add_dependency
**필수 파라미터**: `predecessorCode`, `successorCode`
태스크 간 의존성 추가. predecessor → successor 순서.

### task_remove_dependency
**필수 파라미터**: `predecessorCode`, `successorCode`
태스크 간 의존성 제거.

### task_get_dependencies
**필수 파라미터**: `code`, `direction`
direction: predecessors(선행) 또는 successors(후행)

### task_get_children
**필수 파라미터**: `code`
하위 태스크 조회.

### task_get_all_predecessors
**필수 파라미터**: `code`
전체 선행 체인 재귀 조회.

### task_update_status
**필수 파라미터**: `code`, `status`
status: pending|in_progress|completed|blocked|cancelled

### task_stats
프로젝트 태스크 통계 조회.

### task_delete
**필수 파라미터**: `code`
태스크 삭제 (관련 의존성도 함께 삭제).

### task_delete_all
**필수 파라미터**: `confirm: true`
전체 태스크 삭제 (DB 초기화).

## Workflow

```
task_get_ready → task_start(code) → [작업 수행] → task_complete(code)
```

## CRITICAL Rules
- task_start/task_complete 호출 시 `code` 필수 - 누락 시 실패
- 태스크 코드는 고유해야 함
- 순환 의존성 불가
