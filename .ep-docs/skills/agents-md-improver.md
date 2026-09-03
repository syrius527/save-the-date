# agents-md-improver (AGENTS.md 작성/개선)

Vercel eval과 Kimi K2.5 패턴을 바탕으로 AGENTS.md 계열 지시 파일을 분석, 작성, 압축, 개선.

## Why this matters
- 스킬을 따로 찾아보게 하는 것보다 AGENTS.md에 바로 보이는 컨텍스트가 더 안정적으로 작동하는 경우가 많음
- 목표는 문서를 늘리는 것이 아니라, 에이전트가 언제 무엇을 읽고 무엇을 무시해야 하는지 명확히 만드는 것
- 여러 지시 파일이 흩어져 있으면 중복과 드리프트가 생기므로 single source of truth가 중요함

## When to use
- `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`를 만들거나 개선할 때
- Copilot/Codex/Cursor/Windsurf용 에이전트 지시 파일을 통합하거나 정리할 때
- 여러 에이전트 지시 파일을 하나의 소스 오브 트루스로 통합할 때
- pipe-delimited 형식이나 retrieval-led reasoning 패턴을 적용할 때
- AI 코딩 에이전트용 프로젝트 컨텍스트나 docs index를 구조화할 때

## When NOT to use
- 일반 코드 작성이나 버그 수정이 목표일 때
- 단순 문서 편집이나 README 보강만 필요한 경우
- 에이전트 지시 구조 개선이 아닌 일반 README 보강 작업

## Trigger Phrases
- "AGENTS.md"
- "CLAUDE.md"
- "COPILOT-INSTRUCTIONS"
- ".cursorrules"
- "에이전트 지시 파일"
- "coding agent context"
- "docs index for agents"
- "pipe-delimited"
- "retrieval-led reasoning"
- "프로젝트 컨텍스트 압축"
- "에이전트용 문서 인덱스"

## Workflow

```
기존 AGENTS/CLAUDE/.cursorrules 점검 → 프로젝트 구조/도구/문서 인덱스 스캔 → 핵심 패턴 적용 → 중복 지시를 source of truth로 통합 → 최종 AGENTS.md 검증
```

## Validation emphasis
- retrieval-led directive, pipe-delimited, USE/NOT 조건이 모두 있는지 확인
- `doc:path`가 실제 파일을 가리키는지 확인
- 중복된 agent instruction 파일이 남아 있지 않은지 확인

## 참고
- 상세 연구 배경과 패턴은 `skills/agents-md-improver/SKILL.md` 참고
- 일반 AGENTS 작성 가이드는 `.ep-docs/agents-md-guide.md` 참고
