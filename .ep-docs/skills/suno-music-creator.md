# suno-music-creator (Suno 음악 생성 스킬)

agent-browser 기반 Suno.com 브라우저 자동화로 AI 음악을 생성. 사용자의 자연어 요청을 분석하여 Simple/Advanced 모드를 자동 선택하고, 프롬프트 입력 → 생성 대기 → MP3 다운로드 + 공유 URL 전달까지 전체 워크플로를 자동화.

## When to use
- Suno.com에서 AI 음악 생성이 필요할 때
- 사용자가 가사, 장르, 분위기, 스타일을 지정하여 노래를 만들고 싶을 때
- 인스트루멘탈, 비트, BGM, 징글 등 음악 트랙 생성
- 생성된 음악의 MP3 다운로드 또는 공유 URL이 필요할 때

## When NOT to use
- 음악 편집이 필요한 경우 (DAW 도구 사용)
- 가사만 작성하고 오디오 생성은 불필요할 때
- Suno 외 다른 플랫폼(Udio 등)에서 음악을 만들어야 할 때

## Trigger Phrases
- "Suno", "음악 만들어줘", "노래 만들어줘"
- "AI 음악", "노래 생성", "make me a song"
- "create a track", "generate music", "lo-fi", "beat"
- "BGM 만들어줘", "instrumental", "가사로 노래 만들어줘"

## Core Operating Model

2가지 모드 자동 선택:
1. **Simple Mode** — 모호한 설명, 가사 없음, 빠른 생성 시 사용
2. **Advanced Mode** — 가사 제공, 스타일 태그 지정, 제목 지정, instrumental 시 사용

## Critical Requirements
- 모든 `agent-browser` 명령에 `--cdp 9336` 필수
- CDP 없이 실행하면 인증 없는 브라우저가 열려 실패
- Google OAuth로 로그인된 전용 Chrome 프로필 사용
- URL 변경/모달/DOM 변경 후 반드시 re-snapshot

## 결과물
- MP3 다운로드 파일 (로컬 경로 제공)
- Suno 공유 URL (https://suno.com/song/...)

## 참고
- 상세 실행 플레이북은 `~/.agents/skills/suno-music-creator/SKILL.md` 참고
- 테스트 케이스는 `~/.agents/skills/suno-music-creator/evals/evals.json` 참고
- Chrome 시작: `~/.ep-jarvis/browser-profiles/start-suno-chrome.sh`
