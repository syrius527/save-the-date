---
description: Subscribe to GitHub PR review events for real-time notifications via WebSocket
argument-hint: <PR URL>
---

## Task

Subscribe this session to receive real-time GitHub PR review notifications.

**PR**: $ARGUMENTS

If no PR URL is specified, detect from current branch using `gh pr view --json url -q .url`.

---

## How It Works

This command registers the current session to receive webhook-driven notifications when:
- A new review is submitted on the PR
- A review comment is added
- A review thread is resolved/unresolved

When a review event arrives, a SYSTEM REMINDER will be automatically injected with:
- Review author, action, and excerpt
- Suggested `/handle-reviews` command to process feedback

---

## Execution Steps

1. **Determine PR URL**: Use the provided URL or detect from current branch
2. **Get session ID**: Use the current session context
3. **Read control key** from `~/.opencode/secrets/ep-opencode-github-control-key.txt`
4. **Call Worker subscribe API** (primary):
   ```
   POST https://ep-github-webhook-relay.entropyparadox-dev.workers.dev/github/subscribe
   Headers: Content-Type: application/json, X-EP-KEY: <control-key>
   Body: { "sessionId": "<current-session-id>", "pullRequestUrl": "<pr-url>" }
   ```
5. **Also call daemon subscribe API** (local sync):
   ```
   POST http://localhost:3456/github/subscribe
   (same headers and body)
   ```
6. **Report** subscription status

---

## [!] CRITICAL

- The GitHub webhook must be configured for the repository
- Worker URL: `https://ep-github-webhook-relay.entropyparadox-dev.workers.dev`
- Use `/stop-pr` to unsubscribe when done
