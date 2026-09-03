# vercel-react-best-practices (React/Next.js 최적화 스킬)

Vercel Engineering 권장 React/Next.js 성능 최적화 가이드라인.

## When to use
- React/Next.js 코드 작성 시
- 코드 리뷰 시 성능 패턴 확인
- 리팩토링 시 최적화 적용
- 번들 크기 최적화 필요 시
- 성능 병목 해결 시

## When NOT to use
- React/Next.js가 아닌 프로젝트
- 성능보다 기능 구현이 우선일 때
- 프로토타입/MVP 단계

## Trigger Phrases
- "optimize"
- "performance"
- "React component"
- "Next.js page"
- "bundle size"
- "loading speed"
- "Core Web Vitals"

## 핵심 패턴

### Server Components (기본값)
- 데이터 fetching 컴포넌트에 적용
- 번들 크기 감소
- 서버에서 렌더링, 클라이언트로 HTML 전송

### Client Components ('use client')
- 상호작용이 필요한 컴포넌트에만 사용
- useState, useEffect 등 훅 사용 시
- 이벤트 핸들러 필요 시

### Suspense Boundaries
- 비동기 컴포넌트 감싸기
- 점진적 로딩 구현
- 로딩 UI 제공

### Dynamic Imports
- 큰 컴포넌트/라이브러리에 적용
- 코드 스플리팅
- 초기 번들 크기 감소

### Image Optimization
- next/image 사용
- LCP (Largest Contentful Paint) 개선
- 자동 크기 조절, lazy loading

### Route Prefetching
- next/link 사용
- 네비게이션 속도 향상
- 자동 프리페치

## Workflow

```
/vercel-react-best-practices 로드 → 코드 분석 → 패턴 적용 → 성능 검증
```

## 패턴 적용 예시

```tsx
// [FAIL] Before: 모든 것이 클라이언트 컴포넌트
'use client'
import { useState } from 'react'
import HeavyChart from './HeavyChart'

export default function Dashboard() {
  const [data, setData] = useState(null)
  // ...
}

// [PASS] After: 서버/클라이언트 분리 + 동적 임포트
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />
})

export default async function Dashboard() {
  const data = await fetchData() // 서버에서 실행
  return (
    <Suspense fallback={<Loading />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}
```
