# pdf (PDF 처리 스킬)

PDF 파일을 읽고, 추출하고, 합치고, 분리하고, 생성하고, 폼 작성/OCR까지 처리하는 범용 문서 스킬.

## When to use
- PDF에서 텍스트나 표를 추출해야 할 때
- 여러 PDF를 합치거나 분리해야 할 때
- 페이지 회전, 워터마크, 암호 해제/설정을 해야 할 때
- 스캔 PDF를 OCR해서 searchable하게 만들어야 할 때
- PDF 폼을 채우거나 새 PDF를 생성해야 할 때

## When NOT to use
- Word/PowerPoint/Excel이 주된 입력 또는 출력일 때
- 단순 이미지 작업만 필요할 때
- PDF 없이 일반 코드 작업만 할 때

## Trigger Phrases
- "pdf"
- "extract text from pdf"
- "extract tables"
- "merge pdf"
- "split pdf"
- "fill pdf form"
- "ocr scanned pdf"

## 핵심 도구
- `pypdf`: merge, split, rotate, metadata
- `pdfplumber`: text/table extraction
- `reportlab`: 새 PDF 생성
- `pdftotext`, `qpdf`: CLI 처리

## Workflow

```
PDF 작업 유형 파악 → 적절한 라이브러리/CLI 선택 → 처리 실행 → 출력 파일/추출 결과 검증
```
