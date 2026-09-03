# perplexity-research (Perplexity AI 웹 리서치)

Perplexity API를 사용해 최신 웹 정보를 조사하고, 출처가 포함된 구조화된 결과를 반환.

## When to use
- 팩트체크가 필요할 때
- 최신 뉴스/트렌드/시장 정보를 조사할 때
- 공식 문서나 외부 자료를 대조 확인할 때
- Perplexity 또는 Sonar API 사용법을 찾아야 할 때
- 한국어 웹 리서치가 필요할 때

## When NOT to use
- 코드 편집이나 파일 수정이 목표일 때
- 외부 웹 정보 없이 repo 내부 정보만으로 해결 가능한 작업
- 단순 의견 요청처럼 출처 검증이 중요하지 않은 작업

## Trigger Phrases
- "리서치"
- "조사"
- "팩트체크"
- "최신 정보"
- "Perplexity"
- "web search"
- "Sonar API"

## Prerequisites
- `PERPLEXITY_API_KEY` 환경변수
- Node.js / `npx tsx` 또는 `curl`

## Workflow

```
질문 유형 분류 → 적절한 API 선택(Search / Agent / Sonar) → 웹 조사 실행 → 출처 검증 → 구조화된 결과 반환
```

## 참고
- 상세 구현/명령 예시는 `skills/perplexity-research/SKILL.md` 참고
- 설치는 플러그인이 `skills/perplexity-research/` 디렉터리를 자동 배포
