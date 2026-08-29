---
description: Create a Pull Request from current branch to specified target branch
argument-hint: <target-branch> [optional description]
---

**[!] SINGLE AGENT EXECUTION - ABSOLUTE REQUIREMENT [!]**

**[WARN] CRITICAL: You MUST spawn ONLY ONE create-pr subagent**

- [FAIL] NEVER spawn multiple subagents in parallel
- [PASS] ALWAYS use exactly ONE Task tool call with create-pr

---

## Task

Create a Pull Request from the **current branch** to the **target branch** specified below.

**Target Branch**: $ARGUMENTS

If no target branch is specified, ask the user which branch to target.

---

## Instructions for Subagent

1. **Analyze commits** between current branch and target branch
2. **Generate PR title** from branch name + summary
3. **Generate PR body** using PR template if exists
4. **Create PR** via `gh pr create`
5. **Report PR URL** - do NOT merge

---

## [!] CRITICAL RULES

1. **NEVER merge the PR** - Only create it
2. **NEVER add AI signatures** - No Claude/AI mentions anywhere
3. **Push branch first** if not already pushed

---

## [!] ZERO TOLERANCE FOR AI SIGNATURES

The following content is **PERMANENTLY BANNED**:

- [FAIL] "[AI] Generated with [Claude Code](...)"
- [FAIL] "Co-Authored-By: Claude"
- [FAIL] ANY AI-related references

**Violation = IMMEDIATE FAILURE**

---

Please use the create-pr subagent to create a Pull Request.
