# pptx (PowerPoint 처리 스킬)

.pptx 프레젠테이션을 읽고, 수정하고, 새로 만들고, 시각적으로 QA하는 문서 스킬.

## When to use
- 슬라이드 덱을 읽거나 요약해야 할 때
- 기존 발표 자료를 수정하거나 템플릿에 맞춰 편집할 때
- 새 발표 자료를 처음부터 만들어야 할 때
- speaker notes, comments, layouts까지 다뤄야 할 때
- 시각 QA까지 포함한 presentation 작업일 때

## When NOT to use
- PDF/Word/Excel이 주된 산출물일 때
- 단순 텍스트 문서 작업일 때
- 브라우저 자동화만 필요한 경우

## Trigger Phrases
- "pptx"
- "slides"
- "deck"
- "presentation"
- "pitch deck"
- "speaker notes"

## 핵심 워크플로우
- 읽기: `python -m markitdown presentation.pptx`
- 시각 확인: `python scripts/thumbnail.py presentation.pptx`
- 편집: unpack → edit → clean → repack
- 새로 만들기: `pptxgenjs` 기반 생성

## Important QA
- boring slide 금지, 시각 요소 필수
- 첫 렌더를 신뢰하지 말고 이미지로 변환해 재검수
- placeholder, overflow, low contrast, misalignment를 반드시 확인
