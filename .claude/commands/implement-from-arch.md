---
description: Implement from architecture-document-writer output using architecture-implementation-engineer with mandatory Bruno/Playwright testing
argument-hint: <architecture-doc-path> [optional implementation scope]
---

**[!] SINGLE AGENT EXECUTION - ARCH IMPLEMENTATION [!]**

- [PASS] ALWAYS use exactly ONE Task tool call with `architecture-implementation-engineer`
- [FAIL] NEVER split this into multiple parallel implementation subagents

---

## Trigger Phrases

- "설계서 기반으로 구현해줘"
- "architecture 문서 기준으로 개발"
- "아키텍처 문서 기반 구현 + 테스트"
- "구현하고 bruno/playwright 테스트까지"

---

## Task

Implement based on the architecture document and enforce test automation.

**Document / Scope**: $ARGUMENTS

If no architecture document path is provided, the subagent must locate one under:
- `docs/architecture/implementation/**/00-overview.md`

---

## Instructions for Subagent

1. Read architecture-document-writer output first
2. Implement exactly by documented scope
3. Decide test strategy by changed files:
   - API changes → invoke `bruno-test-writer`
   - UI flow changes → invoke `playwright-test-writer`
   - both → invoke both
4. Run verification: tests + typecheck + build
5. Collect structured reports from test sub-agents
6. Report changed files, generated tests, and verification evidence

---

## [!] CRITICAL RULES

1. **No architecture-doc skip** — document-first implementation mandatory
2. **No test skip** — Bruno/Playwright invocation required by change type
3. **No out-of-scope implementation** — follow architecture scope only
4. **No fake success report** — include real execution evidence
5. **No completion without verification** — include real execution evidence
6. **No completion without FULL video evidence** — if Playwright FULL video upload fails or artifact missing, report as FAIL

---

Please use the architecture-implementation-engineer subagent now.
