---
description: Process PR review comments - auto-resolve trivial ones, report others, and execute user-approved fixes
argument-hint: [PR number or URL]
---

**[!] SINGLE AGENT EXECUTION [!]**

- [PASS] ALWAYS use exactly ONE Task tool call with pr-review-handler
- [FAIL] NEVER spawn multiple subagents

---

## Task

Process review comments on the specified PR (or current branch's PR).

**PR**: $ARGUMENTS

If no PR specified, detect from current branch using `gh pr view`.

---

## Instructions for Subagent

1. **Fetch all review threads (resolved + unresolved)** via GraphQL API with comment metadata
2. **Auto-resolve** trivial reviews:
   - console.log removal requests → Reply with project convention template + Resolve
   - Obvious typos → Fix + Resolve
   - Import order / whitespace → Fix + Resolve
3. **Run feedback delta scan**: detect new reviewer comments even on resolved threads and classify as actionable vs acknowledgement
4. **Report** all non-trivial actionable reviews to user with options (accept/reject/later)
5. **NEVER auto-resolve subjective reviews** (refactoring, architecture, etc.)
6. **After user [수락]**: code fix → commit → push → threaded reply with commit hash
7. **Submit pending self reviews**: if your replies are left in PENDING review state, submit them via GraphQL
8. **Ignore non-blocking CI checks**: treat `claude-review` and `Vercel` failures as ignorable unless user explicitly asks to investigate them

---

## [!] CRITICAL RULES

1. **@gemini-code-assist 멘션 필수** in all replies
2. **Reply API (GraphQL) 사용** - NOT `gh pr comment`
3. **주관적 리뷰 auto-resolve 절대 금지**
4. gemini-code-assist도 AI이므로 **모든 리뷰를 맹목적으로 수정하지 말 것**
5. **핵심은 코드 반영/푸시/답글**이며 resolve는 정책상 허용될 때만 수행
6. **`claude-review`, `Vercel` 실패는 기본적으로 무시** (권한/외부 연동 이슈)하고 리뷰 처리 진행
7. **unresolved만 보면 안됨** - resolved thread의 신규 코멘트도 반드시 확인

---

Please use the pr-review-handler subagent to process reviews.
