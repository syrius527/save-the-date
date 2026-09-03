# docx (Word 문서 처리 스킬)

Word 문서(.docx)를 생성, 편집, 분석하고 tracked changes나 이미지/표/서식까지 다루는 문서 스킬.

## When to use
- Word 문서를 새로 작성해야 할 때
- 기존 .docx 내용을 읽고 재구성하거나 수정해야 할 때
- 표지, TOC, 헤더/푸터, 페이지 번호 같은 전문 서식이 필요할 때
- 이미지 교체, comments, tracked changes를 다뤄야 할 때
- legacy .doc 파일을 .docx로 변환해야 할 때

## When NOT to use
- PDF/스프레드시트가 주 산출물일 때
- Google Docs/API 통합이 핵심일 때
- 일반 코드 작업만 할 때

## Trigger Phrases
- "docx"
- "Word document"
- "word doc"
- "report"
- "memo"
- "letter"
- "template"

## 핵심 워크플로우
- 읽기: `pandoc --track-changes=all`
- 기존 문서 편집: unpack XML → edit → repack
- 새 문서 생성: `docx-js`
- tracked changes 정리: `python scripts/accept_changes.py`

## Important QA
- `.doc`는 먼저 `.docx`로 변환
- 페이지 크기/heading/table/list 규칙을 명시적으로 설정
- tracked changes와 서식 손상 여부를 검증
