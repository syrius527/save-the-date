# youtube-to-notes (YouTube/로컬 영상 → 학습 노트)

YouTube 영상이나 로컬 비디오 파일에서 슬라이드 캡처와 자막을 결합해 학습용 노트를 생성.

## When to use
- 강의 영상이나 발표 영상을 요약/정리해야 할 때
- YouTube URL을 학습 노트나 Markdown으로 바꾸고 싶을 때
- 로컬 강의 파일에서 슬라이드와 핵심 장면을 뽑아야 할 때
- 영상 내용을 복습 가능한 구조화 문서로 만들고 싶을 때

## When NOT to use
- 영상이 아닌 일반 문서나 웹페이지를 처리할 때
- 코드 편집이나 웹 검색이 목표일 때
- 단순 텍스트 요약만 필요하고 프레임 추출이 필요 없을 때

## Trigger Phrases
- "youtube"
- "영상 노트"
- "영상 정리"
- "강의 요약"
- "lecture notes"
- "extract slides"
- "local video to notes"

## Prerequisites
- `ffmpeg`, `ffprobe`
- Python + `yt-dlp`
- 선택: 더 좋은 슬라이드 감지를 위한 `GOOGLE_API_KEY`

## Workflow

```
입력(URL/로컬 파일) 확인 → 장면/슬라이드 구간 탐지 → 프레임 추출 → 자막/텍스트 결합 → Markdown + JSON 노트 생성
```

## 참고
- 상세 사용법은 `skills/youtube-to-notes/SKILL.md` 참고
- 번들 스크립트는 `skills/youtube-to-notes/scripts/extract.py`에 포함
