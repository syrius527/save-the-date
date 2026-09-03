# xlsx (스프레드시트 처리 스킬)

Excel/스프레드시트 파일을 읽고, 정리하고, 수식과 포맷을 포함해 생성/수정하는 문서 스킬.

## When to use
- `.xlsx`, `.xlsm`, `.csv`, `.tsv` 파일을 읽거나 수정해야 할 때
- 엉킨 표 데이터를 정리해 proper spreadsheet로 만들어야 할 때
- 수식, 차트, 포맷, 새 시트를 포함한 workbook 작업일 때
- financial model이나 계산 시트를 만들어야 할 때
- 최종 산출물이 spreadsheet 파일이어야 할 때

## When NOT to use
- Word/PDF/HTML이 주 산출물일 때
- DB 파이프라인이나 Google Sheets API 통합이 핵심일 때
- 탭형 데이터가 있어도 결과물이 spreadsheet가 아닐 때

## Trigger Phrases
- "xlsx"
- "spreadsheet"
- "excel"
- "csv"
- "tsv"
- "financial model"
- "formula"

## 핵심 규칙
- 기존 템플릿이 있으면 형식/관례를 그대로 보존
- 계산값을 Python에서 하드코딩하지 말고 Excel formula 사용
- 최종 파일은 formula error 0개 상태로 전달
- formula 사용 시 `python scripts/recalc.py output.xlsx`로 재계산 필수

## Workflow

```
도구 선택(pandas/openpyxl) → 생성/수정 → 수식/포맷 적용 → recalc 실행 → 오류 0개 검증
```
