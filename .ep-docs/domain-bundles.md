# 도메인 지식 번들 카탈로그

도메인 번들은 학습된 지식을 에이전트 컨텍스트에 자동 주입하는 시스템입니다.

## 활성 번들

| 번들 | 도메인 | 전역 소스 | 프로젝트 소스 |
|------|--------|----------|-------------|
| development-knowledge | 개발 | ~/.ep-memory/system/domain/development.md | .ep-memory/system/domain/development.md |
| marketing-knowledge | 마케팅 | ~/.ep-memory/system/domain/marketing.md | .ep-memory/system/domain/marketing.md |
| finance-knowledge | 재무 | ~/.ep-memory/system/domain/finance.md | .ep-memory/system/domain/finance.md |
| seo-knowledge | SEO | ~/.ep-memory/system/domain/seo.md | .ep-memory/system/domain/seo.md |
| design-knowledge | 디자인 | ~/.ep-memory/system/domain/design.md | .ep-memory/system/domain/design.md |
| branding-knowledge | 브랜딩 | ~/.ep-memory/system/domain/branding.md | .ep-memory/system/domain/branding.md |

## 설정

`ep-opencode.jsonc`에서 제어:

```jsonc
{
  "domainBundles": {
    "enabled": true,        // 전체 비활성화
    "disabled": ["finance-knowledge"]  // 개별 비활성화
  }
}
```

## 우선순위

1. **프로젝트 지식** (overlay) — 프로젝트별 예외, 맥락, 현재 결정
2. **전역 지식** (base) — 모든 프로젝트 공통 원칙

충돌 시 프로젝트 지식이 전역 지식을 override합니다.
