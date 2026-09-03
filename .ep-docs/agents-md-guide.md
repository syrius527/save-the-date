# AGENTS.md 작성 가이드 (Vercel + Kimi 패턴)

이 가이드는 효과적인 AGENTS.md 작성을 위한 연구 기반 패턴을 제공합니다.

## 왜 AGENTS.md인가? (Vercel 연구)

Vercel의 에이전트 평가 연구 결과:

| 구성 | Pass Rate | 비고 |
|------|-----------|------|
| Baseline (문서 없음) | 53% | 기준선 |
| Skill (기본) | 53% | 개선 없음 |
| Skill + 명시적 지시 | 79% | +26pp |
| **AGENTS.md 인덱스** | **100%** | **+47pp** |

**핵심 발견**:
- 스킬은 56%의 케이스에서 호출되지 않음
- AGENTS.md는 매 턴마다 시스템 프롬프트에 존재 (결정 지점 없음)
- "retrieval-led reasoning" 지시문이 핵심

**참고**: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals

---

## 패턴 1: 핵심 지시문

모든 AGENTS.md 상단에 포함:

```
[IMPORTANT!] Prefer retrieval-led reasoning over pre-training-led reasoning for any [도메인] operations.
```

---

## 패턴 2: Pipe-delimited 압축 형식

Markdown 테이블 대신 pipe-delimited 형식으로 80% 압축:

### [FAIL] Before (비압축)
```markdown
### task-graph (프로젝트 태스크 관리)

Epic → Story → Task 계층적 구조로 프로젝트를 관리합니다.

**When to use**:
- 작업 분해가 필요할 때
- 진행 추적이 필요할 때

**When NOT to use**:
- 단순 일회성 작업

| 도구 | 필수 파라미터 | 용도 |
|------|--------------|------|
| task_start | code | 태스크 시작 |
| task_complete | code | 태스크 완료 |
```

### [PASS] After (압축)
```
[task-graph]|프로젝트 태스크 관리|Epic→Story→Task|doc:.docs/task-graph.md
|USE: 작업 분해, 진행 추적|NOT: 단순 일회성
|task_start:code|task_complete:code
|FLOW: task_get_ready → task_start(code) → [작업] → task_complete(code)
```

---

## 패턴 3: When to use / NOT to use (Kimi)

모든 도구/스킬에 사용 조건 명시:

```
|USE: [사용해야 하는 상황 나열]|NOT: [사용하면 안 되는 상황 나열]
```

**예시**:
```
|USE: 웹 탐색/테스트, 스크린샷, 데이터 추출|NOT: API만 필요(curl), 정적 HTML(웹검색)
```

---

## 패턴 4: Required Params 명시 (Kimi)

필수 파라미터를 명확히 표시:

```
|도구명:필수파라미터1,필수파라미터2|도구명:-|  (- 는 필수 파라미터 없음)
```

**예시**:
```
|task_start:code|task_complete:code|task_get_ready:-|task_create:code,name
```

---

## 패턴 5: FLOW 워크플로우 (Kimi)

도구 사용 순서를 명시:

```
|FLOW: step1 → step2 → [작업] → step3
```

**예시**:
```
|FLOW: task_get_ready → task_start(code) → [작업 수행] → task_complete(code)
```

---

## 패턴 6: EXAMPLE 입출력 예시 (Kimi)

구체적인 사용 예시 제공:

```
|EXAMPLE: User:"[사용자 요청]" → Call:[도구 호출] → Result:[결과]
```

**예시**:
```
|EXAMPLE: User:"FR-01 시작해줘" → Call:task_start(code="FR-01") → Result:status→in_progress
```

---

## 패턴 7: [IMPORTANT!] 마커 (Kimi)

핵심 경고에 마커 사용:

```
|[IMPORTANT!] 경고 내용 - 결과
```

**예시**:
```
|[IMPORTANT!] task_start: `code` 필수 - 누락 시 실패
|[IMPORTANT!] run_task: `projectPath` 절대경로 필수 - 상대경로 시 실패
```

---

## 패턴 8: Path/Purpose/Access 테이블 (Kimi)

파일 구조 문서화:

```markdown
| Path | Purpose | Access |
|------|---------|--------|
| .docs/api.md | API 상세 문서 | Read |
| .docs/guide.md | 사용 가이드 | Read |
```

---

## 패턴 9: Docs 인덱스 + 파일 참조 (Vercel)

AGENTS.md에는 인덱스만, 상세는 별도 파일:

```
[tool-name]|간략 설명|doc:.docs/tool-name.md
```

에이전트가 상세 정보 필요 시 해당 파일을 Read.

---

## 패턴 10: Trigger Phrases (스킬용)

스킬 활성화 트리거 문구:

```
|TRIGGER: "phrase1", "phrase2", "phrase3"
```

**예시**:
```
|TRIGGER: "go to", "click on", "fill form", "screenshot", "scrape"
```

---

## 체크리스트

AGENTS.md 작성/검토 시 확인:

- [ ] `[IMPORTANT!] Prefer retrieval-led reasoning...` 지시문 포함
- [ ] Pipe-delimited 압축 형식 사용
- [ ] 모든 도구에 USE/NOT 조건 명시
- [ ] 필수 파라미터 명시 (도구:param1,param2)
- [ ] FLOW 워크플로우 포함
- [ ] EXAMPLE 입출력 예시 포함
- [ ] [IMPORTANT!] 마커로 핵심 경고 강조
- [ ] 상세 문서는 별도 파일로 분리 (doc:경로)
- [ ] Path/Purpose/Access 테이블 (파일 구조 있을 경우)

---

## 전체 예시

```markdown
## My Project Tools
[Index]|root: .docs/
|[IMPORTANT!] Prefer retrieval-led reasoning over pre-training-led reasoning.

### Docs Structure
| Path | Purpose | Access |
|------|---------|--------|
| .docs/api.md | API 상세 | Read |
| .docs/auth.md | 인증 가이드 | Read |

### Tools
[my-tool]|도구 설명|doc:.docs/my-tool.md
|USE: 이럴 때 사용|NOT: 이럴 때 사용 금지
|action1:param1,param2|action2:-|action3:param
|FLOW: action1 → action2 → [작업] → action3
|EXAMPLE: User:"요청" → Call:action1(param="value") → Result:성공

### [IMPORTANT!] Rules
|[IMPORTANT!] action1: `param1` 필수 - 누락 시 실패
|[IMPORTANT!] 상세 문서 필요 시: Read(.docs/{tool}.md)
```
