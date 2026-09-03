# instagram-influencer-finder (Instagram 인플루언서 발굴 스킬)

HikerAPI를 사용해 Instagram 인플루언서를 발굴·데이터 수집·AI 기반 브랜드핏 판단. 스크립트가 데이터를 수집하고, AI 에이전트가 측션·이미지·메트릭·파트너십 이력을 직접 검토해 브랜드핏을 판단.

## When to use
- 시딩 칠퍼인, 브랜드 파트너십, 스폰서드 콘텐츠용 인플루언서 발굴
- 한국 븤티/패션/라이프스타일 브랜드 중심의 인플루언서 검색
- 경쟁사 팔로워 분석, 참여율 계산, 해시태그 기반 크리에이터 발굴
- 인플루언서 리스트 작성, 비주얼 톤 매칭

## When NOT to use
- 콘텐츠 게시, DM 관리 등 Instagram 쓰기 작업 (이 스킬은 읽기 전용)
- Instagram 외 플랫폼 (유튜브, 틱톡 등)

## Trigger Phrases
- "인플루언서 찾기"
- "시딩"
- "브랜드핏"
- "해시태그 탐색"
- "참여율 분석"
- "콘텐츠 크리에이터 발굴"
- "피드 분석"
- "비주얼 톤 매칭"

## Prerequisites
- `HIKERAPI_ACCESS_KEY` 환경변수
- Python 3.10+ + `httpx`

## Discovery Methods
1. **Hashtag Mining** — 관련 해시태그의 탑 포스트 저자 추출
2. **Account Search** — 키워드 기반 계정 검색
3. **Competitor Follower Mining** — 경쟁 브랜드 팔로워 중 인플루언서 필터링
4. **Similar Profiles** — 알려진 인플루언서와 유사한 계정 추천
5. **Location-Based** — 특정 위치 기반 인플루언서 발굴

## Workflow

```
Phase 1: 후보 발굴 (discover.py — 5가지 방법) → Phase 2: 데이터 수집 (analyze.py) → Phase 3: AI 에이전트가 브랜드핏 판단 (0-100 점수 + 근거)
```

## Brand Fit Assessment
- 스크립트가 데이터를 수집하고, AI 에이전트가 직접 판단 (rule-based scoring 아님)
- 콘텐츠 관련성, 오디언스 정렬, 참여 품질, 브랜드 안전성, 비주얼 브랜드핏, 파트너십 이력 6개 차원 평가
- 60+ 접촉 가치, 75+ 강한 매칭, 85+ 최우선

## Follower Tiers
| Tier | Range | 한국어 |
|------|-------|--------|
| nano | 1K–5K | 나노 |
| micro | 5K–30K | 마이크로 |
| mid | 30K–100K | 미드 |
| macro | 100K–500K | 매크로 |
| mega | 500K+ | 메가 |

## 참고
- 상세 스크립트/API 레퍼런스는 `~/.opencode/skills/instagram-influencer-finder/SKILL.md` 참고
- 스크립트: `~/.opencode/skills/instagram-influencer-finder/scripts/`
- 레퍼런스: `~/.opencode/skills/instagram-influencer-finder/references/`
