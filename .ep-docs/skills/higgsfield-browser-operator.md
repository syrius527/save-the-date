# higgsfield-browser-operator (Higgsfield 브라우저 오퍼레이터)

전용 인증 브라우저 프로필을 통해 Higgsfield를 운영. 학습된 경로/셀렉터/워크플로를 재사용하고, 메모리가 부족하거나 stale하면 evidence-driven discovery로 폴백.

## When to use
- Higgsfield에서 이미지/비디오 생성, 리믹스, 시네마틱 샷, 페이스 스왑, 캐릭터 트레이닝, 광고, 템플릿 등의 작업이 필요할 때
- Higgsfield의 정확한 라우트나 기능을 모를 때 브라우저 탐색이 필요할 때
- 시간이 지나면서 개선되는 persistent Higgsfield operator가 필요할 때

## When NOT to use
- Higgsfield와 무관한 작업
- 브라우저 플로우와 무관한 순수 API 작업
- 일반 AI 아트 도구에 대한 조언만 필요할 때 (Higgsfield 조작 불필요)

## Trigger Phrases
- "Higgsfield"
- "cinematic AI generation"
- "face swap"
- "character generation"
- "ads", "templates"
- "camera controls"

## Core Operating Model

2가지 경로:
1. **Fast path** — route registry → page signature validation → selector strategy → known workflow
2. **Discovery path** — browser reconnaissance → branch narrowing → re-observe → candidate memory update

항상 fast path 우선 시도. 메모리를 맹목적으로 신뢰하지 않음.

## Critical Requirements
- 모든 `agent-browser` 명령에 `--profile ~/.ep-jarvis/browser-profiles/higgsfield-main` 필수
- 프로필 없이 실행하면 인증 없는 브라우저가 열려 `blocked_auth` 실패
- 로그인 자동화 시도 금지 — 사용자가 수동 로그인, 프로필이 세션 보존
- URL 변경/모달/DOM 변경 후 반드시 re-snapshot

## Learned Memory Model
- Session memory → Evergreen memory → Evidence artifacts 3계층
- route registry, page signatures, selector registry, workflow memory, heuristics 참조
- references/ 디렉터리에 JSON 파일로 관리

## Safety Guardrails
- 유료 생성/내보내기, 파괴적 액션, 게시/삭제/MFA 등은 확인 필요
- billing, publish, delete, auth/MFA, 되돌릴 수 없는 submit은 no-heal 구역

## 참고
- 상세 실행 플레이북은 `~/.opencode/skills/higgsfield-browser-operator/SKILL.md` 참고
- 레퍼런스 데이터는 `~/.opencode/skills/higgsfield-browser-operator/references/`에 저장
