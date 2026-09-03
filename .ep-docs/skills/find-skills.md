# find-skills (스킬 검색/설치 도우미)

사용자가 필요한 기능을 스킬로 확장할 수 있도록 지원.

## When to use
- "how do I do X" 질문
- "find a skill for" 요청
- "is there a skill that can" 질문
- 기존 도구로 해결 안 되는 기능 필요 시
- 새로운 능력 확장 필요 시

## When NOT to use
- 이미 설치된 스킬로 해결 가능한 경우
- 스킬 없이 직접 구현 가능한 경우
- 기본 도구로 충분한 경우

## Trigger Phrases
- "how do I"
- "find a skill"
- "is there a skill"
- "install skill"
- "extend capabilities"
- "can you do X"

## 기능

### 스킬 검색
키워드로 사용 가능한 스킬 찾기.

### 스킬 설치
```bash
npx skills add {repo} --skill {skill-name} -y
```

### 설치된 스킬 확인
- 프로젝트 레벨: `.opencode/skills/{skill-name}/SKILL.md`
- 전역 레벨: `~/.config/opencode/skills/{skill-name}/`

## Workflow

```
사용자 요청 분석 → 스킬 검색 → 추천 → 설치 안내
```

## 스킬 소스
- [skills.sh](https://skills.sh/) - 스킬 디렉토리
- [agentskills.io](https://agentskills.io/) - 공식 표준
- GitHub 저장소에서 직접 설치 가능
