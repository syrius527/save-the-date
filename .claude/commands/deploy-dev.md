---
description: Deploy changes to dev branch using git-deploy-workflow agent
argument-hint: [optional commit message]
---

**[!][!][!] SINGLE AGENT EXECUTION - ABSOLUTE REQUIREMENT [!][!][!]**

**[WARN] CRITICAL: You MUST spawn ONLY ONE git-deploy-workflow subagent**

- [FAIL] NEVER spawn multiple subagents in parallel
- [FAIL] NEVER use multiple Task tool calls for git operations
- [PASS] ALWAYS use exactly ONE Task tool call with git-deploy-workflow

**WHY THIS IS CRITICAL:**
Multiple subagents executing git operations simultaneously will:
1. Race condition on `git checkout` / `git switch` commands
2. **PERMANENTLY DELETE untracked files** when branches change
3. Corrupt working directory state
4. Cause unpredictable merge conflicts

**ENFORCEMENT:** If you are tempted to spawn multiple agents, STOP. This workflow requires sequential, single-agent execution.

---

**[!] CRITICAL GIT SAFETY RULES [!]**
**PERMANENTLY BANNED COMMANDS - ZERO TOLERANCE:**

- [FAIL] `git reset --hard` (PERMANENTLY DELETES uncommitted changes)
- [FAIL] `git clean -fd` (PERMANENTLY DELETES untracked files)
- [FAIL] `git push --force` (Can destroy remote history)
- [PASS] **ALWAYS use `git stash` instead of `git reset --hard`**
- [PASS] **ALWAYS create backup branch before destructive operations**

**[DONT] CRITICAL POLICY REMINDER [DONT]**
Before executing this command, the git-deploy-workflow agent MUST:

1. [PASS] Create atomic commits (ONE purpose per commit)
2. [PASS] Use Pull Request workflow (NEVER merge directly)
3. [PASS] **NEVER add AI signatures or any automation hints to commits/PRs**
4. [PASS] **NEVER use destructive Git commands without backup**
5. [PASS] **[!] NEVER MERGE PR - PR 생성만, 머지는 사용자가 직접**

**[!] ZERO TOLERANCE FOR AI SIGNATURES [!]**
The following content is **PERMANENTLY BANNED** from all commits and PRs:

- [FAIL] "[AI] Generated with [Claude Code](...)"
- [FAIL] "Co-Authored-By: Claude <...>"
- [FAIL] ANY AI-related emojis, links, or references
- [FAIL] ANY mention of automation tools

**Violation of this policy = IMMEDIATE FAILURE**

---

[>>] **ULTRATHINK MODE**

Please **ultrathink** this deployment: allocate your maximum internal reasoning budget, analyze all changes carefully, verify atomic commit requirements, and ensure NO AI signatures appear anywhere in commits or PRs. Deployment accuracy and policy compliance are CRITICAL.

---

Please use the git-deploy-workflow subagent to analyze my changes and deploy them to the dev branch.

**IMPORTANT INSTRUCTIONS FOR SUBAGENT:**

1. Read the ENTIRE git-deploy-workflow.md document before starting
2. Pay SPECIAL ATTENTION to the "ABSOLUTE BAN ON AI SIGNATURES" section
3. Triple-check EVERY commit message and PR description for banned content
4. Run final verification with `git log --grep="Claude"` before reporting success
5. If AI signatures are found at ANY point: STOP, amend commits, force push
6. **[!] PR 생성 후 STOP - 머지하지 말 것:**
   - [FAIL] NEVER run `gh pr merge` - 절대 금지
   - [PASS] PR URL만 사용자에게 보고
   - [PASS] 사용자가 직접 리뷰하고 머지할 것임

$ARGUMENTS
