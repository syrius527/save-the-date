# agent-browser (브라우저 자동화 스킬)

Vercel Labs의 외부 skill을 설치해서 사용하는 브라우저 자동화 CLI.

## When to use
- 실제 웹페이지 탐색/테스트
- 스크린샷 캡처
- 폼 입력/로그인 플로우 점검
- 웹 데이터 추출
- Playwright 작성 전 실제 동작 확인
- named session, auth/state 재사용, 다운로드, diff 검증이 필요한 브라우저 작업

## When NOT to use
- API 호출만 필요한 경우
- 정적 HTML만 읽으면 되는 경우
- 브라우저 세션 없이 끝나는 단순 작업

## Trigger Phrases
- "go to"
- "click on"
- "fill form"
- "take a screenshot"
- "scrape"
- "log into"
- "open a website"
- "test this web app"
- "download file"
- "automate browser actions"

## 핵심 워크플로우

```bash
agent-browser open https://example.com
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot after.png
agent-browser close
```

## 핵심 명령
- `open`: URL로 이동
- `snapshot -i`: 상호작용 가능한 요소 ref 수집
- `click`, `fill`, `select`: 요소 상호작용
- `wait`: URL/로딩/요소 대기
- `screenshot`, `diff screenshot`: 시각 검증
- `auth`, `state`: 인증/세션 재사용

## Practical guardrails
- 페이지 전환이나 DOM 변화 후에는 ref를 다시 수집
- 느린 페이지는 고정 sleep보다 `wait --load networkidle`, `wait --url`, `wait <selector>` 우선
- 큰 페이지는 `AGENT_BROWSER_MAX_OUTPUT`로 출력량 제한
- 신뢰되지 않은 페이지는 `AGENT_BROWSER_CONTENT_BOUNDARIES` 또는 `AGENT_BROWSER_ALLOWED_DOMAINS` 고려
- 로컬 PDF/HTML은 `--allow-file-access`로 확인 가능

## 설치 소스
- 외부 GitHub skill: `vercel-labs/agent-browser`
- 플러그인은 `npx skills add vercel-labs/agent-browser --skill agent-browser -y` 형태로 설치
