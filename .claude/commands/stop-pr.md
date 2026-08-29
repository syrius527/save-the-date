---
description: Unsubscribe from GitHub PR review events for a specific PR
argument-hint: <PR URL>
---

## Task

Unsubscribe this session from GitHub PR review notifications.

**PR**: $ARGUMENTS

If no PR URL is specified, detect from current branch using `gh pr view --json url -q .url`.

---

## Execution Steps

1. **Determine PR URL**: Use the provided URL or detect from current branch
2. **Get session ID**: Use the current session context
3. **Read control key** from `~/.opencode/secrets/ep-opencode-github-control-key.txt`
4. **Call Worker unsubscribe API** (primary):
   ```
   POST https://ep-github-webhook-relay.entropyparadox-dev.workers.dev/github/unsubscribe
   Headers: Content-Type: application/json, X-EP-KEY: <control-key>
   Body: { "sessionId": "<current-session-id>", "pullRequestUrl": "<pr-url>" }
   ```
5. **Also call daemon unsubscribe API** (local sync):
   ```
   POST http://localhost:3456/github/unsubscribe
   (same headers and body)
   ```
6. **Report** unsubscription status

---

## [!] CRITICAL

- This only removes the current session's subscription
- Other sessions subscribed to the same PR are not affected
