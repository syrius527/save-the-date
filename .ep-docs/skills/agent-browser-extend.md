# agent-browser-extend (agent-browser 강화 운영 스킬)

plugin-managed skill that standardizes safer, verification-heavy use of `agent-browser`.

## When to use
- Playwright 작성 전에 실제 플로우를 먼저 검증할 때
- before/after 스크린샷과 diff 증거가 필요할 때
- named session, auth vault, state save/load를 체계적으로 쓰고 싶을 때
- locator scouting, redirect/popup 확인이 필요한 웹 QA
- login/consent/popup/multi-step 플로우처럼 stale ref가 쉽게 발생하는 경우
- local file/PDF 확인이나 제한된 환경에서 안전 플래그가 필요한 경우

## When NOT to use
- 단순 API 테스트
- 브라우저 없이 끝나는 정적 파싱
- 아주 짧은 one-shot 브라우저 명령

## 강화 규칙
- `open -> wait -> snapshot -i` 순서로 preflight
- 중요한 플로우는 시작/결과 스크린샷 최소 2장
- 멀티스텝 작업은 `--session` 또는 `--session-name` 사용
- 페이지 전환/DOM 변화 후 ref 재수집
- 결과 검증이 목적이면 `diff snapshot` 또는 `diff screenshot` 사용
- 인증은 `auth save/login` 또는 `state save/load` 우선

## Practical guardrails
- selector scouting 결과에서 안정적인 locator 후보를 먼저 기록
- 큰 페이지는 `AGENT_BROWSER_MAX_OUTPUT`, 신뢰되지 않은 페이지는 `AGENT_BROWSER_CONTENT_BOUNDARIES` 고려
- 제한된 테스트는 `AGENT_BROWSER_ALLOWED_DOMAINS`로 도메인 allowlist 설정
- local file/PDF는 `--allow-file-access` 사용

## 대표 패턴

```bash
agent-browser --session preflight open https://example.com/login
agent-browser --session preflight wait --load networkidle
agent-browser --session preflight snapshot -i
agent-browser --session preflight screenshot preflight-login.png
```

## 참고
- 실제 실행 엔진은 `agent-browser` CLI
- 이 스킬은 운영 가드레일과 검증 습관을 보강하는 wrapper skill
