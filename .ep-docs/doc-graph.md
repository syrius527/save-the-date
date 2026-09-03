# doc-graph MCP (문서 그래프 관리)

프로젝트 문서를 메타데이터와 함께 관리. 태스크와 연결 가능.

## 문서 유형
index | overview | detail | guide | reference

## When to use
- 문서-태스크 연결이 필요할 때
- 문서 간 관계 추적이 필요할 때
- 프로젝트 문서를 체계적으로 관리할 때

## When NOT to use
- 단순 파일 읽기/쓰기 (Read/Write 도구 사용)
- 임시 파일 관리

## 도구 상세

### doc_create
**필수 파라미터**: `path`, `title`
**선택 파라미터**: `description`, `type`, `category`, `tags`, `taskCode`, `detailLevel`

새 문서 레코드 생성.

### doc_get
**필수 파라미터**: `path`
단일 문서 조회.

### doc_list
**선택 파라미터**: `category`, `type`, `taskCode`, `hasTag`, `sortBy`, `limit`
문서 목록 조회.

### doc_search
**필수 파라미터**: `query`
**선택 파라미터**: `searchIn`, `type`, `category`, `limit`

제목/설명/태그로 검색.

### doc_for_task
**필수 파라미터**: `taskCode`
특정 태스크와 연결된 모든 문서 조회.

### doc_update
**필수 파라미터**: `path`
**선택 파라미터**: `title`, `description`, `type`, `category`, `tags`, `taskCode`, `detailLevel`

문서 레코드 수정.

### doc_sync
**필수 파라미터**: `path`, `title`
문서 동기화 (존재하면 업데이트, 없으면 생성).

### doc_add_relation
**필수 파라미터**: `sourcePath`, `targetPath`, `relationType`

relationType 옵션:
- parent_child: 부모-자식 관계
- depends_on: 의존 관계
- related: 연관 관계
- implements: 구현 관계
- see_also: 참고 관계

### doc_remove_relation
**필수 파라미터**: `sourcePath`, `targetPath`
**선택 파라미터**: `relationType`

문서 간 관계 제거. relationType 미지정 시 모든 관계 제거.

### doc_relations
**필수 파라미터**: `path`
**선택 파라미터**: `direction` (outgoing|incoming|both)

특정 문서의 모든 관계 조회.

### doc_map
**선택 파라미터**: `format` (tree|table|mermaid), `category`
전체 문서 구조를 형식화하여 표시.

### doc_stats
문서 통계 조회.

### doc_delete
**필수 파라미터**: `path`
문서 삭제 (관련 관계도 함께 삭제).

### doc_delete_all
**필수 파라미터**: `confirm: true`
전체 문서 삭제.

## Workflow

```
doc_create(path, title, taskCode) → doc_add_relation(source, target, "implements")
```

## CRITICAL Rules
- doc_add_relation의 relationType: parent_child|depends_on|related|implements|see_also
- path는 프로젝트 내 상대 경로 권장
